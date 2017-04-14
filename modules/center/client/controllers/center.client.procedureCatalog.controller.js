
(function () {
  angular.module('center').controller('procedureCatalogController',
   ['$scope', 'procedureCatalogService', '$localStorage', '$state', '$rootScope', 'procedureFactory', 'Auth',
  function ($scope, procedureCatalogService, $localStorage, $state, $rootScope, procedureFactory, Auth) {
    // $scope.procformlist = {};

    var canclval;
    var centerId = Auth.getCenterId();

    procedureCatalogService.getProcCategories(centerId).then(function(res) {
      $scope.under = res.data.data;
    });

    $scope.saveProcedurecatalog = function(idCat) {
      if ($scope.procs.procedureName.length > 0) {
        console.log('------inside saveProcedurecatalog() controller------');
        console.log(idCat);
        var drugToSend = {};
        drugToSend = {
          proceduresList: {
            idCategory: idCat,
            procedureName: $scope.procs.procedureName,
            procedureCost: $scope.procs.procedureCost,
            xTooth: $scope.procs.xTooth,
            notes: $scope.procs.notes,
            isTaxTDS: $scope.procs.isTaxTDS,
            isTaxVAT: $scope.procs.isTaxVAT
          }
        };
        drugToSend.centerId = Auth.getCenterId();
        console.log(drugToSend);
        procedureCatalogService.saveProc(drugToSend).then(function (res) {
          $scope.showProc();
          $scope.currentEditIndex = -1;
        }, function(err) {
          console.log(err);
        });
      }
    };

    $scope.saveCategory = function () {
      if ($scope.procs.procedureCategory.length > 0) {
        var drugTypeToSend = {};
        drugTypeToSend = {
          CategoryName: {
            procedureCategory: $scope.procs.procedureCategory
          }
        };
        drugTypeToSend.centerId = Auth.getCenterId();
        console.log(drugTypeToSend);
        procedureCatalogService.addCategory(drugTypeToSend).then(function(res) {
          console.log(res.data.data);
          $scope.showProc();
          $state.reload();
        }, function(err) {
          console.log(err);
        });
      }
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
