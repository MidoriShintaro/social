import { Request } from "express";
import multer, { Multer, FileFilterCallback } from "multer";
import crypto from "crypto";
type DestinationCallBack = (error: Error | null, destination: string) => void;
type FilenameCallBack = (error: Error | null, filename: string) => void;

const configMulter = (destination: string): Multer => {
  const storage = multer.diskStorage({
    destination(
      req: Request,
      file: Express.Multer.File,
      callback: DestinationCallBack
    ): void {
      callback(null, `src/public/${destination}`);
    },
    filename(
      req: Request,
      file: Express.Multer.File,
      callback: FilenameCallBack
    ): void {
      const ext = file.originalname.split(".")[1];
      const filename = crypto
        .createHash("sha256")
        .update(file.originalname)
        .digest("hex");
      callback(null, filename + "." + ext);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ): void => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };

  return multer({ storage, fileFilter });
};

export default configMulter;
