(function() {
  angular.module('center').controller('leftMenuController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', function ($scope, Auth, $localStorage, $state, $rootScope, Flash) {
    $scope.getEmr = function() {
      $state.go('center.settings.emr');
    };
    $scope.getCommunications = function() {
      $state.go('center.settings.communications');
    };


  }]);

}());
