
(function () {
  angular.module('center').controller('savingsAccountController',
   ['$scope', 'procedureCatalogService', '$localStorage', '$state', '$rootScope', 'procedureFactory', 'Auth', 'savingsService',
  function ($scope, procedureCatalogService, $localStorage, $state, $rootScope, procedureFactory, Auth, savingsService) {
    // $scope.procformlist = {};


    console.log('savings controller');
    $scope.transactionDate = new Date();
    $scope.deposit = function() {
      var transactionData = {
        accountNumber: $scope.accountNumber,
        transactions: {
          transactionEmployeeId: Auth.getCenterId(),
          transactorCustName: $scope.depositorName,
          transactionType: $scope.transactionType,
          transactionAmount: $scope.transactAmount,
          transactionDate: $scope.transactionDate
        }
      };
      savingsService.savingsDeposite(transactionData).then(function (response) {
        console.log(response);
      });
    };



    $scope.withdraw = function() {
      var transactionData = {
        accountNumber: $scope.accountNumber,
        transactions: {
          transactionEmployeeId: Auth.getCenterId(),
          transactorCustName: $scope.withdrawerName,
          transactionType: $scope.transactionType,
          transactionAmount: $scope.transactAmount,
          transactionDate: $scope.transactionDate
        }
      };
      savingsService.savingsWithdraw(transactionData).then(function (response) {
        console.log(response);
      });
    };





    $scope.edit = function(p, $index) {
      p.centerId = Auth.getCenterId();
      console.log(p);
      $scope.currentEditIndex = $index;
      canclval = angular.copy(p);
    };

    $scope.cancel = function($index) {
      var index = $index;
      $scope.currentEditIndex = -1;
      $scope.proclist.splice(index, 1);
      $scope.proclist.push(canclval);
      $scope.showProc();
    };

    $scope.deleteItem = function(p, $index) {
      console.log(p._id);
      $scope.currentEditIndex = -1;
      procedureCatalogService.delProc(p._id).then(function (response) {
        $scope.showProc();
        $scope.currentEditIndex = -1;

      }, function (err) {
        // $scope.proclist[$index] = $scope.backupProcData[$index];
      });
    };

    $scope.saveItem = function(p, $index) {
      var procToSend = {};
      procToSend.procedureName = p.procedureName;
      procToSend.procedureCost = p.procedureCost;
      procToSend.xTooth = p.xTooth;
      procToSend.notes = p.notes;
      procToSend._id = p._id;
      procToSend.centerId = p.centerId;
      console.log(procToSend);
      $scope.currentEditIndex = -1;
      procedureCatalogService.editProc(procToSend).then(function (response) {
        $scope.currentEditIndex = -1;
        $scope.showProc();
      }, function (err) {
       // $scope.proclist[$index] = $scope.backupProcData[$index];
      });
    };

    $scope.showProc = function() {
      console.log('---inside showProc() controller------');
      procedureCatalogService.showProc(centerId).then(function(res) {
        $scope.proclist = res.data.data;
        $scope.category = res.data.data[0].CategoryName;
        console.log($scope.proclist);
        console.log($scope.category);
      });
    };
  }]);
}());
