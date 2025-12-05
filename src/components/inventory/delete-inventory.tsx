"use client";

import { Icon } from "@iconify/react";

import { HttpMethod, Mutation } from "@/utils/tanstack";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export const DeleteInventoryButton = ({ id }: { id: number }) => {
  const { mutate, data, isSuccess, isPending } = Mutation(
    ["getInventories"],
    true
  );

  const onSubmit = () => {
    mutate({
      body: null,
      method: HttpMethod.DELETE,
      url: `/inventories/${id}`,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Icon icon="ic:baseline-delete" color="red" width={"25px"} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi hapus persediaan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menghapus persediaan ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>Iya</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
