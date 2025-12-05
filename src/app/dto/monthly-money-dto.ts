import z from "zod";

export interface SantriMonthlyMoney {
  id: number;
  customer_id: number;
  amount: number;
}

export interface ListSantriMonthlyMoney {
  customer_id: number;
  amount: number;
  name: string;
}

export const AddSantriMonthlyMoneySchema = z.object({
  customer_id: z.string(),
  amount: z.number(),
});
