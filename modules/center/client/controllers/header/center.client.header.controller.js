(function() {
  angular.module('center').controller('headerController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', '$filter', '$window',
    function($scope, Auth, $localStorage, $state, $rootScope, $filter, $window) {
      console.log('Header controller');
      $scope.authenticated = false;
      $scope.auth_data = {};
      Auth.getUser().then(function(res) {
        $scope.auth_data = res.data;
        console.log($scope.auth_data.email);
        if (Auth.getCenterId()) {
          $scope.currentCenter = $filter('filter')(res.data._id, { _id: Auth.getCenterId() });
        } else {
          console.log(res.data._id);
          $scope.currentCenter = res.data._id;
          Auth.setCenterId($scope.auth_data._id);
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

      $scope.logout = function() {
        console.log('Logging Out ', Auth.logout());
      };

    }
  ]);
}());
