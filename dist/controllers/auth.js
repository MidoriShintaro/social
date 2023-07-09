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
exports.changedPassword = exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.protect = exports.login = exports.register = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HandleError_1 = __importDefault(require("../utils/HandleError"));
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_1 = require("../utils/email");
dotenv_1.default.config();
const token_secret = process.env.TOKEN_SECRET;
const accessToken_secret = process.env.ACCESSTOKEN_SECRET;
const refreshToken_secret = process.env.REFRESHTOKEN_SECRET;
// let refreshTokenList: Array<string> = [];
const signToken = (user) => {
    return jsonwebtoken_1.default.sign(user, token_secret, { expiresIn: "10m" });
};
const signAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, accessToken_secret, {
        expiresIn: "20d",
    });
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign(user, refreshToken_secret, {
        expiresIn: "30d",
    });
};
exports.signRefreshToken = signRefreshToken;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullname, username, password } = req.body;
    if (!email || !fullname || !username || !password) {
        return next(new HandleError_1.default("All fields are required", 400));
    }
    const userEmail = yield User_1.default.findOne({ email });
    const userUsername = yield User_1.default.findOne({ username });
    if (userEmail || userUsername)
        return next(new HandleError_1.default("Email or username already exists", 400));
    const newUser = new User_1.default({
        fullname,
        email,
        username,
        password: bcrypt_1.default.hashSync(password, 12),
    });
    if (!newUser)
        return next(new HandleError_1.default("Cannot create new user", 400));
    yield newUser.save();
    res.status(201).json({
        status: "success",
        user: newUser,
    });
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new HandleError_1.default("Invalid email or password", 400));
    const user = yield User_1.default.findOne({ email });
    if (!user || !bcrypt_1.default.compareSync(password, user.password)) {
        return next(new HandleError_1.default("Incorrect email or password", 400));
    }
    const accessToken = (0, exports.signAccessToken)({ id: user._id, isAdmin: user.isAdmin });
    const refreshToken = (0, exports.signRefreshToken)({
        id: user._id,
        isAdmin: user.isAdmin,
    });
    // res.cookie("access_token", accessToken, {
    //   httpOnly: true,
    //   maxAge: 20 * 24 * 60 * 60 * 1000,
    // });
    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // });
    user.password = "";
    res.status(200).json({
        status: "success",
        accessToken,
        refreshToken,
        user,
    });
});
exports.login = login;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    let auth = req.headers.authorization;
    const isSecure = process.env.NODE_ENV === "production";
    if (auth) {
        token = auth.split(" ")[1];
    }
    else {
        token = req.cookies.access_token;
    }
    if (!token) {
        return next(new HandleError_1.default("Unauthorization", 401));
    }
    jsonwebtoken_1.default.verify(token, accessToken_secret, (err, decode) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(new HandleError_1.default(err.message, 401));
        const { id } = decode;
        const user = yield User_1.default.findById(id).select("-password");
        // res.status(200).json({ status: "success", user });
        req.user = user;
        res.locals.user = user;
        res.cookie("user", user, {
            httpOnly: false,
            secure: isSecure,
            expires: new Date(Date.now() + 30 * 24 * 3600000),
        });
        next();
    }));
});
exports.protect = protect;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return next(new HandleError_1.default("Unauthorization", 401));
    jsonwebtoken_1.default.verify(refreshToken, refreshToken_secret, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(new HandleError_1.default(err.message, 401));
        const { id, isAdmin } = payload;
        const refreshToken = (0, exports.signAccessToken)({ id, isAdmin });
        const accessToken = (0, exports.signAccessToken)({ id, isAdmin });
        const user = yield User_1.default.findById(id).select("-password");
        return res.status(200).json({
            status: "success",
            user,
            refreshToken,
            accessToken,
        });
    }));
});
exports.refreshToken = refreshToken;
const logout = (req, res, next) => {
    const { access_token, refresh_token } = req.cookies;
    if (access_token || refresh_token) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(200).json({ status: "success" });
    }
    else {
        res.status(400).json({ status: "fail" });
    }
};
exports.logout = logout;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return next(new HandleError_1.default("Cannot find user with email", 404));
    const token = signToken({ id: user._id });
    const url = `${req.protocol}://localhost:3000/reset-password/${token}`;
    const body = `Click the url to the reset password: <a href="${url}">Reset password</a>`;
    (0, email_1.sendEmail)(email, "Reset Password", body);
    res.status(200).json({
        status: "success",
        message: "Password reset link sent to your email. Please check your email box",
    });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password !== confirmPassword)
        return next(new HandleError_1.default("Password Confirm not the same", 400));
    jsonwebtoken_1.default.verify(token, token_secret, (err, decode) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(new HandleError_1.default(err.message, 400));
        const { id } = decode;
        yield User_1.default.findByIdAndUpdate(id, {
            password: bcrypt_1.default.hashSync(password, 12),
        }, { new: true });
        // if (user !== null) {
        //   const newPassword = bcrypt.hashSync(password, 12);
        //   user.password = newPassword;
        //   await user.save();
        // }
    }));
    res
        .status(200)
        .json({ status: "success", message: "Password Changed Successfully" });
});
exports.resetPassword = resetPassword;
const changedPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = req.user;
    if (!user)
        return next(new HandleError_1.default("Unauthorization", 401));
    if (!(yield bcrypt_1.default.compare(currentPassword, user.password)))
        return next(new HandleError_1.default("Incorrect current password", 400));
    if (newPassword !== confirmPassword)
        return next(new HandleError_1.default("Password confirm not same", 400));
    user.password = bcrypt_1.default.hashSync(newPassword, 12);
    yield user.save();
    res.status(200).json({ message: "Password have been changed" });
});
exports.changedPassword = changedPassword;
//# sourceMappingURL=auth.js.map