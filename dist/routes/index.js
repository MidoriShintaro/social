"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const views_1 = require("../controllers/views");
const viewRoute = (0, express_1.Router)();
viewRoute.get("/", views_1.home);
exports.default = viewRoute;
//# sourceMappingURL=index.js.map