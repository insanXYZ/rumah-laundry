import z from "zod";

export const acceptedTypeMonthlyMoney: string[] = ["cuci saja", "cuci setrika"];
export const priceTypeMonthlyMoney = new Map<string, number>([
  [acceptedTypeMonthlyMoney[0], 100000],
  [acceptedTypeMonthlyMoney[1], 140000],
]);

export interface SantriMonthlyMoney {
  id: number;
  customer_id: number;
  amount: number;
}

export interface ListSantriMonthlyMoney {
  id: number;
  customer_id: number;
  type: string;
  name: string;
  created_at: Date;
}

export const AddSantriMonthlyMoneySchema = z.object({
  customer_id: z.string().min(1, {
    error: "pelanggan wajib diisi",
  }),
  type: z.string().min(1, {
    error: "jenis bulanan wajib diisi",
  }),
});
