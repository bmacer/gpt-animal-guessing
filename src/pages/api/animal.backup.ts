import { ConversationChain } from "langchain/chains";
import {
  BaseChatMemory,
  BaseMemory,
  BufferMemory,
  BufferMemoryInput,
} from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { ChatMessageHistory } from "langchain/memory";
import {
  HumanChatMessage,
  AIChatMessage,
  InputValues,
  SystemChatMessage,
} from "langchain/schema";
import { FindOptions, MongoClient } from "mongodb";

const uri = `mongodb+srv://bobbysox322:${process.env.MONGO_DB_PASSWORD}@guessanimalcluster.pqmjp0i.mongodb.net/?retryWrites=true&w=majority`;

import { MemoryVariables, OutputValues } from "langchain/dist/memory/base";
import { NextApiRequest, NextApiResponse } from "next";

import { getBufferString } from "langchain/memory";

// export declare class BufferMemory extends BaseChatMemory implements BufferMemoryInput {

/*
export declare class BufferMemory extends BaseChatMemory implements BufferMemoryInput {
    humanPrefix: string;
    aiPrefix: string;
    memoryKey: string;
    constructor(fields?: BufferMemoryInput);
    get memoryKeys(): string[];
    loadMemoryVariables(_values: InputValues): Promise<MemoryVariables>;
}
export declare abstract class BaseChatMemory extends BaseMemory {
    chatHistory: BaseChatMessageHistory;
    returnMessages: boolean;
    inputKey?: string;
    outputKey?: string;
    constructor(fields?: BaseChatMemoryInput);
    saveContext(inputValues: InputValues, outputValues: OutputValues): Promise<void>;
    clear(): Promise<void>;
}
export declare abstract class BaseMemory {
    abstract get memoryKeys(): string[];
    abstract loadMemoryVariables(values: InputValues): Promise<MemoryVariables>;
    abstract saveContext(inputValues: InputValues, outputValues: OutputValues): Promise<void>;
}
export interface BufferMemoryInput extends BaseChatMemoryInput {
    humanPrefix?: string;
    aiPrefix?: string;
    memoryKey?: string;
}
*/
export class MongoChatMemory
  extends BaseChatMemory
  implements BufferMemoryInput
{
  // private client: MongoClient;
  // private collection: any;
  // uuid: string;
  // result: any;
  // memoryKeys: string[];
  memoryKey: string;
  humanPrefix: string;
  aiPrefix: string;
  returnMessages: boolean;
  // chatHistory: ChatMessageHistory;
  client: MongoClient;

  constructor(
    url: string,
    dbName: string,
    collectionName: string,
    uuid: string
  ) {
    super();
    this.humanPrefix = "Human";
    this.aiPrefix = "AI";
    this.returnMessages = true;
    // this.uuid = uuid;
    this.client = new MongoClient(url);
    // this.connect();
    // this.result = this.client
    //   .db(dbName)
    //   .collection(collectionName)
    //   .findOne({ uuid: this.uuid });
    this.memoryKey = "history";
    // this.memoryKeys = [];
    this.chatHistory = new ChatMessageHistory([
      new SystemChatMessage("Your name is Bob.  Tell everyone your name"),
      // new MessagesPlaceholder("history"),
      new HumanChatMessage("My name is Andy"),
      new HumanChatMessage("I'm 33 years old."),
    ]);

    /*
const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "history",
    chatHistory: new ChatMessageHistory([
      new SystemChatMessage("Your name is Bob.  Tell everyone your name"),
      // new MessagesPlaceholder("history"),
      new HumanChatMessage("My name is Andy"),
      new HumanChatMessage("I'm 33 years old."),
    ]),
  });

    */
    //     chatHistory: ChatMessageHistory { messages: [] },
    // returnMessages: true,
    // inputKey: undefined,
    // outputKey: undefined,
    // humanPrefix: 'Human',
    // aiPrefix: 'AI',
  }

  get memoryKeys(): string[] {
    return [];
  }

  async loadMemoryVariables(_values: any) {
    const messages = await this.chatHistory.getMessages();
    if (this.returnMessages) {
      const result = {
        [this.memoryKey]: messages,
      };
      return result;
    }
    const result = {
      [this.memoryKey]: getBufferString(messages),
    };
    return result;
  }

  async saveContext(
    inputValues: InputValues,
    outputValues: OutputValues
  ): Promise<void> {
    
    console.log("hello!\n\n");
    console.log(inputValues);
    console.log(outputValues);
    // await this.collection.insertOne({ inputValues, outputValues });
  }

  // async connect(): Promise<void> {
  //   await this.client.connect();
  //   // await this.client.connect();
  // }

  async disconnect(): Promise<void> {
    // await this.client.close();
  }
}

async function insert(memory: BaseMemory) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbName = "myDatabase";
    const collectionName = "history";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const query = { memory, timestamp: new Date() };
    const insertOneResult = await collection.insertOne(query);
    console.log(
      `${insertOneResult.acknowledged} document successfully inserted.\n`
    );
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new document: ${err}\n`
    );
  } finally {
    client.close();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ r: string }>
) {
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  let mongoMemory = new MongoChatMemory(
    uri,
    "myDatabase",
    "history",
    "brandon"
  );
  console.log("mongoMemory");
  console.log(mongoMemory);

  // const memory = new BufferMemory({
  //   returnMessages: true,
  //   memoryKey: "history",
  //   chatHistory: new ChatMessageHistory([
  //     new SystemChatMessage("Your name is Bob.  Tell everyone your name"),
  //     // new MessagesPlaceholder("history"),
  //     new HumanChatMessage("My name is Andy"),
  //     new HumanChatMessage("I'm 33 years old."),
  //   ]),
  // });

  // console.log("memory");
  // console.log(memory);

  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
  });

  const c = new ConversationChain({
    memory: mongoMemory,
    // memory: memory,
    prompt: chatPrompt,
    llm: chat,
  });

  // const pastMessages = [
  //   new HumanChatMessage("My name's Jonas"),
  //   new AIChatMessage("Nice to meet you, Jonas!"),
  // ];

  // const memory = new BufferMemory({
  //   chatHistory: new ChatMessageHistory(pastMessages),
  // });

  // let newMemory = new BufferMemory({
  //   returnMessages: true,
  //   memoryKey: "history",
  // });
  // console.log("newMemory");
  // console.log(newMemory);
  // let mem = new BufferMemory({ returnMessages: true, memoryKey: "history" });
  // console.log("mem");
  // console.log(mem);
  // const chain = new ConversationChain({
  //   memory: mongoMemory,
  //   // memory: newMemory,
  //   prompt: chatPrompt,
  //   llm: chat,
  // });

  // console.log(ch)

  // chain.memory && insert(chain.memory);
  // memory.saveContext(
  //   { input: "hi im jonas in" },
  //   { response: response.response }
  // );

  // const chain2 = new ConversationChain({
  //   memory: chain.memory,
  //   prompt: chatPrompt,
  //   llm: chat,
  // });

  const r3 = await c.call({
    input: "What is my name?",
  });
  console.log("r3");
  console.log(r3);
  // response.memory.chatHistory.addUserMessage("hello i am brandon");
  // memory.chatHistory.addUserMessage("i am brandon");
}
