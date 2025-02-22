import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="pt-16"> {/* Adjust padding to match the height of the header */}
        {children}
      </main>
    </div>
  );
};

export default Layout;