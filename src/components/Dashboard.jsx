// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage, db } from '../firebase/firebase';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user , logout } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [starredFiles, setStarredFiles] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      fetchStarredFiles(); // Fetch starred files once when user changes
      fetchUserFiles(); // Fetch user files once when user changes
    }
  }, [user]); // Only runs when `user` changes

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file && user) {
      const fileRef = ref(storage, `files/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file); // Await for upload to finish
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
          return { name: item.name, url, starred: starredFiles.includes(item.name) }; // Check if file is starred
        })
      );
      console.log(files);
      setFileList(files);
    }
  };

  const fetchStarredFiles = async () => {
    const docRef = doc(db, "starredFiles", user.uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(data.files)
      setStarredFiles(data.files || []);
    } else {
      console.log("No starred files found");
      setStarredFiles([]); // Reset starred files if none found
    }
  };

  const updateStarredFiles = async () => {
    const docRef = doc(db, "starredFiles", user.uid);
    console.log(docRef);
    await setDoc(docRef, { files: starredFiles }, { merge: true });
  };

  const toggleStar = (fileName) => {
    setFileList((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.name === fileName) {
          return { ...file, starred: !file.starred }; // Toggle starred state
        }
        return file;
      });
    });

    setStarredFiles((prevStarred) => {
      const isAlreadyStarred = prevStarred.includes(fileName);
      const updatedStarred = isAlreadyStarred 
        ? prevStarred.filter((name) => name !== fileName) // Unstar
        : [...prevStarred, fileName]; // Star

      // Update Firestore with new starred files
      updateStarredFiles(updatedStarred);
      return updatedStarred;
    });
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
          {fileList.filter(file => file.starred).map((file, index) => (
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
