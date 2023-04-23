import React, { useEffect, useRef, useState } from "react";
import { ipcRenderer } from "electron";
import { Box, Button } from "@chakra-ui/react";

type Props = {
  pdfPath: string;
  page: number;
  highlightPortion: number;
};

const PDFViewer = ({ pdfPath, page, highlightPortion }) => {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const highlightCanvasRef = useRef<HTMLCanvasElement>(null);

  // const [invertColors, setInvertColors] = useState(true);

  // const toggleInvertColors = () => {
  //   setInvertColors(!invertColors);
  // };

  // useEffect(() => {
  //   applyInvertColors();
  // }, [invertColors]);

  // Draw a rectangular highlight on the canvas
  const drawHighlight = (canvasContext, position, width, height) => {
    const { x, y } = position;
    canvasContext.fillStyle = "rgba(255, 255, 0, 0.3)"; // Set the fill style to a transparent yellow
    canvasContext.fillRect(x, y, width, height);
  };

  // const applyInvertColors = () => {
  //   console.log("apply invert!");
  //   if (invertColors && pdfCanvasRef.current) {
  //     const canvas = pdfCanvasRef.current;
  //     const canvasContext = canvas.getContext("2d");
  //     const imageData = canvasContext.getImageData(
  //       0,
  //       0,
  //       canvas.width,
  //       canvas.height
  //     );
  //     for (let i = 0; i < imageData.data.length; i += 4) {
  //       imageData.data[i] = 255 - imageData.data[i];
  //       imageData.data[i + 1] = 255 - imageData.data[i + 1];
  //       imageData.data[i + 2] = 255 - imageData.data[i + 2];
  //     }
  //     canvasContext.putImageData(imageData, 0, 0);
  //   }
  // };

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

        // Set up the highlight canvas with the same dimensions as the PDF canvas
        const highlightCanvas = highlightCanvasRef.current;
        const highlightCanvasContext = highlightCanvas.getContext("2d");
        highlightCanvas.height = viewport.height;
        highlightCanvas.width = viewport.width;

        // Calculate the highlight position, width, and height as a percentage of the canvas dimensions
        const highlightPosition = {
          x: 0, // 20% from the left
          y: (viewport.height * highlightPortion) / 100, // 20% from the top
        };
        const highlightWidth = viewport.width;
        const highlightHeight = (viewport.height * 10) / 100; // 20% of the canvas height

        // Call the drawHighlight function with the calculated values
        // drawHighlight(
        //   highlightCanvasContext,
        //   highlightPosition,
        //   highlightWidth,
        //   highlightHeight
        // );
      } else {
        console.error("Error loading PDF file");
      }
    })();
    // }, [pdfPath, page, highlightPortion]);
  }, [pdfPath, page]);

  return (
    <Box>
      {/* <Button onClick={toggleInvertColors}>Invert Color</Button> */}
      <canvas
        style={{
          maxWidth: "45%",
          objectFit: "contain",
          position: "absolute",
          zIndex: 1,
        }}
        ref={pdfCanvasRef}
      ></canvas>

      <canvas
        style={{
          width: "45%",
          objectFit: "contain",
          position: "absolute",
          zIndex: 2,
        }}
        ref={highlightCanvasRef}
      ></canvas>
    </Box>
  );
};

export default PDFViewer;
