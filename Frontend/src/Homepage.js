import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BirthdayDashboard from './BirthdayDashboard';
import { scrollToSection } from './App';
import Navbar from './components/Navbar';

const Homepage = ({ user, handleSignout }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      scrollToSection(location.hash.slice(1));
    }
  }, [location]);

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column bg-white p-0">
      <Navbar user={user} handleSignout={handleSignout} />
      
      <div className="flex-grow-1" style={{paddingTop: '10px'}} > 
        {user ? (
          <BirthdayDashboard user={user} />
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold mb-3">Never forget a birthday again</h1>
              <p className="lead mb-4">Easily store and manage birthdays, and we'll send you reminders so you never miss a friend's or family member's special day.</p>
              <div className="text-center">
                <h2 className="mb-4">Why Choose Birthday Reminder?</h2>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-bell fa-3x mb-3"></i>
                    <h4>Never Miss a Birthday</h4>
                    <p>Get timely reminders for all your important dates.</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-mobile-alt fa-3x mb-3"></i>
                    <h4>Easy to Use</h4>
                    <p>Simple interface to add and manage birthdays effortlessly.</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-gift fa-3x mb-3"></i>
                    <h4>Personalized Suggestions</h4>
                    <p>Get gift ideas based on your contacts' interests.</p>
                  </div>
                </div>
                <Link to="/signup" className="btn btn-primary btn-lg mt-3">Get Started Now</Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center mt-5">
            <div className="mx-2" style={{width: '180px'}}>
              <img src={require('./images/birthdaycake.png')} 
              className="img-fluid rounded" alt="Birthday cake" 
              style={{height: '180px', objectFit: 'cover'}} />
            </div>
            <div className="mx-2" style={{width: '180px'}}>
              <img src={require('./images/giftbox.jpg')} 
              className="img-fluid rounded" alt="Gift box" style=
              {{height: '180px', objectFit: 'cover'}} />
            </div>
            <div className="mx-2" style={{width: '180px'}}>
              <img src={require('./images/balloons.jpg')} 
              className="img-fluid rounded" alt="Balloons" style=
              {{height: '180px', objectFit: 'cover'}} />
            </div>
          </div>
    </div>
  );
};

export default Homepage;