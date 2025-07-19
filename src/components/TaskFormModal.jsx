import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskFormModal = ({ isOpen, onClose, task, onSave, userRole }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [error, setError] = useState('');

  const isPartner = userRole.startsWith('ROLE_PARTNER');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setError('');
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const taskData = {
      title,
      description,
    };

    try {
      const token = localStorage.getItem('jwtToken');
      if (task) {
        // For now, partners can only create tasks, not edit existing ones via this modal
        // Supervisors will update status directly on the table
        setError('Editing existing tasks is not allowed via this form.');
        return;
      } else {
        // Create new task
        await axios.post('http://192.168.1.8:8080/api/tasks', taskData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-start pt-10 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{task ? 'View Task' : 'Create New Task'}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              id="title"
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={!!task} // Disable if viewing existing task
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!!task} // Disable if viewing existing task
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg mr-2 transition duration-300"
            >
              {task ? 'Close' : 'Cancel'}
            </button>
            {!task && isPartner && (
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Create Task
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
