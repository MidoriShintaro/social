import { Schema, Types, model } from "mongoose";

export interface IPost {
  userId: string;
  desc: string;
  img: string;
  content: string;
  likes: Types.Array<string>;
  comments: Types.Array<string>;
}

const PostSchema = new Schema<IPost>(
  {
    userId: { type: String, required: true, ref: "User" },
    desc: { type: String, max: 500, default: "" },
    img: { type: String, default: "" },
    content: { type: String, default: "" },
    likes: { type: [String], default: [], ref: "User" },
    comments: { type: [String], default: [], ref: "Comment" },
  },
  { timestamps: true }
);

const Post = model<IPost>("Post", PostSchema);
export default Post;
