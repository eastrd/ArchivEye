import React, { useState } from "react";
import electron from "electron";
import { Button } from "@chakra-ui/react";

const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;

type Props = {
  ButtonText: string;
  IPCMessageType: string;
};

const DirectoryPicker = ({ ButtonText, IPCMessageType }: Props) => {
  const [selectedDirectory, setSelectedDirectory] = useState("");

  const openDirectoryPicker = async () => {
    const directoryPath = await ipcRenderer.invoke(IPCMessageType);
    if (directoryPath) {
      setSelectedDirectory(directoryPath);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button
        type="submit"
        mt={4}
        size="sm"
        width="50%"
        colorScheme="blue"
        onClick={openDirectoryPicker}
      >
        {ButtonText}
      </Button>
      {selectedDirectory && <p>Selected directory: {selectedDirectory}</p>}
    </div>
  );
};

export default DirectoryPicker;
