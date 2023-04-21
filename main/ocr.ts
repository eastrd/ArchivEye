import { exec } from "child_process";
import dotenv from "dotenv";
import { readdir } from "fs/promises";
import path from "path";
import { promisify } from "util";
import fs from "fs";

dotenv.config();
const execAsync = promisify(exec);

const SamplePDF =
  "D:/LibGen/NonFiction/1000/[Article] A Mathematical Theory of Communication_bb0283f61b7a5457d74caa9c791e11eb.pdf";

const execute = async (cmd: string) => {
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

const DisplayEnvs = () => {
  console.log(process.env);
};

const PDFToImgs = async (inPDF: string, outDir: string): Promise<string[]> => {
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

const gsCMD = async (inPDF: string, outDir: string): Promise<string> =>
  execute(
    `${process.env.GHOSTSCRIPT}/gswin64c.exe -sDEVICE=pngalpha -o "${outDir}/%04d.png" -r300 "${inPDF}"`
  );

const TessCMD = async (inImg: string, outDir: string): Promise<string> => {
  // Extract image name as output text name
  const baseName = path.basename(inImg);

  return execute(
    `${process.env.TESSERACT}/tesseract.exe "${inImg}" "${path.join(
      outDir,
      baseName.split(".")[0]
    )}"`
  );
};

const WriteOrAppendToFile = (filePath: string, content: string): void => {
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, content);
  } else {
    fs.writeFileSync(filePath, content);
  }
};

const CreateFolder = (folderPath: string): void => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

const DeleteFolder = (folderPath: string): void => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        DeleteFolder(filePath);
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

export {
  PDFToImgs,
  SamplePDF,
  DisplayEnvs,
  TessCMD,
  WriteOrAppendToFile,
  CreateFolder,
  DeleteFolder,
};
