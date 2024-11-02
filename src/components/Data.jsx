import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '../context/AuthContext';
import { IoMdArrowDropdown } from "react-icons/io";
import {
  FaList,
  FaTrash,
  FaDownload,
  FaShareAlt,
  FaCopy,
} from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import { IoArrowDownSharp, IoStar, IoStarOutline } from "react-icons/io5";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, listAll, getDownloadURL, getMetadata, updateMetadata } from 'firebase/storage';
import { SlOptions } from "react-icons/sl";
import { BiSolidFilePdf } from "react-icons/bi";

function Data({ searchTerm, activeOption }) {
    const {user} = useAuth();
  const [files, setFiles] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = async () => {
        const listRef = ref(storage, `files/${user.uid}/`);
      const res = await listAll(listRef);
      const files = await Promise.all(
        res.items.map(async (item) => {
            console.log(item);
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          console.log(metadata);
          const lastModified = metadata.updated || metadata.timeCreated;
          return {
            timestamp: new Date(lastModified),
            filename: item.name,
            fileURL: url,
            size: item.size,
            isDeleted: metadata.customMetadata?.deleted === 'true',
            isStarred: metadata.customMetadata?.starred === 'true',
            id: metadata.md5Hash
          }
        })
      );
      setFiles(files);
    }
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setShowOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const toggleStar = async (id, isStarred) => {
    await updateDoc(doc(db, "myfiles", id), { isStarred: !isStarred });
  };

  const filteredFiles = files
    .filter((file) => {
        console.log(file);
      switch (activeOption) {
        case "My Drive":
        case "Computers":
          return !file.isDeleted;
        case "Recent":
          return (
            new Date().getTime() - file.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
          );
        case "Trash":
          return file.isDeleted;
        case "Starred":
          return file.isStarred;
        default:
          return !file.isDeleted;
      }
    })
    .filter((file) =>
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const toggleOptions = (id) => {
    setShowOptions(showOptions === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (activeOption === "Trash") {
      await deleteDoc(doc(db, "myfiles", id));
      alert("File permanently deleted.");
    } else {
      await updateDoc(doc(db, "myfiles", id), { isDeleted: true });
      alert("File moved to Trash.");
    }
  };

  const handleDownload = (fileURL, filename) => {
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = (fileURL) => {
    navigator.clipboard.writeText(fileURL);
    alert("Link copied to clipboard!");
  };

  const handleShare = (fileURL) => {
    if (navigator.share) {
      navigator
        .share({
          title: "File",
          url: fileURL,
        })
        .catch((error) => console.error("Error sharing", error));
    } else {
      alert("Share not supported on this browser.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-lg font-bold">
          <p>{activeOption}</p>
          <IoMdArrowDropdown />
        </div>
        <div className="flex items-center space-x-4 text-xl">
          <FaList />
          <MdInfoOutline />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {filteredFiles.map((file) => (
            <div className="flex flex-col items-center" key={file.id}>
              <BiSolidFilePdf className="text-5xl" />
              <p className="mt-2">{file.filename}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="grid grid-cols-5 text-sm font-bold bg-gray-100 p-2 rounded">
            <p className="flex items-center">
              Name <IoArrowDownSharp />
            </p>
            <p>Owner</p>
            <p>Last Modified</p>
            <p>File Size</p>
            <p>Options</p>
          </div>

          {filteredFiles.map((file) => (
            <div
              className="grid grid-cols-5 items-center p-2 border-b"
              key={file.id}
            >
              <p className="flex items-center space-x-2">
                <span
                  className={`cursor-pointer ${
                    file.isStarred ? "text-yellow-500" : ""
                  }`}
                  onClick={() => toggleStar(file.id, file.isStarred)}
                >
                  {file.isStarred ? <IoStar /> : <IoStarOutline />}
                </span>
                <a
                  href={file.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600"
                >
                  <BiSolidFilePdf />
                  <span>{file.filename}</span>
                </a>
              </p>
              <p>Me</p>
              <p>
                {new Date(file.timestamp?.seconds * 1000).toUTCString()}
              </p>
              <p>{formatBytes(file.size)}</p>
              <p className="relative">
                <SlOptions
                  onClick={() => toggleOptions(file.id)}
                  className="cursor-pointer"
                />
                {showOptions === file.id && (
                  <div
                    ref={optionsMenuRef}
                    className="absolute right-0 bg-white border shadow-md p-2 rounded-lg mt-2 z-10"
                  >
                    <button
                      onClick={() =>
                        handleDownload(file.fileURL, file.filename)
                      }
                      className="flex items-center space-x-2 py-1 px-2 w-full hover:bg-gray-100"
                    >
                      <FaDownload /> <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="flex items-center space-x-2 py-1 px-2 w-full hover:bg-gray-100"
                    >
                      <FaTrash />
                      <span>
                        {activeOption === "Trash"
                          ? "Delete Permanently"
                          : "Move to Trash"}
                      </span>
                    </button>
                    <button
                      onClick={() => handleCopyLink(file.fileURL)}
                      className="flex items-center space-x-2 py-1 px-2 w-full hover:bg-gray-100"
                    >
                      <FaCopy /> <span>Copy Link</span>
                    </button>
                    <button
                      onClick={() => handleShare(file.fileURL)}
                      className="flex items-center space-x-2 py-1 px-2 w-full hover:bg-gray-100"
                    >
                      <FaShareAlt /> <span>Share</span>
                    </button>
                  </div>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Data;
