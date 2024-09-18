import React, { useState } from 'react';
import './AddBirthdayReminder.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { hosturl } from './urls';

const AddBirthdayReminder = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    recurrence: 'yearly',
    remindOn: '',
    notes: ''
  });

  const remindOnOptions = [
    { value: '00:00', label: '12:00 AM' },
    { value: '03:00', label: '3:00 AM' },
    { value: '06:00', label: '6:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '21:00', label: '9:00 PM' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.date || !formData.remindOn) {
        alert('Please fill in all required fields.');
        return;
      }

      const formattedDate = new Date(formData.date).toISOString().split('T')[0];
      const [hours, minutes] = formData.remindOn.split(':');
      const formattedRemindOn = `${hours}:${minutes}`;

      const dataToSend = {
        ...formData,
        date: formattedDate,
        remindOn: formattedRemindOn,
        userId: user._id
      };

      console.log('Sending data to server:', dataToSend);

      const response = await axios.post(`${hosturl}/api/add-birthday`, dataToSend);
      console.log('Server response:', response.data);
      
      if (response.data && response.data.id) {
        alert('Birthday reminder added successfully!');
        navigate('/'); // Redirect to homepage after adding
      } else {
        throw new Error('No ID returned from server');
      }
    } catch (error) {
      console.error('Error adding birthday reminder:', error);
      alert(`Error adding birthday reminder: ${error.message}`);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
      <div className="add-birthday-form">
        <h1>Add a birthday reminder</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" className="form-control" placeholder="Enter a name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <div className="form-check">
              <input type="radio" id="yearly" name="recurrence" value="yearly" className="form-check-input" checked={formData.recurrence === 'yearly'} onChange={handleChange} />
              <label htmlFor="yearly" className="form-check-label">Yearly</label>
            </div>
            <div className="form-check">
              <input type="radio" id="custom" name="recurrence" value="custom" className="form-check-input" checked={formData.recurrence === 'custom'} onChange={handleChange} />
              <label htmlFor="custom" className="form-check-label">Custom</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="remindOn">Remind on</label>
            <select
              id="remindOn"
              name="remindOn"
              className="form-control"
              value={formData.remindOn}
              onChange={handleChange}
              required
            >
              <option value="">Select time</option>
              {remindOnOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" className="form-control" placeholder="Add a note" value={formData.notes} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-block">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddBirthdayReminder;
