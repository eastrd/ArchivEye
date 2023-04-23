# TODO

## Backend

- [x] Add indexing system
  - [x] Add progress feedback
- [x] Set index path to be at app path by default
- [x] Add search system
- [x] Fix app path bug

## Frontend

- [x] DARK THEME MYSELF PLZZZZ! IT'S HURTING MY OWN EYES
  - [x] Fix inconsistent dark mode
- [x] Setup Page: Index Folder & PDF Document Folder setter
  - [x] Receive backend's OCR progress and display it on a horizontal progress bar
  - [x] Cross out (1) button after selection, cross out (2) button after indexing starts
  - [x] Make both of buttons disabled after indexing starts
  - [x] Add relevant random wait phrases
  - [x] When OCR is completed, show an overlay with a button that proceeds to search page
  - [x] Check if index DB already exists, if so provide an option to go straight to search
  - [x] Add option to index more documents
  - [x] Filter only PDF files
  - [x] For index found users, disable the "Start Search" button when they are indexing
  - [x] Prompt a previous-index-db deletion confirmation if user wants to index on top of already indexed databases
- [x] Refactor out index path setting
- [x] Search Page
  - [x] Update search result continuously
  - [x] Display on a results table (Fix partial state issue)
  - [x] Tooltip on hover of the pdf document name
  - [x] Implement view to the side
  - [x] Implement PDF Viewer
    - [ ] Add color invert (My EYES!!)
    - [x] Add Zoom in / out (My EYES!)
  - [x] Pagination of search result display
  - [x] Show text with highlights of where the search query appears
- Pre-Check Page
  - [x] Check if config.ini is present, if not create one and ask user to set up
  - [x] Fix race condition between state update and config save
  - [x] If config.ini is present, validate that the binaries/folders in the paths exist
  - [ ] Populate paths settings from config if exists
- [x] Fix Blank page routing bug

## Meta

- [x] Add setup instructions & Test if it works
- [x] Test Electron packaging
  - [x] Fix the shitty canvas bug
- [x] Figure out how to get environment variables to work for users
- [x] Move third-party software installation instructions inside the precheck page for more clarity
- [x] Add descriptions of what GhostScript and Tesseract does
- [x] Indexing new data will delete old indexed data
- [ ] Need better descriptions about ArchivEye on home page
- [ ] Speed up indexing efficiency
- [x] Add tests to ensure both binaries are installed and can be executed, use sample image and pdf to validate these
- [x] Add settings button that goes to precheck page to validate paths and binaries
