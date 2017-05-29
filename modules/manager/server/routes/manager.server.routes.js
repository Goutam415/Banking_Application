'use strict';

module.exports = function (app, db, initSession) {
  var express = require('express');
  var passport = require('passport');
  const SalesAdmin = require('mongoose').model('SalesAdmin');
  // create new route
  var router = express.Router();
  var config = require('../../../../config/config.js');
  var staticAssests = require('../config/config.js');
  var mailer = require('nodemailer');
  var path = require('path');
  var managerController = require('../controllers/manager.server.controller.js');
  var managerViewController = require('../controllers/manager.server.view.controller.js');
  var jsFiles = config.utils.getGlobbedPaths(staticAssests.client.lib.js, 'public/').concat(config.utils.getGlobbedPaths(staticAssests.client.js, 'public/'));
  var cssFiles = config.utils.getGlobbedPaths(staticAssests.client.lib.css, 'public/').concat(config.utils.getGlobbedPaths(staticAssests.client.css, 'public/'));

  var localStrategies = require('../config/local.strategies');

  app.locals.manager = {
    jsFiles: jsFiles,
    cssFiles: cssFiles
  };
   // initialize session
  initSession(router, db, config.baseUrls.manager.session);
  // initialize authentication process
  localStrategies(router, db);

  router.get('/', managerViewController.renderIndex);
  // API
/**
 * @api {post} manager/api/manager/create/ manager create manager service
 * @apiVersion 0.1.0
 * @apiName Create manager
 * @apiGroup Module:manager
 *
 * @apiParam {manager} manager_details manager is an object holding all the information of the user or manager.
 * @apiParam {center} Center_details center is an object holding all the information of the center.
 * @apiParam {subscriptionname} Subscription Type of the subscription.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError manager not matching
 * @apiError center not matching
 * @apiError subscriptionname not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"could not register the manager"
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "manager" , "center", "subscriptionname"},
 *           "location": "body",
 *           "messages": [
 *               "\"manager\" "center\" "subscriptionname\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.post('/api/manager/create/', managerController.createmanager);

/**
 * @api {get} manager/api/manager/list manager manager list service
 * @apiVersion 0.1.0
 * @apiName List manager
 * @apiGroup Module:manager
 *
 * @apiParam {_id} manager_details manager is an object holding all the information of the user or manager.
 * @apiParam {idsubscription} Center_details center is an object holding all the information of the center.
 * @apiParam {idaddress} Subscription Type of the subscription.
 * @apiParam {centerIds} Subscription Type of the subscription.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError manager not matching
 * @apiError center not matching
 * @apiError subscriptionname not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"could not register the manager"
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "manager" , "center", "subscriptionname"},
 *           "location": "body",
 *           "messages": [
 *               "\"manager\" "center\" "subscriptionname\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/manager/list', managerController.listmanager);

  // Add additional centers
/**
 * @api {post} manager/api/manager/addCenter manager Creating Additional Center service
 * @apiVersion 0.1.0
 * @apiName Additional Centers for Perticular manager
 * @apiGroup Module:manager
 *
 * @apiParam {idmanager} managerId manager identification number.
 * @apiParam {_id} CenterId Center Identification.
 * @apiParam {idOwner} OwnerId Identification number of the owner.
  * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError idmanager not matching
 * @apiError _id not matching
 * @apiError idOwner not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"could not create the additional centers."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "all"},
 *           "location": "body",
 *           "messages": [
 *               "\"all\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.post('/api/manager/addCenter', managerController.createAdditionalCenter);
  // router.get('/api/manager/subscriptionpackage/', managerController.);


/**
 * @api {post} manager/api/login manager Sale Login service
 * @apiVersion 0.1.0
 * @apiName Sales Login
 * @apiGroup Module:manager
 *
 * @apiParam {user} UserName "user" is an object containing Username of the manager.
 * @apiParam {user} Password "user" is an object containing Password of the manager.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError Username not matching
 * @apiError Password not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Invalid Credentials."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "email","password"},
 *           "location": "body",
 *           "messages": [
 *               "\"email\" "password\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.post('/api/login', managerController.saleLogin);


/**
 * @api {post} manager/api/get/user manager Get user service
 * @apiVersion 0.1.0
 * @apiName Get User
 * @apiGroup Module:manager
 *
 * @apiParam {session} User_Details_field "session" is a cookie that is passed to the database to fetch the specific user.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"Details are Displayed"
 *     }
 *
 * @apiError session cookie not matching or not available.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Error while fetching the details."
 *     }
 */

  router.get('/api/get/user', managerController.getUser);


  // get city list based on state
/**
 * @api {get} manager/api/get/city manager Get City service
 * @apiVersion 0.1.0
 * @apiName Get City
 * @apiGroup Module:manager
 *
 * @apiParam {stateId} State State of the City for which we are passing the number as parameter.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"City is Displayed"
 *
 *     }
 *
 * @apiError session cookie not matching or not available.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Error while fetching the city."
 *     }
 */

  router.get('/api/get/city', managerController.getCity);
  // get roles list from role collection
  router.get('/api/get/roles', managerController.getRoles);

  app.use(config.baseUrls.manager.path, router);
};
