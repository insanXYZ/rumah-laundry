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

const Base = z.object({
  name: z.string(),
  number_phone: z.string(),
  class: z.string().optional(),
  address: z.string().optional(),
});

export const AddCustomerSchema = z.discriminatedUnion("type", [
  Base.extend({
    type: z.literal("santri"),
    class: z.string(),
  }),
  Base.extend({
    type: z.literal("umum"),
    address: z.string(),
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
