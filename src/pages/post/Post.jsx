import React, { useEffect, useState } from "react";
import "./Post.css";
import CommentList from "../../components/comment/CommentList";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../axios/axios";
import { format } from "timeago.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faHeart as faHeartSo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
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
  const [contentUpdate, setContentUpdate] = useState("");
  const [description, setDescription] = useState("");
  const [arrivalComment, setArrivalComment] = useState(null);
  const [like, setLike] = useState(post.likes?.length);
  const [isShowOptionPost, setIsShowOptionPost] = useState(false);
  const [isShowUpdatePost, setIsShowUpdatePost] = useState(false);
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const negative = useNavigate();
  // console.log(like);

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

  const handleUpdatePost = async () => {
    const contentData = contentUpdate === "" ? post?.content : contentUpdate;
    const descriptionData = description === "" ? post?.desc : description;
    const img = image === "" ? post?.img : image;
    const formData = new FormData();
    formData.append("userId", post?.userId._id);
    formData.append("content", contentData);
    formData.append("desc", descriptionData);
    formData.append("img", img);

    const res = await api.patch(`/post/${post?._id}`, formData);
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setTimeout(() => {
        negative(`/user/${user._id}`);
        window.location.reload();
      }, 2000);
    }
  };

  const handleDeletePost = async () => {
    const res = await api.delete(`/post/${post?._id}`);
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setTimeout(() => {
        negative(`/user/${user._id}`);
        window.location.reload();
      }, 2000);
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

  const handleUploadImage = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  return (
    <>
      {isShowOptionPost && (
        <div className="modal w-full h-full absolute flex items-center justify-center">
          <div
            className="absolute w-full h-full bg-black z-20 opacity-60"
            onClick={() => {
              setIsShowOptionPost(false);
            }}
          ></div>
          <div className="bg-white z-50 absolute rounded-3xl w-1/2">
            <ul className="list-none cursor-pointer">
              <li
                className="font-semibold text-red-400 border-b text-base text-center py-3"
                onClick={() => {
                  setIsShowOptionPost(false);
                  setIsShowUpdatePost(true);
                }}
              >
                Update
              </li>
              <li
                className="font-semibold text-red-400 border-b text-base text-center py-3"
                onClick={handleDeletePost}
              >
                Delete
              </li>
              <li
                className="font-semibold text-center py-3"
                onClick={() => {
                  setIsShowOptionPost(false);
                }}
              >
                Cancel
              </li>
            </ul>
          </div>
        </div>
      )}
      {isShowUpdatePost && (
        <div className="update w-full h-full absolute flex items-center justify-center">
          <div
            className="absolute w-full h-full bg-black z-20 opacity-60"
            onClick={() => {
              setIsShowOptionPost(false);
            }}
          ></div>
          <div className="create-post bg-white z-50 rounded-lg max-w-4xl">
            <div className="create-post-header h-10 w-full border-b flex justify-between items-center">
              <FontAwesomeIcon
                icon={faXmark}
                className="text-lg p-4 hover:cursor-pointer"
                onClick={() => {
                  setIsShowUpdatePost(false);
                }}
              />
              <h1 className="font-semibold text-lg p-4">Update Post</h1>
              <p
                className="text-sm text-blue-400 font-semibold p-4 hover:cursor-pointer"
                onClick={handleUpdatePost}
              >
                Update
              </p>
            </div>
            <div className="create-post-body flex items-center justify-center">
              <div className="create-post-img w-1/2 relative">
                <label
                  htmlFor="image"
                  className="absolute w-full h-full left-0 cursor-pointer"
                ></label>
                <input
                  type="file"
                  id="image"
                  hidden
                  onChange={handleUploadImage}
                />
                {previewImage ? (
                  <img src={previewImage} alt="" className="w-full h-full" />
                ) : (
                  <img
                    src={photo + "/posts/" + post?.img}
                    alt=""
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="create-post-content w-1/2 pl-3 pt-3 border-l">
                <div className="create-post-content-user flex items-center mb-6">
                  <img
                    src={photo + "/users/" + user.picturePhoto}
                    alt=""
                    className="rounded-full w-10 h-10"
                  />
                  <p className="create-post-content-name ml-4 font-semibold text-sm">
                    {user.username}
                  </p>
                </div>
                <form action="">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-900 text-start">
                      Description
                    </label>
                    <input
                      type="text"
                      className="text-gray-900 text-sm block w-full p-1 focus:outline-none outline-none border-b"
                      placeholder="Description..."
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      value={description}
                    />
                  </div>
                  <div className="">
                    <label className="block text-sm font-medium text-gray-900 text-start">
                      Content
                    </label>
                    <textarea
                      value={contentUpdate}
                      onChange={(e) => setContentUpdate(e.target.value)}
                      type="text"
                      className="text-gray-900 text-sm block w-full p-1 focus:outline-none outline-none"
                      placeholder="Content..."
                      rows="11"
                      cols="40"
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
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
                <FontAwesomeIcon
                  icon={faEllipsis}
                  onClick={() => {
                    setIsShowOptionPost(true);
                  }}
                />
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
    </>
  );
}
