import z from "zod";

export const LoginRequest = z.object({
  email: z.email({
    error: "Email tidak valid",
  }),
  password: z.string().min(8, {
    error: "password minimal 8 karakter",
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
  name: z.string().min(3, {
    message: "nama minimal 3 karakter"
  }),
  email: z.email({
    error: "Email tidak valid",
  }),
  password: z.string().min(8, {
    error: "password minimum 8 character",
  }).optional(),
});
