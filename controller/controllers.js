const Coins = require('../models/coins');
const CoinUser = require('../models/user');
const Kucoin = require('../utility/KucoinAPI');
const Binance = require('../utility/binanceAPI');


module.exports.renderHomePage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  let coins = await Coins.findOne()
  BinanceBalance = await Binance.getBalance(coins);
  KucoinBalance = await Kucoin.getBalance();
  let balance = KucoinBalance + BinanceBalance;
  balance = balance.toFixed(2);
  res.render('home', { balance: balance, coins: coins })
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