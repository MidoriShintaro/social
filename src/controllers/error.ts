import { NextFunction, Request, Response } from "express";
import HandleError from "./../utils/HandleError";

export const HandlingError = (
  err: HandleError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
};
