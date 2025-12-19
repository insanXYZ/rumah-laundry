import { Inventory } from "@/db/schema";
import z from "zod";

export interface ListInventoryStock {
  name: string;
  stock: number;
  price: number;
  description: string;
  created_at: Date;
}

export interface ListInventory {
  id: number;
  name: string;
  stock: number;
}

export type ListInventoriesResponse = ListInventory[];

export const AddInventoryRequest = z.object({
  name: z.string().min(1, {
    error: "nama wajib diisi",
  }),
  stock: z.number().min(0),
  price: z.number(),
});

export const EditInventoryRequest = z.object({
  name: z.string().min(1),
});

export const ManageInventoryRequest = z.object({
  stock: z.number(),
  price: z.number().min(0),
  description: z.string(),
});
