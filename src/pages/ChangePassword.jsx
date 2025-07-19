import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.temporaryPassword) {
        setMessage('You must change your temporary password.');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId; // Use userId from token

      await axios.put(`http://192.168.1.8:8080/api/users/${userId}/password`, {
        currentPassword,
        newPassword,
        confirmNewPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Password changed successfully!');
      // Optionally, force logout after password change for security
      setTimeout(() => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Change Password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {message && <p className="mt-4 text-center text-sm text-green-600 font-medium">{message}</p>}
          {error && <p className="mt-4 text-center text-sm text-red-600 font-medium">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
