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
import { HttpMethod, Mutation } from "@/utils/tanstack";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { ButtonLoading } from "../ui/button-loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { EditProductSchema, Product } from "@/app/dto/product-dto";

export const EditProductButton = ({ values }: { values: Product }) => {
  const { mutate, data, isSuccess, isPending } = Mutation(
    ["getProducts"],
    true
  );
  const [open, setOpen] = useState<boolean>(false);

  const defaultValues: z.infer<typeof EditProductSchema> = {
    name: values.name,
    price: values.price,
    unit: values.unit,
  };

  const form = useForm<z.infer<typeof EditProductSchema>>({
    resolver: zodResolver(EditProductSchema),
    defaultValues,
  });

  const onSubmit = (body: z.infer<typeof EditProductSchema>) => {
    mutate({
      body: body,
      method: HttpMethod.PUT,
      url: `/products/${values.id}`,
    });
  };

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Icon
          onClick={() => setOpen(true)}
          icon="ic:baseline-edit"
          color="green"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Layanan</DialogTitle>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input placeholder="nama" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              <Field>
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Satuan</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Jenis Satuan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="kg">Kg</SelectItem>
                              <SelectItem value="pcs">Pcs</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              <Field>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga per {form.watch().unit}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="harga"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

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
