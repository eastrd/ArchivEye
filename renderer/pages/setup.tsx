// components/SetupScreen.js
import { Button, Heading, Progress, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DirectoryPicker from "../components/DirectoryPicker";
import DocsPicker from "../components/DocsScanner";
import electron from "electron";
import { phrases } from "../services/const";

const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;

const randomWaitingPhrase = () => {
  return phrases[Math.floor(Math.random() * phrases.length)];
};

const SetupScreen = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [progressPerc, setProgressPerc] = useState(0.0);
  const [inProgress, setInProgress] = useState(false);
  const [waitPhrase, setWaitPhrase] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      // Get OCR progress update via IPC bridge
      ipcRenderer.invoke("get-ocr-progress").then(setProgressPerc);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (inProgress) {
      intervalId = setInterval(() => {
        setWaitPhrase(randomWaitingPhrase());
      }, 4000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [inProgress]);

  const handleFinishOCR = () => {
    setInProgress(false);
  };

  return (
    <VStack spacing={6} alignItems="left" minHeight="80vh" p={5}>
      <Heading as="h1" size="xl">
        Setup
      </Heading>
      <Heading as="h2" size="sm">
        Index Database Path (One-time Only)
      </Heading>
      <DirectoryPicker
        disabled={inProgress}
        buttonText={"1. Choose folder to store Index data"}
        ipcMessageType="open-directory-dialog"
      />

      <Heading as="h2" size="sm">
        PDF Documents Path
      </Heading>
      <DocsPicker
        hintText="2. Click here or Drag the folder here"
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
        <Progress
          value={progressPerc}
          size="xs"
          hasStripe
          colorScheme="pink"
          m={3}
        />
        <Text>{inProgress && "Indexing... Please Wait..."}</Text>
        <Text mb={3}> {waitPhrase} </Text>
        <Button
          isDisabled={!files || files.length === 0 || inProgress}
          type="submit"
          colorScheme="blue"
          width={"50%"}
          onClick={() => {
            const paths = Array.from(files).map((file) => file.path);
            console.log(paths);
            ipcRenderer.send("file-list", paths);
            setInProgress(true);

            ipcRenderer.invoke("done-ocr").then(handleFinishOCR);
          }}
        >
          {inProgress ? (
            <Text as="s"> 3. INDEX EM ALL </Text>
          ) : (
            <Text> 3. INDEX EM ALL </Text>
          )}
        </Button>
      </div>
    </VStack>
  );
};

export default SetupScreen;
