const coingecko = require('coingecko-api');
const StakedCoins = require('../models/stakedCoins');
const coingeckoClient = new coingecko();

module.exports.getBalance = async () => {
  let Data = await Promise.all([StakedCoins.findOne(), coingeckoClient.coins.fetch('akash-network', { tickers: false, community_data: false, developer_data: false, localization: false, sparkline: false, vs_currency: 'usd' })]);
  let data = Data[1];
  let Coins = Data[0]
  const price = data.data.market_data.current_price.usd;
  const balance = parseFloat(Coins.coins.get('AKT')) * price;
  return balance;
};
