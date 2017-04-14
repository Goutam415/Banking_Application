(function () {
  'use strict';
  angular.module('center').run(function($rootScope, $location, $state, Auth) {


    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      var isLogin = toState.name === 'login';
      Auth.getUser().success(function(res) {
        if (isLogin) {
          e.preventDefault(); // stop current execution
          $state.go('app.dashboard'); // go to dashboard
        }
      }).error(function(params) {
        if (!isLogin) {
          e.preventDefault(); // stop current execution
          $state.go('login'); // go to login
        }
      });
    });
  });
}());
