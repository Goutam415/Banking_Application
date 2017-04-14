(function () {
  angular.module('center').service('patientService', ['$http', 'urls',
        function ($http, url) {
          'use strict';
          return {
            getPatientList: function (ownerID) {
              return $http.get(url.BASE + '/api/getpatientlist?ownerID=' + ownerID);
            }
          };
        }]);
}());
