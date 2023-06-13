"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connect = () => {
    mongoose_1.default
        .connect(process.env.DB_URI)
        .then(() => {
        console.log("Connect successfully");
    })
        .catch((e) => {
        console.log(e);
    });
};
exports.default = connect;
//# sourceMappingURL=db.js.map