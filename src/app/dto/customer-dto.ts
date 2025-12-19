import { Customer } from "@/db/schema";
import z from "zod";

export interface ListCustomerMonthly {
  id: number;
  name: string;
  charge_qty: string;
}

export type ListCustomersMonthlyResponse = ListCustomerMonthly[];

export type ListCustomersResponse = Customer[];

const Base = z.object({
  name: z.string().min(1, {
    error: "nama wajib diisi",
  }),
  number_phone: z.string().min(1, {
    error: "nomor hp wajib diisi",
  }),
  class: z.string().optional(),
  address: z.string().optional(),
});

export const AddCustomerRequest = z.discriminatedUnion("type", [
  Base.extend({
    type: z.literal("santri"),
    class: z.string().min(1, {
      error: "kelas wajib diisi",
    }),
  }),
  Base.extend({
    type: z.literal("umum"),
    address: z.string().min(1, {
      error: "alamat wajib diisi",
    }),
  }),
]);

export const EditCustomerRequest = z.discriminatedUnion("type", [
  Base.extend({
    type: z.literal("santri"),
    class: z.string().min(1, {
      error: "kelas wajib diisi",
    }),
  }),
  Base.extend({
    type: z.literal("umum"),
    address: z.string().min(1, {
      error: "alamat wajib diisi",
    }),
  }),
]);
