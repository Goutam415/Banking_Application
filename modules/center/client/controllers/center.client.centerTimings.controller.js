(function() {
  angular.module('center').controller('centerTimingsController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', 'centerService', 'centerTimingFactory', function ($scope, Auth, $localStorage, $state, $rootScope, Flash, centerService, centerTimingFactory) {
    console.log('CenterTimings Controller');

    // $scope.days = [{ name: 'Monday', modelName: 'practiceCheckedMon' },
    //                { name: 'Tuesday', modelName: 'practiceCheckedTue' },
    //                { name: 'Wednesday', modelName: 'practiceCheckedWed' },
    //                { name: 'Thursday', modelName: 'practiceCheckedThur' },
    //                { name: 'Friday', modelName: 'practiceCheckedFri' },
    //                { name: 'Saturday', modelName: 'practiceCheckedSat' },
    //                { name: 'Sunday', modelName: 'practiceCheckedSun' }];

    function centertime() {
      $scope.backupTimings = centerTimingFactory.getObservations();
      $scope.time = angular.extend([], $scope.backupTimings);
      $scope.newTimes = '';
      $scope.centerId = centerTimingFactory.centerId;
    }

    $scope.addSlotToDay = function(object) {

    };

    $scope.saveCenterTimings = function() {
      var sendData = {};
      sendData.centerId = Auth.getCenterId();
      var dataToSend = {
        monday:
        {

          timing: [$scope.monday]
        },
        tuesday:
        {
          timing: [$scope.tuesday]
        },
        wednesday:
        {
          timing: [$scope.wednesday]
        },

        thursday:
        {
          timing: [$scope.thursday]
        },
        friday:
        {
          timing: [$scope.friday]
        },
        saturday:
        {
          timing: [$scope.saturday]
        },
        sunday:
        {
          timing: [$scope.sunday]
        }
      };
      sendData.workingDays = dataToSend;
      console.log(dataToSend);
      console.log(sendData);
      centerService.editCenterTime(sendData).then(function(resp) {
        centerTimingFactory.setData(resp.data.data);
        // centertime();
      }, function(err) {
        $scope.newTimes = '';
      });
    };
  }]);

}());
