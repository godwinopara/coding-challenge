"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import CalendarPopUp from "@/components/calendar-popup";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import ExportExcelButton from "@/components/export-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IRecords } from "@/types/record";

// Define props that the DataTable component expects
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Column definitions for the table
  data: TData[]; // Array of data to display in the table
}

// Generic data table component with filtering, pagination, and export functionality
export function DataTable<TData extends IRecords, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // State for text-based filtering (searches fullName and phoneNumber)
  const [globalFilter, setGlobalFilter] = useState<string>("");
  // State for column-specific filters
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // State for date range filtering
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Initialize the TanStack React Table with configuration
  const table = useReactTable({
    data, // The data to display
    columns, // Column definitions
    onGlobalFilterChange: setGlobalFilter, // Handle global filter changes
    getCoreRowModel: getCoreRowModel(), // Basic table functionality
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering
    onColumnFiltersChange: setColumnFilters, // Handle column filter changes
    state: {
      globalFilter, // Current global filter value
      columnFilters, // Current column filters
    },
    // Custom global filter function - searches in fullName and phoneNumber fields
    globalFilterFn: (row, columnId, filterValue) => {
      const fullName = row.getValue("fullName") as string;
      const phoneNumber = row.getValue("phoneNumber") as string;

      // Return true if filter value is found in either fullName or phoneNumber
      return (
        fullName.toLowerCase().includes(filterValue.toLowerCase()) ||
        phoneNumber.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  });

  // Effect to apply date range filter to the date column when dateRange changes
  useEffect(() => {
    table.getColumn("date")?.setFilterValue(dateRange);
  }, [dateRange, table]);

  return (
    <Card>
      {/* ============== FILTERS SECTION ============= */}
      <CardHeader>
        {/* Header with title, record count, and export button */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="mb-4 lg:mb-0">
            <CardTitle>Form Records</CardTitle>
            <CardDescription>
              {/* Show filtered count vs total count */}
              {table.getFilteredRowModel().rows.length} of {data.length} records
            </CardDescription>
          </div>
          {/* Export button - gets filtered data from table */}
          <ExportExcelButton
            filteredRecords={table.getFilteredRowModel().rows.map((row) => row.original)}
          />
        </div>

        {/* Filter controls: text search and date range picker */}
        <div className="flex flex-col gap-4 lg:flex-row items-center justify-between py-4">
          {/* Text input for searching fullName and phoneNumber */}
          <Input
            placeholder="Filter FullName or Phone Number..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className=" py-5 px-4"
          />
          {/* Calendar component for date range filtering */}
          <CalendarPopUp onChange={setDateRange} />
        </div>
      </CardHeader>

      {/* ============ TANSTACK REACT TABLE SECTION =========== */}

      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            {/* Table Header - renders column headers */}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {/* Render header content, skip if it's a placeholder */}
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            {/* Table Body - renders data rows */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                // Render each row of filtered/paginated data
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {/* Render each cell in the row */}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {/* Render cell content using column definition */}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                // Show "No results" message when no data matches filters
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* ========== PAGINATION CONTROLS ========== */}

          <div className="flex items-center justify-end space-x-2 py-4">
            {/* Previous page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()} // Disable if on first page
            >
              <FaArrowLeft />
            </Button>

            {/* Page indicator showing current page and total pages */}
            <div className="flex w-[100px] items-center justify-center text-sm font-semibold">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>

            {/* Next page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()} // Disable if on last page
            >
              <FaArrowRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
