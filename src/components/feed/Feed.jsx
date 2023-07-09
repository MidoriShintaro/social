import { useContext, useEffect, useState } from "react";
import Post from "../posts/Post";
import Share from "../share/Share";
import "./Feed.css";
import api from "../../axios/axios";
import { AuthContext } from "../../context/context";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Feed({ user, socket, showPost, showOptionPost, data }) {
  const [post, setPost] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const fetchPost = async () => {
    const res = await api.get("/post");
    setPost(res.data.posts);
  };

  useEffect(() => {
    fetchPost();
  }, [currentUser]);

  return (
    <div className="feed basis-1/2">
      <Share user={user} />
      <InfiniteScroll
        dataLength={post?.length}
        next={fetchPost}
        hasMore={post?.length > 0}
        loader={<div>Loading...</div>}
        endMessage={
          <div>
            <p className="text-center">No more posts</p>
          </div>
        }
      >
        {post?.map((p) => (
          <Post
            key={p._id}
            post={p}
            socket={socket}
            showPost={showPost}
            showOptionPost={showOptionPost}
            data={data}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
