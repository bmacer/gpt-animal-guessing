import { MongoClient } from "mongodb";
import { MONGO_URL } from "./CONST";

export async function getAllDocumentsByUserid(
  client: MongoClient,
  userid: string
): Promise<any[]> {
  try {
    await client.connect();
    const database = client.db("myDatabase");
    const collection = database.collection("conversations");
    const documents = await collection.find({ userid }).toArray();
    return documents;
  } catch (error) {
    console.error("Error occurred while fetching documents", error);
    throw error;
  }
}

export async function deleteAbsoluteylAllDocuments(
  client: MongoClient
): Promise<void> {
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

export async function deleteDocumentsByUserid(userid: string): Promise<void> {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const database = client.db("myDatabase");
    const collection = database.collection("conversations");
    const documents = await collection.deleteMany({ userid });
    console.log(`deleted ${documents.deletedCount}`);
  } catch (error) {
    console.error("Error occurred while fetching documents", error);
    throw error;
  }
}
