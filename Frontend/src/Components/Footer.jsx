const Footer = () => {
  return (
    <footer className="mt-6 bg-semoblack text-white py-12 border-t-2 border-semored">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start">
          <div className="font-bold mb-4 group cursor-pointer">
            <div className="flex items-center">
              <div className="text-semored text-3xl transition-all duration-300 group-hover:scale-110 group-hover:text-red-400">
                SE
              </div>
              <div className="text-white text-2xl transition-all duration-300 group-hover:text-gray-300">MO</div>
            </div>
            <div className="text-sm text-gray-400 mt-1 transition-all duration-300 group-hover:text-gray-300">
              ESPORTS
            </div>
          </div>
          <p className="text-sm text-gray-400 transition-all duration-300 hover:text-gray-300">
            © {new Date().getFullYear()} SEMO ESPORTS
            <br />
            All Rights Reserved
          </p>
        </div>

        {/* Middle Section */}
        <div className="text-center md:text-left">
          <h3 className="text-semored text-lg font-bold mb-4 relative inline-block">
            CONNECT WITH US
            <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-semored"></span>
          </h3>
          <p className="text-gray-400 leading-relaxed transition-all duration-300 hover:text-gray-300">
            SEMO Esports
            <br />
            1000 Towers Circle
            <br />
            Cape Girardeau, MO 63701
            <br />
            <span className="text-semored hover:underline cursor-pointer transition-all duration-300 hover:text-red-400">
              (573) 555-ESPT
            </span>
          </p>
        </div>

        {/* Right Section - Social Media */}
        <div className="text-center md:text-right">
          <h3 className="text-semored text-lg font-bold mb-4 relative inline-block">
            FOLLOW US
            <span className="absolute -bottom-1 right-0 w-12 h-0.5 bg-semored"></span>
          </h3>
          <div className="flex justify-center md:justify-end space-x-4">
            {/* Social Media Icons */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-all duration-300 hover:bg-semored hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a
              href="https://twitch.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-all duration-300 hover:bg-purple-600 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path>
              </svg>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="12" r="1"></circle>
                <circle cx="15" cy="12" r="1"></circle>
                <path d="M7.5 6.5c3.5-1 5.5-1 9 0"></path>
                <path d="M7 19c3.5 1 6.5 1 10 0"></path>
                <path d="M15.5 17.5c-3.5 1-5.5 1-9 0"></path>
                <path d="M16 6.5c-3.5-1-6.5-1-10 0"></path>
                <path d="M16.5 17.5c3.5-1 5.5-1 9 0"></path>
                <path d="M17 6.5c3.5 1 5.5 1 9 0"></path>
                <path d="M7 19c-1.5-1-3-1-5 0"></path>
                <path d="M17 6.5c1.5 1 3 1 5 0"></path>
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-all duration-300 hover:bg-red-600 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
          <div className="mt-6">
            <p className="text-gray-400 text-sm transition-all duration-300 hover:text-gray-300">
              Join our Discord community
            </p>
            <a
              href="https://discord.gg/EKDjShyEMY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-gray-800 text-white rounded transition-all duration-300 hover:bg-blue-600 hover:scale-105"
            >
              Discord Server
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

