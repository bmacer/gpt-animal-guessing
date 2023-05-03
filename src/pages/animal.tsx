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
import { MongoChatMemory } from "./api/MongoChatMemory";
import { MongoDocument } from "./api/mongo-document.type";
import { Spacer } from "@chakra-ui/react";

const generateRandomId = (): string => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let randomId = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomId += letters.charAt(randomIndex);
  }

  return randomId;
};

const getUserId = (): string => {
  let userId = localStorage.getItem("userId");

  if (!userId) {
    userId = generateRandomId();
    localStorage.setItem("userId", userId);
  }

  return userId;
};

export default function Home() {
  const [name, setName] = useState("");
  const [guess, setGuess] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiStatement, setAiStatement] = useState("");
  const [fullHistory, setFullHistory] = useState<MongoDocument[]>([]);
  const [userid, setUserid] = useState("");
  const [guessButtonDisabled, setGuessButtonDisabled] = useState(false);

  const handleNewGame = (userid: string) => {
    try {
      axios.post("/api/animal/new", { userid }).then((response) => {
        console.log(response.data);
      });
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  useEffect(() => {
    setUserid(getUserId());
  }, []);

  const handleGuess = (userid: string) => {
    console.log("handling guess...");
    setTimeout(() => {}, 2000);
    let data = {
      user: "John",
      message: guess,
      userid,
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
    setGuessButtonDisabled(false);
  }, [fullHistory]);

  useEffect(() => {
    setName("");
    setLoading(false);
  }, []);

  return (
    <VStack spacing={4} align="center">
      <Text fontSize="4xl">Guess the animal.  Powered by ChatGPT.</Text>
      {loading ? (
        <Box h="24" display="flex" justifyContent="center" alignItems="center">
          <Spinner />
        </Box>
      ) : (
        <>
          <Text fontSize="lg" fontWeight="bold">
            {name}
          </Text>

          <Box h="80vh" overflowY="scroll">
            {fullHistory.map((item, index) => (
              <>
                {/* <Text key={index}>{JSON.stringify(item)}</Text> */}
                <Flex w="100vw">
                  {item.messageType === "ai" && <Spacer />}
                  <Text
                    border="2px solid blue"
                    w="50%"
                    p="10px"
                    bgColor="lightblue"
                    borderRadius="10px"
                    margin="20px"
                  >
                    {item.message}
                  </Text>
                  {item.messageType === "human" && <Spacer />}
                </Flex>
              </>
            ))}
          </Box>
          <Box>
            <Flex>
              <Input
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    if (guessButtonDisabled) return;
                    setGuessButtonDisabled(true);
                    handleGuess(userid);
                  }
                }}
                w="600px"
                type="text"
                onChange={(e) => setGuess(e.target.value)}
              />
              {guessButtonDisabled ? (
                <Spinner />
              ) : (
                <>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      if (guessButtonDisabled) return;
                      setGuessButtonDisabled(true);
                      handleGuess(userid);
                    }}
                    disabled={guessButtonDisabled}
                    ml="30px"
                    mr="30px"
                    w="200px"
                  >
                    Guess
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleNewGame(userid)}
                    w="200px"
                  >
                    New Game
                  </Button>
                </>
              )}
            </Flex>
          </Box>
        </>
      )}
    </VStack>
  );
}
