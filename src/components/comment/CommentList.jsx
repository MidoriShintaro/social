import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faHeart as faHeartRe } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import {
  faEllipsis,
  faHeart as faHeartSo,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import api from "../../axios/axios";
import "./CommentList.css";

export default function CommentList({ comment, user, socket }) {
  const [updateComment, setUpdateComment] = useState("");
  const [isShowOption, setIsShowOption] = useState(false);
  const [showUpdateComment, setShowUpdateComment] = useState(false);
  const [isLikeComment, setIsLikeComment] = useState(false);
  const [likeComment, setLikeComment] = useState(comment.likes.length);
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    setIsLikeComment(comment.likes.includes(user._id));
  }, [comment, user]);

  const handleDeleteComment = async () => {
    const res = await api.delete(`/comment/${comment._id}`);
    setIsShowOption(false);
    if (res.data.status === "success") {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    const res = await api.patch(`/comment/${comment._id}`, {
      userId: user._id,
      postId: comment.postId._id,
      content: updateComment,
    });
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setShowUpdateComment(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleLikeComment = async () => {
    const res = await api.patch(`/comment/${comment._id}/comment-likes`, {
      userId: user._id,
      postId: comment.postId._id,
    });
    const data = {
      content: `${user.username} like your comment`,
      id: comment.postId._id,
      receiverId: comment.postId.userId,
    };
    if (res.data.status === "success") {
      if (res.data.message.startsWith("Like")) {
        if (user._id !== comment.userId._id) {
          socket.emit("sendNotification", {
            ...data,
            userId: user,
            type: "likeComment",
          });
          await api.post("/notification", {
            ...data,
            type: "post",
            userId: user._id,
          });
        }
      }
      setIsLikeComment(!isLikeComment);
      setLikeComment(res.data.likeCmt.likes.length);
    }
  };

  return (
    <li className="my-4 user-comment relative" key={comment._id}>
      <div className="comment-body-friend-title flex items-center">
        <img
          src={photo + "/users/" + comment.userId.picturePhoto}
          alt=""
          className="rounded-full border-2 object-cover hover:cursor-pointer w-10 h-10"
        />
        <div className="comment-body-friend-content ml-3">
          <Link to={`/user/${comment.userId._id}`}>
            <span className="font-semibold hover:cursor-pointer text-black hover:text-gray-400">
              {comment.userId.username}
            </span>
          </Link>
          <span className="ml-2 text-sm">{comment.content}</span>
          <div className="comment-body-friend-timeline mt-1 flex items-center">
            <div className="w-24">
              <span className="text-gray-400 font-normal text-xs">
                {format(comment.createdAt)}
              </span>
            </div>
            <FontAwesomeIcon
              icon={isLikeComment ? faHeartSo : faHeartRe}
              className="text-sm ml-4 mr-2 hover:cursor-pointer"
              onClick={handleLikeComment}
            />
            <span className="text-gray-400 text-sm">{likeComment} likes</span>
            {comment.userId._id === user._id && (
              <FontAwesomeIcon
                icon={faEllipsis}
                className="text-sm ml-4 comment-option-icon hover:cursor-pointer"
                onClick={() => setIsShowOption(!isShowOption)}
              />
            )}
            <div
              className={`${
                isShowOption ? "block" : "hidden"
              } absolute bg-black text-white top-12 right-40 px-1 rounded-md comment-option hover:cursor-pointer`}
            >
              <span
                className="text-xs pr-1 border-r"
                onClick={() => {
                  setIsShowOption(false);
                  setShowUpdateComment(true);
                }}
              >
                Update
              </span>
              <span className="text-xs ml-1" onClick={handleDeleteComment}>
                Delete
              </span>
            </div>
          </div>
          <form
            className={`${
              showUpdateComment ? "block" : "hidden"
            } w-52 p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white rounded-md`}
            onSubmit={handleUpdateComment}
          >
            <div className="mb-1">
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1 outline-none"
                placeholder="Change your comment..."
                onChange={(e) => setUpdateComment(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto p-1 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Submit
            </button>
            <button
              type="button"
              className="ml-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto p-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              onClick={() => setShowUpdateComment(false)}
            >
              Close
            </button>
          </form>
        </div>
        <div
          className="w-2/5 h-10"
          onClick={() => {
            setIsShowOption(false);
            setShowUpdateComment(false);
          }}
        ></div>
      </div>
    </li>
  );
}
