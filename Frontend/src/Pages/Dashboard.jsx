"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

// Simple embedded calendar component
const EmbeddedCalendar = ({
  selectedDate,
  onDateSelect,
  minDate,
  activeTimeSelector,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Create calendar days array
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null) // Empty cells for days before the 1st
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  // Format date for comparison
  const formatDateForComparison = (date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }

  // Check if a day is selected
  const isSelected = (day) => {
    if (!day || !selectedDate) return false
    const dayDate = new Date(year, month, day)
    return formatDateForComparison(dayDate) === formatDateForComparison(selectedDate)
  }

  // Check if a day is in the past
  const isPast = (day) => {
    if (!day) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayDate = new Date(year, month, day)
    return dayDate < today
  }

  // Handle month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  // Handle day selection
  const handleDayClick = (day) => {
    if (!day || isPast(day)) return
    try {
      if (activeTimeSelector === "start") {
        const newDate = new Date(startTime)
        newDate.setFullYear(year, month, day)
        setStartTime(newDate)
      } else {
        const newDate = new Date(endTime)
        newDate.setFullYear(year, month, day)
        setEndTime(newDate)
      }
    } catch (err) {
      console.error("Error setting date:", err)
    }
  }

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className="bg-dark-300 border border-gray-700 rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 rounded-md hover:bg-dark-200 text-gray-400">
          &lt;
        </button>
        <h3 className="text-white font-medium">
          {currentMonth.toLocaleString("default", { month: "long" })} {year}
        </h3>
        <button onClick={nextMonth} className="p-1 rounded-md hover:bg-dark-200 text-gray-400">
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(day)}
            className={`
              h-8 w-8 flex items-center justify-center rounded-md text-sm
              ${!day ? "invisible" : isPast(day) ? "text-gray-600 cursor-not-allowed" : "cursor-pointer hover:bg-semored/20"}
              ${isSelected(day) ? "bg-semored text-white" : ""}
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [registrationStatus, setRegistrationStatus] = useState("")
  const [dashboardData, setDashboardData] = useState(null)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [availableDevices, setAvailableDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [userBookings, setUserBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTimeSelector, setActiveTimeSelector] = useState("start") // "start" or "end"
  const navigate = useNavigate()

  // Update end time when start time changes to maintain minimum 30 min difference
  useEffect(() => {
    const minEndTime = new Date(startTime.getTime() + 30 * 60000) // 30 minutes later
    if (endTime < minEndTime) {
      setEndTime(minEndTime)
    }
  }, [startTime])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    try {
      if (activeTimeSelector === "start") {
        const newStartTime = new Date(startTime)
        newStartTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
        setStartTime(newStartTime)
      } else {
        const newEndTime = new Date(endTime)
        newEndTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
        setEndTime(newEndTime)
      }
    } catch (err) {
      console.error("Error in date selection:", err)
    }
  }

  //FETCH-BOOKINGS Function
  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings/my-bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("HTTP error! status: ${response.status}")
      }

      const data = await response.json()
      setUserBookings(data.bookings || [])
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
      setError("Failed to load bookings")
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

  ///CREATE-BOOKING Function
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
    } catch (error) {
      console.error("Booking failed:", error)
      setError(error.message || "Failed to create booking")
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

  //CANCEL-BOOKING Function
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
    } catch (error) {
      console.error("Cancel failed:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-semoblack to-dark-200">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
        {/* Dashboard Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold font-gaming text-white">
            PLAYER <span className="text-semored">DASHBOARD</span>
          </h1>
          <p className="mt-2 text-gray-400">Manage your bookings and club membership status</p>
        </div>

        {/* Registration Status Section */}
        {registrationStatus && registrationStatus !== "approved" && (
          <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
              <h2 className="text-2xl font-bold font-gaming text-white">CLUB MEMBERSHIP</h2>
            </div>
            <div className="p-6">
              {registrationStatus === "not_registered" ? (
                <div className="text-center py-6">
                  <p className="mb-6 text-gray-300">
                    Ready to join the SEMO Esports Club? Register today to access exclusive benefits and events!
                  </p>
                  <button
                    onClick={() => navigate("/club-registration")}
                    className="px-8 py-3 bg-semored text-white rounded-md hover:bg-semored/90 transition-colors button-glow"
                  >
                    REGISTER FOR CLUB
                  </button>
                </div>
              ) : registrationStatus === "error" ? (
                <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-md">
                  <p className="text-red-400 text-center">Error checking registration status</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xl text-gray-300 mb-4">
                    Your club registration status:
                    <span
                      className={`ml-3 px-4 py-1 rounded-full text-sm ${
                        registrationStatus === "pending"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {registrationStatus.toUpperCase()}
                    </span>
                  </p>
                  {registrationStatus === "pending" && (
                    <p className="text-gray-400 text-sm">
                      Your application is being reviewed. You'll be notified once it's approved.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approved Member Section */}
        {registrationStatus === "approved" && (
          <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600/20 to-transparent p-6 border-b border-gray-700/30">
              <h2 className="text-2xl font-bold font-gaming text-white">
                CLUB <span className="text-green-400">MEMBERSHIP</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-xl text-gray-300 mb-2">
                    Your club registration status:
                    <span className="ml-3 px-4 py-1 rounded-full text-sm bg-green-600/20 text-green-400">APPROVED</span>
                  </p>
                  <p className="text-gray-400">
                    Welcome to the SEMO Esports community! Join our channels to stay connected.
                  </p>
                </div>
                <div className="flex gap-4">
                  <a
                    href="https://www.twitch.tv/semoesports"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#6441a5] text-white rounded-md hover:bg-[#7d5bbe] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"></path>
                    </svg>
                    <span>Twitch</span>
                  </a>
                  <a
                    href="https://discord.gg/EKDjShyEMY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] text-white rounded-md hover:bg-[#6975f3] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                    </svg>
                    <span>Discord</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Section */}
        <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
            <h2 className="text-2xl font-bold font-gaming text-white">
              BOOK <span className="text-semored">EQUIPMENT</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side - Time inputs */}
              <div className="w-full md:w-1/2 space-y-6">
                {/* Start Time */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    activeTimeSelector === "start"
                      ? "border-semored bg-semored/10"
                      : "border-gray-700/30 bg-dark-300/50 hover:border-semored/50"
                  }`}
                  onClick={() => setActiveTimeSelector("start")}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">START TIME</label>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-medium text-white">{format(startTime, "MMM d, yyyy")}</div>
                    <input
                      type="time"
                      value={`${startTime.getHours().toString().padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}`}
                      onChange={(e) => {
                        try {
                          const newDate = new Date(startTime)
                          const [hours, minutes] = e.target.value.split(":")
                          if (hours && minutes) {
                            newDate.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10))
                            setStartTime(newDate)
                          }
                        } catch (err) {
                          console.error("Error setting start time:", err)
                          // Don't update state if there's an error
                        }
                      }}
                      className="p-2 bg-dark-200 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-semored focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* End Time */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    activeTimeSelector === "end"
                      ? "border-semored bg-semored/10"
                      : "border-gray-700/30 bg-dark-300/50 hover:border-semored/50"
                  }`}
                  onClick={() => setActiveTimeSelector("end")}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">END TIME</label>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-medium text-white">{format(endTime, "MMM d, yyyy")}</div>
                    <input
                      type="time"
                      value={`${endTime.getHours().toString().padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`}
                      onChange={(e) => {
                        try {
                          const newDate = new Date(endTime)
                          const [hours, minutes] = e.target.value.split(":")
                          if (hours && minutes) {
                            newDate.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10))
                            setEndTime(newDate)
                          }
                        } catch (err) {
                          console.error("Error setting end time:", err)
                          // Don't update state if there's an error
                        }
                      }}
                      className="p-2 bg-dark-200 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-semored focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Duration Display */}
                <div className="p-4 rounded-lg border border-gray-700/30 bg-dark-300/50">
                  <label className="block text-sm font-medium text-gray-300 mb-2">BOOKING DURATION</label>
                  <div className="text-xl font-medium text-white">
                    {Math.floor((endTime - startTime) / (1000 * 60))} minutes
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-md">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={checkAvailability}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-semored text-white rounded-md hover:bg-semored/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      CHECKING...
                    </span>
                  ) : (
                    "CHECK AVAILABILITY"
                  )}
                </button>
              </div>

              {/* Right side - Calendar */}
              <div className="w-full md:w-1/2">
                <EmbeddedCalendar
                  selectedDate={activeTimeSelector === "start" ? startTime : endTime}
                  onDateSelect={handleDateSelect}
                  minDate={activeTimeSelector === "end" ? startTime : new Date()}
                  activeTimeSelector={activeTimeSelector}
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTime={endTime}
                  setEndTime={setEndTime}
                />
              </div>
            </div>

            {availableDevices.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-semored font-gaming">AVAILABLE DEVICES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDevices.map((device) => (
                    <div
                      key={device.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedDevice === device.id
                          ? "border-semored bg-semored/10"
                          : "border-gray-700/30 bg-dark-300/50 hover:border-semored/50"
                      }`}
                      onClick={() => setSelectedDevice(Number(device.id))}
                    >
                      <h4 className="font-medium text-white">{device.name}</h4>
                      <p className="text-sm text-gray-400">{device.type}</p>
                      <p className="text-xs text-gray-500 mt-2">{device.specs}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={createBooking}
                  disabled={!selectedDevice || loading}
                  className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors w-full"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      PROCESSING...
                    </span>
                  ) : (
                    "CONFIRM BOOKING"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Your Bookings Section */}
        <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
            <h2 className="text-2xl font-bold font-gaming text-white">
              YOUR <span className="text-semored">BOOKINGS</span>
            </h2>
          </div>
          <div className="p-6">
            {userBookings.length > 0 ? (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="bg-dark-300/50 border border-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <h4 className="font-medium text-white text-lg">{booking.name}</h4>
                        <p className="text-gray-400">{booking.type}</p>
                        <p className="text-sm text-gray-500 mt-1">{booking.specs}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">
                          {format(new Date(booking.start_time), "MMM d, yyyy")}
                          <span className="mx-1">•</span>
                          {format(new Date(booking.start_time), "h:mm a")} -
                          {format(new Date(booking.end_time), "h:mm a")}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400">
                            {booking.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelBooking(booking.id)
                            }}
                            className="text-xs px-3 py-1 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition-colors"
                            disabled={loading}
                          >
                            {loading ? "Cancelling..." : "Cancel"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>No upcoming bookings</p>
                <p className="text-sm mt-2">Book equipment above to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
