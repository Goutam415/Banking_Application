
(function () {
  angular.module('center').factory('centerTimingFactory', ['$q', '$localStorage',
        function ($q, $localStorage) {
          'use strict';
          return {
            emrData: {},
            centerId: 123,
            setData: function (data) {
              this.emrData = data;
            },
            getObservations: function () {
              return angular.extend([], this.emrData.sunday, this.emrData.monday, this.emrData.tuesday, this.emrData.wednesday,
              this.emrData.thursday, this.emrData.friday, this.emrData.saturday);
            }
          };

        }]);
}());
