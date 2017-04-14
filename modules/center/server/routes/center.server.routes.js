'use strict';

module.exports = function (app, db, initSession) {
  var express = require('express');
  // create new route
  var router = express.Router();
  var validate = require('express-validator');
  var config = require('../../../../config/config.js');
  var staticAssests = require('../config/config.js');
  var mailer = require('nodemailer');
  var localStrategies = require('../config/local.strategies');
  var path = require('path');
  var centerController = require('../controllers/center.server.controller.js');
  var emrController = require('../controllers/center.server.emr.controller.js');
  var appListController = require('../controllers/center.server.centersetting.appcategory.controller');
  var doctorController = require('../controllers/center.server.centersetting.doctor.controller');
  var commController = require('../controllers/center.server.communication.controller.js');
  var centerViewController = require('../controllers/center.server.view.controller.js');
  var taxCatalogController = require('../controllers/center.server.billing.taxCatalog.controller');
  var paymodeController = require('../controllers/center.server.billing.paymode.controller');
  var procedurecatalogController = require('../controllers/center.server.procedureCatalog.controller');
  var prescriptionController = require('../controllers/center.server.prescriptions.controller.js');
  var staffController = require('../controllers/center.server.staff.controller');
  var consultationController = require('../controllers/center.server.consultationpatientlist.controller.js');
  var calenderAppointmentController = require('../controllers/calender/center.server.appointment.controller.js');
  var treatmentPlansController = require('../controllers/center.server.treatmentPlan.controller.js');
  var multer = require('multer');
  var authorizationController = require('../controllers/center.authorization.controller.js');
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });

  var multerUpload = multer({ storage: storage });
  var jsFiles = config.utils.getGlobbedPaths(staticAssests.client.lib.js, 'public/').concat(config.utils.getGlobbedPaths(staticAssests.client.js, 'public/'));
  var cssFiles = config.utils.getGlobbedPaths(staticAssests.client.lib.css, 'public/').concat(config.utils.getGlobbedPaths(staticAssests.client.css, 'public/'));
  app.locals.center = {
    jsFiles: jsFiles,
    cssFiles: cssFiles
  };
  initSession(router, db, config.baseUrls.center.session);
  localStrategies(router, db);
  router.get('/', centerViewController.renderIndex);
  // API
  /**
 * @api {post} center/api/center/login center portal login service
 * @apiVersion 0.1.0
 * @apiName login
 * @apiGroup center:user
 *
 * @apiParam {email} email  email of user.
 * @apiParam {password} password password of user.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError cridentails not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :Invalid username or password"
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          "field": "email",
 *           "location": "body",
 *           "messages": [
 *               "\"email\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       },
 *       {
 *           "field": "password",
 *           "location": "body",
 *           "messages": [
 *               "\"password\" is required"
 *           ],
 *           "types": [
 *               "any.required"
 *           ]
 *       }
 *   ]
 *}
 */
  // center portal login
  router.post('/api/center/login', validate(centerController.validteLoginParams), centerController.login);

  // route for updating center details
  router.put('/api/update/center', centerController.updateCenter);

/**
* @api {post} center/api/update/staff/center center staffcenterID_update service * @apiVersion 0.1.0
* @apiName staffcenterID_update
* @apiGroup center:user
"any.required"
"field": "password", "location": "body", "messages": [
"\"password\" is required" ],
"types": [ "any.required"
￼*
* @apiParam {id} ID staffcenterID.
* @apiParam {updateid} UpdateID staffcenterID to which the old id is to be updated.
* @apiSuccess {String} status success. *
* @apiSuccessExample Success­Response:
* HTTP/1.1 200 OK *{
* status:"success"
*}
*
* @apiError ID not matching
*
* @apiErrorExample Error­Response:
* HTTP/1.1 4xx error
*{
* "message" : :Enter a valid center id" *}
*
* @apiError input not matching
* @apiErrorExample Error­Response:
*{
* "status": 400,
* "statusText": "Bad Request",
* "errors": [
*{
* "field": "ID",
* "location": "body",
* "messages": [
* "\"id\" is required"
* ], "types": [
" any.required"
*
* *] *} *]
*} */

  // update staff details
  router.put('/api/update/staff/center', validate(staffController.staffUpdateRequiredParams), staffController.updateStaffCenterId);

/**

* @api {get} center/api/create/get center Get center service

* @apiVersion 0.1.0

* @apiName CenterID

* @apiGroup center:user

*

* @apiParam {id} ID centerID.

*

* @apiSuccess {String} status success.

*

* @apiSuccessExample Success-Response:

* HTTP/1.1 200 OK

* {

* status:&quot;success&quot;

* }

*

* @apiError ID not matching

*

* @apiErrorExample Error-Response:

* HTTP/1.1 4xx error

* {

* &quot;message&quot; : :Enter a valid center id&quot;

* }

*

* @apiError input not matching

* @apiErrorExample Error-Response:

* {

* &quot;status&quot;: 400,

* &quot;statusText&quot;: &quot;Bad Request&quot;,

* &quot;errors&quot;: [

* {

* &quot;field&quot;: &quot;ID&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;id\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;any.required&quot;

* ]

* }

* ]

*}

*/

  // route for getting center details
  router.get('/api/create/get', centerController.getCenter);

/**

* @api {get} center/api/getCenterDetails center Get center details service

* @apiVersion 0.1.0

* @apiName center details

* @apiGroup center:user

* @apiParam {centerName} Name Centre Name

* @apiParam {centerAffilatedName} Affilated_Name Name of the university that is affiliated with.

* @apiParam {centerSpecialization} Specialization Field of specialization

* @apiParam {centerTin} TIN_No TIN No.

* @apiParam {centerEmail} Center_Email Mail id of the center

* @apiParam {centerContactNumber} Contact_Number contact no of the center

* @apiParam {dateofjoining} Subscription Subscription date

* @apiParam {centerTimezone} Timezone Timezone of the centre.

* @apiParam {subscription} subscription Type of the subscription.

* @apiParam {pincode} Pincode Pincode of the place.

* @apiParam {countryId} country name of the country has given a code.

* @apiParam {stateId} State name of the state has given a code.

* @apiParam {city} City name of the city

* @apiParam {addressLine1} Address1 Address of the centre that is located.

* @apiParam {addressLine2} Address2(optional) For more accurate place details.

* @apiSuccess {String} status success.

* @apiSuccessExample Success-Response:

* HTTP/1.1 200 OK

* {

* status:&quot;success&quot;

* }

*

* @apiError Name not matching

* @apiError Affilated_Name not matching

* @apiError Specialization not matching

* @apiError TIN_No not matching

* @apiError Center_Email not matching

* @apiError Contact_Number not matching

* @apiError Subscription not matching

* @apiError Timezone not matching

* @apiError subscription not matching

* @apiError Pincode not matching

* @apiError country not matching

* @apiError State not matching

* @apiError City not matching

* @apiError Address1 not matching

* @apiError Address2 not matching

* @apiErrorExample Error-Response:

* HTTP/1.1 4xx error

* {

* &quot;message&quot; : :&quot;Unsuccessfull&quot;

* }

* @apiError input not matching

* @apiErrorExample Error-Response:

* {

* &quot;status&quot;: 400,

* &quot;statusText&quot;: &quot;Bad Request&quot;,

* &quot;errors&quot;: [

* {

* &quot;field&quot;: &quot;centerName&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;centerName\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;string.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;centerAffilatedName&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;centerAffilatedName\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;string.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;centerSpecialization&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;centerSpecialization\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;string.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;centerTin&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;centerTin\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;Number.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;centerEmail&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;centerEmail\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;email.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;centerContactNumber&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;centerContactNumber\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;number.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;dateofjoining&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;dateofjoining\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;date.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;centerTimezone&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;centerTimezone\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;time.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;subscription&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;subscription\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;any.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;pincode&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;pincode\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;number.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;country&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;country\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;any.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;stateId&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;stateId\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;any.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;city&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;city\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;any.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;addressLine1&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;addressLine1\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;any.required&quot;

* ]

* },

* {

* &quot;field&quot;: &quot;addressLine2&quot;,

* &quot;location&quot;: &quot;body&quot;,

* &quot;messages&quot;: [

* &quot;\&quot;addressLine2\&quot; is required&quot;

* ],

* &quot;types&quot;: [

* &quot;any.required&quot;

* ]

* }

* ]

*}

*/
  // route for getting center details
  router.get('/api/getCenterDetails', centerController.getCenter);


/**
 * @api {get} center/api/create/center Create center service
 * @apiVersion 0.1.0
 * @apiName create center
 * @apiGroup center:user
 * @apiParam {centerName} Name Centre Name
* @apiParam {centerAffilatedName} Affilated_Name Name of the university that is affiliated with.
* @apiParam {centerSpecialization} Specialization Field of specialization
* @apiParam {centerTin} TIN_No TIN No.
* @apiParam {centerEmail} Center_Email Mail id of the center
* @apiParam {centerContactNumber} Contact_Number contact no of the center
* @apiParam {dateofjoining} Subscription Subscription date
* @apiParam {centerTimezone} Timezone Timezone of the centre.
* @apiParam {subscription} subscription Type of the subscription.
* @apiParam {pincode} Pincode Pincode of the place.
* @apiParam {countryId} country name of the country has given a code.
* @apiParam {stateId} State name of the state has given a code.
* @apiParam {city} City name of the city
* @apiParam {addressLine1} Address1 Address of the centre that is located.
* @apiParam {addressLine2} Address2(optional) For more accurate place details.
* @apiSuccess {String} status success.
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {
 *         status:"success"
 *     }
 *
 * @apiError Name not matching
 * @apiError Affilated_Name not matching
 * @apiError Specialization not matching
 * @apiError TIN_No not matching
 * @apiError Center_Email not matching
 * @apiError Contact_Number not matching
 * @apiError Subscription not matching
 * @apiError Timezone not matching
 * @apiError subscription not matching
 * @apiError Pincode not matching
 * @apiError country not matching
 * @apiError State not matching
 * @apiError City not matching
 * @apiError Address1 not matching
 * @apiError Address2 not matching
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Unsuccessfull"
 *     }
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          "field": "centerName",
 *           "location": "body",
 *           "messages": [
 *               "\"centerName\" is required"
 *           ],
 *           "types": [
 *              "string.required"
 *           ]
 *       },
 *      {
 *          "field": "centerAffilatedName",
 *           "location": "body",
 *           "messages": [
 *               "\"centerAffilatedName\" is required"
 *           ],
 *           "types": [
 *              "string.required"
 *           ]
 *       },
 *      {
 *          "field": "centerSpecialization",
 *           "location": "body",
 *           "messages": [
 *               "\"centerSpecialization\" is required"
 *           ],
 *           "types": [
 *              "string.required"
 *           ]
 *       },
 *      {
 *          "field": "centerTin",
 *           "location": "body",
 *           "messages": [
 *               "\"centerTin\" is required"
 *           ],
 *           "types": [
 *              "Number.required"
 *           ]
 *       },
 *      {
 *          "field": "centerEmail",
 *           "location": "body",
 *           "messages": [
 *               "\"centerEmail\" is required"
 *           ],
 *           "types": [
 *              "email.required"
 *           ]
 *       },
 *      {
 *          "field": "centerContactNumber",
 *           "location": "body",
 *           "messages": [
 *               "\"centerContactNumber\" is required"
 *           ],
 *           "types": [
 *              "number.required"
 *           ]
 *       },
 *      {
 *          "field": "dateofjoining",
 *           "location": "body",
 *           "messages": [
 *               "\"dateofjoining\" is required"
 *           ],
 *           "types": [
 *              "date.required"
 *           ]
 *       },
 *      {
 *          "field": "centerTimezone",
 *           "location": "body",
 *           "messages": [
 *               "\"centerTimezone\" is required"
 *           ],
 *           "types": [
 *              "time.required"
 *           ]
 *       },
 *      {
 *          "field": "subscription",
 *           "location": "body",
 *           "messages": [
 *               "\"subscription\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       },
 *      {
 *          "field": "pincode",
 *           "location": "body",
 *           "messages": [
 *               "\"pincode\" is required"
 *           ],
 *           "types": [
 *              "number.required"
 *           ]
 *       },
 *      {
 *          "field": "country",
 *           "location": "body",
 *           "messages": [
 *               "\"country\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       },
 *      {
 *          "field": "stateId",
 *           "location": "body",
 *           "messages": [
 *               "\"stateId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       },
 *      {
 *          "field": "city",
 *           "location": "body",
 *           "messages": [
 *               "\"city\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       },
 *      {
 *          "field": "addressLine1",
 *           "location": "body",
 *           "messages": [
 *               "\"addressLine1\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       },
 *      {
 *          "field": "addressLine2",
 *           "location": "body",
 *           "messages": [
 *               "\"addressLine2\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  // route for creating center
  router.post('/api/create/center', centerController.createCenter);

/**
 * @api {post} center/api/center/upload center Update profile image service
 * @apiVersion 0.1.0
 * @apiName Update Profile Image
 * @apiGroup center:user
 *
 * @apiParam {img} Picture Picture of the center.
 * @apiParam {id} ID Id of the center.
 *
 *
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot update the center picture."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "img","id"}
 *           "location": "body",
 *           "messages": [
 *               "\"img\" "id\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  // upload profile
  router.post('/api/center/upload', multerUpload.single('file'), centerController.updateProfileImage);

 /**
 * @api {post} center/api/create/appcategory center Create App List service
 * @apiVersion 0.1.0
 * @apiName Create App List
 * @apiGroup center:user
 *
 * @apiParam {centerId} CenterId ID of the center.
 *
 *
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create the AppList."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  // appointment category routes
  router.post('/api/create/appcategory', validate(appListController.createAppListValidations), appListController.createAppList);

 /**
 * @api {post} center/api/get/appcategory center Get App Category service
 * @apiVersion 0.1.0
 * @apiName Get app Category
 * @apiGroup center:user
 *
 * @apiParam {centerId} CenterId ID of the center.
 * @apiParam {query} Category "query" is an objective that holds the App Categrory.
 *
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot fetch the app category."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId", "query"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" "query\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  // get appointment category route
  router.get('/api/get/appcategory', appListController.getappCategory);


    // route for billing's TaxCatalog
 // router.post('/api/center/createTaxData', taxCatalogController.createTaxData);

/**
 * @api {get} center/getTaxData center Get Tax Data service
 * @apiVersion 0.1.0
 * @apiName Get Tax Data
 * @apiGroup center:user
 *
 * @apiParam {centerId} CenterId ID of the center.
 *
 *
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot fetch the Tax Data."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */
  router.get('/api/center/getTaxData', taxCatalogController.getTaxData);

/**
 * @api {post} center/editTaxData/:editId center Edit Tax Data service
 * @apiVersion 0.1.0
 * @apiName Edit Tax Data
 * @apiGroup center:user
 *
 * @apiParam {centerId} CenterId ID of the center.
 * @apiParam {id} ID  ID that is updated.
 *
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot edit the Tax Data."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","id"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" "id\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/center/editTaxData/:editId', taxCatalogController.editTaxData);


/**
 * @api {post} /api/center/delTaxData/:delId center Delete Tax service
 * @apiVersion 0.1.0
 * @apiName Delete Tax
 * @apiGroup center:user
 *
 * @apiParam {delId} ID ID of the Tax of the center that is to be removed.
 *
 *
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Delete."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "delId"}
 *           "location": "body",
 *           "messages": [
 *               "\"delId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.delete('/api/center/delTaxData/:delId', taxCatalogController.delTaxData);


 /**
 * @api {post} /api/center/createPaymodeData center Create Paymode Data service
 * @apiVersion 0.1.0
 * @apiName Create Paymode Data
 * @apiGroup center:user
 *
 * @apiParam {mode} Paymode Mode of payment.
 *
 * @apiParam {type} Type Type of payment.
 * @apiParam {fee} Fee Fees to be paid.
* @apiParam {centerId} CenterId Center Id of the center to which bill belongs to.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Create paymode data."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "mode","type","fee", "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"mode\" "type\" "fee" "centerId" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  // route for billing's Paymode
  router.post('/api/center/createPaymodeData', validate(paymodeController.createPaymodeDataValidations), paymodeController.createPaymodeData);

 /**
 * @api {get} /api/center/getPaymode center Get Paymode Data service
 * @apiVersion 0.1.0
 * @apiName Get Paymode.
 * @apiGroup center:user
 *
 * @apiParam {centerId} CenterId ID of the Center.
 *
 *
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Fetch paymode data."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/center/getPaymode', paymodeController.getPaymode);

/**
 * @api {post} /api/center/editPaymode/:editId center Edit Paymode service
 * @apiVersion 0.1.0
 * @apiName Get Paymode.
 * @apiGroup center:user
 *
 * @apiParam {centerId} CenterId ID of the Center.
 * @apiParam {editId} NewID ID of the edited mode.
 *
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot edit the paymode."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId", "editId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */


  router.put('/api/center/editPaymode/:editId', paymodeController.editPaymode);

/**
 * @api {post} /api/center/editPaymode/:editId center Edit Paymode service
 * @apiVersion 0.1.0
 * @apiName Get Paymode.
 * @apiGroup center:user
 *
 * @apiParam {centerId} CenterId ID of the Center.
 * @apiParam {delId} delID ID of the mode to be deleted.
 *
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError body not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot edit the paymode."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId", "editId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.delete('/api/center/delPaymode/:delId', paymodeController.delPaymode);

  // route for billing's //cancelled
  // router.post('/api/center/createStatus', cancelController.cre);
  // router.get('/api/center/getStatus', cancelController.cre);

  // route for procedure Catalog
  // router.post('/api/center/createProcCat', procedurecatalogController.createProcedureCatalog);

/**
 * @api {post} /api/center/createProcCat Creating procedure catalog service
 * @apiVersion 0.1.0
 * @apiName create procedure catalog.
 * @apiGroup Module:center.
 *
 * @apiParam {idCatalog} CatelogId ID of the catalog.
 * @apiParam {procedureName} Procedure name of the procedure.
 * @apiParam {procedureCategory} Category Procedure category.
 * @apiParam {procedureCost} Cost Price to be paid.
 * @apiParam {xTooth} Tooth Tooth.
 * @apiParam {notes} Notes Comments.
 * @apiParam {isTaxTDS} TaxTDS TaxTDS.
 * @apiParam {isTaxVAT} TaxVAT TaxVAT.
 * @apiParam {idCategory} Category Category.
 * @apiParam {idCenter} CenterId ID of the Center.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError idCatalog not matching
 * @apiError procedureName not matching
 * @apiError procedureCategory not matching
 * @apiError procedureCost not matching
 * @apiError xTooth not matching
 * @apiError notes not matching
 * @apiError isTaxTDS not matching
 * @apiError isTaxVAT not matching
 * @apiError idCategory not matching
 * @apiError idCenter not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create procedure catalog."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "idCatalog", "procedureName", "procedureCategory","procedureCost","xTooth","notes","isTaxTDS","isTaxVAT","idCategory","centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"idCatalog\", "procedureName\", "procedureCategory","procedureCost","xTooth","notes","isTaxTDS","isTaxVAT","idCategory","centerId" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/center/createProcCat', procedurecatalogController.createProcedureCatalog);
  router.put('/api/update/procedurecategory', procedurecatalogController.createProcedureCategory);


/**
 * @api {get} /api/center/getProcCat Get procedure catalog service
 * @apiVersion 0.1.0
 * @apiName get procedure catalog.
 * @apiGroup Module:center.
 * @apiParam {idCenter} CenterId ID of the Center.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError idCenter not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Fetch procedure catalog."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/center/getProcCat', procedurecatalogController.getProcedureCatalog);

/**
 * @api {get} /api/center/getProcCategories Get procedure type service
 * @apiVersion 0.1.0
 * @apiName get procedure type.
 * @apiGroup Module:center.
 * @apiParam {idCenter} CenterId ID of the Center.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError idCenter not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Fetch procedure type."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/center/getProcCategories', procedurecatalogController.getProcType);

 /**
 * @api {post} /api/center/editProcCat Update procedure catalog service
 * @apiVersion 0.1.0
 * @apiName Update procedure catalog.
 * @apiGroup Module:center.
 *
 * @apiParam {idCatalog} CatelogId ID of the catalog.
 * @apiParam {procedureName} Procedure name of the procedure.
 * @apiParam {procedureCategory} Category Procedure category.
 * @apiParam {procedureCost} Cost Price to be paid.
 * @apiParam {xTooth} Tooth Tooth.
 * @apiParam {notes} Notes Comments.
 * @apiParam {isTaxTDS} TaxTDS TaxTDS.
 * @apiParam {isTaxVAT} TaxVAT TaxVAT.
 * @apiParam {idCategory} Category Category.
 * @apiParam {idCenter} CenterId ID of the Center.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError idCatalog not matching
 * @apiError procedureName not matching
 * @apiError procedureCategory not matching
 * @apiError procedureCost not matching
 * @apiError xTooth not matching
 * @apiError notes not matching
 * @apiError isTaxTDS not matching
 * @apiError isTaxVAT not matching
 * @apiError idCategory not matching
 * @apiError idCenter not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot update procedure catalog."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "idCatalog", "procedureName", "procedureCategory","procedureCost","xTooth","notes","isTaxTDS","isTaxVAT","idCategory","centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"idCatalog\", "procedureName\", "procedureCategory","procedureCost","xTooth","notes","isTaxTDS","isTaxVAT","idCategory","centerId" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/center/editProcCat', procedurecatalogController.updateProcedureCatalog);

/**
 * @api {post} /api/center/delProcCat Delete Procedure Catalog service
 * @apiVersion 0.1.0
 * @apiName Delete procedure Catalog.
 * @apiGroup Module:center.
 * @apiParam {idCenter} CenterId ID of the Center.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError idCenter not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Delete procedure type."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.delete('/api/center/delProcCat', procedurecatalogController.deleteProcedureCatalog);

  // post treatment plans details
  router.put('/api/save/treatmentPlans', treatmentPlansController.saveTreatmentPlans);

  // route for prescription/Drug Catalog

/**
 * @api {post} /api/center/createDrugCat Create Drug Catalog service
 * @apiVersion 0.1.0
 * @apiName Create Drug Catalog.
 * @apiGroup Module:center.
 * @apiParam {DrugName} DrugName Name of the drug.
 * @apiParam {DrugStrength} Strength Strength of the drug.
 * @apiParam {DrugInstruction} Instruction Instructions(optional).
 * @apiParam {DrugTypeName} DrugTypeName Type name of the drug..
 * @apiParam {Unit} Unit Measurement unit.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError DrugName input not matching
 * @apiError DrugStrength input not matching
 * @apiError DrugInstruction input not matching
 * @apiError DrugTypeName input not matching.
 * @apiError Unit input not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create drug catalog."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "DrugName","DrugStrength","DrugIndtruction","DrugTypeName","Unit"}
 *           "location": "body",
 *           "messages": [
 *               "\"DrugName\","DrugStrength\","DrugIndtruction\","DrugTypeName\","Unit\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/center/createDrugCat', prescriptionController.createDrugCat);

/**
 * @api {post} /api/update/drugtype Create Drug Type service
 * @apiVersion 0.1.0
 * @apiName Create Drug Type.
 * @apiGroup Module:center.
 * @apiParam {centerId} centerID ID of the center.
 * @apiParam {DrugName} DrugName Name of the drug.
 * @apiParam {DrugStrength} Strength Strength of the drug.
 * @apiParam {DrugInstruction} Instruction Instructions(optional).
 * @apiParam {DrugTypeName} DrugTypeName Type name of the drug..
 * @apiParam {Unit} Unit Measurement unit.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError centerId not matching
 * @apiError DrugName not matching
 * @apiError DrugStrength not matching
 * @apiError DrugInstruction not matching
 * @apiError DrugTypeName not matching.
 * @apiError Unit not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create drug Type.."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","DrugName","DrugStrength","DrugIndtruction","DrugTypeName","Unit"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\", "DrugName\","DrugStrength\","DrugIndtruction\","DrugTypeName\","Unit\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/update/drugtype', prescriptionController.createDrugType);

/**
 * @api {post} /api/update/drugUnit Create Drug Unit service
 * @apiVersion 0.1.0
 * @apiName Create Drug Unit.
 * @apiGroup Module:center.
 * @apiParam {centerId} centerID ID of the center.
 * @apiParam {DrugName} DrugName Name of the drug.
 * @apiParam {DrugStrength} Strength Strength of the drug.
 * @apiParam {DrugInstruction} Instruction Instructions(optional).
 * @apiParam {DrugTypeName} DrugTypeName Type name of the drug..
 * @apiParam {Unit} Unit Measurement unit.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError centerId not matching
 * @apiError DrugName not matching
 * @apiError DrugStrength not matching
 * @apiError DrugInstruction not matching
 * @apiError DrugTypeName not matching.
 * @apiError Unit not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create drug Unit."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","DrugName","DrugStrength","DrugIndtruction","DrugTypeName","Unit"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\", "DrugName\","DrugStrength\","DrugIndtruction\","DrugTypeName\","Unit\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/update/drugUnit', prescriptionController.createDrugUnit);


/**
 * @api {get} /api/center/getDrugCat getting the drug Catalog
 * @apiVersion 0.1.0
 * @apiName get drug catalog.
 * @apiGroup Module:center.
 *
 * @apiParam {centerId} CenterId ID of the center.
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError centerID not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create centerID."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */
  router.get('/api/center/getDrugCat', prescriptionController.getDrugCat);


    /**
 * @api {get} /api/center/getDrugType Creating procedure drugType service
 * @apiVersion 0.1.0
 * @apiName create drugType catalog.
 * @apiGroup Module:center.
 *
 * @apiParam {centerId}  centerID of the Center.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError centerId not matching

 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create procedure center."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/center/getDrugType', prescriptionController.getDrugType);


 /**
 * @api {get} /api/center/getDrugUnits Creating procedure drugUnit service
 * @apiVersion 0.1.0
 * @apiName create drugUnit catalog.
 * @apiGroup Module:center.
 *
 * @apiParam {centerID} centerId ID of the center.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError centerID not matching

 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create centerID."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/center/getDrugUnits', prescriptionController.getDrugUnit);


  /**
 * @api {delete} /api/center/deleteDrugCat/:delId deleting ID of drugCat service
 * @apiVersion 0.1.0
 * @apiName deleting drugid.
 * @apiGroup Module:center.
 *
 * @apiParam {delId} delId ID of the drug.

 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError delId not matching

 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot delete drugId."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "delId"}
 *           "location": "body",
 *           "messages": [
 *               "\"delId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.delete('/api/center/deleteDrugCat/:delId', prescriptionController.deleteDrugData);

  // appointment category routes

/**
 * @api {post} /api/create/appcategory Creating application List service
 * @apiVersion 0.1.0
 * @apiName create application List.
 * @apiGroup Module:center.
 *
 * @apiParam {centerId} centerId ID of the center.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError centerId not matching

 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create centerId."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.post('/api/create/appcategory', appListController.createAppList);


  // update EMR

 /**
 * @api {put} /api/emr/update Creating emr update service
 * @apiVersion 0.1.0
 * @apiName update emr service.
 * @apiGroup Module:center.
 *
 * @apiParam {centerId} centerId ID of the Center.
 * @apiParam {observations} observations name.
 * @apiParam {complaints} Complaint name.
 * @apiParam {fileLabels} file labels name.
 * @apiParam {diagnoses} diagnoses name.
 * @apiParam {investigations} investigations name.
 * @apiParam {notes} notes notes names.
 * @apiParam {vitals} default_temperature_unit.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError centerId not matching
 * @apiError observations not matching
 * @apiError complaints not matching
 * @apiError filelabels not matching
 * @apiError diagnoses not matching
 * @apiError notes not matching
 * @apiError investigaions not matching
 * @apiError vitals not matching

 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot update catalog service."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId", "observations","complaints","fieldlabels","diagnoses","notes","investigations","vitals"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/emr/update', validate(emrController.postValidations), emrController.update);


  // update vital

// update vital
     /**
 * @api {put} /api/emr/updateVital Creating update vital service
 * @apiVersion 0.1.0
 * @apiName update vital service.
 * @apiGroup Module:center.
 *
 * @apiParam {centerId} centerId ID of the Center.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError centerId not matching

 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot update vital catalog."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/emr/updateVital', validate(emrController.postValidations), emrController.updateVital);

  //  get EMR
/**
 * @api {get} /api/emr/get Creating EMR service
 * @apiVersion 0.1.0
 * @apiName create EMR service.
 * @apiGroup Module:center.
 *
 * @apiParam {centerId} CenterId ID of the catalog.

 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *

 * @apiError CenterId not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create EMR vital."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/emr/get', validate(emrController.getValidations), emrController.getEMR);

  //  Edit Individual EMR
/**
 * @api {put} /api/emr/edit Creating procedure EMR edit
 * @apiVersion 0.1.0
 * @apiName create procedure EMR edit.
 * @apiGroup Module:center.
 *
 * @apiParam {inData} inData .

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError inData not matching

 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot edit EMR."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "inData"}
 *           "location": "body",
 *           "messages": [
 *               "\"inData\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/emr/edit', emrController.editEMR);


  // update all smstemplates

/**
 * @api {put} /api/templates/updatesms Creating update SMS service
 * @apiVersion 0.1.0
 * @apiName create  update sms service.
 * @apiGroup Module:center.
 *
 * @apiParam {centerId} centerId ID of the Center.
 * @apiParam {templateId} templateId name of the template.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError CenterId not matching
 * @apiError templateId not matching

 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create update sms procedure."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId", "templateId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\", is required"
 *           ],
 *  [
 *               "\"centerId\", is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/templates/updatesms', commController.updateSMS);

  // update all email templates for centerId
/**
 * @api {put} /api/templates/updateemail updating an email
 * @apiVersion 0.1.0
 * @apiName update an email.
 * @apiGroup Module:center.
 *
 * @apiParam {center_id} CenterId ID of the center.
 * @apiParam {TemplateId} template id of the template.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError center_id not matching
 * @apiError TemplateId not matching

 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot update an email ."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId", "TemplateId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ], [
 *               "\"TemplateId\" is required"
 *           ],
 *
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */
  router.put('/api/templates/updateemail', commController.updateEmail);

  // update all settings for communication validate(commController.updateSettingsValidations)
/**
 * @api {put} /api/communication/updatesettings updating
 * @apiVersion 0.1.0
 * @apiName update settings.
 * @apiGroup Module:center.
 *
 * @apiParam {center_id} CenterId ID of the center.


 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError center_id not matching


 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot update the settings ."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */
  router.put('/api/communication/updatesettings', validate(commController.settingsValidations), commController.updateSettingsBox);

  // get loged in user profile
/**
 * @api {get} /api/getuser getting user details
 * @apiVersion 0.1.0
 * @apiName create a user .
 * @apiGroup Module:center.
 *
 * @apiParam  userDetails {there is a cookie which fetches the data} details of the user.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError userDetails not matching

 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot get user details ."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","username"}
 *           "location": "body",
 *           "messages": [
 *               "\"userId\" is required"
 *           ],[
 *               "\"username\" is required"
 *           ],

 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */
  router.get('/api/getuser', staffController.getUser);
   // get all SMS templates from Media
/**
 * @api {get} /api/communication/listsms getting smstemplates
 * @apiVersion 0.1.0
 * @apiName sending sms .
 * @apiGroup Module:center.
 *
 * @apiParam  center_Id centerId id of the center
 * * @apiParam  Template_Id TemplateId id of the template
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError sms not matching

 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot get sms details ."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","TemplateId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],[
 *               "\TemplateId\" is required"
 *           ],

 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */
  router.get('/api/communication/listsms', commController.getSMS);

  // get all email templates
/**
 * @api {get} /api/communication/listemail getting  email templates
 * @apiVersion 0.1.0
 * @apiName sending email .
 * @apiGroup Module:center.
 *
 * @apiParam  center_Id centerId id of the center
 * * @apiParam  Template_Id TemplateId id of the template
 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError email not matching

 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot get email details ."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","TemplateId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],[
 *               "\TemplateId\" is required"
 *           ],

 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */
  router.get('/api/communication/listemail', commController.getEmail);

  // route for creating staff
  router.post('/api/center/staff/create', centerController.createStaff);
 // route for creating doctor

  router.post('/api/doctor/create', centerController.createDoctor);
 // route for getting doctor
  router.get('/api/get/doctor', validate(centerController.getDoctorsParams), centerController.getDoctor);

  // route for getting doctor
/**
 * @api {Get} /api/get/staff Get Staff service
 * @apiVersion 0.1.0
 * @apiName Get Staff.
 * @apiGroup Module:center.
 * @apiParam {centerId} centerID ID of the center.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError centerId not matching.
 * @apiError Unit not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Fetch The Staff."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"cenetrId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/get/staff', centerController.getStaff);

  // route for update profile -- now only img
/**
 * @api {post} /api/center/staff/updateProfile Update Profile Image service
 * @apiVersion 0.1.0
 * @apiName Get Staff.
 * @apiGroup Module:center.
 * @apiParam {centerId} centerID ID of the center.
 * @apiParam {img} Image Image of the profile.
 * @apiParam {imgType} ImageType Type of the image.
 * @apiParam {profileId} ProfileID ID of the Profile.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError centerId not matching.
 * @apiError img not matching.
 * @apiError imgType not matching.
 * @apiError profileId not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Update the profile Image."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","img","imgType","profileId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\","img\","imgType\","profileId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.post('/api/center/staff/updateProfile', centerController.updateProfileImage);


  // route for billing's TaxCatalog
/**
 * @api {post} /api/center/createTaxData Create tax data service
 * @apiVersion 0.1.0
 * @apiName Create tax data.
 * @apiGroup Module:center.
 * @apiParam {taxName} centerID ID of the center.
 * @apiParam {taxPercentage} Image Image of the profile.
 * @apiParam {taxValue} ImageType Type of the image.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError taxName not matching.
 * @apiError taxPercentage not matching.
 * @apiError taxValue not matching.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create tax Data."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "taxName","taxPercentage","taxValue"}
 *           "location": "body",
 *           "messages": [
 *               "\"taxName\","taxPercentage\","taxValue\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.post('/api/center/createTaxData', validate(taxCatalogController.createTaxDataValidations), taxCatalogController.createTaxData);

  // route for billing's Paymode
  // route for center timings

 // router.post('/api/center/createTaxData', taxController.createTaxData);
 // router.get('/api/center/getTaxes', taxController.getTax);

  // update center timings
  // router.put('/api/add/timings', validate(centerController.updateCenterTimeValidations), centerController.updateCenterTime);

/**
 * @api {post} /api/add/timings Update Center Time service
 * @apiVersion 0.1.0
 * @apiName Update Center Time.
 * @apiGroup Module:center.
 * @apiParam {centerId} centerID ID of the center.
 * @apiParam {Sunday} Sunday Timing on Sunday.
 * @apiParam {Monday} Monday Timing on Monday.
 * @apiParam {Tuesday} Tuesday Timing on Tuesday.
 * @apiParam {Wednesday} Wednesday Timing on Wednesday.
 * @apiParam {Thursday} Thursday Timing on Thursday.
 * @apiParam {Friday} Friday Timing on Friday.
 * @apiParam {Saturday} Saturday Timing on Saturday.
 * @apiParam {startTime} StartTime Start Timing on everyday.
 * @apiParam {endTime} EndTIme Start Timing on everyday.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError centerId not matching
 * @apiError Sunday not matching
 * @apiError Monday not matching
 * @apiError Tuesday not matching
 * @apiError Wednesday not matching.
 * @apiError Thursday not matching.
 * @apiError Friday not matching.
 * @apiError Saturday not matching.
 * @apiError Unit not matching.
 * @apiError StartTiming not matching.
 * @apiError EndTiming not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Update Center Time."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","StartTime","EndTime"}
 *           "location": "body",
 *           "messages": [
 *               "\"cenetrId","Sunday\","Monday\","Tuesday\","Wednesday\","Thursday\","Friday\","Saturday\","StartTime\","EndTime\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/add/timings', centerController.updateCenterTime);

  // get doctor details

/**
 * @api {Get} /api/get/registerDoctor Get Doctor service
 * @apiVersion 0.1.0
 * @apiName Get Doctor.
 * @apiGroup Module:center.
 * @apiParam {centerId} centerID ID of the center.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError centerId not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Fetch The Doctor."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"cenetrId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/get/registerDoctor', staffController.getDoctor);

  // get staff details

/**
 * @api {get} /api/get/registerStaff Creating procedure get staff service
 * @apiVersion 0.1.0
 * @apiName create procedure get staff.
 * @apiGroup Module:center.
 *
 * @apiParam {CenterId} CenterId ID of the catalog.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError CenterId not matching

 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot create procedure get staff."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/get/registerStaff', staffController.getStaff);

  // update staff notification details

/**
 * @api {put} /api/add/staffnotifications Creating procedure add staff notifications
 * @apiVersion 0.1.0
 * @apiName create procedure add staff notifications.
 * @apiGroup Module:center.
 *
 * @apiParam {scheduleSMS} scheduleSMS .
 * @apiParam {scheduleEmail} scheduleEmail .
 * @apiParam {confirmationSMS} confirmationSMS.
 * @apiParam {confirmationEmail} confirmationEmail.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError scheduleSMS not matching
 * @apiError scheduleEmail not matching
 * @apiError confirmationSMS not matching
 * @apiError confirmationEmail not matching

 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot update staff notifucation."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "scheduleSMS","scheduleEmail","confirmationSMS","confirmationEmail"}
 *           "location": "body",
 *           "messages": [
 *               "\"scheduleSMS\" is required"
 *           ],
 * [
 *               "\"scheduleEmail\" is required"
 *           ],
 * [
 *               "\"confirmationSMS\" is required"
 *           ],[
 *               "\"confirmationEmail\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */
  router.put('/api/add/staffnotifications', staffController.updateStaffNotfications);

  // add doctor timings
  // router.put('/api/add/doctortimings', validate(doctorController.setDoctorTimingsValidations), doctorController.setDoctorTimings);
  // add doctor timings

/**
 * @api {put} /api/add/doctortimings  Add doctor clinic visit timings
 * @apiVersion 0.1.0
 * @apiName create add doctor clinic visit timing .
 * @apiGroup Module:center.
 *
 * @apiParam {Sunday} Sunday.
 * @apiParam {Monday} Monday.
 * @apiParam {Tuesday} Tuesday.
 * @apiParam {Wednesday} Wednesday.
 * @apiParam {Thursday} Thursday.
 * @apiParam {Friday}  Friday.
 * @apiParam {Saturday} Saturday.

 * @apiSuccess {String} status success.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 *
 * @apiError Sunday not matching
 * @apiError Monday not matching
 * @apiError Tuesday not matching
 * @apiError Wednesday not matching
 * @apiError Thursday not matching
 * @apiError Friday not matching
 * @apiError Saturday not matching

 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot add doctor timings."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "Sunday","Monday","Tuesday","Wednesday" ,"Thursday","Friday","Saturday"}
 *           "location": "body",
 *           "messages": [
 *               "\"Sunday\" is required"
 *           ],
 * [
 *               "\"Monday\" is required"
 *           ],
 * [
 *               "\"Tuesday\" is required"
 *           ],
 * [
 *               "\"Wednesday\" is required"
 *           ],
 * [
 *               "\"Thursday\" is required"
 *           ],
 * [
 *               "\"Friday\" is required"
 *           ],
 * [
 *               "\"Saturday\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/add/doctortimings', doctorController.setDoctorTimings);

  // edit doctor timings

/**
 * @api {post} /api/edit/doctortimings Edit Doctor Timings service
 * @apiVersion 0.1.0
 * @apiName Edit Doctor Timing.
 * @apiGroup Module:center.
 * @apiParam {centerId} centerID ID of the center.
 * @apiParam {Sunday} Sunday Timing on Sunday.
 * @apiParam {Monday} Monday Timing on Monday.
 * @apiParam {Tuesday} Tuesday Timing on Tuesday.
 * @apiParam {Wednesday} Wednesday Timing on Wednesday.
 * @apiParam {Thursday} Thursday Timing on Thursday.
 * @apiParam {Friday} Friday Timing on Friday.
 * @apiParam {Saturday} Saturday Timing on Saturday.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError centerId not matching
 * @apiError Sunday not matching
 * @apiError Monday not matching
 * @apiError Tuesday not matching
 * @apiError Wednesday not matching.
 * @apiError Thursday not matching.
 * @apiError Friday not matching.
 * @apiError Saturday not matching.
 * @apiError Unit not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Update Doctor Timings."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"}
 *           "location": "body",
 *           "messages": [
 *               "\"cenetrId","Sunday\","Monday\","Tuesday\","Wednesday\","Thursday\","Friday\","Saturday\" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/edit/doctortimings', staffController.editDoctorTimings);
// edit appointment category route

/**
 * @api {post} /api/edit/appcategory Edit App Category service
 * @apiVersion 0.1.0
 * @apiName Edit App Category.
 * @apiGroup Module:center.
 *
 * @apiParam {centerId} centerID ID of the center.
 * @apiParam {categoryId} CategoryID ID of the category.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError centerId not matching
 * @apiError categoryID not matching
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot Edit App category."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "centerId","categoryID"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId","categoryID" is required"
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.put('/api/edit/appcategory', appListController.editAppCategory);
  // get patient List

/**
 * @api {get} /api/edit/appcategory Get patient list service
 * @apiVersion 0.1.0
 * @apiName get patient list.
 * @apiGroup Module:center.
 *
 * @apiParam {ownerId} centerID ID of the center.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError ownerId not matching.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot fetch patient List."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "ownerId"}
 *           "location": "body",
 *           "messages": [
 *               "\"ownerId\" is required."
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/getpatientlist', validate(consultationController.validatePatientList), consultationController.getPatientList);
  // appointment category routes
  router.post('/api/create/appcategory', appListController.createAppList);

  // update center timings
  router.put('/api/add/timings', centerController.updateCenterTime);

//   // post staff notification settings
//   router.post('/api/add/staffnotifications', staffnotificationcontroller.setnotifications);

/**
 * @api {post} /api/save/appointment Creating Appointment service
 * @apiVersion 0.1.0
 * @apiName Creating Appointment.
 * @apiGroup Module:center.
 * @apiParam {idPatient} PatientID ID of the patient.
 * @apiParam {idDoctor} doctorID ID of the doctor.
 * @apiParam {title} Title Title.
 * @apiParam {start} Start Start date.
 * @apiParam {allDay} Day Day.
 * @apiParam {type} TypeOfAppointment AppointmentType.
 * @apiParam {calColor} CalenderColour Calender Colour.
 * @apiParam {info} Information Information.
 * @apiParam {status} Status Status.
 * @apiParam {idCenter} centerID ID of the center.
 * @apiParam {idCustomer} customerID ID of the customer.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError idPatient not matching.
 * @apiError idDoctor not matching.
 * @apiError title not matching.
 * @apiError start not matching.
 * @apiError allDay not matching.
 * @apiError type not matching.
 * @apiError calColor not matching.
 * @apiError info not matching.
 * @apiError status not matching.
 * @apiError idCenter not matching.
 * @apiError idCustomer not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot fetch patient List."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "idPatient","idDoctor","title","start","allDay","type","calColor","info","status","idCenter","idCustomer"}
 *           "location": "body",
 *           "messages": [
 *               "\"idPatient\","idDoctor\","title\","start\","allDay\","type\","calColor\","info\","status\","idCenter\","idCustomer\" is required."
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  // save appointment module
  router.post('/api/save/appointment', validate(calenderAppointmentController.validateSaveAppointment), calenderAppointmentController.createAppointment);


  // get appointment based on center
/**
 * @api {get} /api/getappointmentsbycenterid Get Appointment service
 * @apiVersion 0.1.0
 * @apiName Creating Appointment.
 * @apiGroup Module:center.
 * @apiParam {centerId} CenterID ID of the Center.
 * @apiSuccess {String} status success.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         status:"success"
 *     }
 * @apiError centerID not matching.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 4xx error
 *     {
 *       "message" : :"Cannot fix the appointment."
 *     }
 *
 *  @apiError input not matching
 *  @apiErrorExample Error-Response:
 * {
 *  "status": 400,
 *  "statusText": "Bad Request",
 *   "errors": [
 *       {
 *          {"field": "CenterId"}
 *           "location": "body",
 *           "messages": [
 *               "\"centerId\" is required."
 *           ],
 *           "types": [
 *              "any.required"
 *           ]
 *       }
 *   ]
 *}
 */

  router.get('/api/getappointmentsbycenterid', validate(calenderAppointmentController.validateGetAppointment), calenderAppointmentController.getAppointment);

  router.use(function(err, req, res, next) {
    if (err) {
      res.status(400).json(err);
    } else {
      next();
    }
  });
  app.use(config.baseUrls.center.path, router);
};
