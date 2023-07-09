"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post("/register", auth_1.register);
router.post("/login", auth_1.login);
router.post("/logout", auth_1.logout);
router.post("/forgot-password", auth_1.forgotPassword);
router.post("/refresh-token", auth_1.refreshToken);
router.post("/changed-password", auth_1.protect, auth_1.changedPassword);
router.patch("/reset-password/:token", auth_1.resetPassword);
router.get("/facebook", passport_1.default.authenticate("facebook", { scope: "email" }));
router.get("/facebook/callback", passport_1.default.authenticate("facebook", {
    successRedirect: process.env.SUCCESS_URL,
    failureRedirect: process.env.FAILURE_URL,
}), (req, res) => {
    res.sendStatus(200).json("hello");
});
exports.default = router;
//# sourceMappingURL=auth.js.map