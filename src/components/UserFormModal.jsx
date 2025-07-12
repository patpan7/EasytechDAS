import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserFormModal = ({ isOpen, onClose, user, onSave }) => {
  const [role, setRole] = useState(user ? user.role : '');
  const [enabled, setEnabled] = useState(user ? user.enabled : false);
  const [eponimia, setEponimia] = useState(user ? user.eponimia : '');
  const [title, setTitle] = useState(user ? user.title : '');
  const [afm, setAfm] = useState(user ? user.afm : '');
  const [profession, setProfession] = useState(user ? user.profession : '');
  const [address, setAddress] = useState(user ? user.address : '');
  const [city, setCity] = useState(user ? user.city : '');
  const [zipCode, setZipCode] = useState(user ? user.zipCode : '');
  const [doy, setDoy] = useState(user ? user.doy : '');
  const [phone1, setPhone1] = useState(user ? user.phone1 : '');
  const [phone2, setPhone2] = useState(user ? user.phone2 : '');
  const [mobile, setMobile] = useState(user ? user.mobile : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setEnabled(user.enabled);
      setEponimia(user.eponimia || '');
      setTitle(user.title || '');
      setAfm(user.afm || '');
      setProfession(user.profession || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setZipCode(user.zipCode || '');
      setDoy(user.doy || '');
      setPhone1(user.phone1 || '');
      setPhone2(user.phone2 || '');
      setMobile(user.mobile || '');
      setEmail(user.email || '');
    } else {
      setRole('');
      setEnabled(false);
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
    }
    setError('');
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const userData = {
      role,
      enabled,
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
    };

    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`http://192.168.1.8:8080/api/users/${user.id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit User: {user.username}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
              <select
                id="role"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="ROLE_SUPERVISOR">Supervisor</option>
                <option value="ROLE_PARTNER">Partner</option>
                <option value="ROLE_PARTNER_VIVA">Partner Viva</option>
                <option value="ROLE_PARTNER_MYPOS">Partner MyPos</option>
              </select>
            </div>
            <div>
              <label htmlFor="enabled" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
              <select
                id="enabled"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={enabled}
                onChange={(e) => setEnabled(e.target.value === 'true')}
                required
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <div>
              <label htmlFor="eponimia" className="block text-gray-700 text-sm font-bold mb-2">Επωνυμία:</label>
              <input
                type="text"
                id="eponimia"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={eponimia}
                onChange={(e) => setEponimia(e.target.value)}
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
              <input
                type="text"
                id="afm"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={afm}
                onChange={(e) => setAfm(e.target.value)}
              />
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

export default UserFormModal;
