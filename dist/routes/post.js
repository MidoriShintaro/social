"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = require("../controllers/post");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.get("/", post_1.getAllPost);
router.post("/", post_1.uploadPostImage, post_1.createPost);
router.get("/:id", post_1.getPost);
router.patch("/:id", post_1.uploadPostImage, post_1.updatePost);
router.delete("/:id", post_1.deletePost);
router.patch("/:id/like", post_1.LikePost);
router.get("/timeline/:userId", post_1.Timeline);
exports.default = router;
//# sourceMappingURL=post.js.map