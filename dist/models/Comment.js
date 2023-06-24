"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    userId: { type: String, ref: "User", required: true },
    postId: { type: String, ref: "Post", required: true },
    content: { type: String, default: "" },
    likes: [{ type: String, ref: "User", default: [] }],
}, { timestamps: true });
const Comment = (0, mongoose_1.model)("Comment", CommentSchema);
exports.default = Comment;
//# sourceMappingURL=Comment.js.map