const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  //*username and password are added from passport so no need to add them here by me (:
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