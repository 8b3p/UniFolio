if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
};
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_APIKEY,
  APISECRET: process.env.BINANCE_APISECRET
});

const mongoDbUrl = process.env.MONGO_URL;
mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('mongoose connected to mongoDB succesfully');
  })
  .catch(err => {
    console.error('oh no, mongoose error');
    console.log(err);
  });

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  let wallet = 0;
  let coins = ['MANA', 'SOL', 'SRM', 'LUNA', 'FTM', 'THETA', 'RAY', 'KSM',
    'VET', 'LIT', 'TFUEL', 'PHA', 'COTI', 'RUNE', 'TLM', 'BNB'];
  let balances;
  try {
    balances = await binance.balance();
    console.log('got the balances');
  } catch (err) {
    console.log(err.statusMessage, err.statusCode)
  }
  for (let coin of coins) {
    let coinusdt = `${coin}USDT`;
    const ticker =  binance.prices(coinusdt);
    let money = (parseFloat(balances[coin].available) + parseFloat(balances[coin].onOrder));
    money = money * ticker[coinusdt];
    wallet = wallet + money;
  };
  wallet += (parseFloat(balances.USDT.available) + parseFloat(balances.USDT.onOrder));
  wallet = wallet.toFixed(2);
  res.render('home', { balance: wallet, coins: coins })
});

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`online on port ${port}`);
});