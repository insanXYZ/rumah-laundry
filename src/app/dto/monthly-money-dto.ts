import { ChargeSantri } from "@/db/schema";
import z from "zod";

export interface SantriMonthlyMoney {
  id: number;
  customer_id: number;
  amount: number;
}

export interface ListSantriMonthlyMoney {
  id: number;
  customer_id: number;
  amount: number;
  type: string;
  name: string;
  created_at: Date;
}

export type ListSantriesMonthlyMoneyResponse = ListSantriMonthlyMoney[];

export interface ListCharge {
  id: number;
  name: string;
  quantity: number;
  total_price: number;
  payed: boolean;
  period: string;
}

export type ListChargesResponse = ListCharge[];

export const AddSantriMonthlyMoneyRequest = z.object({
  customer_id: z.string().min(1, {
    error: "pelanggan wajib diisi",
  }),
  type: z.string().min(1, {
    error: "jenis bulanan wajib diisi",
  }),
});
