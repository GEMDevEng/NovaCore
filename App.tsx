import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Analytics from './views/Analytics';
import Reports from './views/Reports';
import Calendar from './views/Calendar';
import Contacts from './views/Contacts';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-nova-bg-light dark:bg-nova-bg-dark">
        <Sidebar />
        <main className="flex-1">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/contacts" element={<Contacts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;