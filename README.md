
# ArchivEye

Article and Demo Video [available here](https://ipyt.info/archiveye.html) thanks to [ATroubledMaker](https://ipyt.info/)

## Description

ArchivEye is an offline PDF OCR tool developed to safeguard the privacy and confidentiality of sensitive documents.

This user-friendly GUI application is designed for professionals like lawyers, OSINT researchers, journalists, and others who often work with PDF documents.

ArchivEye's OCR technology enables users to search through scanned and non-searchable PDF files without uploading them to the cloud, offering added privacy and security.

The software prioritizes ease of use, allowing even those without technical expertise to navigate and use it smoothly. By offering a unified interface for searching and indexing multiple PDF documents within a folder, ArchivEye streamlines tasks such as opening numerous PDFs, reading, manual note-taking, and cross-referencing information, saving users valuable time.

---

## Installation

### Prerequisites

ArchivEye requires `Tesseract` and `GhostScript` to be installed on your system. 

Follow the steps below to install these third-party tools

#### Install Tesseract

`Tesseract` is an integral part of ArchivEye, providing powerful OCR capabilities that convert extracted individual pages into searchable text.

Download and install the latest version 5.3.1 from [uni-mannheim](https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.3.1.20230401.exe)

#### Install GhostScript

GhostScript is used to extract individual pages from the PDF file as images for Tesseract to OCR.

Go to [this page](https://github.com/ArtifexSoftware/ghostpdl-downloads/releases) and download and install `gs10011w64.exe`

## Download ArchivEye

Simply go to the [`Release`](https://github.com/eastrd/ArchivEye/releases/tag/v0.2.1) section of this Github page and download the `.exe` file, double click and it will install automatically

---

## Usage

### First Time Setup

During the first-time setup, you will need to configure the tool by specifying the paths to the installed Tesseract and GhostScript tools. Use the Select buttons for `Tesseract` and `GhostScript`:

- For `Tesseract`, select the folder `Tesseract-OCR`

- For `GhostScript`, be sure to select the folder that is inside `gs` but not `gs` itself, in the time of releasing this version of ArchivEye, mine would be `gs10.01.1`
      
Don't worry if you accidentally select the wrong paths, the `Validate & Proceed` button will validate the paths to make sure the paths are correct before we start indexing PDFs. It will also automatically run both the `Ghostscript` and `Tesseract` binaries on a dummy PDF to make sure these third party tools are working as expected

![First Time Setup Screenshot](/screenshots/precheck.png)

### Indexing

![Indexing Screenshot](/screenshots/index.png)


### Search

![Search Screenshot](/screenshots/search.png)


## Future Roadmap

- [ ] Make OCR index process faster
- [ ] Support more languages