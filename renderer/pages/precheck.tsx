import React, { useState } from "react";
import {
  Button,
  VStack,
  Box,
  FormControl,
  Flex,
  FormLabel,
  Link,
} from "@chakra-ui/react";
import DirectoryPicker from "../components/DirectoryPicker";
import { Heading } from "@chakra-ui/react";
import { ipcRenderer } from "electron";

const isProd: boolean = process.env.NODE_ENV === "production";

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
                ipcRenderer.invoke("directory-pick").then(setTessPath);
              }}
              buttonText="Select"
              disabled={false}
            />
          </Flex>
        </FormControl>
        <FormControl mb={3}>
          <Flex justifyContent="space-between" alignItems="center">
            <FormLabel flexBasis={"20%"}>GhostScript Path</FormLabel>
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
          <Link
            _hover={{ textDecoration: "none" }}
            href={isProd ? `app://./setup.html` : `/setup`}
          >
            <Button
              mt={10}
              colorScheme="green"
              alignSelf="flex-end"
              isDisabled={tessPath.length === 0 || gsPath.length === 0}
              onClick={() =>
                ipcRenderer.send("save-config", {
                  Tess: tessPath,
                  Gs: gsPath,
                })
              }
            >
              Check Installations
            </Button>
          </Link>
        </Flex>
      </Box>
    </VStack>
  );
}

export default PreCheck;
