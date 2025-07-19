import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import UserFormModal from '../components/UserFormModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://192.168.1.8:8080/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleResetPassword = async (userId) => {
    const temporaryPassword = prompt('Please enter a new temporary password for the user:');
    if (temporaryPassword) {
      try {
        const token = localStorage.getItem('jwtToken');
        await axios.put(`http://192.168.1.8:8080/api/users/${userId}/reset-password`, 
        { temporaryPassword }, // The body needs to be an object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        alert('Password has been reset successfully.');
        fetchUsers(); // Refresh users to show updated status if any
      } catch (err) {
        setError('Failed to reset password.');
        console.error(err);
      }
    }
  };

  const handleSave = () => {
    fetchUsers();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
        {error && <p className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</p>}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Επωνυμία</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.eponimia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className="text-red-600 hover:text-red-900 transition duration-150"
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Users;
