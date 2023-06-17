import "./More.css";
export default function More() {
  return (
    <div className="sidebar-modal-more border fixed bottom-24 left-10 w-1/5 rounded-lg bg-white z-50 block">
      <ul className="w-full text-sm font-medium text-gray-900">
        <li className="w-full p-3 hover:cursor-pointer">
          <span className="text-lg text-red-400 font-semibold">Log out</span>
        </li>
      </ul>
    </div>
  );
}
