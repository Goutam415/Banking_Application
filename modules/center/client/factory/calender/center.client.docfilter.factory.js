(function () {
  angular.module('center').factory('docFilter', function () {

    return {
      getAppointmentListFilteredByDoctor: function (list, doctorID) {
        var temp = [];
        if (doctorID === 'none') {
          return list;
        }
        for (var i = 0; i < list.length; i++) {
          if (list[i].doctor_id === doctorID) {
            temp.push(list[i]);
          }
        }
        return temp;
      },
      getSelectedDoctorDetails: function (list, selectedId) {
        for (var i = 0; i < list.length; i++) {
          if (list[i]._id === selectedId) {
            return list[i];
          }
        }
        return {};
      }, getSelectedPatientDetails: function (list, selectedId) {
        for (var i = 0; i < list.length; i++) {
          if (list[i]._id === selectedId) {
            return list[i];
          }
        }
        return {};
      }
    };
  });
}());
