if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
};
const passport = require('passport');
const localPassport = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const mongoStore = require('connect-mongo');
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

const store = mongoStore.create({
  mongoUrl: mongoDbUrl,
  secret: process.env.SECRET,
  touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
  console.log('session store error', e);
})

const sessionConfig = {
  store,
  name: 'thisIsNotTheSessionSid',
  secret: process.env.SECRET || 'mySecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));

//all these are for the passport package for the password falan
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
    const ticker = await binance.prices(coinusdt);
    let money = (parseFloat(balances[coin].available) + parseFloat(balances[coin].onOrder));
    money = money * ticker[coinusdt];
    wallet = wallet + money;
  };
  wallet += (parseFloat(balances.USDT.available) + parseFloat(balances.USDT.onOrder));
  wallet = wallet.toFixed(2);
  res.render('home', { balance: wallet, coins: coins })
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/')
});

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`online on port ${port}`);
});