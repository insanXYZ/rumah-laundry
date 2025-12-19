import { Product } from "@/db/schema";
import z from "zod";

export type ListProductsResponse = Product[];

export const AddProductRequest = z.object({
  name: z.string().min(1, {
    error: "nama wajib diisi",
  }),
  unit: z.string().min(1, {
    error: "satuan wajib diisi",
  }),
  price: z.number().min(0),
});

export const EditProductRequest = z.object({
  name: z.string().min(1, {
    error: "nama wajib diisi",
  }),
  unit: z.string().min(1, {
    error: "satuan wajib diisi",
  }),
  price: z.number().min(0),
});
