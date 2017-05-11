(function() {
  angular.module('center').controller('dashboardNavController', ['$scope', '$state', '$rootScope', '$mdSidenav', '$log', function($scope, $state, $rootScope, $mdSidenav, $log) {

    $scope.close = function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function() {
          $log.debug('close LEFT is done');
        });

    };


  }]);
}());