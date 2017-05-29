(function () {
  'use strict';

  angular
        .module('manager')
        .config(routerConfig);

  routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routerConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/signin');


  }

}());
