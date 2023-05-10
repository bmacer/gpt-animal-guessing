import { Box, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
// import { deleteDocumentsByUserid } from "./api/util";
// import { getAllHumanGuesses } from "./api/util";
// import { nothing } from "./api/util";
// import { MongoDocument } from "./api/mongo-document.type";
// import { MongoClient } from "mongodb";
// import { MONGO_URL } from "./api/CONST";
// import { nothing } from "./api/util";

export async function getAllHumanGuesses(): Promise<any[]> {
  try {
    const response = await axios.get("/api/all");
    return response.data;
  } catch (error) {
    console.error("Error occurred while fetching documents", error);
    throw error;
  }
}

const All = () => {
  const [everything, setEverything] = useState<any[]>([]);
  useEffect(() => {
    axios.get("/api/animal/all").then((res) => {
      setEverything(res.data);
    });
  }, []);
  return (
    <Box>
      {everything?.everything?.map((e: any) => {
        return <Text>Somebody said: {e.message}</Text>;
      })}
    </Box>
  );
};

export default All;
