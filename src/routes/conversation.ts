import { Router } from "express";
import {
  likeConversation,
  getConversation,
  newConversation,
  deleteConversation,
} from "../controllers/conversation";
import { protect } from "../controllers/auth";

const router = Router();

router.use(protect);
router.post("/", newConversation);
router.get("/:userId", getConversation);
router.patch("/liked", likeConversation);
router.delete("/:senderId/:receiverId", deleteConversation);

export default router;
