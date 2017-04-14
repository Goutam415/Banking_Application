// save, show --controller's || add, get, update, delete-- services' side

(function () {
  angular.module('center').service('procedureCatalogService', ['$http', '$q', 'urls',
        function ($http, $q, url) {
          'use strict';
          return {
            // Proc catalog's services
            saveProc: function (data) {
              return $http.put(url.BASE + '/api/center/createProcCat', data);
            },
            showProc: function (centerId) {
              return $http.get(url.BASE + '/api/center/getProcCat?center=' + centerId);
            },

            getProcCategories: function (centerId) {
              return $http.get(url.BASE + '/api/center/getProcCategories?center=' + centerId);
            },

            editProc: function (inData) {
              return $http.put(url.BASE + '/api/center/editProcCat', inData);
            },

            delProc: function(id) {
              return $http.delete(url.BASE + '/api/center/delProcCat?center=' + id);
            },
            addCategory: function(data) {
              return $http.put(url.BASE + '/api/update/procedurecategory', data);
            }

          };
        }
    ]);
}());
