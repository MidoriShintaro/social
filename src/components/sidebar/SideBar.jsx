import "./SideBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import {
  faHouse,
  faMagnifyingGlass,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import More from "../modal/more/More";
import { Link } from "react-router-dom";
import { useState } from "react";
import Search from "../search/Search";
import Notification from "../notification/Notification";

const Sidebar = ({ user, socket }) => {
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);
  const [typeSideBar, setTypeSideBar] = useState("");
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="sidebar basis-1/4 flex justify-end">
      <div
        className={`${
          isOpenSideBar === false ? "w-64 sidebar-open" : "sidebar-closed"
        } fixed top-0 left-0 z-40 h-screen transition-transform sm:translate-x-0 border`}
      >
        <div className="h-full px-3 py-4">
          <div className="sidebar-logo my-8">
            <img src="" alt="" />
          </div>
          <div className="sidebar-content">
            <ul className="space-y-2 font-medium">
              <Link to="/">
                <li
                  className="hover:bg-gray-100 hover:rounded-3xl hover:cursor-pointer sidebar-list-item"
                  onClick={() => setIsOpenSideBar(false)}
                >
                  <div className="flex items-center p-2 text-gray-900 rounded-lg">
                    <FontAwesomeIcon
                      icon={faHouse}
                      className="text-2xl sidebar-icon"
                    />
                    <span
                      className={
                        isOpenSideBar === false ? "ml-12" : "opacity-0"
                      }
                    >
                      Home
                    </span>
                  </div>
                </li>
              </Link>
              <li
                className="hover:bg-gray-100 hover:rounded-3xl hover:cursor-pointer sidebar-list-item"
                onClick={() => {
                  setIsOpenSideBar(!isOpenSideBar);
                  setTypeSideBar("search");
                }}
              >
                <div className="flex items-center p-2 text-gray-900 rounded-lg">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-2xl sidebar-icon"
                  />
                  <span
                    className={isOpenSideBar === false ? "ml-12" : "opacity-0"}
                  >
                    Search
                  </span>
                </div>
              </li>
              <Link to="/message">
                <li
                  className="hover:bg-gray-100 hover:rounded-3xl hover:cursor-pointer sidebar-list-item"
                  onClick={() => setIsOpenSideBar(false)}
                >
                  <div className="flex items-center p-2 text-gray-900 rounded-lg">
                    <FontAwesomeIcon
                      icon={faFacebookMessenger}
                      className="text-2xl sidebar-icon"
                    />
                    <span
                      className={
                        isOpenSideBar === false ? "ml-12" : "opacity-0"
                      }
                    >
                      Message
                    </span>
                  </div>
                </li>
              </Link>
              <li
                className="hover:bg-gray-100 hover:rounded-3xl hover:cursor-pointer sidebar-list-item"
                onClick={() => {
                  setIsOpenSideBar(!isOpenSideBar);
                  setTypeSideBar("notification");
                }}
              >
                <div className="flex items-center p-2 text-gray-900 rounded-lg">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-2xl sidebar-icon"
                  />
                  <span
                    className={isOpenSideBar === false ? "ml-12" : "opacity-0"}
                  >
                    Notification
                  </span>
                </div>
              </li>
              <li className="hover:bg-gray-100 hover:rounded-3xl hover:cursor-pointer sidebar-list-item">
                <div className="flex items-center p-2 text-gray-900 rounded-lg">
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    className="text-2xl sidebar-icon"
                  />
                  <span
                    className={isOpenSideBar === false ? "ml-12" : "opacity-0"}
                  >
                    Create
                  </span>
                </div>
              </li>
              <Link to="/profile">
                <li className="hover:bg-gray-100 hover:rounded-3xl hover:cursor-pointer sidebar-list-item">
                  <div className="flex items-center p-2 text-gray-900 rounded-lg">
                    <img
                      src={photo + "/users/" + user?.picturePhoto}
                      alt=""
                      className="rounded-full sidebar-icon w-6 h-6"
                    />
                    <span
                      className={
                        isOpenSideBar === false ? "ml-12" : "opacity-0"
                      }
                    >
                      Profile
                    </span>
                  </div>
                </li>
              </Link>
              <li className="hover:bg-gray-100 hover:rounded-3xl hover:cursor-pointer sidebar-list-item sidebar-more">
                <div className="flex items-center p-2 text-gray-900 rounded-lg">
                  <FontAwesomeIcon
                    icon={faBars}
                    className="text-2xl sidebar-icon"
                  />
                  <span
                    className={isOpenSideBar === false ? "ml-12" : "opacity-0"}
                  >
                    More
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isOpenSideBar === true && typeSideBar === "search" && <Search />}
      {isOpenSideBar === true && typeSideBar === "notification" && (
        <Notification socket={socket} />
      )}
      <More />
    </div>
  );
};

export default Sidebar;
