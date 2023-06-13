import { createContext, useEffect, useState } from "react";
import { isAuthenticate } from "../services/authServices";
import Login from "../pages/login/Login";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const checkLogin = () => {
      let user = isAuthenticate();
      if (user === null) {
        localStorage.setItem("user", "");
        user = "";
      }
      setCurrentUser(user);
    };
    checkLogin();
  }, []);
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {currentUser.accessToken ? children : <Login />}
    </AuthContext.Provider>
  );
};
