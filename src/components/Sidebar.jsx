import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import Modal from "@mui/material/Modal";
import SidebarOptions from "./SidebarOptions";
import {
  MdOutlineCloudQueue,
} from "react-icons/md";
import { ref, uploadBytes , updateMetadata} from "firebase/storage";
import { storage } from "../firebase/firebase";

function Sidebar({ setActiveOption , setUpdateFIles}) {
    const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [activeOption, setLocalActiveOption] = useState("My Drive");

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setUploading(true);
    if (!file) {
      console.warn("No file selected");
      setUploading(false);
      return;
    }
    try {
        const fileRef = ref(storage, `files/${user.uid}/${file.name}`);
        await uploadBytes(fileRef, file);
        await updateMetadata(fileRef, { customMetadata: { starred: 'false' , deleted: 'false'} });
      setUploading(false);
      setFile(null);
      setOpen(false)
      setUpdateFIles(new Date());
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  const handleOptionClick = (option) => {
    setLocalActiveOption(option);
    setActiveOption(option);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <form>
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold">Select file you want to upload</h3>
              </div>
              <div className="flex flex-col items-center space-y-4">
                {uploading ? (
                  <p className="text-blue-500 font-semibold">Uploading...</p>
                ) : (
                  <>
                    <input type="file" onChange={handleChange} />
                    <button
                      type="submit"
                      onClick={handleUpload}
                      className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Upload
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col p-4 w-64 space-y-4 bg-gray-50 border-r border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpen}
            className="flex items-center p-2 w-full text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            <img
              src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22 viewBox=%220 0 36 36%22%3E%3Cpath fill=%22%2334A853%22 d=%22M16 16v14h4V20z%22/%3E%3Cpath fill=%22%234285F4%22 d=%22M30 16H20l-4 4h14z%22/%3E%3Cpath fill=%22%23FBBC05%22 d=%22M6 16v4h10l4-4z%22/%3E%3Cpath fill=%22%23EA4335%22 d=%22M20 16V6h-4v14z%22/%3E%3Cpath fill=%22none%22 d=%22M0 0h36v36H0z%22/%3E%3C/svg%3E"
              alt=""
              className="w-6 h-6 mr-2"
            />
            <span>New</span>
          </button>
        </div>

        <SidebarOptions
          activeOption={activeOption}
          handleOptionClick={handleOptionClick}
        />

        <hr className="border-gray-300" />
        <div className="flex flex-col space-y-2">
          <div className="flex items-center p-2 text-gray-700">
            <MdOutlineCloudQueue className="mr-2" />
            <span>Storage</span>
          </div>
          <div className="flex flex-col px-2 space-y-1">
            <progress className="w-full" value="50" max="100" />
            <span className="text-xs text-gray-500">6.45 GB of 15 GB used</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
