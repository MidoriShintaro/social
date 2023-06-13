import "./More.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faMoon } from "@fortawesome/free-regular-svg-icons";
export default function More() {
  return (
    <div className="sidebar-modal-more fixed bottom-20 w-1/5 rounded-sm bg-white z-50 hidden">
      <ul className="w-full text-sm font-medium text-gray-900">
        <li className="w-full p-3 border-b border-gray-200 flex justify-between items-center hover:cursor-pointer">
          <span className="text-lg font-normal">Save</span>
          <FontAwesomeIcon icon={faBookmark} className="text-xl" />
        </li>
        <li className="w-full p-3 border-b border-gray-200 flex justify-between items-center hover:cursor-pointer">
          <span className="text-lg font-normal">Switch Appearance</span>
          <FontAwesomeIcon icon={faMoon} className="text-xl" />
        </li>
        <li className="w-full p-3 hover:cursor-pointer">
          <span className="text-lg font-normal">Log out</span>
        </li>
      </ul>
    </div>
  );
}
