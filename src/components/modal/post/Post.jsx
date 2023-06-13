import "./Post.css";

export default function Post() {
  return (
    <div className="backdrop-post absolute w-full h-full flex justify-center items-center z-50 text-center hidden">
      <div className="w-full h-full bg-black absolute opacity-60"></div>
      <ul className="w-2/6 text-sm font-medium z-50 text-gray-900 bg-white border rounded-xl hover:cursor-pointer">
        <li className="w-full p-3 border-b font-semibold text-lg border-gray-200 rounded-t-lg dark:border-gray-600 text-red-500">
          Unfollow
        </li>
        <li className="w-full p-3 rounded-b-lg text-lg font-light">Cancle</li>
      </ul>
    </div>
  );
}
