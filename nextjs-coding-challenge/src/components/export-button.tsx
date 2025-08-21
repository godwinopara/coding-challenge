import React from "react";
import { Button } from "./ui/button";
import { exportToExcel } from "@/utils/export-to-excel";
import { FaDownload } from "react-icons/fa6";
import { IRecords } from "@/types/record";

interface IExportExcelButton {
  filteredRecords: IRecords[];
}

// Component that renders a button to export filtered records to Excel

export default function ExportExcelButton({ filteredRecords }: IExportExcelButton) {
  return (
    <Button
      className="py-5 px-6 lg:ml-auto font-bold cursor-pointer w-full lg:max-w-56"
    
      // When clicked, call the export utility function with the filtered records
      // Second parameter "filtered-records" will be the Excel file name
      onClick={() => exportToExcel(filteredRecords, "filtered-records")}
    >
      <FaDownload />
      <span>Export To Excel</span>
    </Button>
  );
}
