import * as XLSX from 'xlsx';
import { SheetData } from '../types';

/**
 * Reads an Excel file and returns the first sheet as a 2D array.
 */
export const readExcelFile = (file: File): Promise<SheetData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        // header: 1 returns an array of arrays
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as SheetData;
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Merges multiple sheet data arrays by summing numeric values at identical indices.
 */
export const mergeSheets = (sheets: SheetData[]): SheetData => {
  if (sheets.length === 0) return [];
  
  // Use the first sheet as the base template
  const template = sheets[0];
  const merged: SheetData = JSON.parse(JSON.stringify(template)); // Deep copy to avoid mutating original

  // Iterate through remaining sheets
  for (let i = 1; i < sheets.length; i++) {
    const currentSheet = sheets[i];
    
    // Iterate rows
    for (let r = 0; r < currentSheet.length; r++) {
      if (!merged[r]) {
        // If template doesn't have this row, add it (optional, based on "identical format" rule usually this implies strictness, but we'll be robust)
        merged[r] = [...currentSheet[r]];
        continue;
      }

      // Iterate columns
      for (let c = 0; c < currentSheet[r].length; c++) {
        const val1 = merged[r][c];
        const val2 = currentSheet[r][c];

        // LOGIC: If both are numbers, sum them. Otherwise, keep the base value.
        // We parse float to handle potential string-numbers, though usually XLSX handles typing well.
        const num1 = typeof val1 === 'number' ? val1 : parseFloat(val1 as string);
        const num2 = typeof val2 === 'number' ? val2 : parseFloat(val2 as string);

        if (!isNaN(num1) && !isNaN(num2)) {
          merged[r][c] = num1 + num2;
        } 
        // If not numbers, we simply leave the template value (e.g. headers, labels)
      }
    }
  }

  return merged;
};

/**
 * Exports data to an Excel file and triggers download.
 */
export const exportToExcel = (data: SheetData, fileName: string = 'merged_output.xlsx') => {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  // Localized sheet name: "Merged Result" -> "合并结果"
  XLSX.utils.book_append_sheet(workbook, worksheet, "合并结果");
  XLSX.writeFile(workbook, fileName);
};