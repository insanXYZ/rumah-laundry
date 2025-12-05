"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Icon } from "@iconify/react";
import { Field, FieldGroup } from "../ui/field";
import { HttpMethod, Mutation } from "@/utils/tanstack";
import { Button } from "../ui/button";
import { useState } from "react";
import { ButtonLoading } from "../ui/button-loading";
import { EditStatusOrderSchema, ListOrders } from "@/app/dto/order-dto";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ConvertRupiah } from "@/utils/utils";
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
import z from "zod";

export const TransactionButton = ({ values }: { values: ListOrders }) => {
  const [open, setOpen] = useState<boolean>(false);

  const { mutate, data, isSuccess, isPending } = Mutation(["getOrders"], true);

  const defaultValues = {
    customer_name: values.name,
    items: values.order_items.map((item) => {
      return {
        id: item.id,
        product_name: item.product_name,
        quantity: item.quantity,
      };
    }),
  };

  const handleBatal = () => {
    // const body: z.infer<typeof EditStatusOrderSchema> = {
    //   status: "batal",
    // };
    // mutate({
    //   url: `/orders/${values.id}`,
    //   body: null,
    //   method: HttpMethod.PUT,
    // });
  };

  const handleBeres = () => {
    // const body: z.infer<typeof EditStatusOrderSchema> = {
    //   status: "beres",
    // };
    // mutate({
    //   url: `/orders/${values.id}`,
    //   body: null,
    //   method: HttpMethod.PUT,
    // });
  };

  function totalPrice(): number {
    const total = values.order_items.reduce(
      (acc, curr) => acc + curr.total_price,
      0
    );

    return isNaN(total) ? 0 : total;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Icon
          onClick={() => setOpen(true)}
          icon="uil:transaction"
          color="blue"
          width={"25px"}
        />
      </DialogTrigger>

      <DialogContent className="max-w-[600px] w-[80%] max-h-[650px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          <FieldGroup>
            <Field>
              <Input
                disabled
                value={defaultValues.customer_name}
                className="disabled:opacity-100 disabled:text-foreground disabled:bg-background disabled:cursor-not-allowed"
              />{" "}
            </Field>

            <Field>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Layanan</TableHead>
                    <TableHead className="w-[100px]">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultValues.items.map((field, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            disabled
                            value={field.product_name}
                            className="disabled:opacity-100 disabled:text-foreground disabled:bg-background disabled:cursor-not-allowed"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            disabled
                            value={field.quantity}
                            className="disabled:opacity-100 disabled:text-foreground disabled:bg-background disabled:cursor-not-allowed"
                          />{" "}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>{ConvertRupiah(totalPrice())}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </Field>

            <Field>
              <DialogFooter>
                {/* ButtonBatal */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Batal</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Konfirmasi Pembatalan Orderan
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah kamu yakin ingin membatalkan dan menghapus
                        orderan ini?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Tidak</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleBatal();
                        }}
                      >
                        Iya
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* ButtonBeres */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <ButtonLoading isLoading={false} label="Beres" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Konfirmasi Penyelesaian Orderan
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah kamu yakin sudah menyelesaikan orderan ini?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Tidak</AlertDialogCancel>
                      <AlertDialogAction
                      // onClick={() => {
                      //   handleBeres();
                      // }}
                      >
                        Iya
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </Field>
          </FieldGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};
