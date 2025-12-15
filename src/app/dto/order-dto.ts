import z from "zod";

export const acceptedStatusOrder: string[] = ["proses", "beres"];

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  price: number;
  total_price: number;
}

export interface ListOrder {
  id: number;
  customer_id: number;
  status: string;
  created_at: Date;
  name: string;
  order_items: OrderItem[];
}

export const AddOrderSchema = z.object({
  customer_id: z.string().min(1, {
    error: "pelanggan wajib diisi",
  }),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, {
          error: "layanan wajib diisi",
        }),
        quantity: z.number().min(0.1, {
          error: "jumlah wajib diisi",
        }),
      })
    )
    .min(1, "Items wajib diisi"),
});

export const EditOrderSchema = z.object({
  customer_id: z.string(),
  status: z.string(),
  items: z
    .array(
      z.object({
        product_id: z.string(),
        unit: z.string().optional(),
        quantity: z.number(),
      })
    )
    .min(1, "Items wajib diisi"),
});

export const EditStatusOrderSchema = z.object({
  status: z.string(),
});
