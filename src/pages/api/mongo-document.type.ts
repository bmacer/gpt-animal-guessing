export type MongoDocument = {
  userid: string;
  timestamp: number;
  messageType: "human" | "ai";
  message: string;
};
