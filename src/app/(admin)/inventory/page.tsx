"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { AddCustomerButton } from "@/components/customer/add-customer";
import { Inventory } from "@/app/dto/inventory-dto";
import { AddInventoryButton } from "@/components/inventory/add-inventory";
import { ColumnDef } from "@tanstack/react-table";
import { EditInventoryHandler } from "@/app/api/handler/inventory-handler";
import { EditInventoryButton } from "@/components/inventory/edit-inventory";
import { DeleteInventoryButton } from "@/components/inventory/delete-inventory";
import { ManageStockButton } from "@/components/inventory/manage-stock-inventory";

const columns: ColumnDef<Inventory>[] = [
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
        {/* <DeleteInventoryButton id={row.original.id!} /> */}
        <ManageStockButton values={row.original} />
      </div>
    ),
  },
];

export default function InventoryPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);

  const { isPending, isSuccess, data } = useQueryData(
    ["getInventories"],
    "/inventories"
  );

  useEffect(() => {
    if (isSuccess && data?.data) {
      setInventories(data.data);
    }
  }, [isSuccess, data]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between">
        <AddInventoryButton />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={inventories} />
      </div>
    </div>
  );
}
