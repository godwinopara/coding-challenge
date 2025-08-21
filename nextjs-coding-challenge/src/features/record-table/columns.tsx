"use client";

import { IRecords } from "@/types/record";
import { normalizeDate } from "@/utils/normalize-date";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";



export const columns: ColumnDef<IRecords>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "profilePicture",
    header: "Profile Picture",
    cell: ({ row }) => {
      const profilePicture = row.original.profilePicture;
      if (!profilePicture) return null;
      return (
        <Image
          src={URL.createObjectURL(profilePicture)}
          alt="Thumbnail"
          className="w-10 h-10 rounded-full object-cover border"
          height={20}
          width={20}
        />
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date Submitted",
    cell: ({ row }) => {
      const date = row.original.date;
      return date.toLocaleString();
    },
    filterFn: (row, id, value) => {
      const date: Date = row.getValue(id);
      const { from, to } = value || {};
      if (!from || !to) return true;

      const day = normalizeDate(date)
      return day >= normalizeDate(from) && day <= normalizeDate(to);
    },
  },
];
