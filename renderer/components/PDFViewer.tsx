import React, { useEffect, useRef, useState } from "react";
import { ipcRenderer } from "electron";
import { Box, Button } from "@chakra-ui/react";

type Props = {
  pdfPath: string;
  page: number;
};

const PDFViewer = ({ pdfPath, page }: Props) => {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async function () {
      // We import this here so that it's only loaded during client-side rendering.
      const pdfJS = await import("pdfjs-dist/build/pdf");
      pdfJS.GlobalWorkerOptions.workerSrc =
        window.location.origin + "/pdf.worker.min.js";

      // Request the ArrayBuffer of the PDF file from the main process
      const arrayBuffer = await ipcRenderer.invoke("read-pdf-file", pdfPath);

      if (arrayBuffer) {
        const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
        const pageObj = await pdf.getPage(page);
        const viewport = pageObj.getViewport({ scale: 1.5 });

        // Prepare canvas using PDF page dimensions.
        const canvas = pdfCanvasRef.current;
        const canvasContext = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context.
        const renderContext = { canvasContext, viewport };
        await pageObj.render(renderContext);
      } else {
        console.error("Error loading PDF file");
      }
    })();
  }, [pdfPath, page]);

  return (
    <Box>
      <canvas
        style={{
          maxWidth: "47%",
          objectFit: "contain",
          position: "absolute",
          zIndex: 1,
        }}
        ref={pdfCanvasRef}
      ></canvas>
    </Box>
  );
};

export default PDFViewer;
