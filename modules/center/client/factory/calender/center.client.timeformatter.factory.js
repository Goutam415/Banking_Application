(function () {
  angular.module('center').factory('timeForamtter', function ($log) {
    var SEC_IN_YEAR = 31556926;
    var SEC_IN_DAY = 86400;
    var SEC_IN_HOUR = 3600;

    function generateEpochTime() {
    }

    return {
      epoch: function (d) {
        return (new Date(d).getTime() / 1000);
      },
      getAppointmentTime: function(d1, d2) {
        var m1 = moment(d1);
        var m2 = moment(d2);
        console.log('Date:: ' + m1.format('YYYY-MM-DD'));
        console.log('time:: ' + m2.format('HH:MM'));
        var m3 = moment(m1.format('YYYY-MM-DD') + ' ' + m2._d.getHours() + ':' + m2._d.getMinutes());
        return m3._d.getTime();
      },
      addMinutes: function(time, minutes) {
        var m = moment(time);
        m.add(minutes, 'm');
        return m._d.getTime();
      }
    };
  });
}());
