import React, { useState } from "react";
import {
  Button,
  VStack,
  Box,
  FormControl,
  Flex,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import DirectoryPicker from "../components/DirectoryPicker";
import { Heading } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import SetupInstructions from "../components/SetupInstructions";

const isProd: boolean = process.env.NODE_ENV === "production";

function PreCheck() {
  const toast = useToast();

  const [tessPath, setTessPath] = useState("");
  const [gsPath, setGsPath] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const makeErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <VStack minHeight="100vh" justifyContent="center" alignItems="center">
      <Heading as="h1" size="2xl" mb={5}>
        First-time Setup
      </Heading>
      <SetupInstructions />
      <Box pt={5} width="90%">
        <FormControl mb={3}>
          <Flex justifyContent="space-between" alignItems="center">
            <FormLabel flexBasis={"20%"}>Tesseract Path</FormLabel>
            <FormLabel>{tessPath}</FormLabel>
            <DirectoryPicker
              handleOnClick={() => {
                ipcRenderer.invoke("directory-pick").then(setTessPath);
              }}
              buttonText="Select"
              disabled={isValidating}
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
              disabled={isValidating}
            />
          </Flex>
        </FormControl>
        <Flex justifyContent={"end"}>
          <Button
            mt={10}
            colorScheme="green"
            alignSelf="flex-end"
            isDisabled={
              tessPath.length === 0 || gsPath.length === 0 || isValidating
            }
            onClick={() =>
              ipcRenderer
                .invoke("check-env", {
                  Tess: tessPath,
                  Gs: gsPath,
                })
                .then(
                  (res: {
                    TessExists: Boolean;
                    TessDataExists: Boolean;
                    GsBinExists: Boolean;
                  }) => {
                    setIsValidating(true);
                    if (!res.TessDataExists || !res.TessExists) {
                      makeErrorToast(
                        "Wrong Tesseract Path",
                        "Unable to find `tesseract.exe` in your provided Tesseract path above, please double check you have installed Tesseract on your system and have selected its root path"
                      );
                      setIsValidating(false);
                    } else if (!res.GsBinExists) {
                      makeErrorToast(
                        "Wrong GhostScript Path",
                        "Unable to find the `bin` folder in your provided GhostScript path above, please double check you have installed GhostScript on your system and have selected its root path"
                      );
                      setIsValidating(false);
                    } else {
                      ipcRenderer
                        .invoke("save-config", {
                          Tess: tessPath,
                          Gs: gsPath,
                        })
                        .then(() => {
                          ipcRenderer
                            .invoke("test-ocr")
                            .then((res: { error: boolean; reason: string }) => {
                              if (res.error) {
                                makeErrorToast(
                                  "There's an issue when testing if OCR works",
                                  res.reason
                                );
                              } else {
                                window.location.href = isProd
                                  ? `app://./setup.html`
                                  : `/setup`;
                              }
                              setIsValidating(false);
                            });
                        });
                    }
                  }
                )
            }
          >
            {isValidating
              ? "Validating... Please Wait..."
              : "Validate & Proceed"}
          </Button>
        </Flex>
      </Box>
    </VStack>
  );
}

export default PreCheck;
