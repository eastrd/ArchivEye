import { SetStateAction, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  OnSubmitFiles: (files: FileList) => void;
  label: string | null;
  hintText: string;
  files: FileList | null;
  setFiles: React.Dispatch<SetStateAction<FileList>>;
};

const DocsPicker = ({
  OnSubmitFiles: pnSubmitFiles,
  hintText,
  label,
  files,
  setFiles,
}: Props) => {
  const [dragging, setDragging] = useState(false);

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFiles(event.dataTransfer.files);
    }
    setDragging(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    pnSubmitFiles(files);
  };

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor={dragging ? "gray.400" : "gray.200"}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      textAlign={"center"}
    >
      <FormControl
        border={dragging ? "2px dashed" : "2px solid"}
        borderColor={dragging ? "gray.400" : "gray.200"}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        borderRadius="lg"
        transition="border-color 0.2s"
        bg={dragging ? "gray.50" : "transparent"}
      >
        {label && <FormLabel>{label}</FormLabel>}

        <Input
          type="file"
          onChange={handlePathChange}
          {...({ webkitdirectory: "" } as any)}
          display="none"
          id="file-input"
        />
        <Box
          p={8}
          textAlign="center"
          cursor="pointer"
          onClick={() => document.getElementById("file-input")?.click()}
          border="1px dashed"
          borderColor={dragging ? "gray.400" : "gray.200"}
          borderRadius="lg"
          transition="border-color 0.2s"
          _hover={{ borderColor: "gray.400" }}
          bg="gray.50"
        >
          <Text fontSize="xl" fontWeight="semibold">
            {files ? `${files.length} PDF Files` : hintText}
          </Text>
        </Box>
      </FormControl>
    </Box>
  );
};

export default DocsPicker;
