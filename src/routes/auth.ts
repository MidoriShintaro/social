import { NextFunction, Request, Response, Router } from "express";
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
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/refresh-token", refreshToken);
router.post("/changed-password", protect, changedPassword);
router.patch("/reset-password/:token", resetPassword);

router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: process.env.SUCCESS_URL,
    failureRedirect: process.env.FAILURE_URL,
  }),
  (req: Request, res: Response) => {
    res.sendStatus(200).json("hello");
  }
);

export default router;
