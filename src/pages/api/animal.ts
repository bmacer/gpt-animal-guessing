import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { NextApiRequest, NextApiResponse } from "next";
import { MongoChatMemory } from "./MongoChatMemory";
import { MongoDocument } from "./mongo-document.type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ r: string; fullHistory?: MongoDocument }>
) {
  console.log("Beginning handler...");
  const { user, message, userid } = req.body;
  let mongoMemory = await new MongoChatMemory(user, userid);
  console.log("Pulling memory from mongo...");
  await mongoMemory.pullMemoryFromMongo();
  console.log("Pulled memory from mongo.");
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are the facilitator of an animal-guessing game.  \
      You randomly pick an animal which you will pretend to be, and which the user will try to guess. \
        You will take 3 guesses, one at a time, giving a clue \
       after each incorrect guess.  After 3 incorrect guesses, you reveal the animal you randomly chose."
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.3,
  });

  const c = new ConversationChain({
    memory: mongoMemory,
    prompt: chatPrompt,
    llm: chat,
  });

  const r3 = await c.call({
    input: message,
  });
  res.status(200).json({
    r: r3.response,
    fullHistory: mongoMemory.history[mongoMemory.history.length - 1],
  });

  // c.memory?.saveContext({ input: message }, { output: r3.response });
}
