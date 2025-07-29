import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignToPartnerModal = ({ isOpen, onClose, device, onAssign, partners }) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (device) {
      setSelectedPartnerId(device.userId || ''); // Pre-select if already assigned
    } else {
      setSelectedPartnerId('');
    }
    setError('');
  }, [device, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedPartnerId) {
      setError('Please select a partner.');
      return;
    }

    onAssign(device.id, selectedPartnerId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-start pt-10 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Assign Device to Partner</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="partnerSelect" className="block text-gray-700 text-sm font-bold mb-2">Select Partner:</label>
            <select
              id="partnerSelect"
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              required
            >
              <option value="">-- Select Partner --</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.username}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg mr-2 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignToPartnerModal;
