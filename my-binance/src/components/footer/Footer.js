import React from 'react'
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';


const Footer = () => {
  return (
    <footer className="footer bg-transparent py-3">
      <Container className="text-center">
        <span className="text-muted">&copy;: Finance, Omair</span>
      </Container>
    </footer>
  );
}

export default Footer;