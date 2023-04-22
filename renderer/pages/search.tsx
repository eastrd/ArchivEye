// pages/main.js
import {
  Box,
  Button,
  Divider,
  extendTheme,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

const MainScreen = () => {
  return (
    <VStack minHeight="100vh" justifyContent="center" alignItems="center">
      <Heading as="h1" size="xl" mb={5}>
        PDF Search App
      </Heading>
      <FormControl width="70%" mb={5}>
        <Input type="text" placeholder="Search your indexed PDFs..." />
      </FormControl>
      <Flex width="100%" justifyContent="center">
        <Box flexBasis="50%" mr={3}>
          <Text fontWeight="bold" mb={2}>
            Search Results:
          </Text>
          {/* Display search results list here */}
        </Box>
        <Divider orientation="vertical" height="100%" />
        <Box flexBasis="50%" ml={3} position="relative">
          <Text fontWeight="bold" mb={2}>
            PDF Viewer:
          </Text>
          {/* Embed PDF viewer here */}
          <Button
            position="absolute"
            bottom={0}
            right={0}
            colorScheme="blue"
            onClick={() => {}}
          >
            Open Original File
          </Button>
        </Box>
      </Flex>
    </VStack>
  );
};

export default MainScreen;
