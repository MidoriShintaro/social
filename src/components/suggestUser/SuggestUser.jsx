import React, { useContext, useEffect, useState } from "react";
import "./SuggestUser.css";
import { AuthContext } from "../../context/context";
import api from "../../axios/axios";

export default function SuggestUser({ user, socket }) {
  const { currentUser } = useContext(AuthContext);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    setIsFollow(user.followers.includes(currentUser.user._id));
  }, [user, currentUser]);

  const handleFollow = async (follow) => {
    const res = await api.patch(`/user/${follow._id}/follow`, {
      userId: currentUser.user._id,
    });
    const data = {
      receiverId: follow._id,
      id: follow._id,
      content: `${currentUser.user.username} followed you`,
    };
    if (
      res.data.status === "success" &&
      res.data.message.startsWith("Follow")
    ) {
      if (currentUser.user._id !== follow._id) {
        socket.emit("sendNotification", {
          ...data,
          userId: currentUser.user,
          type: "follow",
        });
        await api.post("/notification", {
          ...data,
          type: "user",
          userId: currentUser.user._id,
        });
      }
      setIsFollow(true);
    } else if (
      res.data.status === "success" &&
      res.data.message.startsWith("UnFollow")
    ) {
      setIsFollow(false);
    }
  };
  return (
    <div
      className="rightbar-suggestion-user flex my-4 justify-between items-center"
      key={user._id}
    >
      <div className="rightbar-suggestion-user-info flex items-center">
        <img
          src={user.picturePhoto}
          alt=""
          className="rounded-full w-10 h-10"
          width="40"
          height="40"
        />
        <div className="rightbar-suggestion-user-info-text ml-2">
          <p className="font-bold text-sm">{user.username}</p>
          <p className="text-xs text-gray-400">Suggestion for you</p>
        </div>
      </div>
      <div
        className="rightbar-suggestion-follow-user"
        onClick={() => {
          handleFollow(user);
        }}
      >
        <p className="text-sm text-blue-500 font-medium hover:cursor-pointer">
          {isFollow ? "Following" : "Follow"}
        </p>
      </div>
    </div>
  );
}
