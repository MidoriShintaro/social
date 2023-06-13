import { Schema, Types, model } from "mongoose";

interface IConversation {
  members: Types.Array<string>;
  likes: Types.Array<string>;
}

const ConversationSchema = new Schema<IConversation>(
  {
    members: { type: [String], ref: "User" },
    likes: { type: [String], ref: "User" },
  },
  { timestamps: true }
);

const Conversation = model<IConversation>("Conversation", ConversationSchema);
export default Conversation;
