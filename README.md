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
