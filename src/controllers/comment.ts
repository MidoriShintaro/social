import { NextFunction, Request, Response } from "express";
import Comment from "../models/Comment";
import HandleError from "../utils/HandleError";
import Post from "../models/Post";

export const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const comments = await Comment.find()
    .populate({
      path: "userId",
      select: "-password",
    })
    .populate({ path: "postId" });
  if (!comments || comments.length === 0)
    return next(new HandleError("No Comment Founded", 404));
  res.status(200).json({
    status: "success",
    comments,
  });
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, postId } = req.body;
  if (!userId || !postId)
    return next(new HandleError("User Id or Post Id are required", 400));
  const newComment = await Comment.create(req.body);
  if (!newComment) return next(new HandleError("Cannot create comment", 400));
  await Post.findByIdAndUpdate(newComment.postId, {
    $push: { comments: newComment._id },
  });
  res.status(201).json({
    status: "success",
    message: "Comment has been posted",
    comment: newComment,
  });
};

export const getComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment)
    return next(new HandleError("Cannot find comment with id", 404));
  res.status(200).json({
    status: "success",
    comment,
  });
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId, postId } = req.body;
  const comment = await Comment.findById(id);
  if (!comment)
    return next(new HandleError("Cannot find comment with id", 404));
  if (comment.userId !== userId || comment.postId !== postId)
    return next(new HandleError("You does not permission", 403));
  const updateComment = await Comment.findByIdAndUpdate(comment._id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    message: "Comment has been updated",
    updateComment,
  });
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment)
    return next(new HandleError("Cannot find comment with id", 404));
  await Post.findByIdAndUpdate(
    comment.postId,
    {
      $pull: { comments: comment.id },
    },
    { new: true }
  );
  await Comment.findByIdAndDelete(comment._id);
  res
    .status(200)
    .json({ status: "success", message: "Comment has been deleted" });
};

export const LikeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { postId, userId } = req.body;
  let likeCmt: any;
  if (!postId || !userId)
    return next(new HandleError("Post ID or User ID are required", 400));
  const comment = await Comment.findById(id);
  if (!comment)
    return next(new HandleError("Cannot find comment with id", 404));
  if (comment.likes.includes(userId)) {
    likeCmt = await Comment.findByIdAndUpdate(
      comment._id,
      { $pull: { likes: userId } },
      { new: true }
    );
    res
      .status(200)
      .json({ status: "success", message: "Dislike comment", likeCmt });
  } else {
    likeCmt = await Comment.findByIdAndUpdate(
      comment._id,
      { $push: { likes: userId } },
      { new: true }
    );
    res
      .status(200)
      .json({ status: "success", message: "Like comment", likeCmt });
  }
};
