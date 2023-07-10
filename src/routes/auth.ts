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
  signAccessToken,
  signRefreshToken,
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
  passport.authenticate("facebook", { session: false }),
  function (req: any, res: any) {
    const user = req.user.currentUser;
    const accessToken = signAccessToken({ id: user.id, isAdmin: user.isAdmin });
    const refreshToken = signRefreshToken({
      id: user.id,
      isAdmin: user.isAdmin,
    });
    res.cookie("user", req.user.currentUser);
    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);
    return res.redirect(process.env.SUCCESS_URL);
  }
);

export default router;
