(function() {
  angular.module('center').controller('headMenuController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', function ($scope, Auth, $localStorage, $state, $rootScope, Flash) {
    console.log('headMenuController Controller');

    $scope.getDoctor = function() {
      $state.go('dashboard.centerSettings');
    };

    $scope.auth_data = {};
    Auth.getUser().then(function(res) {
      $scope.auth_data = res.data;
      $scope.authenticated = true;
    });

  }]);

}());
