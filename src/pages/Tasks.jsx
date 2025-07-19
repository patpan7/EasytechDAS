import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import TaskFormModal from '../components/TaskFormModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userRole, setUserRole] = useState('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      const decoded = jwtDecode(token);
      const role = decoded.authorities && decoded.authorities.length > 0 ? decoded.authorities[0] : '';
      setUserRole(role);

      const response = await axios.get('http://192.168.1.8:8080/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateClick = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    fetchTasks();
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`http://192.168.1.8:8080/api/tasks/${taskId}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
          {userRole.startsWith('ROLE_PARTNER') && (
            <button
              onClick={handleCreateClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create New Task
            </button>
          )}
        </div>

        {error && <p className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</p>}

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{task.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.createdByUsername}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {userRole === 'ROLE_SUPERVISOR' && task.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                          className="text-green-600 hover:text-green-900 transition duration-150"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(task.id, 'REJECTED')}
                          className="text-red-600 hover:text-red-900 transition duration-150"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {userRole.startsWith('ROLE_PARTNER') && task.status === 'PENDING' && (
                      <button
                        onClick={() => handleEditClick(task)}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                      >
                        View/Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TaskFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
          onSave={handleSave}
          userRole={userRole}
        />
      </div>
    </div>
  );
};

export default Tasks;
