const Coins = require('../models/coins');
const CoinUser = require('../models/user');
const Kucoin = require('../utility/KucoinAPI');
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_APIKEY,
  APISECRET: process.env.BINANCE_APISECRET
});

module.exports.renderHomePage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  let wallet = 0;
  let coins = await Coins.findById('618aaa7ba7ad321c82fea186')
  let balances;
  let ticker;
  balances = await binance.balance();
  ticker = await binance.prices();
  console.log('got the balances');
  for (let coin of coins.coin) {
    let coinusdt = `${coin}USDT`;
    let money = (parseFloat(balances[coin].available) + parseFloat(balances[coin].onOrder));
    money = money * ticker[coinusdt];
    wallet = wallet + money;
  };
  wallet += (parseFloat(balances.USDT.available) + parseFloat(balances.USDT.onOrder));
  KucoinBalance = await Kucoin.getBalances();
  console.log(KucoinBalance);
  wallet += KucoinBalance;
  wallet = wallet.toFixed(2);
  res.render('home', { balance: wallet, coins: coins })
};

module.exports.register = async (req, res) => {
  const { username, password, capital, percentage, profit, commissionto } = req.body;
  const user = new CoinUser({ username, capital, percentage, profit, commissionto });
  const registeredUser = await CoinUser.register(user, password);
  console.log(registeredUser)
  req.login(registeredUser, error => {
    if (error) {
      return res.send(error);
    } else {
      res.send('success');
    }
  });
};

module.exports.uploadCoins = (req, res) => {
  let coins = new Coins({
    coin: ['MANA', 'SOL', 'SRM', 'LUNA', 'FTM', 'THETA', 'RAY', 'KSM',
      'VET', 'LIT', 'TFUEL', 'PHA', 'COTI', 'RUNE', 'TLM', 'BNB']
  });
  coins.save();
  res.redirect('/home');
};