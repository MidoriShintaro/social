import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import HandleError from "../utils/HandleError";
import User from "../models/User";
import configMulter from "../utils/multer";

const upload = configMulter("posts");
export const uploadPostImage = upload.single("img");

export const getAllPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const posts = await Post.find().populate({
    path: "userId",
    select: "-password",
  });
  const postData = posts.reverse();
  if (!posts || posts.length === 0)
    return next(new HandleError("No Post Founded", 404));
  res.status(200).json({
    status: "success",
    posts: postData,
  });
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.body);
  // console.log(req.file);
  const img = req.file?.filename === undefined ? "" : req.file.filename;
  const { userId, content, desc } = req.body;
  if (!userId) return next(new HandleError("User Id must have required", 400));
  const newPost = await Post.create({
    userId,
    content,
    desc,
    img,
  });
  if (!newPost) return next(new HandleError("Cannot create post", 400));
  await User.findByIdAndUpdate(
    newPost.userId,
    { $push: { posts: newPost._id } },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    message: "Post has been created",
  });
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new HandleError("Cannot find post with id", 404));

  res.status(200).json({
    status: "success",
    post,
  });
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new HandleError("Cannot find post with id", 404));
  if (post.userId !== req.body.userId)
    return next(new HandleError("You does not permission", 403));
  await Post.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ status: "success", message: "Post has been updated" });
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new HandleError("Cannot find post with id", 404));
  if (post.userId !== req.body.userId)
    return next(new HandleError("You does not permission", 403));
  await User.findByIdAndUpdate(
    post.userId,
    { $pull: { posts: post._id } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Post has been deleted",
  });
};

export const LikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  let updatePost: any;
  const post = await Post.findById(id);
  if (!post) return next(new HandleError("Cannot find post with id", 404));
  if (post.likes.includes(req.body.userId)) {
    updatePost = await Post.findByIdAndUpdate(
      id,
      { $pull: { likes: req.body.userId } },
      { new: true }
    );
    res
      .status(200)
      .json({ status: "success", message: "Dislike Post", updatePost });
  } else {
    updatePost = await Post.findByIdAndUpdate(
      id,
      { $push: { likes: req.body.userId } },
      { new: true }
    );
    res
      .status(200)
      .json({ status: "success", message: "Like Post", updatePost });
  }
};

export const Timeline = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return next(new HandleError("Cannot find user with id", 404));
  const postUser = await Post.find({ userId: user._id }).populate({
    path: "userId",
    select: "-password",
  });
  const postFriend = await Promise.all(
    user.followings.map((friendId) => {
      return Post.find({ userId: friendId });
    })
  );
  res
    .status(200)
    .json({ status: "success", posts: postUser.concat(...postFriend) });
};
