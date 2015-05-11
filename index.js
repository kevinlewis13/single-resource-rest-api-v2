'use strict';

var mongoose = require('mongoose');
var express = require('express');

var app = express();

var router = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/profiles_development');
//creates collection? database?

require('./routes/profiles_routes')(router);

app.use('/api', router);

app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port ' + (process.env.PORT || 3000));
});
