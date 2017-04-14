
(function () {
  angular.module('center').controller('emrNotesController', ['$scope', '$localStorage', '$state', '$rootScope', 'Flash', 'emrService', 'emrFactory', 'lodash', 'utils', function ($scope, $localStorage, $state, $rootScope, Flash, emrService, emrFactory, lodash, utils) {
    $scope.inactivearray = [];
    var cancelval;
    setupDataSource();
    function setupDataSource(params) {
      $scope.backupNotes = emrFactory.getNotes();
      $scope.inactivearray = lodash.filter($scope.backupNotes, function(obj) { return !obj.active; });
      $scope.notes = lodash.filter($scope.backupNotes, function(obj) { return obj.active; });
      $scope.currentEditIndex = -1;
      $scope.newNote = '';
      $scope.centerId = emrFactory.centerId;
    }
    $scope.addItem = function() {
      if ($scope.newNote.length > 0) {
        var inDuplicate = $scope.newNote;
        var result = utils.inDuplicationChecking($scope.backupNotes, inDuplicate);
        if (result) {
          var message = '<strong> Already value is existing</strong>';
          Flash.create('danger', message);
        } else {
          var dataToSend = {};
          dataToSend.centerId = emrFactory.centerId;
          var notesToSend = {};
          notesToSend.name = $scope.newNote;
          dataToSend.notes = notesToSend;
          emrService.addEMR(dataToSend).then(function (response) {
            emrFactory.setData(response.data.data);
            setupDataSource();
          }, function (err) {
            $scope.newNote = '';
          });
        }
      }
    };
    $scope.deleteItem = function(inNote, $index) {
      var index = $index;
      var dataToSend = {};
      var active = false;
      dataToSend.centerId = $scope.centerId;
      var notesToSend = {};
      notesToSend.name = inNote.name;
      notesToSend._id = inNote._id;
      notesToSend.active = active;
      dataToSend.notes = notesToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        inNote.active = false;
        $scope.inactivearray.push(inNote);
        $scope.notes.splice($index, 1);
      }, function (err) {
        setupDataSource();
      });
    };
    $scope.unhide = function(inNote, $index) {
      var index = $index;
      var dataToSend = {};
      var active = true;
      dataToSend.centerId = $scope.centerId;
      var notesToSend = {};
      notesToSend.name = inNote.name;
      notesToSend._id = inNote._id;
      notesToSend.active = active;
      dataToSend.notes = notesToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        inNote.active = true;
        $scope.notes.push(inNote);
        $scope.inactivearray.splice(index, 1);

      }, function (err) {
        setupDataSource();
      });
    };
    $scope.edit = function(aNote, $index) {
      cancelval = angular.copy(aNote);
      $scope.currentEditIndex = $index;
    };
    $scope.save = function(inNote, $index) {
      var dataToSend = {};
      dataToSend.centerId = $scope.centerId;
      var notesToSend = {};
      notesToSend.name = inNote.name;
      notesToSend._id = inNote._id;
      dataToSend.notes = notesToSend;
      emrService.editEMR(dataToSend).then(function (response) {
        $scope.currentEditIndex = -1;
      }, function (err) {
        setupDataSource();
      });
    };
    $scope.cancel = function($index) {
      $scope.currentEditIndex = -1;
      $scope.notes.splice($index, 1);
      $scope.notes.push(cancelval);
    };
  }]);
}());
