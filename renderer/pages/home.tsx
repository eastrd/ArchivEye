import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Button, Text, Heading, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { ipcRenderer } from "electron";

const isProd: boolean = process.env.NODE_ENV === "production";

function Home() {
  const [needInit, setNeedInit] = useState(true);

  useEffect(() => {
    // Check if config.ini exists, if exists then proceed to setup page, otherwise go to precheck page
    ipcRenderer
      .invoke("exists-config")
      .then((ifExists) => setNeedInit(!ifExists));

    ipcRenderer.invoke("get-env").then((p) => console.log("AppDir: ", p));
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
          {needInit && "Welcome To "} ArchivEye
        </Heading>
        <Text maxWidth="md">
          Easily search through your scanned PDF documents with OCR capabilities
        </Text>

        {needInit ? (
          <Link href={isProd ? "app://./precheck.html" : "/precheck"}>
            <Button colorScheme="blue">Get Started</Button>
          </Link>
        ) : (
          <Link href={isProd ? "app://./setup.html" : "/setup"}>
            <Button colorScheme="blue">Welcome Back</Button>
          </Link>
        )}
      </VStack>
    </React.Fragment>
  );
}

export default Home;
