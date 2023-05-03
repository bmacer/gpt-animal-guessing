import { ConversationChain } from "langchain/chains";
import { BaseChatMemory, BufferMemoryInput } from "langchain/memory";
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
  SystemChatMessage,
  InputValues,
  AIChatMessage,
} from "langchain/schema";
import { Collection, MongoClient, MongoClientOptions } from "mongodb";
import { getBufferString } from "langchain/memory";
import { NextApiRequest, NextApiResponse } from "next";
import { OutputValues } from "langchain/dist/memory/base";

async function getAllDocumentsByUserName(
  client: MongoClient,
  userName: string
): Promise<any[]> {
  try {
    await client.connect();
    const database = client.db("myDatabase");
    const collection = database.collection("conversations");
    const documents = await collection.find({ user: userName }).toArray();
    return documents;
  } catch (error) {
    console.error("Error occurred while fetching documents", error);
    throw error;
  }
}

async function deleteAllDocuments(client: MongoClient): Promise<void> {
  try {
    await client.connect();
    const database = client.db("myDatabase");
    const collection = database.collection("conversations");
    const documents = await collection.deleteMany({});
    console.log(`deleted ${documents.deletedCount}`);
  } catch (error) {
    console.error("Error occurred while fetching documents", error);
    throw error;
  }
}

type MongoDocument = {
  user: string;
  timestamp: number;
  messageType: "human" | "ai";
  message: string;
};

// const uri = `mongodb+srv://bobbysox322:${process.env.MONGO_DB_PASSWORD}@guessanimalcluster.pqmjp0i.mongodb.net/?retryWrites=true&w=majority`;
const MONGO_URL = `mongodb+srv://bobbysox322:${process.env.MONGO_DB_PASSWORD}@guessanimalcluster.pqmjp0i.mongodb.net`;

export class MongoChatMemory
  extends BaseChatMemory
  implements BufferMemoryInput
{
  memoryKey: string;
  humanPrefix: string;
  aiPrefix: string;
  returnMessages: boolean;
  client: MongoClient;
  user: string;
  history: MongoDocument[];

  constructor(user: string) {
    super();
    this.humanPrefix = "Human";
    this.aiPrefix = "AI";
    this.returnMessages = true;
    this.client = {} as MongoClient; // Assign a default value
    this.user = user;
    this.history = [];
    this.memoryKey = "history";
    this.chatHistory = new ChatMessageHistory([]);

    // Make the constructor async
  }

  async pullMemoryFromMongo() {
    try {
      this.client = new MongoClient(MONGO_URL); // Assign the actual MongoClient instance
      await this.client.connect(); // Connect to the MongoDB client

      const documents = await getAllDocumentsByUserName(this.client, this.user);
      this.history = documents;
      this.chatHistory = new ChatMessageHistory(
        documents.map((doc) => {
          if (doc.messageType === "human") {
            return new HumanChatMessage(doc.message);
          } else {
            return new AIChatMessage(doc.message);
          }
        })
      );
      console.log("\n\n\n\n\nthis.chatHistory");
      console.log(this.chatHistory);
      await this.client.close();
    } catch (error) {
      console.error("Error occurred while retrieving documents:", error);
    } finally {
      await this.client.close();
    }
  }
  get memoryKeys(): string[] {
    return [];
  }

  async loadMemoryVariables(_values: any) {
    console.log("Loading memory variables...");
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
    try {
      await this.client.connect();
      const database = this.client.db("myDatabase");
      const collection = database.collection("conversations");
      const humanDoc: MongoDocument = {
        user: this.user,
        timestamp: new Date().getTime(),
        messageType: "human",
        message: inputValues.input,
      };
      this.history.push(humanDoc);

      const aiDoc: MongoDocument = {
        user: this.user,
        timestamp: new Date().getTime(),
        messageType: "ai",
        message: outputValues.response,
      };
      this.history.push(aiDoc);
      const result = await collection.insertMany([humanDoc, aiDoc]);
      await this.client.close();
      console.log(`${result.insertedCount} documents inserted`);
    } catch (err) {
      console.error(`Error inserting document: ${err}`);
    } finally {
      await this.client.close();
    }
  }

  async disconnect(): Promise<void> {
    console.log("Disconnecting...");
    this.client.close();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ r: string; fullHistory?: MongoDocument[] }>
) {
  console.log("Beginning handler...");
  const { user, message } = req.body;
  if (message === "delete") {
    deleteAllDocuments(new MongoClient(MONGO_URL));
    res.status(200).json({ r: "deletedeverything" });
    return;
  }
  let mongoMemory = await new MongoChatMemory(user);
  await mongoMemory.pullMemoryFromMongo();

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are the facilitator of an animal-guessing game.  You will take 3 guesses, one at a time, giving a clue \
       after each incorrect guess.  After 3 incorrect guesses, you reveal the animal you ranomly chose."
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
  });

  const c = new ConversationChain({
    memory: mongoMemory,
    prompt: chatPrompt,
    llm: chat,
  });

  // c.memory = mongoMemory;
  console.log("\n\n\n\n\nc");
  console.log(c);

  console.log("\n\n\n\n\nmongoMemor");
  console.log(mongoMemory);

  const r3 = await c.call({
    input: message,
  });
  console.log("message", message);
  console.log("r3", r3);
  res.status(200).json({ r: r3.response, fullHistory: mongoMemory.history });

  // c.memory?.saveContext({ input: message }, { output: r3.response });
}
