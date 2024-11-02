import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { MdFormatAlignCenter } from "react-icons/md";
import { IoMdSettings, IoMdApps } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import userImage from '../assets/images/user.png'


function Header({ setSearchTerm, theme, toggleTheme }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleSignOut = () => {
    setShowSignOut(!showSignOut);
  };

  const handleSignOut = () => {
    logout()
      .then(() => {
        console.log("User signed out");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <div
      className={`flex justify-between items-center px-4 py-2 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } shadow-md`}
    >
      <div className="flex items-center space-x-2">
        <img
          src={logo}
          alt="Logo"
          className="w-8 h-8"
        />
        <span className="font-semibold">Disk</span>
      </div>

      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
        <IoSearchSharp aria-label="Search Icon" className="text-gray-500" />
        <input
          type="text"
          placeholder="Search in Drive"
          onChange={handleSearchChange}
          aria-label="Search in Drive"
          className="bg-transparent outline-none flex-grow placeholder-gray-500"
        />
        <MdFormatAlignCenter aria-label="Align Center Icon" className="text-gray-500" />
      </div>

      <div className="flex items-center space-x-4">
        {/*<span onClick={toggleModal} aria-label="Help" className="cursor-pointer">
          <MdOutlineHelpOutline />
        </span>*/}
        
        <span
          onClick={() => setShowThemeOptions(!showThemeOptions)}
          aria-label="Settings"
          className="relative cursor-pointer"
        >
          <IoMdSettings />
          {showThemeOptions && (
            <div
              className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg py-2 text-sm text-gray-800"
              role="menu"
            >
              <button
                onClick={() => toggleTheme("light")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                aria-label="Switch to Light Mode"
              >
                Light Mode
              </button>
              <button
                onClick={() => toggleTheme("dark")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                aria-label="Switch to Dark Mode"
              >
                Dark Mode
              </button>
            </div>
          )}
        </span>
        
        <IoMdApps aria-label="Apps Icon" />

        <div className="relative">
          <img
            src={user.photoURL || userImage}
            alt="User Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={toggleSignOut}
          />
          {showSignOut && (
            <div
              className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100"
              onClick={handleSignOut}
              role="button"
            >
              Sign Out
            </div>
          )}
        </div>
      </div>

      {/*isModalOpen && <HelpModal toggleModal={toggleModal} />*/}
    </div>
  );
}

export default Header;
