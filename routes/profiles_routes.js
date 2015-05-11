'use strict';

var Profile = require('../models/Profile');

var bodyparser = require('body-parser');

var errorResponse = function(err, res) {
console.log(err);
return res.status(500).json({msg: 'server error, try again'});
};

module.exports = function (router) {
  router.use(bodyparser.json());

  router.get('/profiles', function (req, res) {
    Profile.find({}, function (err, data) {
      if (err) {
        errorResponse(err, res);
        return;
      }
      res.json(data);
    });
  });

  router.post('/profiles', function (req, res) {
    var newProfile = new Profile(req.body);
    newProfile.save(function (err, data) {
      if (err) {
        errorResponse(err, res);
        return;
      }
      res.json(data);
    });
  });

  router.put('/profiles/:id', function (req, res) {
    var updatedProfile = req.body;
    delete updatedProfile._id;

    //runValidators option from http://stackoverflow.com/questions/15627967/why-mongoose-doesnt-validate-on-update
    Profile.update({'_id': req.params.id}, updatedProfile, {runValidators: true}, function (err, data) {
      if (err) {
        errorResponse(err, res);
        return;
      }
      res.json({msg: 'updated successfully'});
    });
  });

  router.delete('/profiles/:id', function (req, res) {
    Profile.remove({'_id': req.params.id}, function (err, data) {
      if (err) {
        errorResponse(err, res);
        return;
      }
      res.json({msg: 'deleted successfully'});
    });
  });

};
