import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import connect from "./db/db";
import passport from "passport";
import { HandlingError } from "./controllers/error";
import { initPassport } from "./config/passport";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";
import conversationRouter from "./routes/conversation";
import messageRouter from "./routes/message";
import notificationRouter from "./routes/notification";
import path from "path";
import initSocket from "./socket/socket";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//config socket
initSocket();

//connect db
connect();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(helmet());
app.use(
  cors({
    origin: "https://social-midorishintaro.vercel.app/",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "https://social-midorishintaro.vercel.app/");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(
//   session({
//     secret,
//     resave: true,
//     saveUninitialized: true,
//   })
// );
// app.use(initPassport);

//routes
app.use("/api/auth", authRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);

//global error handling middleware
app.use(HandlingError);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // console.log(__dirname + "../public/images");
});

//server
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
