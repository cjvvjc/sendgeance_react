import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';


const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = Navigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation logic here if needed

    // Call the onLogin callback with the form data
    onLogin(formData);
  };

  const handleRegisterClick = () => {
    // Redirect to the registration page
    // navigate('/register');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Login</button>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
};

export default LoginPage;
