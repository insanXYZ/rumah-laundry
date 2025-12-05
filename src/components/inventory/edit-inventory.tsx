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

import { EditInventorySchema, Inventory } from "@/app/dto/inventory-dto";

export const EditInventoryButton = ({ values }: { values: Inventory }) => {
  const { mutate, data, isSuccess, isPending } = Mutation(
    ["getInventories"],
    true
  );
  const [open, setOpen] = useState<boolean>(false);

  const defaultValues: z.infer<typeof EditInventorySchema> = {
    name: values.name,
  };

  const form = useForm<z.infer<typeof EditInventorySchema>>({
    resolver: zodResolver(EditInventorySchema),
    defaultValues,
  });

  const onSubmit = (body: z.infer<typeof EditInventorySchema>) => {
    mutate({
      body: body,
      method: HttpMethod.PUT,
      url: `/inventories/${values.id}`,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      form.reset();
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Icon icon="ic:baseline-edit" color="green" width={"25px"} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Persediaan</DialogTitle>
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
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
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
