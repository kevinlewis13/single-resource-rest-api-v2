'use strict';

var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
  name: String,
  about: String,
  available: String
});

var Profile = mongoose.model('Profile', profileSchema);
//creates collection?

Profile.schema.path('available').validate(function (value) {
  return /true|false/i.test(value);
}, 'Value must be true or false');

module.exports = Profile;


