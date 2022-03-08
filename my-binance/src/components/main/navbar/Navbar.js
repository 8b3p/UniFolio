import React from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {
  return (
    <Container>
      <Navbar bg="transparent" className="navbar-dark d-flex justify-content-between">
        <Navbar.Brand href="/">Finance</Navbar.Brand>
        <Nav>
          <Nav.Item>
            <Nav.Link className="mx-2" href="/logout">تسجيل الخروج</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    </Container>
  );
}

export default Navigation