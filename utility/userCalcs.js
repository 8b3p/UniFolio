
module.exports.totalBalance = (balance, currentUser) => {
  return ((balance * (currentUser.percentage / 100)) - (((balance * (currentUser.percentage / 100)) -
    currentUser.capital) * ((100 - currentUser.profit) / 100))).toFixed(2)
}

module.exports.commissionedTotalBalance = (balance, currentUser, commissioned) => {
  let total = 0
  for (let i = 0; i < commissioned.length; i++) {
    let result = parseFloat(((((balance * (commissioned[i].percentage / 100)) - commissioned[i].capital) * ((100 -
      commissioned[i].profit) / 100))))
    total = total + result
  }
  return (((balance * (currentUser.percentage / 100)) - (((balance * (currentUser.percentage / 100)) -
    currentUser.capital) * ((100 - currentUser.profit) / 100)) + total)).toFixed(2)
}

module.exports.profit = (balance, currentUser) => {
  let profit = (((balance * (currentUser.percentage / 100)) - currentUser.capital) * (currentUser.profit /
    100)).toFixed(2);
  let percentage = (((((balance * (currentUser.percentage / 100)) - currentUser.capital) * (currentUser.profit /
    100)) * 100) / (currentUser.capital)).toFixed(2)
  return `${profit} (${percentage}%)`
}

module.exports.commissionProfit = (balance, commissioned) => {
  let total = 0
  for (let i = 0; i < commissioned.length; i++) {
    let result = parseFloat(((((balance * (commissioned[i].percentage / 100)) - commissioned[i].capital) * ((100 -
      commissioned[i].profit) / 100))))
    total = total + result
  }
  return `${total.toFixed(2)}$`
}

module.exports.overallProfit = (balance, currentUser, commissioned) => {
  let total = 0
  for (let i = 0; i < commissioned.length; i++) {
    let result = parseFloat(((((balance * (commissioned[i].percentage / 100)) - commissioned[i].capital) * ((100 -
      commissioned[i].profit) / 100))))
    total = total + result
  }
  const overallProfit = ((((balance * (currentUser.percentage / 100)) - currentUser.capital) * (currentUser.profit / 100))
    + total).toFixed(2)
  return `${overallProfit}$`
}
