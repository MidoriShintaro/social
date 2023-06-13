import { Router } from "express";
import {
  createNotification,
  deleteNotification,
  getAllNotification,
  getNotification,
} from "../controllers/notification";
import { protect } from "../controllers/auth";

const router = Router();

router.use(protect);
router.get("/", getAllNotification);
router.get("/:receiverId", getNotification);
router.post("/", createNotification);
router.delete("/:id", deleteNotification);

export default router;
