import { NextFunction, Request, Response } from "express";
import Conversation from "../models/Conversation";
import HandleError from "../utils/HandleError";
import User from "../models/User";

export const newConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { senderId, receiverId } = req.body;
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  if (!sender || !receiver) return next(new HandleError("Not found user", 404));
  const existsConversation = await Conversation.findOne({
    members: { $all: [sender._id, receiver._id] },
  });
  if (existsConversation) return next();
  const newConversation = new Conversation({
    members: [sender._id, receiver._id],
  });
  const conversation = await newConversation.save();
  res.status(201).json({
    status: "success",
    conversation,
  });
};

export const getConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const conversation = await Conversation.find({
    members: { $in: [userId] },
  });

  res.status(200).json({ status: "success", conversation });
};

export const likeConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, friendId } = req.body;
  let updateConversation;
  const conversation = await Conversation.findOne({
    members: { $all: [userId, friendId] },
  });

  if (!conversation)
    return next(new HandleError("Cannot find conversation!!", 404));

  if (conversation.likes.includes(userId)) {
    updateConversation = await Conversation.findByIdAndUpdate(
      conversation._id,
      { $pull: { likes: userId } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Dislike message",
      updateConversation,
    });
  } else if (!conversation.likes.includes(userId)) {
    updateConversation = await Conversation.findByIdAndUpdate(
      conversation._id,
      { $push: { likes: userId } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Like message",
      updateConversation,
    });
  }
};

export const deleteConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { senderId, receiverId } = req.params;
  const conversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  });
  if (!conversation)
    return next(new HandleError("Not found conversation with id", 404));
  await Conversation.findByIdAndDelete(conversation._id);

  res.status(200).json({
    status: "success",
  });
};
