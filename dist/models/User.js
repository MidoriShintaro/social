"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 6 },
    picturePhoto: { type: String, default: "default.png" },
    followers: [{ type: String, default: [] }],
    followings: [{ type: String, default: [] }],
    isAdmin: { type: Boolean, default: false },
    googleId: { type: String },
    facebookId: { type: String },
    posts: [{ type: String, default: [], ref: "Post" }],
}, { timestamps: true });
// UserSchema.pre("save", function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = bcrypt.hashSync(this.password, 12);
//   next();
// });
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map