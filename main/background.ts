import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import path from "path";
import {
  createFolder,
  deletePathSync,
  findStrPercByLines,
  parseIndexDB,
  pdfToImgs,
  tessCMD,
  writeOrAppendToFile,
} from "./ocr";
import { v4 as uuidv4 } from "uuid";
import {
  createFolderIfNotExists,
  getDir,
  searchTextInFile,
} from "../renderer/services/util";
import { IndexRecord, SearchResult } from "../renderer/services/types";
import { INDEX_DB_FILENAME, SEP } from "../renderer/services/const";
import fsp from "fs/promises";
import fs from "fs";
import * as ini from "ini";

let mainWindow: Electron.CrossProcessExports.BrowserWindow;
export const isProd: boolean = process.env.NODE_ENV === "production";
const appDir = getDir(app.getAppPath());

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1000,
    height: 1000,
    autoHideMenuBar: true,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

// Create `_index` folder if not exist
const indexPath: string = path.join(appDir, "_index");

createFolderIfNotExists(indexPath);

let ocrProgress: number = 0;

console.log("indexPath is ", indexPath);

ipcMain.on("file-list", async (_event, paths) => {
  let counter = 0;
  for (const p of paths) {
    // For now, only index PDF files
    if (path.extname(p) !== ".pdf") {
      continue;
    }

    const uid = uuidv4();
    // Append the "UUID to book path relation" to a master CSV
    const dbPath = path.join(indexPath, INDEX_DB_FILENAME);
    const record = `${uid}${SEP}${p}`;
    writeOrAppendToFile(dbPath, record + "\n");

    // Create a temp folder to contain all extracted page images from the PDF
    const pageImgDir = path.join(indexPath, `tmp_${uid}`);
    createFolder(pageImgDir);

    // Create a folder for OCR'd texts
    const txtDir = path.join(indexPath, `${uid}`);
    createFolder(txtDir);

    const pageImgNames = await pdfToImgs(p, pageImgDir);
    for (const pageImgName of pageImgNames) {
      const pageImgPath = path.join(pageImgDir, pageImgName);

      await tessCMD(pageImgPath, txtDir).catch((err) =>
        console.log(`Tesseract error when ocr ${p}: ${err}`)
      );
      console.log(`OCR'd Page ${pageImgName}`);
    }
    console.log(`Finish OCR ${p}`);
    deletePathSync(pageImgDir);

    counter++;
    ocrProgress = (counter / paths.length) * 100;
  }
});

ipcMain.handle("get-ocr-progress", (event) => {
  return ocrProgress;
});

ipcMain.handle("if-index-exists", (event) => {
  const indexDBPath = path.join(indexPath, INDEX_DB_FILENAME);
  return fs.existsSync(indexDBPath);
});

ipcMain.handle("done-ocr", async () => {
  ocrProgress = 0.0;
  return new Promise<void>((resolve) => {
    const checkProgress = () => {
      if (ocrProgress === 100) {
        clearInterval(interval);
        resolve();
      }
    };
    const interval = setInterval(checkProgress, 1000); // Check every second
  });
});

ipcMain.on("search-request", (event, searchQuery: SearchResult) => {
  // Use master index db to go through all text files
  parseIndexDB(path.join(indexPath, INDEX_DB_FILENAME)).then(
    (records: Array<IndexRecord>) => {
      for (const record of records) {
        const { id, docPath } = record;
        // Recursively search the index folder that contains text
        const indexDocPath = path.join(indexPath, id);
        fsp.readdir(indexDocPath).then((files) => {
          for (const file of files) {
            // file is just the page text file name, not full path
            const p = path.join(indexDocPath, file);
            searchTextInFile(p, searchQuery).then((res) => {
              if (res.success && res.matches > 0) {
                console.log(`Found at page ${file} of ${docPath}`);
                const result: SearchResult = {
                  docName: path.basename(docPath),
                  docPath: docPath,
                  id,
                  page: parseInt(file.replace(".txt", ""), 10),
                };
                event.sender.send("search-result", result);
              }
            });
          }
        });
      }
    }
  );
});

ipcMain.handle("read-pdf-file", async (event, filePath) => {
  try {
    const data = await fsp.readFile(filePath);
    return new Uint8Array(data).buffer;
  } catch (error) {
    console.error("Error reading PDF file:", error);
    return null;
  }
});

ipcMain.handle("directory-pick", async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  return !result.canceled ? result.filePaths[0] : "";
});

ipcMain.on("save-config", (event, cfg: { Tess: string; Gs: string }) => {
  console.log("Received settings: ", cfg);
  // Save config.ini
  fs.writeFileSync(
    path.join(appDir, "config.ini"),
    /*
      Example:
        TESSDATA_PREFIX = S:\Apps\Tesseract-OCR\tessdata\
        TESSERACT = S:\Apps\Tesseract-OCR\
        GHOSTSCRIPT = S:\Apps\gs\gs10.01.1\bin\
    */
    ini.stringify(
      {
        TESSERACT: cfg.Tess,
        TESSDATA_PREFIX: path.join(cfg.Tess, "tessdata/"),
        GHOSTSCRIPT: path.join(cfg.Gs, "bin/"),
      },
      { section: "OCR" }
    )
  );
  return;
});

ipcMain.handle("load-config", (event) => {
  return fs.existsSync(path.join(appDir, "config.ini"));
});

ipcMain.handle("get-env", (event) => {
  return appDir;
});

ipcMain.handle("check-env", async (event, cfg) => {
  const { Tess, Gs } = cfg;

  // Check if `tesseract.exe` exists in Tess
  const tesseractExists = fs.existsSync(path.join(Tess, "tesseract.exe"));

  // Check if folder `tessdata` exists in Tess
  const tessdataExists = fs.existsSync(path.join(Tess, "tessdata"));

  // Check if folder `bin` exists in Gs
  const binExists = fs.existsSync(path.join(Gs, "bin"));

  // Return the results
  return {
    TessExists: tesseractExists,
    TessDataExists: tessdataExists,
    GsBinExists: binExists,
  };
});

ipcMain.handle("delete-index", (event) => {
  deletePathSync(indexPath);
  createFolderIfNotExists(indexPath);
});

// ipcMain.handle(
//   "in-page-text-search",
//   (event, result: SearchResult, searchQuery: string) => {
//     const { docPath, id, page } = result;
//     const pageFilename = page.toString().padStart(4, "0") + ".txt";
//     const pagePath = path.join(indexPath, id, pageFilename);
//     return findStrPercByLines(pagePath, searchQuery);
//   }
// );
