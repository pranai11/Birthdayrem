import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar'; // Import the Navbar component

const RemindMe = () => {
  const [remindMethod, setRemindMethod] = useState('');
  const [reminderType, setReminderType] = useState('email');
  const [personalMessage, setPersonalMessage] = useState(
    "Hey, just a reminder that it's my birthday in 7 days. No pressure, but if you're feeling generous, I'd love a cup of coffee or a hug."
  );
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }

    const fetchReminderSettings = async () => {
      try {
        if (loggedInUser && loggedInUser._id) {
          const response = await axios.get(`${process.env.hosturl}/api/reminder-settings/${loggedInUser._id}`);
          const settings = response.data;
          setRemindMethod(settings.remindMethod || '');
          setReminderType(settings.reminderType || 'email');
          setPersonalMessage(settings.personalMessage || '');
        }
      } catch (error) {
        console.error('Error fetching reminder settings:', error);
      }
    };

    fetchReminderSettings();
  }, [navigate]);

  const handleSaveSettings = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser._id) {
      alert("Please log in to save settings.");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('${process.env.hosturl}/api/save-reminder-settings', {
        userId: storedUser._id,
        remindMethod,
        reminderType,
        personalMessage
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.success) {
        alert('Settings saved successfully!');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(`Failed to save settings. Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSignout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <Navbar user={user} handleSignout={handleSignout} />
      <div className="container mt-5 pt-5">
        <h1 className="mb-4">Settings</h1>
        <div className="mb-4">
        <h2>Reminder</h2>
        <label htmlFor="remindMe" className="form-label">Remind me</label>
        <select 
          id="remindMe" 
          className="form-select mb-3"
          value={remindMethod}
          onChange={(e) => setRemindMethod(e.target.value)}
        >
          <option value="">Select reminder method</option>
          <option value="1day">1 day before</option>
          <option value="3days">3 days before</option>
          <option value="1week">1 week before</option>
        </select>

        <div className="form-check mb-2">
          <input 
            className="form-check-input" 
            type="radio" 
            name="reminderType" 
            id="email" 
            checked={reminderType === 'email'}
            onChange={() => setReminderType('email')}
          />
          <label className="form-check-label" htmlFor="email">
            Email
          </label>
        </div>
        <div className="form-check mb-3">
          <input 
            className="form-check-input" 
            type="radio" 
            name="reminderType" 
            id="notification"
            checked={reminderType === 'notification'}
            onChange={() => setReminderType('notification')}
          />
          <label className="form-check-label" htmlFor="notification">
            Notification
          </label>
        </div>
      </div>

      <div className="mb-4">
        <h2>Message</h2>
        <label htmlFor="personalMessage" className="form-label">Personal message</label>
        <textarea
          id="personalMessage"
          className="form-control"
          rows="4"
          value={personalMessage}
          onChange={(e) => setPersonalMessage(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <button 
          className="btn btn-primary" 
          onClick={handleSaveSettings}
        >
          Save Settings
        </button>
      </div>
      </div>
    </div>
  );
};

export default RemindMe;
