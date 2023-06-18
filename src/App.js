import Home from "./pages/home/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import Message from "./pages/message/Message";
import Sidebar from "./components/sidebar/SideBar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/context";
import api from "./axios/axios";
import { io } from "socket.io-client";
import Profile from "./pages/profile/Profile";
import Post from "./pages/post/Post";

function App() {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    socket?.emit("sendUser", currentUser.user._id);
    socket?.on("getUser", (users) => {
      console.log(users);
    });
  }, [currentUser, socket]);

  useEffect(() => {
    const getUser = async () => {
      const res = await api.get(`/user/${currentUser.user._id}`);
      setUser(res.data.user);
    };
    getUser();
  }, [currentUser]);

  console.log(user);
  return (
    <Routes>
      <Route path="/" element={<Home user={user} socket={socket} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/user/:userId/post/:postId"
        element={
          <div className="flex h-full">
            <Sidebar user={user} />
            <Post user={user} />
          </div>
        }
      />
      <Route
        path="/user/:userId"
        element={
          <div className="flex h-full">
            <Sidebar user={user} />
            <Profile user={user} />
          </div>
        }
      />
      <Route
        path="/message"
        element={
          <div className="flex h-full">
            <Sidebar user={user} />
            <Message />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
