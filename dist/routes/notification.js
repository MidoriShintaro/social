"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_1 = require("../controllers/notification");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.get("/", notification_1.getAllNotification);
router.get("/:receiverId", notification_1.getNotification);
router.post("/", notification_1.createNotification);
router.delete("/:id", notification_1.deleteNotification);
exports.default = router;
//# sourceMappingURL=notification.js.map