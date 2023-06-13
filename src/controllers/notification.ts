import { NextFunction, Request, Response } from "express";
import Notification from "../models/Notification";
import HandleError from "../utils/HandleError";

export const getAllNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const notifications = await Notification.find();
  if (notifications.length === 0 || !notifications)
    return next(new HandleError("Not found notification ", 404));
  res.status(200).json({
    status: "success",
    notifications,
  });
};

export const getNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { receiverId } = req.params;
  if (!receiverId)
    return next(new HandleError("UserId must have required", 400));
  let notifications = await Notification.find({ receiverId }).populate({
    path: "userId",
    select: "-password",
  });

  notifications = notifications.reverse();

  res.status(200).json({
    status: "success",
    notifications,
  });
};

export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, receiverId } = req.body;

  if (!userId || !receiverId)
    return next(
      new HandleError("UserId or receiverId must have required", 400)
    );

  const notification = await Notification.create(req.body);
  if (!notification)
    return next(new HandleError("Cannot create notification", 400));

  res.status(201).json({
    status: "success",
    notification,
  });
};

export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return next(new HandleError("Id must have required", 400));
  const notification = await Notification.findById(id);
  if (!notification)
    return next(new HandleError("Not found notification", 404));
  await Notification.findByIdAndDelete(notification._id);
  res.status(200).json({
    status: "success",
  });
};
