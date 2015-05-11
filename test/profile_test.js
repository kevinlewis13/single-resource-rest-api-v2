'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/profiles_test';
//does this create a new collection, or what?

require('../index');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;

chai.use(chaihttp);

var Profile = require('../models/Profile');

describe('profile API', function() {

  afterEach(function (done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should make a new user profile', function (done) {
    chai.request('localhost:3000')
      .post('/api/profiles')
      .send({name: 'test name'})
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('test name');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should validate the available property on new profiles', function (done) {
    chai.request('localhost:3000')
      .post('/api/profiles')
      .send({available: 'always'})
      .end(function (err, res) {
        expect(res.body.msg).to.eql('server error, try again');
        done();
      });
  });

  it('should return an array of profiles', function (done) {
    chai.request('localhost:3000')
      .get('/api/profiles')
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });

  });

  describe('needs existing profiles to work', function () {
    beforeEach(function (done) {
      var testProfile = new Profile({name: 'test name'});
      testProfile.save(function (err, data) {
        if (err) throw err;

        this.testProfile = data;
        done();
      }.bind(this));
    });

    it('should make a profile in a before block', function() {
      expect(this.testProfile.name).to.eql('test name');
      expect(this.testProfile).to.have.property('_id');
    });

    it('should be able to update a profile', function (done) {
      var profileId = this.testProfile._id;
      chai.request('localhost:3000')
        .put('/api/profiles/' + profileId)
        .send({about: 'likes candy'})
        .end(function (err, res) {
          console.log(res.body.msg);
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('updated successfully');
          done();
        });
    });

      it('should validate updates', function (done) {
      var profileId = this.testProfile._id;
      chai.request('localhost:3000')
        .put('/api/profiles/' + profileId)
        .send({available: 'off and on'})
        .end(function (err, res) {
          expect(res.body.msg).to.eql('server error, try again');
          done();
        });
    });

    it('should be able to delete a profile', function (done) {
      chai.request('localhost:3000')
        .del('/api/profiles/' + this.testProfile._id)
        .end(function (err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('deleted successfully');
          done();
        });
    });

  });
});
