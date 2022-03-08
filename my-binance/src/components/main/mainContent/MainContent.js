import React, { useState, useEffect, useContext } from 'react'
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainContent.css';
import pricesContext from '../../../store/prices-date';
// import userCalcs from '../../utility/userCalcs';

const MainContent = (props) => {
  const pricesCtx = useContext(pricesContext);

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center my-auto">
      <main onClick={pricesCtx.fetchData} className="card clickable">
        {/* <h1 onClick={fetchData} className="text-end">{userCalcs.commissionedTotalBalance(data.balance, data.currentUser, data.commissioned)} : الرصيد الكلي</h1> */}
        <h3 className="text-end">{pricesCtx.balance}: جميع الحسابات</h3>
        {/* <p className="text-end">{data.currentUser.capital}$: رأس المال</p>
        <p className="text-end">{userCalcs.profit(data.balance, data.currentUser)}: الربح</p>
        <p className="text-end">{userCalcs.commissionProfit(data.balance, data.commissioned)}: ربح العمولة</p>
        <p className="text-end">{userCalcs.overallProfit(data.balance, data.currentUser, data.commissioned)}: اجمالي الربح</p> */}
      </main>
      <div className="card mt-5">
        معلومات اضافية في الاسفل (:
      </div>
    </Container>
  );
}

export default MainContent;