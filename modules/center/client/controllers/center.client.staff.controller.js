(function () {

  angular.module('center').controller('staffController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', 'StaffService', 'staffFactory',
  function ($scope, Auth, $localStorage, $state, $rootScope, Flash, StaffService, staffFactory) {
    console.log('Staff controller');
    Auth.getUser().then(function(res) {
      console.log(Auth.getCenterId());
      $scope.getDoctor(Auth.getCenterId());
      $scope.getStaff(Auth.getCenterId());
    });
    $scope.getDoctor = function(centerId) {
      StaffService.getDoctorList(centerId).then(function(resp) {
        $scope.doctor = resp.data.doctor;
      }, function(err) {
        console.log(err);
      });
    };

    $scope.getStaff = function(centerId) {
      StaffService.getStaffList(centerId).then(function(resp) {
        $scope.staffs = resp.data.staff;
        console.log('Staff controller');
      });
    };

    $scope.editTime = function (id) {
      $state.go('center.settings.doctortimimgs');
      $scope.staffid = id;
      staffFactory.setStaffid($scope.staffid);
      console.log($scope.staffid);
    };

    $scope.saveDoctorTimings = function() {
      var sendData = {};
      var dataToSend = {
        monday: [
          {
            timing: [$scope.monday]
          }
        ],
        tuesday: [
          {
            timing: [$scope.tuesday]
          }
        ],
        wednesday: [
          {
            timing: [$scope.wednesday]
          }
        ],

        thursday: [
          {
            timing: [$scope.thursday]
          }
        ],
        friday: [
          {
            timing: [$scope.friday]
          }
        ],
        saturday: [
          {
            timing: [$scope.friday]
          }
        ],
        sunday: [
          {
            timing: [$scope.sunday]
          }
        ]
      };
      $state.go('center.settings.staff.doctorVisitTime');
      sendData.IsDoctor = staffFactory.IsDoctor;
      sendData.centerId = Auth.getCenterId();
      sendData._id = staffFactory.getStaffid();

      console.log(dataToSend);
      sendData.workingDays = dataToSend;
      console.log(dataToSend);

      StaffService.addDoctorTime(sendData).then(function(resp) {
        Flash('Form submitted Successfully');
        $state.go('center.settings.staff.doctorVisitTime');
        staffFactory.setData(resp.data.data);
       // centertime();
      }, function(err) {
        $scope.newTimes = '';
      });

    };

    // save staff notifications

    $scope.staffNotification = function() {
      console.log($scope.staffs);
      var data = {};
      data.centerId = Auth.getCenterId();
      var staf = [];
      for (var i = 0; i < $scope.staffs.length; i++) {
        var element = $scope.staffs[i];
        var obj = {};
        obj._id = element._id;
        obj.scheduleSMS = element.scheduleSMS;
        obj.scheduleEmail = element.scheduleEmail;
        obj.confirmationemail = element.confirmationemail;
        obj.confirmationSMS = element.confirmationSMS;
        console.log(obj);
        staf.push(obj);
        console.log(staf);
        StaffService.saveStaffNotification(staf).then(function(resp) {
          console.log(resp);
        });

      }

    };

        // save doctor notifications

    $scope.doctorNotification = function() {
      console.log($scope.doctor);
      var staf = [];
     // staf.centerId = Auth.getCenterId();
      for (var i = 0; i < $scope.doctor.length; i++) {
        var element = $scope.doctor[i];
        var obj = {};
        obj._id = element._id;
        obj.scheduleSMS = element.scheduleSMS;
        obj.scheduleEmail = element.scheduleEmail;
        obj.confirmationemail = element.confirmationemail;
        obj.confirmationSMS = element.confirmationSMS;
        obj.centerId = Auth.getCenterId();
        console.log(obj);
        staf.push(obj);
        console.log(staf);
        StaffService.saveStaffNotification(staf).then(function(resp) {
          console.log(resp);
        });
      }
    };

  }]);
}());
