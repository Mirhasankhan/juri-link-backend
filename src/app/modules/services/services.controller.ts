import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { legalServices } from "./services.service";

const createService = catchAsync(async (req, res) => {
  const result = await legalServices.createServiceIntoDB(req);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Legal Service Created Successfully",
    data: result,
  });
});
const allServices = catchAsync(async (req, res) => {
  const result = await legalServices.getAllServicesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All services retrieved Successfully",
    data: result,
  });
});

export const serviceController = {
  createService,
  allServices
};
