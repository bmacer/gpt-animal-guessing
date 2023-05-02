import { OpenAI } from "langchain";
import { FindOptions, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const uri = `mongodb+srv://bobbysox322:${process.env.MONGO_DB_PASSWORD}@guessanimalcluster.pqmjp0i.mongodb.net/?retryWrites=true&w=majority`;

let cache: {
  response: string;
  timestamp: number;
} = {
  response: "",
  timestamp: 0,
};

async function insert(name: string) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbName = "myDatabase";
    const collectionName = "sockCompanies";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const query = { name, timestamp: new Date() };
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

async function getLatestFromDatabase() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbName = "myDatabase";
    const collectionName = "sockCompanies";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const query = {};
    const sort = { timestamp: -1 };
    const options = { sort } as FindOptions<Document>;
    const result = await collection.findOne(query, options);
    return result?.name || "";
  } catch (err) {
    console.error(
      `Something went wrong trying to fetch the latest document: ${err}\n`
    );
    return "";
  } finally {
    client.close();
  }
}

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
});

const getOpenAi = async () => {
  const currentTime = Date.now();
  if (currentTime - cache.timestamp < 10 * 1000) {
    console.log("Returning cached result");
    return { response: cache.response, isNew: false };
  }

  console.log("Running getOpenAi");
  const question =
    "What would be a good company name for a company that makes colorful socks?";
  const response = await model.call(question);
  insert(response);

  cache = {
    response,
    timestamp: currentTime,
  };

  return { response, isNew: true };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ r: string; isNew: boolean }>
) {
  const { response, isNew } = await getOpenAi();
  if (!response) {
    const dbResult = await getLatestFromDatabase();
    res.status(200).json({ r: dbResult, isNew: false });
  } else {
    res.status(200).json({ r: response, isNew });
  }
}
