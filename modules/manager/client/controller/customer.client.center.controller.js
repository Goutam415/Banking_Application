(function () {
  angular.module('manager').controller('centerController', ['$scope', '$state', '$rootScope', 'Flash', 'managerService', '$stateParams',
   function ($scope, $state, $rootScope, Flash, managerService, $stateParams) {
     console.log('center controller');
     $scope.data = {
       repeatSelect: null,
       availableOptions: [
        { id: 'silver', name: 'Silver' },
        { id: 'gold', name: 'Gold' },
        { id: 'platinum', name: 'Platinum' }
       ]
     };

     $scope.createCenter = function() {
       var finalData = $scope.practice;
       finalData.idOwner = $stateParams.owner;
       finalData.idmanager = $stateParams.manager;
       managerService.cretaeCenter(finalData)
      .then(function(response) {
        $scope.practice = {};
        alert('Form submitted Successfully');
        $state.go('app.dash');
      }, function(error) {
        console.log(error);
      });
     };

   }]);
}());
