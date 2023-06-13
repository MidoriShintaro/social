import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../axios/axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === "" || confirmPassword === "") {
      toast.error("Please provide valid fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password not same");
      return;
    }

    const res = await api.patch(`/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
    console.log(res);
    if (res.data.status === "false") {
      toast.error(res.data.message);
      return;
    }

    if (res.data.status === "success") {
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 7000);
      return;
    }
  };
  return (
    <div>
      <section className="bg-gray-300">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Reset Password
            </h2>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-400 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Reset password
              </button>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
