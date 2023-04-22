// components/SetupScreen.js
import {
  Button,
  Heading,
  Link,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DocsPicker from "../components/DocsScanner";
import electron from "electron";
import { phrases } from "../services/const";
import Overlay from "../components/Overlay";
import path from "path";

const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;

const randomWaitingPhrase = () => {
  return phrases[Math.floor(Math.random() * phrases.length)];
};

enum PgType {
  Standby,
  Indexing,
  Complete,
}

const SetupScreen = () => {
  const [paths, setPaths] = useState<Array<string>>([]);
  const [progressPerc, setProgressPerc] = useState(0.0);
  const [progressType, setProgressType] = useState<PgType>(PgType.Standby);
  const [waitPhrase, setWaitPhrase] = useState("");
  const [alreadyHasIndexDB, setAlreadyHasIndexDB] = useState(false);

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
    ipcRenderer.invoke("if-index-exists").then(setAlreadyHasIndexDB);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (progressType == PgType.Indexing) {
      intervalId = setInterval(() => {
        setWaitPhrase(randomWaitingPhrase());
      }, 4000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [progressType]);

  return (
    <VStack spacing={6} alignItems="left" minHeight="80vh" p={5}>
      {progressType === PgType.Complete && <Overlay link="/search" />}
      <Heading as="h1" size="xl">
        Setup
      </Heading>

      <Heading as="h2" size="sm">
        PDF Documents Path
      </Heading>
      <DocsPicker
        hintText="1. Click here or Drag the folder here"
        label=""
        files={paths}
        setFiles={(paths: Array<string>) => {
          setPaths(paths.filter((p) => path.extname(p) === ".pdf"));
        }}
        onSubmitFiles={(paths) => {
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
        <Text>
          {progressType === PgType.Indexing && "Indexing... Please Wait..."}
        </Text>
        <Text mb={3}> {waitPhrase} </Text>
        <Button
          isDisabled={paths.length === 0 || progressType === PgType.Indexing}
          type="submit"
          colorScheme="blue"
          width={"50%"}
          onClick={() => {
            console.log(paths);
            ipcRenderer.send("file-list", paths);
            setProgressType(PgType.Indexing);

            ipcRenderer.invoke("done-ocr").then(() => {
              setProgressType(PgType.Complete);
            });
          }}
        >
          {progressType === PgType.Indexing ? (
            <Text as="s"> 2. INDEX EM ALL </Text>
          ) : (
            <Text> 2. INDEX EM ALL </Text>
          )}
        </Button>
      </div>
      <div style={{ textAlign: "center" }}>
        {alreadyHasIndexDB && (
          <>
            <Text mt={5} mb={3}>
              Since you've already indexed before, you can also
            </Text>
            <Link _hover={{ textDecoration: "none" }} href="/search">
              <Button colorScheme="teal" width={"50%"}>
                Start Search
              </Button>
            </Link>
          </>
        )}
      </div>
    </VStack>
  );
};

export default SetupScreen;
