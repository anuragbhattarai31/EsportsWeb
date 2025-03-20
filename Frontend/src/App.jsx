import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/register'; 
import Dashboard from './Pages/Dashboard';
import AdminDashboard from './Pages/Admin-Dashboard';
import Footer from './Components/Footer';
import Header from './Components/Header';
import LandingPage from './Pages/landingpage';
import './index.css';


const App = () => {
  return (
    <Router>
       <div className="min-h-screen flex flex-col">
        <Header/>
       <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/adminDashboard" element = {<AdminDashboard/>} />
            <Route path="/" element={< LandingPage/>} /> {/* Default route */}
          
        </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
};

export default App;