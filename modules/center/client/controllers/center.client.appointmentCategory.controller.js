
(function () {
  angular.module('center').controller('appointmentCategoryController', ['$scope', '$localStorage', '$state',
    '$rootScope', 'Flash', 'centerService', 'StaffService', 'Auth', function ($scope, $localStorage, $state, $rootScope, Flash, centerService, StaffService, Auth) {
      console.log('appointmentCategoryController controller');

      $scope.apps = [];
      $scope.colors = ['red', 'maroon', 'magenta', 'blueviolet', 'chocolate', 'chartreuse',
                       'darkcyan', 'darkorange', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta',
                       'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkseagreen', 'darkslateblue', 'darkturquoise',
                       'gray', 'green', 'khaki', 'greenyellow', 'fuchsia', 'gainsboro', 'gold', 'indigo', 'khaki', 'lavender',
                       'hotpink', 'lemonchiffon', 'mediumpurple', 'orange', 'peachpuff', 'rebeccapurple', 'seashell', 'wheat', 'yellowgreen',
                       'mediumseagreen', 'mediumpurple', 'lightskyblue'];

      var centerId = Auth.getCenterId();
      console.log(centerId);

      StaffService.getappcategory(centerId).then(function(response) {
        console.log(response.data);
        $scope.apps = response.data;
      });

      $scope.getAppointmentCategoryData = function() {
        StaffService.getappcategory(centerId).then(function(response) {
          console.log(response.data);
          $scope.apps = response.data;
        });
      };

      $scope.removeItem = function (x) {
        var data = $scope.apps[x];
        data.IsCategory = false;
        data.centerId = Auth.getCenterId();
        $scope.apps.splice(x, 1);
        StaffService.editappcategory(data).then(function(res) {
          console.log(res);
        }, function(err) {
          console.log(err);
        });
      };

      $scope.saveappCategory = function () {
        $scope.name.centerId = Auth.getCenterId();
        console.log($scope.name);
        centerService.sendappCategory($scope.name).then(function(response) {
          $scope.getAppointmentCategoryData();
          $scope.name = {};
        }, function (error) {
          console.log(error);
        });
      };

    }]);
}());
