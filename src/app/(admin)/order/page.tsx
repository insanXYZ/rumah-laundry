"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { AddCustomerButton } from "@/components/customer/add-customer";
import { Customer } from "@/app/dto/customer-dto";
import { EditCustomerButton } from "@/components/customer/edit-customer";
import { DeleteCustomerButton } from "@/components/customer/delete-customer";
import { AddOrderButton } from "@/components/order/add-order";
import { ListOrders } from "@/app/dto/order-dto";
import { ConvertRupiah } from "@/utils/utils";
import { TransactionButton } from "@/components/order/transaction-order";
import { EditOrderButton } from "@/components/order/edit-order";

const columns: ColumnDef<ListOrders>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    header: "Status",
    cell: ({ row }) => {
      return row.original.status.toUpperCase();
    },
  },
  {
    header: "Total",
    cell: ({ row }) => {
      const total = row.original.order_items.reduce(
        (prev, curr) => prev + curr.total_price,
        0
      );

      return ConvertRupiah(total);
    },
  },

  {
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          {/* <TransactionButton values={row.original} /> */}
          <EditOrderButton values={row.original} />
        </div>
      );
    },
  },
];

export default function OrderPage() {
  const [orders, setOrders] = useState<ListOrders[]>([]);

  const { isPending, isSuccess, data } = useQueryData(["getOrders"], "/orders");

  useEffect(() => {
    if (isSuccess && data?.data) {
      setOrders(data.data);
    }
  }, [isSuccess, data]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between">
        <AddOrderButton />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}
