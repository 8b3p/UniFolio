const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stakedCoinSchema = new Schema({
  coins: {
    type: Map,
    of: String,
  },
});

module.exports = mongoose.model("StakedCoins", stakedCoinSchema);
