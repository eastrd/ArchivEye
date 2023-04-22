# ArchivEye

## TODO

### Frontend

- TODO

### Backend

- [x] Add indexing system
  - [x] Add progress feedback
- [x] Set index path to be at app path by default
- [ ] Add search system
- [ ] Add threading for multiple workers to index a directory
- [ ] Add initial tests to verify OCR and Img Ext are working with sample PDF and images and texts


### Frontend

- [x] Setup Page: Index Folder & PDF Document Folder setter
  - [x] Receive backend's OCR progress and display it on a horizontal progress bar
  - [x] Cross out (1) button after selection, cross out (2) button after indexing starts
  - [x] Make both of buttons disabled after indexing starts
  - [x] Add relevant random wait phrases
  - [x] When OCR is completed, show an overlay with a button that proceeds to search page
- [x] Refactor out index path setting
- [ ] Search Page
- [ ] DARK THEME MYSELF PLZZZZ! IT'S HURTING MY OWN EYES


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