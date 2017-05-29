(function () {
  angular.module('manager').controller('appController', ['$scope', '$state', 'managerService', function ($scope, $state, managerService) {
    managerService.getUserData().error(function (params) {
      $state.go('signin');
    });
  }]);
}());
