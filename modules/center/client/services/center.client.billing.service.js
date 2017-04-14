// save, show --controller's || add, get, update, delete-- services' side
// all get & post functions are named as functionality+tab_name --no caps
(function () {
  angular.module('center').service('billingService', ['$http', '$q', 'urls',
        function ($http, $q, url) {
          'use strict';
          return {
            // tax catalog's services
            saveTax: function (data) {
              // console.log('----inside saveTax() services----');
              return $http.post(url.BASE + '/api/center/createTaxData', data);
            },
            showTax: function (centerId) {
              // console.log('----inside showTax() services-----');
              return $http.get(url.BASE + '/api/center/getTaxData?center=' + centerId);
            },

            editTax: function (id, inData) {
              return $http.put(url.BASE + '/api/center/editTaxData/' + id, inData);
            },

            delTax: function(id) {
              return $http.delete(url.BASE + '/api/center/delTaxData/' + id);
            },

            // paymode's services
            savepmd: function (data) {
              return $http.post(url.BASE + '/api/center/createPaymodeData', data);
            },
            showpmd: function (centerId) {
              return $http.get(url.BASE + '/api/center/getPaymode?center=' + centerId);
            },
            delpmd: function(id) {
              return $http.delete(url.BASE + '/api/center/delPaymode/' + id);
            },
            editpmd: function (id, inData) {
              return $http.put(url.BASE + '/api/center/editPaymode/' + id, inData);
            }

            // cancelled invoice's services------ DONT Delete
            // updatenvoice: function (data) {
            //   return $http.post(url.BASE + '/center/billing/', data);
            // },
            // updatereciept: function () {
            //   return $http.get(url.BASE + '/center/billing/');
            // }
          };
        }
    ]);
}());
