"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { AddOrderButton } from "@/components/order/add-order";
import { acceptedStatusOrder, ListOrder } from "@/app/dto/order-dto";
import { ConvertRupiah, formatToLocalTimezone } from "@/utils/utils";
import { ConfirmDoneOrderButton } from "@/components/order/confirm-done-order";
import { DeleteOrderButton } from "@/components/order/delete-order";
import { PrintOrderButton } from "@/components/order/print-order";

const columns: ColumnDef<ListOrder>[] = [
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
    header: "Tanggal",
    cell: ({ row }) => {
      return formatToLocalTimezone(row.original.created_at);
    },
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          {row.original.status === acceptedStatusOrder[0] ? (
            <>
              <ConfirmDoneOrderButton values={row.original} />
              <DeleteOrderButton values={row.original} />
            </>
          ) : (
            <PrintOrderButton values={row.original} />
          )}
        </div>
      );
    },
  },
];

export default function OrderPage() {
  const [orders, setOrders] = useState<ListOrder[]>([]);

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
