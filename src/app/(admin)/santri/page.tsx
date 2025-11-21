"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { Santri } from "@/app/dto/santri-dto";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { AddSantriButton } from "@/components/santri/add-santri";

const columns: ColumnDef<Santri>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "class",
    header: "Kelas",
  },
  {
    accessorKey: "number_phone",
    header: "Nomor Hp",
  },
];

export default function SantriPage() {
  const [santris, setSantris] = useState<Santri[]>([]);

  const { isPending, isSuccess, data } = useQueryData(
    ["getSantris"],
    "/santri"
  );

  useEffect(() => {
    if (isSuccess && data?.data) {
      setSantris(data.data);
    }
  }, [isSuccess, data]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between">
        <AddSantriButton />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={santris} />
      </div>
    </div>
  );
}
