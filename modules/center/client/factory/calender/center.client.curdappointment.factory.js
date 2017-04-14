(function () {
  angular.module('center').factory('crudAppointment', function ($http, Auth, appointmentService) {

    var appointmentList = null;
    function simpleStringify(object) {
      var simpleObject = {};
      for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
          continue;
        }
        if ((object[prop] instanceof Date)) {
          object[prop] = object[prop].getTime();
        }

        if (typeof(object[prop]) === 'object') {
          continue;
        }
        if (typeof(object[prop]) === 'function') {
          continue;
        }
        simpleObject[prop] = object[prop];
      }
      return simpleObject;
        // return JSON.stringify(simpleObject); // returns cleaned up JSON
    }

    function getTime(val) {
      if (val instanceof Date) {
        return parseInt(val.getTime() / 1000, 10);
      }
      return val;

    }
    function getData(data) {
      return {
        type: data.type,
        patient_name: data.idPatient,
        doctor_id: data.idDoctor,
        my_id: data._id,
        title: data.title,
        start: getTime(data.start),
        end: getTime(data.end),
        allDay: data.allDay,
        className: data.className,
        classList: data.classList,
        location: data.location,
        info: data.info,
        status: data.status
      };
    }

    function getList(cb) {

      appointmentService.getAppointmentsByCenter(Auth.getCenterId()).success(function(response) {
        var list = response.data;
        var temp = [];
        list = list ? filterByStatus(list) : [];
        for (var i = 0; i < list.length; i++) {
          temp.push(getData(list[i]));
        }
        cb(temp);
      }).error(function(params) {
        cb([]);
      });
    }

    function filterByStatus(list) {
      var updatedList = [];
      if (list) {
        var completed = [];
        var progress = [];
        var waiting = [];
        var arrived = [];
        var created = [];
        for (var i = 0; i < list.length; i++) {
          switch (list[i].status) {
            case 'completed' :
              completed.push(list[i]);
              break;
            case 'progress' :
              progress.push(list[i]);
              break;
            case 'waiting' :
              waiting.push(list[i]);
              break;
            case 'arrived' :
              arrived.push(list[i]);
              break;
            case 'created' :
              created.push(list[i]);
              break;
          }
        }
        list = completed.concat(progress, waiting, arrived, created);
      }
      return list;
    }

    function setList(list) {
      var str;
      var temp = [];
      if (list) {
        for (var i = 0; i < list.length; i++) {
          temp.push(getData(list[i]));
        }
        str = JSON.stringify(temp);
        window.localStorage.setItem('appointmentlist', str);
      } else {
        console.error('No data found');
      }
    }

    return {
      getAppointmentList: function (cb) {
        getList(function(data) {
          appointmentList = data;
          cb(data);
        });
      },
      removeAppointment: function (id, item) {
        var list = appointmentList;
        if (!list.length) {
          console.error('Index Bound Exception');
        }
      },
      addAppointment: function (item, cb) {
        if (item) {
          appointmentService.addAppointment(item).success(function(response) {
            cb(null);
          }).error(function(response) {
            alert('error while saving appointment');
            cb('error');
          });
        }
      },
      updateAppointmentById: function (item) {
        if (!item) {
          return;
        }
        item = getData(item);
        var list = appointmentList;
        for (var i = 0; i < list.length; i++) {
          if (list[i].my_id === item.my_id) {
            list[i] = item;
            break;
          }
        }
        var str = JSON.stringify(list);
        window.localStorage.setItem('appointmentlist', str);

      },
      updateCompleteList: function (list) {
        setList(list);
      }
    };
  });
}());
