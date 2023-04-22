import { CheckIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  Center,
  VStack,
  Icon,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";
import React from "react";

const isProd: boolean = process.env.NODE_ENV === "production";

type Props = {
  link: string;
};

const Overlay = ({ link }: Props) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      right={0}
      backgroundColor="rgba(0,0,0,0.7)"
      zIndex={999}
    >
      <Flex
        direction="column"
        alignItems="center"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Center minHeight="100vh" width="100%">
          <VStack spacing={4}>
            <Box boxSize="60px" bg="green.500" borderRadius="30px">
              <Center>
                <Icon as={CheckIcon} color="white" boxSize="40px" mt="12px" />
              </Center>
            </Box>
            <Text color={"white"}>Indexing Completed!</Text>
            <Link href={isProd ? `app://./${link}.html` : `/${link}`}>
              <Button colorScheme="teal">Start Searching</Button>
            </Link>
          </VStack>
        </Center>
      </Flex>
    </Box>
  );
};

export default Overlay;
