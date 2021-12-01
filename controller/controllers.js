const Coins = require('../models/coins');
const CoinUser = require('../models/user');
const Kucoin = require('../utility/KucoinAPI');
const Binance = require('../utility/binanceAPI');
const Coingecko = require('../utility/coingecko');


module.exports.renderHomePage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  let coins = await Coins.findOne()
  // BinanceBalance = await Binance.getBalance(coins);
  // KucoinBalance = await Kucoin.getBalance();
  //*Promise.all([]) takes promises and calles them at once, it stops if only one was rejected
  //! Promise.allSettled([]) while this one return each promise as it is, if one gets rejected, it doesn't cancel the rest
  const balanceArray = await Promise.all([Kucoin.getBalance(), Binance.getBalance(coins), Coingecko.getBalance()])
  let balance = 0;
  for (let i = 0; i < balanceArray.length; i++) {
    balance += balanceArray[i]
  }
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

module.exports.test = async (req, res) => {
  const data = await Coingecko.getBalance();
  res.json(data);
}