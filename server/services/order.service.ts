import { NextFunction, Response } from "express";
import { CatchAsyncErrors } from "../Middleware/CatchAsyncErrors";
import OrderModel from "../Models/orderModel";

// create new order
export const newOrder = CatchAsyncErrors(async (data: any, res: Response) => {
  const order = await OrderModel.create(data);
  res.status(201).json({
    success: true,
    order,
  });
});

// get all orders --admin api
export const getAllOrdersService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    orders,
  });
};
