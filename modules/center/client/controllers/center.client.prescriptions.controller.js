(function () {

  angular.module('center').controller('drugController',
  ['$scope', 'drugCatalogService', '$localStorage', '$state', '$rootScope', 'Auth', '$window',
   function ($scope, drugCatalogService, $localStorage, $state, $rootScope, Auth, $window) {

     var centerId = Auth.getCenterId();
     drugCatalogService.getDrug(centerId).then(function(res) {
       $scope.druglist = res.data.data;
     });

     $scope.deleteItem = function(d, $index) {
       $scope.currentEditIndex = -1;
       drugCatalogService.delDrug(d._id).then(function (response) {
         $scope.currentEditIndex = -1;
         $scope.getDrug();
       }, function (err) {
        //  console.log('didnt delete');
       });
     };

    // get drug type and  populate select option
     drugCatalogService.getDrugTypes(centerId).then(function(res) {
       $scope.typp = res.data.data;
       console.log($scope.typp);
     });
    // get drug units and populate select option
     drugCatalogService.getDrugUnits(centerId).then(function(res) {
       $scope.units = res.data.data;
       // console.log($scope.units);
     });

     // get all drug's fields and populate table view
     $scope.getDrug = function() {
       drugCatalogService.getDrug(centerId).then(function(res) {
         $scope.druglist = res.data.data;
         console.log($scope.druglist);
       });
     };

     $scope.savePrescriptions = function(idUnit, idType) {
       if ($scope.prescriptions.DrugName.length > 0) {
         console.log('------inside savePrescriptions() controller------');
         console.log(idType);
         var drugToSend = {};
         drugToSend = {
           drugs: {
             idDrugUnit: idUnit,
             idDrugType: idType,
             DrugName: $scope.prescriptions.DrugName,
             DrugInstruction: $scope.prescriptions.DrugInstruction,
             DrugStrength: $scope.prescriptions.DrugStrength
           }
         };
         drugToSend.centerId = Auth.getCenterId();
         console.log(drugToSend);
         drugCatalogService.addDrug(drugToSend).then(function (res) {
           $scope.getDrug();
           $scope.currentEditIndex = -1;
           $scope.drug = null;
         }, function(err) {
           console.log($scope.drug);
           $scope.drug = null;
         });
       }
     };

     $scope.saveDrugType = function() {
       if ($scope.type.DrugTypeName.length > 0) {
         var drugTypeToSend = {};
         drugTypeToSend = {
           CategoryName: {
             DrugTypeName: $scope.type.DrugTypeName
           }
         };
         drugTypeToSend.centerId = Auth.getCenterId();
         console.log(drugTypeToSend);
         drugCatalogService.addDrugType(drugTypeToSend).then(function(res) {
           console.log(res.data.data);
           $scope.getDrug();
           $state.reload();
         }, function(err) {
           console.log(err);
         });
       }
     };

     $scope.myLoadingFunction = function() {
       $state.reload();
     };
     $scope.saveUnit = function() {
       if ($scope.unit.Unit.length > 0) {
         var drugUnitToSend = {};
         drugUnitToSend = {
           unit: {
             Unit: $scope.unit.Unit
           }
         };
         drugUnitToSend.centerId = Auth.getCenterId();
         console.log(drugUnitToSend);
         drugCatalogService.addDrugUnit(drugUnitToSend).then(function(res) {
           $scope.getDrug();
           $state.reload();
         }, function(err) {
           console.log(err);
         });

       }
     };
   }]);
}());

