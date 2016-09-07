angular.module('schemaForm').directive('measurements', ['$compile', function($compile) {
  return {
    controller: ['$scope', function($scope) {

      $scope.reset = function(form) {
        msValues = $('.measurementValue');
        msValues.each(function(index) {
          msValues[index].value = null;
        });
        $('#measurementContainer' + form.key.slice(-1)[0] + ' input')[0].focus();
      };
    }]
  };
}]);