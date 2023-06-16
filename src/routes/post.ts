import { Router } from "express";
import {
  LikePost,
  Timeline,
  createPost,
  deletePost,
  getAllPost,
  getPost,
  updatePost,
  uploadPostImage,
} from "../controllers/post";
import { protect } from "../controllers/auth";

const router = Router();

router.use(protect);
router.get("/", getAllPost);
router.post("/", uploadPostImage, createPost);
router.get("/:id", getPost);
router.patch("/:id", uploadPostImage, updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/like", LikePost);
router.get("/timeline/:userId", Timeline);

export default router;
