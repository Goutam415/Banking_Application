(function () {
  angular.module('manager').service('managerService', ['$http', '$q', 'urls',
        function ($http, $q, url) {
          'use strict';
          var promise = $http.get(url.BASE + '/api/get/user');
          return {
            getmanager: function () {
              return $http.get(url.BASE + '/api/manager/list');
            },
            savemanager: function (data) {
              console.log(data);
              return $http.post(url.BASE + '/api/manager/create', data);
            },
            loginmanager: function (data) {
              var loginPromise = $http.post(url.BASE + '/api/login', data);
              loginPromise.success(function(params) {
                promise = $http.get(url.BASE + '/api/get/user');
              });
              return loginPromise;
            },
            cretaeCenter: function (data) {
              return $http.post(url.BASE + '/api/manager/addCenter', data);
            },
            getUserData: function () {
              return promise;
            },
            getCity: function(state) {
              return $http.get(url.BASE + '/api/get/city?state=' + state);
            },
            getRoles: function(state) {
              return $http.get(url.BASE + '/api/get/roles');
            }
          };
        }
    ]);
}());
