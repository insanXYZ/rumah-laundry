"use client";

import { DataTable } from "@/components/ui/datatable";
import { useEffect, useState } from "react";
import { useQueryData } from "@/utils/tanstack";
import { ColumnDef } from "@tanstack/react-table";
import { AddProductButton } from "@/components/product/add-product";
import { ConvertRupiah } from "@/utils/utils";
import { EditProductButton } from "@/components/product/edit-product";
import { DeleteProductButton } from "@/components/product/delete-product";
import { InputSearchDebounce } from "@/components/ui/input-search-debounce";
import { ListProductsResponse } from "@/app/dto/product-dto";
import { Product } from "@/db/schema";

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
  const [searchProduct, setSearchProduct] = useState<string>();

  const { data } = useQueryData(
    ["getProducts", searchProduct],
    searchProduct ? `/products?name=${searchProduct}` : "/products"
  );

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between">
        <AddProductButton />
        <InputSearchDebounce
          onChange={setSearchProduct}
          placeholder="nama layanan"
          width="w-52"
        />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={data?.data ?? []} />
      </div>
    </div>
  );
}
