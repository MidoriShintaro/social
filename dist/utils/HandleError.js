"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HandleError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "false" : "success";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = HandleError;
//# sourceMappingURL=HandleError.js.map