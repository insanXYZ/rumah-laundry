"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { ListCharge, ListChargesResponse } from "@/app/dto/monthly-money-dto";
import { ConvertRupiah } from "@/utils/utils";

const columns: ColumnDef<ListCharge>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "quantity",
    header: "Jumlah Kg",
  },
  {
    header: "Status Pembayaran",
    cell: ({ row }) => {
      return row.original.payed ? "Bayar" : "Belum";
    },
  },
  {
    header: "Harga",
    cell: ({ row }) => {
      return ConvertRupiah(row.original.total_price);
    },
  },
  {
    accessorKey: "period",
    header: "Periode",
  },
];

export default function ChargePage() {
  const { data } = useQueryData(
    ["getCharges"],
    "/monthly-moneys/charge"
  );

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full">
        <DataTable columns={columns} data={data?.data ?? []} />
      </div>
    </div>
  );
}
