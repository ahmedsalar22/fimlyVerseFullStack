import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner"; // For loading spinner
import { ToastContainer, toast } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify styles

const AdminPanel = ({ onAdminLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
 
  const handleLogin = () => {
    const adminUsername = "adminSalar";
    const adminPassword = "123";

    setLoading(true); // Start loading animation

    setTimeout(() => {
      setLoading(false); // Stop loading after a delay
      if (username === adminUsername && password === adminPassword) {
        setLoggedIn(true); // Mark as logged in
        toast.success("Login Successful!", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        }); // Show success toast
        onAdminLogin(true); // Notify parent component
      } else {
        toast.error("Incorrect username or password", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        }); // Show error toast
        setLoggedIn(false); // Reset login state
      }
    }, 2000); // Simulate server response time
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <ToastContainer /> {/* Toast notification container */}
      <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-white">Admin Login</h1>
        {/* Username Input */}
        <input
          type="text"
          placeholder="Enter Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 text-gray-900 rounded"
          disabled={loggedIn} // Disable input after successful login
        />
        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 text-gray-900 rounded"
          disabled={loggedIn} // Disable input after successful login
        />
        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading || loggedIn} // Disable button while loading or logged in
          className={`w-full px-4 py-2 font-bold text-white rounded ${
            loggedIn
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          } transition-all duration-300`}
        >
          {loading ? (
            <TailSpin height={20} width={20} color="white" />
          ) : loggedIn ? (
            "Logged In"
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
