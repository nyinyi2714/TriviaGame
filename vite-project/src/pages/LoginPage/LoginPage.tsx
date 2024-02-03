// src/Login.js
import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error message when user starts typing
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    let formIsValid = true;
    const newErrors = { ...errors };

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
      formIsValid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      formIsValid = false;
    }

    if (formIsValid) {
      // Handle form submission here (e.g., send data to the server)
      console.log(formData);
    } else {
      // Set the new error messages
      setErrors(newErrors);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="error-message">{errors.email}</div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="error-message">{errors.password}</div>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
