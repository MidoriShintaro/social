import "./Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartRe,
  faComment,
} from "@fortawesome/free-regular-svg-icons";
import { faEllipsis, faHeart as faHeartSo } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { AuthContext } from "../../context/context";
import axios from "../../axios/axios";
import api from "../../axios/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Post({ post, socket, showPost, showOptionPost, data }) {
  const { currentUser } = useContext(AuthContext);
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;
  const [content, setContent] = useState("");
  const [like, setLike] = useState(post.likes.length);
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    setIsLike(post.likes.includes(currentUser.user._id));
  }, [post, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/comment", {
      userId: currentUser.user._id,
      postId: post._id,
      content,
    });
    const body = {
      receiverId: post.userId._id,
      id: post._id,
      content: `${currentUser.user.username} comment your post`,
    };
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setContent("");
      if (post.userId._id !== currentUser.user._id) {
        socket.emit("sendNotification", {
          ...body,
          userId: currentUser.user,
          type: "comment",
        });
        await api.post("/notification", {
          ...body,
          userId: currentUser.user._id,
          type: "post",
        });
      }
    }
  };

  const handleLike = async () => {
    const res = await axios.patch(`/post/${post._id}/like`, {
      userId: currentUser.user._id,
    });
    const body = {
      receiverId: post.userId._id,
      id: post._id,
      content: `${currentUser.user.username} like your post`,
    };
    if (res.data.status === "success") {
      if (res.data.message.startsWith("Like")) {
        if (post.userId._id !== currentUser.user._id) {
          socket.emit("sendNotification", {
            ...body,
            userId: currentUser.user,
            type: "likePost",
          });
          await api.post("/notification", {
            ...body,
            userId: currentUser.user._id,
            type: "post",
          });
        }
      }
      setLike(res.data.updatePost.likes.length);
      setIsLike(!isLike);
    }
  };

  return (
    <div className="post m-auto px-8 w-4/5">
      <div className="post-title flex justify-between items-center">
        <Link to={`/user/${post.userId._id}`}>
          <div className="post-title-user flex items-center my-4">
            <img
              src={photo + "/users/" + post.userId.picturePhoto}
              alt=""
              className="rounded-full border-2 object-cover w-10 h-10"
            />
            <span className="mx-3 font-semibold text-black">
              {post.userId.username}
            </span>
            <span className="text-gray-400 font-semibold text-sm">
              {format(post.createdAt)}
            </span>
          </div>
        </Link>
        <div className="post-title-more mr-1 hover:cursor-pointer hover:text-gray-300">
          <FontAwesomeIcon
            icon={faEllipsis}
            onClick={() => {
              showOptionPost(true);
              data(post);
            }}
          />
        </div>
      </div>
      <div className="post-content">
        <img
          src={photo + "/posts/" + post.img}
          alt=""
          className="object-cover rounded"
        />
      </div>
      <div className="post-footer">
        <div className="post-action flex justify-between items-center my-4 text-2xl">
          <div className="post-reaction flex">
            <div className="mr-2">
              <FontAwesomeIcon
                icon={isLike === true ? faHeartSo : faHeartRe}
                onClick={handleLike}
                className={`hover:cursor-pointer ${
                  isLike ? "text-red-500" : ""
                }`}
              />
            </div>
            <div className="mx-2">
              <FontAwesomeIcon
                icon={faComment}
                flip="horizontal"
                className="hover:cursor-pointer"
                onClick={() => {
                  showPost(true);
                  data(post);
                }}
              />
            </div>
          </div>
        </div>
        <div className="post-footer-like mb-1">
          <span className="font-semibold">{like} likes</span>
        </div>
        <div className="post-footer-user text-sm my-1">
          <span className="font-semibold mr-2">{post.userId.username}</span>
          <span>{post.desc}</span>
        </div>
        <div className="post-footer-content my-3">
          <span>{post.content}</span>
        </div>
        <div className="post-footer-view-comment my-1 text-sm">
          <span
            className="text-gray-400 hover:cursor-pointer"
            onClick={() => {
              showPost(true);
              data(post);
            }}
          >
            View {post.comments.length} comments
          </span>
        </div>
        <div className="post-footer-comment my-2 text-sm">
          <form
            onSubmit={handleSubmit}
            action=""
            method="post"
            className="w-full flex justify-between items-center"
          >
            <input
              type="text"
              className="outline-none w-full"
              placeholder="Add a comment..."
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
            {content && (
              <button
                type="submit"
                className="font-semibold text-sm text-blue-400 cursor-pointer"
              >
                Send
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
