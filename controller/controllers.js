const CoinUser = require("../models/user");
const Kucoin = require("../utility/KucoinAPI");
const userCalcs = require("../utility/userCalcs");
const { fixCoinsArray } = require("../utility/functions");

module.exports.renderHomePage = async (_req, res) => {
  let coinsArray = []
  let coinsObject = {};
  let [balance] = await Kucoin.getBalance(coinsObject);
  coinsArray = Object.values(coinsObject);
  coinsArray = fixCoinsArray(coinsArray);
  balance = balance.toFixed(2);
  res.render("home", { balance, userCalcs, coinsArray });
};

module.exports.register = async (req, res) => {
  const { username, password, capital, percentage, profit, commissionto } =
    req.body;
  const user = new CoinUser({
    username,
    capital,
    percentage,
    profit,
    commissionto,
  });
  const registeredUser = await CoinUser.register(user, password);
  console.log(registeredUser);
  req.login(registeredUser, error => {
    if (error) {
      return res.send(error);
    } else {
      res.send("success");
    }
  });
};

module.exports.API = async (req, res) => {
  let coinsArray = []
  let coinsObject = {};
  const [balance] = Kucoin.getBalance(coinsObject);
  console.log(coinsObject);
  coinsArray = Object.keys(coinsObject).map((key) => ({ ...coinsObject[key] }))
  coinsArray = fixCoinsArray(coinsArray);
  balance = balance.toFixed(2);
  res.json({ balance, coinsArray });
};
