import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import HandleError from "../utils/HandleError";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendEmail } from "../utils/email";
dotenv.config();

const token_secret: string = process.env.TOKEN_SECRET as string;
const accessToken_secret: string = process.env.ACCESSTOKEN_SECRET as string;
const refreshToken_secret: string = process.env.REFRESHTOKEN_SECRET as string;

// let refreshTokenList: Array<string> = [];

const signToken = (user: object): string => {
  return jwt.sign(user, token_secret, { expiresIn: "10m" });
};

const signAccessToken = (user: object): string => {
  return jwt.sign(user, accessToken_secret, {
    expiresIn: "20d",
  });
};

const signRefreshToken = (user: object): string => {
  return jwt.sign(user, refreshToken_secret, {
    expiresIn: "30d",
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, fullname, username, password } = req.body;
  if (!email || !fullname || !username || !password) {
    return next(new HandleError("All fields are required", 400));
  }

  const userEmail = await User.findOne({ email });
  const userUsername = await User.findOne({ username });
  if (userEmail || userUsername)
    return next(new HandleError("Email or username already exists", 400));

  const newUser = new User({
    fullname,
    email,
    username,
    password: bcrypt.hashSync(password, 12),
  });
  if (!newUser) return next(new HandleError("Cannot create new user", 400));
  await newUser.save();

  res.status(201).json({
    status: "success",
    user: newUser,
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new HandleError("Invalid email or password", 400));

  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new HandleError("Incorrect email or password", 400));
  }

  const accessToken = signAccessToken({ id: user._id, isAdmin: user.isAdmin });
  const refreshToken = signRefreshToken({
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
};

export const protect = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  let token: string;
  let auth: string | undefined = req.headers.authorization;
  const isSecure = process.env.NODE_ENV === "production";
  if (auth) {
    token = auth.split(" ")[1];
  } else {
    token = req.cookies.access_token;
  }
  if (!token) {
    return next(new HandleError("Unauthorization", 401));
  }
  jwt.verify(token, accessToken_secret, async (err, decode) => {
    if (err) return next(new HandleError(err.message, 401));
    const { id } = decode as JwtPayload;
    const user = await User.findById(id).select("-password");
    // res.status(200).json({ status: "success", user });
    req.user = user;
    res.locals.user = user;
    res.cookie("user", user, {
      httpOnly: false,
      secure: isSecure,
      expires: new Date(Date.now() + 30 * 24 * 3600000),
    });
    next();
  });
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new HandleError("Unauthorization", 401));
  jwt.verify(
    refreshToken,
    refreshToken_secret,
    async (err: any, payload: any) => {
      if (err) return next(new HandleError(err.message, 401));
      const { id, isAdmin } = payload as JwtPayload;
      const refreshToken = signAccessToken({ id, isAdmin });
      const accessToken = signAccessToken({ id, isAdmin });
      const user = await User.findById(id).select("-password");
      res.status(200).json({
        status: "success",
        user,
        refreshToken,
        accessToken,
      });
    }
  );
  next();
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req.cookies;
  if (access_token || refresh_token) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({ status: "success" });
  } else {
    res.status(400).json({ status: "fail" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new HandleError("Cannot find user with email", 404));
  const token = signToken({ id: user._id });
  const url = `${req.protocol}://localhost:3000/reset-password/${token}`;
  const body = `Click the url to the reset password: <a href="${url}">Reset password</a>`;
  sendEmail(email, "Reset Password", body);

  res.status(200).json({
    status: "success",
    message:
      "Password reset link sent to your email. Please check your email box",
  });
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  const password: string = req.body.password;
  const confirmPassword: string = req.body.confirmPassword;
  if (password !== confirmPassword)
    return next(new HandleError("Password Confirm not the same", 400));
  jwt.verify(token, token_secret, async (err, decode) => {
    if (err) return next(new HandleError(err.message, 400));
    const { id } = decode as JwtPayload;
    await User.findByIdAndUpdate(
      id,
      {
        password: bcrypt.hashSync(password, 12),
      },
      { new: true }
    );
    // if (user !== null) {
    //   const newPassword = bcrypt.hashSync(password, 12);
    //   user.password = newPassword;
    //   await user.save();
    // }
  });
  res
    .status(200)
    .json({ status: "success", message: "Password Changed Successfully" });
};

export const changedPassword = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = req.user;
  if (!user) return next(new HandleError("Unauthorization", 401));
  if (!(await bcrypt.compare(currentPassword, user.password)))
    return next(new HandleError("Incorrect current password", 400));
  if (newPassword !== confirmPassword)
    return next(new HandleError("Password confirm not same", 400));
  user.password = bcrypt.hashSync(newPassword, 12);
  await user.save();
  res.status(200).json({ message: "Password have been changed" });
};
