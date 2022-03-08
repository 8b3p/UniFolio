import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { PricesContextProvider } from './store/prices-date';
import App from './App';

ReactDOM.render(
  <PricesContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </PricesContextProvider>,
  document.getElementById('root')
);

