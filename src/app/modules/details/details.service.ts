import { LawyerDetails } from "@prisma/client";
import prisma from "../../../shared/prisma";

const handleUpdateDetailsIntoDB = async (
  id: string,
  payload: LawyerDetails
) => {
  await prisma.user.findFirstOrThrow({
    where: { id },
  });

  const details = await prisma.lawyerDetails.upsert({
    where: { userId:id },
    update: { ...payload, userId:id },
    create: { ...payload , userId:id},
  });
  return details;
};

export const detailsServices = {
    handleUpdateDetailsIntoDB
}
