import express from "express";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { serviceController } from "./services.controller";

const router = express.Router();

router.post(
  "/create",
  FileUploadHelper.upload.array("files", 1),
  parseBodyData,
  serviceController.createService
);
router.get("/", serviceController.allServices);

export const serviceRoutes = router;
