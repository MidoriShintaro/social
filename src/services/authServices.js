import api from "../axios/axios";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  const token = res.data.accessToken;
  if (token) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

export const register = async (email, username, fullname, password) => {
  const res = await api.post("/auth/register", {
    email,
    fullname,
    username,
    password,
  });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const isAuthenticate = (cookies) => {
  if (cookies) {
    localStorage.setItem("user", JSON.stringify(cookies));
  }
  const user = JSON.parse(localStorage.getItem("user")) || cookies.user;
  if (!user) {
    return {};
  }
  return user;
};
