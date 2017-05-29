(function () {
  'use strict';

  angular
        .module('manager')
        .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/signin');
    $stateProvider
        .state('signin', {
          url: '/signin',
          views: {
            'header': {
              templateUrl: 'modules/manager/client/views/manager.client.head.view.html',
              controller: 'headerController'
            },
            'main': {
              templateUrl: 'modules/manager/client/views/manager.client.login.view.html',
              controller: 'loginController'
            }
          }
        })
        .state('app', {
          url: '/app',
          views: {
            'header': {
              templateUrl: 'modules/manager/client/views/manager.client.head.view.html',
              controller: 'headerController'
            },
            'main': {
              templateUrl: 'modules/manager/client/views/manager.client.app.view.html',
              controller: 'appController'
            }
          }
        })
        .state('app.dash', {
          url: '/dashboard',
          views: {
            'app': {
              templateUrl: 'modules/manager/client/views/manager.client.dashboard.view.html',
              controller: 'dashboardController'
            }
          }
        })
        .state('app.add', {
          url: '/create',
          views: {
            'app': {
              templateUrl: 'modules/manager/client/views/manager.client.cretae.view.html',
              controller: 'createController'
            }
          }
        }).state('app.addCenter', {
          url: '/create/center/:owner/:manager',
          views: {
            'app': {
              templateUrl: 'modules/manager/client/views/manager.client.addCenter.view.html',
              controller: 'centerController'
            }
          }
        });
  }

}());
