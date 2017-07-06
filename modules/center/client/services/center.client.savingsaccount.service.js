
(function () {
  angular.module('center').service('savingsService', ['$http', '$q', '$localStorage', 'urls',
        function ($http, $q, $localStorage, url) {
          'use strict';

          return {
            savingsDeposite: function(data) {
              return $http.put(url.BASE + '/api/center/deposit', data);
            }
          };

        }]);
}());
