import axios from "axios";
const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
});

const refreshToken = async () => {
  const refreshToken = getToken().refreshToken;
  if (!refreshToken) return;
  return api.post("/auth/refresh-token", { refreshToken });
};

const getToken = () => {
  const { accessToken, refreshToken } =
    JSON.parse(window.localStorage.getItem("user")) || "";
  return { accessToken, refreshToken };
};

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = getToken().accessToken;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const res = await refreshToken();
          console.log(res);
          window.localStorage.setItem("user", JSON.stringify(res.data));
          api.defaults.headers[
            "Authorization"
          ] = `$Bearer ${res.data.accessToken}`;
          console.log(res.data);
          return api(originalConfig);
        } catch (err) {
          return err && err.response && err.response.data
            ? err.response
            : Promise.reject(err);
        }
      }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error && error.response && error.response.data
      ? error.response
      : Promise.reject(error);
  }
);

export default api;
