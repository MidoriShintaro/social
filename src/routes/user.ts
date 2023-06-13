import { Router } from "express";
import {
  deleteUser,
  Follow,
  getAllUser,
  getUser,
  updateUser,
} from "../controllers/user";
import { protect } from "../controllers/auth";

const router = Router();

router.use(protect);
router.get("/", getAllUser);
router.get("/:id", getUser);
router.patch("/:id/", updateUser);
router.delete("/:id/", deleteUser);
router.patch("/:id/follow", Follow);
export default router;
