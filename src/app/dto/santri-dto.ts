import z from "zod";

export interface Santri {
  id: number;
  name: string;
  class: string;
  number_phone: string;
}

export const AddSantriSchema = z.object({
  name: z.string().min(3),
  class: z.string().min(3),
  number_phone: z.string().min(7),
});
