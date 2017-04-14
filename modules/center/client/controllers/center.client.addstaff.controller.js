(function () {
  angular.module('center').controller('addStaffController', ['$scope', 'StaffService', '$localStorage', '$state', '$rootScope', 'Flash', 'Auth',
  function ($scope, StaffService, $localStorage, $state, $rootScope, Flash, Auth) {
    var auth_data = {};
    Auth.getUser().then(function(res) {
      auth_data = res.data;
    });
    $scope.addStaff = function() {
      var staffData = $scope.formDataStaff;
      staffData.centerIds = Auth.getCenterId();
      staffData.idCustomer = auth_data.idCustomer;
      StaffService.addStaff(staffData).then(function(err, data) {
        if (!err) {
          Flash.create('success', '<strong>Staff</strong> added successfully.');
          $state.go('center.settings.staff.managestaff');
        } else {
          Flash.create('warning', err.message);
        }
      }).catch(function(response) {
        Flash.create('warning', response.data.message);
      });
    };
    $scope.cancel = function () {
      $state.go('center.settings.staff.managestaff');
    };
  }]);
}());
