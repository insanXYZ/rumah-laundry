"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { ListSantriMonthlyMoney } from "@/app/dto/monthly-money-dto";
import { AddMonthlyMoneyButton } from "@/components/monthly-money/add-monthly";
import { DeleteMonthlyButton } from "@/components/monthly-money/delete-monthly";
import { formatToLocalTimezone } from "@/utils/utils";

const columns: ColumnDef<ListSantriMonthlyMoney>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "type",
    header: "Jenis Bulanan",
  },
  {
    header: "Tanggal",
    cell: ({ row }) => {
      return formatToLocalTimezone(row.original.created_at);
    },
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      return <DeleteMonthlyButton id={row.original.id.toString()} />;
    },
  },
];

export default function MonthlyMoneyPage() {
  const [smm, setSmm] = useState<ListSantriMonthlyMoney[]>([]);

  const { isPending, isSuccess, data } = useQueryData(
    ["getSmm"],
    "/monthly-moneys"
  );

  useEffect(() => {
    if (isSuccess && data?.data) {
      setSmm(data.data);
    }
  }, [isSuccess, data]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between">
        <AddMonthlyMoneyButton />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={smm} />
      </div>
    </div>
  );
}
