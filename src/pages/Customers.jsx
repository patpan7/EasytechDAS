import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import CustomerFormModal from '../components/CustomerFormModal';
import { Link } from 'react-router-dom';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [decodedToken, setDecodedToken] = useState(null); // Store decoded token

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      // Decode token to get user role and other claims
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
      const role = decoded.authorities && decoded.authorities.length > 0 ? decoded.authorities[0] : '';
      setUserRole(role);

      const response = await axios.get('http://192.168.1.8:8080/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateClick = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    fetchCustomers(); // Refresh the list after save
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          {(userRole === 'ROLE_SUPERVISOR' || userRole === 'ROLE_PARTNER') && (
            <button
              onClick={handleCreateClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create New Customer
            </button>
          )}
        </div>

        {error && <p className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</p>}

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Επωνυμία</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Τίτλος</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Συνεργάτης</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    <Link to={`/customers/${customer.id}/devices`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                      {customer.eponimia}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{customer.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.partnerUsername}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(userRole === 'ROLE_SUPERVISOR' || (userRole.startsWith('ROLE_PARTNER') && decodedToken && customer.userId === decodedToken.userId)) && (
                      <button
                        onClick={() => handleEditClick(customer)}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CustomerFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          customer={selectedCustomer}
          onSave={handleSave}
          userRole={userRole}
        />
      </div>
    </div>
  );
};

export default Customers;
