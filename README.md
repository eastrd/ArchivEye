# ArchivEye

## Introduction

- TODO: Explain what ArchivEye does / problems it solves / who uses it
- TODO: Screenshots / Gifs

## Installation

### 1. Install Tesseract

#### Windows

- Download and install the latest version 5.3.1 from [uni-mannheim](https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.3.1.20230401.exe)

#### Mac

- Under Terminal, run `brew install tesseract`

#### Linux

- Tesseract is already included in most Linux distributions

### 2. Install GhostScript

- Go to [this page](https://github.com/ArtifexSoftware/ghostpdl-downloads/releases) and download and install according to your system platform (For Windows Users, use `gs10011w64.exe`)

### 3. Tell ArchivEye the location of the above two

- There will be a settings page when it is your first time using ArchivEye
- Use the `Select` buttons for Tesseract and GhostScript:
  - Select the directory where you have installed Tesseract, for example mine is `S:\Apps\Tesseract-OCR\`
  - Select the directory where you have installed Ghostscript, for example mine is `S:\Apps\gs\gs10.01.1\`
  - After that press `Check Installations` to proceed

---

## TODO

### Backend

- [x] Add indexing system
  - [x] Add progress feedback
- [x] Set index path to be at app path by default
- [x] Add search system
- [ ] Add threading for multiple workers to index a directory

### Frontend

- [x] DARK THEME MYSELF PLZZZZ! IT'S HURTING MY OWN EYES
  - [ ] Fix inconsistent dark mode
- [x] Setup Page: Index Folder & PDF Document Folder setter
  - [x] Receive backend's OCR progress and display it on a horizontal progress bar
  - [x] Cross out (1) button after selection, cross out (2) button after indexing starts
  - [x] Make both of buttons disabled after indexing starts
  - [x] Add relevant random wait phrases
  - [x] When OCR is completed, show an overlay with a button that proceeds to search page
  - [x] Check if index DB already exists, if so provide an option to go straight to search
  - [x] Add option to index more documents
  - [x] Filter only PDF files
- [x] Refactor out index path setting
- [x] Search Page: Initial Layout
  - [x] Update search result continuously
  - [x] Display on a results table (Fix partial state issue)
  - [x] Tooltip on hover of the pdf document name
  - [x] Implement view to the side
  - [x] Spike: PDF Viewer
  - [x] Pagination of search result display
  - [ ] Spike: Search result highlighting
- Pre-Check Page:
  - [x] Check if config.ini is present, if not create one and ask user to set up
  - [ ] If config.ini is present, check if paths appointed exists and required binaries exist


### Meta

- [ ] Add setup instructions & Test if it works
- [x] Test Electron packaging
  - [x] Fix the shitty canvas bug
- [x] Figure out how to get environment variables to work for users
- [ ] Add initial tests to verify OCR and Img extraction are working correctly with sample PDF and images and texts
- [ ] Need better descriptions for the app landing page
 
## Design

### Indexing System

- User select an empty directory to store index files
- Index Logic
  - For each PDF document
    - Generate a UUID
      - Append the "UUID to book path relation" to a master CSV
      - Create a temp folder "IMG_{UUID}" for containing all images from the Ghostscript PDF
      - Create a folder "{UUID}" for txt for each page from OCR'd images
      - Delete temp folder for images

- Search Logic
  - Parse index db file into mapping relations
  - When user enters a search term, look up all folders under the same directory as the index db file
  - For any found records, append into a result list

- Render logic
  - For a given PDF file path and a page number, display it to the frontend