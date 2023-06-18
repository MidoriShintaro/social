import React, { useEffect, useState } from "react";
import "./Post.css";
import CommentList from "../../components/comment/CommentList";
import { useParams } from "react-router-dom";
import api from "../../axios/axios";

export default function Post({ user, socket }) {
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;
  const { userId, postId } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);

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

  return (
    <div className="backdrop-comment w-full h-full mt-16">
      <div className="post-comment flex justify-center items-center">
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
                src="https://res.cloudinary.com/dyp4yk66w/image/upload/v1662312709/Images/img-cover11.jpg"
                alt=""
                className="rounded-full border-2 object-cover w-10 h-10"
              />
              <span className="mx-3 font-semibold text-black hover:text-gray-400">
                sadjfhkdsf
              </span>
            </div>
            <div className="post-comment-title-more mr-4 hover:cursor-pointer hover:text-gray-300"></div>
          </div>
          <div className="post-comment-body">
            <div className="post-comment-body-content overflow-y-scroll text-sm p-4">
              <div className="post-comment-body-user">
                <div className="post-comment-body-user-title flex items-center">
                  <img
                    src="https://res.cloudinary.com/dyp4yk66w/image/upload/v1662312709/Images/img-cover11.jpg"
                    alt=""
                    className="rounded-full border-2 object-cover hover:cursor-pointer w-10 h-10"
                  />
                  <div className="post-comment-body-user-content ml-3">
                    <span className="font-semibold hover:cursor-pointer text-black hover:text-gray-400">
                      asdfjhsd
                    </span>
                    <span className="ml-2 text-sm">sadhfsjkdhf</span>
                  </div>
                </div>
                <div className="post-comment-body-user-info ml-12">
                  <div className="post-comment-body-post-timeline px-1">
                    <span className="text-gray-400 font-normal text-xs">
                      askdhflksjafdh
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
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <div className="mx-2">
                    <i className="fa-regular fa-comment fa-flip-horizontal hover:text-gray-400"></i>
                  </div>
                </div>
              </div>
              <div className="post-comment-num-like my-3">
                <span className="font-semibold text-sm">sadkhfdsjkf</span>
              </div>
              <div className="post-comment-footer-timeline mb-3">
                <span className="text-gray-400 font-semibold">skjdhfsdkj</span>
              </div>
            </div>
            <div className="post-footer-comment p-4">
              <form className="w-full flex justify-between items-center ">
                <input
                  type="text"
                  className="outline-none w-full"
                  placeholder="Add a comment..."
                />
                <div className="add-comment">
                  <button
                    type="submit"
                    className="text-blue-500 cursor-pointer font-semibold"
                  ></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
