// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, listAll, getDownloadURL, getMetadata, updateMetadata } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      fetchUserFiles(); // Fetch user files when user is present
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file && user) {
      const fileRef = ref(storage, `files/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      await updateMetadata(fileRef, { customMetadata: { starred: 'false' } });
      console.log("File uploaded successfully!");
      setFile(null);
      await fetchUserFiles(); // Refresh file list after upload
    }
  };

  const fetchUserFiles = async () => {
    if (user) {
      const listRef = ref(storage, `files/${user.uid}/`);
      const res = await listAll(listRef);
      const files = await Promise.all(
        res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          const isStarred = metadata.customMetadata?.starred === 'true';
          const lastModified = metadata.updated || metadata.timeCreated;
          return { name: item.name, url, starred: isStarred, lastModified };
        })
      );

      // Sort files by last modified date (descending order)
      files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      setFileList(files);
    }
  };

  const toggleStar = async (fileName) => {
    const fileRef = ref(storage, `files/${user.uid}/${fileName}`);
    const metadata = await getMetadata(fileRef);
    const isCurrentlyStarred = metadata.customMetadata?.starred === 'true';
    const newStarredStatus = !isCurrentlyStarred;

    // Update custom metadata with new starred status
    await updateMetadata(fileRef, { customMetadata: { starred: newStarredStatus.toString() } });

    // Update state to reflect the new starred status
    setFileList((prevFiles) =>
      prevFiles.map((file) =>
        file.name === fileName ? { ...file, starred: newStarredStatus } : file
      )
    );
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {user.displayName}</h2>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={`${user.displayName}'s profile`}
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
      )}
      <button onClick={handleLogout}>Log Out</button>

      <div className="upload-section">
        <h3>Upload a File</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file}>Upload</button>
      </div>

      <div className="file-list">
        <h3>Your Files</h3>
        <ul>
          {fileList.map((file, index) => (
            <li key={index}>
              <span
                style={{ cursor: 'pointer', color: file.starred ? 'gold' : 'black' }}
                onClick={() => toggleStar(file.name)}
              >
                {file.starred ? '⭐ ' : '☆ '}
              </span>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="starred-files">
        <h3>Starred Files</h3>
        <ul>
          {fileList.filter((file) => file.starred).map((file, index) => (
            <li key={index}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
