import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Profile.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../axios/axios";

export default function Profile({ user }) {
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;
  const [posts, setPosts] = useState([]);
  const { userId } = useParams();
  useEffect(() => {
    const timeLine = async () => {
      const res = await api.get(`/post/timeline/${userId}`);
      if (res.data.status === "success") {
        setPosts(res.data.posts);
      }
    };
    timeLine();
  }, [userId, user]);
  return (
    <div>
      <div className="main">
        <div className="profile">
          <div className="profile-image">
            <img
              src={photo + "/users/" + user.picturePhoto}
              alt=""
              className="w-44 h-44"
            />
          </div>
          <div className="profile-user-settings">
            <h1 className="profile-user-name">{user.username}</h1>
            {userId === user._id ? (
              <>
                <button className="btn profile-edit-btn">Edit Profile</button>
                <button
                  className="btn profile-settings-btn"
                  aria-label="profile settings"
                >
                  <FontAwesomeIcon icon={faCog} />
                </button>
              </>
            ) : (
              <>
                <button className="btn profile-edit-btn bg-blue-400 text-white">
                  Follow
                </button>
                <button className="btn profile-edit-btn">Message</button>
              </>
            )}
          </div>
          <div className="profile-stats">
            <ul>
              <li>
                <span className="profile-stat-count">
                  {user.posts.length} posts
                </span>
              </li>
              <li>
                <span className="profile-stat-count">
                  {user.followers.length} followers
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
            <Link to={`post/${post._id}`}>
              <div className="gallery-item">
                <img
                  src={photo + "/posts/" + post.img}
                  className="gallery-image"
                  alt=""
                />
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
