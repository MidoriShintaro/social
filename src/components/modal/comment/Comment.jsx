import { format } from "timeago.js";
import "./Comment.css";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faHeart as faHeartSo,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faHeart as faHeartRe,
} from "@fortawesome/free-regular-svg-icons";
import api from "../../../axios/axios";
import { AuthContext } from "../../../context/context";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import CommentList from "../../comment/CommentList";

export default function Comment({ showPost, data, socket }) {
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isLikePost, setIsLikePost] = useState(false);
  const [numLikePost, setNumLikePost] = useState(data.likes.length);
  const [arrivalComment, setArrivalComment] = useState(null);

  useEffect(() => {
    setIsLikePost(data.likes.includes(currentUser.user._id));
  }, [currentUser, data]);

  useEffect(() => {
    socket.on("getComment", (data) => {
      setArrivalComment({
        content: data.content,
        postId: data.postId,
        userId: data.userId,
        likes: [],
      });
    });
  }, [socket]);

  useEffect(() => {
    if (arrivalComment) {
      setComments((preComment) => [...preComment, arrivalComment]);
    }
  }, [arrivalComment]);

  useEffect(() => {
    const getComments = async () => {
      const res = await api.get("/comment");
      if (res.data.status === "success") {
        setComments(res.data.comments);
      }
    };
    getComments();
  }, []);

  const handleLikePost = async () => {
    const res = await api.patch(`/post/${data._id}/like`, {
      userId: currentUser.user._id,
    });
    const sendData = {
      receiverId: data.userId._id,
      id: data._id,
      content: `${currentUser.user.username} like your post`,
    };
    if (res.data.status === "success") {
      if (res.data.message.startsWith("Like")) {
        if (data.userId._id !== currentUser.user._id) {
          socket.emit("sendNotification", {
            ...sendData,
            userId: currentUser.user,
            type: "likePost",
          });
          await api.post("/notification", {
            ...sendData,
            userId: currentUser.user._id,
            type: "post",
          });
        }
      }
      setNumLikePost(res.data.updatePost.likes.length);
      setIsLikePost(!isLikePost);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await api.post("/comment", {
      userId: currentUser.user._id,
      postId: data._id,
      content,
    });
    const body = {
      receiverId: data.userId._id,
      content: `${currentUser.user.username} comment your post`,
      id: data._id,
    };

    if (res.data.status === "success") {
      socket.emit("sendComment", {
        content,
        userId: currentUser.user,
        postId: data,
      });
      res.data.comment.userId = currentUser.user;
      toast.success(res.data.message);
      if (currentUser.user._id !== data.userId._id) {
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
    setContent("");
    setComments([...comments, res.data.comment]);
  };

  const handleClick = () => {
    showPost(false);
  };
  return (
    <div className="backdrop-comment flex absolute w-full justify-center items-center z-50 h-full">
      <div
        className="w-full h-full bg-black absolute opacity-60"
        onClick={handleClick}
      ></div>
      <div className="comment flex justify-center items-center">
        <div className="comment-img w-1/2">
          <img
            src={photo + "/posts/" + data.img}
            alt=""
            className="w-full h-full"
          />
        </div>
        <div className="comment-content w-1/2 bg-white">
          <div className="comment-content-title border-b flex justify-between items-center">
            <div className="comment-title-user hover:cursor-pointer flex items-center my-4 px-4 text-sm">
              <img
                src={photo + "/users/" + data.userId.picturePhoto}
                alt=""
                className="rounded-full border-2 object-cover w-10 h-10"
              />
              <span className="mx-3 font-semibold text-black hover:text-gray-400">
                {data.userId.username}
              </span>
            </div>
            <div className="comment-title-more mr-4 hover:cursor-pointer hover:text-gray-300">
              <FontAwesomeIcon icon={faEllipsis} />
            </div>
          </div>
          <div className="comment-body">
            <div className="comment-body-content overflow-y-scroll text-sm p-4">
              <div className="comment-body-user">
                <div className="comment-body-user-title flex items-center">
                  <img
                    src={photo + "/users/" + data.userId.picturePhoto}
                    alt=""
                    className="rounded-full border-2 object-cover hover:cursor-pointer w-10 h-10"
                  />
                  <div className="comment-body-user-content ml-3">
                    <Link to={`/user/${data.userId._id}`}>
                      <span className="font-semibold hover:cursor-pointer text-black hover:text-gray-400">
                        {data.userId.username}
                      </span>
                    </Link>
                    <span className="ml-2 text-sm">{data.content}</span>
                  </div>
                </div>
                <div className="comment-body-user-info ml-12">
                  <div className="comment-body-post-timeline px-1">
                    <span className="text-gray-400 font-normal text-xs">
                      {format(data.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="comment-body-friend">
                <ul>
                  {comments.map((com) => (
                    <>
                      {com.postId._id === data._id && (
                        <CommentList
                          comment={com}
                          user={currentUser.user}
                          socket={socket}
                          key={com._id}
                        />
                      )}
                    </>
                  ))}
                </ul>
              </div>
            </div>
            <div className="comment-footer border-y px-4">
              <div className="comment-action flex justify-between items-center my-3 text-2xl">
                <div className="post-reaction flex hover:cursor-pointer ">
                  <div className="mr-2 ">
                    <FontAwesomeIcon
                      icon={isLikePost === true ? faHeartSo : faHeartRe}
                      className={`hover:text-gray ${
                        isLikePost === true ? "text-red-400" : ""
                      }`}
                      onClick={handleLikePost}
                    />
                  </div>
                  <div className="mx-2">
                    <i className="fa-regular fa-comment fa-flip-horizontal hover:text-gray-400"></i>
                    <FontAwesomeIcon
                      icon={faComment}
                      flip="horizontal"
                      className="hover:text-gray-400"
                    />
                  </div>
                </div>
              </div>
              <div className="comment-num-like my-3">
                <span className="font-semibold text-sm">
                  {numLikePost} likes
                </span>
              </div>
              <div className="comment-footer-timeline mb-3">
                <span className="text-gray-400 font-semibold">
                  {format(data.createdAt)}
                </span>
              </div>
            </div>
            <div className="post-footer-comment p-4">
              <form
                onSubmit={handleSubmit}
                className="w-full flex justify-between items-center "
              >
                <input
                  type="text"
                  value={content}
                  className="outline-none w-full"
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add a comment..."
                />
                <div className="add-comment">
                  <button
                    type="submit"
                    className="text-blue-500 cursor-pointer font-semibold"
                  >
                    {content ? "Post" : ""}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
