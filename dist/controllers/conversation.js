"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.likeConversation = exports.getConversation = exports.newConversation = void 0;
const Conversation_1 = __importDefault(require("../models/Conversation"));
const HandleError_1 = __importDefault(require("../utils/HandleError"));
const User_1 = __importDefault(require("../models/User"));
const newConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId } = req.body;
    const sender = yield User_1.default.findById(senderId);
    const receiver = yield User_1.default.findById(receiverId);
    if (!sender || !receiver)
        return next(new HandleError_1.default("Not found user", 404));
    const existsConversation = yield Conversation_1.default.findOne({
        members: { $all: [sender._id, receiver._id] },
    });
    if (existsConversation)
        return next();
    const newConversation = new Conversation_1.default({
        members: [sender._id, receiver._id],
    });
    const conversation = yield newConversation.save();
    res.status(201).json({
        status: "success",
        conversation,
    });
});
exports.newConversation = newConversation;
const getConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const conversation = yield Conversation_1.default.find({
        members: { $in: [userId] },
    });
    res.status(200).json({ status: "success", conversation });
});
exports.getConversation = getConversation;
const likeConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, friendId } = req.body;
    let updateConversation;
    const conversation = yield Conversation_1.default.findOne({
        members: { $all: [userId, friendId] },
    });
    if (!conversation)
        return next(new HandleError_1.default("Cannot find conversation!!", 404));
    if (conversation.likes.includes(userId)) {
        updateConversation = yield Conversation_1.default.findByIdAndUpdate(conversation._id, { $pull: { likes: userId } }, { new: true });
        res.status(200).json({
            status: "success",
            message: "Dislike message",
            updateConversation,
        });
    }
    else if (!conversation.likes.includes(userId)) {
        updateConversation = yield Conversation_1.default.findByIdAndUpdate(conversation._id, { $push: { likes: userId } }, { new: true });
        res.status(200).json({
            status: "success",
            message: "Like message",
            updateConversation,
        });
    }
});
exports.likeConversation = likeConversation;
const deleteConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId } = req.params;
    const conversation = yield Conversation_1.default.findOne({
        members: { $all: [senderId, receiverId] },
    });
    if (!conversation)
        return next(new HandleError_1.default("Not found conversation with id", 404));
    yield Conversation_1.default.findByIdAndDelete(conversation._id);
    res.status(200).json({
        status: "success",
    });
});
exports.deleteConversation = deleteConversation;
//# sourceMappingURL=conversation.js.map