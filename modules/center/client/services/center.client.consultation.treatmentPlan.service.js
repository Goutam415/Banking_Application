
(function () {
  angular.module('center').service('TreatmentPlanService', ['$http', '$q', 'urls',
        function ($http, $q, url) {
          'use strict';
          return {
            createTreatmentPlans: function (data) {
              return $http.put(url.BASE + '/api/save/treatmentPlans', data);
            }
          };
        }
    ]);
}());
