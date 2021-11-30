const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  capital: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  profit: {
    type: Number,
    required: true
  },
  commissionto: [{
    type: Schema.Types.ObjectId,
    ref: 'CoinsUser'
  }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('CoinsUser', UserSchema);