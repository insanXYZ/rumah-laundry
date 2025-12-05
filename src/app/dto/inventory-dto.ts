import z from "zod";

export interface Inventory {
  id?: number;
  name: string;
  stock: number;
}

export const AddInventorySchema = z.object({
  name: z.string().min(1),
  stock: z.number().min(0),
});

export const EditInventorySchema = z.object({
  name: z.string().min(1),
});
