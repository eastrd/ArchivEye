export type SearchResult = {
  id: string;
  docName: string;
  docPath: string;
  page: number;
};

// One row in master.sf file
export type IndexRecord = {
  id: string;
  docPath: string;
};
