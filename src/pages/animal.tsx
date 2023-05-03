import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [guess, setGuess] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiStatement, setAiStatement] = useState("");
  const [fullHistory, setFullHistory] = useState([]);

  const handleGuess = () => {
    let data = {
      user: "John",
      message: guess,
    };
    try {
      axios.post("/api/animal", data).then((response) => {
        console.log(response.data);
        setAiStatement(response.data.r);
        response.data.fullHistory && setFullHistory(response.data.fullHistory);
      });
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  useEffect(() => {
    setName("");
    setLoading(false);
  }, []);

  return (
    <VStack spacing={4} align="center">
      <Text fontSize="4xl">I am a random animal. Can you guess what I am?</Text>
      {loading ? (
        <Box h="24" display="flex" justifyContent="center" alignItems="center">
          <Spinner />
        </Box>
      ) : (
        <>
          <Text fontSize="lg" fontWeight="bold">
            {name}
          </Text>
          <Text>{aiStatement}</Text>
          <Text>{isNew ? "new" : "cached"}</Text>
          <Box>
            <Flex>
              <Input type="text" onChange={(e) => setGuess(e.target.value)} />
              <Button colorScheme="blue" onClick={handleGuess}>
                Guess
              </Button>
            </Flex>
          </Box>
          <Box>
            <Text>Full History</Text>
            {fullHistory.map((item, index) => (
              <Text key={index}>{JSON.stringify(item)}</Text>
            ))}
          </Box>
        </>
      )}
    </VStack>
  );
}
