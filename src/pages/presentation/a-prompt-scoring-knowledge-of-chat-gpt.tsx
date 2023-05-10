import { Text, Textarea } from "@chakra-ui/react";
import { MyLink } from "..";

const Scoring = () => {
  const statement = `i am presenting chatGPT to a group of people. i asked them each to
submit a form with a name and an answer to the question "what is
chatgpt?"

i'd like you to score each answer on a scale of 1-10,
grading on quality of respones. 

return the list from top score to
bottom. 

FORMAT: 
Brandon: 10 
Matt J: 8 
Matt F: 4 

DATA:
`;
  return (
    <>
      <pre
        style={{
          backgroundColor: "#f5f5f5",
          padding: "16px",
          borderRadius: "4px",
          overflowX: "scroll",
        }}
      >
        <code>{statement}</code>
      </pre>
      <MyLink href="https://docs.google.com/spreadsheets/d/1vf-dUjDRuugJUSX9Qt0TSI0losGzk0Y2RB0Z2qLo0zU/edit?resourcekey#gid=1287645697">
        Results [brandon only]
      </MyLink>
      <Textarea w="100%" h="60vh" m="30px" />
    </>
  );
};

export default Scoring;
