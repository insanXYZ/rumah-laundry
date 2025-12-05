"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { AddCustomerButton } from "@/components/customer/add-customer";
import { Customer } from "@/app/dto/customer-dto";
import { EditCustomerButton } from "@/components/customer/edit-customer";
import { DeleteCustomerButton } from "@/components/customer/delete-customer";
import {
  ListSantriMonthlyMoney,
  SantriMonthlyMoney,
} from "@/app/dto/monthly-money-dto";
import { AddMonthlyMoneyButton } from "@/components/monthly-money/add-monthly";
import { ConvertRupiah } from "@/utils/utils";

const columns: ColumnDef<ListSantriMonthlyMoney>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    header: "Jumlah",
    cell: ({ row }) => {
      const amount = row.original.amount;

      return ConvertRupiah(amount);
    },
  },
];

export default function MonthlyMoneyPage() {
  const [smm, setSmm] = useState<ListSantriMonthlyMoney[]>([]);

  const { isPending, isSuccess, data } = useQueryData(
    ["getSmm"],
    "/customers/monthly-money"
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
