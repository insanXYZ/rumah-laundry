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

export function ConfirmDoneOrderButton({ values }: { values: ListOrder }) {
  const [open, setOpen] = useState(false);
  const { mutate, isSuccess } = Mutation(["getOrders"], true);

  const onSubmit = () => {
    mutate({
      body: null,
      method: HttpMethod.PUT,
      url: `/orders/status/${values.id}`,
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
          icon={"lsicon:order-done-outline"}
          color="blue"
          onClick={() => setOpen(true)}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Penyelesaian order</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin, orderan ini sudah diselesaikan ?
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
