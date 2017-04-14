
(function () {
  angular.module('center').controller('emrVitalsController', ['$scope', '$localStorage', '$state', '$rootScope', 'Flash', 'emrService', 'emrFactory', 'lodash', 'utils', function ($scope, $localStorage, $state, $rootScope, Flash, emrService, emrFactory, lodash, utils) {
    $scope.units = ['Celsius', 'Farenheit'];
    $scope.methods = ['low', 'high', 'medium'];
    $scope.measurements = ['supine', 'seated', 'standing'];
    setupDataSource();
    function setupDataSource(params) {
      var backupVitals = emrFactory.getVitals();
      if (backupVitals.length === 0) {
        $scope.pressure = $scope.measurements[0];
        $scope.temperature = $scope.units[0];
        $scope.blood = $scope.methods[0];
      } else {
        $scope.pressure = backupVitals[0].default_bp_measurement;
        $scope.temperature = backupVitals[0].default_temperature_unit;
        $scope.blood = backupVitals[0].default_temperature_method;
      }
    }
    $scope.saveVitals = function() {
      var dataToSend = {};
      dataToSend.centerId = emrFactory.centerId;
      var vitalToSend = {};
      vitalToSend.default_temperature_unit = $scope.temperature;
      vitalToSend.default_temperature_method = $scope.blood;
      vitalToSend.default_bp_measurement = $scope.pressure;
      dataToSend.vitals = vitalToSend;
      emrService.addVITAL(dataToSend).then(function (response) {
        emrFactory.setData(response.data.data);
        setupDataSource();
        var message = '<strong> successfully saved</strong>';
        Flash.create('sucess', message);
      }, function (err) {
        var messages = '<strong> unsuccessfully saved</strong>';
        Flash.create('danger', messages);
      });
    };
  }]);
}());

