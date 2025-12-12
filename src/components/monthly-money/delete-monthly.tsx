import { HttpMethod, Mutation } from "@/utils/tanstack";
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
import { Icon } from "@iconify/react";
import { useEffect } from "react";

export function DeleteMonthlyButton({ id }: { id: string }) {
  const { mutate } = Mutation(["getSmm"], true);

  const onSubmit = () => {
    mutate({
      method: HttpMethod.DELETE,
      url: `/monthly-moneys/${id}`,
      body: null,
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
}
