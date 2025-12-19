import { Customer, Order, OrderItem } from "@/db/schema";
import z from "zod";

export interface OrderItemListOrder extends OrderItem {
  product_name: string;
}

export interface ListOrder extends Order {
  name: string;
  order_items: OrderItemListOrder[];
}

export type ListOrdersResponse = ListOrder[];

export interface ListCustomerOrder extends Customer {
  type_monthly_money: string;
}

export type ListOrderCustomersResponse = ListCustomerOrder[];

export const AddOrderRequest = z.object({
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
