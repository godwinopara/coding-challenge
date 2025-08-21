"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CiCalendarDate } from "react-icons/ci";

interface ICalenderPopUp {
  onChange: (range: DateRange) => void;
}

export default function CalendarPopUp({ onChange }: ICalenderPopUp) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const handleSelectDateRange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range) {
      onChange(range);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="border w-full py-2 px-6 flex items-center justify-center gap-x-3 rounded-md cursor-pointer shadow-sm lg:max-w-56">
        <CiCalendarDate size={20} />
        {dateRange?.from ? (
          dateRange.to ? (
            <>
              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
            </>
          ) : (
            format(dateRange.from, "LLL dd, y")
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleSelectDateRange}
        />
      </PopoverContent>
    </Popover>
  );
}
