
(function () {
  angular.module('center').controller('emrFilelabelsController', ['$scope', '$localStorage', '$state', '$rootScope', 'Flash', 'emrService', 'emrFactory', 'lodash', 'utils', function ($scope, $localStorage, $state, $rootScope, Flash, emrService, emrFactory, lodash, utils) {
    $scope.inactivearray = [];
    var cancelval;
    setupDataSource();
    function setupDataSource(params) {
      $scope.backupFilelabels = emrFactory.getFileLabels();
      $scope.inactivearray = lodash.filter($scope.backupFilelabels, function(obj) { return !obj.active; });
      $scope.filelabels = lodash.filter($scope.backupFilelabels, function(obj) { return obj.active; });
      $scope.currentEditIndex = -1;
      $scope.newFilelabel = '';
      $scope.centerId = emrFactory.centerId;
    }
    $scope.addItem = function() {
      if ($scope.newFilelabel.length > 0) {
        var inDuplicate = $scope.newFilelabel;
        var result = utils.inDuplicationChecking($scope.backupFilelabels, inDuplicate);
        if (result) {
          var message = '<strong> Already value is existing</strong>';
          Flash.create('danger', message);
        } else {
          var dataToSend = {};
          dataToSend.centerId = emrFactory.centerId;
          var filelabelsToSend = {};
          filelabelsToSend.name = $scope.newFilelabel;
          dataToSend.fileLabels = filelabelsToSend;
          emrService.addEMR(dataToSend).then(function (response) {
            emrFactory.setData(response.data.data);
            setupDataSource();
          }, function (err) {
            $scope.newFilelabel = '';
          });
        }
      }
    };
    $scope.deleteItem = function(inFilelabel, $index) {
      var index = $index;
      var dataToSend = {};
      var active = false;
      dataToSend.centerId = $scope.centerId;
      var filelabelsToSend = {};
      filelabelsToSend.name = inFilelabel.name;
      filelabelsToSend._id = inFilelabel._id;
      filelabelsToSend.active = active;
      dataToSend.fileLabels = filelabelsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        inFilelabel.active = false;
        $scope.inactivearray.push(inFilelabel);
        $scope.filelabels.splice(index, 1);
      }, function (err) {
        $scope.filelabels[$index] = $scope.backupFilelabels[$index];
      });

    };


    $scope.edit = function(inFilelabel, $index) {
      $scope.currentEditIndex = $index;
      cancelval = angular.copy(inFilelabel);
    };

    $scope.save = function(inFilelabel, $index) {
      var dataToSend = {};
      dataToSend.centerId = $scope.centerId;
      var filelabelsToSend = {};
      filelabelsToSend.name = inFilelabel.name;
      filelabelsToSend._id = inFilelabel._id;
      dataToSend.filelabels = filelabelsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
      }, function (err) {
        $scope.filelabels[$index] = $scope.backupFilelabels[$index];
      });
    };

    $scope.unhide = function(inFilelabel, $index) {
      var index = $index;
      var dataToSend = {};
      var active = true;
      dataToSend.centerId = $scope.centerId;
      var filelabelsToSend = {};
      filelabelsToSend.name = inFilelabel.name;
      filelabelsToSend._id = inFilelabel._id;
      filelabelsToSend.active = active;
      dataToSend.filelabels = filelabelsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        $scope.inactivearray.splice(index, 1);
        inFilelabel.active = true;
        $scope.filelabels.push(inFilelabel);
      }, function (err) {
        $scope.filelabels[$index] = $scope.backupFilelabels[$index];
      });

    };
    $scope.cancel = function($index) {
      $scope.currentEditIndex = -1;
      $scope.filelabels.splice($index, 1);
      $scope.filelabels.push(cancelval);
    };
  }]);


}());
