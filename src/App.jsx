import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // Import the new Register component
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Devices from './pages/Devices';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Users from './pages/Users'; // Import the new Users component
import Tasks from './pages/Tasks'; // Import the new Tasks component

import ChangePassword from './pages/ChangePassword'; // Import the new ChangePassword component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Navbar />
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Navbar />
                <Customers />
              </PrivateRoute>
            }
          />
          <Route
            path="/devices"
            element={
              <PrivateRoute>
                <Navbar />
                <Devices />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Navbar />
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Navbar />
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <Navbar />
                <ChangePassword />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Login />} /> {/* Default route to login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;