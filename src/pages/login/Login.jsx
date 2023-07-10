import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLoginFacebook = () => {
    window.location.href = process.env.REACT_APP_FACEBOOK_URL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      toast.error("Invalid Email");
      return;
    }
    const res = await login(email, password);
    if (res.status === "false") {
      toast.error(res.message);
      return;
    }
    if (res.status === "success") {
      navigate("/");
      window.location.reload();
    }
  };
  return (
    <>
      <div className="h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="bg-white border border-gray-300 w-80 py-8 flex items-center flex-col mb-3">
          <img
            src="https://res.cloudinary.com/dyp4yk66w/image/upload/v1688828079/logo/chu_qchvyf.png"
            alt=""
            className="bg-no-repeat instagram-logo"
          />
          <form className="mt-8 w-64 flex flex-col" onSubmit={handleSubmit}>
            <input
              className="text-xs w-full mb-2 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
              id="email"
              value={email}
              onChange={onChangeEmail}
              placeholder="Phone number, username, or email"
              type="text"
            />
            <input
              className="text-xs w-full mb-4 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
              id="password"
              value={password}
              onChange={onChangePassword}
              placeholder="Password"
              type="password"
            />
            <button
              type="submit"
              className=" text-sm text-center bg-blue-300 text-gray-50 py-1 rounded font-medium hover:bg-blue-500 cursor-pointer hover:text-white"
            >
              Log In
            </button>
          </form>
          <div className="flex justify-evenly space-x-2 w-64 mt-4">
            <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
            <span className="flex-none uppercase text-xs text-gray-400 font-semibold">
              or
            </span>
            <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
          </div>
          <button className="mt-4 flex">
            <div className="bg-no-repeat facebook-logo mr-1"></div>
            <span
              onClick={handleLoginFacebook}
              className="text-xs text-blue-900 font-semibold"
            >
              Log in with Facebook
            </span>
          </button>
          <Link
            to="/forgot-password"
            className="text-xs text-blue-900 mt-4 cursor-pointer -mb-4"
          >
            Forgot password?
          </Link>
        </div>
        <div className="bg-white border border-gray-300 text-center w-80 py-4">
          <span className="text-sm">Don't have an account?</span>
          <Link to="/register" className="text-blue-500 text-sm font-semibold">
            Sign up
          </Link>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
