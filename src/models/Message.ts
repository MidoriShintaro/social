import { Schema, model } from "mongoose";

interface IMessage {
  conversationId: string;
  sender: string;
  content: string;
  isLiked: string;
  image: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: String, required: true },
    sender: { type: String, required: true },
    content: { type: String, default: "" },
    isLiked: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const Message = model<IMessage>("Message", MessageSchema);
export default Message;
