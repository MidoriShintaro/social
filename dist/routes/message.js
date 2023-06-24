"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_1 = require("../controllers/message");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.post("/", message_1.uploadImageMessage, message_1.createMessage);
router.get("/:conversationId", message_1.getMessage);
router.delete("/:messageId", message_1.deleteMessage);
exports.default = router;
//# sourceMappingURL=message.js.map