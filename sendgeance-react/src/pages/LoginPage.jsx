import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../AuthContext";

function LoginPage({ setUsername }) {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
      // Send a POST request to the server's login endpoint
      const response = await axios.post(
        "http://localhost:5000/login",
        formData,
      );
      console.log("data", response.data);

      // Check the server's response
      if (response.data.success) {
        login({ username: response.data.username });
        navigate("/", { state: { username: response.data.username } });
      } else {
        console.log("Failed Login"); // Handle failed login attempt (e.g., show error message)
      }
    } catch (error) {
      console.error("Login error:", error);
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
              Login
            </Button>

            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
