import React, { useContext, useEffect, useState } from "react";
import api from "../../axios/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/context";
import "./Notification.css";

export default function Notification({ socket }) {
  const { currentUser } = useContext(AuthContext);
  const [notifications, setNotification] = useState([]);
  const today = new Date();
  const thisMonth = today.getMonth() + 1;
  const thisYear = today.getFullYear();
  const [arrivalLikePost, setArrivalLikePost] = useState({});

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setArrivalLikePost({
        userId: data.userId,
        id: data.id,
        receiverId: data.receiverId,
        content: data.content,
        type: data.type,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  useEffect(() => {
    if (arrivalLikePost) {
      setNotification((preNot) => [arrivalLikePost, ...preNot]);
      console.log(arrivalLikePost);
    }
  }, [arrivalLikePost]);

  useEffect(() => {
    const getNotification = async () => {
      const res = await api.get(`/notification/${currentUser.user._id}`);
      if (res.data.status === "success") {
        setNotification(res.data.notifications);
      }
    };
    getNotification();
  }, [currentUser]);

  return (
    <div className="notification bg-white fixed h-full overflow-y-scroll">
      <div className="top p-4 border-b">
        <h1 className="font-bold text-xl">Notifications</h1>
      </div>
      <div className="middle py-5 border-b">
        <h1 className="font-bold text-lg px-4 pb-4">This Month</h1>
        <ul className="list-none">
          {notifications.map((not, i) => (
            <div key={not._id}>
              {new Date(not.createdAt).getMonth() + 1 === thisMonth &&
                new Date(not.createdAt).getFullYear() === thisYear && (
                  <Link
                    to={
                      not.type === "post"
                        ? `/user/${not.userId._id}/post/${not.id}`
                        : `/user/${not.id}`
                    }
                  >
                    <li
                      key={i}
                      className="flex px-4 py-3 justify-between items-center hover:bg-gray-200 hover:cursor-pointer"
                    >
                      <div className="rightbar-suggestion-user-info flex items-center">
                        <img
                          src={not.userId.picturePhoto}
                          alt=""
                          className="rounded-full w-8 h-8"
                        />
                        <div className="rightbar-suggestion-user-info-text ml-2">
                          <p className="text-xs text-gray-400">{not.content}</p>
                        </div>
                      </div>
                    </li>
                  </Link>
                )}
            </div>
          ))}
        </ul>
      </div>
      <div className="bottom pt-5">
        <h1 className="font-bold px-4 pb-4 text-lg">Earlier</h1>
        <ul className="list-none">
          {notifications.map((not, i) => (
            <>
              {new Date(not.createdAt).getMonth() + 1 < thisMonth &&
                new Date(not.createdAt).getFullYear() < thisYear && (
                  <li
                    key={not._id}
                    className="flex px-4 py-3 justify-between items-center hover:bg-gray-200 hover:cursor-pointer"
                  >
                    <div className="rightbar-suggestion-user-info flex items-center">
                      <img
                        src={not.userId.picturePhoto}
                        alt=""
                        className="rounded-full w-8 h-8"
                      />
                      <div className="rightbar-suggestion-user-info-text ml-2">
                        <p className="text-xs text-gray-400">{not.content}</p>
                      </div>
                    </div>
                  </li>
                )}
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}
