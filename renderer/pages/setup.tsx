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
import DocsPicker from "../components/DocsScanner";
import electron from "electron";

const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;

const SetupScreen = () => {
  const [indexPath, setIndexPath] = useState("");
  const [pdfPath, setPdfPath] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  return (
    <VStack spacing={6} alignItems="left" minHeight="80vh" p={5}>
      <Heading as="h1" size="xl">
        Before We Begin
      </Heading>
      <Heading as="h2" size="sm">
        1. Index Database Path (One-time Only)
      </Heading>
      <DirectoryPicker
        ButtonText={"Choose folder to store Index data"}
        IPCMessageType="open-directory-dialog"
      />

      <Heading as="h2" size="sm">
        2. PDF Documents Path
      </Heading>
      <DocsPicker
        label=""
        files={files}
        setFiles={setFiles}
        OnSubmitFiles={(files) => {
          const paths = Array.from(files).map((file) => file.path);
          console.log(paths);
          ipcRenderer.send("file-list", paths);
        }}
      />
      <div style={{ textAlign: "center" }}>
        <Button
          isDisabled={!files || files.length === 0}
          type="submit"
          colorScheme="blue"
          width={"50%"}
          onClick={() => {
            const paths = Array.from(files).map((file) => file.path);
            console.log(paths);
            ipcRenderer.send("file-list", paths);
          }}
        >
          Initialize
        </Button>
      </div>
    </VStack>
  );
};

export default SetupScreen;
