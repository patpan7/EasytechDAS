import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.sub); // 'sub' is typically the username
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, {username}!</h1>
          <p className="text-lg text-gray-600">This is your central hub for managing customers and devices.</p>
          <div className="mt-6 border-t pt-6">
            <p className="text-gray-700">You can navigate to the different sections using the links in the navigation bar above.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
