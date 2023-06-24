"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversation_1 = require("../controllers/conversation");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.post("/", conversation_1.newConversation);
router.get("/:userId", conversation_1.getConversation);
router.patch("/liked", conversation_1.likeConversation);
router.delete("/:senderId/:receiverId", conversation_1.deleteConversation);
exports.default = router;
//# sourceMappingURL=conversation.js.map