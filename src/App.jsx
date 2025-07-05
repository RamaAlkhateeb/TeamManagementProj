import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/Login';
import Dashboard from "./pages/Dashboard";
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Dash" element={<Dashboard/>} />
          <Route path="/projects" element={<div><Sidebar /></div>} />
        </Routes>
    </Router>
  );
}

export default App;
