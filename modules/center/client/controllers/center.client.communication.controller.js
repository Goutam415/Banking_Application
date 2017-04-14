
(function () {
  angular.module('center').controller('communicationController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', 'commService', 'commFactory', 'lodash', function ($scope, Auth, $localStorage, $state, $rootScope, Flash, commService, commFactory, lodash) {
    commFactory.getCenterId().then(function (response) {
      var centerId = response.data._id;
      commFactory.centerId = centerId;
      commService.getSMSTemplates(centerId).then(function(res) {
        $scope.smsTemplates = res.data.data;
      });
      $scope.tab = 1;
      $state.go('center.settings.communications.appointment');
      $scope.setTab = function (tabId) {
        $scope.tab = tabId;
      };
      $scope.isSet = function (tabId) {
        return $scope.tab === tabId;
      };
      $scope.saveSMS = function() {
        var data = {};
        data.centerId = centerId;
        var templates = [];
        lodash.forEach($scope.smsTemplates, function(element) {
          var obj = {};
          obj.templateID = element.templateID;
          obj.content = element.content;
          obj.active = element.active;
       // obj.attributes_used = element.attributes_used;
          templates.push(obj);
        });
        data.templates = templates;
        commService.updateSMSTemplates(data).then(function(response) {
          var message1 = '<strong> Your SMS is saved </strong>';
          Flash.create('success', message1);
        }, function (err) {
          var message2 = '<strong> Your SMS is not saved </strong>';
          Flash.create('warning', message2);

        });
      };
    });

  }]).directive('mentionExample', function (lodash) {
    return {
      require: 'uiMention',
      scope: {
        template: '='
      },
      link: function link(scope, element, attrs, uiMention) {
      /**
       * $mention.findChoices()
       *
       * @param  {regex.exec()} match    The trigger-text regex match object
       * @todo Try to avoid using a regex match object
       * @return {array[choice]|Promise} The list of possible choices
       */
        // var choices = scope.$parent.smsTemplates.attributes_used;
        var choices = [];
        lodash.forEach(scope.$parent.smsTemplates, function (template) {
          lodash.forEach(template.attributes_used, function (attributes) {
            choices.push({ first: attributes.display_value, last: '' });
          });
        });

        uiMention.findChoices = function (match, mentions) {
          return choices
        // Remove items that are already mentioned
        // .filter(function (choice) {
        //   return !mentions.some(function (mention) {
        //     return mention.id === choice.id;
        //   });
        // })
        // Matches items from search query
        .filter(function (choice) {
          return ~(choice.first + ' ' + choice.key).indexOf(match[1]);
          // return ~(choice).indexOf(match[1]);
        });
        };
      }
    };
  });
}());

(function () {
  angular.module('center').controller('emailsController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', 'commService', 'commFactory', 'lodash', function ($scope, Auth, $localStorage, $state, $rootScope, Flash, commService, commFactory, lodash) {
    commFactory.getCenterId().then(function (response) {
      var centerId = response.data._id;
      commFactory.centerId = centerId;
      commService.getEmailTemplates(centerId).then(function (response) {
        $scope.emails = response.data.data;
      });
      $scope.saveEmails = function() {
        var data = {};
        data.centerId = centerId;
        var templates = [];
        lodash.forEach($scope.emails, function(element) {
          var obj = {};
          obj.templateID = element.templateID;
          obj.active = element.active;
          templates.push(obj);
        });
        data.templates = templates;
        commService.updateEmailTemplates(data).then(function(response) {
          var message1 = '<strong> Your EMAILS is saved </strong>';
          Flash.create('success', message1);
        }, function (err) {
          var message2 = '<strong> Your EMAILS is not saved </strong>';
          Flash.create('warning', message2);
        });
      };
    });

  }]);
}());

(function () {
  angular.module('center').controller('settingsController', ['$scope', 'Auth', '$localStorage', '$state', '$rootScope', 'Flash', 'commService', 'commFactory', 'lodash', function ($scope, Auth, $localStorage, $state, $rootScope, Flash, commService, commFactory, lodash) {
    $scope.centerId = Auth.getCenterId();
    $scope.smsSettings = {};
    $scope.emailSettings = {};
    $scope.onSMSTime = null;
    $scope.beforeSMSTime = null;
    $scope.onEmailTime = null;
    $scope.beforeEmailTime = null;
    commService.getCenter($scope.centerId).then(function(resp) {
      var settingsData = lodash.get(resp, 'data.data');
      if (settingsData) {
        var centerData = settingsData[0];
        if (centerData.reminder_sms) {
          $scope.smsSettings = centerData.reminder_sms;
        }
        if (centerData.reminder_email) {
          $scope.emailSettings = centerData.reminder_email;
        }
        setUpDefaultTime();
      }

    });

    function setUpDefaultTime() {
      if ($scope.smsSettings.onAppointmentSMSTime || $scope.smsSettings.beforeAppointmentSMSTime || $scope.emailSettings.onAppointmentEmailTime || $scope.emailSettings.beforeAppointmentEmailTime) {
        $scope.onSMSTime = moment($scope.smsSettings.onAppointmentSMSTime, 'hmm').toDate();
        $scope.beforeSMSTime = moment($scope.smsSettings.beforeAppointmentSMSTime, 'hmm').toDate();
        $scope.onEmailTime = moment($scope.emailSettings.onAppointmentEmailTime, 'hmm').toDate();
        $scope.beforeEmailTime = moment($scope.emailSettings.beforeAppointmentEmailTime, 'hmm').toDate();
      }
    }
    function getTimeStringFromDate(date) {
      return moment(date).format('HH:mm:ss');
    }
    $scope.saveSettings = function() {
      if ($scope.onSMSTime || $scope.beforeSMSTime || $scope.onEmailTime || $scope.beforeEmailTime) {
        $scope.smsSettings.onAppointmentSMSTime = getTimeStringFromDate($scope.onSMSTime);
        $scope.smsSettings.beforeAppointmentSMSTime = getTimeStringFromDate($scope.beforeSMSTime);
        $scope.emailSettings.onAppointmentEmailTime = getTimeStringFromDate($scope.onEmailTime);
        $scope.emailSettings.beforeAppointmentEmailTime = getTimeStringFromDate($scope.beforeEmailTime);
      }
      var dataToSend = { 'centerId': $scope.centerId };
      dataToSend.sms = $scope.smsSettings;
      dataToSend.email = $scope.emailSettings;
      commService.updateSettings(dataToSend).then(function(response) {
        var message1 = '<strong> Your Settings are Saved </strong>';
        Flash.create('success', message1);
      }, function (err) {
        var message2 = '<strong> Your Settings are  not Saved </strong>';
        Flash.create('failure', message2);
      });
    };
  }]);
}());
