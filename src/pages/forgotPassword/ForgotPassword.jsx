import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { ToastContainer, toast } from "react-toastify";
import { forgotPassword } from "../../services/authServices";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
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

    const res = await forgotPassword(email);
    if (res.status === "false") {
      toast.error(res.message);
      return;
    }

    if (res.status === "success") {
      toast.success(res.message);
      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 5000);
    }
  };
  return (
    <>
      <div className="row">
        <h1>Forgot Password</h1>
        <h6 className="information-text">
          Enter your registered email to reset your password.
        </h6>
        <form className="form-group" onSubmit={handleSubmit}>
          <p>
            <label>Enter Your Email</label>
          </p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            name="user_email"
            id="user_email"
          />
          <button type="submit">Reset Password</button>
        </form>
        <div className="footer">
          <h5>
            New here? <Link to="/register"> Sign Up.</Link>
          </h5>
          <h5>
            Already have an account? <Link to="/login"> Sign In.</Link>
          </h5>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
