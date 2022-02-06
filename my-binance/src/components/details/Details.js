import React from 'react'
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Details.css';

const Details = (props) => {
  return (
    <Container fluid className="darayya d-flex flex-column justify-content-between">
      <Container className="d-flex justify-content-center align-items-center my-auto">
        <section className="card px-0 text-center">
          <p className='display-1'>Here goes nothing (;</p>
        </section>
      </Container>
      {props.children}
    </Container>
  );
}

export default Details;