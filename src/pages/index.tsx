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

  const updateSockCompanyName = () => {
    axios.get("/api/hello").then((res) => {
      setName(res.data.r);
      setIsNew(res.data.isNew);
      setLoading(false);
    });
  };

  useEffect(() => {
    setName("");
    setLoading(true);
    updateSockCompanyName();
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
          <Text>{isNew ? "new" : "cached"}</Text>
          <Button colorScheme="blue" onClick={updateSockCompanyName}>
            Update
          </Button>
          <Box>
            <Flex>
              <Input type="text" onChange={(e) => setGuess(e.target.value)} />
              <Button colorScheme="blue" onClick={updateSockCompanyName}>
                Guess
              </Button>
            </Flex>
          </Box>
        </>
      )}
    </VStack>
  );
}
