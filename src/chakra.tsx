import { ChakraProvider, CSSReset } from "@chakra-ui/react";

const Chakra = ({ children }: { children: any }) => (
  <ChakraProvider>
    <CSSReset />
    {children}
  </ChakraProvider>
);

export default Chakra;
