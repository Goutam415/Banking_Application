
(function () {
  angular.module('center').controller('emrDiagnosesController', ['$scope', '$localStorage', '$state', '$rootScope', 'Flash', 'emrService', 'emrFactory', 'lodash', 'utils', function ($scope, $localStorage, $state, $rootScope, Flash, emrService, emrFactory, lodash, utils) {
    $scope.inactivearray = [];
    setupDataSource();
    var cancelval;
    $scope.deleteItem = function(inDiagnose, $index) {
      var index = $index;
      var active = false;
      var dataToSend = {};
      dataToSend.centerId = $scope.centerId;
      var diagnosesToSend = {};
      diagnosesToSend.name = inDiagnose.name;
      diagnosesToSend._id = inDiagnose._id;
      diagnosesToSend.active = active;
      dataToSend.diagnoses = diagnosesToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        inDiagnose.active = false;
        $scope.inactivearray.push(inDiagnose);
        $scope.diagnoses.splice(index, 1);
      }, function (err) {
        $scope.diagnoses[$index] = $scope.backupDiagnoses[$index];
      });

    };
    function setupDataSource(params) {
      $scope.backupDiagnoses = emrFactory.getDiagnoses();
      $scope.inactivearray = lodash.filter($scope.backupDiagnoses, function(obj) { return !obj.active; });
      $scope.diagnoses = lodash.filter($scope.backupDiagnoses, function(obj) { return obj.active; });
      $scope.currentEditIndex = -1;
      $scope.newDiagnose = '';
      $scope.centerId = emrFactory.centerId;
    }
    setupDataSource();
    $scope.addItem = function() {
      if ($scope.newDiagnose.length > 0) {
        var inDuplicate = $scope.newDiagnose;
        var result = utils.inDuplicationChecking($scope.backupDiagnoses, inDuplicate);
        if (result) {
          var message = '<strong> Already value is existing</strong>';
          Flash.create('danger', message);
        } else {
          var dataToSend = {};
          dataToSend.centerId = emrFactory.centerId;
          var diagnosesToSend = {};
          diagnosesToSend.name = $scope.newDiagnose;
          dataToSend.diagnoses = diagnosesToSend;
          emrService.addEMR(dataToSend).then(function (response) {
            emrFactory.setData(response.data.data);
            setupDataSource();
          }, function (err) {
            $scope.newDiagnose = '';
          });
        }
      }
    };
    $scope.edit = function(inDiagnose, $index) {
      $scope.currentEditIndex = $index;
      cancelval = angular.copy(inDiagnose);
    };
    $scope.save = function(inDiagnose, $index) {
      var dataToSend = {};
      dataToSend.centerId = $scope.centerId;
      var diagnosesToSend = {};
      diagnosesToSend.name = inDiagnose.name;
      diagnosesToSend._id = inDiagnose._id;
      dataToSend.diagnoses = diagnosesToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
      }, function (err) {
        $scope.diagnoses[$index] = $scope.backupDiagnoses[$index];
      });
    };
    $scope.unhide = function(inDiagnose, $index) {
      var index = $index;
      var active = true;
      var dataToSend = {};
      dataToSend.centerId = $scope.centerId;
      var diagnosesToSend = {};
      diagnosesToSend.name = inDiagnose.name;
      diagnosesToSend._id = inDiagnose._id;
      diagnosesToSend.active = active;
      dataToSend.diagnoses = diagnosesToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        $scope.inactivearray.splice(index, 1);
        inDiagnose.active = true;
        $scope.diagnoses.push(inDiagnose);
        $scope.inactivearray.splice(index, 1);

      }, function (err) {
        $scope.diagnoses[$index] = $scope.backupDiagnoses[$index];
      });
    };

    $scope.cancel = function($index) {
      var index = $index;
      $scope.currentEditIndex = -1;
      $scope.diagnoses.splice(index, 1);
      $scope.diagnoses.push(cancelval);
    };
  }]);
}());

