import React, { useState } from "react";
import api from "../../../axios/axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ModalProfile({ show, data }) {
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;
  const [email, setEmail] = useState(data.email);
  const [fullname, setFullname] = useState(data.fullname);
  const [username, setUsername] = useState(data.username);
  const [avatar, setAvatar] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState("");
  const negative = useNavigate();

  const handleUploadImage = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const img = avatar === "" ? data.picturePhoto : avatar;
    const emailData = email === "" ? data.email : email;
    const fullnameData = fullname === "" ? data.fullname : fullname;
    const usernameData = username === "" ? data.username : username;
    const body = new FormData();
    body.append("email", emailData);
    body.append("username", usernameData);
    body.append("fullname", fullnameData);
    body.append("picturePhoto", img);
    const res = await api.patch(`/user/${data._id}`, body);
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setEmail("");
      setFullname("");
      setUsername("");
      setTimeout(() => {
        negative(`/user/${data._id}`);
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center absolute overflow-y-hidden ">
      <div
        className="absolute w-full h-full opacity-60 bg-black z-50"
        onClick={() => show(false, {})}
      ></div>
      <form
        className="absolute bg-white w-3/4 h-3/4 z-50 left-52"
        onSubmit={handleSubmit}
      >
        <div className="space-y-12 p-8 bg-white border">
          <div className="border-gray-900/10 pb-6">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  {previewAvatar ? (
                    <img
                      src={previewAvatar}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <img
                      src={photo + "/users/" + data.picturePhoto}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <input
                    type="file"
                    id="photo"
                    className=""
                    hidden
                    onChange={handleUploadImage}
                  />
                  <label
                    htmlFor="photo"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </label>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    value={username}
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-full">
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    value={fullname}
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8 py-5 flex items-center justify-end gap-x-6 bg-white border-b">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => show(false, {})}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
