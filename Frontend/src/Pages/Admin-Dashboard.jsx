import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      try {
        // Verify admin role
        const decoded = jwtDecode(token);
        if (decoded.role !== 'admin') {
          navigate('/dashboard');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/adminDashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Handle response
        if (response.status === 403) {
          navigate('/unauthorized');
          return;
        }

        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Admin dashboard error:', error);
        navigate('/login');
      }
    };
    
    fetchDashboard();
  }, [navigate]);

  return (
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-red-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </nav>
  
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {dashboardData ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {dashboardData.message}
                </h2>
                <p className="text-gray-600">
                  Admin ID: <span className="font-mono text-red-600">{dashboardData.user.id}</span>
                </p>
              </div>
              
              {/* Admin Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-red-700 font-medium">Total Users</h3>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-red-700 font-medium">Active Reservations</h3>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-red-700 font-medium">Pending Requests</h3>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default AdminDashboard;