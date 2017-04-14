
(function () {
  angular.module('center').service('ConsultationService', ['$http', '$q', 'urls',
        function ($http, $q, url) {
          'use strict';
          return {
            getPatients: function (ownerID) {
              var urlToHit = url.BASE + '/api/getpatientlist?ownerID=' + ownerID;
              return $http.get(urlToHit);
            }
          };
        }
    ]);
}());

