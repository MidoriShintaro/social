import { toast } from "react-toastify";
import api from "../../../axios/axios";
import "./OptionPost.css";
import { useNavigate } from "react-router-dom";

export default function OptionPost({
  showOptionPost,
  showCreatePost,
  update,
  data,
}) {
  const negative = useNavigate();
  const handleClick = () => {
    showOptionPost(false);
  };

  const handleDelete = async () => {
    const res = await api.delete(`/post/${data._id}`);
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setTimeout(() => {
        negative("/");
        window.location.reload();
      }, 2000);
    }
  };
  return (
    <div className="backdrop-post absolute w-full h-full flex justify-center items-center z-50 text-center">
      <div
        className="w-full h-full bg-black absolute opacity-60"
        onClick={handleClick}
      ></div>
      <ul className="w-2/6 text-sm font-medium z-50 text-gray-900 bg-white border rounded-xl hover:cursor-pointer">
        <li
          className="w-full p-3 border-b font-semibold text-lg border-gray-200 rounded-t-lg dark:border-gray-600 text-red-500"
          onClick={() => {
            showCreatePost(true);
            showOptionPost(false);
            update(true);
          }}
        >
          Update
        </li>
        <li
          className="w-full p-3 border-b font-semibold text-lg border-gray-200 rounded-t-lg dark:border-gray-600 text-red-500"
          onClick={handleDelete}
        >
          Delete
        </li>
        <li
          className="w-full p-3 rounded-b-lg text-lg font-light"
          onClick={handleClick}
        >
          Cancle
        </li>
      </ul>
    </div>
  );
}
