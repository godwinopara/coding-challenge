// utils/exportToExcel.ts
import * as XLSX from 'xlsx';
import { IRecords } from "../models/record.model";

export function exportToExcel(records: IRecords[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(records);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Records");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
