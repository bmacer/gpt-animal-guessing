import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MongoChatMemory } from "./api/MongoChatMemory";
import { MongoDocument } from "./api/mongo-document.type";
import { Spacer, HStack } from "@chakra-ui/react";

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
  const [userid, setUserid] = useState("");
  const [fullHistory, setFullHistory] = useState<MongoDocument[]>([
    {
      userid,
      timestamp: new Date().getDate(),
      message: "I'm an animal.  Can you guess what I am?  Or just chat. :-)",
      messageType: "ai",
    },
  ]);
  const [guessButtonDisabled, setGuessButtonDisabled] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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

  useEffect(() => {
    setUserid(getUserId());
  }, []);

  const handleGuess = (userid: string) => {
    console.log("handling guess...");
    // setTimeout(() => {}, 2000);
    let data = {
      user: "John",
      message: guess,
      userid,
    };
    try {
      setGuess("");
      setFullHistory([
        ...fullHistory,
        {
          userid,
          timestamp: new Date().getDate(),
          message: guess,
          messageType: "human",
        },
      ]);
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
    scrollToBottom();
  }, [fullHistory]);

  useEffect(() => {
    setName("");
    setLoading(false);
  }, []);

  return (
    <Box w="100vw" h="100vh" overscrollBehavior="none">
      <VStack spacing={4} align="center">
        <Text
          textAlign="center"
          w="100vw"
          bgColor="#E6ADAD"
          h="8vh"
          p="20px"
          fontSize="4xl"
          fontFamily="Arial"
          color="blue.500"
        >
          Animal Guessing Game
        </Text>

        <Box h="80vh" overflowY="scroll" ref={scrollContainerRef}>
          {fullHistory.map((item, index) => (
            <Flex
              key={index}
              w="100%"
              justify={item.messageType === "ai" ? "flex-end" : "flex-start"}
            >
              {item.messageType === "ai" && <Spacer />}
              <Box
                w="50%"
                p="10px"
                bgColor={item.messageType === "ai" ? "lightblue" : "lightgray"}
                borderRadius="10px"
                margin="20px"
              >
                {item.message}
              </Box>
              {item.messageType === "human" && <Spacer />}
            </Flex>
          ))}
          <div ref={bottomRef}></div>
        </Box>

        <Box h="10vh">
          <HStack>
            <Input
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  if (guessButtonDisabled) return;
                  setGuessButtonDisabled(true);
                  handleGuess(userid);
                }
              }}
              value={guess}
              w="50vw"
              type="text"
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
              bg="white"
              borderRadius="md"
              border="1px solid gray"
              p="2"
            />

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
              w="10vw"
              minW="100px"
            >
              {guessButtonDisabled ? (
                <Spinner mr="10px" size="sm" />
              ) : (
                <Text>Guess</Text>
              )}
            </Button>

            <Button
              colorScheme="blue"
              onClick={() => handleNewGame(userid)}
              w="10vw"
              minW="70px"
            >
              Reset
            </Button>
          </HStack>
        </Box>

        <Flex h="2vh" />
      </VStack>
    </Box>
  );
}
