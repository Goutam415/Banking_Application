
(function () {
  angular.module('center').factory('emrFactory', ['$q', '$localStorage', 'Auth',
        function ($q, $localStorage, Auth) {
          'use strict';
          return {
            emrData: {},
            centerId: '',
            getCenterId: function () {
              return Auth.getCenterId();
            },
            setData: function (data) {
              if (data === null) {
                data = {};
              }
              this.emrData = data;

            },
            getObservations: function () {
              return angular.extend([], this.emrData.observations);
            },
            getComplaints: function() {
              return angular.extend([], this.emrData.complaints);
            },
            getDiagnoses: function() {
              return angular.extend([], this.emrData.diagnoses);
            },
            getInvestigations: function() {
              return angular.extend([], this.emrData.investigations);
            },
            getFileLabels: function() {
              return angular.extend([], this.emrData.fileLabels);
            },
            getNotes: function() {
              return angular.extend([], this.emrData.notes);
            },
            getVitals: function() {
              console.log(this.emrData.vitals);
              return angular.extend([], this.emrData.vitals);
            },
            reset: function () {
              this.emrData = {};
            }
          };
        }]);
}());

