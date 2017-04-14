'use strict';

var validator = require('validator');
var logger = require('winston');
var config = require('../../../../config/config.js');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  logger.info('inside render of center module');
  var safeUserObject = null;
  res.render('modules/center/server/views/index', {
      // TODO think for elegent approach
    config: config.baseUrls
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
