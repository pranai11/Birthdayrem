import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, handleSignout }) => {
  return (
    <nav className="navbar navbar-light bg-white mx-0 px-0 w-100" style={{borderBottom: '1px solid black'}}>
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <svg width="40" height="40" viewBox="0 0 100 100" className="me-1">
            <g id="SvgjsG1365" transform="matrix(0.5532033080565632,0,0,0.5532033080565632,1.1812975128404304,19.327794299385914)" fill="#235784">
              <title>Artboard 1</title>
              <path d="M90.79,32.95,75.23,25.69,72.47,8.93,60.7,21.29l-17-2.58L9.21,91.07,73.33,57.59l1.57-10.74ZM52,33.62,45.22,46.89l-30,35.81,29.9-61.48Zm9.45,12.31,5.48,5.37L16.21,85.57ZM13.1,87,46.6,48.36,58.16,46.2Zm8.47-4,46.8-30.21,3.19,3.12Zm50.29-29.6L61.79,43.48,47.88,46.09l6.37-12.51L47.44,21.3l14,2.13,9.72-10.21,2.28,13.84,12.79,6L73.65,39.44ZM75.5,40.74l6.93-3.53L75.09,44Z"></path>
            </g>
          </svg>
          <Link className="navbar-brand" to="/">Birthday Reminder</Link>
        </div>
        <div className="d-flex align-items-center">
          {user ? (
            <>
              <Link to="/#todays-birthdays" className="nav-link me-3">Today</Link>
              <Link to="/#upcoming-birthdays" className="nav-link me-3">Upcoming</Link>
              <Link to="/contacts" className="nav-link me-3">Contacts</Link>
              <span className="me-2">Welcome, {user.username}</span>
              <button onClick={handleSignout} className="btn btn-outline-primary px-4">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary rounded-pill me-2">Log in</Link>
              <Link to="/signup" className="btn btn-primary rounded-pill my-0">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
