(function() {
  angular.module('center').controller('emrController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', 'emrService', 'emrFactory',
  function ($scope, Auth, $localStorage, $state, $rootScope, Flash, emrService, emrFactory) {
    var centerId = emrFactory.getCenterId();
    emrFactory.centerId = centerId;
    emrService.getEMR(centerId).then(function (response) {
      emrFactory.setData(response.data.data);
      if ($scope.tab === 1) {
        $state.go('center.settings.emr.complaints');
      }
    }, function (err) {
      emrFactory.reset();
    });
    $scope.tab = 1;
    if ($scope.tab === 1) {
      $state.go('center.settings.emr.complaints');
    }
    $scope.setTab = function (tabId) {
      $scope.tab = tabId;
    };
    $scope.isSet = function (tabId) {
      return $scope.tab === tabId;
    };
  }]);
}());
