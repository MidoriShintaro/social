"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const configMulter = (destination) => {
    const storage = multer_1.default.diskStorage({
        destination(req, file, callback) {
            callback(null, `src/public/${destination}`);
        },
        filename(req, file, callback) {
            const ext = file.originalname.split(".")[1];
            const filename = crypto_1.default
                .createHash("sha256")
                .update(file.originalname)
                .digest("hex");
            callback(null, filename + "." + ext);
        },
    });
    const fileFilter = (req, file, callback) => {
        if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg") {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    };
    return (0, multer_1.default)({ storage, fileFilter });
};
exports.default = configMulter;
//# sourceMappingURL=multer.js.map