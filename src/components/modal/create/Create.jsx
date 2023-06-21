import React, { useState } from "react";
import "./Create.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import api from "../../../axios/axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Create({ user, showCreatePost, data, update }) {
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;
  const [description, setDescription] = useState(data.desc);
  const [content, setContent] = useState(data.content);
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const negative = useNavigate();

  const handleUploadImage = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  const handlePost = async () => {
    if (content === "" || description === "" || image === "") {
      toast.error("Please enter full information");
      return;
    }
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("content", content);
    formData.append("desc", description);
    formData.append("img", image);

    const res = await api.post("/post", formData);
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setContent("");
      setDescription("");
      setTimeout(() => {
        negative("/");
        window.location.reload();
      }, 2000);
    }
  };

  const handleUpdate = async () => {
    if (content === "" || description === "") {
      toast.error("Please enter full information");
      return;
    }
    const contentData = content === "" ? data.content : content;
    const descriptionData = description === "" ? data.desc : description;
    const img = image === "" ? data.img : image;
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("content", contentData);
    formData.append("desc", descriptionData);
    formData.append("img", img);
    const res = await api.patch(`/post/${data._id}`, formData);
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setTimeout(() => {
        negative("/");
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <div className="backdrop-post absolute w-full h-full flex justify-center items-center z-50 text-center">
      <div
        className="w-full h-full bg-black absolute opacity-60"
        onClick={() => showCreatePost(false)}
      ></div>
      <div className="create-post bg-white z-50 rounded-lg max-w-4xl">
        {update ? (
          <>
            <div className="create-post-header h-10 w-full border-b flex justify-between items-center">
              <FontAwesomeIcon
                icon={faXmark}
                className="text-lg p-4 hover:cursor-pointer"
                onClick={() => showCreatePost(false)}
              />
              <h1 className="font-semibold text-lg p-4">
                {update ? "Update Post" : "Create New Post"}
              </h1>
              <p
                className="text-sm text-blue-400 font-semibold p-4 hover:cursor-pointer"
                onClick={handleUpdate}
              >
                {update ? "Update" : "Post"}
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
                    src={photo + "/posts/" + data.img}
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <label className="block text-sm font-medium text-gray-900 text-start">
                      Content
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
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
          </>
        ) : (
          <>
            <div className="create-post-header h-10 w-full border-b flex justify-between items-center">
              <FontAwesomeIcon
                icon={faXmark}
                className="text-lg p-4 hover:cursor-pointer"
                onClick={() => showCreatePost(false)}
              />
              <h1 className="font-semibold text-lg p-4">
                {update ? "Update Post" : "Create New Post"}
              </h1>
              <p
                className="text-sm text-blue-400 font-semibold p-4 hover:cursor-pointer"
                onClick={handlePost}
              >
                Post
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
                  <p className="font-semibold text-lg p-3 border-2 border-blue-400 mx-4 text-blue-400 h-full">
                    Select Your Image
                  </p>
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <label className="block text-sm font-medium text-gray-900 text-start">
                      Content
                    </label>
                    <textarea
                      onChange={(e) => setContent(e.target.value)}
                      value={content}
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
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
