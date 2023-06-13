import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { register } from "../../services/authServices";

function Register() {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      toast.error("Invalid email");
      return;
    }
    if (fullname === "" || username === "" || password === "") {
      toast.error("Please provide valid field");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must have greater 6 character");
      return;
    }

    const res = await register(email, username, fullname, password);
    if (res.status === "false") {
      toast.error(res.message);
      return;
    }
    if (res.status === "success") {
      navigate("/login");
    }
  };
  return (
    <div className="h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="bg-white border border-gray-300 w-80 py-8 flex items-center flex-col mb-3">
        {/* <h1></h1> */}
        <button className="mt-4 flex w-4/5 justify-center items-center">
          <div className="bg-no-repeat bg-blue-500 mr-1 w-full rounded-lg p-1">
            <span className="text-xs text-white font-semibold">
              Log in with Facebook
            </span>
          </div>
        </button>
        <div className="flex justify-evenly space-x-2 w-64 mt-4">
          <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
          <span className="flex-none uppercase text-xs text-gray-400 font-semibold">
            or
          </span>
          <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
        </div>
        <form
          className="mt-8 w-64 flex flex-col mb-8"
          method="post"
          onSubmit={handleSubmit}
        >
          <input
            autoFocus
            className="text-xs w-full mb-2 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Phone number or email"
            name="email"
            type="email"
          />
          <input
            autoFocus
            className="text-xs w-full mb-2 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
            id="fullname"
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Full Name"
            name="fullname"
            type="text"
          />
          <input
            autoFocus
            className="text-xs w-full mb-2 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            name="username"
            type="text"
          />
          <input
            autoFocus
            className="text-xs w-full mb-4 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            name="password"
            type="password"
          />
          <button
            className="text-sm text-center bg-blue-500 text-white py-2 rounded-lg font-medium my-2"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm">
          Have an account?
          <Link to={"/login"} className="text-blue-400 font-semibold">
            Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
