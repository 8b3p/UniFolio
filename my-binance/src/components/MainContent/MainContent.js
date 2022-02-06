import React from 'react'
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainContent.css';

const MainContent = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center my-auto">
      <main className="card">
        <h1 className="text-end">: الرصيد الكلي</h1>
        <h3 className="text-end">: جميع الحسابات</h3>
        <p className="text-end">$ : رأس المال</p>
        <p className="text-end"> : الربح</p>
        <p className="text-end">: ربح العمولة</p>
        <p className="text-end">: اجمالي الربح</p>
      </main>
      <div className="card mt-5">
        معلومات اضافية في الاسفل (:
      </div>
    </Container>
  );
}

export default MainContent;