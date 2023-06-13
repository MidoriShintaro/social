"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.get("/", user_1.getAllUser);
router.get("/:id", user_1.getUser);
router.patch("/:id/", user_1.updateUser);
router.delete("/:id/", user_1.deleteUser);
router.patch("/:id/follow", user_1.Follow);
exports.default = router;
//# sourceMappingURL=user.js.map