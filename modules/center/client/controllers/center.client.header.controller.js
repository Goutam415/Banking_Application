
(function () {
  angular.module('center').controller('headerController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', function ($scope, Auth, $localStorage, $state, $rootScope, Flash) {
    console.log('header controller');
    $scope.authenticated = false;
    $scope.auth_data = {};
    Auth.getUser().then(function(res) {
      $scope.auth_data = res.data;
      $scope.authenticated = true;
      console.log($scope.auth_data);
      if (Auth.getCenterId() === null) {
        Auth.setCenterId($scope.auth_data.centerIds[0]._id);
      }
      $scope.currentCenter = $scope.auth_data.centerIds[0];
    });
  }]);
}());
