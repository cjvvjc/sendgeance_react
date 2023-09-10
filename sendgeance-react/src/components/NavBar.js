import React from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const NavBar = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='lg' className='px-3'>
      <LinkContainer to='/'>
        <Navbar.Brand>My Blog</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls='basic-navbar-nav'/>
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav classname='ml-auto'>
          <LinkContainer to='/'>
            <Navbar.Brand>Home</Navbar.Brand>
          </LinkContainer>
          <LinkContainer to='/posts/new'>
            <Navbar.Brand>Create Workout</Navbar.Brand>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
};