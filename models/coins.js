const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoinSchema = new Schema({
  coin: { type: [String] }
});

module.exports = mongoose.model('Coins', CoinSchema);