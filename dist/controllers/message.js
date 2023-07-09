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
exports.deleteMessage = exports.updateMessage = exports.getMessage = exports.createMessage = exports.uploadImageMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const HandleError_1 = __importDefault(require("../utils/HandleError"));
const multer_1 = __importDefault(require("../utils/multer"));
const cloudinary_1 = require("../utils/cloudinary");
const upload = (0, multer_1.default)("messages");
exports.uploadImageMessage = upload.single("image");
const createMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const image = req.file?.filename === undefined ? "" : req.file?.filename;
    const path = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) === undefined ? "" : req.file.path;
    const image = yield (0, cloudinary_1.uploadCloud)(path, "social/message");
    const { conversationId, sender, content, isLiked } = req.body;
    const message = yield Message_1.default.create({
        conversationId,
        sender,
        content,
        isLiked,
        image,
    });
    if (!message)
        return next(new HandleError_1.default("Cannot create message", 500));
    res.status(201).json({
        status: "message",
        message,
    });
});
exports.createMessage = createMessage;
const getMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.params;
    const message = yield Message_1.default.find({ conversationId });
    if (!message)
        return next(new HandleError_1.default("Not found message", 404));
    res.status(200).json({
        status: "success",
        message,
    });
});
exports.getMessage = getMessage;
const updateMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const message = yield Message_1.default.findById(messageId);
    if (!message)
        return next(new HandleError_1.default("Not found message", 404));
    const mess = yield Message_1.default.findByIdAndUpdate(message._id, req.body, {
        new: true,
    });
    res.status(200).json({
        status: "success",
        message: mess,
    });
});
exports.updateMessage = updateMessage;
const deleteMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const message = yield Message_1.default.findById(messageId);
    if (!message)
        return next(new HandleError_1.default("Not found message", 404));
    yield Message_1.default.findByIdAndDelete(message._id);
    res.status(200).json({
        status: "success",
    });
});
exports.deleteMessage = deleteMessage;
//# sourceMappingURL=message.js.map