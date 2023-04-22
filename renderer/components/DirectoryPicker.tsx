import React, { useState } from "react";
import electron from "electron";
import { Button, Text } from "@chakra-ui/react";

const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;

type Props = {
  buttonText: string;
  disabled: boolean;
  handleOnClick: () => void;
};

const DirectoryPicker = ({ buttonText, disabled, handleOnClick }: Props) => {
  const [selectedDirectory, setSelectedDirectory] = useState("");

  return (
    <div style={{ textAlign: "center" }}>
      {selectedDirectory && <p>Selected directory: {selectedDirectory}</p>}
      <Button
        type="submit"
        size="md"
        isDisabled={disabled}
        colorScheme="blue"
        onClick={handleOnClick}
      >
        {selectedDirectory ? (
          <Text as="s"> {buttonText}</Text>
        ) : (
          <Text> {buttonText}</Text>
        )}
      </Button>
    </div>
  );
};

export default DirectoryPicker;
