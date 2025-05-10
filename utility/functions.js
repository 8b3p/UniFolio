// module.exports.isLoggedIn = function(req, res, next) {
//   if (!req.isAuthenticated()) {
//     req.session.returnTo = req.originalUrl;
//     return res.redirect('/login');
//   };
//   next();
// };

const jwt = require("jsonwebtoken");
const CoinUser = require("../models/user");

const COOKIE_NAME = "auth_token";
const SECRET = process.env.JWT_SECRET || "please_change_me";

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await CoinUser.findById(decoded.id);
    if (!user || user.disabled) return res.redirect("/login");

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT auth error:", err.message);
    res.redirect("/login");
  }
};

const fixCoinsArray = (objectArray) => {
  for (let i = 0; i < objectArray.length; i++) {
    for (let j = 0; j < objectArray.length; j++) {
      if (i != j) {
        if (objectArray[i]['coinName'] == objectArray[j]['coinName']) {
          objectArray[i]['coinBalance'] += objectArray[j]['coinBalance']
          objectArray.splice(j, 1);
        }
      }
      if (objectArray[j]['coinBalance'] < 1) {
        objectArray.splice(j, 1);
      }
    }
  }
  for (let i = 0; i < objectArray.length; i++) {
    for (let j = 0; j < objectArray.length; j++) {
      if (objectArray[i]['coinBalance'] > objectArray[j]['coinBalance']) {
        let temp = objectArray[i];
        objectArray[i] = objectArray[j];
        objectArray[j] = temp;
      }
    }
  }
  return objectArray;
}

module.exports = { isLoggedIn, fixCoinsArray };
