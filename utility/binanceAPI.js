const StakedCoins = require('../models/stakedCoins');
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_APIKEY,
  APISECRET: process.env.BINANCE_APISECRET
});

module.exports.getBalance = async (coins, coinsArray) => {
  let total = 0;
  const data = await Promise.all([binance.balance(), binance.prices()]);
  const allBalances = data[0];
  const prices = data[1];

  for (let coin of coins.coin) {
    let coinusdt = `${coin}USDT`;
    let balance = (parseFloat(allBalances[coin].available) + parseFloat(allBalances[coin].onOrder));
    calculatedBalance = balance * prices[coinusdt];
    total = total + calculatedBalance;
    coinsArray.push({
      coinName: coin,
      coinBalance: calculatedBalance,
      coinPrice: prices[coinusdt]
    });
  };
  {
    let coin = 'USDT';
    let coinusdt = `${coin}DAI`;
    let balance = (parseFloat(allBalances[coin].available) + parseFloat(allBalances[coin].onOrder));
    calculatedBalance = balance * prices[coinusdt];
    total = total + calculatedBalance;
    coinsArray.push({
      coinName: coin,
      coinBalance: calculatedBalance,
      coinPrice: prices[coinusdt]
    });
  }
  // console.log('got binance balance: ' + total);
  return [total, coinsArray];
};