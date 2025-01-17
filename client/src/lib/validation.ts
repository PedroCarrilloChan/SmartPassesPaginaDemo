import * as z from "zod";

export const registrationSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor ingrese un correo electrónico válido"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Por favor ingrese un número de teléfono válido")
});

export type RegistrationData = z.infer<typeof registrationSchema>;