import z from "zod";

export interface Product {
  id?: number;
  name: string;
  unit: string;
  price: number;
}

export const AddProductSchema = z.object({
  name: z.string().min(1, {
    error: "nama wajib diisi",
  }),
  unit: z.string().min(1, {
    error: "satuan wajib diisi",
  }),
  price: z.number().min(0),
});

export const EditProductSchema = z.object({
  name: z.string(),
  unit: z.string(),
  price: z.number().min(0),
});
