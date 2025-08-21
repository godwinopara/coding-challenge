"use client";

import { ChangeEvent, useState } from "react";
import Form, { IFormState } from "@/components/form";
import toast from "react-hot-toast";
import { DataTable } from "@/features/record-table/data-table";
import { columns } from "@/features/record-table/columns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IRecords } from "@/types/record";


export default function Home() {
  const [formLength, setFormLength] = useState<number>(0);
  const [records, setRecords] = useState<IRecords[]>([]);

  /* ==== Add New Record To Records ==== */

  const addRecord = (data: IFormState) => {
    const newRecord = [...records, data] as IRecords[];
    setRecords(newRecord);
    toast.success("New Record Added Successfully");
  };

  return (
    <div className="p-10">
      {/* ======  Input  ======== */}

      <div className="max-w-7xl mx-auto space-y-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dynamic Form Interface</h1>
          <p className="text-muted-foreground">
            Create multiple validated forms and manage records
          </p>
        </div>

        {/* Form Count Input */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Form Generator</CardTitle>
            <CardDescription>Enter the number of forms to generate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="formCount">Number of Forms</Label>
              <Input
                id="formCount"
                type="text"
                value={String(formLength)}
                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                  setFormLength(Number(e.target.value))
                }
                placeholder="Enter digits only"
                className="text-center text-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>

     

      {/* ======= Display Form ======= */}

      <div className="grid gap-6 mb-20 lg:grid-cols-3 lg:px-20 justify-center mx-auto">
        {formLength > 0 &&
          Array.from(Array(formLength).keys()).map((_, index) => {
            return <Form key={index} submitForm={addRecord} />;
          })}
      </div>

      {/* ======= Records Table =========*/}
      <div className="max-w-5xl mx-auto">
        <DataTable columns={columns} data={records} />
      </div>
    </div>
  );
}
