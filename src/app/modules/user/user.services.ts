import { User } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import Stripe from "stripe";
import { Request } from "express";
import { IUploadFile } from "../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploader";

const stripe = new Stripe(config.stripe.stripe_secret as string);

//create new user
export const createCustomerStripeAccount = async (
  email: string,
  name: string
) => {
  const account = await stripe.customers.create({
    email,
    name,
  });
  return account;
};

//create new user
const createUserIntoDB = async (payload: User) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new ApiError(409, "email already exist!");
  }

  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  const stripeAccount = await createCustomerStripeAccount(
    payload.email,
    payload.username
  );

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      stripeCustomerId: stripeAccount.id,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      stripeCustomerId: stripeAccount.id,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const { password, ...sanitizedUser } = user;

  return {
    accessToken,
    user: sanitizedUser,
  };
};

//get single user
const getSingleUserIntoDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

//get all users
const getUsersIntoDB = async () => {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    throw new ApiError(404, "Users not found!");
  }
  const sanitizedUsers = users.map((user) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  });
  return sanitizedUsers;
};

//update user
const updateUserIntoDB = async (id: string, userData: any) => {
  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID format");
  }
  const existingUser = await getSingleUserIntoDB(id);
  if (!existingUser) {
    throw new ApiError(404, "user not found for edit user");
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: userData,
  });

  const { password, ...sanitizedUser } = updatedUser;

  return sanitizedUser;
};
//update user
const updateProfileImage = async (req: Request) => {
  const id = req.user.id;
  const payload = req.body;

  const existingUser = await getSingleUserIntoDB(id);
  if (!existingUser) {
    throw new ApiError(404, "user not found for edit user");
  }

  const files = req.files as IUploadFile[];
  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }
  if (files && files.length > 0) {
    const uploadedMedia = await FileUploadHelper.uploadToCloudinary(files);

    payload.imageUrls = uploadedMedia.map((media) => media.secure_url);
  }
  if (!payload.imageUrls) {
    throw new ApiError(409, "NO image Uploaded");
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      profileImage: payload?.imageUrls[0],
    },
  });

  const { password, ...sanitizedUser } = updatedUser;

  return sanitizedUser;
};

//delete user
const deleteUserIntoDB = async (userId: string, loggedId: string) => {
  if (!ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  if (userId === loggedId) {
    throw new ApiError(403, "You can't delete your own account!");
  }
  const existingUser = await getSingleUserIntoDB(userId);
  if (!existingUser) {
    throw new ApiError(404, "user not found for delete this");
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  return;
};

export const userService = {
  createUserIntoDB,
  getUsersIntoDB,
  getSingleUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
  updateProfileImage
};
