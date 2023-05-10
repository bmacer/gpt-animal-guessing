import { Text, Textarea } from "@chakra-ui/react";
import { MyLink } from "..";

const Scoring = () => {
  const statement = `i have a classroom of 15 students.
They are sitting in a 3x5 grid of seats.
i'd like to arrange them in a way so that they are close to people that they are unfamiliar with.
i surveyed them and asked who they knew well.

can you assign them seats so they are maximally unfamiliar with their neighbors?

Also, give each seat a number, 1-15.

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
      <MyLink href="https://docs.google.com/spreadsheets/d/1c92VrBOVRk5R4yQgCLOkxXEyr_uWMJ1wDk-m4MtEYik/edit#gid=2110338771">
        Results [brandon only]
      </MyLink>
      <Textarea w="100%" h="60vh" m="30px" />
    </>
  );
};

export default Scoring;
