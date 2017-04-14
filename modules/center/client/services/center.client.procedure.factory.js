(function () {
  angular.module('center').factory('procedureFactory', ['$q', '$localStorage',
        function ($q, $localStorage) {
          'use strict';
          return {
            procData: {},

            setProcData: function (data) {
              this.ProcData = data;
            },
            getProcData: function() {
              return angular.extend([], this.procData);
            }
          };
        }]);
}());
