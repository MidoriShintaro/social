import { Router } from "express";
import {
  login,
  protect,
  register,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changedPassword,
} from "../controllers/auth";
import passport from "passport";
const authRouter = Router();
// const auth = require("../controllers/auth");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/refresh-token", refreshToken);
authRouter.patch("/reset-password/:token", resetPassword);
authRouter.post("/changed-password", protect, changedPassword);
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

export default authRouter;
