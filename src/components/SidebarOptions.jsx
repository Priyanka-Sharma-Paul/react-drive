import React from "react";
import {
  MdMobileScreenShare,
  MdDevices,
  MdOutlinePeopleAlt,
  MdQueryBuilder,
  MdDeleteOutline,
} from "react-icons/md";
import { IoStarOutline } from "react-icons/io5";

function SidebarOptions({ activeOption, handleOptionClick }) {
  return (
    <div className="flex flex-col space-y-2 p-4">
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
          activeOption === "My Drive" ? "bg-gray-200 font-semibold text-blue-500" : ""
        }`}
        onClick={() => handleOptionClick("My Drive")}
      >
        <MdMobileScreenShare className="mr-2" />
        <span>My Drive</span>
      </div>
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
          activeOption === "Computers" ? "bg-gray-200 font-semibold text-blue-500" : ""
        }`}
        onClick={() => handleOptionClick("Computers")}
      >
        <MdDevices className="mr-2" />
        <span>Computers</span>
      </div>
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
          activeOption === "Share with me" ? "bg-gray-200 font-semibold text-blue-500" : ""
        }`}
        onClick={() => handleOptionClick("Share with me")}
      >
        <MdOutlinePeopleAlt className="mr-2" />
        <span>Share with me</span>
      </div>
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
          activeOption === "Recent" ? "bg-gray-200 font-semibold text-blue-500" : ""
        }`}
        onClick={() => handleOptionClick("Recent")}
      >
        <MdQueryBuilder className="mr-2" />
        <span>Recent</span>
      </div>
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
          activeOption === "Starred" ? "bg-gray-200 font-semibold text-blue-500" : ""
        }`}
        onClick={() => handleOptionClick("Starred")}
      >
        <IoStarOutline className="mr-2" />
        <span>Starred</span>
      </div>
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
          activeOption === "Trash" ? "bg-gray-200 font-semibold text-blue-500" : ""
        }`}
        onClick={() => handleOptionClick("Trash")}
      >
        <MdDeleteOutline className="mr-2" />
        <span>Trash</span>
      </div>
    </div>
  );
}

export default SidebarOptions;
