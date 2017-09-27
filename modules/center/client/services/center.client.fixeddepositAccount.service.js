
(function () {
  angular.module('center').service('fixeddepositService', ['$http', '$q', '$localStorage', 'urls',
        function ($http, $q, $localStorage, url) {
          'use strict';

          return {
            fd_Open: function(data) {
              return $http.put(url.BASE + '/api/center/fdopen', data);
            },
            fd_Close: function(data) {
              return $http.put(url.BASE + '/api/center/fdclose', data);
            }
          };

        }]);
}());
