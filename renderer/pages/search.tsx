import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import electron from "electron";
import { useCallback, useEffect, useState } from "react";
import { SearchResult } from "../services/types";
import ResultsDisplay from "../components/ResultsDisplay";
import PDFViewer from "../components/PDFViewer";
import Link from "next/link";

const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;
const isProd: boolean = process.env.NODE_ENV === "production";

const Search = () => {
  const [
    selectedResultHighlightProportion,
    setSelectedResultHighlightProportion,
  ] = useState(0);
  const [selectedResult, setSelectedResult] = useState<SearchResult>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);

  // Prevent stale search results being used
  const handleSearchResult = useCallback((event, result: SearchResult) => {
    setSearchResults((prevSearchResults) => [result, ...prevSearchResults]);
  }, []);

  useEffect(() => {
    ipcRenderer.on("search-result", handleSearchResult);
    return () => {
      ipcRenderer.removeListener("search-result", handleSearchResult);
    };
  }, [handleSearchResult]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchResults([]);
    console.log("[+] Search", searchQuery);
    ipcRenderer.send("search-request", searchQuery);
  };

  return (
    <VStack h="100vh" pt={5} alignItems="center">
      <Flex justifyContent="space-between" width="90%" mb={5}>
        <Link href={isProd ? `app://./setup.html` : `/setup`}>
          <Button size={"md"} colorScheme="telegram">
            Back: Index More
          </Button>
        </Link>
        <Heading as="h1" size="lg">
          ArchivEye
        </Heading>
        <Box />
      </Flex>

      <Box as="form" width="90%" onSubmit={handleSearchSubmit}>
        <FormControl width="90%" pb={5}>
          <Flex>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search your indexed PDFs..."
              flexGrow={1}
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
          <ResultsDisplay
            handleOnView={(result: SearchResult) => {
              setSelectedResult(result);
              // ipcRenderer
              //   .invoke("in-page-text-search", result, searchQuery)
              //   .then((highlightRatio) => {
              //     if (highlightRatio !== -1) {
              //       setSelectedResultHighlightProportion(highlightRatio - 10);
              //     }
              //   });
            }}
            results={searchResults}
          />
        </Box>
        <Divider
          width="1px"
          color="white"
          borderColor={"gray"}
          orientation="vertical"
          height="100%"
        />
        <Box textAlign={"center"} flexBasis="50%" ml={3}>
          <Text fontWeight="bold" mb={2}>
            PDF Viewer{selectedResult && `: ${selectedResult.docName}`}
          </Text>
          {selectedResult && (
            <PDFViewer
              highlightPortion={selectedResultHighlightProportion}
              page={selectedResult.page}
              pdfPath={selectedResult.docPath}
            />
          )}
          <Tooltip label={"Coming soon!"}>
            <Button
              mt={3}
              // isDisabled={selectedResult === undefined}
              isDisabled={true}
              colorScheme="green"
              onClick={() => {}}
            >
              Open Original File
            </Button>
          </Tooltip>
        </Box>
      </Flex>
    </VStack>
  );
};

export default Search;
