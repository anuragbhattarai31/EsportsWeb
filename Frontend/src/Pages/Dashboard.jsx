"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
  Calendar,
  Clock,
  Gamepad2,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarClock,
  Trash2,
  ExternalLink,
} from "lucide-react"
import Header from "../Components/Header"

const Dashboard = () => {
  const [registrationStatus, setRegistrationStatus] = useState("")
  const [dashboardData, setDashboardData] = useState(null)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 1)))
  const [availableDevices, setAvailableDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [userBookings, setUserBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("bookings")
  const navigate = useNavigate()
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // FETCH-BOOKINGS Function
  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/bookings/my-bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setUserBookings(data.bookings || [])
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
      setError("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const validateTimes = () => {
    const now = new Date()
    if (startTime < now) {
      setError("Cannot book in the past")
      return false
    }
    if (startTime >= endTime) {
      setError("End time must be after start time")
      return false
    }
    const duration = (endTime - startTime) / (1000 * 60 * 60)
    if (duration > 2) {
      setError("Maximum booking duration is 2 hours")
      return false
    }
    return true
  }

  const checkAvailability = async () => {
    setError("")
    if (!validateTimes()) return

    setLoading(true)
    try {
      const isoStart = startTime.toISOString()
      const isoEnd = endTime.toISOString()

      const response = await fetch("http://localhost:5000/api/bookings/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          start_time: isoStart,
          end_time: isoEnd,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Availability check failed")
      }

      const data = await response.json()
      setAvailableDevices(data.available_devices || [])
      setSelectedDevice(null)
    } catch (error) {
      console.error("Availability check failed:", error)
      setError("Failed to check availability")
    } finally {
      setLoading(false)
    }
  }

  // CREATE-BOOKING Function
  const createBooking = async () => {
    if (!selectedDevice) {
      setError("Please select a device")
      return
    }

    setLoading(true)
    try {
      const utcStart = new Date(
        Date.UTC(
          startTime.getUTCFullYear(),
          startTime.getUTCMonth(),
          startTime.getUTCDate(),
          startTime.getUTCHours(),
          startTime.getUTCMinutes(),
        ),
      )

      const utcEnd = new Date(
        Date.UTC(
          endTime.getUTCFullYear(),
          endTime.getUTCMonth(),
          endTime.getUTCDate(),
          endTime.getUTCHours(),
          endTime.getUTCMinutes(),
        ),
      )

      const response = await fetch("http://localhost:5000/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          device_id: selectedDevice,
          start_time: utcStart.toISOString(),
          end_time: utcEnd.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Booking failed")
      }

      await fetchBookings()
      setSelectedDevice(null)
      setAvailableDevices([])
      setError("")

      // Show success message
      setSuccessMessage("Booking created successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Booking failed:", error)
      setError(error.message || "Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  // CANCEL-BOOKING Function
  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel Booking")
      }

      setUserBookings((prev) => prev.filter((booking) => booking.id !== bookingId))

      // Show success message
      setSuccessMessage("Booking cancelled successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Cancel failed:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token")
      if (!token) return navigate("/login")

      try {
        const response = await fetch("http://localhost:5000/api/auth/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        if (response.ok) {
          setDashboardData(data)
        } else {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } catch (error) {
        console.error("Dashboard error:", error)
        navigate("/login")
      }
    }

    fetchDashboard()
    fetchBookings()
  }, [navigate])

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/club-registrations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.status === 404) {
          setRegistrationStatus("not_registered")
          return
        }

        if (!response.ok) throw new Error("Status check failed")

        const data = await response.json()
        setRegistrationStatus(data.status)
      } catch (error) {
        console.error("Registration check error:", error)
        setRegistrationStatus("error")
      }
    }

    checkRegistrationStatus()
  }, [])

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        )
      case "pending":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Unknown
          </span>
        )
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStartPicker || showEndPicker) {
        // Check if the click is outside the date pickers
        if (!event.target.closest(".react-datepicker") && !event.target.closest('input[type="text"]')) {
          setShowStartPicker(false)
          setShowEndPicker(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showStartPicker, showEndPicker])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your bookings and club membership</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-800 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                activeTab === "bookings"
                  ? "border-semored text-semored"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Gaming Stations
            </button>
            <button
              onClick={() => setActiveTab("membership")}
              className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                activeTab === "membership"
                  ? "border-semored text-semored"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Club Membership
            </button>
          </nav>
        </div>

        {/* Gaming Stations Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* New Booking Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-semored" />
                  New Booking
                </h2>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Time Selection - Left Side */}
                  <div className="w-full md:w-1/3">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={format(startTime, "MMMM d, yyyy h:mm aa")}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-semored focus:border-semored cursor-pointer"
                            onClick={() => setShowStartPicker(!showStartPicker)}
                          />
                          <Clock className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        {showStartPicker && (
                          <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <DatePicker
                              selected={startTime}
                              onChange={(date) => {
                                setStartTime(date)
                                setShowStartPicker(false)
                                // If end time is before new start time, adjust it
                                if (date >= endTime) {
                                  setEndTime(new Date(new Date(date).setHours(date.getHours() + 1)))
                                }
                              }}
                              showTimeSelect
                              minDate={new Date()}
                              dateFormat="MMMM d, yyyy h:mm aa"
                              inline
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={format(endTime, "MMMM d, yyyy h:mm aa")}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-semored focus:border-semored cursor-pointer"
                            onClick={() => setShowEndPicker(!showEndPicker)}
                          />
                          <Clock className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        {showEndPicker && (
                          <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <DatePicker
                              selected={endTime}
                              onChange={(date) => {
                                setEndTime(date)
                                setShowEndPicker(false)
                              }}
                              showTimeSelect
                              minDate={startTime}
                              dateFormat="MMMM d, yyyy h:mm aa"
                              inline
                            />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={checkAvailability}
                        disabled={loading}
                        className="w-full bg-semored text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5 mr-2" />
                            Check Availability
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Available Devices - Right Side */}
                  <div className="w-full md:w-2/3">
                    {availableDevices.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Gamepad2 className="w-5 h-5 mr-2 text-semored" />
                          Available Devices
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {availableDevices.map((device) => (
                            <div
                              key={device.id}
                              className={`p-4 rounded-lg border-2 ${
                                selectedDevice === device.id
                                  ? "border-semored bg-red-50"
                                  : "border-gray-200 hover:border-semored"
                              } cursor-pointer transition-colors`}
                              onClick={() => setSelectedDevice(Number(device.id))}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{device.name}</h4>
                                  <p className="text-sm text-gray-600">{device.type}</p>
                                </div>
                                <div
                                  className={`w-4 h-4 rounded-full ${selectedDevice === device.id ? "bg-semored" : "bg-gray-200"}`}
                                ></div>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">{device.specs}</p>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={createBooking}
                          disabled={!selectedDevice || loading}
                          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Confirm Booking
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <Gamepad2 className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Devices Available</h3>
                        <p className="text-gray-500 max-w-md">
                          Select a date and time, then click "Check Availability" to see available gaming stations.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Your Bookings Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold flex items-center">
                  <CalendarClock className="w-5 h-5 mr-2 text-semored" />
                  Your Bookings
                </h2>
              </div>

              <div className="p-6">
                {loading && userBookings.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-semored animate-spin" />
                  </div>
                ) : userBookings.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-3 rounded-lg mr-4">
                              <Gamepad2 className="w-6 h-6 text-semored" />
                            </div>
                            <div>
                              <h4 className="font-medium text-lg">{booking.name}</h4>
                              <p className="text-sm text-gray-600">{booking.type}</p>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end">
                            <div className="flex items-center text-gray-700 mb-2">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="text-sm">{format(new Date(booking.start_time), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Clock className="w-4 h-4 mr-2" />
                              <span className="text-sm">
                                {format(new Date(booking.start_time), "h:mm a")} -{" "}
                                {format(new Date(booking.end_time), "h:mm a")}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                              {booking.status || "reserved"}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                cancelBooking(booking.id)
                              }}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                              disabled={loading}
                              title="Cancel booking"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarClock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No upcoming bookings</p>
                    <p className="text-sm text-gray-400 mt-1">Book a gaming station to see it here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Club Membership Tab */}
        {activeTab === "membership" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2 text-semored" />
                Club Membership
              </h2>
            </div>

            <div className="p-6">
              {registrationStatus === "not_registered" ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Join the SEMO Esports Club</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Become a member of our esports community and get access to exclusive events, tournaments, and more!
                  </p>
                  <button
                    onClick={() => navigate("/club-registration")}
                    className="bg-semored text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Register for Club
                  </button>
                </div>
              ) : registrationStatus === "error" ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <p className="text-red-500">Error checking registration status</p>
                </div>
              ) : (
                <div className="py-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-medium">Your Membership Status</h3>
                      <p className="text-gray-600 mt-1">Current status: {getStatusBadge(registrationStatus)}</p>
                    </div>

                    {registrationStatus === "rejected" && (
                      <button
                        onClick={() => navigate("/club-registration")}
                        className="bg-semored text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Apply Again
                      </button>
                    )}
                  </div>

                  {registrationStatus === "pending" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Application Under Review</h4>
                          <p className="text-yellow-700 text-sm mt-1">
                            Your application is currently being reviewed by our team. We'll notify you once a decision
                            has been made.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {registrationStatus === "approved" && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-green-800">Membership Approved</h4>
                            <p className="text-green-700 text-sm mt-1">
                              Welcome to the SEMO Esports Club! You now have access to all member benefits and
                              activities.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Join Our Communities</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <a
                            href="https://www.twitch.tv/semoesports"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
                          >
                            <div className="mr-3 bg-purple-200 p-2 rounded-lg">
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11 11V7M16 11V7M21 2H3V18H8V22L12 18H17L21 14V2Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <div>
                              <span className="font-medium">Twitch</span>
                              <ExternalLink className="w-3 h-3 inline-block ml-1" />
                            </div>
                          </a>

                          <a
                            href="https://discord.gg/EKDjShyEMY"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <div className="mr-3 bg-blue-200 p-2 rounded-lg">
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 11.5C9 12.3284 8.32843 13 7.5 13C6.67157 13 6 12.3284 6 11.5C6 10.6716 6.67157 10 7.5 10C8.32843 10 9 10.6716 9 11.5Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M16.5 13C17.3284 13 18 12.3284 18 11.5C18 10.6716 17.3284 10 16.5 10C15.6716 10 15 10.6716 15 11.5C15 12.3284 15.6716 13 16.5 13Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M18 6C15.7909 4.64044 13.3484 4 12 4C10.6516 4 8.20908 4.64044 6 6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6 18C8.20908 19.3596 10.6516 20 12 20C13.3484 20 15.7909 19.3596 18 18"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M18 6L20 4M18 18L20 20"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6 6L4 4M6 18L4 20"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <div>
                              <span className="font-medium">Discord</span>
                              <ExternalLink className="w-3 h-3 inline-block ml-1" />
                            </div>
                          </a>

                          <a
                            href="https://www.youtube.com/channel/UCsemoesports"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <div className="mr-3 bg-red-200 p-2 rounded-lg">
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16135 5.19941C1.82072 5.55057 1.57879 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 0.999999 11.75C0.988779 13.537 1.14277 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0112 9.96295 22.8572 8.1787 22.54 6.42Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.75 15.02L15.5 11.75L9.75 8.48001V15.02Z"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <div>
                              <span className="font-medium">YouTube</span>
                              <ExternalLink className="w-3 h-3 inline-block ml-1" />
                            </div>
                          </a>

                          <a
                            href="https://twitter.com/semoesports"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <div className="mr-3 bg-blue-200 p-2 rounded-lg">
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M22 4.01C21 4.5 20.02 4.69 19 4.82C18.46 4.2 17.73 3.72 16.91 3.44C16.09 3.16 15.22 3.09 14.36 3.25C13.5 3.4 12.71 3.77 12.05 4.32C11.39 4.87 10.89 5.59 10.6 6.4C10.31 7.21 10.24 8.09 10.41 8.94C10.58 9.78 10.98 10.56 11.58 11.19C10.58 11.1 9.61 10.82 8.7 10.37C7.8 9.93 6.99 9.33 6.3 8.6C5.7 9.5 5.5 10.6 5.8 11.6C6.1 12.6 6.8 13.5 7.8 13.9C7.1 13.9 6.3 13.7 5.7 13.3V13.4C5.7 14.3 6 15.2 6.5 15.9C7 16.6 7.8 17.1 8.7 17.3C8 17.5 7.2 17.5 6.5 17.4C6.8 18.2 7.3 18.9 8 19.4C8.7 19.9 9.5 20.1 10.4 20.1C9.5 20.8 8.5 21.3 7.4 21.6C6.3 21.9 5.2 22 4 21.9C6.2 23.1 8.6 23.7 11.1 23.7C13.6 23.7 16 23.1 18.2 21.9C20.3 20.7 22.1 19 23.3 16.9C24.5 14.8 25.1 12.4 25.1 9.9C25.1 9.7 25.1 9.5 25.1 9.3C26.1 8.6 27 7.6 27.7 6.5L22 4.01Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <div>
                              <span className="font-medium">Twitter</span>
                              <ExternalLink className="w-3 h-3 inline-block ml-1" />
                            </div>
                          </a>
                        </div>

                        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Member Benefits</h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              Priority access to gaming stations
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              Participate in team tryouts and tournaments
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              Access to exclusive club events and workshops
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              Connect with other SEMO Esports members
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

