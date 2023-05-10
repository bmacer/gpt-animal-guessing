import { MongoAPIError, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { MONGO_URL } from "../CONST";
import { deleteDocumentsByUserid, getEverythingAllUsersSaid } from "../util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ everything: any[] }>
) {
  const everything = await getEverythingAllUsersSaid();
  res.status(200).json({ everything });
  return;
}
