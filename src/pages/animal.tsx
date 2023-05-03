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

const handleNewGame = (userid: string) => {
  try {
    axios.post("/api/animal/new", { userid }).then((response) => {
      console.log(response.data);
    });
  } catch (error) {
    console.error("Request failed:", error);
  }
};

export default function Home() {
  const [name, setName] = useState("");
  const [guess, setGuess] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiStatement, setAiStatement] = useState("");
  const [fullHistory, setFullHistory] = useState([]);
  const [userid, setUserid] = useState("");
  const [guessButtonDisabled, setGuessButtonDisabled] = useState(false);

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
              {guessButtonDisabled ? (
                <Spinner />
              ) : (
                <Button
                  // colorScheme={guessButtonDisabled ? "gray" : "blue"}
                  bgColor={guessButtonDisabled ? "red" : "blue"}
                  onClick={() => {
                    if (guessButtonDisabled) return;
                    setGuessButtonDisabled(true);
                    handleGuess(userid);
                  }}
                  disabled={guessButtonDisabled}
                >
                  Guess
                </Button>
              )}
            </Flex>
          </Box>
          <Text>Your user ID: {userid}</Text>
          <Button colorScheme="blue" onClick={() => handleNewGame(userid)}>
            New Game
          </Button>
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
