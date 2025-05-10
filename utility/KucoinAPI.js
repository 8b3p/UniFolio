const hash = require('crypto-js');
const rp = require('request-promise');
const apiSecret = process.env.KUCOIN_SECRET;
const apiKey = process.env.KUCOIN_KEY;
const apiPassphrase = process.env.KUCOIN_PASSPHRASE;
const url = 'https://api.kucoin.com';
const MarketEndPoint = '/api/v1/market/allTickers';
const BalanceEndPoint = '/api/v1/accounts';
console.log(apiKey, apiSecret, apiPassphrase)

module.exports.getBalance = async (coinsArray) => {
  const now = Date.now();
  const str_to_sign = now.toString() + 'GET' + BalanceEndPoint;
  const signature = hash.HmacSHA256(str_to_sign.toString(hash.enc.Utf8), apiSecret.toString(hash.enc.Utf8)).toString(hash.enc.Base64);
  const passphrase = hash.HmacSHA256(apiPassphrase.toString(hash.enc.Utf8), apiSecret.toString(hash.enc.Utf8)).toString(hash.enc.Base64);
  const Headers = {
    "KC-API-KEY": apiKey,
    "KC-API-SIGN": signature,
    "KC-API-TIMESTAMP": now.toString(),
    "KC-API-PASSPHRASE": passphrase,
    "KC-API-KEY-VERSION": "2"
  };
  let total = 0;
  const balanceRP = {
    method: 'GET',
    uri: url + BalanceEndPoint,
    headers: Headers,
    json: true
  }
  const marketRP = {
    method: 'GET',
    uri: url + MarketEndPoint,
    json: true
  }
  try {
    console.log("balanceRP", balanceRP)
    console.log("marketRP", marketRP)
    const data = await Promise.all([rp(balanceRP), rp(marketRP)]);
    console.log("data", data)
    const Balance = data[0];
    const prices = data[1];

    for (let coin of Balance.data) {
      for (let data of prices.data.ticker) {
        if (data.symbol === (coin.currency + '-USDT')) {
          let calculatedBalance = data.last * coin.balance;
          if (!coinsArray[coin.currency]) {
            coinsArray[coin.currency] = {
              coinName: coin.currency,
              coinBalance: calculatedBalance,
              coinPrice: data.last,
              coinAmount: coin.balance
            };
            total += parseFloat(calculatedBalance);
            console.log('adding', data.symbol, 'of', calculatedBalance, 'to total')
          }
          break;
        }
        if (data.symbol === coin.currency + '-USDC') {
          // let calculatedBalance = coin.balance;
          // total += parseFloat(calculatedBalance);
          let calculatedBalance = data.last * coin.balance;
          if (!coinsArray[coin.currency]) {
            coinsArray[coin.currency] = {
              coinName: coin.currency,
              coinBalance: calculatedBalance,
              coinPrice: data.last,
              coinAmount: coin.balance
            };
          }
          console.log('adding', data.symbol, 'of', calculatedBalance, 'to total')
          total += parseFloat(calculatedBalance);
        }
      }
    }
    console.log(total.toFixed(3).toString() + " Kucoin")
    return [total, coinsArray];
  } catch (err) {
    console.log(err.message)
    console.log('in catch of Kucoin')
  }
};
