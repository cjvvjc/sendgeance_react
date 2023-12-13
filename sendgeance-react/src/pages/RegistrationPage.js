import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from a popular icon library

const RegistrationPage = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation logic here if needed

    // Call the onRegister callback with the form data
    onRegister(formData);
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
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Password:
        <div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <span onClick={handleTogglePassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </label>
      <br />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationPage;
