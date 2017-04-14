// save, show --controller's || add, get, update, delete-- services' side
// all get & post functions are named as functionality+tab_name --no caps
(function () {
  angular.module('center').service('drugCatalogService', ['$http', '$q', 'urls',
        function ($http, $q, url) {
          'use strict';
          return {
            // service methods to add
           // console.log("inside drug service");
            addDrug: function (data) {
              return $http.put(url.BASE + '/api/center/createDrugCat', data);
            },
            // service methods to show
            getDrug: function (centerId) {
              return $http.get(url.BASE + '/api/center/getDrugCat?center=' + centerId);
            },
            getDrugTypes: function(centerId) {
              return $http.get(url.BASE + '/api/center/getDrugType?center=' + centerId);
            },
            getDrugUnits: function(centerId) {
              return $http.get(url.BASE + '/api/center/getDrugUnits?center=' + centerId);
            },
            delDrug: function (id, inData) {
              return $http.delete(url.BASE + '/api/center/deleteDrugCat/' + id, inData);
            },
            addDrugType: function(data) {
              return $http.put(url.BASE + '/api/update/drugtype', data);
            },
            addDrugUnit: function(data) {
              return $http.put(url.BASE + '/api/update/drugUnit', data);
            }
          };
        }
    ]);
}());
