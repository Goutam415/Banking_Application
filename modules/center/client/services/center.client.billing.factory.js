(function () {
  angular.module('center').factory('billingFactory', ['$q', '$localStorage',
        function ($q, $localStorage) {
          'use strict';
          return {
            paymodeData: {},
            taxData: {},
            setData: function (data) {
              this.paymodeData = data;
            },
            setTaxData: function (data) {
              this.taxData = data;
            },
            getTaxData: function() {
              return angular.extend([], this.taxData);
            },
            getPaymode: function() {
              return angular.extend([], this.paymodeData);
            }
          };
        }]);
}());
