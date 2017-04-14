(function () {
  angular.module('center').service('emrService', ['$http', '$q', '$localStorage', 'urls',
        function ($http, $q, $localStorage, url) {
          'use strict';
          return {

            addEMR: function (data) {
              return $http.put(url.BASE + '/api/emr/update', data);
            },
            getEMR: function (centerID) {
              return $http.get(url.BASE + '/api/emr/get?centerId=' + centerID);
            },
            editEMR: function (inData) {
              return $http.put(url.BASE + '/api/emr/edit', inData);
            },
            addVITAL: function (inData) {
              return $http.put(url.BASE + '/api/emr/updateVital', inData);
            }
          };

        }]);
}());
