import React, { useEffect, useRef, useState } from "react";
import { ipcRenderer } from "electron";
import { Box, Button } from "@chakra-ui/react";

type Props = {
  pdfPath: string;
  page: number;
};

const PDFViewer = ({ pdfPath, page }: Props) => {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState(0.95);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    const startX = event.clientX;
    const startY = event.clientY;

    const handleMouseMove = (event) => {
      const dragSensitivity = 0.02; // Adjust the sensitivity (0.5 means half the mouse movement)
      const dx = (event.clientX - startX) * dragSensitivity;
      const dy = (event.clientY - startY) * dragSensitivity;

      setPanOffset((prevOffset) => {
        const container = pdfCanvasRef.current.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const canvasWidth = pdfCanvasRef.current.clientWidth * zoomLevel;
        const canvasHeight = pdfCanvasRef.current.clientHeight * zoomLevel;

        const minX = Math.min(0, containerWidth - canvasWidth);
        const minY = Math.min(0, containerHeight - canvasHeight);
        const maxX = Math.max(0, containerWidth);
        const maxY = Math.max(0, containerHeight);

        const newX = Math.min(maxX, Math.max(minX, prevOffset.x + dx));
        const newY = Math.min(maxY, Math.max(minY, prevOffset.y + dy));

        return { x: newX, y: newY };
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel - 0.1);
  };

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
        const viewport = pageObj.getViewport({ scale: zoomLevel });

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
  }, [pdfPath, page, zoomLevel]);

  return (
    <Box>
      <Box display="flex" justifyContent="center" mb={2}>
        <Button isDisabled={zoomLevel > 1.5} onClick={handleZoomIn} mr={2}>
          Zoom In
        </Button>
        <Button isDisabled={zoomLevel < 0.93} onClick={handleZoomOut}>
          Zoom Out
        </Button>
      </Box>
      <Box
        position="relative"
        zIndex={1}
        width="98%"
        height="70vh"
        backgroundColor="gray.200"
        overflow="hidden"
        display="flex"
        justifyContent="center"
        alignItems="center"
        onMouseDown={handleMouseDown}
      >
        <canvas
          style={{
            position: "absolute",
            zIndex: 1,
            transformOrigin: "top left",
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          }}
          ref={pdfCanvasRef}
        ></canvas>
      </Box>
    </Box>
  );
};

export default PDFViewer;
