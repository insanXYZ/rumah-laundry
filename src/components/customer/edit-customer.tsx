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
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { EditCustomerRequest } from "@/app/dto/customer-dto";
import { Customer } from "@/db/schema";

export const EditCustomerButton = ({ values }: { values: Customer }) => {
  const { mutate, isSuccess, isPending } = Mutation(["getCustomers"], true);
  const [open, setOpen] = useState<boolean>(false);

  let defaultValues: z.infer<typeof EditCustomerRequest>;

  if (values.type === "santri") {
    defaultValues = {
      type: "santri",
      name: values.name,
      number_phone: values.number_phone,
      class: values.class ?? "",
      address: values.address ?? "",
    };
  } else {
    defaultValues = {
      type: "umum",
      name: values.name,
      number_phone: values.number_phone,
      class: values.class ?? "",
      address: values.address ?? "",
    };
  }

  const form = useForm<z.infer<typeof EditCustomerRequest>>({
    resolver: zodResolver(EditCustomerRequest),
    defaultValues,
  });

  const watchType = form.watch("type");

  const onSubmit = (body: z.infer<typeof EditCustomerRequest>) => {
    mutate({
      body: body,
      method: HttpMethod.PUT,
      url: `/customers/${values.id}`,
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
          <DialogTitle>Edit Pelanggan</DialogTitle>
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
                  name="number_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No Hp</FormLabel>
                      <FormControl>
                        <Input placeholder="no hp" {...field} />
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
                      <FormLabel>Jenis Pelanggan</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Jenis Pelanggan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="umum">Umum</SelectItem>
                              <SelectItem value="santri">Santri</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
              {watchType === "umum" && (
                <Field>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="alamat"
                            onChange={field.onChange}
                            defaultValue={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>
              )}

              {watchType === "santri" && (
                <Field>
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kelas</FormLabel>
                        <FormControl>
                          <Input placeholder="kelas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>
              )}

              <Field>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={handleClose}>
                      Batal
                    </Button>
                  </DialogClose>
                  <ButtonLoading
                    isLoading={isPending}
                    label="Simpan Perubahan"
                  />
                </DialogFooter>
              </Field>
            </FieldGroup>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
