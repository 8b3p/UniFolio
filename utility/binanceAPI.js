const StakedCoins = require('../models/stakedCoins');
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_APIKEY,
  APISECRET: process.env.BINANCE_APISECRET
});

module.exports.getBalance = async (coins, coinsArray) => {
  let total = 0;
  const data = await Promise.all([binance.balance(), binance.prices()])
  const balances = data[0];
  const ticker = data[1];
  for (let coin of coins.coin) {
    let coinusdt = `${coin}USDT`;
    let money = (parseFloat(balances[coin].available) + parseFloat(balances[coin].onOrder));
    money = money * ticker[coinusdt];
    // console.log(`${coin}: ${money}`);
    total = total + money;
    let coinData = {
      coinName: coin,
      coinBalance: money,
      coinPrice: ticker[coinusdt]
    };
    coinsArray.push(coinData);
  };
  {
    let coin = 'USDT';
    let coinusdt = `${coin}DAI`;
    let money = (parseFloat(balances[coin].available) + parseFloat(balances[coin].onOrder));
    money = money * ticker[coinusdt];
    // console.log(`${coin}: ${money}`);
    total = total + money;
    let coinData = {
      coinName: coin,
      coinBalance: money,
      coinPrice: ticker[coinusdt]
    };
    coinsArray.push(coinData);
  }
  // console.log('got binance balance: ' + total);
  return [total, coinsArray];
};