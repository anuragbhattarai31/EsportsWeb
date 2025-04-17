"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { format } from "date-fns"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeReservations: 0,
    pendingRequests: 0,
  })

  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [registrations, setRegistrations] = useState([])
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [approvedMembers, setApprovedMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)

  // New states for device/booking management
  const [devices, setDevices] = useState([])
  const [bookings, setBookings] = useState([])
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "PC",
    specs: "",
  })
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [newPlayer, setNewPlayer] = useState({
    player_name: "",
    role: "",
    student_id: "",
  })
  const navigate = useNavigate()

  const fetchApprovedMembers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/club-registrations/admin/approved", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await response.json()
      setApprovedMembers(data)
    } catch (error) {
      console.error("Failed to fetch members:", error)
    } finally {
      setLoadingMembers(false)
    }
  }

  // Add new fetch function
  const fetchRegistrations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/club-registrations/admin/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await response.json()
      setRegistrations(data)
    } catch (error) {
      console.error("Failed to fetch registrations:", error)
    }
  }
  const fetchTeams = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teams", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await response.json()
      console.log("Teams data:", data) // Debugging line
      setTeams(data)
    } catch (error) {
      console.error("Failed to fetch teams:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  // Update fetchDevicesAndBookings function+----+
  const fetchDevicesAndBookings = async () => {
    try {
      setLoadingBookings(true)
      const token = localStorage.getItem("token")

      const [devRes, bookRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/devices", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      // Handle non-OK responses
      if (!devRes.ok) throw new Error("Devices fetch failed")
      if (!bookRes.ok) throw new Error("Bookings fetch failed")

      const devicesData = await devRes.json()
      const bookingsData = await bookRes.json()

      setDevices(devicesData)
      setBookings(bookingsData)
    } catch (error) {
      console.error("Fetch error:", error)
      // Set empty arrays as fallback
      setDevices([])
      setBookings([])
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleAddDevice = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newDevice),
      })

      if (response.ok) {
        const newDeviceData = await response.json()
        setDevices([...devices, newDeviceData])
        setNewDevice({ name: "", type: "PC", specs: "" })
      }
    } catch (error) {
      console.error("Failed to add device:", error)
    }
  }

  const handleToggleDevice = async (deviceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/devices/${deviceId}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.ok) {
        setDevices(
          devices.map((device) => (device.id === deviceId ? { ...device, is_active: !device.is_active } : device)),
        )
      }
    } catch (error) {
      console.error("Failed to toggle device:", error)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.ok) {
        setBookings(bookings.filter((booking) => booking.id !== bookingId))
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error)
    }
  }

  const handleDeleteDevice = async (deviceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/devices/${deviceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.ok) {
        setDevices(devices.filter((device) => device.id !== deviceId))
      }
    } catch (error) {
      console.error("Failed to delete device:", error)
    }
  }

  const handleDeleteNews = async (newsId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/${newsId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        setNews(news.filter((item) => item.id !== newsId))
      }
    } catch (error) {
      console.error("Failed to delete news:", error)
    }
  }

  // Add new handler function
  const handleRegistrationDecision = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/club-registrations/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setRegistrations(registrations.filter((reg) => reg.id !== id))
        fetchStats() // Refresh stats
      }
    } catch (error) {
      console.error("Failed to update registration:", error)
    }
  }

  const handleAddPlayer = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5000/api/teams/${selectedTeam}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          // Try both field name variations
          name: newPlayer.player_name, // Most common backend expectation
          player_name: newPlayer.player_name,
          role: newPlayer.role,
          student_id: newPlayer.student_id,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add player")
      }

      // Update state safely
      setTeams(
        teams.map((team) =>
          team.id === selectedTeam
            ? {
                ...team,
                players: Array.isArray(team.players) ? [...team.players, responseData] : [responseData],
              }
            : team,
        ),
      )
      setNewPlayer({ player_name: "", role: "", student_id: "" })
    } catch (error) {
      console.error("Failed to add player:", error)
      alert(`Error: ${error.message}`)
    }
  }

  const handleRemovePlayer = async (playerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teams/${selectedTeam}/players/${playerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.ok) {
        setTeams(
          teams.map((team) => {
            if (team.id === selectedTeam) {
              return {
                ...team,
                players: team.players.filter((p) => p.id !== playerId),
              }
            }
            return team
          }),
        )
      }
    } catch (error) {
      console.error("Failed to remove player:", error)
    }
  }

  // Add state
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  })

  // Add fetch function
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    }
  }

  // Add to useEffect
  fetchEvents()

  // Add event handlers
  const handleCreateEvent = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newEvent),
      })

      if (response.ok) {
        const createdEvent = await response.json()
        setEvents([...events, createdEvent])
        setNewEvent({ title: "", date: "", location: "", description: "" })
      }
    } catch (error) {
      console.error("Event creation failed:", error)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId))
      }
    } catch (error) {
      console.error("Failed to delete event:", error)
    }
  }

  // Add new state
  const [news, setNews] = useState([])
  const [newNews, setNewNews] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: null,
  })

  // Add fetch function
  const fetchNews = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/news")
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error("Failed to fetch news:", error)
    }
  }

  // Add form submit handler
  const handleNewsSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", newNews.title)
    formData.append("excerpt", newNews.excerpt)
    formData.append("content", newNews.content)
    if (newNews.image) formData.append("image", newNews.image)

    try {
      const response = await fetch("http://localhost:5000/api/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      if (response.ok) {
        const createdNews = await response.json()
        setNews([createdNews, ...news])
        setNewNews({ title: "", excerpt: "", content: "", image: null })
      }
    } catch (error) {
      console.error("News creation failed:", error)
    }
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token")
      if (!token) return navigate("/login")

      try {
        const decoded = jwtDecode(token)
        if (decoded.role !== "admin") {
          navigate("/dashboard")
          return
        }

        const response = await fetch("http://localhost:5000/api/auth/adminDashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 403) {
          navigate("/unauthorized")
          return
        }

        const data = await response.json()
        if (response.ok) {
          setDashboardData(data)
          fetchStats()
          fetchDevicesAndBookings()
          fetchRegistrations()
          fetchApprovedMembers()
          setLoadingStats(false)
          fetchTeams()
          fetchNews()
        } else {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } catch (error) {
        console.error("Admin dashboard error:", error)
        navigate("/login")
      }
    }

    fetchDashboard()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-semoblack to-dark-200">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        {dashboardData ? (
          <div className="space-y-8">
            {/* Header Card */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-dark-300 to-dark-200 p-8 border-b border-gray-700/30">
                <h1 className="text-3xl font-bold text-white mb-2 font-gaming">
                  ADMIN <span className="text-semored">DASHBOARD</span>
                </h1>
                <p className="text-gray-400">Welcome back to admin dashboard</p>
              </div>

              {/* Stats Section */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-dark-100 to-dark-200 p-6 rounded-lg border border-gray-700/30 shadow-inner">
                    <h3 className="text-gray-400 font-medium mb-2 text-sm">TOTAL USERS</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">{stats.totalUsers}</span>
                      <span className="text-semored ml-2 text-sm">+5%</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-dark-100 to-dark-200 p-6 rounded-lg border border-gray-700/30 shadow-inner">
                    <h3 className="text-gray-400 font-medium mb-2 text-sm">ACTIVE RESERVATIONS</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">{stats.activeReservations}</span>
                      <span className="text-green-500 ml-2 text-sm">+12%</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-dark-100 to-dark-200 p-6 rounded-lg border border-gray-700/30 shadow-inner">
                    <h3 className="text-gray-400 font-medium mb-2 text-sm">PENDING REQUESTS</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">{stats.pendingRequests}</span>
                      <span className="text-yellow-500 ml-2 text-sm">+3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Club Registrations Section */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  CLUB <span className="text-semored">REGISTRATIONS</span>
                </h2>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-medium mb-4 text-semored font-gaming">PENDING REGISTRATIONS</h4>
                {registrations.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No pending registrations</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">SEMO ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((reg) => (
                          <tr key={reg.id} className="border-t border-gray-700/20 hover:bg-dark-200/50">
                            <td className="px-4 py-3 text-white">{reg.full_name}</td>
                            <td className="px-4 py-3 text-white">{reg.semo_id}</td>
                            <td className="px-4 py-3 text-white">{reg.email}</td>
                            <td className="px-4 py-3 space-x-2">
                              <button
                                onClick={() => handleRegistrationDecision(reg.id, "approved")}
                                className="px-3 py-1 text-xs bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRegistrationDecision(reg.id, "rejected")}
                                className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Club Members Section */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  CLUB <span className="text-semored">MEMBERS</span>
                </h2>
              </div>
              <div className="p-6">
                {loadingMembers ? (
                  <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-semored/30 border-t-semored rounded-full animate-spin"></div>
                  </div>
                ) : approvedMembers.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">No approved members found</div>
                ) : (
                  <>
                    <h4 className="text-lg font-medium mb-4 text-semored font-gaming">APPROVED MEMBERS</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-dark-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">SEMO ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Registration Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {approvedMembers.map((member) => (
                            <tr key={member.id} className="border-t border-gray-700/20 hover:bg-dark-200/50">
                              <td className="px-4 py-3 text-white">{member.full_name}</td>
                              <td className="px-4 py-3 text-white">{member.semo_id}</td>
                              <td className="px-4 py-3 text-white">{member.email}</td>
                              <td className="px-4 py-3 text-white">
                                {format(new Date(member.created_at), "MMM d, yyyy HH:mm")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Team Management Section */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  TEAM <span className="text-semored">MANAGEMENT</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <select
                      className="p-3 bg-dark-300 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-semored focus:border-transparent transition-all"
                      value={selectedTeam || ""}
                      onChange={(e) => setSelectedTeam(Number(e.target.value))}
                    >
                      <option value="">Select Team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.game_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTeam && (
                    <form
                      onSubmit={handleAddPlayer}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-dark-300/50 p-4 rounded-lg"
                    >
                      <input
                        type="text"
                        placeholder="Player Name"
                        className="p-3 bg-dark-300 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-semored focus:border-transparent transition-all"
                        value={newPlayer.player_name}
                        onChange={(e) => setNewPlayer({ ...newPlayer, player_name: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        className="p-3 bg-dark-300 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-semored focus:border-transparent transition-all"
                        value={newPlayer.role}
                        onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })}
                        required
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Student ID"
                          className="p-3 flex-1 bg-dark-300 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-semored focus:border-transparent transition-all"
                          value={newPlayer.student_id}
                          onChange={(e) => setNewPlayer({ ...newPlayer, student_id: e.target.value })}
                          required
                        />
                        <button
                          type="submit"
                          className="px-4 bg-semored text-white rounded-md hover:bg-semored/90 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {selectedTeam && (
                  <div className="bg-dark-300/30 rounded-lg border border-gray-700/30 p-6">
                    <h4 className="text-lg font-medium mb-4 text-semored font-gaming">CURRENT TEAM ROSTER</h4>
                    <div className="space-y-3">
                      {teams.find((t) => t.id === selectedTeam)?.players?.length > 0 ? (
                        teams
                          .find((t) => t.id === selectedTeam)
                          .players.map((player) => (
                            <div
                              key={player.id}
                              className="flex justify-between items-center bg-dark-200 p-4 rounded-lg border border-gray-700/20"
                            >
                              <div>
                                <span className="font-medium text-white">{player.player_name || player.name}</span>
                                <span className="text-gray-400 ml-4">{player.role}</span>
                                <span className="text-gray-500 ml-4">#{player.student_id}</span>
                              </div>
                              <button
                                onClick={() => handleRemovePlayer(player.id)}
                                className="text-semored hover:text-red-400 transition-colors p-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">No players in this team</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Device Management Section */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  DEVICE <span className="text-semored">MANAGEMENT</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Add Device Form */}
                  <div className="md:col-span-1">
                    <div className="bg-dark-300/30 rounded-lg border border-gray-700/30 p-6">
                      <h4 className="text-lg font-medium mb-4 text-semored font-gaming">ADD NEW DEVICE</h4>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Device Name"
                          className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-semored focus:border-transparent transition-all"
                          value={newDevice.name}
                          onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Device Specs (e.g., CPU, GPU)"
                          className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-semored focus:border-transparent transition-all"
                          value={newDevice.specs}
                          onChange={(e) => setNewDevice({ ...newDevice, specs: e.target.value })}
                        />
                        <select
                          className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-semored focus:border-transparent transition-all"
                          value={newDevice.type}
                          onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                        >
                          <option value="PC">PC</option>
                          <option value="Console">Console</option>
                        </select>
                        <button
                          onClick={handleAddDevice}
                          className="w-full p-3 bg-semored text-white rounded-md hover:bg-semored/90 transition-colors"
                        >
                          Add Device
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Devices List */}
                  <div className="md:col-span-2">
                    <div className="bg-dark-300/30 rounded-lg border border-gray-700/30 p-6">
                      <h4 className="text-lg font-medium mb-4 text-semored font-gaming">ALL DEVICES</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-dark-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {devices.map((device) => (
                              <tr key={device.id} className="border-t border-gray-700/20 hover:bg-dark-200/50">
                                <td className="px-4 py-3 text-white">{device.name}</td>
                                <td className="px-4 py-3 text-white">{device.type}</td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      device.is_active
                                        ? "bg-green-600/20 text-green-400"
                                        : "bg-yellow-600/20 text-yellow-400"
                                    }`}
                                  >
                                    {device.is_active ? "Active" : "Maintenance"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 space-x-2">
                                  <button
                                    onClick={() => handleToggleDevice(device.id)}
                                    className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                                  >
                                    {device.is_active ? "Deactivate" : "Activate"}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDevice(device.id)}
                                    className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
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
              </div>
            </div>

            {/* Booking Management Section */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  BOOKING <span className="text-semored">MANAGEMENT</span>
                </h2>
              </div>
              <div className="p-6">
                {loadingBookings ? (
                  <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-semored/30 border-t-semored rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    {bookings.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">No active bookings found</div>
                    ) : (
                      <>
                        <h4 className="text-lg font-medium mb-4 text-semored font-gaming">CURRENT BOOKINGS</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-dark-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">User</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Device</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Start Time</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">End Time</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bookings.map((booking) => (
                                <tr key={booking.id} className="border-t border-gray-700/20 hover:bg-dark-200/50">
                                  <td className="px-4 py-3 text-white">{booking.email}</td>
                                  <td className="px-4 py-3 text-white">{booking.device_name}</td>
                                  <td className="px-4 py-3 text-white">
                                    {format(new Date(booking.start_time), "MMM d, yyyy HH:mm")}
                                  </td>
                                  <td className="px-4 py-3 text-white">
                                    {format(new Date(booking.end_time), "MMM d, yyyy HH:mm")}
                                  </td>
                                  <td className="px-4 py-3">
                                    <button
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
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
              </div>
            </div>

            {/* News Management Section */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  NEWS <span className="text-semored">MANAGEMENT</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4 text-semored font-gaming">CREATE NEWS</h4>
                    <form onSubmit={handleNewsSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="News Title"
                        className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md"
                        value={newNews.title}
                        onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                        required
                      />
                      <textarea
                        placeholder="Excerpt"
                        className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md"
                        value={newNews.excerpt}
                        onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                      />
                      <textarea
                        placeholder="Content"
                        className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md h-32"
                        value={newNews.content}
                        onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                        required
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewNews({ ...newNews, image: e.target.files[0] })}
                        className="text-white"
                      />
                      <button type="submit" className="px-4 py-2 bg-semored text-white rounded-md hover:bg-semored/90">
                        Publish News
                      </button>
                    </form>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-4 text-semored font-gaming">EXISTING NEWS</h4>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {news.map((item) => (
                        <div
                          key={item.id}
                          className="bg-dark-200 p-4 rounded-lg border border-gray-700/30 flex justify-between items-center"
                        >
                          <div>
                            <h5 className="text-white font-medium">{item.title}</h5>
                            <p className="text-gray-400 text-sm mt-2">{item.excerpt}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteNews(item.id)}
                            className="text-red-500 hover:text-red-400 p-2 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Events Management Section */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  EVENT <span className="text-semored">MANAGEMENT</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4 text-semored font-gaming">CREATE NEW EVENT</h4>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Event Title"
                        className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        required
                      />
                      <input
                        type="datetime-local"
                        className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        required
                      />
                      <textarea
                        placeholder="Description"
                        className="w-full p-3 bg-dark-300 text-white border border-gray-700 rounded-md"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      />
                      <button type="submit" className="px-4 py-2 bg-semored text-white rounded-md hover:bg-semored/90">
                        Create Event
                      </button>
                    </form>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-4 text-semored font-gaming">UPCOMING EVENTS</h4>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="bg-dark-200 p-4 rounded-lg border border-gray-700/30 flex justify-between items-center"
                        >
                          <div>
                            <h5 className="text-white font-medium">{event.title}</h5>
                            <p className="text-gray-400 text-sm mt-2">
                              {new Date(event.date).toLocaleDateString()} - {event.location}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-500 hover:text-red-400 p-2 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-semored/30 border-t-semored rounded-full animate-spin mb-6"></div>
            <p className="text-gray-400">Loading admin dashboard...</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default AdminDashboard
