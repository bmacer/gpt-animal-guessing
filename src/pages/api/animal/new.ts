import { NextApiRequest, NextApiResponse } from "next";
import { deleteDocumentsByUserid } from "../util";

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
