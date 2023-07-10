import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Profile.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../axios/axios";

export default function Profile({ current, show, socket }) {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [isFollow, setIsFollow] = useState(false);
  const negative = useNavigate();
  
  useEffect(() => {
    setIsFollow(user.followers?.includes(current?._id));
  }, [user, current]);

  useEffect(() => {
    const timeLine = async () => {
      const res = await api.get(`/post/timeline/${userId}`);
      if (res.data.status === "success") {
        setPosts(res.data.posts);
      }
    };
    timeLine();
  }, [userId, user]);

  useEffect(() => {
    const getUser = async () => {
      const res = await api.get(`/user/${userId}`);
      if (res.data.status === "success") {
        setUser(res.data.user);
      }
    };
    getUser();
  }, [userId]);

  const handleFollow = async () => {
    const res = await api.patch(`/user/${userId}/follow`, {
      userId: current?._id,
    });
    const body = {
      receiverId: userId,
      id: current?._id,
      content: `${current?.username} followed you`,
    };
    if (
      res.data.status === "success" &&
      res.data.message.startsWith("Follow")
    ) {
      if (current?._id !== userId) {
        socket.emit("sendNotification", {
          ...body,
          userId: current,
          type: "follow",
        });
        await api.post("/notification", {
          ...body,
          type: "user",
          userId: current?._id,
        });
      }
      setIsFollow(true);
    } else if (
      res.data.status === "success" &&
      res.data.message.startsWith("UnFollow")
    ) {
      setIsFollow(false);
    }
  };

  const handleCreateConversation = async () => {
    await api.post("/conversation", {
      senderId: current._id,
      receiverId: userId,
    });
    negative("/message");
    window.location.reload();
  };
  return (
    <div className="ml-2 w-3/4">
      <div className="main">
        <div className="profile">
          <div className="profile-image">
            <img src={user.picturePhoto} alt="" className="w-44 h-44" />
          </div>
          <div className="profile-user-settings">
            <h1 className="profile-user-name">{user.username}</h1>
            {userId === current._id ? (
              <>
                <button
                  className="btn profile-edit-btn"
                  onClick={() => {
                    show(true, current);
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="btn profile-settings-btn"
                  aria-label="profile settings"
                >
                  <FontAwesomeIcon
                    icon={faCog}
                    onClick={() => {
                      show(true, current);
                    }}
                  />
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn profile-edit-btn bg-blue-400 text-white"
                  onClick={handleFollow}
                >
                  {isFollow ? "Following" : "Follow"}
                </button>
                <button
                  className="btn profile-edit-btn"
                  onClick={handleCreateConversation}
                >
                  Message
                </button>
              </>
            )}
          </div>
          <div className="profile-stats">
            <ul>
              <li>
                <span className="profile-stat-count">
                  {user.posts?.length} posts
                </span>
              </li>
              <li>
                <span className="profile-stat-count">
                  {user.followers?.length} followers
                </span>
              </li>
              <li>
                <span className="profile-stat-count">
                  {user.followings?.length} following
                </span>
              </li>
            </ul>
          </div>
          <div className="profile-bio">
            <p>
              <span className="profile-real-name">{user.fullname}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="gallery">
          {posts.map((post) => (
            <Link to={`post/${post._id}`} key={post._id}>
              <div className="gallery-item">
                <img src={post.img} className="gallery-image" alt="" />
                <div className="gallery-item-info">
                  <ul>
                    <li className="gallery-item-likes">
                      <span className="visually-hidden mr-2">
                        {post.likes.length}
                      </span>
                      <FontAwesomeIcon icon={faHeart} />
                    </li>
                    <li className="gallery-item-comments">
                      <span className="visually-hidden mr-2">
                        {post.comments.length}
                      </span>
                      <FontAwesomeIcon icon={faComment} />
                    </li>
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
