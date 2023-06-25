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
import ModalProfile from "./components/modal/profile/ModalProfile";
import NotFound from "./pages/notFound/NotFound";

function App() {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState(null);
  const [isShowModalProfile, setIsShowModalProfile] = useState(false);
  const [data, setData] = useState({});
  const socketURL = process.env.SOCKET_URL;
  useEffect(() => {
    setSocket(io(socketURL));
  }, [socketURL]);

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

  const show = (bool, data) => {
    setIsShowModalProfile(bool);
    setData(data);
  };

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
            <Post user={user} socket={socket} />
          </div>
        }
      />
      <Route
        path="/user/:userId"
        element={
          <>
            {isShowModalProfile && <ModalProfile show={show} data={data} />}
            <div className="flex h-full">
              <Sidebar user={user} />
              <Profile current={user} show={show} socket={socket} />
            </div>
          </>
        }
      />
      <Route
        path="/message"
        element={
          <div className="flex h-full">
            <Sidebar user={user} />
            <Message user={user} />
          </div>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
