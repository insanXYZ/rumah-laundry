import { LogOut } from "lucide-react";
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
import { useEffect, useState } from "react";
import { HttpMethod, Mutation } from "@/utils/tanstack";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isSuccess } = Mutation(["logout"], true);
  const router = useRouter();

  const onSubmit = async () => {
    mutate({
      url: "/admins/logout",
      body: null,
      method: HttpMethod.POST,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      handlePushToLogin();
    }
  }, [isSuccess]);

  const handlePushToLogin = () => {
    router.push("/login");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div
          className="
            w-full flex items-center gap-2 
            px-2 py-1.5 text-sm 
            hover:bg-accent hover:text-accent-foreground 
            rounded-sm cursor-pointer
          "
        >
          <LogOut className="h-4 w-4" />
          Log out{" "}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi keluar</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin keluar dari website ini ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={() => onSubmit()}>Iya</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
