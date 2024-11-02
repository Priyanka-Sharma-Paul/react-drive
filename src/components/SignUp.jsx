import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import logo from '../assets/images/logo.png';
import { FaPlus } from 'react-icons/fa'; 

const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const displayNameRef = useRef();
  const profilePictureRef = useRef();
  const { signup , updateProfile} = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const displayName = displayNameRef.current.value;
    const profilePicture = profilePictureRef.current.files[0];

    signup(email, password)
      .then((userCredential) => {
        console.log(userCredential);
        const user = userCredential.user;

        if (profilePicture) {
          const profilePicRef = ref(storage, `profile_pictures/${user.uid}`);

          return uploadBytes(profilePicRef, profilePicture).then(() => {
            return getDownloadURL(profilePicRef).then((profilePicURL) => {
              return updateProfile(user, {
                displayName: displayName,
                photoURL: profilePicURL,
              });
            });
          });
        } else {
          return updateProfile(user, {
            displayName: displayName,
          });
        }
      })
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        setError("Error creating account. Please try again.");
      });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    } else {
      setProfilePicPreview(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:max-w-md mx-4">
        <div className="flex items-center mb-6">
          <img src={logo} alt="logo" className="mr-2" width="40" />
          <h1 className="text-2xl font-medium">Create Account</h1>
        </div>
        <form onSubmit={handleSignUp}>
          <div className="mb-4 flex justify-center">
            <div
              onClick={() => profilePictureRef.current.click()}
              className="cursor-pointer mt-1 w-24 h-24 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400"
              style={{
                backgroundImage: profilePicPreview ? `url(${profilePicPreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!profilePicPreview && <FaPlus size={24} />}
            </div>
            <input
              type="file"
              ref={profilePictureRef}
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700">Display Name</label>
            <input
              type="text"
              ref={displayNameRef}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Display Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              ref={emailRef}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              ref={passwordRef}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="flex justify-between items-center mb-6">
            <Link to="/login">Already a User!</Link>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
