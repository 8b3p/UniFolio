import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainContent.css';
import userCalcs from '../../utility/userCalcs';

const MainContent = (props) => {
  const [data, setData] = useState('');
  const fetchData = () => {
    console.log('called');
    fetch('http://localhost:3001/').then(response => {
      return response.json();
    }).then(response => {
      setData(response);
      console.log(response)
      return response;
    }).catch(e => {
      return e;
    })
  }
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center my-auto">
      <main className="card">
        {/* <h1 onClick={fetchData} className="text-end">{userCalcs.commissionedTotalBalance(data.balance, data.currentUser, data.commissioned)} : الرصيد الكلي</h1> */}
        <h3 onClick={fetchData} className="text-end">{data.balance}: جميع الحسابات</h3>
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