"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ListInventoryStock } from "@/app/dto/inventory-dto";
import { ColumnDef } from "@tanstack/react-table";
import { ConvertRupiah, formatToLocalTimezone } from "@/utils/utils";

const columns: ColumnDef<ListInventoryStock>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "stock",
    header: "Stok",
  },
  {
    header: "Harga",
    cell: ({ row }) => {
      return ConvertRupiah(row.original.price);
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    header: "Tanggal",
    cell: ({ row }) => {
      return formatToLocalTimezone(row.original.created_at);
    },
  },
];

export default function InventoryPage() {
  const [inventoriesStock, setInventoriesStock] = useState<
    ListInventoryStock[]
  >([]);

  const { isSuccess, data } = useQueryData(
    ["getInventoriesStock"],
    "/inventories/stock"
  );

  useEffect(() => {
    if (isSuccess && data?.data) {
      setInventoriesStock(data.data);
    }
  }, [isSuccess, data]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full">
        <DataTable columns={columns} data={inventoriesStock} />
      </div>
    </div>
  );
}
