import "./Home.css";
import SideBar from "../../components/sidebar/SideBar";
import Feed from "../../components/feed/Feed";
import RightBar from "../../components/rightbar/RightBar";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/context";
import Comment from "../../components/modal/comment/Comment";
import Post from "../../components/modal/post/Post";
import Create from "../../components/modal/create/Create";

export default function Home({ user }) {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isShowPost, setIsShowPost] = useState(false);
  const [isShowOptionPost, setIsShowOptionPost] = useState(false);
  const [isShowCreatePost, setIsShowCreatePost] = useState(false);
  const [getUpdate, setGetUpdate] = useState(false);
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

  const showPost = (data) => {
    setIsShowPost(data);
  };

  const showOptionPost = (data) => {
    setIsShowOptionPost(data);
  };

  const showCreatePost = (data) => {
    setIsShowCreatePost(data);
  };

  const handleGetData = (data) => {
    setGetData(data);
  };

  const handleGetUpdate = (data) => {
    setGetUpdate(data);
  };

  return (
    <div className="containers">
      {isShowPost && (
        <Comment showPost={showPost} data={getData} socket={socket} />
      )}
      {isShowOptionPost && (
        <Post
          showOptionPost={showOptionPost}
          showCreatePost={showCreatePost}
          update={handleGetUpdate}
        />
      )}
      {isShowCreatePost && (
        <Create
          data={getData}
          user={currentUser.user}
          showCreatePost={showCreatePost}
          update={getUpdate}
        />
      )}
      <div className="homeContainer w-full h-full flex flex-row">
        <SideBar
          user={user}
          socket={socket}
          showCreatePost={showCreatePost}
          update={handleGetUpdate}
        />
        <Feed
          user={user}
          socket={socket}
          showPost={showPost}
          showOptionPost={showOptionPost}
          data={handleGetData}
        />
        <RightBar user={user} socket={socket} />
      </div>
    </div>
  );
}
