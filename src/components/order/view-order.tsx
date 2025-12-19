"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Icon } from "@iconify/react";
import { Field, FieldGroup } from "../ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Label } from "../ui/label";
import { useState } from "react";
import { ListOrder } from "@/app/dto/order-dto";

export const ViewOrderButton = ({ values }: { values: ListOrder }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Icon icon="mdi:eye" color="green" />
      </DialogTrigger>

      <DialogContent className="max-w-[600px] w-[80%] max-h-[650px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          <FieldGroup>
            <Field>
              <Label>Nama</Label>
              <Input
                disabled
                value={values.name}
                className="disabled:opacity-100 disabled:text-foreground disabled:bg-background disabled:cursor-not-allowed"
              />
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
                  {values.order_items.map((field, index) => {
                    return (
                      <TableRow key={field.id}>
                        <TableCell className="w-[65%]">
                          <Input
                            disabled
                            value={field.product_name}
                            className="disabled:opacity-100 disabled:text-foreground disabled:bg-background disabled:cursor-not-allowed"
                          />
                        </TableCell>
                        <TableCell className="w-[35%]">
                          <Input
                            disabled
                            value={field.quantity}
                            className="disabled:opacity-100 disabled:text-foreground disabled:bg-background disabled:cursor-not-allowed"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Field>
          </FieldGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};
