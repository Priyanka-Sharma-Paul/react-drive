import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    login(emailRef.current.value, passwordRef.current.value)
      .then(() => navigate('/dashboard'))
      .catch((error) => {
        console.error("Error logging in:", error);
        setError("Invalid email or password. Please try again.");
      });
  };

  const handleGoogleSignIn = () => {
    setError('');
    googleSignIn()
      .then(() => navigate('/dashboard'))
      .catch((error) => {
        console.error("Error with Google sign-in:", error);
        setError("Google sign-in failed. Please try again.");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:max-w-md mx-4">
        <div className="flex items-center mb-6">
          <img
            src={logo}
            alt="logo"
            className="mr-2"
            width="40"
          />
          <h1 className="text-2xl font-medium">Sign in</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              ref={emailRef}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label>
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
            <Link to="/signup">Create New</Link>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Sign In
            </button>
          </div>
        </form>
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center gap-3"
          >
            <FcGoogle /> Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
