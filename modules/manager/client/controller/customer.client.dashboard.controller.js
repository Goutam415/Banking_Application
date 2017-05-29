(function () {
  angular.module('manager').controller('dashboardController', ['$scope', '$state', '$rootScope', 'Flash', 'managerService', function ($scope, $state, $rootScope, Flash, managerService) {
    console.log('manager dash controller');
    managerService.getmanager().then(function(response) {
      $scope.managers = response.data;
      console.log($scope.managers);
    });
    $scope.addCenter = function(index) {
      var params = { owner: $scope.managers[index].centerIds[0].idOwner, manager: $scope.managers[index].centerIds[0].idmanager };
      $state.go('app.addCenter', params);
    };
  }]);
}());
