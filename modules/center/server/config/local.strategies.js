'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Staff = require('mongoose').model('Staff'),
  path = require('path'),
  config = require(path.resolve('./config/config'));


/**
 * Module init function
 */
module.exports = function (app, db) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    Staff.findOne({
      _id: id
    }, '-salt -password', function (err, user) {
      done(err, user);
    });
  });

  passport.use('local-center', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (username, password, done) {
    Staff.findOne({
      email: username.toLowerCase()
    }).populate('centerIds', '_id centerName').exec(function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid username or password'
        });
      }
      return done(null, user);
    });
  }));
  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};

