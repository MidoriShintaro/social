import "./Home.css";
import SideBar from "../../components/sidebar/SideBar";
import Feed from "../../components/feed/Feed";
import RightBar from "../../components/rightbar/RightBar";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/context";
import Comment from "../../components/modal/comment/Comment";

export default function Home({ user }) {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isShowPost, setIsShowPost] = useState(false);
  const [getData, setGetData] = useState({});
  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    socket?.emit("sendUser", currentUser.user._id);
    socket?.on("getUser", (users) => {
      console.log(users);
    });
  }, [currentUser, socket]);

  const show = (data) => {
    setIsShowPost(data);
  };

  const handleGetData = (data) => {
    setGetData(data);
  };

  return (
    <div className="containers">
      {isShowPost && <Comment show={show} data={getData} socket={socket} />}
      <div className="homeContainer w-full h-full flex flex-row">
        <SideBar user={user} socket={socket} />
        <Feed user={user} socket={socket} show={show} data={handleGetData} />
        <RightBar user={user} socket={socket} />
      </div>
    </div>
  );
}
