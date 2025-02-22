import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t-3 border-red-600">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="flex flex-col items-center">
          <div className="font-bold text-center mb-4">
            <div className="text-red-600 text-4xl">SE</div>
            <div className="text-white text-3xl">MO</div>
          </div>
          <p className="text-sm text-center">
            © 2024 SEMO ESPORTS<br />
            All Rights Reserved
          </p>
        </div>

        {/* Middle Section */}
        <div className="text-center">
          <h3 className="text-red-600 text-xl font-bold mb-4">CONNECT WITH US</h3>
          <p className="leading-relaxed">
            Esports Collegiate<br />
            123 University Drive<br />
            Cape Girardeau, MO 63701<br />
            (573) 555-ESPT
          </p>
        </div>

        {/* Right Section */}
        <div className="text-center">
          <div className="mt-auto">
            <span className="block mb-2">Powered by</span>
            <div className="h-12 bg-gray-800 rounded-lg mx-auto w-32">
              {/* Add partner logo component here */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;