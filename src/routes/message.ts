import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getMessage,
  uploadImageMessage,
} from "../controllers/message";
import { protect } from "../controllers/auth";

const router = Router();

router.use(protect);
router.post("/", uploadImageMessage, createMessage);
router.get("/:conversationId", getMessage);
router.delete("/:messageId", deleteMessage);

export default router;
