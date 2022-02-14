import React from 'react';
import Navbar from '../navbar/Navbar';
import MainContent from '../mainContent/MainContent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css';
import { Container } from 'react-bootstrap';

const Main = () => {
  return (
    <Container fluid className="Main d-flex flex-column justify-content-between">
      <Navbar />
      <MainContent />
    </Container>
  );
}

export default Main;