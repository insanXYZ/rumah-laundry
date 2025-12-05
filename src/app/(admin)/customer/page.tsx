"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { AddCustomerButton } from "@/components/customer/add-customer";
import { Customer } from "@/app/dto/customer-dto";
import { EditCustomerButton } from "@/components/customer/edit-customer";
import { DeleteCustomerButton } from "@/components/customer/delete-customer";

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "type",
    cell: ({ row }) => row.original.type?.toUpperCase(),
  },
  {
    accessorKey: "number_phone",
    header: "Nomor Hp",
  },
  {
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <EditCustomerButton values={row.original} />
        <DeleteCustomerButton id={row.original.id!} />
      </div>
    ),
  },
];

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const { isPending, isSuccess, data } = useQueryData(
    ["getCustomers"],
    "/customers"
  );

  useEffect(() => {
    if (isSuccess && data?.data) {
      setCustomers(data.data);
    }
  }, [isSuccess, data]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between">
        <AddCustomerButton />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={customers} />
      </div>
    </div>
  );
}
