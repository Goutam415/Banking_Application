(function () {
  angular.module('manager').controller('loginController', ['$scope', '$state', '$rootScope', 'managerService', function ($scope, $state, $rootScope, managerService) {
    console.log('app controller');
    $scope.validate = function () {
      var loginDetails = {
        email: $scope.email,
        password: $scope.password
      };
      // TODO handle login failure case
      managerService.loginmanager(loginDetails).success(function() {
        $state.go('app.dash');
      });
    };
  }]);
}());
