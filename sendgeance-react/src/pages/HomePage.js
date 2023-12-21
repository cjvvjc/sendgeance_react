import React from "react"
import { useLocation } from "react-router-dom"
import mainLogo from "../images/sendgeance-high-resolution-logo.jpeg"
import { Button, Container, Row, Col, Image} from 'react-bootstrap'
import "../styles/styles.css"

const HomePage = () => {
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const { username } = location.state || {};


  return (
    <Container className={isHomePage ? "homepage-background" : ""}>
      <style>
        {isHomePage && 'body { background-color: #EFEFEF !important; }'}
      </style>
      <Row>
        <Col>
          <Image className="img-fluid" src={mainLogo} alt="" />
        </Col>
      </Row>
      <Row>
        <Col style={{fontSize:"30px"}}>
          Hello {username}! What would you like to do today?
        </Col>
      </Row>
      <Row>
        <Col className="py-1">
          <Button type="button" className="btn btn-secondary" href="/workouts/new" target="_self">Start a new Session</Button>
        </Col>
      </Row>
      <Row>
        <Col className="py-1">
          <Button type="button" className="btn btn-secondary" href="/workouts/all" target="_self">Review a past Session</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default HomePage;