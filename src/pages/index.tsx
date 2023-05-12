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
      <Flex h="10vh" m="auto" justifyContent="center">
        <Text fontSize="50px">https://bmacer.vercel.app/</Text>
      </Flex>
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
        <MyLink href="https://forms.gle/GALZZfh4XcdMtyTY9">
          3. How did I do? [Google Form]
        </MyLink>
        <MyLink href="https://chat.openai.com">4. Link to ChatGPT</MyLink>
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
        <MyLink href="/presentation/c-prompt-how-did-i-do">
          3. Third Prompt - How did I do?
        </MyLink>
        <Text as="h1" fontSize="50px">
          Video Links
        </Text>
        <MyLink href="https://www.youtube.com/clip/UgkxIGl-RHF4yWT3reFoRLhshRzgQOKqOcBC">
          1. Notorious BIG raps NY State of Mind
        </MyLink>
        <MyLink href="https://youtube.com/clip/UgkxDP5SwJVymjYsycvuYCsUUI1JkhpjX50w">
          2. Freddie Mercury sings Thriller
        </MyLink>
        <MyLink href="https://www.youtube.com/watch?v=YuOBzWF0Aws">
          3. If Google was a Guy...
        </MyLink>
        <Text as="h1" fontSize="50px">
          Additional Resources
        </Text>
        <MyLink href="https://www.bensbites.co/">1. Bens Bites</MyLink>
        <MyLink href="https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers">
          2. Prompt Engineering Course
        </MyLink>
        <MyLink href="https://www.youtube.com/watch?v=2xxziIWmaSA">
          3. Langchain
        </MyLink>
        <MyLink href="mailto:bmacer@cisco.com">
          4. Email me (or ping me on Webex) bmacer@cisco.com
        </MyLink>
      </Box>
    </>
  );
}
