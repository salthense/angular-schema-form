angular.module('schemaForm').directive('measurements', ['$compile', function($compile) {
  return {
    controller: ['$scope', function($scope) {

      $scope.getLabel = function(titleSchema, index) {
        var label = index + 1;
        if (!titleSchema || titleSchema.length < 1) {
          return label;
        }
        return label + ' (' + titleSchema[index % titleSchema.length] + ')';
      }

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