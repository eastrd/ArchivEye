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

export const deleteFolder = (folderPath: string): void => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        deleteFolder(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(folderPath);
  }
};

/*
Prerequisites:
- Install Tesseract
- Install Ghostscript
- Set 3 envs in .env
- Environment variable TESSDATA_PREFIX set to tesseract root directory 
    if using old version, otherwise set to tessdata directory

PDF to invididual images, then Image to OCR Text:
    .\tesseract.exe "S:\Apps\gs\gs10.01.1\bin\a\output-001.png" output-001 -c preserve_interword_spaces=1 -l eng

*/
