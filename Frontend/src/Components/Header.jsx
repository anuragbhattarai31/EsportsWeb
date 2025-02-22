const Header = () => {
    return (
      <header className="w-full bg-black text-white p-4 fixed top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-bold">
            <div className="text-red-500 text-2xl">SE</div>
            <div className="text-white text-xl">MO</div>
          </div>
          <nav className="space-x-6">
            <a href="/" className="hover:text-red-500">HOME</a>
            <a href="/dashboard" className="hover:text-red-500">DASHBOARD</a>
          </nav>
        </div>
      </header>
    );
  };

  export default Header;