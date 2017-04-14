(function () {
  angular.module('center').controller('headerController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', '$filter', '$window',
  function ($scope, Auth, $localStorage, $state, $rootScope, $filter, $window) {
    $scope.authenticated = false;
    $scope.auth_data = {};
    Auth.getUser().then(function(res) {
      $scope.auth_data = res.data;
      if (Auth.getCenterId()) {
        $scope.currentCenter = $filter('filter')(res.data.centerIds, { _id: Auth.getCenterId() })[0];
      } else {
        $scope.currentCenter = res.data.centerIds[0];
        Auth.setCenterId($scope.auth_data.centerIds[0]._id);
      }
      $scope.authenticated = true;
    });

    $scope.setId = function(id) {
      var cid = id._id;
      Auth.setCenterId(cid);
      // $window.location.reload();
      $state.go('app.dashboard');
    };

    $scope.getID = function() {
      console.log('getid ', Auth.getCenterId());
    };

  }]);
}());
