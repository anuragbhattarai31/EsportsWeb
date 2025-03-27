"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, Menu, X } from "lucide-react"

const Header = () => {
  const [username, setUsername] = useState("")
  const [isGamesOpen, setIsGamesOpen] = useState(false)
  const [isTeamsOpen, setIsTeamsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    // Redirect to login
    window.location.href = "/login"
  }

  useEffect(() => {
    // Attempt to fetch user details if token exists
    const token = localStorage.getItem("token")
    if (!token) return

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          // If token is invalid (401, etc.), remove and reload
          if (response.status === 401) {
            localStorage.removeItem("token")
            window.location.reload()
          }
          return
        }
        const data = await response.json()
        setUsername(data.username)
      } catch (err) {
        console.error("Error fetching user details:", err)
      }
    }

    fetchUserDetails()
  }, [])

  return (
    <header className="fixed top-0 left-0 w-full bg-semoblack/90 backdrop-blur-sm text-white z-50 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand: clicking goes to landing page ("/") */}
        <Link
          to="/"
          className="flex items-center space-x-1 transition-all duration-300 hover:scale-105 hover:text-semored"
        >
          <div className="text-semored text-2xl font-bold leading-5 transition-all duration-300">SE</div>
          <div className="text-white text-2xl font-bold leading-5 transition-all duration-300">MO</div>
          <span className="text-sm ml-2 text-gray-300 hidden sm:inline-block transition-all duration-300">Esports</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {/* GAMES Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsGamesOpen(true)}
            onMouseLeave={() => setIsGamesOpen(false)}
          >
            <span className="cursor-pointer hover:text-semored transition-colors flex items-center">
              Games
              <ChevronDown className="ml-1 h-4 w-4" />
            </span>
            <div
              className={`
                absolute top-full left-0 mt-2 w-44 bg-semoblack/95 backdrop-blur-sm border border-gray-700 rounded shadow-lg py-2
                transition-all duration-300 transform origin-top
                ${isGamesOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
              `}
            >
              <Link
                to="/games/valorant"
                className="block px-4 py-2 text-sm hover:text-semored hover:bg-gray-800 transition-colors"
              >
                Valorant
              </Link>
              <Link
                to="/games/rocket-league"
                className="block px-4 py-2 text-sm hover:text-semored hover:bg-gray-800 transition-colors"
              >
                Rocket League
              </Link>
              <Link
                to="/games/league-of-legends"
                className="block px-4 py-2 text-sm hover:text-semored hover:bg-gray-800 transition-colors"
              >
                League of Legends
              </Link>
              <Link
                to="/games/csgo"
                className="block px-4 py-2 text-sm hover:text-semored hover:bg-gray-800 transition-colors"
              >
                Counter-Strike 2
              </Link>
            </div>
          </div>

          {/* TEAMS Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsTeamsOpen(true)}
            onMouseLeave={() => setIsTeamsOpen(false)}
          >
            <span className="cursor-pointer hover:text-semored transition-colors flex items-center">
              Teams
              <ChevronDown className="ml-1 h-4 w-4" />
            </span>
            <div
              className={`
                absolute top-full left-0 mt-2 w-44 bg-semoblack/95 backdrop-blur-sm border border-gray-700 rounded shadow-lg py-2
                transition-all duration-300 transform origin-top
                ${isTeamsOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
              `}
            >
              <Link
                to="/teams/apply"
                className="block px-4 py-2 text-sm hover:text-semored hover:bg-gray-800 transition-colors"
              >
                Apply
              </Link>
              <Link
                to="/teams/standings"
                className="block px-4 py-2 text-sm hover:text-semored hover:bg-gray-800 transition-colors"
              >
                Standings
              </Link>
              <Link
                to="/teams/tournaments"
                className="block px-4 py-2 text-sm hover:text-semored hover:bg-gray-800 transition-colors"
              >
                Tournaments
              </Link>
            </div>
          </div>

          <Link
            to="/news"
            className="hover:text-semored transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-semored hover:after:w-full after:transition-all after:duration-300"
          >
            News
          </Link>

          <Link
            to="/events"
            className="hover:text-semored transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-semored hover:after:w-full after:transition-all after:duration-300"
          >
            Events
          </Link>
        </nav>

        {/* Right Side */}
        <div className="hidden md:block text-sm font-medium">
          {username ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-200">Hello, {username}</span>
              <button onClick={handleLogout} className="hover:text-semored focus:outline-none transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-semored focus:outline-none transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-semored hover:bg-red-700 px-4 py-2 rounded-md transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-semoblack/95 backdrop-blur-sm border-t border-gray-800 
        transition-all duration-300 transform ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <div className="px-4 py-3 space-y-3">
          <Link to="/games" className="block py-2 hover:text-semored">
            Games
          </Link>
          <Link to="/teams" className="block py-2 hover:text-semored">
            Teams
          </Link>
          <Link to="/news" className="block py-2 hover:text-semored">
            News
          </Link>
          <Link to="/events" className="block py-2 hover:text-semored">
            Events
          </Link>

          <div className="pt-3 border-t border-gray-800">
            {username ? (
              <>
                <span className="block py-2 text-gray-400">Hello, {username}</span>
                <button onClick={handleLogout} className="block py-2 w-full text-left hover:text-semored">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-semored">
                  Login
                </Link>
                <Link to="/register" className="block py-2 hover:text-semored">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

