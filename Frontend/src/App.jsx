import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/register'; 
import Dashboard from './Pages/Dashboard';
import AdminDashboard from './Pages/Admin-Dashboard';
import LandingPage from './Pages/landingpage';
import ClubRegistration from './Pages/ClubRegistration';
import './index.css';
import TeamDetailsPage from './Pages/TeamDetailsPage';
import NewsDetailPage from './Pages/NewsDetailPage';


const App = () => {
  return (
    <Router>
       <div className="min-h-screen flex flex-col">
       <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/adminDashboard" element = {<AdminDashboard/>} />
            <Route path="/club-registration" element={<ClubRegistration />} />
            <Route path="/teams/:id" element={<TeamDetailsPage/>}/>
            <Route path="/news/:id" element={<NewsDetailPage/>}/>
            <Route path="/" element={< LandingPage/>} /> {/* Default route */}
          
        </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;