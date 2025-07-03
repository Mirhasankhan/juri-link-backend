import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  validateRequest(userValidation.userRegisterValidationSchema),
  UserControllers.createUser
);
router.get("/", auth(UserRole.ADMIN), UserControllers.getUsers);
router.get("/:id", auth(), UserControllers.getSingleUser);
router.put(
  "/update",
  validateRequest(userValidation.userUpdateValidationSchema),
  auth(),
  UserControllers.updateUser
);
router.put(
  "/update/profileImage",
  auth(),
  FileUploadHelper.upload.array("files", 1),
  parseBodyData,
  UserControllers.updateProfileImage
);
router.delete("/:id", auth(UserRole.ADMIN), UserControllers.deleteUser);

export const userRoutes = router;
