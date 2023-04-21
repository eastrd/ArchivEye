import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import path from "path";
import {
  CreateFolder,
  DeleteFolder,
  DisplayEnvs,
  PDFToImgs,
  SamplePDF,
  TessCMD,
  WriteOrAppendToFile,
} from "./ocr";
import { v4 as uuidv4 } from "uuid";

let mainWindow: Electron.CrossProcessExports.BrowserWindow;
const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1000,
    height: 800,
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

// Let User select index db path
let indexPath: string;
let ocrProgress: number = 0;

ipcMain.on("file-list", async (_event, paths) => {
  let counter = 0;
  for (const p of paths) {
    // For now, only index PDF files
    if (path.extname(p) !== ".pdf") {
      continue;
    }

    const uid = uuidv4();
    // Append the "UUID to book path relation" to a master CSV
    const dbPath = path.join(indexPath, "master.sf");
    const record = `${uid}|||${p}`;
    WriteOrAppendToFile(dbPath, record + "\n");

    // Create a temp folder to contain all extracted page images from the PDF
    const pageImgDir = path.join(indexPath, `tmp_${uid}`);
    CreateFolder(pageImgDir);

    // Create a folder for OCR'd texts
    const txtDir = path.join(indexPath, `${uid}`);
    CreateFolder(txtDir);

    const pageImgNames = await PDFToImgs(p, pageImgDir);
    for (const pageImgName of pageImgNames) {
      const pageImgPath = path.join(pageImgDir, pageImgName);

      await TessCMD(pageImgPath, txtDir).catch((err) =>
        console.log(`Tesseract error when ocr ${p}: ${err}`)
      );
      console.log(`OCR'd Page ${pageImgName}`);
    }
    console.log(`Finish OCR ${p}`);
    DeleteFolder(pageImgDir);

    counter++;
    ocrProgress = (counter / paths.length) * 100;
  }
});

ipcMain.handle("open-directory-dialog", async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (!result.canceled) {
    indexPath = result.filePaths[0];
    return indexPath;
  } else {
    return null;
  }
});

ipcMain.handle("get-ocr-progress", (event) => {
  return ocrProgress;
});

ipcMain.handle("done-ocr", async () => {
  return new Promise<void>((resolve) => {
    const checkProgress = () => {
      if (ocrProgress === 100) {
        clearInterval(interval);
        resolve();
      }
    };
    const interval = setInterval(checkProgress, 1000); // Check every 1000ms (1 second)
  });
});
