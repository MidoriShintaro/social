import { Router } from "express";
import {
  LikeComment,
  createComment,
  deleteComment,
  getAllComments,
  getComment,
  updateComment,
} from "../controllers/comment";
import { protect } from "../controllers/auth";

const router = Router();

router.use(protect);
router.get("/", getAllComments);
router.post("/", createComment);

router.get("/:id", getComment);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);
router.patch("/:id/comment-likes", LikeComment);

export default router;
