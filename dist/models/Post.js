"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, ref: "User" },
    desc: { type: String, max: 500 },
    img: { type: String },
    content: { type: String, default: "" },
    likes: { type: [String], default: [], ref: "User" },
    comments: { type: [String], default: [], ref: "Comment" },
}, { timestamps: true });
const Post = (0, mongoose_1.model)("Post", PostSchema);
exports.default = Post;
//# sourceMappingURL=Post.js.map