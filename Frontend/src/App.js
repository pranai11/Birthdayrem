import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import AddBirthdayReminder from './AddBirthdayReminder';
import Signup from './Signup';
import Login from './Login';
import RemindMe from './RemindMe';

export const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage user={user} handleSignout={handleSignout} />} />
          <Route path="/add-reminder" element={<AddBirthdayReminder user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/remind-me" element={<RemindMe />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
