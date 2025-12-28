"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import {
  ListInventoriesResponse,
  ListInventory,
} from "@/app/dto/inventory-dto";
import { AddInventoryButton } from "@/components/inventory/add-inventory";
import { ColumnDef } from "@tanstack/react-table";
import { EditInventoryButton } from "@/components/inventory/edit-inventory";
import { ManageStockButton } from "@/components/inventory/manage-stock-inventory";
import { InputSearchDebounce } from "@/components/ui/input-search-debounce";
import { ExportExcelExpendButton } from "@/components/inventory/export-excel";
import { DeleteInventoryButton } from "@/components/inventory/delete-inventory";

const columns: ColumnDef<ListInventory>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "stock",
    header: "Stok",
  },
  {
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <EditInventoryButton values={row.original} />
        <DeleteInventoryButton id={row.original.id!} /> 
        <ManageStockButton values={row.original} />
      </div>
    ),
  },
];

export default function InventoryPage() {
  const [searchInventory, setSearchInventory] = useState<string>("");

  const { data } = useQueryData(
    ["getInventories", searchInventory],
    searchInventory ? `/inventories?name=${searchInventory}` : "/inventories"
  );

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <AddInventoryButton />
          <ExportExcelExpendButton />
        </div>
        <InputSearchDebounce
          onChange={setSearchInventory}
          placeholder="nama barang"
          width="w-52"
        />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={data?.data ?? []} />
      </div>
    </div>
  );
}
