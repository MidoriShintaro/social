import { Schema, model } from "mongoose";

interface INotification {
  userId: string;
  receiverId: string;
  content: string;
  id: string;
  type: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, ref: "User" },
    receiverId: { type: String, required: true, ref: "User" },
    content: { type: String, default: "" },
    id: { type: String, required: true },
    type: { type: String, default: "" },
  },
  { timestamps: true }
);

const Notification = model<INotification>("Notification", NotificationSchema);
export default Notification;
