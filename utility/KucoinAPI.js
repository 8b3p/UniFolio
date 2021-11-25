const hash = require('crypto-js');
const rp = require('request-promise');


module.exports.getBalance = async () => {
  const now = Date.now();
  const str_to_sign = now.toString() + 'GET' + BalanceEndPoint;
  const signature = hash.HmacSHA256(str_to_sign.toString(hash.enc.Utf8), apiSecret.toString(hash.enc.Utf8)).toString(hash.enc.Base64);
  const passphrase = hash.HmacSHA256(apiPassphrase.toString(hash.enc.Utf8), apiSecret.toString(hash.enc.Utf8)).toString(hash.enc.Base64);
  const apiSecret = process.env.KUCOIN_SECRET;
  const apiKey = process.env.KUCOIN_KEY;
  const apiPassphrase = process.env.KUCOIN_PASSPHRASE;
  const url = 'https://api.kucoin.com';
  const MarketEndPoint = '/api/v1/market/allTickers';
  const BalanceEndPoint = '/api/v1/accounts';
  const Headers = {
    "KC-API-KEY": apiKey,
    "KC-API-SIGN": signature,
    "KC-API-TIMESTAMP": now.toString(),
    "KC-API-PASSPHRASE": passphrase,
    "KC-API-KEY-VERSION": "2"
  };
  let total = 0;
  const Balance = await rp({
    method: 'GET',
    uri: url + BalanceEndPoint,
    headers: Headers,
    json: true
  })
  const prices = await rp({
    method: 'GET',
    uri: url + MarketEndPoint,
    json: true
  })

  for (let coin of Balance.data) {
    if (coin.currency == 'AIOZ') {
      continue;
    } else {
      for (let data of prices.data.ticker) {
        if (data.symbol == (coin.currency + '-USDT')) {
          let calculatedBalance = data.last * coin.balance;
          total += parseFloat(calculatedBalance);
          break;
        }
        if (data.symbol === coin.currency + '-UST') {
          let calculatedBalance = coin.balance;
          total += parseFloat(calculatedBalance);
        }
      }
    }
  }
  console.log('got Kucoin balance: ' + total)
  return total;
};
