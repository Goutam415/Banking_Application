(function () {
  angular.module('center').controller('dashboardController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', 'centerService', 'StaffService', 'dashboardService',
  function ($scope, Auth, $localStorage, $state, $rootScope, Flash, centerService, StaffService, dashboardService) {
    // Dashboard functions start here
    $().ready(function() {
      $('[rel="tooltip"]').tooltip();

    });

    function rotateCard(btn) {
      var $card = $(btn).closest('.card-container');
      console.log($card);
      if ($card.hasClass('hover')) {
        $card.removeClass('hover');
      } else {
        $card.addClass('hover');
      }
    }

    // Dashboard functions end here
    // Hide and show function start here

    $scope.hide = function() {
      $scope.myVar = !$scope.myVar;
    };

    // Hide and Show function end here

    // Date picker function starts here
    $scope.accountOpenDate = new Date();
    // Date picker function ends here

    // Account create function start here

    $scope.create = function () {
      var accountData = {
        accountNumber: $scope.accountNumber,
        customerId: $scope.customerId,
        accountType: $scope.accountType,
        creatorId: Auth.getCenterId(),
        accountDetails: {
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          middleName: $scope.MiddleName,
          ifscCode: $scope.ifscCode,
          address: $scope.Address,
          accountOpenDate: $scope.accountOpenDate,
          email: $scope.email,
          phoneNumber: $scope.phoneNumber,
          dob: $scope.dob,
          occupation: $scope.occupation
        }




      };
       // TODO handle login failure case
      dashboardService.createAccount(accountData).success(function(response) {
        console.log('successfully created account');
        console.log(response._id);
        $scope.myVar = !$scope.myVar;
      });
    };


    // Account create function end here
    console.log('dashboard controller');
    Auth.getUser().then(function(res) {
      $scope.user = res.data;
      console.log(res.data);
     // console.log($scope.user);
     // Auth.setCenterId(res.data.centerIds[0]._id);
    });

    $scope.capturedImages = {
      'id': 0,
      'show': false,
      'base64': ''
    };
    $scope.handleImage = function(e) {
      if (e.files && e.files[0]) {
        var reader = new FileReader();
        reader.onload = function(el) {
          var id = e.parentElement.id;
         // resizeBase64(el.target.result, 400, 400, false, function(err, base64Img) {
          $scope.$apply(function() {
            $scope.capturedImages.base64 = el.target.result;
            $scope.capturedImages.show = true;
          });
          // });
        };
        reader.readAsDataURL(e.files[0]);
        e.value = '';
      }
    };
    $scope.remImg = function(item) {
      item.base64 = '';
      item.show = false;
    };
    $scope.updateProfile = function() {
      console.log('updateProfile');
      var data = {};
      data.img = $scope.capturedImages.base64;
      data.id = $scope.user._id;
      StaffService.updateProfile(data);
    };
  }]);
}());
// image resize and base64
function resizeBase64(dataUrl, w, h, r, cb) {
  var image = new Image();
  image.onload = function() {

    if (w > this.width) {

      cb(null, dataUrl);
      return;
    }
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var ar = null;
    if (this.width && this.height) {
      ar = this.width / this.height;
    }
    if (ar === null) {
      ar = 1;
    }
    canvas.width = w;
    canvas.height = w / ar;
        // camera orientation
    if (r) {
      canvas.width = w / ar;
      canvas.height = w;
      ctx.rotate(Math.PI / 2);
      ctx.translate(0, -canvas.width);
    }
    ctx.drawImage(image, 0, 0, w, w / ar);
    var cDataUrl = canvas.toDataURL('image/jpeg');
    cb(null, cDataUrl);
    canvas = null;

  };
  image.src = dataUrl;
}
