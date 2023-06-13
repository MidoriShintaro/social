"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const authRouter = (0, express_1.Router)();
// const auth = require("../controllers/auth");
authRouter.post("/register", auth_1.register);
authRouter.post("/login", auth_1.login);
authRouter.post("/logout", auth_1.logout);
authRouter.post("/forgot-password", auth_1.forgotPassword);
authRouter.patch("/reset-password/:token", auth_1.resetPassword);
authRouter.post("/changed-password", auth_1.protect, auth_1.changedPassword);
// authRouter.get(
//   "/auth/facebook",
//   passport.authenticate("facebook", { scope: "email" })
// );
// authRouter.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );
exports.default = authRouter;
//# sourceMappingURL=auth.js.map