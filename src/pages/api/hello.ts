// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAI } from "langchain";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  r: string;
};

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
});

const getOpenAi = async () => {
  console.log("Running getOpenAi");
  const res = await model.call(
    "What would be a good company name a company that makes colorful socks?"
  );
  return res;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const r = await getOpenAi();
  res.status(200).json({ r });
}
