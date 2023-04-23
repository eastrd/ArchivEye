import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  Highlight,
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
  const [selectedResult, setSelectedResult] = useState<SearchResult>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);
  const [resultContext, setResultContext] = useState("");

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
    // Reset PDF viewer and context UI
    setResultContext("");
    setSelectedResult(null);

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

              ipcRenderer
                .invoke("in-page-text-search", result, searchQuery, 40)
                .then((res: { chunk: string; index: number }) => {
                  setResultContext(res.chunk);
                });
            }}
            results={searchResults}
          />
          {resultContext && (
            <>
              <Heading size="md" pt={6}>
                Context
              </Heading>
              <Text pt={1} textAlign={"left"} fontSize={"xl"}>
                <Highlight
                  styles={{ color: "yellow" }}
                  query={searchQuery}
                >{`${resultContext}`}</Highlight>
              </Text>
            </>
          )}
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
              page={selectedResult.page}
              pdfPath={selectedResult.docPath}
            />
          )}
        </Box>
      </Flex>
    </VStack>
  );
};

export default Search;
