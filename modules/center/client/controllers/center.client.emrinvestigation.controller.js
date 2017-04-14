
(function () {
  angular.module('center').controller('emrInvestigationsController', ['$scope', '$localStorage', '$state', '$rootScope', 'Flash', 'emrService', 'emrFactory', 'lodash', 'utils', function ($scope, $localStorage, $state, $rootScope, Flash, emrService, emrFactory, lodash, utils) {
    $scope.inactivearray = [];
    var cancelval;
    setupDataSource();
    function setupDataSource(params) {
      $scope.backupInvestigations = emrFactory.getInvestigations();
      $scope.inactivearray = lodash.filter($scope.backupInvestigations, function(obj) { return !obj.active; });
      $scope.investigations = lodash.filter($scope.backupInvestigations, function(obj) { return obj.active; });
      $scope.currentEditIndex = -1;
      $scope.newInvestigation = '';
      $scope.centerId = emrFactory.centerId;
    }

    $scope.addItem = function() {
      if ($scope.newInvestigation.length > 0) {
        var inDuplicate = $scope.newInvestigation;
        var result = utils.inDuplicationChecking($scope.backupInvestigations, inDuplicate);
        if (result) {
          var message = '<strong> Already value is existing</strong>';
          Flash.create('danger', message);
        } else {
          var dataToSend = {};
          dataToSend.centerId = emrFactory.centerId;
          var investigationsToSend = {};
          investigationsToSend.name = $scope.newInvestigation;
          dataToSend.investigations = investigationsToSend;
          emrService.addEMR(dataToSend).then(function (response) {
            emrFactory.setData(response.data.data);
            setupDataSource();
          }, function (err) {
            $scope.newInvestigation = '';
          });
        }
      }
    };
    $scope.deleteItem = function(inInvestigation, $index) {
      var index = $index;
      var dataToSend = {};
      var active = false;
      dataToSend.centerId = $scope.centerId;
      var investigationsToSend = {};
      investigationsToSend.name = inInvestigation.name;
      investigationsToSend._id = inInvestigation._id;
      investigationsToSend.active = active;
      dataToSend.investigations = investigationsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        inInvestigation.active = false;
        $scope.inactivearray.push(inInvestigation);
        $scope.investigations.splice(index, 1);
      }, function (err) {
        setupDataSource();
      });

    };

    $scope.unhide = function(inInvestigation, $index) {
      var index = $index;
      var dataToSend = {};
      var active = true;
      dataToSend.centerId = $scope.centerId;
      var investigationsToSend = {};
      investigationsToSend.name = inInvestigation.name;
      investigationsToSend._id = inInvestigation._id;
      investigationsToSend.active = active;
      dataToSend.investigations = investigationsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        $scope.inactivearray.splice(index, 1);
        inInvestigation.active = true;
        $scope.investigations.push(inInvestigation);
      }, function (err) {
        setupDataSource();
      });
    };
    $scope.edit = function(inInvestigation, $index) {
      $scope.currentEditIndex = $index;
      cancelval = angular.copy(inInvestigation);
    };
    $scope.save = function(inInvestigation, $index) {
      var dataToSend = {};
      dataToSend.centerId = $scope.centerId;
      var investigationsToSend = {};
      investigationsToSend.name = inInvestigation.name;
      investigationsToSend._id = inInvestigation._id;
      dataToSend.investigations = investigationsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
      }, function (err) {
        setupDataSource();
      });
    };


    $scope.cancel = function($index) {
      $scope.currentEditIndex = -1;
      $scope.investigations.splice($index, 1);
      $scope.investigations.push(cancelval);
    };
  }]);
}());
