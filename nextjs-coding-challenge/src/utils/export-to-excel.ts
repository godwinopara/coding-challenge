// utils/exportToExcel.ts
import { IRecords } from "@/types/record";
import * as XLSX from "xlsx";

export function exportToExcel(records: IRecords[], fileName: string) {

/* ======== Generate Temporary Blob URL for the image =========  */

  const sanitizedRecords = records.map(record => ({
    ...record,
    profilePicture: record.profilePicture ? URL.createObjectURL(record.profilePicture) : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(sanitizedRecords);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Records");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  /* ============ CREATE A LINK FOR DOWNLOADING SHEET ============ */
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
