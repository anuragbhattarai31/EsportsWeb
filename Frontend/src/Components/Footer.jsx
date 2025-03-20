const Footer = () => {
  return (
    <footer className="bg-semoblack text-white py-8 border-t-2 border-semored">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start">
          <div className="font-bold mb-4">
            <div className="text-semored text-3xl">SE</div>
            <div className="text-white text-2xl">MO</div>
          </div>
          <p className="text-sm text-gray-300">
            © 2024 SEMO ESPORTS
            <br />
            All Rights Reserved
          </p>
        </div>

        {/* Middle Section */}
        <div className="text-center md:text-left">
          <h3 className="text-semored text-lg font-bold mb-3">CONNECT WITH US</h3>
          <p className="text-gray-300 leading-relaxed">
            SEMO Esports
            <br />
            1000 Towers Circle
            <br />
            Cape Girardeau, MO 63701
            <br />
            <span className="text-semored">(573) 555-ESPT</span>
          </p>
        </div>

        {/* Right Section */}
        <div className="text-center md:text-right">
          <div className="mt-4">
            <span className="block mb-2 text-gray-300">Powered by</span>
            <div className="h-12 bg-gray-800 rounded-lg  md:ml-auto w-32 shadow-lg">
              {/* Add partner logo component here */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer