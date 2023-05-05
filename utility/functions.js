module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  };
  next();
};

module.exports.fixCoinsArray = (objectArray) => {
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
      if(objectArray[i]['coinBalance'] > objectArray[j]['coinBalance']){
        let temp = objectArray[i];
        objectArray[i] = objectArray[j];
        objectArray[j] = temp;
      }
    }
  }
  return objectArray;
}
