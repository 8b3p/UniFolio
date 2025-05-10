if (process.env.NODE_ENV !== "production") { require("dotenv").config(); }
const passport = require("passport");
const jwt = require("jsonwebtoken");
const localPassport = require("passport-local");
const CoinUser = require("./models/user");
const express = require("express");
const app = express();
const catchAsync = require("./utility/catchAsync.js");
const controllers = require("./controller/controllers.js");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const { isLoggedIn } = require("./utility/functions");

const mongoDbUrl = process.env.MONGO_URL;
mongoose
  .connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true, })
  .then(() => console.log("mongoose connected to mongoDB succesfully"))
  .catch(err => console.error("oh no, mongoose error", err));

app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//all these are for the passport package for the password falan
app.use(passport.initialize());
passport.use(new localPassport(CoinUser.authenticate()));

app.use(cookieParser());

app.get("/login", (_req, res) => {
  res.render("login");
})

app.post("/login", (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    const COOKIE_NAME = "auth_token";
    const SECRET = process.env.JWT_SECRET || "please_change_me";
    if (err) return next(err);
    console.log("user", user);
    if (!user || user.disabled) return res.status(401).send("Unauthorized");

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect("/");
  })(req, res, next);
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, _info) => {
    if (err) throw err;
    if (!user || user.disabled) res.send("no user found");
    else {
      req.login(user, err => {
        if (err) throw err;
        else res.sendStatus(200);
      });
    }
  })(req, res, next);
});

app.post("/register", catchAsync(controllers.register));

app.get("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.redirect("/login");
});

app.use(isLoggedIn);

app.use(
  catchAsync(async (req, res, next) => {
    if (req.user) {
      if (req.user.commissionto.length) {
        res.locals.commissioned = await CoinUser.find({
          _id: req.user.commissionto,
        });
      } else {
        res.locals.commissioned = null;
      }
      res.locals.currentUser = req.user;
    }
    next();
  })
);

app.get("/", catchAsync(controllers.renderHomePage));


app.get("/api", catchAsync(controllers.API));

app.use((err, _req, res, _next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "oh no, something went wrong";
  console.dir(err);
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`online on port ${port}`);
});
