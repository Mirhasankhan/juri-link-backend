import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { lawyerDetailsSchema } from "./details.validation";
import { detailsController } from "./details.controller";

const router = express.Router();

router.post(
  "/update",
  auth(UserRole.LAWYER),
  validateRequest(lawyerDetailsSchema),
  detailsController.updateDetails
);

export const detailsRoutes = router;
