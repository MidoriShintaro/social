import { useContext, useEffect, useState } from "react";
import Post from "../posts/Post";
import Share from "../share/Share";
import "./Feed.css";
import api from "../../axios/axios";
import { AuthContext } from "../../context/context";

export default function Feed({ user, socket, show, data }) {
  const [post, setPost] = useState([]);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchPost = async () => {
      const res = await api.get(`/post`);
      setPost(res.data.posts);
    };
    fetchPost();
  }, [currentUser]);

  return (
    <div className="feed basis-1/2">
      <Share user={user} />
      {post.map((p) => (
        <Post key={p._id} post={p} socket={socket} show={show} data={data} />
      ))}
    </div>
  );
}
