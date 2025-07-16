import { z } from "zod";


export const lawyerDetailsSchema = z.object({
  specialization: z
    .array(z.string().min(1, "Specialization cannot be empty"))
    .min(1, "At least one specialization is required").optional(),
  experienceYears: z
    .number({
      required_error: "Experience years is required",
      invalid_type_error: "Experience years must be a number",
    })
    .int("Experience must be an integer")
    .min(0, "Experience must be non-negative").optional(),
  licenseNumber: z.string().optional(),
  barAssociation: z.string().optional(),
  consultationFee: z
    .number({
      required_error: "Consultation fee is required",
      invalid_type_error: "Consultation fee must be a number",
    })
    .min(0, "Consultation fee must be non-negative").optional(),
});
