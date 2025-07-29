import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerFormModal = ({ isOpen, onClose, customer, onSave, userRole }) => {
  const [status, setStatus] = useState(customer ? customer.status : 'Active');
  const [eponimia, setEponimia] = useState(customer ? customer.eponimia : '');
  const [title, setTitle] = useState(customer ? customer.title : '');
  const [afm, setAfm] = useState(customer ? customer.afm : '');
  const [profession, setProfession] = useState(customer ? customer.profession : '');
  const [address, setAddress] = useState(customer ? customer.address : '');
  const [city, setCity] = useState(customer ? customer.city : '');
  const [zipCode, setZipCode] = useState(customer ? customer.zipCode : '');
  const [doy, setDoy] = useState(customer ? customer.doy : '');
  const [phone1, setPhone1] = useState(customer ? customer.phone1 : '');
  const [phone2, setPhone2] = useState(customer ? customer.phone2 : '');
  const [mobile, setMobile] = useState(customer ? customer.mobile : '');
  const [email, setEmail] = useState(customer ? customer.email : '');
  const [userId, setUserId] = useState(customer ? customer.userId : '');
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  const isSupervisor = userRole === 'ROLE_SUPERVISOR';

  useEffect(() => {
    if (isSupervisor && isOpen) {
      const fetchPartners = async () => {
        try {
          const token = localStorage.getItem('jwtToken');
          const response = await axios.get('http://192.168.1.8:8080/api/users/partners', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPartners(response.data);
        } catch (err) {
          setError('Failed to fetch partners.');
          console.error(err);
        }
      };
      fetchPartners();
    }
  }, [isSupervisor, isOpen]);

  useEffect(() => {
    if (customer) {
      setStatus(customer.status);
      setEponimia(customer.eponimia || '');
      setTitle(customer.title || '');
      setAfm(customer.afm || '');
      setProfession(customer.profession || '');
      setAddress(customer.address || '');
      setCity(customer.city || '');
      setZipCode(customer.zipCode || '');
      setDoy(customer.doy || '');
      setPhone1(customer.phone1 || '');
      setPhone2(customer.phone2 || '');
      setMobile(customer.mobile || '');
      setEmail(customer.email || '');
      setUserId(customer.userId);
    } else {
      setStatus('Active');
      setEponimia('');
      setTitle('');
      setAfm('');
      setProfession('');
      setAddress('');
      setCity('');
      setZipCode('');
      setDoy('');
      setPhone1('');
      setPhone2('');
      setMobile('');
      setEmail('');
      setUserId('');
    }
    setError(''); // Clear error on modal open/customer change
  }, [customer, isOpen]);

  const handleVatLookup = async () => {
    if (!afm) {
      setError('Please enter a VAT number to search.');
      return;
    }
    setLookupLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`http://192.168.1.8:8080/api/vat-lookup/${afm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (data) {
        setEponimia(data.eponimia || '');
        setTitle(data.title || '');
        setProfession(data.profession || '');
        setAddress(data.address || '');
        setCity(data.city || '');
        setZipCode(data.zipCode || '');
        setDoy(data.doy || '');
      }
    } catch (err) {
      setError('Failed to lookup VAT number.');
      console.error(err);
    }
    setLookupLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const customerData = {
      name: eponimia, // Map eponimia to name for backend validation
      status,
      eponimia,
      title,
      afm,
      profession,
      address,
      city,
      zipCode,
      doy,
      phone1,
      phone2,
      mobile,
      email,
      userId: isSupervisor && userId ? Number(userId) : undefined,
    };

    try {
      const token = localStorage.getItem('jwtToken');
      if (customer) {
        // Update existing customer
        await axios.put(`http://192.168.1.8:8080/api/customers/${customer.id}`, customerData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create new customer
        await axios.post('http://192.168.1.8:8080/api/customers', customerData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      onSave(); // Callback to refresh customer list
      onClose(); // Close modal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save customer.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-start pt-10 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{customer ? 'Edit Customer' : 'Create New Customer'}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="eponimia" className="block text-gray-700 text-sm font-bold mb-2">Επωνυμία:</label>
              <input
                type="text"
                id="eponimia"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={eponimia}
                onChange={(e) => setEponimia(e.target.value)}
                required // Make Eponimia required as it maps to backend 'name'
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Τίτλος:</label>
              <input
                type="text"
                id="title"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="afm" className="block text-gray-700 text-sm font-bold mb-2">ΑΦΜ:</label>
              <div className="flex">
                <input
                  type="text"
                  id="afm"
                  className="shadow-sm appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={afm}
                  onChange={(e) => setAfm(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleVatLookup}
                  disabled={lookupLoading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r disabled:bg-blue-300"
                >
                  {lookupLoading ? '...' : 'Αναζήτηση'}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="profession" className="block text-gray-700 text-sm font-bold mb-2">Επάγγελμα:</label>
              <input
                type="text"
                id="profession"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Διεύθυνση:</label>
              <input
                type="text"
                id="address"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">Πόλη:</label>
              <input
                type="text"
                id="city"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-gray-700 text-sm font-bold mb-2">ΤΚ:</label>
              <input
                type="text"
                id="zipCode"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="doy" className="block text-gray-700 text-sm font-bold mb-2">ΔΟΥ:</label>
              <input
                type="text"
                id="doy"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={doy}
                onChange={(e) => setDoy(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone1" className="block text-gray-700 text-sm font-bold mb-2">Τηλέφωνο 1:</label>
              <input
                type="text"
                id="phone1"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone2" className="block text-gray-700 text-sm font-bold mb-2">Τηλέφωνο 2:</label>
              <input
                type="text"
                id="phone2"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-gray-700 text-sm font-bold mb-2">Κινητό:</label>
              <input
                type="text"
                id="mobile"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                id="email"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            {isSupervisor && (
              <div>
                <label htmlFor="partner" className="block text-gray-700 text-sm font-bold mb-2">Assign Partner:</label>
                <select
                  id="partner"
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                >
                  <option value="">-- Select Partner --</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.username}</option>
                  ))}
                </select>
              </div>
            )}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
