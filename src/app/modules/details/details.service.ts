import { LawyerDetails } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IUploadFile } from "../../interfaces/file";
import { Request } from "express";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import ApiError from "../../../errors/ApiErrors";

const handleUpdateDetailsIntoDB = async (req: Request) => {
  const userId = req.user.id;
  const payload = req.body;

  await prisma.user.findFirstOrThrow({
    where: { id: userId },
  });

  const files = req.files as IUploadFile[];

  // Get existing details if any
  const existingDetails = await prisma.lawyerDetails.findUnique({
    where: { userId },
  });

  let lawDegreeUrl = existingDetails?.lawDegreeUrl || null;

  if (files && files.length > 0) {
    const uploadedMedia = await FileUploadHelper.uploadToCloudinary(files);
    lawDegreeUrl = uploadedMedia[0].secure_url;
  }

  const details = await prisma.lawyerDetails.upsert({
    where: { userId },
    update: { ...payload, userId, lawDegreeUrl },
    create: { ...payload, userId, lawDegreeUrl },
  });

  return details;
};

export const detailsServices = {
  handleUpdateDetailsIntoDB,
};
