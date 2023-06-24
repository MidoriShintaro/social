"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    conversationId: { type: String, required: true },
    sender: { type: String, required: true },
    content: { type: String, default: "" },
    isLiked: { type: String, default: "" },
    image: { type: String, default: "" },
}, { timestamps: true });
const Message = (0, mongoose_1.model)("Message", MessageSchema);
exports.default = Message;
//# sourceMappingURL=Message.js.map