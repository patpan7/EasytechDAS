import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_PARTNER'); // Default role
  const [eponimia, setEponimia] = useState('');
  const [title, setTitle] = useState('');
  const [afm, setAfm] = useState('');
  const [profession, setProfession] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [doy, setDoy] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const navigate = useNavigate();

  const handleVatLookup = async () => {
    if (!afm) {
      setMessage('Please enter a VAT number to search.');
      return;
    }
    setLookupLoading(true);
    setMessage('');
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
      setMessage('Failed to lookup VAT number.');
      console.error(err);
    }
    setLookupLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://192.168.1.8:8080/api/auth/register', {
        username,
        password,
        role,
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
      });
      setMessage('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed. Username might already exist.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Register a new user
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium leading-6 text-gray-900">User Credentials</h3>
              <hr className="mt-2"/>
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="role">Role</label>
              <select id="role" required value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="ROLE_PARTNER">Partner</option>
                <option value="ROLE_SUPERVISOR">Supervisor</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mt-6">Company Details</h3>
              <hr className="mt-2"/>
            </div>
            <div>
              <label htmlFor="afm">ΑΦΜ</label>
              <div className="flex">
                <input id="afm" type="text" value={afm} onChange={(e) => setAfm(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <button type="button" onClick={handleVatLookup} disabled={lookupLoading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                  {lookupLoading ? '...' : 'Αναζήτηση'}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="eponimia">Επωνυμία</label>
              <input id="eponimia" type="text" value={eponimia} onChange={(e) => setEponimia(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="title">Τίτλος</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="profession">Επάγγελμα</label>
              <input id="profession" type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="address">Διεύθυνση</label>
              <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="city">Πόλη</label>
              <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="zipCode">ΤΚ</label>
              <input id="zipCode" type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="doy">ΔΟΥ</label>
              <input id="doy" type="text" value={doy} onChange={(e) => setDoy(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="phone1">Τηλέφωνο 1</label>
              <input id="phone1" type="text" value={phone1} onChange={(e) => setPhone1(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="phone2">Τηλέφωνο 2</label>
              <input id="phone2" type="text" value={phone2} onChange={(e) => setPhone2(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="mobile">Κινητό</label>
              <input id="mobile" type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          {message && <p className="mt-4 text-center text-sm text-blue-600 font-medium">{message}</p>}

          <div className="pt-6">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-sm text-center mt-6">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
