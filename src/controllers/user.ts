import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import HandleError from "../utils/HandleError";

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const limit = req.query.limit as string;
  // if (req.query) {
  // } else {
  //   users = await User.find().select("-password");
  // }
  const users = await User.find().limit(parseInt(limit)).select("-password");
  if (!users || users.length === 0)
    return next(new HandleError("No Founded User", 404));
  res.status(200).json({ status: "success", users });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) return next(new HandleError("Cannot find user with id", 404));
  res.status(200).json({
    status: "success",
    user,
  });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (req.body.id !== id)
    return next(new HandleError("You does not permission", 403));
  await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");
  res.status(200).json({
    status: "success",
    message: "Profile has been update",
  });
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (req.body.id !== id)
    return next(new HandleError("You does not permission", 403));
  await User.findByIdAndDelete(id);
  res
    .status(200)
    .json({ status: "success", message: "Account has been deleted" });
};

export const Follow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (id !== userId) {
    const user = await User.findById(id);
    const curUser = await User.findById(userId);
    if (!user || !curUser)
      return next(new HandleError("Cannot find user with id", 404));
    if (!user.followers.includes(userId)) {
      await User.findByIdAndUpdate(
        user.id,
        {
          $push: { followers: curUser._id },
        },
        { new: true }
      );
      await User.findByIdAndUpdate(
        curUser.id,
        {
          $push: { followings: user._id },
        },
        { new: true }
      );
      res
        .status(200)
        .json({ status: "success", message: `Follow ${user.username}` });
    } else {
      await User.findByIdAndUpdate(
        user.id,
        {
          $pull: { followers: curUser._id },
        },
        { new: true }
      );
      await User.findByIdAndUpdate(
        curUser.id,
        {
          $pull: { followings: user._id },
        },
        { new: true }
      );
      res
        .status(200)
        .json({ status: "success", message: `UnFollow ${user.username}` });
    }
  }
};
