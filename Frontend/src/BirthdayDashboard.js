import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BirthdayDashboard = ({ user }) => {
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/birthdays/${user._id}`);
        setUpcomingBirthdays(response.data);
      } catch (error) {
        console.error("Error fetching birthdays:", error);
      }
    };

    if (user && user._id) {
      fetchBirthdays();
    }
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/birthdays/${id}`);
      setUpcomingBirthdays(upcomingBirthdays.filter(birthday => birthday._id !== id));
    } catch (error) {
      console.error("Error deleting birthday:", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/cancel-birthday-reminder/${id}`);
      setUpcomingBirthdays(upcomingBirthdays.map(birthday => 
        birthday._id === id ? { ...birthday, isCanceled: true } : birthday
      ));
      alert('Birthday reminder canceled successfully');
    } catch (error) {
      console.error("Error canceling birthday reminder:", error);
      alert('Failed to cancel birthday reminder');
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h1 className="display-4">Good morning, {user.username}</h1>
        <div>
          <Link to="/add-reminder" className="btn btn-primary me-2 mt-0">Add</Link>
          <Link to="/remind-me" className="btn btn-outline-primary">Remind me</Link>
        </div>
      </div>
      <p className="text-muted">Here's what's happening today</p>
      <h2 className="mb-3" id="todays-birthdays">Today's Birthdays</h2>
      {upcomingBirthdays.filter(birthday => {
        const today = new Date();
        const birthDate = new Date(birthday.date);
        return birthDate.getDate() === today.getDate() && 
               birthDate.getMonth() === today.getMonth();
      }).length > 0 ? (
        <ul className="list-group mb-4">
          {upcomingBirthdays.filter(birthday => {
            const today = new Date();
            const birthDate = new Date(birthday.date);
            return birthDate.getDate() === today.getDate() && 
                   birthDate.getMonth() === today.getMonth();
          }).map((birthday) => (
            <li key={birthday._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img src={require('./images/birthdaycake.png')} alt={birthday.name} className="rounded-circle me-3" style={{width: '40px', height: '40px'}} />
                <div>
                  <span className="fw-bold">{birthday.name}</span>
                  {birthday.notes && <p className="mb-0 text-muted">{birthday.notes}</p>}
                </div>
              </div>
              <div>
                <span className="badge bg-success rounded-pill me-2">Today!</span>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => handleDelete(birthday._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted mb-4">No birthdays today.</p>
      )}
      <h2 className="mb-3" id="upcoming-birthdays">Upcoming birthdays</h2>
      <ul className="list-group">
        {upcomingBirthdays.map((birthday) => (
          <li key={birthday._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img src={require('./images/birthdaycake.png')} alt={birthday.name} className="rounded-circle me-3" style={{width: '40px', height: '40px'}} />
              <div>
                <span className="fw-bold">{birthday.name}</span>
                {birthday.notes && <p className="mb-0 text-muted">{birthday.notes}</p>}
              </div>
            </div>
            <div>
              <span className="badge bg-primary rounded-pill me-2">{new Date(birthday.date).toLocaleDateString()}</span>
              {!birthday.isCanceled ? (
                <>
                  <button 
                    className="btn btn-warning btn-sm me-2" 
                    onClick={() => handleCancel(birthday._id)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDelete(birthday._id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <span className="badge bg-secondary">Canceled</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BirthdayDashboard;
