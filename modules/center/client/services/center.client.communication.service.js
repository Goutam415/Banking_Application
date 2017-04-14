(function () {
  angular.module('center').service('commService', ['$http', '$q', '$localStorage', 'urls',
        function ($http, $q, $localStorage, url) {
          console.log('commservice');
          'use strict';
          var data;
          return {
            createTemplate: function() {
              return $http.post(url.BASE + '/api/template/create');
            },
            getTemplate: function() {
              return $http.get(url.BASE + '/api/emr/get');
              // /api/template/listsms
            },
            getSMSTemplates: function (centerId) {
              return $http.get(url.BASE + '/api/communication/listsms' + '?centerId=' + centerId).success(function(response) {
                data = response.data;
              });
            },
            getEmailTemplates: function (centerId) {
              return $http.get(url.BASE + '/api/communication/listemail' + '?centerId=' + centerId);
            },
            updateEmailTemplates: function (data) {
              return $http.put(url.BASE + '/api/templates/updateemail', data);
            },
            updateSMSTemplates: function (data) {
              return $http.put(url.BASE + '/api/templates/updatesms', data);
            },
            getCenter: function(centerId) {
              console.log(centerId);
              var a = centerId;
              return $http.get(url.BASE + '/api/getCenterDetails' + '?centerId=' + a).success(function(response) {
                data = response.data;
                console.log(response);
                console.log(data);
              });
            },
            updateSettings: function(data) {
              return $http.put(url.BASE + '/api/communication/updatesettings', data);
            }

          };
        }
    ]);
}());
