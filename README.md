# ArchivEye

## TODO

### Frontend

- TODO

### Backend

- [x] Add indexing system
- [ ] Add initial tests with sample PDF to check if GS and Tesseract has been set up properly
- [ ] Add threading for multiple workers to index a directory
- [ ] Implement index system


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