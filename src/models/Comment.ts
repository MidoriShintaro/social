import { Schema, Types, model } from "mongoose";

interface IComment {
  userId: string;
  postId: string;
  content: string;
  likes: Types.Array<string>;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: String, ref: "User", required: true },
    postId: { type: String, ref: "Post", required: true },
    content: { type: String, default: "" },
    likes: [{ type: String, ref: "User", default: [] }],
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", CommentSchema);

export default Comment;
