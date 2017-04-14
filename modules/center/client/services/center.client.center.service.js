
(function () {
  angular.module('center').service('centerService', ['$http', '$q', '$localStorage', 'urls',
        function ($http, $q, $localStorage, url) {
          'use strict';

          return {
            sendappCategory: function(data) {
              return $http.post(url.BASE + '/api/create/appcategory', data);
            },

            editCenterTime: function(data) {
              return $http.put(url.BASE + '/api/add/timings', data);
            },

            getCenter: function(data) {
              return $http.get(url.BASE + '/api/getCenterDetails?id=' + data);
            }
          };

        }]);
}());
