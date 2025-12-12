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

export const DeleteCustomerButton = ({ id }: { id: number }) => {
  const { mutate, data, isSuccess, isPending } = Mutation(
    ["getCustomers"],
    true
  );

  const onSubmit = () => {
    mutate({
      body: null,
      method: HttpMethod.DELETE,
      url: `/customers/${id}`,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Icon icon="ic:baseline-delete" color="red" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi hapus pelanggan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menghapus pelanggan ini?
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
