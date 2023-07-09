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
exports.Follow = exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUser = exports.uploadAvatar = void 0;
const User_1 = __importDefault(require("../models/User"));
const HandleError_1 = __importDefault(require("../utils/HandleError"));
const multer_1 = __importDefault(require("../utils/multer"));
const cloudinary_1 = require("../utils/cloudinary");
const upload = (0, multer_1.default)("users");
exports.uploadAvatar = upload.single("picturePhoto");
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit;
    const users = yield User_1.default.find().limit(parseInt(limit)).select("-password");
    if (!users || users.length === 0)
        return next(new HandleError_1.default("No Founded User", 404));
    res.status(200).json({ status: "success", users });
});
exports.getAllUser = getAllUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield User_1.default.findById(id).select("-password");
    if (!user)
        return next(new HandleError_1.default("Cannot find user with id", 404));
    res.status(200).json({
        status: "success",
        user,
    });
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const path = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) === undefined ? "" : req.file.path;
    const picturePhoto = yield (0, cloudinary_1.uploadCloud)(path, "social/user");
    const { email, username, fullname } = req.body;
    const user = yield User_1.default.findById(id);
    if (!user)
        return next(new HandleError_1.default("Cannot find user", 404));
    yield User_1.default.findByIdAndUpdate(id, { email, username, fullname, picturePhoto }, { new: true }).select("-password");
    res.status(200).json({
        status: "success",
        message: "Profile has been update",
    });
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (req.body.id !== id)
        return next(new HandleError_1.default("You does not permission", 403));
    yield User_1.default.findByIdAndDelete(id);
    res
        .status(200)
        .json({ status: "success", message: "Account has been deleted" });
});
exports.deleteUser = deleteUser;
const Follow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.body;
    if (id !== userId) {
        const user = yield User_1.default.findById(id);
        const curUser = yield User_1.default.findById(userId);
        if (!user || !curUser)
            return next(new HandleError_1.default("Cannot find user with id", 404));
        if (!user.followers.includes(userId)) {
            yield User_1.default.findByIdAndUpdate(user.id, {
                $push: { followers: curUser._id },
            }, { new: true });
            yield User_1.default.findByIdAndUpdate(curUser.id, {
                $push: { followings: user._id },
            }, { new: true });
            res
                .status(200)
                .json({ status: "success", message: `Follow ${user.username}` });
        }
        else {
            yield User_1.default.findByIdAndUpdate(user.id, {
                $pull: { followers: curUser._id },
            }, { new: true });
            yield User_1.default.findByIdAndUpdate(curUser.id, {
                $pull: { followings: user._id },
            }, { new: true });
            res
                .status(200)
                .json({ status: "success", message: `UnFollow ${user.username}` });
        }
    }
});
exports.Follow = Follow;
//# sourceMappingURL=user.js.map