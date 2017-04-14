(function () {
  angular.module('center').controller('eventController', function ($scope, $uibModalInstance, items, $http, $log, Auth, timeForamtter, docFilter, StaffService, patientService) {

    function getAppointmentColor(color) {
        // return type === "normal" ? 'b-l b-2x b-primary b-green' : 'b-l b-2x b-red';
      return 'b-l b-2x b-' + color.toLowerCase() + '-calender';
    }

    if (items instanceof Date) {
      angular.extend($scope, {
        notes: '',
        appointmentType: 'normal',
        name: '',
        doctor: '',
        dt: new Date(items),
        my_id: 'ankit' + (new Date().getTime())
      });
      $scope.mytime = new Date(items);
    } else if (items) {
      angular.extend($scope, {
        notes: items.info,
        appointmentType: items.type,
        name: items.patient_name,
        doctor: items.doctor_id,
        dt: new Date(items.start),
        mytime: items.start,
        my_id: items.my_id
      });
    } else {
      angular.extend($scope, {
        notes: '',
        appointmentType: 'normal',
        name: '',
        doctor: '',
        dt: new Date(),
        my_id: 'ankit' + (new Date().getTime()),
        mytime: new Date()
      });
    }

    $scope.today = function () {
      $scope.dt = new Date();
    };

    // $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function () {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      'class': 'datepicker'
    };


    $scope.hstep = 1;
    $scope.mstep = 1;// slot time

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    /*   $scope.toggleMode = function () {
     $scope.ismeridian = !$scope.ismeridian;
     };

     $scope.update = function () {
     var d = new Date();
     d.setHours(14);
     d.setMinutes(0);
     $scope.mytime = d;
     };*/

    $scope.changed = function () {
      console.log('Time changed to: ' + $scope.mytime);
    };


    $scope.clear = function () {
      $scope.mytime = null;
    };

    /* $http.get('/getPatient?ownerID=' + Auth.getCenterId()).then(function (response) {
      $scope.patientList = response.data.data;
    });*/

    Auth.getUser().then(function(response) {
      patientService.getPatientList(response.data.idCustomer).success(function(response) {
        console.log(response);
        $scope.patientList = response.data;
      });
    });

    StaffService.getDoctorList(Auth.getCenterId()).then(function (response) {
      $scope.doctorList = response.data.doctor;
    });

    /**
     * save doctor appointment
     **/
    $scope.ok = function () {
      if ($scope.name && $scope.doctor) {
        var d = docFilter.getSelectedDoctorDetails($scope.doctorList, $scope.doctor);

        var p = docFilter.getSelectedPatientDetails($scope.patientList, $scope.name);
        var color = getAppointmentColor(d.calColor) + ' ' + ($scope.appointmentType === 'emergency' ? $scope.appointmentType : '');
        var appointmentStartTime = timeForamtter.getAppointmentTime($scope.dt, $scope.mytime);
        var appointmentEndTime = timeForamtter.addMinutes(appointmentStartTime, 15);// (15 minutes equivalent)

        $uibModalInstance.close({
          type: $scope.appointmentType,
          idPatient: $scope.name,
          idDoctor: $scope.doctor,
          title: p.name + ' Appointment to Dr. ' + d.name,
          start: parseInt(appointmentStartTime / 1000, 10),
          end: parseInt(appointmentEndTime / 1000, 10),
          allDay: false,
          className: [color],
          classList: color,
          location: '',
          color: 'white',
          info: $scope.notes,
          status: 'created',
          idCenter: Auth.getCenterId()
                // timer: timer
        });
      } else {
        alert('Please select Doctor and patient!');
      }
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
}());
