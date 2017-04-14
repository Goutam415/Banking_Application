(function () {
  angular.module('center').controller('emrComplaintsController', ['$scope', '$localStorage', '$state', '$rootScope', 'Flash', 'emrService', 'emrFactory', 'lodash', 'utils', function ($scope, $localStorage, $state, $rootScope, Flash, emrService, emrFactory, lodash, utils) {
    var cancelval;
    $scope.inactivearray = [];
    setupDataSource();
    function setupDataSource(params) {
      $scope.backupComplaints = emrFactory.getComplaints();
      $scope.inactivearray = lodash.filter($scope.backupComplaints, function(obj) { return !obj.active; });
      $scope.complaints = lodash.filter($scope.backupComplaints, function(obj) { return obj.active; });
      $scope.currentEditIndex = -1;
      $scope.newComplaint = '';
      $scope.centerId = emrFactory.centerId;
    }
    $scope.deleteItem = function(inComplaint, $index) {
      var index = $index;
      var active = false;
      var dataToSend = {};

      dataToSend.centerId = $scope.centerId;
      var complaintsToSend = {};
      complaintsToSend.name = inComplaint.name;
      complaintsToSend._id = inComplaint._id;
      complaintsToSend.active = active;
      dataToSend.complaints = complaintsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        inComplaint.active = false;
        $scope.inactivearray.push(inComplaint);
        $scope.complaints.splice($index, 1);
      }, function (err) {
        setupDataSource();
      });
    };

    $scope.addItem = function() {
      if ($scope.newComplaint.length > 0) {
        var inDuplicate = $scope.newComplaint;
        var result = utils.inDuplicationChecking($scope.backupComplaints, inDuplicate);
        if (result) {
          var message = '<strong> Already value is existing</strong>';
          Flash.create('danger', message);
        } else {
          var dataToSend = {};
          dataToSend.centerId = emrFactory.centerId;
          var complaintsToSend = {};
          complaintsToSend.name = $scope.newComplaint;
          dataToSend.complaints = complaintsToSend;
          emrService.addEMR(dataToSend).then(function (response) {
            emrFactory.setData(response.data.data);
            setupDataSource();
          }, function (err) {
            $scope.newComplaint = '';
          });
        }
      }
    };

    $scope.edit = function(inComplaint, $index) {
      $scope.currentEditIndex = $index;
      cancelval = angular.copy(inComplaint);
    };

    $scope.save = function(inComplaint, $index) {
      var dataToSend = {};
      dataToSend.centerId = $scope.centerId;
      var complaintsToSend = {};
      complaintsToSend.name = inComplaint.name;
      complaintsToSend._id = inComplaint._id;
      dataToSend.complaints = complaintsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
      }, function (err) {
        setupDataSource();
      });
    };

    $scope.unhide = function(inComplaint, $index) {
      var index = $index;
      var active = true;
      var dataToSend = {};
      dataToSend.centerId = $scope.centerId;
      var complaintsToSend = {};
      complaintsToSend.name = inComplaint.name;
      complaintsToSend._id = inComplaint._id;
      complaintsToSend.active = active;
      dataToSend.complaints = complaintsToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        inComplaint.active = true;
        $scope.complaints.push(inComplaint);
        $scope.inactivearray.splice($index, 1);
      }, function (err) {
        setupDataSource();
      });
    };
    $scope.cancel = function($index) {
      $scope.currentEditIndex = -1;
      $scope.complaints.splice($index, 1);
      $scope.complaints.push(cancelval);
    };
  }]);


}());
