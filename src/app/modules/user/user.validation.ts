import { z } from "zod";

const userRegisterValidationSchema = z.object({
  username: z.string().min(2, "User name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const userUpdateValidationSchema = z.object({
  username: z
    .string()
    .min(2, "User name must be at least 2 characters long")
    .optional(),
  phone: z.string().min(10, "Mobile Number at least 10 Digit long").optional(),
  address: z.string().min(4, "Mobile Number at least 10 Digit long").optional(),
});

export const userValidation = {
  userRegisterValidationSchema,
  userUpdateValidationSchema,
};
