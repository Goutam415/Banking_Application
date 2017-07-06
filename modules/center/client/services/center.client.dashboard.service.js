
(function () {
  angular.module('center').service('dashboardService', ['$http', '$q', '$localStorage', 'urls',
        function ($http, $q, $localStorage, url) {
          'use strict';

          return {
            createAccount: function(data) {
              return $http.post(url.BASE + '/api/center/createAccount', data);
            },
            savingsDeposite: function(data) {
              return $http.post(url.BASE + '/api/center/createAccount', data);
            }
          };

        }]);
}());
