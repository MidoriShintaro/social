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
exports.LikeComment = exports.deleteComment = exports.updateComment = exports.getComment = exports.createComment = exports.getAllComments = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const HandleError_1 = __importDefault(require("../utils/HandleError"));
const Post_1 = __importDefault(require("../models/Post"));
const getAllComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield Comment_1.default.find()
        .populate({
        path: "userId",
        select: "-password",
    })
        .populate({ path: "postId" });
    if (!comments || comments.length === 0)
        return next(new HandleError_1.default("No Comment Founded", 404));
    res.status(200).json({
        status: "success",
        comments,
    });
});
exports.getAllComments = getAllComments;
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.body;
    if (!userId || !postId)
        return next(new HandleError_1.default("User Id or Post Id are required", 400));
    const newComment = yield Comment_1.default.create(req.body);
    if (!newComment)
        return next(new HandleError_1.default("Cannot create comment", 400));
    yield Post_1.default.findByIdAndUpdate(newComment.postId, {
        $push: { comments: newComment._id },
    });
    res.status(201).json({
        status: "success",
        message: "Comment has been posted",
        comment: newComment,
    });
});
exports.createComment = createComment;
const getComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const comment = yield Comment_1.default.findById(id);
    if (!comment)
        return next(new HandleError_1.default("Cannot find comment with id", 404));
    res.status(200).json({
        status: "success",
        comment,
    });
});
exports.getComment = getComment;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId, postId } = req.body;
    const comment = yield Comment_1.default.findById(id);
    if (!comment)
        return next(new HandleError_1.default("Cannot find comment with id", 404));
    if (comment.userId !== userId || comment.postId !== postId)
        return next(new HandleError_1.default("You does not permission", 403));
    const updateComment = yield Comment_1.default.findByIdAndUpdate(comment._id, req.body, {
        new: true,
    });
    res.status(200).json({
        status: "success",
        message: "Comment has been updated",
        updateComment,
    });
});
exports.updateComment = updateComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const comment = yield Comment_1.default.findById(id);
    if (!comment)
        return next(new HandleError_1.default("Cannot find comment with id", 404));
    yield Post_1.default.findByIdAndUpdate(comment.postId, {
        $pull: { comments: comment.id },
    }, { new: true });
    yield Comment_1.default.findByIdAndDelete(comment._id);
    res
        .status(200)
        .json({ status: "success", message: "Comment has been deleted" });
});
exports.deleteComment = deleteComment;
const LikeComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { postId, userId } = req.body;
    let likeCmt;
    if (!postId || !userId)
        return next(new HandleError_1.default("Post ID or User ID are required", 400));
    const comment = yield Comment_1.default.findById(id);
    if (!comment)
        return next(new HandleError_1.default("Cannot find comment with id", 404));
    if (comment.likes.includes(userId)) {
        likeCmt = yield Comment_1.default.findByIdAndUpdate(comment._id, { $pull: { likes: userId } }, { new: true });
        res
            .status(200)
            .json({ status: "success", message: "Dislike comment", likeCmt });
    }
    else {
        likeCmt = yield Comment_1.default.findByIdAndUpdate(comment._id, { $push: { likes: userId } }, { new: true });
        res
            .status(200)
            .json({ status: "success", message: "Like comment", likeCmt });
    }
});
exports.LikeComment = LikeComment;
//# sourceMappingURL=comment.js.map