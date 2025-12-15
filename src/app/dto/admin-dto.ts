import z from "zod";

export interface Admin {
  id: number;
  name: string;
  email: string;
}

export const LoginRequestSchema = z.object({
  email: z.email({
    error: "Email tidak valid",
  }),
  password: z.string().min(8, {
    error: "password minimum 8 character",
  }),
  timezone: z
    .string()
    .min(1)
    .refine(
      (tz) => {
        try {
          Intl.DateTimeFormat("en-US", { timeZone: tz });
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "timezone tidak valid / tidak didukung",
      }
    ),
});

export const EditAccountSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8, {
    error: "password minimum 8 character",
  }),
});
