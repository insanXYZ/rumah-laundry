"use client";

import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { AddCustomerButton } from "@/components/customer/add-customer";
import { EditCustomerButton } from "@/components/customer/edit-customer";
import { DeleteCustomerButton } from "@/components/customer/delete-customer";
import { InputSearchDebounce } from "@/components/ui/input-search-debounce";
import { Customer } from "@/db/schema";
import { ListCustomersResponse } from "@/app/dto/customer-dto";
import { DataTable } from "@/components/ui/datatable";

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
  const [customers, setCustomers] = useState<ListCustomersResponse>([]);
  const [searchCustomer, setSearchCustomer] = useState<string>("");

  const { isSuccess, data } = useQueryData(
    ["getCustomers", searchCustomer],
    searchCustomer ? `/customers?name=${searchCustomer}` : "/customers"
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
        <InputSearchDebounce
          onChange={setSearchCustomer}
          placeholder="nama pelanggan"
          width="w-52"
        />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={customers} />
      </div>
    </div>
  );
}
