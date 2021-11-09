if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
};
const passport = require('passport');
const localPassport = require('passport-local');
const CoinUser = require('./models/user');
const Coins = require('./models/coins')
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
passport.use(new localPassport(CoinUser.authenticate()));
passport.serializeUser(CoinUser.serializeUser());
passport.deserializeUser(CoinUser.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.post('/uploadcoins', (req, res) => {
  let coins = new Coins({
    coin: ['MANA', 'SOL', 'SRM', 'LUNA', 'FTM', 'THETA', 'RAY', 'KSM',
      'VET', 'LIT', 'TFUEL', 'PHA', 'COTI', 'RUNE', 'TLM', 'BNB']
  });
  coins.save();
  res.redirect('/home');
})

app.get('/', async (req, res) => {
  res.redirect('/login');
});

app.get('/home', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  let wallet = 0;
  let coins = await Coins.findById('618aaa7ba7ad321c82fea186')
  let balances;
  try {
    balances = await binance.balance();
    console.log('got the balances');
  } catch (err) {
    console.log(err.statusMessage, err.statusCode)
  }
  for (let coin of coins.coin) {
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

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {

  res.redirect('/home');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, capital, percentage } = req.body;
    const user = new CoinUser({ username, capital, percentage});
    const registeredUser = await CoinUser.register(user, password);
    console.log(registeredUser)
    req.login(registeredUser, error => {
      if (error) {
        return rres.send('error logging in');
      } else {
        res.send('success');
      }
    });
  } catch (e) {
    res.json('error registering probably', e);
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`online on port ${port}`);
});