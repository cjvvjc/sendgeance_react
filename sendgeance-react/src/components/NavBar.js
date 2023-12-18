import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Attempting to logout");
    try {
      const response = await axios.post('http://localhost:5000/logout');
      if (response.data.success) {
        // Redirect to home page or login page after successful logout
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error (e.g., show a message to the user)
    }
  };

  return (
    <Navbar bg='dark' variant='dark' expand='lg' className='px-3'>
      <Navbar.Toggle aria-controls='basic-navbar-nav'/>
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='ml-auto'>
          <LinkContainer to='/'>
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/workouts/new'>
            <Nav.Link>Add Workout</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/workout/current'>
            <Nav.Link>Current Session</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/workouts/all'>
            <Nav.Link>All Sessions</Nav.Link>
          </LinkContainer>
            
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
};

export default NavBar;