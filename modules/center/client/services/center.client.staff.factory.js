
(function () {
  angular.module('center').factory('staffFactory', ['$q', '$localStorage',
        function ($q, $localStorage) {
          'use strict';

          var savedData = {};
          function set(data) {
            savedData = data;
          }
          function get() {
            return savedData;
          }
          var iddata;
          function setStaffid(data) {
            iddata = data;
          }

          function getStaffid() {
            return iddata;
          }

          return {
            set: set, setStaffid,
            get: get, getStaffid,


            docData: {},
            IsDoctor: true,
            setData: function (data) {
              this.docData = data;
            },

            getTimigsData: function () {
              return angular.extend([], this.docData.sunday, this.docData.monday, this.docData.tuesday, this.docData.wednesday,
              this.docData.thursday, this.docData.friday, this.docData.saturday);
            }
          };

        //   return {
        //     docData: {},
        //     IsDoctor: true,
        //     setData: function (data) {
        //       this.docData = data;
        //     },

        //     getTimigsData: function () {
        //       return angular.extend([], this.docData.sunday, this.docData.monday, this.docData.tuesday, this.docData.wednesday,
        //       this.docData.thursday, this.docData.friday, this.docData.saturday);
        //     }
        //   };

        }]);
}());

