import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const Search = () => {
  const [currentOpenedPDF, setCurrentOpenedPDF] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement your search logic here, e.g., call an API or filter data
    console.log("Search", searchQuery);
  };

  return (
    <VStack h="100vh" pt={5} alignItems="center">
      <Heading as="h1" size="xl">
        PDF Content Search
      </Heading>

      <Box as="form" width="90%" onSubmit={handleSearchSubmit}>
        <FormControl width="90%" pb={5}>
          <Flex>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search your indexed PDFs..."
              flexGrow={1} // Make the input grow to fill available space
            />
            <Button type="submit" colorScheme="teal" ml={2}>
              Search
            </Button>
          </Flex>
        </FormControl>
      </Box>

      <Flex width="100%" height="80vh" justifyContent="center">
        <Box textAlign={"center"} flexBasis="50%" mx={3}>
          <Text fontWeight="bold" mb={2}>
            Search Results
          </Text>
          {/* Display search results list here */}
        </Box>
        <Divider
          width="1px"
          color="white"
          borderColor={"white"}
          orientation="vertical"
          height="100%"
        />
        <Box textAlign={"center"} flexBasis="50%" ml={3}>
          <Text fontWeight="bold" mb={2}>
            PDF Viewer
          </Text>
          {/* Embed PDF viewer here */}
          <Button colorScheme="green" onClick={() => {}}>
            Open Original File
          </Button>
        </Box>
      </Flex>
    </VStack>
  );
};

export default Search;
