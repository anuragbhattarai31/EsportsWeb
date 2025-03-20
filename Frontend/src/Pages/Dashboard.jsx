import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, set } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../Components/Header';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }


  //FETCH-BOOKINGS Function
  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) {
        throw new Error('HTTP error! status: ${response.status}')
      }

      const data = await response.json();
      setUserBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setError('Failed to load bookings');
    }
  };

  const validateTimes = () => {
    const now = new Date();
    if (startTime < now) {
      setError('Cannot book in the past');
      return false;
    }
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return false;
    }
    const duration = (endTime - startTime) / (1000 * 60 * 60);
    if (duration > 2) {
      setError('Maximum booking duration is 2 hours');
      return false;
    }
    return true;
  };

  const checkAvailability = async () => {
    setError('');
    if (!validateTimes()) return;

    setLoading(true);
    try {
      const isoStart = startTime.toISOString();
      const isoEnd = endTime.toISOString();

      const response = await fetch('http://localhost:5000/api/bookings/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          start_time: isoStart,
          end_time: isoEnd
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Availability check failed');
      }
      const data = await response.json();
      setAvailableDevices(data.available_devices || []);
      setSelectedDevice(null);
    } catch (error) {
      console.error('Full error response:', await response.json()); 
      console.error('Availability check failed:', error);
      setError('Failed to check availability');
    } finally {
      setLoading(false);
    }
  };


  ///CREATE-BOOKING Function
  const createBooking = async () => {
    
    if (!selectedDevice) {
      setError('Please select a device');
      return;
    }
    
    setLoading(true);
    try {
      const utcStart = new Date(
        Date.UTC(
          startTime.getUTCFullYear(),
          startTime.getUTCMonth(),
          startTime.getUTCDate(),
          startTime.getUTCHours(),
          startTime.getUTCMinutes()
        )
      );
      
      const utcEnd = new Date(
        Date.UTC(
          endTime.getUTCFullYear(),
          endTime.getUTCMonth(),
          endTime.getUTCDate(),
          endTime.getUTCHours(),
          endTime.getUTCMinutes()
        )
      );

      const response = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          device_id: selectedDevice,
          start_time: utcStart.toISOString(),
          end_time: utcEnd.toISOString()
        })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      await fetchBookings();
      setSelectedDevice(null);
      setAvailableDevices([]);
      setError('');
    } catch (error) {
      console.error('Booking failed:', error);
      setError(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/dashboard', {
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
    fetchBookings();
  }, [navigate]);

  //CANCEL-BOOKING Function

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel Booking');

      }
      setUserBookings(prev => prev.filter(booking => booking.id !== bookingId));
    
    } catch (error) {
      console.error('Cancel failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Header/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pt-20">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">New Booking</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <DatePicker
                selected={startTime}
                onChange={date => setStartTime(date)}
                showTimeSelect
                minDate={new Date()}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <DatePicker
                selected={endTime}
                onChange={date => setEndTime(date)}
                showTimeSelect
                minDate={startTime}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button 
            onClick={checkAvailability}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Availability'}
          </button>

          {availableDevices.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Available Devices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDevices.map(device => (
                  <div 
                    key={device.id}
                    className={`p-4 rounded-lg border-2 ${
                      selectedDevice === device.id 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-400'
                    } cursor-pointer transition-colors`}
                    onClick={() => setSelectedDevice(Number(device.id))}
                  >
                    <h4 className="font-medium">{device.name}</h4>
                    <p className="text-sm text-gray-600">{device.type}</p>
                    <p className="text-sm text-gray-500 mt-2">{device.specs}</p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={createBooking}
                disabled={!selectedDevice || loading}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
          {userBookings.length > 0 ? (
            <div className="space-y-4">
              {userBookings.map(booking => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{booking.name}</h4>
                      <p className="text-sm text-gray-600">{booking.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {format(new Date(booking.start_time), 'MMM d, yyyy h:mm a')} - 
                        {format(new Date(booking.end_time), 'h:mm a')}
                      </p>
                      <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {booking.status}
                      </span>
                      <button  
                      onClick = {(e) => {
                        e.stopPropagation();
                        cancelBooking(booking.id)}}
                        className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                        disabled={loading}
                      >
                        {loading ? 'Cancelling...' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming bookings</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;