import React, { useState } from "react";
import {
  Button,
  VStack,
  Box,
  FormControl,
  Flex,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import DirectoryPicker from "../components/DirectoryPicker";
import { Heading } from "@chakra-ui/react";
import { ipcRenderer } from "electron";

function PreCheck() {
  const [tessPath, setTessPath] = useState("");
  const [gsPath, setGsPath] = useState("");

  return (
    <VStack minHeight="100vh" justifyContent="center" alignItems="center">
      <Heading as="h1" size="2xl" mb={5}>
        First-time Setup
      </Heading>
      <Box width="90%">
        <FormControl mb={3}>
          <Flex justifyContent="space-between" alignItems="center">
            <FormLabel flexBasis={"20%"}>Tesseract Path</FormLabel>
            <FormLabel>{tessPath}</FormLabel>
            <DirectoryPicker
              handleOnClick={() => {
                ipcRenderer.invoke("directory-pick").then((v) => {
                  console.log("Got ", v);
                  setTessPath(v);
                });
              }}
              buttonText="Select"
              disabled={false}
            />
          </Flex>
        </FormControl>
        <FormControl mb={3}>
          <Flex justifyContent="space-between" alignItems="center">
            <FormLabel flexBasis={"50%"}>GhostScript Path</FormLabel>
            <FormLabel>{gsPath}</FormLabel>
            <DirectoryPicker
              handleOnClick={() => {
                ipcRenderer.invoke("directory-pick").then(setGsPath);
              }}
              buttonText="Select"
              disabled={false}
            />
          </Flex>
        </FormControl>
        <Flex justifyContent={"end"}>
          <Button
            mt={10}
            colorScheme="green"
            alignSelf="flex-end"
            isDisabled={tessPath.length === 0 || gsPath.length === 0}
            onClick={() => {
              console.log("Sending");
              ipcRenderer.send("save-config", { Tess: tessPath, Gs: gsPath });
            }}
          >
            Check Installations
          </Button>
        </Flex>
      </Box>
    </VStack>
  );
}

export default PreCheck;
