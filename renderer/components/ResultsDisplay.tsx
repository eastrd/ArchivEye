import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tooltip,
  Link,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { SearchResult } from "../services/types";

type Props = {
  results: Array<SearchResult>;
  handleOnView: (result: SearchResult) => void;
};

const ResultsDisplay = ({ results, handleOnView }: Props) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>PDF Document</Th>
            <Th>Page</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {results
            .sort((a, b) => {
              // Sort by doc name then page number
              const nameComparison = a.docName.localeCompare(b.docName);
              if (nameComparison === 0) {
                return a.page - b.page;
              }
              return nameComparison;
            })
            .map((result: SearchResult) => {
              return (
                <Tr>
                  <Td>
                    <Tooltip label={result.docPath}>{result.docName}</Tooltip>
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
  );
};

export default ResultsDisplay;
