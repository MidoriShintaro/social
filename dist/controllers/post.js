"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeline = exports.LikePost = exports.deletePost = exports.updatePost = exports.getPost = exports.createPost = exports.getAllPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const HandleError_1 = __importDefault(require("../utils/HandleError"));
const User_1 = __importDefault(require("../models/User"));
const getAllPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield Post_1.default.find().populate({
        path: "userId",
        select: "-password",
    });
    if (!posts || posts.length === 0)
        return next(new HandleError_1.default("No Post Founded", 404));
    res.status(200).json({
        status: "success",
        posts,
    });
});
exports.getAllPost = getAllPost;
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId)
        return next(new HandleError_1.default("User Id must have required", 400));
    const newPost = yield Post_1.default.create(req.body);
    if (!newPost)
        return next(new HandleError_1.default("Cannot create post", 400));
    yield User_1.default.findByIdAndUpdate(newPost.userId, { $push: { posts: newPost._id } }, { new: true });
    res.status(201).json({
        status: "success",
        message: "Post has been created",
    });
});
exports.createPost = createPost;
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield Post_1.default.findById(id);
    if (!post)
        return next(new HandleError_1.default("Cannot find post with id", 404));
    res.status(200).json({
        status: "success",
        post,
    });
});
exports.getPost = getPost;
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield Post_1.default.findById(id);
    if (!post)
        return next(new HandleError_1.default("Cannot find post with id", 404));
    if (post.userId !== req.body.userId)
        return next(new HandleError_1.default("You does not permission", 403));
    yield Post_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ status: "success", message: "Post has been updated" });
});
exports.updatePost = updatePost;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield Post_1.default.findById(id);
    if (!post)
        return next(new HandleError_1.default("Cannot find post with id", 404));
    if (post.userId !== req.body.userId)
        return next(new HandleError_1.default("You does not permission", 403));
    yield User_1.default.findByIdAndUpdate(post.userId, { $pull: { posts: post._id } }, { new: true });
    res.status(200).json({
        status: "success",
        message: "Post has been deleted",
    });
});
exports.deletePost = deletePost;
const LikePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let updatePost;
    const post = yield Post_1.default.findById(id);
    if (!post)
        return next(new HandleError_1.default("Cannot find post with id", 404));
    if (post.likes.includes(req.body.userId)) {
        updatePost = yield Post_1.default.findByIdAndUpdate(id, { $pull: { likes: req.body.userId } }, { new: true });
        res
            .status(200)
            .json({ status: "success", message: "Dislike Post", updatePost });
    }
    else {
        updatePost = yield Post_1.default.findByIdAndUpdate(id, { $push: { likes: req.body.userId } }, { new: true });
        res
            .status(200)
            .json({ status: "success", message: "Like Post", updatePost });
    }
});
exports.LikePost = LikePost;
const Timeline = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield User_1.default.findById(userId);
    if (!user)
        return next(new HandleError_1.default("Cannot find user with id", 404));
    const postUser = yield Post_1.default.find({ userId: user._id }).populate({
        path: "userId",
        select: "-password",
    });
    const postFriend = yield Promise.all(user.followings.map((friendId) => {
        return Post_1.default.find({ userId: friendId });
    }));
    res
        .status(200)
        .json({ status: "success", posts: postUser.concat(...postFriend) });
});
exports.Timeline = Timeline;
//# sourceMappingURL=post.js.map