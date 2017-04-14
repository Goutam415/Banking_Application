(function () {
  angular.module('center').service('ConsultationFactory', ['$http', '$q', 'urls', 'Auth', function ($http, $q, url, Auth) {
    'use strict';
    var saveddata = {};
    function getOwnerId() {
      return Auth.getUser();
    }
    function set(data) {
      saveddata = data;
    }

    function get() {
      return saveddata;
    }

    return {
      set: set,
      get: get, getOwnerId,
      centerName: '',
      ownerId: '',
      setOwnerId: function (id) {
        this.ownerId = id;
      },
      setCenterName: function (name) {
        this.centerName = name;
      }
    };
  }
    ]);
}());
