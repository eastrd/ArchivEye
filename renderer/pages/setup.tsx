// components/SetupScreen.js
import {
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DocsPicker from "../components/DocsScanner";
import electron from "electron";
import { phrases } from "../services/const";
import Overlay from "../components/Overlay";
import path from "path";

const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;
const isProd: boolean = process.env.NODE_ENV === "production";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Flex justifyContent="space-between">
        <Heading as="h1" size="xl">
          Setup
        </Heading>

        <Button
          onClick={() => {
            window.location.href = isProd
              ? `app://./precheck.html`
              : `/precheck`;
          }}
          isDisabled={progressType === PgType.Indexing}
        >
          Settings
        </Button>
      </Flex>
      <Heading as="h2" size="sm">
        PDF Documents Path
      </Heading>
      <DocsPicker
        disabled={progressType === PgType.Indexing}
        hintText="Click here or Drag the folder here"
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
            onOpen();
          }}
        >
          <Text> Start Indexing </Text>
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Your Previously Indexed Data?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Generating new indexed data will erase all of your previous index
              database (if any). This will NOT affect your original PDF
              documents.
              <br />
              <br />
              Would you like to continue?
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  onClose();
                  console.log(paths);
                  ipcRenderer.invoke("delete-index").then(() => {
                    ipcRenderer.send("file-list", paths);
                    setProgressType(PgType.Indexing);

                    ipcRenderer.invoke("done-ocr").then(() => {
                      setProgressType(PgType.Complete);
                    });
                  });
                }}
              >
                Proceed
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <div style={{ textAlign: "center" }}>
        {alreadyHasIndexDB && (
          <>
            <Text mt={7}>
              Looks like you already have an database previously indexed
            </Text>
            <Text mt={3} mb={7}>
              You could resume searching with the indexed documents
            </Text>
            <Link
              _hover={{ textDecoration: "none" }}
              href={isProd ? `app://./search.html` : `/search`}
            >
              <Button
                isDisabled={progressType === PgType.Indexing}
                colorScheme="teal"
                width={"50%"}
              >
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
