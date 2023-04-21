import React, { useState } from "react";
import electron from "electron";
import { Button, Text } from "@chakra-ui/react";

const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;

type Props = {
  buttonText: string;
  ipcMessageType: string;
  disabled: boolean;
};

const DirectoryPicker = ({ buttonText, ipcMessageType, disabled }: Props) => {
  const [selectedDirectory, setSelectedDirectory] = useState("");

  const openDirectoryPicker = async () => {
    const directoryPath = await ipcRenderer.invoke(ipcMessageType);
    if (directoryPath) {
      setSelectedDirectory(directoryPath);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {selectedDirectory && <p>Selected directory: {selectedDirectory}</p>}
      <Button
        type="submit"
        mt={4}
        size="md"
        isDisabled={disabled}
        width="50%"
        colorScheme="blue"
        onClick={openDirectoryPicker}
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
