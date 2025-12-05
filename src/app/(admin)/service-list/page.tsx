"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { EditCustomerButton } from "@/components/customer/edit-customer";
import { DeleteCustomerButton } from "@/components/customer/delete-customer";
import { Product } from "@/app/dto/product-dto";
import { AddProductButton } from "@/components/product/add-product";
import { ConvertRupiah } from "@/utils/utils";
import { EditProductButton } from "@/components/product/edit-product";
import { DeleteProductButton } from "@/components/product/delete-product";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    header: "Harga",
    cell: ({ row }) => {
      const price = row.original.price;
      const unit = row.original.unit;

      return (
        <div>
          {ConvertRupiah(price)}/{unit}
        </div>
      );
    },
  },
  {
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <EditProductButton values={row.original} />
        <DeleteProductButton id={row.original.id!} />
      </div>
    ),
  },
];

export default function ServiceListPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const { isPending, isSuccess, data } = useQueryData(
    ["getProducts"],
    "/products"
  );

  useEffect(() => {
    if (isSuccess && data?.data) {
      setProducts(data.data);
    }
  }, [isSuccess, data]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between">
        <AddProductButton />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
