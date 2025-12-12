"use client";

import { Icon } from "@iconify/react";
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
import { ListOrder } from "@/app/dto/order-dto";
import { useEffect, useState } from "react";
import { HttpMethod, Mutation } from "@/utils/tanstack";

export function DeleteOrderButton({ values }: { values: ListOrder }) {
  const [open, setOpen] = useState(false);
  const { mutate, isSuccess } = Mutation(["getOrders"], true);

  const onSubmit = () => {
    mutate({
      body: null,
      method: HttpMethod.DELETE,
      url: `/orders/${values.id}`,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Icon
          icon={"material-symbols-light:delete-outline"}
          color="delete"
          onClick={() => setOpen(true)}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Penghapusan Order</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu ingin menghapus orderan ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Tidak</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onSubmit();
            }}
          >
            Iya
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
