(function () {
  angular.module('center').service('appointmentService', ['$http', 'urls',
        function ($http, url) {
          'use strict';
          return {
            getAppointmentsByCenter: function(centerId) {
              return $http.get(url.BASE + '/api/getappointmentsbycenterid?centerId=' + centerId);
            },
            addAppointment: function(item) {
              return $http.post(url.BASE + '/api/save/appointment', item);
            }
          };
        }
    ]);
}());

