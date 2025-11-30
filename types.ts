export interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'done' | 'error';
  parsedData?: SheetData; // Store the parsed content
}

export type CellValue = string | number | boolean | null | undefined;

// Array of Arrays representation of an Excel sheet
export type SheetData = CellValue[][];

export interface MergeResult {
  fileName: string;
  data: SheetData;
  headers: CellValue[]; // First row
}

export interface AnalysisResult {
  summary: string;
  keyTrends: string[];
}