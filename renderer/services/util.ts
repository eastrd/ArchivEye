import fs from "fs/promises";

const createFolderIfNotExists = async (folderPath) => {
  try {
    await fs.access(folderPath);
    console.log("Folder already exists:", folderPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        await fs.mkdir(folderPath, { recursive: true });
        console.log("Folder created:", folderPath);
      } catch (mkdirErr) {
        console.error("Error creating folder:", mkdirErr);
      }
    } else {
      console.error("Error checking folder existence:", err);
    }
  }
};

export { createFolderIfNotExists };
