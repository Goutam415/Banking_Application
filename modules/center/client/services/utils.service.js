
(function () {
  angular.module('center').service('utils', ['$http', '$q', '$localStorage', 'urls', 'lodash',
        function ($http, $q, $localStorage, urls, lodash) {
          return {
            inDuplicationChecking: function(array, inDuplicate) {
              return !!lodash.find(array, function(item) {
                return item.name === inDuplicate;
              });
            }
          };
        }]);
}());
