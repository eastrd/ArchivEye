// components/SetupScreen.js
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import DirectoryPicker from "../components/DirectoryPicker";
import DocsPicker from "../components/DocsPicker";
import electron from "electron";

const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;

const SetupScreen = () => {
  const [indexPath, setIndexPath] = useState("");
  const [pdfPath, setPdfPath] = useState("");

  return (
    <VStack spacing={6} alignItems="left" minHeight="80vh" p={5}>
      <Heading as="h1" size="xl">
        Before We Begin
      </Heading>
      <FormControl id="indexPath" isRequired>
        <FormLabel>1. Index Database Path (One-time Only)</FormLabel>
        <DirectoryPicker
          ButtonText={"Choose folder to store Index data"}
          IPCMessageType="open-directory-dialog"
        />
      </FormControl>
      <FormControl id="pdfPath" isRequired>
        <FormLabel>2. PDF Documents Path</FormLabel>

        <DocsPicker
          label=""
          OnSubmitFiles={(files) => {
            const paths = Array.from(files).map((file) => file.path);
            console.log(paths);
            ipcRenderer.send("file-list", paths);
          }}
        />
      </FormControl>
      <Button type="submit" colorScheme="blue">
        Initialize
      </Button>
    </VStack>
  );
};

export default SetupScreen;
