"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_1 = require("../controllers/comment");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.get("/", comment_1.getAllComments);
router.post("/", comment_1.createComment);
router.get("/:id", comment_1.getComment);
router.patch("/:id", comment_1.updateComment);
router.delete("/:id", comment_1.deleteComment);
router.patch("/:id/comment-likes", comment_1.LikeComment);
exports.default = router;
//# sourceMappingURL=comment.js.map