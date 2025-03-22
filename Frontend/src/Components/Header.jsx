import { useState, useEffect } from "react"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [username, setUsername] = useState("")

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleMouseEnter = () => {
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsDropdownOpen(false)
    }, 200)
  }

  const handleUserMouseEnter = () => {
    setIsUserDropdownOpen(true)
  }

  const handleUserMouseLeave = () => {
    setIsUserDropdownOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  useEffect(() => {
    // Update the fetchUserDetails function
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const response = await fetch("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          // Handle 401 Unauthorized (invalid token)
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
        // Handle JSON parse errors
        if (error instanceof SyntaxError) {
          console.error("Invalid JSON response from server")
        }
      }
    }

    fetchUserDetails()
  }, [])

  return (
    <header className="w-full bg-semoblack text-white py-3 px-4 fixed top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div
          className="font-bold text-center mb-1 relative cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-semored text-2xl">SE</div>
          <div className="text-white text-xl">MO</div>
          <div
            className={`absolute top-full left-0 min-w-[700px] bg-semoblack text-white p-6 rounded-lg shadow-lg transition-transform duration-150 ease-out transform origin-top ${isDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-3 gap-10">
              <div>
                <h3 className="font-bold text-lg text-gray-300 pb-4 border-b border-gray-600">Games</h3>
                <a href="#" className="block py-2 hover:text-semored">
                  Valorant
                </a>
                <a href="#" className="block py-2 hover:text-semored">
                  Rocket League
                </a>
                <a href="#" className="block py-2 hover:text-semored">
                  CSGO
                </a>
                <a href="#" className="block py-2 hover:text-semored">
                  Rainbow Six Siege
                </a>
                <a href="#" className="block py-2 hover:text-semored">
                  League of Legends
                </a>
                <a href="#" className="block py-2 hover:text-semored">
                  Genshin Impact
                </a>
              </div>
              <div>
                <h3 className=" text-lg text-gray-300 pb-4 border-b border-gray-600">Teams</h3>
                <a href="#" className="block py-2 hover:text-semored">
                  Apply to the Team
                </a>
                <a href="#" className="block py-2 hover:text-semored">
                  Tournament Standings
                </a>
                <a href="#" className="block py-2 hover:text-semored">
                  Teams
                </a>
              </div>
              <div>
                <h3 className=" text-lg text-gray-300 pb-4 border-b border-gray-600">Others</h3>
                <a href="#" className="block py-2 hover:text-semored">
                  News
                </a>
                <a href="#" className="block py-2 hover:text-semored">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="relative" onMouseEnter={handleUserMouseEnter} onMouseLeave={handleUserMouseLeave}>
          <div className="cursor-pointer">{username || "Guest"}</div>
          <div
            className={`absolute top-full right-0 min-w-[150px] bg-semoblack text-white p-4 rounded-lg shadow-lg transition-transform duration-150 easeout transform origin-top ${isUserDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
          >
            <a href="#" className="block py-2 hover:text-semored">
              Profile
            </a>
            <a href="#" className="block py-2 hover:text-red-500" onClick={handleLogout}>
              Logout
            </a>
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

