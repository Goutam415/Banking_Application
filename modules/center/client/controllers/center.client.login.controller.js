(function () {
  angular.module('center').controller('loginController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', function ($scope, Auth, $localStorage, $state, $rootScope, Flash) {
    console.log('Login controller');

    $scope.validate = function () {
      var formData = {
        email: $scope.email,
        password: $scope.password
      };
       // TODO handle login failure case
      Auth.login(formData).success(function() {
        $state.go('app.dashboard');
      });
    };

    $scope.fp = function () {
      $('#myModal').modal();
    };

    $scope.forgetPass = function () {
      Auth.forgotPass($scope.email).then(function (res) {
        console.log(res);
        $('.modal.in').modal('hide');
        Flash.create('success', res.data.msg);
      });
    };
    var validateEmail = function (email) {
      var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return re.test(email);
    };
  }]);
}());
