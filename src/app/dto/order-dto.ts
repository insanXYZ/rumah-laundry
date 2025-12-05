import z from "zod";

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  price: number;
  total_price: number;
}

export interface ListOrders {
  id: number;
  customer_id: number;
  status: string;
  name: string;
  order_items: OrderItem[];
}

export const AddOrderSchema = z.object({
  customer_id: z.string(),
  items: z
    .array(
      z.object({
        product_id: z.string(),
        unit: z.string().optional(),
        quantity: z.number(),
      })
    )
    .min(1, "Items tidak boleh kosong"),
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
    .min(1, "Items tidak boleh kosong"),
});

export const EditStatusOrderSchema = z.object({
  status: z.string(),
});
