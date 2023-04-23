# ArchivEye

## Introduction

ArchivEye is a powerful and intuitive GUI application designed to streamline the workflow of lawyers, OSINT researchers, journalists, and other professionals who frequently work with PDF documents. By leveraging Optical Character Recognition (OCR) technology, ArchivEye enables users to search through scanned and non-searchable PDF files with ease.

ArchivEye focuses on accessibility, ensuring that even non-technical users can navigate and utilize the software effortlessly. It significantly reduces the time spent on manual tasks, such as opening multiple PDFs, reading, note taking manually, and cross-referencing information, by providing a unified interface for searching and indexing PDF documents.

## Features

- Simple one-time initialization for setting up the third-party OCR tool paths
- OCR capabilities to make scanned PDF files searchable
- A user-friendly search input for keyword-based searching across all indexed PDFs
- Display of search results with corresponding PDF file and page number for easy reference
- Support for indexing additional documents and paths, with search results spanning across all indexed locations, including historical ones
- Dark-themed user interface to reduce eye strain and ensure a comfortable experience, especially for those working long hours or at night
- ArchivEye aims to enhance productivity and provide a seamless, accessible solution for professionals in need of efficient PDF document management and searching

## Screenshots

### First Time Setup

![First Time Setup Screenshot](/screenshots/precheck.png)

### Indexing

![Indexing Screenshot](/screenshots/index.png)

### Search

TODO

## Third Party Tooling Installation - Windows Only (For Now)

### 1. Install Tesseract

Tesseract is an integral part of ArchivEye, providing powerful OCR capabilities that converts extracted individual pages into searchable text.

Download and install the latest version 5.3.1 from [uni-mannheim](https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.3.1.20230401.exe)


### 2. Install GhostScript

GhostScript is used to extract individual pages from the PDF file as images for Tesseract to OCR.

Go to [this page](https://github.com/ArtifexSoftware/ghostpdl-downloads/releases) and download and install `gs10011w64.exe`


### 3. Tell ArchivEye the location of the above two

There will be a settings page when it is your first time using ArchivEye

Use the `Select` buttons for Tesseract and GhostScript:

- Select the directory where you have installed Tesseract, for example mine is `S:\Apps\Tesseract-OCR\`
- Select the directory where you have installed Ghostscript, for example mine is `S:\Apps\gs\gs10.01.1\`
- After that press `Validate & Proceed` to proceed
