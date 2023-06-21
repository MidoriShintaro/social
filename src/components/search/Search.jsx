import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faXmark } from "@fortawesome/free-solid-svg-icons";
import api from "../../axios/axios";
import "./Search.css";
import { Link } from "react-router-dom";

export default function Search() {
  const [listUser, setListUser] = useState([]);
  const [findUser, setFindUser] = useState("");
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getListUser = async () => {
      const res = await api.get("/user");
      if (res.data.status === "success") {
        setListUser(res.data.users);
      }
    };
    getListUser();
  });

  const searchUser = (users) => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().indexOf(findUser.toLowerCase()) !== -1
    );
  };

  return (
    <div className="search bg-white fixed h-full">
      <div className="top py-6 px-4 border-b">
        <h1 className="font-bold text-xl mb-6">Search</h1>
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none focus:outline-none"
          onChange={(e) => setFindUser(e.target.value)}
        />
      </div>
      <div className="bottom py-6">
        <p className="mb-3 px-4">Recent</p>
        <ul className="list-none">
          {findUser ? (
            searchUser(listUser).map((user) => (
              <Link to={`/user/${user._id}`}>
                <li
                  key={user._id}
                  className="flex px-4 py-3 justify-between items-center hover:bg-gray-200 hover:cursor-pointer"
                >
                  <div className="rightbar-suggestion-user-info flex items-center">
                    <img
                      src={photo + "/users/" + user.picturePhoto}
                      alt=""
                      className="rounded-full w-10 h-10"
                      width="40"
                      height="40"
                    />
                    <div className="rightbar-suggestion-user-info-text ml-2">
                      <p className="font-bold text-sm">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.fullname}</p>
                    </div>
                  </div>
                </li>
              </Link>
            ))
          ) : (
            <p className="text-center font-semibold text-gray-400 mt-32">
              No Recent Found
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
