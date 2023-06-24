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
exports.deleteNotification = exports.createNotification = exports.getNotification = exports.getAllNotification = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const HandleError_1 = __importDefault(require("../utils/HandleError"));
const getAllNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield Notification_1.default.find();
    if (notifications.length === 0 || !notifications)
        return next(new HandleError_1.default("Not found notification ", 404));
    res.status(200).json({
        status: "success",
        notifications,
    });
});
exports.getAllNotification = getAllNotification;
const getNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId } = req.params;
    if (!receiverId)
        return next(new HandleError_1.default("UserId must have required", 400));
    let notifications = yield Notification_1.default.find({ receiverId }).populate({
        path: "userId",
        select: "-password",
    });
    notifications = notifications.reverse();
    res.status(200).json({
        status: "success",
        notifications,
    });
});
exports.getNotification = getNotification;
const createNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, receiverId } = req.body;
    if (!userId || !receiverId)
        return next(new HandleError_1.default("UserId or receiverId must have required", 400));
    const notification = yield Notification_1.default.create(req.body);
    if (!notification)
        return next(new HandleError_1.default("Cannot create notification", 400));
    res.status(201).json({
        status: "success",
        notification,
    });
});
exports.createNotification = createNotification;
const deleteNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new HandleError_1.default("Id must have required", 400));
    const notification = yield Notification_1.default.findById(id);
    if (!notification)
        return next(new HandleError_1.default("Not found notification", 404));
    yield Notification_1.default.findByIdAndDelete(notification._id);
    res.status(200).json({
        status: "success",
    });
});
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=notification.js.map