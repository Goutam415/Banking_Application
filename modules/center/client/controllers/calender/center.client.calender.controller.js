(function () {
  angular.module('center').controller('calendarCtrl', function (Flash, $timeout, $scope, $compile, uiCalendarConfig, $uibModal, $log, crudAppointment, Auth, $http, timeForamtter, docFilter, StaffService, patientService) {
        /* event source that contains custom events on the scope */
    $scope.events = [
            // {title: 'All Day Event',start: new Date(y, m, 1), className: ['b-l b-2x b-greensea']},
            // {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2), className: ['bg-dutch']},
            // {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
            // {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
            // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false, className: ['b-l b-2x b-default']},
            // {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/', className: ['b-l b-2x b-hotpink']},
            // {title: 'Make cupcakes', start: new Date(y, m, 2), className: ['b-l b-2x b-info'], location:'Bratislava', info:'The best in whole world.'},
            // {title: 'Call wife', start: new Date(y, m, 6),end: new Date(y, m, 7), className: ['b-l b-2x b-red'], location:'Piestany', info:'And say her hello.'}
    ];

    $scope.QueueStatusList = [
      'created',
      'arrived',
      'waiting',
      'progress',
      'completed'
    ];

    $scope.dragControlListeners = {
      accept: function (sourceItemHandleScope, destSortableScope) {return true;}, // override to determine drag is allowed or not. default is true.
      itemMoved: function (event) {/* Do what you want*/},
      orderChanged: function(event) {/* Do what you want*/},
      containment: '#sortable', // optional param.
      clone: true, // optional param for clone feature.
      allowDuplicates: false // optional param allows duplicates to be dropped.
    };


    $scope.onQueueStatusChange = function(e) {
      crudAppointment.updateAppointmentById(e);
      init();
    };

    var AllEvents = [];


    /* Refresh appointment and Doctor Data*/
    $scope.refreshEvents = function() {
      init();
    };
    $scope.addDoctor = function() {

    };

    $scope.addPatient = function() {

    };

    function getDoctorList() {
      StaffService.getDoctorList(Auth.getCenterId()).then(function (response) {
        $scope.doctorLists = response.data.doctor;
      });
    }

    function init() {
      $scope.currentDoctorSelected = 'none';
      $scope.isDoctor = Auth.isDoctor();
      $scope.isAdmin = Auth.isAdmin();
      getDoctorList();
      getEventsList();
    }
    /**
     * get calendar events
     **/
    function getEventsList() {
      crudAppointment.getAppointmentList(function(temp) {
        for (var i = 0; i < temp.length; i++) {
          temp[i].className = [];
          temp[i].className.push(temp[i].classList);
          temp[i].start = new Date(temp[i].start * 1000);
          temp[i].end = new Date(temp[i].end * 1000);
        }
        angular.extend($scope.events, temp);
        $scope.eventSources = [$scope.events];
      });
    }

    function initializeQueue() {
        /*   $timeout(function () {
                $("#sortable").sortable({
                    placeholder: "ui-state-highlight",
                    cursor: "move",
                    revert: true,
                    zIndex: 9999,
                    containment: "#sortable"
                });
                $("#sortable").disableSelection();

            }, 1);*/
    }


    window.removeWith = function (events) {
      events.preventDefault();
      events.stopPropagation();
      var e = AllEvents;
      var l = e.length;
      var isAvailable = false;
      var index;
      var id = $(events.target).attr('id');
      for (var i = 0; i < l; i++) {
        if (e[i].my_id === id) {
          isAvailable = true;
          index = i;
          break;
        }
      }
      if (isAvailable) {
        $scope.$apply(function () {
          $scope.remove(index);
        });
      }
    };


        /* event source that pulls from google.com */
    $scope.eventSource = {
      url: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic',
      className: 'gcal-event',           // an option!
      currentTimezone: 'india' // an option!
    };
    /* alert on dayClick */
    $scope.precision = 400;
    $scope.lastClickTime = 0;


        /*
        * This is a callback on double clicking of the date in the calender
        * */
    $scope.doubleClick = function (date, jsEvent, view) {
      var m = moment(date);
      if (m.isSameOrAfter(moment().format('YYYY-MM-DD'))) {// condition not allow edit appointment for past events/appointment
        $scope.eventClick(date);
      } else {
        alert('You are not allow to create/edit appointment on past days');
      }
    };


        /*
        * This is a callback on click of event click
        * */
    $scope.eventClick = function (item) {
      var m = moment(item.start);
      if (m.isSameOrAfter(moment().format('YYYY-MM-DD'))) {// condition not allow edit appointment for past events/appointment
        $scope.addEvent(item);
      } else {
        alert('You are not allow to create/edit appointment on past days');
      }
    };
        /* add custom event*/
    $scope.addEvent = function (item) {
      $scope.addEventModel(item);
    };


        /* alert on Drop */
    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
      crudAppointment.updateCompleteList($scope.events);
            // $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };

        /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
      $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    $scope.overlay = angular.element('.fc-overlay');

    $scope.alertOnMouseOver = function (event, jsEvent, view) {
      $scope.event = event;
      var m = moment(event.start);
      $scope.event.isAllowRemove = m.isSameOrAfter(moment().format('YYYY-MM-DD')) || (event.status === 'completed');

      $scope.overlay.removeClass('left right');
      var wrap = angular.element(jsEvent.target).closest('.fc-event');
      var cal = wrap.closest('.calendar');
      var left = wrap.offset().left - cal.offset().left;
      var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
      if (right > $scope.overlay.width()) {
        $scope.overlay.addClass('left');
      } else if (left > $scope.overlay.width()) {
        $scope.overlay.addClass('right');
      }
      if (wrap.find('.fc-overlay').length === 0) {
        wrap.append($scope.overlay);
      }
    };

    $scope.eventDragStart = function(event, delta, revertFunc, jsEvent, ui, view) {
      console.log(delta);
    };
        /* config object */
    $scope.uiConfig = {
      calendar: {
        disableDragging: true,
        height: 600,
        editable: true,
        header: {
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        dayClick: $scope.doubleClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventMouseover: $scope.alertOnMouseOver,
        eventClick: $scope.eventClick,
        eventDragStart: $scope.eventDragStart
      }
    };


        /* remove event */
    $scope.remove = function (index) {
      AllEvents.splice(index, 1);
      crudAppointment.updateCompleteList(AllEvents);
      $scope.events.length = 0;
      angular.extend($scope.events, docFilter.getAppointmentListFilteredByDoctor(AllEvents, $scope.currentDoctorSelected));
      initializeQueue();
    };

        /* Change View */
    $scope.changeView = function (view, calendar) {
      angular.element('.calendar').fullCalendar('changeView', view);
    };

    $scope.today = function (calendar) {
      angular.element('.calendar').fullCalendar('today');
    };
    $scope.refetch = function(calendar) {
      angular.element('.calendar').fullCalendar('refetchEvents');
    };


    $scope.addEventModel = function (item) {
      var modalInstance = $uibModal.open({
        templateUrl: 'calender_events.html',
        controller: 'eventController',
        size: 'lg',
        resolve: {
          items: function () {
            return item || '';
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        if (selectedItem) {
          crudAppointment.addAppointment(selectedItem);
          $scope.events.length = 0;
          var temp = docFilter.getAppointmentListFilteredByDoctor(AllEvents, $scope.currentDoctorSelected);
          $timeout(function () {
            $scope.$apply(function () {
              angular.extend($scope.events, temp);
              $scope.today();
              initializeQueue();
            });
          }, 0);
        }
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    $scope.filterDoctorAppointment = function (doctorID) {
      var temp;
      if (doctorID) {
        $scope.currentDoctorSelected = doctorID;
        temp = docFilter.getAppointmentListFilteredByDoctor(AllEvents, doctorID);
        $scope.events.length = 0;
      } else {
        $scope.currentDoctorSelected = 'none';
        temp = docFilter.getAppointmentListFilteredByDoctor(AllEvents, $scope.currentDoctorSelected);
        $scope.events.length = 0;
      }
      $timeout(function () {
        $scope.$apply(function () {
          angular.extend($scope.events, temp);
                   // $scope.today();
          $scope.refetch();
          initializeQueue();
        });
      }, 0);
    };
    $scope.sortingLog = [];
    var tmpList = [];
    $scope.sortableOptions = {
      update: function(e, ui) {
        var logEntry = tmpList.map(function(i) {
          return i;
        }).join(', ');
        $scope.sortingLog.push('Update: ' + logEntry);
      },
      stop: function(e, ui) {
            // this callback has the changed model
        var logEntry = tmpList.map(function(i) {
          return i;
        }).join(', ');
        $scope.sortingLog.push('Stop: ' + logEntry);
      }
    };

    init();
  });
}());// Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.
