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
import { useFieldArray, useForm } from "react-hook-form";
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
import { AddOrderSchema } from "@/app/dto/order-dto";
import { Combobox, ItemCombobox } from "../ui/combobox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Product } from "@/app/dto/product-dto";
import { ConvertRupiah } from "@/utils/utils";

const defaultValues: z.infer<typeof AddOrderSchema> = {
  customer_id: "",
  items: [
    {
      product_id: "",
      unit: "",
      quantity: 0,
    },
  ],
};

export const AddOrderButton = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [itemComboboxCustomer, setItemComboboxCustomer] = useState<
    ItemCombobox[]
  >([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [itemComboboxProducts, setItemComboboxProducts] = useState<
    ItemCombobox[]
  >([]);

  const { mutate, data, isSuccess, isPending } = Mutation(["getOrders"], true);

  const {
    isPending: pendingCustomer,
    isSuccess: successCustomer,
    data: dataCustomer,
  } = useQueryData(["getOrderCustomers"], "/orders/customers");

  const {
    isPending: pendingProduct,
    isSuccess: successProduct,
    data: dataProduct,
  } = useQueryData(["getProducts"], "/products");

  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof AddOrderSchema>>({
    resolver: zodResolver(AddOrderSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (values: z.infer<typeof AddOrderSchema>) => {
    mutate({
      body: values,
      method: HttpMethod.POST,
      url: "/orders",
    });
  };

  useEffect(() => {
    if (successCustomer && dataCustomer?.data) {
      setCustomers(dataCustomer.data);

      let itemComList: ItemCombobox[] = [];

      const customers = dataCustomer.data as Customer[];

      customers.forEach((v) => {
        itemComList.push({
          label: v.name,
          value: v.id?.toString()!,
        });
      });

      setItemComboboxCustomer(itemComList);
    }
  }, [successCustomer, dataCustomer]);

  useEffect(() => {
    if (successProduct && dataProduct?.data) {
      setProducts(dataProduct.data);

      const itemComList = dataProduct.data.map((v: any) => ({
        label: v.name,
        value: v.id?.toString() || "",
      }));

      setItemComboboxProducts(itemComList);
    }
  }, [successProduct, dataProduct]);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      form.reset();
    }
  }, [isSuccess]);

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const handleAddItemForm = () => {
    append({
      product_id: "",
      unit: "",
      quantity: 0,
    });
  };

  function totalPrice(): number {
    const items = form.watch("items");
    let total: number = 0;

    items.forEach((item) => {
      const p = products.find((p) => p.id === Number(item.product_id));
      if (p) {
        total += p.price * item.quantity;
      }
    });

    return isNaN(total) ? 0 : total;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Icon icon="ic:baseline-plus" color="white" />
          Tambah Order
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[600px] w-[80%] max-h-[650px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Order</DialogTitle>
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
                          placeholder="Pilih pelanggan"
                          items={itemComboboxCustomer}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              <Field>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Layanan</TableHead>
                      <TableHead className="w-[100px]">Jumlah</TableHead>
                      <TableHead className="w-[70px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      return (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.product_id`}
                              render={({ field }) => (
                                <FormItem>
                                  <Combobox
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                    placeholder="Pilih layanan"
                                    items={itemComboboxProducts}
                                  />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="qty"
                                      type="number"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                      defaultValue={field.value}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Icon
                              onClick={() => remove(index)}
                              icon="ic:baseline-delete"
                              color="red"
                              width={"20px"}
                            />{" "}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="w-full flex justify-center">
                          <Icon
                            onClick={handleAddItemForm}
                            icon="ic:baseline-plus"
                            color="black"
                            width={"20px"}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell>{ConvertRupiah(totalPrice())}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Field>

              <Field>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={handleClose}>
                      Batal
                    </Button>
                  </DialogClose>
                  <ButtonLoading isLoading={false} label="Buat" />
                </DialogFooter>
              </Field>
            </FieldGroup>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
