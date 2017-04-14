(function () {
  angular.module('center').controller('emrObservationController', ['$scope', '$localStorage', '$state', '$rootScope', 'Flash', 'emrService', 'emrFactory', 'lodash', 'utils', function ($scope, $localStorage, $state, $rootScope, Flash, emrService, emrFactory, lodash, utils) {
    $scope.inactivearray = [];
    var cancelval;
    setupDataSource();
    function setupDataSource(params) {
      $scope.backupObservations = emrFactory.getObservations();
      $scope.inactivearray = lodash.filter($scope.backupObservations, function(obj) { return !obj.active; });
      $scope.observations = lodash.filter($scope.backupObservations, function(obj) { return obj.active; });
      $scope.currentEditIndex = -1;
      $scope.newObservation = '';
      $scope.centerId = emrFactory.centerId;
    }
    $scope.addItem = function() {
      if ($scope.newObservation.length > 0) {
        var inDuplicate = $scope.newObservation;
        var result = utils.inDuplicationChecking($scope.backupObservations, inDuplicate);
        if (result) {
          var message = '<strong> Already value is existing</strong>';
          Flash.create('danger', message);
        } else {
          var dataToSend = {};
          dataToSend.centerId = emrFactory.centerId;
          var observationsToSend = {};
          observationsToSend.name = $scope.newObservation;
          dataToSend.observations = observationsToSend;
          emrService.addEMR(dataToSend).then(function (response) {
            emrFactory.setData(response.data.data);
            setupDataSource();
          }, function (err) {
            $scope.newObservation = '';
          });
        }
      }
    };
    $scope.deleteItem = function(inObservation, $index) {
      var index = $index;
      var dataToSend = {};
      var active = false;
      dataToSend.centerId = $scope.centerId;
      var observationsToSend = {};
      observationsToSend.name = inObservation.name;
      observationsToSend._id = inObservation._id;
      observationsToSend.active = active;
      dataToSend.observations = observationsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        inObservation.active = false;
        $scope.inactivearray.push(inObservation);
        $scope.observations.splice(index, 1);
      }, function (err) {
        $scope.observations[$index] = $scope.backupObservations[$index];
      });

    };
    $scope.unhide = function(inObservation, $index) {
      var index = $index;
      var dataToSend = {};
      var active = true;
      dataToSend.centerId = $scope.centerId;
      var observationsToSend = {};
      observationsToSend.name = inObservation.name;
      observationsToSend._id = inObservation._id;
      observationsToSend.active = active;
      dataToSend.observations = observationsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        inObservation.active = true;
        $scope.observations.push(inObservation);
        $scope.inactivearray.splice($index, 1);
      }, function (err) {
        $scope.observations[$index] = $scope.backupObservations[$index];
      });
    };
    $scope.edit = function(inObservation, $index) {
      $scope.currentEditIndex = $index;
      cancelval = angular.copy(inObservation);
    };
    $scope.save = function(inObservation, $index) {
      var dataToSend = {};
      dataToSend.centerId = $scope.centerId;
      var observationsToSend = {};
      observationsToSend.name = inObservation.name;
      observationsToSend._id = inObservation._id;
      dataToSend.observations = observationsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
      }, function (err) {
        $scope.observations[$index] = $scope.backupObservations[$index];
      });
    };
    $scope.cancel = function($index) {
      $scope.currentEditIndex = -1;
      $scope.observations.splice($index, 1);
      $scope.observations.push(cancelval);
    };
  }]);
}());

