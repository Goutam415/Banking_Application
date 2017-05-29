(function () {
  angular.module('manager').controller('headerController', ['$scope', '$state', '$rootScope', 'Flash', 'managerService', function ($scope, $state, $rootScope, Flash, managerService) {
    $scope.isSignIn = false;
    managerService.getUserData().error(function (params) {
      $scope.isSignIn = false;
    }).success(function(params) {
      $scope.isSignIn = true;
    });
  }]);
}());
