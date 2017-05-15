(function(window) {
  'use strict';

  var applicationModuleName = 'center';

  var service = {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ngStorage', 'ngFlash', 'ui.mention', 'ngSanitize',
      'ngMessages',
      'picardy.fontawesome',
      'ui.bootstrap',
      'ui.utils',
      'angular-loading-bar',
      'ui.sortable',
      'ui.select',
      'ui.calendar',
      'ngMaterial',
      'ngLodash'
    ],
    registerModule: registerModule
  };


  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }
}(window));