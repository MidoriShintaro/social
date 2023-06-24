"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, ref: "User" },
    receiverId: { type: String, required: true, ref: "User" },
    content: { type: String, default: "" },
    id: { type: String, required: true },
    type: { type: String, default: "" },
}, { timestamps: true });
const Notification = (0, mongoose_1.model)("Notification", NotificationSchema);
exports.default = Notification;
//# sourceMappingURL=Notification.js.map