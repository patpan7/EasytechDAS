import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeviceFormModal = ({ isOpen, onClose, device, onSave, userRole }) => {
  const [serialNumber, setSerialNumber] = useState(device ? device.serialNumber : '');
  const [status, setStatus] = useState(device ? device.status : 'Active');
  const [customerId, setCustomerId] = useState(device ? device.customerId : '');
  const [assignedToUserId, setAssignedToUserId] = useState(device ? device.userId : '');
  const [allCustomers, setAllCustomers] = useState([]); // Store all customers for supervisor filtering
  const [customers, setCustomers] = useState([]); // Filtered customers for the dropdown
  const [partners, setPartners] = useState([]);
  const [selectedFilterPartnerId, setSelectedFilterPartnerId] = useState(''); // For filtering customers by partner
  const [error, setError] = useState('');

  const isSupervisor = userRole === 'ROLE_SUPERVISOR';

  useEffect(() => {
    if (isOpen) {
      const fetchCustomersAndPartners = async () => {
        try {
          const token = localStorage.getItem('jwtToken');

          if (isSupervisor) {
            // Fetch all customers for supervisor
            const allCustomersResponse = await axios.get('http://192.168.1.8:8080/api/customers', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setAllCustomers(allCustomersResponse.data);
            setCustomers(allCustomersResponse.data); // Initially show all customers

            // Fetch all partners for supervisor
            const partnerResponse = await axios.get('http://192.168.1.8:8080/api/users/partners', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setPartners(partnerResponse.data);
          } else {
            // For partners, fetch only their customers
            const customerResponse = await axios.get('http://192.168.1.8:8080/api/devices/customers', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setCustomers(customerResponse.data);
          }
        } catch (err) {
          setError('Failed to fetch data.');
          console.error(err);
        }
      };
      fetchCustomersAndPartners();
    }
  }, [isOpen, isSupervisor]);

  useEffect(() => {
    if (device) {
      setSerialNumber(device.serialNumber);
      setStatus(device.status);
      setCustomerId(device.customerId || '');
      setAssignedToUserId(device.userId || '');
    } else {
      setSerialNumber('');
      setStatus('Active');
      setCustomerId('');
      setAssignedToUserId('');
    }
    setError('');
  }, [device, isOpen]);

  useEffect(() => {
    if (isSupervisor && allCustomers.length > 0) {
      if (selectedFilterPartnerId) {
        const filtered = allCustomers.filter(c => c.userId === Number(selectedFilterPartnerId));
        setCustomers(filtered);
      } else {
        setCustomers(allCustomers);
      }
    }
  }, [selectedFilterPartnerId, allCustomers, isSupervisor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let deviceData = {
      serialNumber,
      status,
    };

    if (customerId) {
      deviceData.customerId = Number(customerId);
    } else if (assignedToUserId) {
      deviceData.assignedToUserId = Number(assignedToUserId);
    }

    // Basic validation: ensure either customerId or assignedToUserId is set
    // Removed validation to allow unassigned devices
    // if (!deviceData.customerId && !deviceData.assignedToUserId) {
    //   setError('A device must be assigned to either a customer or a user.');
    //   return;
    // }
    // if (deviceData.customerId && deviceData.assignedToUserId) {
    //   setError('A device cannot be assigned to both a customer and a user.');
    //   return;
    // }

    try {
      const token = localStorage.getItem('jwtToken');
      if (device) {
        // Update existing device (not implemented in backend yet, but good to have the structure)
        setError('Updating devices is not yet implemented.');
        return;
      } else {
        // Create new device
        await axios.post('http://192.168.1.8:8080/api/devices', deviceData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save device.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-start pt-10 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{device ? 'Edit Device' : 'Create New Device'}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serialNumber" className="block text-gray-700 text-sm font-bold mb-2">Serial Number:</label>
            <input
              type="text"
              id="serialNumber"
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select
              id="status"
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {isSupervisor ? (
            <>
              <div>
                <label htmlFor="filterPartner" className="block text-gray-700 text-sm font-bold mb-2">Filter by Partner:</label>
                <select
                  id="filterPartner"
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedFilterPartnerId}
                  onChange={(e) => setSelectedFilterPartnerId(e.target.value)}
                >
                  <option value="">-- Show All Partners --</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.username}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="customer" className="block text-gray-700 text-sm font-bold mb-2">Assign to Customer:</label>
                <select
                  id="customer"
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={customerId}
                  onChange={(e) => { setCustomerId(e.target.value); setAssignedToUserId(''); }}
                  disabled={!!assignedToUserId}
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.eponimia} ({c.name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="partner" className="block text-gray-700 text-sm font-bold mb-2">Assign to Partner:</label>
                <select
                  id="partner"
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={assignedToUserId}
                  onChange={(e) => { setAssignedToUserId(e.target.value); setCustomerId(''); }}
                  disabled={!!customerId}
                >
                  <option value="">-- Select Partner --</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.username}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="customer" className="block text-gray-700 text-sm font-bold mb-2">Assign to Customer:</label>
              <select
                id="customer"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">-- Select Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.eponimia} ({c.name})</option>
                ))}
              </select>
            </div>
          )}

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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceFormModal;
