(function () {
  angular.module('manager').controller('createController', ['$scope', '$state', '$rootScope', 'Flash', 'managerService', function ($scope, $state, $rootScope, Flash, managerService) {
    $scope.practiceList = [];
    $scope.country = [{ id: 1, name: 'India' }];
    $scope.stateList = [
      {
        'StateId': 1,
        'StateName': 'Andaman and Nicobar Island',
        'CountryId': 1
      },
      {
        'StateId': 2,
        'StateName': 'Andhra Pradesh',
        'CountryId': 1
      },
      {
        'StateId': 3,
        'StateName': 'Arunachal Pradesh',
        'CountryId': 1
      },
      {
        'StateId': 4,
        'StateName': 'Assam',
        'CountryId': 1
      },
      {
        'StateId': 5,
        'StateName': 'Bihar',
        'CountryId': 1
      },
      {
        'StateId': 6,
        'StateName': 'Chandigarh',
        'CountryId': 1
      },
      {
        'StateId': 7,
        'StateName': 'Chhattisgarh',
        'CountryId': 1
      },
      {
        'StateId': 8,
        'StateName': 'Dadra and Nagar Haveli',
        'CountryId': 1
      },
      {
        'StateId': 9,
        'StateName': 'Daman and Diu',
        'CountryId': 1
      },
      {
        'StateId': 10,
        'StateName': 'Delhi',
        'CountryId': 1
      },
      {
        'StateId': 11,
        'StateName': 'Goa',
        'CountryId': 1
      },
      {
        'StateId': 12,
        'StateName': 'Gujarat',
        'CountryId': 1
      },
      {
        'StateId': 13,
        'StateName': 'Haryana',
        'CountryId': 1
      },
      {
        'StateId': 14,
        'StateName': 'Himachal Pradesh',
        'CountryId': 1
      },
      {
        'StateId': 15,
        'StateName': 'Jammu and Kashmir',
        'CountryId': 1
      },
      {
        'StateId': 16,
        'StateName': 'Jharkhand',
        'CountryId': 1
      },
      {
        'StateId': 17,
        'StateName': 'Karnataka',
        'CountryId': 1
      },
      {
        'StateId': 18,
        'StateName': 'Kerala',
        'CountryId': 1
      },
      {
        'StateId': 19,
        'StateName': 'Lakshadweep',
        'CountryId': 1
      },
      {
        'StateId': 20,
        'StateName': 'Madhya Pradesh',
        'CountryId': 1
      },
      {
        'StateId': 21,
        'StateName': 'Maharashtra',
        'CountryId': 1
      },
      {
        'StateId': 22,
        'StateName': 'Manipur',
        'CountryId': 1
      },
      {
        'StateId': 23,
        'StateName': 'Meghalaya',
        'CountryId': 1
      },
      {
        'StateId': 24,
        'StateName': 'Mizoram',
        'CountryId': 1
      },
      {
        'StateId': 25,
        'StateName': 'Nagaland',
        'CountryId': 1
      },
      {
        'StateId': 26,
        'StateName': 'Odisha',
        'CountryId': 1
      },
      {
        'StateId': 27,
        'StateName': 'Puducherry',
        'CountryId': 1
      },
      {
        'StateId': 28,
        'StateName': 'Punjab',
        'CountryId': 1
      },
      {
        'StateId': 29,
        'StateName': 'Rajasthan',
        'CountryId': 1
      },
      {
        'StateId': 30,
        'StateName': 'Sikkim',
        'CountryId': 1
      },
      {
        'StateId': 31,
        'StateName': 'Tamil Nadu',
        'CountryId': 1
      },
      {
        'StateId': 32,
        'StateName': 'Telangana',
        'CountryId': 1
      },
      {
        'StateId': 33,
        'StateName': 'Tripura',
        'CountryId': 1
      },
      {
        'StateId': 34,
        'StateName': 'Uttar Pradesh',
        'CountryId': 1
      },
      {
        'StateId': 35,
        'StateName': 'Uttarakhand',
        'CountryId': 1
      },
      {
        'StateId': 36,
        'StateName': 'West Bengal',
        'CountryId': 1
      }
    ];
    $scope.users = {
      address: {}
    };
    $scope.ownerDetails = {
      address: {}
    };
    $scope.data = {
      repeatSelect: null,
      availableOptions: [
        { id: 'silver', name: 'Silver' },
        { id: 'gold', name: 'Gold' },
        { id: 'platinum', name: 'Platinum' }
      ]
    };
    $scope.addPractice = function() {
      $scope.practiceList.push({});
    };
    $scope.createCenter = function() {
      var finalData = {};
      finalData.center = $scope.practice;
      finalData.users = $scope.users;
      finalData.ownerDetails = $scope.ownerDetails;
      // $scope.finalData.address = $scope.address;
      // $scope.finalData.users.idowner = 1;
      // $scope.finalData.center.idOwner = 1;
      managerService.savemanager(finalData)
      .then(function(response) {
        $scope.users = {};
        $scope.address = {};
        $scope.practiceList = {};
        $scope.practice = {};
        $scope.ownerDetails = {};
        $state.go('app.dash');
        alert('Form submitted Successfully');

      }, function(error) {
        console.log(error);
      });
    };
    $scope.getCity = function () {
      console.log($scope.practice.address.state);
      managerService.getCity($scope.practice.address.state.StateId).then(function(d) {
        console.log(d);
      });
    };
    managerService.getRoles().then(function(resp) {
      $scope.roles = resp.data;
      console.log($scope.roles);
    }, function(err) {
      var warningmessage = '<strong>roles are not avaliable</strong>';
      Flash.create('warning', warningmessage);
    });


  }]);
}());
