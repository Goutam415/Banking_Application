(function () {

  angular.module('center').controller('billingpaymodeController',
    ['$scope', '$localStorage', '$state', '$rootScope', 'billingService', 'billingFactory', 'Auth',
    function ($scope, $localStorage, $state, $rootScope, billingService, billingFactory, Auth) {

      $scope.paymodetyp = ['Cash', 'Card', 'Cheque', 'Net Banking', 'Other'];
      var cancelval;
      var centerId = Auth.getCenterId();

      billingService.showpmd(centerId).then(function(res) {
        $scope.paymodelist = res.data.data;
        console.log($scope.paymodelist);
      });

      $scope.savepmd = function() {
        if ($scope.mode.length > 0 && $scope.type.length > 0 && $scope.fee.length > 0) {
          var dataToSend = {};
          dataToSend.mode = $scope.mode;
          dataToSend.type = $scope.type;
          dataToSend.fee = $scope.fee;
          dataToSend.centerId = Auth.getCenterId();
          console.log(dataToSend);
          billingFactory.setData(dataToSend);
          billingService.savepmd(dataToSend).then(function (response) {
            $scope.showpmd();
            $scope.backupPaymode = billingFactory.getPaymode();
            $scope.currentEditIndex = -1;
            $scope.mode = '';
            $scope.type = '';
            $scope.fee = '';
          }, function (err) {
            $scope.mode = '';
            $scope.type = '';
            $scope.fee = '';
          });
        }
      };

      $scope.edit = function(pd, $index) {
        $scope.currentEditIndex = $index;
        cancelval = angular.copy(pd);
      };

      $scope.cancel = function($index) {
        var index = $index;
        $scope.currentEditIndex = -1;
        $scope.paymodelist.splice(index, 1);
        $scope.paymodelist.push(cancelval);
        $scope.showpmd();
      };

      $scope.deleteItem = function(pd, $index) {
        $scope.currentEditIndex = -1;
        billingService.delpmd(pd._id).then(function (response) {
          $scope.currentEditIndex = -1;
          $scope.showpmd();
        }, function (err) {
          $scope.paymodelist[$index] = $scope.backupPaymode[$index];
        });
      };


      $scope.savepd = function(pd, $index) {
        var paymodeToSend = {};
        paymodeToSend.mode = pd.mode;
        paymodeToSend.type = pd.type;
        paymodeToSend.fee = pd.fee;
        paymodeToSend._id = pd._id;
        paymodeToSend.centerId = pd.centerId;
        $scope.currentEditIndex = -1;
        billingService.editpmd(pd._id, paymodeToSend).then(function (response) {
          $scope.currentEditIndex = -1;
          $scope.showpmd();
        }, function (err) {
          $scope.paymodelist[$index] = $scope.backupPaymode[$index];
        });
      };

      $scope.showpmd = function() {
        billingService.showpmd(centerId).then(function(res) {
          $scope.paymodelist = res.data.data;
          console.log($scope.paymodelist);
        });
      };
      $scope.showpmd();

    }]);
}());
