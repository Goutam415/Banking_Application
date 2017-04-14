
(function () {
  angular.module('center').service('StaffService', ['$http', '$q', '$localStorage', 'urls',
        function ($http, $q, $localStorage, url) {
          'use strict';

          return {
            getStaffList: function(centerId) {
              return $http.get(url.BASE + '/api/get/staff?center=' + centerId);
            },

            getDoctorList: function(centerId) {
              return $http.get(url.BASE + '/api/get/doctor?center=' + centerId);
            },

            addDoctorTime: function(data) {
              return $http.put(url.BASE + '/api/add/doctortimings', data);
            },


            getappcategory: function(centerId) {
              return $http.get(url.BASE + '/api/get/appcategory?center=' + centerId);
            },
            addDoctor: function (data) {
              return $http.post(url.BASE + '/api/doctor/create', data);
            },
            saveStaffNotification: function(data) {

              return $http.put(url.BASE + '/api/add/staffnotifications', data);

            },

            editappcategory: function(data) {
              return $http.put(url.BASE + '/api/edit/appcategory', data);
            },
            addStaff: function (data) {
              return $http.post(url.BASE + '/api/center/staff/create', data);
            },
            updateProfile: function(data) {
              return $http.post(url.BASE + '/api/center/staff/updateProfile', data);
            }
          };
        }]);
}());
