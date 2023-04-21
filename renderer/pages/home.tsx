import React from "react";
import Head from "next/head";
import electron from "electron";
import DocsPicker from "../components/DocsScanner";
import DirectoryPicker from "../components/DirectoryPicker";
import { Button, Text, Heading, VStack } from "@chakra-ui/react";
import Link from "next/link";

/*
Components:
- Search bar component
- Panel: Display search results
- Panel to render selected PDF file
- Input component: selecting directory to build PDF OCR caches
*/

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>ArchivEye</title>
      </Head>

      {/* <div>
        <DocsPicker
          OnSubmitFiles={(files) => {
            const paths = Array.from(files).map((file) => file.path);
            console.log(paths);
            ipcRenderer.send("file-list", paths);
          }}
        />
        <DirectoryPicker
          ButtonText={"Choose folder for Generated Index Data"}
          IPCMessageType="open-directory-dialog"
        />
      </div> */}

      <VStack
        spacing={6}
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <Heading as="h1" size="2xl">
          Welcome to ArchivEye
        </Heading>
        <Text maxWidth="md">
          Easily search through your scanned PDF documents with OCR capabilities
        </Text>
        <Link href="/setup">
          <Button colorScheme="blue">Get Started</Button>
        </Link>
      </VStack>
    </React.Fragment>
  );
}

export default Home;
