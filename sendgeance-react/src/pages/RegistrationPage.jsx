import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function RegistrationPage({ onRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add form validation logic here if needed

      // Make an HTTP POST request to your server
      const response = await axios.post(
        "http://localhost:5000/register",
        formData,
      );

      if (response.data.success) {
        // Redirect to login page on successful registration
        navigate("/login");
      } else {
        // Handle registration failure
        console.log("Registration failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating a new user:", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-2">
              <Form.Label className="mb-0">Username:</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-2">
              <Form.Label className="mb-0">Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-2">
              <Form.Label className="mb-0">Password:</Form.Label>
              <div className="d-flex align-items-center">
                <div className="password-input flex-grow-1">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <span className="ml-2" onClick={handleTogglePassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </Form.Group>

            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegistrationPage;
