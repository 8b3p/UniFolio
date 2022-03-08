import React, { useContext } from 'react'
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Details.css';
import CoinDetail from './coinDetail';
import pricesContext from '../../store/prices-date';

const Details = props => {
  const pricesCtx = useContext(pricesContext);
  let CoinDetailsArray
  if (pricesCtx.coinsArray) {
    CoinDetailsArray = pricesCtx.coinsArray.map(obj => <CoinDetail obj={obj} key={`${obj.coinName}`}/>)
  }
  console.log(CoinDetailsArray)

  return (
    <Container fluid className="darayya d-flex flex-column justify-content-between">
      <Container className="d-flex justify-content-center align-items-center my-auto">
        <section className="card px-0 text-center">
          <div style={{width: '90%'}} className="row px-0 mx-auto">
            <span className="col-4 my-4 text-center">إسم العملة</span>
            <span className="col-4 my-4 text-center">سعر العملة</span>
            <span className="col-4 my-4 text-center mb-3">رصيد العملة</span>
            {CoinDetailsArray}
          </div>
        </section>
      </Container>
      {props.children}
    </Container>
  );
}


export default Details;