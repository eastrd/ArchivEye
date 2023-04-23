# ArchivEye

## Team Members

- [eastrd](https://github.com/eastrd/)
- [ATroubledMaker](https://ipyt.info/)
- [deltagear](https://github.com/michaelgailling/) 

## Tool Description

ArchivEye is a completely offline PDF OCR tool designed to protect the privacy and confidentiality of sensitive documents.

It is a powerful and intuitive GUI application specifically tailored for lawyers, OSINT researchers, journalists, and other professionals who frequently work with PDF documents.

ArchivEye's OCR technology allows users to search through scanned and non-searchable PDF files without needing to upload them to the cloud, providing an extra layer of privacy and security.

It focuses on accessibility, ensuring that even non-technical users can navigate and utilize the software effortlessly. It significantly reduces the time spent on manual tasks, such as opening multiple PDFs, reading, note taking manually, and cross-referencing information, by providing a unified interface for searching and indexing PDF documents.

---

## Installation

### Prerequisites

ArchivEye requires Tesseract and GhostScript to be installed on your system. 

Follow the steps below to install these third-party tools

#### Install Tesseract

Tesseract is an integral part of ArchivEye, providing powerful OCR capabilities that convert extracted individual pages into searchable text.

Download and install the latest version 5.3.1 from uni-mannheim

#### Install GhostScript

GhostScript is used to extract individual pages from the PDF file as images for Tesseract to OCR.

Go to this page and download and install gs10011w64.exe

## ArchivEye Installation

Simply go to the `Release` section of this Github page and download the `.exe` file, double click and it will install automatically

---

## Usage

### First Time Setup

During the first-time setup, you will need to configure the tool by specifying the paths to the installed Tesseract and GhostScript tools. Use the Select buttons for Tesseract and GhostScript:

- Select the directory where you have installed Tesseract, for example mine is `S:\Apps\Tesseract-OCR\`
- Select the directory where you have installed Ghostscript, for example mine is `S:\Apps\gs\gs10.01.1\`
- After that press `Validate & Proceed` to proceed

![First Time Setup Screenshot](/screenshots/precheck.png)


### Indexing

![Indexing Screenshot](/screenshots/index.png)


### Search

![Search Screenshot](/screenshots/search.png)


## Additional Information: Design

### Architecture Choice

This tool prioritizes accessibility and privacy, so web apps and command-line tools are not suitable options.

OCR capability is necessary, which initially suggests using Python with GUI libraries (e.g., `PyQT5`/`Tkinter`). However, these don't provide the same aesthetic appeal as a browser-based frontend built with `React`.

Ultimately, an Electron app is chosen. Combining Electron with Python is possible, but integrating them proved challenging due to my limited experience with webpacks. As a result, I opted for `Electron` + `Next.js` = [`Nextron`](https://github.com/saltyshiomix/nextron) and `Node.js`.

### Indexing Design

For each PDF document, we generate a UUID to represent it. 

A "master" record containing all generated UUIDs and their corresponding filesystem paths is also generated.

### OCR Design

This tool aims to search scanned PDF documents on a per-page basis. To achieve this, we need to extract every single page from a PDF document, perform OCR on the resulting images, and generate text files for each page.

Ghostscript is used to extract individual PDF pages into images, while Tesseract handles OCR for each image. After OCR is completed for a PDF document, the per-page images are deleted from the filesystem.

### Search Logic

To display search results on a per-page basis, we store per-page text files and perform search operations as if conducting a recursive directory search.

This process involves scanning each folder named by the UUID of the PDF document and searching through each text file to return the page number associated with its PDF document.

### Limitations

OCR can be slow, particularly for PDF documents with hundreds of pages. Processing time may vary depending on your PC hardware specifications.