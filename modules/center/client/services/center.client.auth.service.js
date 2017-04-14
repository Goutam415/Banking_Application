(function () {
  angular.module('center').service('Auth', ['$http', '$q', '$localStorage', 'urls',
        function ($http, $q, $localStorage, url) {
          'use strict';
          var currentCenterId = null;
          var promise = null;
          var Auth = {
            login: function (data) {
              var loginPromise = $http.post(url.BASE + '/api/center/login', data);
              loginPromise.success(function(params) {
                Auth.initiateUserService();
               // promise.centerIds.map
              });
              return loginPromise;
            },
            initiateUserService: function() {
              promise = $http.get(url.BASE + '/api/getuser');
            },
            getCenterId: function() {
              return localStorage.getItem('cid');
            },
            setCenterId: function(cid) {
              console.log(cid);
              localStorage.setItem('cid', cid);
            },
            isLoggedIn: function () {
              return !!($localStorage.get('token'));
            },
            logout: function () {
              console.log(url.BASE + '/logout');
              var deffered = $q.defer();
              $http.get(url.BASE + '/logout').success(function (d) {
                console.log(d);
                delete $localStorage.token;
                deffered.resolve();
              });
              return deffered.promise;
            },
            forgotPass: function (email) {
              return $http.get(url.BASE + '/forgot?email=' + email);
            },
            getUser: function () {
              return promise;
            },
            isAdmin: function () {
              return true;
            },
            isDoctor: function () {
              return true;
            },
            getRole: function () {
              return $localStorage.token.role;

            },
            getOwnerId: function () {
             // return
            },
            getCenter: function () {
              return {};
            }
          };
          Auth.initiateUserService();
          return Auth;
        }
    ]);
}());
