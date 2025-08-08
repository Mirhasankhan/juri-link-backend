import { Request } from "express";
import { IUploadFile } from "../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const createServiceIntoDB = async (req: Request) => {
  const payload = req.body;
  const existingService = await prisma.legalService.findUnique({
    where: { serviceName: payload.serviceName },
  });

  if (!existingService) {
    throw new ApiError(409, "This service already exists");
  }

  const files = req.files as IUploadFile[];
  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }
  if (files && files.length > 0) {
    const uploadedMedia = await FileUploadHelper.uploadToCloudinary(files);

    payload.serviceIcon = uploadedMedia.map((media) => media.secure_url);
  }
  if (!payload.serviceIcon) {
    throw new ApiError(409, "Service icon is required");
  }

  const newService = await prisma.legalService.create({
    data: {
      ...payload,
      serviceIcon: payload.serviceIcon[0],
    },
  });
  return newService;
};

const getAllServicesFromDB = async () => {
  const services = await prisma.legalService.findMany();

  return services;
};

export const legalServices = {
  createServiceIntoDB,
  getAllServicesFromDB
};
