import React, { useEffect, useState } from "react";
import "./Conversation.css";
import api from "../../axios/axios";
import { format } from "timeago.js";

export default function Conversation({ conversation, user, mess, isOnline }) {
  const [member, setMember] = useState({});
  const [messages, setMessage] = useState([]);
  const [online, setOnline] = useState(false);
  const message = messages[messages.length - 1];

  useEffect(() => {
    const memberId = conversation.members.find((m) => m !== user.user._id);
    setOnline(isOnline.find((o) => o.userId === memberId));
    const getUser = async () => {
      const res = await api.get(`/user/${memberId}`);
      setMember(res.data.user);
    };
    getUser();
  }, [user, conversation, isOnline]);

  useEffect(() => {
    const getMessage = async () => {
      const res = await api.get(`/message/${conversation._id}`);
      setMessage(res.data.message);
    };
    getMessage();
  }, [conversation, user, mess]);

  const myself = message?.sender === user.user._id ? "You: " : "";
  const likedMessage =
    message?.sender === user.user._id &&
    (message?.content === "" || !message.content) &&
    message?.isLiked !== ""
      ? `You ${message?.isLiked} ${member?.username}`
      : `${member?.username} ${message?.isLiked} you`;

  return (
    <>
      <div className="box">
        <div className="image">
          <img src={member?.picturePhoto} alt="" className="w-12 h-12" />
        </div>
        <div
          className={`${online ? "online bg-green-400" : "online bg-gray-400"}`}
        ></div>
      </div>

      <div className="information">
        <div className="username">{member?.fullname}</div>
        <div className="content">
          <div className="message">
            {message?.content === "" && message?.isLiked !== ""
              ? likedMessage
              : message?.conversationId === conversation._id &&
                myself + message?.content}
          </div>
          <div className="time text-sm text-gray-400">
            &bull; {format(message?.createdAt)}
          </div>
        </div>
      </div>
    </>
  );
}
