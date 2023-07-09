import { faImage } from "@fortawesome/free-regular-svg-icons";
import "./Share.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import api from "../../axios/axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Share({ user }) {
  // const [user, setUser] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const negative = useNavigate();

  const handleUploadImage = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if(image.size > 10485760) {
      toast.error("Image size should be less than 1MB");
      return;
    }
    data.append("userId", user?._id);
    data.append("content", content);
    data.append("img", image);
    console.log(image);
    const res = await api.post("/post", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.status === "false") {
      toast.error(res.data.message);
      return;
    }

    if (res.data.status === "success") {
      toast.success(res.data.message);
      setTimeout(() => {
        negative("/");
        window.location.reload();
      }, 3000);
    }
  };
  return (
    <div className="share w-full my-4 py-2 px-12">
      <form action="" onSubmit={handleSubmit} encType="">
        <div className="share-top flex border-b py-4">
          <div className="share-user mr-3">
            <img
              src={user?.picturePhoto}
              alt=""
              className="rounded-full h-8 w-8"
            />
          </div>
          <div className="share-text w-full">
            <input
              type="text"
              className="focus:outline-none w-full outline-none"
              placeholder={`Hey ${user?.username}! What do you think?`}
              onChange={(e) => setContent(e.target.value)}
            />
            {previewImage ? (
              <img src={previewImage} alt="" className="w-36 h-20 mt-3" />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="share-bottom mt-4">
          <div className="share-option flex justify-between">
            <div className="share-option-image hover:cursor-pointer">
              <FontAwesomeIcon icon={faImage} className="mr-2" />
              <label htmlFor="image-video" className="hover:cursor-pointer">
                Image/Video
              </label>
              <input
                type="file"
                onChange={(e) => handleUploadImage(e)}
                id="image-video"
                hidden
              />
            </div>
            <div className="share-submit">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full"
                type="submit"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
