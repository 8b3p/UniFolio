const hash = require('crypto-js');
const rp = require('request-promise');
const apiSecret = process.env.KUCOIN_SECRET;
const apiKey = process.env.KUCOIN_KEY;
const apiPassphrase = process.env.KUCOIN_PASSPHRASE;
const url = 'https://api.kucoin.com';
const MarketEndPoint = '/api/v1/market/allTickers';
const BalanceEndPoint = '/api/v1/accounts';

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
  const data = await Promise.all([rp(balanceRP), rp(marketRP)]);
  const allBalances = data[0];
  const prices = data[1];

  for (let coin of allBalances.data) {
    for (let coinsPrices of prices.data.ticker) {
      if (coinsPrices.symbol === (coin.currency + '-USDT')) {
        let calculatedBalance = coinsPrices.last * coin.balance;
        coinsArray.push({
          coinName: coin.currency,
          coinBalance: calculatedBalance,
          coinPrice: coinsPrices.last
        })
        total += parseFloat(calculatedBalance);
        break;
      }
      if (coinsPrices.symbol === coin.currency + '-UST') {
        let calculatedBalance = coinsPrices.last * coin.balance;
        coinsArray.push({
          coinName: coin.currency,
          coinBalance: calculatedBalance,
          coinPrice: coinsPrices.last
        })
        total += parseFloat(calculatedBalance);
      };
    };
  };
  // console.log('got Kucoin balance: ' + total)
  // console.log(coinsArray)
  return [total, coinsArray];
};
