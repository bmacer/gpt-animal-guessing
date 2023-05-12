import { Text, Textarea } from "@chakra-ui/react";
import { MyLink } from "..";

const Scoring = () => {
  const statement = `i did a presentation about ChatGPT and asked for feedback.
Can you summarize the feedback for me, with bullet points about the top 3 highlights?  Also, give my presentation a score from 1-100.

here are there responses:
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
      <MyLink href="https://docs.google.com/spreadsheets/d/1wfpGSt2QKbkfTKyFN3nCM6_X9d8V3ch7vGrSqz8Vd-8/edit#gid=1042137985">
        Results [brandon only]
      </MyLink>
      <Textarea w="100%" h="60vh" m="30px" />
    </>
  );
};

export default Scoring;
