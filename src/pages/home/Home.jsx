import "./Home.css";
import SideBar from "../../components/sidebar/SideBar";
import Feed from "../../components/feed/Feed";
import RightBar from "../../components/rightbar/RightBar";
import { useState } from "react";
import Comment from "../../components/modal/comment/Comment";
import OptionPost from "../../components/modal/optionPost/OptionPost";
import Create from "../../components/modal/create/Create";

export default function Home({ user, socket }) {
  const [isShowPost, setIsShowPost] = useState(false);
  const [isShowOptionPost, setIsShowOptionPost] = useState(false);
  const [isShowCreatePost, setIsShowCreatePost] = useState(false);
  const [getUpdate, setGetUpdate] = useState(false);
  const [getData, setGetData] = useState({});

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
        <OptionPost
          showOptionPost={showOptionPost}
          showCreatePost={showCreatePost}
          update={handleGetUpdate}
        />
      )}
      {isShowCreatePost && (
        <Create
          data={getData}
          user={user}
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
