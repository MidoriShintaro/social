import mongoose, { Schema, Types, model } from "mongoose";

export interface IUser {
  fullname: string;
  email: string;
  username: string;
  password: string;
  picturePhoto: string;
  followers: Types.Array<string>;
  followings: Types.Array<string>;
  googleId: string;
  facebookId: string;
  isAdmin: boolean;
  relationship: number;
  posts: Types.Array<string>;
}

const UserSchema = new Schema<IUser>(
  {
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
    relationship: { type: Number, enum: [1, 2, 3] },
    posts: [{ type: String, default: [], ref: "Post" }],
  },
  { timestamps: true }
);

// UserSchema.pre("save", function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = bcrypt.hashSync(this.password, 12);
//   next();
// });

const User = model<IUser>("User", UserSchema);
export default User;
