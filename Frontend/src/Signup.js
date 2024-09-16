import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { hosturl } from './urls';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${hosturl}/api/signup`, formData);
      console.log('Signup successful:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
      <Link to="/" className="text-decoration-none text-dark mb-4">
        <div className="d-flex align-items-center">
        <svg width="50" height="50" viewBox="0 0 100 100" className="me-2">
            <g id="SvgjsG1365" transform="matrix(0.7,0,0,0.7,0,15)" fill="#235784">
              <title>Artboard 1</title>
              <path d="M90.79,32.95,75.23,25.69,72.47,8.93,60.7,21.29l-17-2.58L9.21,91.07,73.33,57.59l1.57-10.74ZM52,33.62,45.22,46.89l-30,35.81,29.9-61.48Zm9.45,12.31,5.48,5.37L16.21,85.57ZM13.1,87,46.6,48.36,58.16,46.2Zm8.47-4,46.8-30.21,3.19,3.12Zm50.29-29.6L61.79,43.48,47.88,46.09l6.37-12.51L47.44,21.3l14,2.13,9.72-10.21,2.28,13.84,12.79,6L73.65,39.44ZM75.5,40.74l6.93-3.53L75.09,44Z"></path>
            </g>
          </svg>
          <h1 className="mb-0 fs-2">Birthday Reminder</h1>
        </div>
      </Link>
      <h2 className="mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="w-100" style={{maxWidth: '400px'}}>
        <div className="mb-3">
          <input type="text" className="form-control" name="username" placeholder="Username" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" name="email" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" name="password" placeholder="Password" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
      <p className="mt-3">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
};

export default Signup;
