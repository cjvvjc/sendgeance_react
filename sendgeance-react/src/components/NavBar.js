import React from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const NavBar = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='lg' className='px-3'>
      {/* <LinkContainer to='/'>
        <Navbar.Brand>My Blog</Navbar.Brand>
      </LinkContainer> */}
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
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
};

export default NavBar;