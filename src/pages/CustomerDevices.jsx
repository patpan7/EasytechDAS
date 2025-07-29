import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const CustomerDevices = () => {
  const { customerId } = useParams();
  const [customerName, setCustomerName] = useState('');
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomerAndDevices = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        
        // Fetch customer details to display name
        const customerResponse = await axios.get(`http://192.168.1.8:8080/api/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomerName(customerResponse.data.eponimia || customerResponse.data.name);

        // Fetch devices for this customer
        const devicesResponse = await axios.get(`http://192.168.1.8:8080/api/devices/customer/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDevices(devicesResponse.data);

      } catch (err) {
        setError('Failed to fetch customer details or devices.');
        console.error(err);
      }
    };

    fetchCustomerAndDevices();
  }, [customerId]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Devices for {customerName}</h1>
          <Link to="/customers" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            Back to Customers
          </Link>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</p>}

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {devices.length > 0 ? (
                devices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{device.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        device.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No devices found for this customer.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDevices;
