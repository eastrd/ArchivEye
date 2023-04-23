import { Box, Code, Heading, Link, Text } from "@chakra-ui/react";
import { ipcRenderer } from "electron";

const SetupInstructions = () => (
  <Box p={6}>
    <Heading as="h2" size="lg">
      Required Third Party Tools
    </Heading>
    <Heading pt={3} as="h3" size="md">
      1. Install Tesseract
    </Heading>
    <Text pt={2}>
      Tesseract is an integral part of ArchivEye, providing powerful OCR
      capabilities that convert extracted individual pages into searchable text.
    </Text>
    <Text pt={2}>
      Download and install the latest version 5.3.1 from
      <Link
        px={1}
        color={"cyan"}
        href="#"
        onClick={() => {
          ipcRenderer.send(
            "open-link-external-browser",
            "https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.3.1.20230401.exe"
          );
        }}
      >
        uni-mannheim
      </Link>
    </Text>
    <Heading pt={7} as="h3" size="md">
      2. Install GhostScript
    </Heading>
    <Text pt={2}>
      GhostScript is used to extract individual pages from the PDF file as
      images for Tesseract to OCR.
    </Text>
    <Text pt={2}>
      Go to
      <Link
        px={1}
        color={"cyan"}
        href="#"
        onClick={() => {
          ipcRenderer.send(
            "open-link-external-browser",
            "https://github.com/ArtifexSoftware/ghostpdl-downloads/releases"
          );
        }}
      >
        this Github release page
      </Link>
      and download <Code>gs10011w64.exe</Code>
    </Text>
    <Heading pt={7} as="h3" size="md">
      2. Select Paths Below
    </Heading>
    <Text pt={2}>
      For Tesseract, select the folder <Code>Tesseract-OCR</Code>
    </Text>
    <Text pt={2}>
      For GhostScript, be sure to select the folder that is inside{" "}
      <Code>gs</Code> but not <Code>gs</Code> itself, in the time of releasing
      this version of ArchivEye, mine would be <Code>gs10.01.1</Code>
    </Text>
    <Text pt={7}>
      Don't worry if you accidentally select the wrong paths, the{" "}
      <Code>Validate & Proceed</Code> button below will validate the paths to
      make sure the paths are correct before we start indexing PDFs
    </Text>
  </Box>
);

export default SetupInstructions;
