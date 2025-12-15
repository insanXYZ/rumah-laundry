import z from "zod";

export interface Customer {
  id?: number;
  name: string;
  class?: string;
  number_phone: string;
  type: "santri" | "umum";
  address?: string;
  type_monthly_money?: string;
}

export interface ListCustomerMonthly {
  id: number;
  name: string;
  charge_qty: string;
}

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

export const AddCustomerSchema = z.discriminatedUnion("type", [
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

export const EditCustomerSchema = z.discriminatedUnion("type", [
  Base.extend({
    type: z.literal("santri"),
    class: z.string(),
  }),
  Base.extend({
    type: z.literal("umum"),
    address: z.string(),
  }),
]);
