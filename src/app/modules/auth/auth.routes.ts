import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

//login user
router.post(
  "/login",
  validateRequest(authValidation.authLoginSchema),
  authController.loginUser
);
router.post(
  "/social-login",
  authController.socialLogin
);
router.get("/profile", auth(), authController.getProfile);
router.post("/send-otp", authController.sendForgotPasswordOtp);
router.post("/verify-otp", authController.verifyForgotPasswordOtpCode);
router.patch("/reset-password", auth(), authController.resetPassword);

router.put(
  "/profile",
  validateRequest(authValidation.updateProfileSchema),
  auth(),
  authController.updateProfile
);

export const authRoute = router;
