import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tooltip,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";
import { SearchResult } from "../services/types";

type Props = {
  results: Array<SearchResult>;
  handleOnView: (result: SearchResult) => void;
  itemsPerPage?: number;
};

const ResultsDisplay = ({ results, handleOnView, itemsPerPage = 5 }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(Math.ceil(results.length / itemsPerPage), 1);

  const paginatedResults = results
    .sort((a, b) => {
      // Sort by doc name then page number
      const nameComparison = a.docName.localeCompare(b.docName);
      if (nameComparison === 0) {
        return a.page - b.page;
      }
      return nameComparison;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th width={"60%"}>PDF Document</Th>
              <Th width={"20%"}>Page</Th>
              <Th width={"20%"}>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedResults.map((result: SearchResult) => {
              return (
                <Tr key={`${result.id}${result.page}`}>
                  <Td>
                    <Tooltip label={result.docPath}>
                      <Box whiteSpace="normal" wordBreak="break-word">
                        {result.docName}
                      </Box>
                    </Tooltip>
                  </Td>
                  <Td>{result.page}</Td>
                  <Td>
                    <Button
                      colorScheme="twitter"
                      onClick={() => {
                        handleOnView(result);
                      }}
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex mt={4} justifyContent="space-between">
        <Button
          colorScheme="teal"
          onClick={prevPage}
          isDisabled={currentPage === 1}
          ml={10}
          mr={5}
        >
          Previous
        </Button>
        <Box>
          Page {currentPage} of {totalPages}
        </Box>
        <Button
          onClick={nextPage}
          colorScheme="teal"
          isDisabled={currentPage === totalPages}
          ml={5}
          mr={10}
        >
          Next
        </Button>
      </Flex>
    </>
  );
};

export default ResultsDisplay;
