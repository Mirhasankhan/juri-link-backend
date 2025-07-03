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
  phone: z
    .string()
    .min(8, "Mobile Number must be at least 8 digits long")
    .optional(),
  address: z
    .string()
    .min(4, "Address must be at least 4 characters long")
    .optional(),
  specialization: z
    .array(z.string().min(1, "Specialization cannot be empty"))
    .optional(),
  experienceYears: z
    .number()
    .int("Experience must be an integer")
    .min(0, "Experience must be non-negative")
    .optional(),
  licenseNumber: z.string().min(1, "License number is required").optional(),
  barAssociation: z.string().min(1, "Bar association is required").optional(),
  consultationFee: z
    .number()
    .min(0, "Consultation fee must be non-negative")
    .optional(),
});

export const userValidation = {
  userRegisterValidationSchema,
  userUpdateValidationSchema,
};
