import z from "zod";

export interface Admin {
  id: number;
  name: string;
  email: string;
}

export const LoginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8, {
    error: "password minimum 8 character",
  }),
});
