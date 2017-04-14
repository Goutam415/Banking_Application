(function () {
  angular.module('center').controller('billingtaxCatalogController',
  ['$scope', '$localStorage', '$state', '$rootScope', 'billingService', 'billingFactory', 'Auth',
   function ($scope, $localStorage, $state, $rootScope, billingService, billingFactory, Auth) {
    // console.log('billingtaxCat controller');
    // taxCatalog's controller starts here
     $scope.taxVal = ['%', 'cash'];
     var canclval;

     var centerId = Auth.getCenterId();

     billingService.showTax(centerId).then(function(res) {
       $scope.taxlist = res.data.data;
       console.log($scope.taxlist);
     });

     $scope.saveTax = function() {
       console.log('-----before if condition in saveTax()----');
       if ($scope.taxName.length > 0 && $scope.taxValue.length > 0 && $scope.taxPercentage.length > 0) {
        // $scope.TaxValu.length can either be passed
         console.log('------inside saveTax() controller------');
         var taxToSend = {};
        // taxToSend.id = +(new Date());
         taxToSend.taxName = $scope.taxName;
         taxToSend.taxPercentage = $scope.taxPercentage;
         taxToSend.taxValue = $scope.taxValue;
         taxToSend.centerId = Auth.getCenterId();
         billingFactory.setTaxData(taxToSend);
         billingService.saveTax(taxToSend).then(function (res) {
           $scope.showTax();
           $scope.backupTaxData = billingFactory.getTaxData();
           $scope.currentEditIndex = -1;
           $scope.taxName = '';
           $scope.taxPercentage = '';
           $scope.taxValue = '';
         }, function(err) {
           $scope.taxName = '';
           $scope.taxPercentage = '';
           $scope.taxValue = '';
         });
       }
     };
     $scope.edit = function(t, $index) {
       $scope.currentEditIndex = $index;
       canclval = angular.copy(t);
     };

     $scope.cancel = function($index) {
       var index = $index;
       $scope.currentEditIndex = -1;
       $scope.taxlist.splice(index, 1);
       $scope.taxlist.push(canclval);
       $scope.showTax();
     };

     $scope.deleteItem = function(t, $index) {
       $scope.currentEditIndex = -1;
       billingService.delTax(t._id).then(function (response) {
         $scope.currentEditIndex = -1;
         $scope.showTax();
       }, function (err) {
         $scope.taxlist[$index] = $scope.backupTaxData[$index];
        // console.log("nt deleted");
       });
     };

     $scope.savetax = function(t, $index) {
       console.log(t);
       var taxToSend = {};
       taxToSend.taxName = t.taxName;
       taxToSend.taxPercentage = t.taxPercentage;
       taxToSend.taxValue = t.taxValue;
       taxToSend._id = t._id;
       taxToSend.centerId = t.centerId;
      // taxToSend.complaints = taxToSend;
       console.log('inside factory');
       $scope.currentEditIndex = -1;
       billingService.editTax(t._id, taxToSend).then(function (response) {
         console.log('inside service');
         $scope.currentEditIndex = -1;
         $scope.showTax();
       }, function (err) {
         $scope.taxlist[$index] = $scope.backupTaxData[$index];
       });
     };

     $scope.showTax = function() {
       console.log('---inside showTax() controller------');
       billingService.showTax(centerId).then(function(res) {
        // console.log(res.data.data);
         $scope.taxlist = res.data.data;
         console.log($scope.taxlist);
       });
     };
     $scope.showTax();

   }]);
}());
