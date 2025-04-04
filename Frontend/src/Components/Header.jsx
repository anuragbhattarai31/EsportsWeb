"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [scrolled, setScrolled] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const handleMouseEnter = () => setIsDropdownOpen(true)
  const handleMouseLeave = () => setTimeout(() => setIsDropdownOpen(false), 200)
  const handleUserMouseEnter = () => setIsUserDropdownOpen(true)
  const handleUserMouseLeave = () => setIsUserDropdownOpen(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const response = await fetch("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token")
            window.location.reload()
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setUsername(data.username)
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }

    fetchUserDetails()
  }, [])

  return (
    <header
      className={`w-full py-3 px-4 fixed top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-red-950 via-[#1a1f2b] to-[#0f1319] shadow-lg"
          : "bg-gradient-to-r from-red-900/90 via-[#1a1f2b]/80 to-[#0f1319]/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
        {/* Logo */}
        <div className="flex items-center space-x-4 ml-4">
        <img
    src="/images/semo logo.png"
    alt="Semo Logo"
    className="w-20 h-20 object-contain transition-transform duration-500 hover:scale-110 hover:rotate-3 hover:drop-shadow-[0_0_20px_rgba(255,0,0,0.6)]"
  />
  <div className="font-esports text-4xl font-bold italic flex items-center space-x-2">
    <span className="text-semored drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)] hover:scale-110 hover:-skew-x-6 transition-transform duration-300 ease-in-out">
      GO
    </span>
    <span className="text-white drop-shadow-[2px_2px_0_rgba(255,0,0,0.5)] hover:scale-105 hover:skew-x-6 transition-transform duration-300 ease-in-out">
      REDHAWKS
    </span>
  </div>


     {/* Dropdown */}
          <div
            className={`absolute top-full left-0 min-w-[700px] glassmorphism text-white p-6 rounded-lg transition-all duration-300 ease-out ${
              isDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-3 gap-10">
              {/* Games */}
              <div>
                <h3 className="font-gaming text-lg text-semored pb-4 border-b border-gray-600/50">Games</h3>
                <div className="space-y-1 mt-2">
                  {["Valorant", "Rocket League", "CSGO", "Rainbow Six Siege", "League of Legends", "Genshin Impact"].map(
                    (game) => (
                      <a
                        key={game}
                        href="#"
                        className="block py-2 px-3 hover:bg-dark-100 rounded-md transition-colors hover:text-semored flex items-center"
                      >
                        <span className="w-2 h-2 bg-semored rounded-full mr-2 opacity-70"></span>
                        {game}
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* Teams */}
              <div>
                <h3 className="font-gaming text-lg text-semored pb-4 border-b border-gray-600/50">Teams</h3>
                <div className="space-y-1 mt-2">
                  {["Apply to the Team", "Tournament Standings", "Teams"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block py-2 px-3 hover:bg-dark-100 rounded-md transition-colors hover:text-semored flex items-center"
                    >
                      <span className="w-2 h-2 bg-semored rounded-full mr-2 opacity-70"></span>
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Others */}
              <div>
                <h3 className="font-gaming text-lg text-semored pb-4 border-b border-gray-600/50">Others</h3>
                <div className="space-y-1 mt-2">
                  {["News", "Contact Us"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block py-2 px-3 hover:bg-dark-100 rounded-md transition-colors hover:text-semored flex items-center"
                    >
                      <span className="w-2 h-2 bg-semored rounded-full mr-2 opacity-70"></span>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav & User Area */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {["Home", "Teams", "Events", "News"].map((nav) => (
              <Link
                key={nav}
                to="#"
                className="hover:text-semored transition-colors hover:underline underline-offset-4"
              >
                {nav}
              </Link>
            ))}
          </nav>

          {/* User Avatar */}
          <div className="relative" onMouseEnter={handleUserMouseEnter} onMouseLeave={handleUserMouseLeave}>
            <div className="flex items-center cursor-pointer bg-dark-200 px-3 py-1.5 rounded-md hover:bg-dark-100 transition-colors">
              <div className="w-8 h-8 bg-semored/20 rounded-full flex items-center justify-center mr-2">
                <span className="font-bold text-semored">{username ? username.charAt(0).toUpperCase() : "G"}</span>
              </div>
              <span>{username || "Guest"}</span>
            </div>
            <div
              className={`absolute top-full right-0 min-w-[180px] glassmorphism text-white p-2 rounded-lg shadow-lg transition-all duration-300 ease-out ${
                isUserDropdownOpen
                  ? "scale-100 opacity-100 translate-y-2"
                  : "scale-95 opacity-0 translate-y-0 pointer-events-none"
              }`}
            >
              <Link to="#" className="block py-2 px-3 hover:bg-dark-100 rounded-md transition-colors hover:text-semored">
                Profile
              </Link>
              <Link to="#" className="block py-2 px-3 hover:bg-dark-100 rounded-md transition-colors hover:text-semored">
                Settings
              </Link>
              <div className="my-1 border-t border-gray-700/50"></div>
              <a
                href="#"
                className="block py-2 px-3 hover:bg-semored/10 rounded-md transition-colors text-semored hover:bg-semored/20"
                onClick={handleLogout}
              >
                Logout
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-semoblack/95 z-50 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="font-esports text-5xl font-bold mb-12">
            <span className="text-semored">SE</span>
            <span className="text-white">MO</span>
          </div>
          <nav className="flex flex-col gap-6 text-center text-xl font-medium">
            {["Home", "Teams", "Events", "News"].map((item) => (
              <Link key={item} to="#" className="hover:text-semored" onClick={toggleMenu}>
                {item}
              </Link>
            ))}
            {username ? (
              <>
                <Link to="#" className="hover:text-semored" onClick={toggleMenu}>
                  Profile
                </Link>
                <a
                  href="#"
                  className="text-semored"
                  onClick={(e) => {
                    e.preventDefault()
                    handleLogout()
                  }}
                >
                  Logout
                </a>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-semored" onClick={toggleMenu}>
                  Login
                </Link>
                <Link to="/register" className="hover:text-semored" onClick={toggleMenu}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

