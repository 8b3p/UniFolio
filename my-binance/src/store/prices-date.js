import React, { useEffect, useState } from 'react';

const pricesContext = React.createContext({
  balance: Number,
  coins: [],
  coinsArray: [{
    coinsName: String,
    coinBalance: String,
    coinPrice: Number
  }],
  fetchData: () => { }
})

export const PricesContextProvider = props => {

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
  };
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <pricesContext.Provider
      value={{
        balance: data.balance,
        coins: data.coins,
        coinsArray: data.coinsArray,
        fetchData: fetchData
      }}
    >
      {props.children}
    </pricesContext.Provider>
  )
}

export default pricesContext;