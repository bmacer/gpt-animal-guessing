import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { MONGO_URL } from "../CONST";

async function deleteAbsoluteylAllDocuments(
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

async function deleteDocumentsByUserid(userid: string): Promise<void> {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ r: string }>
) {
  console.log("Beginning handling animal/new...");
  const { userid } = req.body;
  userid && deleteDocumentsByUserid(userid);
  res.status(200).json({ r: "deletedeverything" });
  console.log("Completed handling animal/new...");
  return;
}
