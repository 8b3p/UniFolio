const StakedCoins = require('../models/stakedCoins');
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_APIKEY,
  APISECRET: process.env.BINANCE_APISECRET
});

module.exports.getBalance = async (coins) => {
  let total = 0;
  const data = await Promise.all([StakedCoins.findOne(), binance.balance(), binance.prices()])
  const stakedCoins = data[0];
  const balances = data[1];
  const ticker = data[2];
  for (let coin of coins.coin) {
    let coinusdt = `${coin}USDT`;
    let money = (parseFloat(balances[coin].available) + parseFloat(balances[coin].onOrder));
    money = money * ticker[coinusdt];
    console.log(`${coin}: ${money}`);
    total = total + money;
    if (stakedCoins.coins.get(coin)) {
      let money = stakedCoins.coins.get(coin);
      money = money * ticker[coinusdt];
      console.log(`${coin}: ${money}`);
      total += money;
    }
  };
  {
    let coin = 'USDT';
    let coinusdt = `${coin}DAI`;
    let money = (parseFloat(balances[coin].available) + parseFloat(balances[coin].onOrder));
    money = money * ticker[coinusdt];
    console.log(`${coin}: ${money}`);
    total = total + money;
  }
  console.log('got binance balance: ' + total);
  return total;
};