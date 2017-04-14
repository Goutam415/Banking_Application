(function () {
  angular.module('center').factory('commFactory', ['$q', '$localStorage', 'Auth',
        function ($q, $localStorage, Auth) {
          'use strict';
          return {
            sData: {},
            centerId: 123,
            getCenterId: function () {
              return Auth.getUser();
            },
            setData: function (data) {
              this.sData = data;
            },
            getData: function () {
              return this.sData;
            }
          };
        }]);
}());
