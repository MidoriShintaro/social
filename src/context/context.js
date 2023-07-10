import { createContext, useEffect, useState } from "react";
import { isAuthenticate } from "../services/authServices";
import Login from "../pages/login/Login";
import { Route, Routes } from "react-router-dom";
import Register from "../pages/register/Register";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";
import ResetPassword from "../pages/resetPassword/ResetPassword";
import { useCookies } from "react-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [cookies] = useCookies();
  useEffect(() => {
    const checkLogin = () => {
      let user = isAuthenticate(cookies);
      if (!user) {
        localStorage.setItem("user", "");
        user = "";
      }
      setCurrentUser(user);
    };
    checkLogin();
  }, [cookies]);
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {currentUser.accessToken ? (
        children
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" index element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      )}
    </AuthContext.Provider>
  );
};
