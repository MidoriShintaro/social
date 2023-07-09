import { NextFunction, Request, Response } from "express";
import Message from "../models/Message";
import HandleError from "../utils/HandleError";
import configMulter from "../utils/multer";
import { uploadCloud } from "../utils/cloudinary";

const upload = configMulter("messages");
export const uploadImageMessage = upload.single("image");

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const image = req.file?.filename === undefined ? "" : req.file?.filename;
  const path = req.file?.path === undefined ? "" : req.file.path;
  const image = await uploadCloud(path, "social/message");
  const { conversationId, sender, content, isLiked } = req.body;
  const message = await Message.create({
    conversationId,
    sender,
    content,
    isLiked,
    image,
  });
  if (!message) return next(new HandleError("Cannot create message", 500));

  res.status(201).json({
    status: "message",
    message,
  });
};

export const getMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId } = req.params;
  const message = await Message.find({ conversationId });
  if (!message) return next(new HandleError("Not found message", 404));
  res.status(200).json({
    status: "success",
    message,
  });
};

export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { messageId } = req.params;
  const message = await Message.findById(messageId);
  if (!message) return next(new HandleError("Not found message", 404));
  const mess = await Message.findByIdAndUpdate(message._id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    message: mess,
  });
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { messageId } = req.params;
  const message = await Message.findById(messageId);
  if (!message) return next(new HandleError("Not found message", 404));
  await Message.findByIdAndDelete(message._id);
  res.status(200).json({
    status: "success",
  });
};
