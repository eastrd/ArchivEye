import fsp from "fs/promises";

export const createFolderIfNotExists = async (folderPath) => {
  try {
    await fsp.access(folderPath);
    console.log("Folder already exists:", folderPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        await fsp.mkdir(folderPath, { recursive: true });
        console.log("Folder created:", folderPath);
      } catch (mkdirErr) {
        console.error("Error creating folder:", mkdirErr);
      }
    } else {
      console.error("Error checking folder existence:", err);
    }
  }
};

export const searchTextInFile = async (filePath, searchText) => {
  try {
    const data = await fsp.readFile(filePath, "utf-8");
    const regex = new RegExp(searchText, "gi"); // ignore case
    const matches = data.match(regex);

    if (matches) {
      return {
        success: true,
        matches: matches.length,
        error: false,
      };
    } else {
      return {
        success: false,
        matches: 0,
        error: "",
      };
    }
  } catch (error) {
    console.error("Error reading file:", error);
    return {
      success: false,
      matches: 0,
      error: true,
    };
  }
};
