"use client";

import { LoginRequestSchema } from "@/app/dto/admin-dto";
import CardHeaderAuth from "@/components/auth/card_header";
import SeparatorAuth from "@/components/auth/separator";
import { ButtonLoading } from "@/components/ui/button-loading";
import { CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HttpMethod, Mutation } from "@/utils/tanstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const defaultValues: z.infer<typeof LoginRequestSchema> = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const form = useForm<z.infer<typeof LoginRequestSchema>>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues,
  });

  const router = useRouter();

  const { mutate, data, isPending, isSuccess } = Mutation(["adminLogin"], true);

  const onSubmit = (values: z.infer<typeof LoginRequestSchema>) => {
    mutate({
      body: values,
      method: HttpMethod.POST,
      url: "/admins/login",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.refresh();
      router.push("/dashboard");
    }
  }, [isSuccess, data]);

  return (
    <>
      <CardHeaderAuth
        title="Selamat datang"
        description="Masuk dengan akun anda!!!"
      />
      <SeparatorAuth />
      <CardContent>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
              <Field>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
              <Field>
                <ButtonLoading isLoading={isPending} label="Submit" />
              </Field>
            </FieldGroup>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
