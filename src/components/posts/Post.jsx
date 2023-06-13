import "./Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartRe,
  faComment,
  faPaperPlane,
  faBookmark,
  faSmileBeam,
} from "@fortawesome/free-regular-svg-icons";
import {
  faEllipsis,
  faHeart as faHeartSo,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { AuthContext } from "../../context/context";
import axios from "../../axios/axios";
import api from "../../axios/axios";

export default function Post({ post, socket, show, data }) {
  const { currentUser } = useContext(AuthContext);
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;
  const [like, setLike] = useState(post.likes.length);
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    setIsLike(post.likes.includes(currentUser.user._id));
  }, [post, currentUser]);

  const handleLike = async () => {
    const res = await axios.patch(`/post/${post._id}/like`, {
      userId: currentUser.user._id,
    });
    const data = {
      receiverId: post.userId._id,
      id: post._id,
      content: `${currentUser.user.username} like your post`,
    };
    if (res.data.status === "success") {
      if (res.data.message.startsWith("Like")) {
        if (post.userId._id !== currentUser.user._id) {
          socket.emit("sendNotification", {
            ...data,
            userId: currentUser.user,
            type: "likePost",
          });
          await api.post("/notification", {
            ...data,
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
        <div className="post-title-more mr-1 hover:cursor-pointer hover:text-gray-300">
          <FontAwesomeIcon icon={faEllipsis} />
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
              />
            </div>
            <div className="ml-2">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="hover:cursor-pointer"
              />
            </div>
          </div>
          <div className="post-save">
            <FontAwesomeIcon
              icon={faBookmark}
              className="hover:cursor-pointer"
            />
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
              show(true);
              data(post);
            }}
          >
            View {post.comments.length} comments
          </span>
        </div>
        <div className="post-footer-comment flex justify-between items-center my-2 text-sm">
          <form action="" method="post" className="w-full">
            <input
              type="text"
              className="outline-none w-full"
              placeholder="Add a comment..."
            />
          </form>
          <FontAwesomeIcon
            icon={faSmileBeam}
            className="text-gray-400 hover:cursor-pointer hover:text-gray-200"
          />
        </div>
      </div>
    </div>
  );
}
