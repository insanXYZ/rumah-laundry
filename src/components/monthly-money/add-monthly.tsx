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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup } from "../ui/field";
import { HttpMethod, Mutation, useQueryData } from "@/utils/tanstack";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { ButtonLoading } from "../ui/button-loading";
import { AddCustomerSchema, Customer } from "@/app/dto/customer-dto";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  acceptedTypeMonthlyMoney,
  AddSantriMonthlyMoneySchema,
  priceTypeMonthlyMoney,
} from "@/app/dto/monthly-money-dto";
import { Combobox, ItemCombobox } from "../ui/combobox";
import { ConvertRupiah } from "@/utils/utils";
import { watch } from "fs";

const defaultValues: z.infer<typeof AddSantriMonthlyMoneySchema> = {
  type: "",
  customer_id: "",
};

export const AddMonthlyMoneyButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [itemComboboxSantri, setItemComboboxSantri] = useState<ItemCombobox[]>(
    []
  );

  const { mutate, data, isSuccess, isPending } = Mutation(["getSmm"], true);
  const {
    isPending: pendingSantri,
    isSuccess: successSantri,
    data: dataSantri,
  } = useQueryData(["getCustomers"], "/customers?type=santri");

  const form = useForm<z.infer<typeof AddSantriMonthlyMoneySchema>>({
    resolver: zodResolver(AddSantriMonthlyMoneySchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof AddSantriMonthlyMoneySchema>) => {
    mutate({
      body: values,
      method: HttpMethod.POST,
      url: "/monthly-moneys",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      form.reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (successSantri && dataSantri?.data) {
      let listComboboxSantri: ItemCombobox[] = [];

      const santris = dataSantri.data as Customer[];

      santris.forEach((santri) => {
        listComboboxSantri.push({
          value: santri.id?.toString()!,
          label: santri.name,
        });
      });

      setItemComboboxSantri(listComboboxSantri);
    }
  }, [successSantri, dataSantri]);

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const total = () => {
    const type = form.watch("type");

    if (type != "") {
      return priceTypeMonthlyMoney.get(type) ?? 0;
    }
    return 0;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Icon icon="ic:baseline-plus" color="white" />
          Bayar Bulanan
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bayar Bulanan</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            <FieldGroup>
              <Field>
                <FormField
                  control={form.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Combobox
                          value={field.value}
                          onChange={(e) => field.onChange(e)}
                          placeholder="Pilih santri"
                          items={itemComboboxSantri}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              <Field>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Bulanan</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Jenis Bulanan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {acceptedTypeMonthlyMoney.map((v) => (
                                <SelectItem key={v} value={v}>
                                  {v.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              <div className="flex justify-between ">
                <div>Total :</div>
                <div>{ConvertRupiah(total())}</div>
              </div>

              <Field>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={handleClose}>
                      Batal
                    </Button>
                  </DialogClose>
                  <ButtonLoading isLoading={isPending} label="Simpan" />
                </DialogFooter>
              </Field>
            </FieldGroup>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
