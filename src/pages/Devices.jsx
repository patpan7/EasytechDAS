import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import DeviceFormModal from '../components/DeviceFormModal';
import AssignToPartnerModal from '../components/AssignToPartnerModal'; // New import

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [decodedToken, setDecodedToken] = useState(null);
  const [isAssignToCustomerModalOpen, setIsAssignToCustomerModalOpen] = useState(false);
  const [selectedDeviceToAssign, setSelectedDeviceToAssign] = useState(null);
  const [customersForAssignment, setCustomersForAssignment] = useState([]);
  const [selectedCustomerForAssignment, setSelectedCustomerForAssignment] = useState('');
  const [isAssignToPartnerModalOpen, setIsAssignToPartnerModalOpen] = useState(false); // New state
  const [partnersForAssignment, setPartnersForAssignment] = useState([]); // New state

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      // Decode token to get user role
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
      const role = decoded.authorities && decoded.authorities.length > 0 ? decoded.authorities[0] : '';
      setUserRole(role);

      const response = await axios.get('http://192.168.1.8:8080/api/devices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDevices(response.data);
    } catch (err) {
      setError('Failed to fetch devices.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleCreateClick = () => {
    setSelectedDevice(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    fetchDevices(); // Refresh the list after save
  };

  const handleAssignToCustomerClick = async (device) => {
    setSelectedDeviceToAssign(device);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://192.168.1.8:8080/api/devices/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomersForAssignment(response.data);
      setIsAssignToCustomerModalOpen(true);
    } catch (err) {
      setError('Failed to fetch customers for assignment.');
      console.error(err);
    }
  };

  const handleAssignToCustomerSubmit = async () => {
    if (!selectedCustomerForAssignment) {
      setError('Please select a customer.');
      return;
    }
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`http://192.168.1.8:8080/api/devices/${selectedDeviceToAssign.id}/assign-to-customer/${selectedCustomerForAssignment}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsAssignToCustomerModalOpen(false);
      setSelectedCustomerForAssignment('');
      fetchDevices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign device to customer.');
      console.error(err);
    }
  };

  const handleAssignToPartnerClick = async (device) => { // New function
    setSelectedDeviceToAssign(device);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://192.168.1.8:8080/api/users/partners', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPartnersForAssignment(response.data);
      setIsAssignToPartnerModalOpen(true);
    } catch (err) {
      setError('Failed to fetch partners for assignment.');
      console.error(err);
    }
  };

  const handleAssignToPartnerSubmit = async (deviceId, partnerId) => { // Modified function
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`http://192.168.1.8:8080/api/devices/${deviceId}/assign-to-partner/${partnerId}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsAssignToPartnerModalOpen(false);
      fetchDevices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign device to partner.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Devices</h1>
          {(userRole === 'ROLE_SUPERVISOR' || userRole.startsWith('ROLE_PARTNER')) && (
            <button
              onClick={handleCreateClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create New Device
            </button>
          )}
        </div>

        {error && <p className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</p>}

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{device.serialNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${device.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.customerId ? `Customer ID: ${device.customerId}` : device.assignedToUsername ? `Partner: ${device.assignedToUsername}` : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {userRole.startsWith('ROLE_PARTNER') && device.userId === decodedToken.userId && !device.customerId && (
                      <button
                        onClick={() => handleAssignToCustomerClick(device)}
                        className="text-blue-600 hover:text-blue-900 transition duration-150"
                      >
                        Assign to Customer
                      </button>
                    )}
                    {userRole === 'ROLE_SUPERVISOR' && !device.customerId && (!device.userId || device.userId === decodedToken.userId) && (
                      <button
                        onClick={() => handleAssignToPartnerClick(device)} // Changed to new function
                        className="text-purple-600 hover:text-purple-900 transition duration-150"
                      >
                        Assign to Partner
                      </button>
                    )}
                    {userRole === 'ROLE_SUPERVISOR' && device.userId && (
                      <button
                        onClick={() => handleAssignToCustomerClick(device)}
                        className="text-blue-600 hover:text-blue-900 transition duration-150"
                      >
                        Assign to Customer (from Partner Pool)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DeviceFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          device={selectedDevice}
          onSave={handleSave}
          userRole={userRole}
        />

        {isAssignToCustomerModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-start pt-10 z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Assign Device to Customer</h2>
              {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
              <form onSubmit={(e) => { e.preventDefault(); handleAssignToCustomerSubmit(); }} className="space-y-4">
                <div>
                  <label htmlFor="customerForAssignment" className="block text-gray-700 text-sm font-bold mb-2">Select Customer:</label>
                  <select
                    id="customerForAssignment"
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCustomerForAssignment}
                    onChange={(e) => setSelectedCustomerForAssignment(e.target.value)}
                    required
                  >
                    <option value="">-- Select Customer --</option>
                    {customersForAssignment.map(c => (
                      <option key={c.id} value={c.id}>{c.eponimia} ({c.name})</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAssignToCustomerModalOpen(false)}
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
        )}

        <AssignToPartnerModal // New modal
          isOpen={isAssignToPartnerModalOpen}
          onClose={() => setIsAssignToPartnerModalOpen(false)}
          device={selectedDeviceToAssign}
          onAssign={handleAssignToPartnerSubmit}
          partners={partnersForAssignment}
        />
      </div>
    </div>
  );
};

export default Devices;
