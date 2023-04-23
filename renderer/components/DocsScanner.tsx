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
  onSubmitFiles: (files: Array<string>) => void;
  label: string | null;
  disabled: boolean;
  hintText: string;
  files: Array<string>;
  setFiles: React.Dispatch<SetStateAction<Array<string>>>;
};

const DocsPicker = ({
  onSubmitFiles,
  hintText,
  label,
  files,
  disabled,
  setFiles,
}: Props) => {
  const [dragging, setDragging] = useState(false);

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files).map((f) => f.path));
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
      setFiles(Array.from(event.dataTransfer.files).map((f) => f.path));
    }
    setDragging(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmitFiles(files);
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
          isDisabled={disabled}
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
          <Text color={"black"} fontSize="xl" fontWeight="semibold">
            {files.length ? `Found ${files.length} PDF Files` : hintText}
          </Text>
        </Box>
      </FormControl>
    </Box>
  );
};

export default DocsPicker;
