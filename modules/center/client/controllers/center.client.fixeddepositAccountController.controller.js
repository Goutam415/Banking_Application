
(function () {
  angular.module('center').controller('fixeddepositAccountController',
   ['$scope', 'procedureCatalogService', '$localStorage', '$state', '$rootScope', 'procedureFactory', 'Auth', 'fixeddepositService',
  function ($scope, procedureCatalogService, $localStorage, $state, $rootScope, procedureFactory, Auth, fixeddepositService) {
    // $scope.procformlist = {};


    console.log('FD controller');
    $scope.fdOpen = function() {
      var fdData = {
        accountNumber: $scope.accountNumber,
        fdAccount: {
          accountCreatorEmployeeId: Auth.getCenterId(),
          transactionType: $scope.transactionType,
          fdAmount: $scope.transactAmount,
          rateOfInterest: $scope.roi,
          accountCloseDate: $scope.accountCloseDate
        }
      };
      fixeddepositService.fd_Open(fdData).then(function (response) {
        console.log(response.data.msg);
      });
    };



    $scope.withdraw = function() {
      var transactionData = {
        accountNumber: $scope.accountNumber,
        fdAccount: {
          accountClosingEmployeeId: Auth.getCenterId(),
          transactorCustName: $scope.withdrawerName,
          transactionType: $scope.transactionType,
          transactionAmount: $scope.transactAmount
        }
      };
      fixeddepositService.fd_Close(transactionData).then(function (response) {
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
