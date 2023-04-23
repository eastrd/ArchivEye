import { exec } from "child_process";
import { readdir } from "fs/promises";
import path from "path";
import { promisify } from "util";
import fs from "fs";
import fsp from "fs/promises";
import { SEP } from "../renderer/services/const";
import { IndexRecord } from "../renderer/services/types";
import * as ini from "ini";
import { app } from "electron";
import { getDir } from "../renderer/services/util";

export const execAsync = promisify(exec);
export const appDir = getDir(app.getAppPath());

console.log("AppDir: ", appDir);

export const parseIndexDB = async (
  dbPath: string
): Promise<Array<IndexRecord>> => {
  try {
    const data = await fsp.readFile(dbPath, "utf-8");
    const lines = data.split("\n");

    const parsed: Array<IndexRecord> = lines
      .map((line) => {
        const [id, path] = line.split(SEP);
        return { id, docPath: path };
      })
      .filter((item: IndexRecord) => item.id && item.docPath);
    return parsed;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};

export const execute = async (cmd: string) => {
  try {
    console.log("Executing command ", cmd);
    const { stdout, stderr } = await execAsync(cmd);
    if (stderr) {
      throw new Error(`Error: ${stderr}`);
    }
    return stdout;
  } catch (error) {
    throw error;
  }
};

export const pdfToImgs = async (
  inPDF: string,
  outDir: string
): Promise<string[]> => {
  // Convert PDF to images, return list of image names
  try {
    const result = await gsCMD(inPDF, outDir);
    // Scan the output dir and return all filenames
    return readdir(outDir);
  } catch (error) {
    console.error("error converting PDF to images: ", error);
    return [];
  }
};

export const gsCMD = async (inPDF: string, outDir: string): Promise<string> => {
  const cfg = ini.parse(
    fs.readFileSync(path.join(appDir, "config.ini"), "utf-8")
  );
  return execute(
    `${cfg.OCR.GHOSTSCRIPT}/gswin64c.exe -sDEVICE=pngalpha -o "${outDir}/%04d.png" -r300 "${inPDF}"`
  );
};

export const tessCMD = async (
  inImg: string,
  outDir: string
): Promise<string> => {
  // Extract image name as output text name
  const baseName = path.basename(inImg);

  const cfg = ini.parse(
    fs.readFileSync(path.join(appDir, "config.ini"), "utf-8")
  );

  return execute(
    `${cfg.OCR.TESSERACT}/tesseract.exe "${inImg}" "${path.join(
      outDir,
      baseName.split(".")[0]
    )}"`
  );
};

export const writeOrAppendToFile = (
  filePath: string,
  content: string
): void => {
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, content);
  } else {
    fs.writeFileSync(filePath, content);
  }
};

export const createFolder = (folderPath: string): void => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

export const deletePathSync = (pathToDelete: string): void => {
  if (fs.existsSync(pathToDelete)) {
    if (fs.lstatSync(pathToDelete).isFile()) {
      fs.unlinkSync(pathToDelete);
    } else {
      fs.readdirSync(pathToDelete).forEach((file) => {
        const filePath = path.join(pathToDelete, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          deletePathSync(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
      });
      fs.rmdirSync(pathToDelete);
    }
  }
};

// Deprecated and not used
export const findStrPercByLines = (filePath: string, searchString: string) => {
  const fileContent = fs.readFileSync(filePath, "utf-8").toLowerCase();
  const searchStringIndex = fileContent.indexOf(searchString.toLowerCase());
  if (searchStringIndex === -1) {
    return -1;
  }
  const totalNewlines = (fileContent.match(/\n/g) || []).length;
  const newlinesBeforeSearchString = (
    fileContent.slice(0, searchStringIndex).match(/\n/g) || []
  ).length;

  if (totalNewlines === 0) {
    return 0;
  }
  const percentagePosition = (newlinesBeforeSearchString / totalNewlines) * 100;
  return percentagePosition;
};

export const getSubstringWithContext = (
  filePath: string,
  searchString: string,
  wordRange: number
) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const searchStringIndex = fileContent.indexOf(searchString);

  if (searchStringIndex === -1) {
    return { chunk: "Substring not found.", index: -1 };
  }

  const words = fileContent.split(/\s+/);
  const wordIndex = words.findIndex((word) => word.includes(searchString));

  const startWordIndex = Math.max(0, wordIndex - wordRange);
  const endWordIndex = Math.min(words.length, wordIndex + 1 + wordRange);

  const contextWords = words.slice(startWordIndex, endWordIndex);
  const textChunk = contextWords.join(" ");
  const substringIndexInChunk = textChunk.indexOf(searchString);

  return { chunk: textChunk, index: substringIndexInChunk };
};
