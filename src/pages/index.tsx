import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";

type MyLinkProps = {
  href: string;
  children: React.ReactNode;
};

export const MyLink = ({ href, children }: MyLinkProps) => {
  return (
    <Box>
      <Link color="blue" _hover={{ color: "blue" }} target="_blank" href={href}>
        {children}
      </Link>
    </Box>
  );
};

export default function Home() {
  return (
    <>
      <Flex h="10vh" m="auto" justifyContent='center'>
        <Text fontSize="50px">https://gpt-animal-guessing.vercel.app/</Text>
      </Flex>
      <Image
        position="absolute"
        top="10px"
        right="10px"
        src="/qr-code.png"
        w="200px"
        h="200px"
      />
      <Box w="90vw" bgColor="lightgrey" m="auto" textAlign="center">
        <Text as="h1" fontSize="50px">
          ChatGPT follow-along
        </Text>
        <MyLink href="https://forms.gle/vRhjY7sX1GgY9Vwd8">
          1. What is ChatGPT? [Google Form]
        </MyLink>
        <MyLink href="https://forms.gle/5pCSGcNSZiNuRrmG9">
          2. Who do I know? [Google Form]
        </MyLink>
        <MyLink href="https://chat.openai.com">3. Link to ChatGPT</MyLink>
      </Box>
      <Box w="90vw" h="90vh" bgColor="lightgrey" m="auto" textAlign="center">
        <Text as="h1" fontSize="50px">
          ChatGPT Prompts
        </Text>
        <MyLink href="/presentation/a-prompt-scoring-knowledge-of-chat-gpt">
          1. First Prompt - What is ChatGPT?
        </MyLink>
        <MyLink href="/presentation/b-prompt-organize-classroom">
          2. Second Prompt - People I Know
        </MyLink>
      </Box>
    </>
  );
}
