if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
};
const passport = require('passport');
const localPassport = require('passport-local');
const CoinUser = require('./models/user');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const express = require('express');
const app = express();
const catchAsync = require('./utility/catchAsync.js');
const controllers = require('./controller/controllers.js');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const { isLoggedIn } = require('./utility/functions');

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
});
store.on("error", function (e) {
  console.log('session store error', e);
});

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

app.use(catchAsync(async (req, res, next) => {
  if (req.user) {
    if (req.user.commissionto.length) {
      res.locals.commissioned = await CoinUser.find({
        '_id': req.user.commissionto
      });
    } else {
      res.locals.commissioned = null;
    }
    res.locals.currentUser = req.user;
  }
  next();
}));

app.get('/', isLoggedIn, catchAsync(controllers.renderHomePage));


app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

app.post('/register', catchAsync(controllers.register));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})

app.get('/test', catchAsync(controllers.test));

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'oh no, something went wrong';
  console.log(err)
  res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`online on port ${port}`);
});