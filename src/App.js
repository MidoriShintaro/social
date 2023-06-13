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

function App() {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      const res = await api.get(`/user/${currentUser.user._id}`);
      setUser(res.data.user);
    };
    getUser();
  }, [currentUser]);
  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
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
