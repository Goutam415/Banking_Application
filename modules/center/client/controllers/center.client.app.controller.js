(function () {
  angular.module('center').controller('appController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', function ($scope, Auth, $localStorage, $state, $rootScope, Flash) {
    console.log('app controller');


    Auth.getUser().error(function (params) {
      $state.go('login');
    });

    $scope.getDoctor = function () {
      $state.go('center.settings');
    };

    $scope.gotoCenterSettings = function() {
      $state.go('center.staff');
    };

    $scope.logout = function() {
      Auth.logout().then(function() {
        $state.go('login');
      });
    };
  }]);
}());
