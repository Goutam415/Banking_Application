(function() {
  angular.module('center').controller('consultationPatientListController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', 'ConsultationService', 'ConsultationFactory', function ($scope, Auth, $localStorage, $state, $rootScope, Flash, ConsultationService, ConsultationFactory) {
    $scope.patientdata = {};
    var ownerid;
    var getownerid = ConsultationFactory.getOwnerId();
    ownerid = getownerid.$$state.value.data._id;
    ConsultationService.getPatients(ownerid).then(function(res) {
      $scope.patients = res.data.data;
    });

    $scope.consultationImage = function (aPatient) {
      if (aPatient.image) {
        return aPatient.image;
      }
      return 'modules/patient/client/img/patient-image.png';
    };

    $scope.openPatientProfile = function(aPatient) {
      ConsultationFactory.set(aPatient);
      $scope.patientdata = ConsultationFactory.get();
      $state.go('center.consultation.patientprofile');

    };
    $scope.patientdata = ConsultationFactory.get();
    if (!$scope.patientdata.image) {
      $scope.patientdata.image = 'modules/patient/client/img/patient-image.png';
    }
    $scope.formattedAddress = function (addressObj) {
      var addrStr = '';
      if (addressObj) {
        addrStr += addressObj.addressLine1;

        if (addressObj.city) {
          addrStr += '' + addressObj.city;
        }
        if (addressObj.pinCode) {
          addrStr += ' ' + addressObj.pinCode;
        }
      }
      return addrStr;
    };
  }]);

}());
