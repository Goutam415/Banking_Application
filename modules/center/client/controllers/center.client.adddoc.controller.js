(function () {
  angular.module('center').controller('addDocController', ['$scope', 'StaffService', '$localStorage', '$state', '$rootScope', 'Flash', 'Auth',
  function ($scope, StaffService, $localStorage, $state, $rootScope, Flash, Auth) {
    $scope.calColor = ['cyan', 'amethyst', 'orange', 'red', 'yellow', 'green', 'blue', 'aqua', 'greensea', 'dutch', 'hotpink', 'drank', 'slategray'];
    var auth_data = {};
    Auth.getUser().then(function(res) {
      auth_data = res.data;
    });

    $scope.addDoctor = function() {
      var docData = $scope.formData;
      docData.centerIds = Auth.getCenterId();
      docData.idCustomer = auth_data.idCustomer;
      StaffService.addDoctor(docData).then(function(err, data) {
        if (!err) {
          Flash.create('success', '<strong>Doctor</strong> added successfully.');
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
