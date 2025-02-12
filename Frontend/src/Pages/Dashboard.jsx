import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
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
        const response = await fetch('http://localhost:5000/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Dashboard error:', error);
        navigate('/login');
      }
    };
    fetchDashboard();
  }, [navigate]);

  return (
    <div>
      <h2>Dashboard</h2>
      {dashboardData ? (
        <div>
          <p>{dashboardData.message}</p>
          <p>User ID: {dashboardData.user.id}</p>
        </div>
      ) : (
        <p>Loading dashboard...</p>
      )}
        <button onClick={handleLogout}>Logout</button>
    </div>
    
  );
};

export default Dashboard;