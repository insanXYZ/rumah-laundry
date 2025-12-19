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

export const DeleteProductButton = ({ id }: { id: number }) => {
  const { mutate } = Mutation(["getProducts"], true);

  const onSubmit = () => {
    mutate({
      body: null,
      method: HttpMethod.DELETE,
      url: `/products/${id}`,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Icon icon="ic:baseline-delete" color="red" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi hapus layanan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menghapus layanan ini?
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
