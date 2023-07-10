import { useContext, useEffect, useState } from "react";
import "./RightBar.css";
import { AuthContext } from "../../context/context";
import api from "../../axios/axios";
import SuggestUser from "../suggestUser/SuggestUser";
import { logout } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function RightBar({ user, socket }) {
  const { currentUser } = useContext(AuthContext);
  const [suggestUser, setSuggestUser] = useState([]);
  const negative = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    const getSuggestUser = async () => {
      const res = await api.get("/user?limit=5");
      setSuggestUser(res.data.users);
    };
    getSuggestUser();
  }, [currentUser]);

  // const shuffleUser = (arr) => {
  //   const listUser = [...arr];
  //   for (let i = listUser.length - 1; i > 1; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [listUser[i], listUser[j]] = [listUser[j], listUser[i]];
  //   }
  //   return listUser;
  // };

  // const shuffleListUser = shuffleUser(suggestUser);

  return (
    <div className="rightbar basis-1/4">
      <div className="rightbar-wrapper my-8 py-4 px-7">
        <div className="rightbar-user  flex justify-between items-center">
          <div className="rightbar-user-info flex items-center">
            <img
              src={user?.picturePhoto}
              alt=""
              className="rounded-full border-2 w-16 h-16"
            />
            <div className="rightbar-user-info-text ml-2">
              <p className="font-bold">{user?.username}</p>
              <p className="text-sm text-gray-400">{user?.fullname}</p>
            </div>
          </div>
          <div className="rightbar-switch-user">
            <p
              className="text-sm text-blue-500 font-medium hover:cursor-pointer"
              onClick={() => {
                logout(removeCookie);
                negative("/login");
                window.location.reload();
              }}
            >
              Switch
            </p>
          </div>
        </div>
        <div className="rightbar-suggestion flex items-center justify-between my-4">
          <span className="text-sm font-semibold text-gray-400">
            Suggestion for you
          </span>
          <span className="text-xs font-medium hover:text-gray-400 hover:cursor-pointer">
            See All
          </span>
        </div>
        <div className="rightbar-suggestion-friend my-6">
          {suggestUser
            ?.filter((user) => user._id !== currentUser.user._id)
            ?.map((user) => (
              <SuggestUser socket={socket} user={user} key={user._id} />
            ))}
        </div>
        <p className="text-gray-400 font-semibold text-xs my-4">
          © 2023 RAITOSOCIAL FROM RAITO
        </p>
      </div>
    </div>
  );
}
