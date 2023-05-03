import { BaseChatMemory, BufferMemoryInput } from "langchain/memory";
import { ChatMessageHistory } from "langchain/memory";
import { HumanChatMessage, InputValues, AIChatMessage } from "langchain/schema";
import { MongoClient } from "mongodb";
import { getBufferString } from "langchain/memory";
import { OutputValues } from "langchain/dist/memory/base";
import { MONGO_URL } from "./CONST";
import { MongoDocument } from "./mongo-document.type";
import { getAllDocumentsByUserid } from "./util";

export class MongoChatMemory
  extends BaseChatMemory
  implements BufferMemoryInput
{
  memoryKey: string;
  humanPrefix: string;
  aiPrefix: string;
  returnMessages: boolean;
  client: MongoClient;
  userid: string;
  history: MongoDocument[];

  constructor(user: string, userid: string) {
    super();
    this.humanPrefix = "Human";
    this.aiPrefix = "AI";
    this.returnMessages = true;
    this.client = {} as MongoClient; // Assign a default value
    this.userid = userid;
    this.history = [];
    this.memoryKey = "history";
    this.chatHistory = new ChatMessageHistory([]);
  }

  async pullMemoryFromMongo() {
    try {
      console.log("pulling memory from mongo");
      this.client = new MongoClient(MONGO_URL); // Assign the actual MongoClient instance
      console.log("Client initialized");
      await this.client.connect(); // Connect to the MongoDB client
      console.log("Client connected");
      const documents = await getAllDocumentsByUserid(this.client, this.userid);
      this.history = documents;
      if (documents.length === 0) {
        console.log("okkkk");
        this.chatHistory = new ChatMessageHistory([
          new HumanChatMessage(
            "Your responses should take the form: \
          ISCORRECT: true/false ~~ \
          NUMGUESSES: number of guesses ~~ \
          {your response}"
          ),
        ]);
      } else {
        this.chatHistory = new ChatMessageHistory(
          documents.map((doc) => {
            if (doc.messageType === "human") {
              return new HumanChatMessage(doc.message);
            } else {
              return new AIChatMessage(doc.message);
            }
          })
        );
      }
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
        userid: this.userid,
        timestamp: new Date().getTime(),
        messageType: "human",
        message: inputValues.input,
      };
      this.history.push(humanDoc);

      const aiDoc: MongoDocument = {
        userid: this.userid,
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
