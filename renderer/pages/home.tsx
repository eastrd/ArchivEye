import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Button, Text, Heading, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { ipcRenderer } from "electron";

function Home() {
  const [needInit, setNeedInit] = useState(true);

  useEffect(() => {
    // Check if config.ini exists, if exists then proceed to setup page, otherwise go to precheck page
    ipcRenderer
      .invoke("load-config")
      .then((ifExists) => setNeedInit(!ifExists));
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>ArchivEye</title>
      </Head>
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

        {needInit ? (
          <Link href="/precheck">
            <Button colorScheme="blue">Get Started</Button>
          </Link>
        ) : (
          <Link href="/setup">
            <Button colorScheme="blue">Enter</Button>
          </Link>
        )}
      </VStack>
    </React.Fragment>
  );
}

export default Home;
