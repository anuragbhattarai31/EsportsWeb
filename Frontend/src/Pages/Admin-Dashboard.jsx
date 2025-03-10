import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {Tab, Tabs} from 'react-bootstrap';
import {format, set} from 'date-fns'
import Header from '../Components/Header';



const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeReservations: 0,
    pendingRequests: 0
  });

const [loadingStats, setLoadingStats] = useState(true);
const [loadingBookings, setLoadingBookings] = useState(true);
  
  // New states for device/booking management
const [devices, setDevices] = useState([]);
const [bookings, setBookings] = useState([]);
const [newDevice, setNewDevice] = useState({ 
    name: '', 
    type: 'PC', 
    specs: '' 
});
const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

// Update fetchDevicesAndBookings function
const fetchDevicesAndBookings = async () => {
  try {
    setLoadingBookings(true);
    const token = localStorage.getItem('token');
    
    const [devRes, bookRes] = await Promise.all([
      fetch('http://localhost:5000/api/admin/devices', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch('http://localhost:5000/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    // Handle non-OK responses
    if (!devRes.ok) throw new Error('Devices fetch failed');
    if (!bookRes.ok) throw new Error('Bookings fetch failed');

    const devicesData = await devRes.json();
    const bookingsData = await bookRes.json();

    setDevices(devicesData);
    setBookings(bookingsData);
    
  } catch (error) {
    console.error('Fetch error:', error);
    // Set empty arrays as fallback
    setDevices([]);
    setBookings([]);
  } finally {
    setLoadingBookings(false);
  }
};

  const handleAddDevice = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newDevice)
      });
      
      if (response.ok) {
        const newDeviceData = await response.json();
        setDevices([...devices, newDeviceData]);
        setNewDevice({ name: '', type: 'PC', specs: '' });
      }
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  const handleToggleDevice = async (deviceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/devices/${deviceId}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        setDevices(devices.map(device => 
          device.id === deviceId 
            ? { ...device, is_active: !device.is_active } 
            : device
        ));
      }
    } catch (error) {
      console.error('Failed to toggle device:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== bookingId));
      }
    }
    catch (error) { console.error('Failed to cancel booking:', error); }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/devices/${deviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        setDevices(devices.filter(device => device.id !== deviceId));
      }
    } catch (error) {
      console.error('Failed to delete device:', error);
    }
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== 'admin') {
          navigate('/dashboard');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/adminDashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.status === 403) {
          navigate('/unauthorized');
          return;
        }

        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
          fetchStats();
          fetchDevicesAndBookings();
          setLoadingStats(false);

          
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
      <Header/>
  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {dashboardData ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Stats Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {dashboardData.message}
              </h2>
              <p className="text-gray-600">
                Admin ID: <span className="font-mono text-red-600">{dashboardData.user.id}</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-red-700 font-medium">Total Users</h3>
                  <p className="text-2xl font-bold text-red-600">{stats.totalUsers}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-red-700 font-medium">Active Reservations</h3>
                  <p className="text-2xl font-bold text-red-600">{stats.activeReservations}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-red-700 font-medium">Pending Requests</h3>
                  <p className="text-2xl font-bold text-red-600">{stats.pendingRequests}</p>
                </div>
              </div>
            </div>
  
            {/* Management Tabs */}
            <Tabs defaultActiveKey="devices" className="mb-4">
              <Tab eventKey="devices" title="Manage Devices">
                <div className="row mt-4">
                  {/* Add Device Form */}
                  <div className="col-md-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-gray-700">Add New Device</h4>
                      <input
                        type="text"
                        placeholder="Device Name"
                        className="w-full mb-2 p-2 border rounded"
                        value={newDevice.name}
                        onChange={e => setNewDevice({...newDevice, name: e.target.value})}
                      />
                      {/* Add Specs Input */}
                      <input
                        type="text"
                        placeholder="Device Specs (e.g., CPU, GPU)"
                        className="w-full mb-2 p-2 border rounded"
                        value={newDevice.specs}
                        onChange={e => setNewDevice({...newDevice, specs: e.target.value})}
                      />
                      
                      <select 
                        className="w-full mb-2 p-2 border rounded"
                        value={newDevice.type}
                        onChange={e => setNewDevice({...newDevice, type: e.target.value})}
                      >
                        <option value="PC">PC</option>
                        <option value="Console">Console</option>
                      </select>
                      <button 
                        onClick={handleAddDevice}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Add Device
                      </button>
                    </div>
                  </div>
  
                  {/* Devices List */}
                  <div className="col-md-8">
                    <div className="bg-white rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-gray-700">All Devices</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {devices.map(device => (
                              <tr key={device.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{device.name}</td>
                                <td className="px-4 py-2">{device.type}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 rounded-full text-sm ${
                                    device.is_active 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {device.is_active ? 'Active' : 'Maintenance'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                  <button
                                    onClick={() => handleToggleDevice(device.id)}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                  >
                                    {device.is_active ? 'Deactivate' : 'Activate'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDevice(device.id)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="bookings" title="Manage Bookings">
                {loadingBookings ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="mt-4 bg-white rounded-lg shadow-sm overflow-hidden">
                    {bookings.length === 0 ? (
                    <div className="p-4 text-gray-500">No active bookings found</div>
                  ) : (
                  <>
                    <h4 className="text-lg font-semibold mb-3 p-4 text-gray-700">Current Bookings</h4>
                    <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Device</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Start Time</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">End Time</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{booking.email}</td>
                    <td className="px-4 py-2">{booking.device_name}</td>
                    <td className="px-4 py-2">{format(new Date(booking.start_time), 'MMM d, yyyy HH:mm')}</td>
                    <td className="px-4 py-2">{format(new Date(booking.end_time), 'MMM d, yyyy HH:mm')}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )}
</Tab>
              
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"
              role="status" 
              aria-label="Loading"
            ></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;