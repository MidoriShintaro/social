"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlingError = void 0;
const HandlingError = (err, req, res, next) => {
    return res.status(err.statusCode).json({
        message: err.message,
        status: err.status,
        stack: err.stack,
    });
};
exports.HandlingError = HandlingError;
//# sourceMappingURL=error.js.map