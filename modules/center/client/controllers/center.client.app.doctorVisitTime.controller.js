
(function () {
  angular.module('center').controller('doctorVisitTimeController', ['$scope', '$localStorage', '$state',
    '$rootScope', 'Flash', 'centerService', 'StaffService', 'staffFactory', 'Auth',
    function ($scope, $localStorage, $state, $rootScope, Flash, centerService, StaffService, staffFactory, Auth) {
      console.log('DoctorVisitTime controller');

      $scope.backupTimings = staffFactory.getTimigsData();
      console.log($scope.backupTimings);
      function centertime() {
        $scope.backupTimings = staffFactory.getTimigsData();
        console.log($scope.backupTimings);
        $scope.time = angular.extend([], $scope.backupTimings);
        $scope.docTimes = '';
        $scope.centerId = staffFactory.centerId;

      }

      $scope.saveDoctorTimings = function() {
        var sendData = {};
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
            timing: [$scope.friday]
          },
          sunday:
          {
            timing: [$scope.sunday]
          }
        };
        sendData.IsDoctor = staffFactory.IsDoctor;
        sendData.centerId = Auth.getCenterId();
        sendData._id = staffFactory.getStaffid();

        console.log(dataToSend);
        sendData.workingDays = dataToSend;
        console.log(sendData);

        StaffService.addDoctorTime(sendData).then(function(resp) {
          staffFactory.setData(resp.data.data);
          console.log(resp);
       // centertime();
        }, function(err) {
          $scope.newTimes = '';
        });

      };


    }]);
}());
