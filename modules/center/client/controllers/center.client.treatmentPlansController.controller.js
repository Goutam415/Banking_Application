
(function () {
  angular.module('center').controller('treatmentplansController', ['$scope', '$localStorage', '$state', '$rootScope', 'Flash', 'procedureCatalogService', 'Auth', 'TreatmentPlanService', function ($scope, $localStorage, $state, $rootScope, Flash, procedureCatalogService, Auth, TreatmentPlanService) {
    console.log('treatmentplansController controller');

    $scope.showProcedure = false;
    $scope.treatmentDicount = false;
    $scope.treatmentTooth = false;
    $scope.treatmentNotes = false;
    console.log($scope.showProcedure);
    var centerId = Auth.getCenterId();

    procedureCatalogService.showProc(centerId).then(function(res) {
      $scope.mainProcedures = res.data.data[0].CategoryName;
      $scope.subProcedures = res.data.data[0].proceduresList;
      console.log($scope.mainProcedures);
      console.log($scope.subProcedures);
    });

    $scope.showSubProcedure = function(subdata, data) {
      $scope.showProcedure = true;
      $scope.treatmentPlans = subdata;
      $scope.maintreatmentPlans = data;
    };

    $scope.showDiscount = function() {
      $scope.treatmentDicount = !$scope.treatmentDicount;
    };

    $scope.showTooth = function() {
      $scope.treatmentTooth = !$scope.treatmentTooth;
    };

    $scope.addNotes = function() {
      $scope.treatmentNotes = !$scope.treatmentNotes;
    };

    $scope.addTreatmentPlans = function() {
      $state.go('center.settings.addtreatmentplans');
    };

    $scope.calculateTotalCost = function() {
      $scope.treatmentPlans.totalAmount = ($scope.treatmentPlans.quantity * $scope.treatmentPlans.procedureCost) - (($scope.treatmentPlans.procedureCost * $scope.treatmentPlans.discount) / 100);
      console.log($scope.treatmentPlans.totalAmount);
    };

    $scope.saveTreatmentPlans = function(subdata) {
      var sendData = {};
      var dataToSend = {
        treatmentPlans:
        {
          idSubProcedureCatalog: subdata,
          discount: {
            amount: $scope.treatmentPlans.procedureCost,
            isOffer: false,
            idOffer: $scope.loyaltyid,
            type: $scope.loyaltyType
          },
          notes: $scope.treatmentPlans.notes,
          amount: $scope.treatmentPlans.procedureCost,
          variants: [
            {
              quantity: $scope.treatmentPlans.quantity
                // teeth: [{
                //   $scope.treatments.xtooth
                // }]
            }
          ]
        }
      };
      dataToSend.centerId = Auth.getCenterId();
      console.log(dataToSend);
      TreatmentPlanService.createTreatmentPlans(dataToSend).then(function(resp) {
        console.log('success');
        console.log(resp);
      }, function(err) {
        console.log(err);
      });
    };


  }]);
}());

