(function () {
  'use strict';

  angular
      .module('center')
      .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
         .state('login', {
           url: '/login',
           views: {
             'header': {
               templateUrl: 'modules/center/client/views/header/center.client.header.view.html',
               controller: 'headerController'
             },
             'main': {
               templateUrl: 'modules/center/client/views/center.client.login.view.html',
               controller: 'loginController'
             }
           }
         })
         .state('app', {
           abstract: true,
           url: '/app',
           views: {
             'header': {
               templateUrl: 'modules/center/client/views/header/center.client.header.view.html',
               controller: 'headerController'
             },
             'main': {
               templateUrl: 'modules/center/client/views/center.client.app.view.html',
               controller: 'appController'
             },
             'leftNav': {
               templateUrl: 'modules/center/client/views/leftnav/center.client.dashboardnav.view.html',
               controller: 'dashboardNavController'
             }
           }
         })
        .state('app.dashboard', {
          url: '/dashboard',
          templateUrl: 'modules/center/client/views/center.client.dashboard.view.html',
          controller: 'dashboardController'
        })
        /* routes for center */
       .state('center', {
         abstract: true,
         url: '/center',
         views: {
           'header': {
             templateUrl: 'modules/center/client/views/header/center.client.header.view.html',
             controller: 'headerController'
           },
           'leftNav': {
             templateUrl: 'modules/center/client/views/leftnav/center.client.dashboardnav.view.html',
             controller: 'dashboardController'
           },
           'main': {
             template: '<div ui-view></div>'
           }
         }
       }).state('center.savings', {
         url: '/savings',
         templateUrl: 'modules/center/client/views/center.client.savingsaccount.view.html',
         controller: 'savingsAccountController'
       }).state('center.fixed_deposit', {
         url: '/fixed-deposit',
         templateUrl: 'modules/center/client/views/center.client.fixed_deposit.view.html',
         controller: 'fixeddepositAccountController'
       })
        .state('center.settings', {
          url: '/settings',
          templateUrl: 'modules/center/client/views/center.client.centerSettings.view.html'
        })
        .state('center.settings.centerinfo', {
          url: '/centerinfo',
          templateUrl: 'modules/center/client/views/center.client.centerinfo.view.html',
          controller: 'centerinfoController'
        })
       .state('center.settings.staff', {
         url: '/staff',
         templateUrl: 'modules/center/client/views/center.client.staff.view.html',
         controller: 'staffController'
       })
        .state('center.settings.staff.addDoc', {
          url: '/addDoc',
          views: {
            'staffsettings': {
              templateUrl: 'modules/center/client/views/center.client.addDoc.view.html',
              controller: 'addDocController'
            }
          }
        })
        .state('center.settings.staff.managestaff', {
          url: '/managestaff',
          views: {
            'staffsettings': {
              templateUrl: 'modules/center/client/views/center.client.staff.manageStaff.html',
              controller: 'staffController'
            }
          }
        })
        .state('center.settings.staff.staffNotification', {
          url: '/staffnotification',
          views: {
            'staffsettings': {
              templateUrl: 'modules/center/client/views/center.client.staff.staffNotification.html',
              controller: 'staffController'
            }
          }
        }).state('center.settings.staff.doctorVisitTime', {
          url: '/doctorvisittime',
          views: {
            'staffsettings': {
              templateUrl: 'modules/center/client/views/center.client.docVisitTime.view.html',
              controller: 'staffController'
            }
          }
        })
        .state('center.settings.staff.addstaff', {
          url: '/addstaff',
          views: {
            'staffsettings': {
              templateUrl: 'modules/center/client/views/center.client.addStaff.view.html',
              controller: 'addStaffController'
            }
          }
        })
        /* routes for center settings emr */
        .state('center.settings.emr', {
          url: '/emr',
          templateUrl: 'modules/center/client/views/center.client.emr.view.html',
          controller: 'emrController'
        })
        .state('center.settings.emr.complaints', {
          url: '/complaints',
          templateUrl: 'modules/center/client/views/center.client.emrcomplaints.view.html',
          controller: 'emrComplaintsController'

        })
         .state('center.settings.emr.observations', {
           url: '/observations',
           templateUrl: 'modules/center/client/views/center.client.emrobservations.view.html',
           controller: 'emrObservationController'
         })
         .state('center.settings.emr.diagnoses', {
           url: '/diagnoses',
           templateUrl: 'modules/center/client/views/center.client.emrdiagnoses.view.html',
           controller: 'emrDiagnosesController'
         })
         .state('center.settings.emr.investigations', {
           url: '/investigations',
           templateUrl: 'modules/center/client/views/center.client.emrinvestigations.view.html',
           controller: 'emrInvestigationsController'
         })
         .state('center.settings.emr.notes', {
           url: '/notes',
           templateUrl: 'modules/center/client/views/center.client.emrnotes.view.html',
           controller: 'emrNotesController'
         })
         .state('center.settings.emr.filelabels', {
           url: '/filelabels',
           templateUrl: 'modules/center/client/views/center.client.emrfilelabels.view.html',
           controller: 'emrFilelabelsController'
         })
         .state('center.settings.emr.vitals', {
           url: '/vitals',
           templateUrl: 'modules/center/client/views/center.client.emrvitals.view.html',
           controller: 'emrVitalsController'
         })
         /* routes for center settings communications */
        .state('center.settings.communications', {
          url: '/centerSettingscommunications',
          templateUrl: 'modules/center/client/views/center.client.communicationtabs.view.html',
          controller: 'communicationController'
        })
        .state('center.settings.communications.appointment', {
          url: '/appointment',
          templateUrl: 'modules/center/client/views/center.client.communications.appointment.view.html',
          controller: 'communicationController'
        })
        .state('center.settings.communications.wishsms', {
          url: '/wishsms',
          templateUrl: 'modules/center/client/views/center.client.communications.wishsms.view.html',
          controller: 'communicationController'
        })
        .state('center.settings.communications.emails', {
          url: '/emails',
          templateUrl: 'modules/center/client/views/center.client.communications.emails.view.html',
          controller: 'emailsController'
        })
        .state('center.settings.communications.settings', {
          url: '/settings',
          templateUrl: 'modules/center/client/views/center.client.communications.settings.view.html',
          controller: 'settingsController'
        })
        .state('center.settings.doctortimimgs', {
          url: '/doctortimimgs',
          templateUrl: 'modules/center/client/views/center.client.staff.editdoctorTime.view.html',
          controller: 'doctorVisitTimeController'
        })
        .state('center.settings.calendar', {
          url: '/calendar',
          templateUrl: 'modules/center/client/views/center.client.calendersetting.view.html',
          controller: 'staffController'

        }).state('center.settings.calendar.centertimings', {
          url: '/centertimings',
          views: {
            'calendarSettings': {
              templateUrl: 'modules/center/client/views/center.client.calendersetting.centertimings.view.html',
              controller: 'centerTimingsController'
            }
          }
        }).state('center.settings.calendar.appointment', {
          url: '/appointmentcategory',
          views: {
            'calendarSettings': {
              templateUrl: 'modules/center/client/views/center.client.calendersetting.appointment.view.html',
              controller: 'appointmentCategoryController',
              activetab: 'calendar/appointmentcategory'
            }
          }
        })
        .state('center.list', {
          url: '/list',
          views: {
            'main': {
              templateUrl: 'modules/center/client/views/center.client.list.view.html',
              controller: 'staffListController'
            }
          }
        })
    .state('center.settings.procedurecatalog', {
      url: '/procedurecatalog',
      templateUrl: 'modules/center/client/views/center.client.procedureCatalog.view.html',
      controller: 'procedureCatalogController'
    })
    .state('center.settings.treatmentplans', {
      url: '/treatmentplans',
      templateUrl: 'modules/center/client/views/center.client.treatmentPlansList.view.html',
      controller: 'treatmentplansController'
    })
    .state('center.settings.addtreatmentplans', {
      url: '/addtreatmentplans',
      templateUrl: 'modules/center/client/views/center.client.treatmentplans.view.html',
      controller: 'treatmentplansController'
    })
    .state('center.settings.billing', {
      url: '/billing',
      templateUrl: 'modules/center/client/views/center.client.billing.view.html'
    })
    .state('center.settings.billing.taxCatalog', {
      url: '/taxCatalog',
      views: {
        'billingtabs': {
          templateUrl: 'modules/center/client/views/center.client.billing.taxCatalog.view.html',
          controller: 'billingtaxCatalogController'
        }
      }
    })
    .state('center.settings.billing.paymode', {
      url: '/paymode',
      views: {
        'billingtabs': {
          templateUrl: 'modules/center/client/views/center.client.billing.paymode.view.html',
          controller: 'billingpaymodeController'
        }
      }
    })
    .state('center.settings.billing.cancelled', {
      url: '/cancelled',
      views: {
        'billingtabs': {
          templateUrl: 'modules/center/client/views/center.client.billing.cancelled.view.html'
        }
      }
    })
    .state('center.settings.drug', {
      url: '/drug',
      templateUrl: 'modules/center/client/views/center.client.prescription.view.html',
      controller: 'drugController'
    })
    .state('calender', {
      url: '/calender',
      views: {
        'header': {
          templateUrl: 'modules/center/client/views/header/center.client.header.view.html',
          controller: 'headerController'
        },
        'main': {
          templateUrl: 'modules/center/client/views/calender/center.client.calender.view.html',
          controller: 'calendarCtrl'
        }
      }
    }).state('consultation', {
      abstract: true,
      url: '/consultation',
      views: {
        'header': {
          templateUrl: 'modules/center/client/views/header/center.client.header.view.html',
          controller: 'headerController'
        },
        'main': {
          template: '<div ui-view></div>'
        },
        'leftNav': {
          templateUrl: 'modules/center/client/views/leftnav/center.client.dashboardnav.view.html',
          controller: 'dashboardNavController'
        }
      }
    });

  }
}());
