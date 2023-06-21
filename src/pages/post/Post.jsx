import React, { useEffect, useState } from "react";
import "./Post.css";
import CommentList from "../../components/comment/CommentList";
import { useParams } from "react-router-dom";
import api from "../../axios/axios";
import { format } from "timeago.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faHeart as faHeartSo } from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faHeart as faHeartRe,
} from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from "react-toastify";

export default function Post({ user, socket }) {
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [isLikePost, setIsLikePost] = useState(false);
  const [content, setContent] = useState("");
  const [arrivalComment, setArrivalComment] = useState(null);
  const [like, setLike] = useState(post.likes?.length);

  console.log(like);

  useEffect(() => {
    setIsLikePost(post.likes?.includes(user._id));
  }, [post, user]);

  useEffect(() => {
    socket?.on("getComment", (data) => {
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
    const getPost = async () => {
      const res = await api.get(`/post/${postId}`);
      if (res.data.status === "success") {
        setPost(res.data.post);
      }
    };
    getPost();
  }, [postId]);

  useEffect(() => {
    const getComment = async () => {
      const res = await api.get(`/comment`);
      if (res.data.status === "success") {
        setComments(res.data.comments);
      }
    };
    getComment();
  }, []);

  const handleLikePost = async () => {
    const res = await api.patch(`/post/${post._id}/like`, { userId: user._id });
    const sendData = {
      receiverId: post.userId._id,
      id: post._id,
      content: `${user.username} like your post`,
    };
    if (res.data.status === "success") {
      if (res.data.message.startsWith("Like")) {
        if (post.userId._id !== user._id) {
          socket?.emit("sendNotification", {
            ...sendData,
            userId: user,
            type: "likePost",
          });
          await api.post("/notification", {
            ...sendData,
            userId: user._id,
            type: "post",
          });
        }
      }
      setLike(res.data.updatePost.likes.length);
      setIsLikePost(!isLikePost);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await api.post("/comment", {
      userId: user._id,
      postId: post._id,
      content,
    });
    const body = {
      receiverId: post.userId._id,
      content: `${user.username} comment your post`,
      id: post._id,
    };

    if (res.data.status === "success") {
      socket.emit("sendComment", {
        content,
        userId: user,
        postId: post,
      });
      res.data.comment.userId = user;
      toast.success(res.data.message);
      if (user._id !== post.userId._id) {
        socket?.emit("sendNotification", {
          ...body,
          userId: user,
          type: "comment",
        });

        await api.post("/notification", {
          ...body,
          userId: user._id,
          type: "post",
        });
      }
    }
    setContent("");
    setComments([...comments, res.data.comment]);
  };

  return (
    <div className="backdrop-comment w-3/4 h-full mt-12 mx-1 p-6">
      <div className="post-comment flex justify-center items-center h-full">
        <div className="post-comment-img w-1/2">
          <img
            src={photo + "/posts/" + post.img}
            alt=""
            className="w-full h-full"
          />
        </div>
        <div className="post-comment-content w-1/2 bg-white border">
          <div className="post-comment-content-title border-b flex justify-between items-center">
            <div className="post-comment-title-user hover:cursor-pointer flex items-center my-4 px-4 text-sm">
              <img
                src={photo + "/users/" + post.userId?.picturePhoto}
                alt=""
                className="rounded-full border-2 object-cover w-10 h-10"
              />
              <span className="mx-3 font-semibold text-black hover:text-gray-400">
                {post.userId?.username}
              </span>
            </div>
            <div className="comment-title-more mr-4 hover:cursor-pointer hover:text-gray-300">
              <FontAwesomeIcon icon={faEllipsis} />
            </div>
          </div>
          <div className="post-comment-body">
            <div className="post-comment-body-content overflow-y-scroll text-sm p-4">
              <div className="post-comment-body-user">
                <div className="post-comment-body-user-title flex items-center">
                  <img
                    src={photo + "/users/" + post.userId?.picturePhoto}
                    alt=""
                    className="rounded-full border-2 object-cover hover:cursor-pointer w-10 h-10"
                  />
                  <div className="post-comment-body-user-content ml-3">
                    <span className="font-semibold hover:cursor-pointer text-black hover:text-gray-400">
                      {post.userId?.username}
                    </span>
                    <span className="ml-2 text-sm">{post.content}</span>
                  </div>
                </div>
                <div className="post-comment-body-user-info ml-12">
                  <div className="post-comment-body-post-timeline px-1">
                    <span className="text-gray-400 font-normal text-xs">
                      {format(post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="post-comment-body-friend">
                <ul>
                  {comments.map((comment) => (
                    <>
                      {comment.postId._id === post._id && (
                        <CommentList
                          comment={comment}
                          user={user}
                          key={comment._id}
                          socket={socket}
                        />
                      )}
                    </>
                  ))}
                </ul>
              </div>
            </div>
            <div className="post-comment-footer border-y px-4">
              <div className="post-comment-action flex justify-between items-center my-3 text-2xl">
                <div className="post-comment-reaction flex hover:cursor-pointer ">
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
                    <FontAwesomeIcon icon={faComment} flip="horizontal" />
                  </div>
                </div>
              </div>
              <div className="post-comment-num-like my-3">
                <span className="font-semibold text-sm">
                  {post.likes?.length} likes
                </span>
              </div>
              <div className="post-comment-footer-timeline mb-3">
                <span className="text-gray-400 font-semibold">
                  {format(post.createdAt)}
                </span>
              </div>
            </div>
            <div className="post-footer-comment p-4">
              <form
                className="w-full flex justify-between items-center"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  className="outline-none w-full"
                  placeholder="Add a comment..."
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
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
