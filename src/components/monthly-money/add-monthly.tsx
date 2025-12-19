"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Icon } from "@iconify/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import z, { custom } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup } from "../ui/field";
import { HttpMethod, Mutation, useQueryData } from "@/utils/tanstack";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { ButtonLoading } from "../ui/button-loading";
import {
  ListCustomerMonthly,
  ListCustomersMonthlyResponse,
} from "@/app/dto/customer-dto";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AddSantriMonthlyMoneyRequest } from "@/app/dto/monthly-money-dto";
import { Combobox, ItemCombobox } from "../ui/combobox";
import { ConvertRupiah } from "@/utils/utils";
import {
  ACCEPTED_TYPE_MONTHLY_MONEY_SANTRI,
  PRICE_TYPE_MONTHLY_MONEY_MAP,
  SANTRI_CHARGE_PRICE,
} from "@/types/types";

const defaultValues: z.infer<typeof AddSantriMonthlyMoneyRequest> = {
  type: "",
  customer_id: "",
};

export const AddMonthlyMoneyButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [santriMonthly, setSantriMonthly] =
    useState<ListCustomersMonthlyResponse>([]);
  const [itemComboboxSantri, setItemComboboxSantri] = useState<ItemCombobox[]>(
    []
  );

  const { mutate, isSuccess, isPending } = Mutation(["getSmm"], true);
  const { isSuccess: successSantri, data: dataSantri } = useQueryData(
    ["getCustomers"],
    "/customers/monthly"
  );

  const form = useForm<z.infer<typeof AddSantriMonthlyMoneyRequest>>({
    resolver: zodResolver(AddSantriMonthlyMoneyRequest),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof AddSantriMonthlyMoneyRequest>) => {
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
      setSantriMonthly(dataSantri.data);

      let listComboboxSantri: ItemCombobox[] = [];

      const santris = dataSantri.data as ListCustomersMonthlyResponse;

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
    const customer_id = form.watch("customer_id");

    if (type != "") {
      const customer = santriMonthly.find((s) => s.id == Number(customer_id));
      const totalWithQty =
        Number(customer?.charge_qty ?? 0) * SANTRI_CHARGE_PRICE;
      const total =
        (PRICE_TYPE_MONTHLY_MONEY_MAP.get(type) ?? 0) + totalWithQty;

      return total;
    }
    return 0;
  };

  const statusCharge = () => {
    const customer_id = form.watch("customer_id");

    if (customer_id) {
      const customer = santriMonthly.find((s) => s.id == Number(customer_id));

      return customer?.charge_qty;
    }
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
                              {ACCEPTED_TYPE_MONTHLY_MONEY_SANTRI.map((v) => (
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

              {statusCharge() && (
                <div className="flex justify-between ">
                  <div>Charge :</div>
                  <div>{statusCharge()} Kg</div>
                </div>
              )}

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
