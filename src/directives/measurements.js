angular.module('schemaForm').directive('measurements', ['$compile', function($compile) {
  return {
    controller: ['$scope', '$rootScope', function($scope, $rootScope) {
      $scope.calculateValue = function (form) {
        if (!window.measurementFunctions || !window.measurementFunctions[form.measurementOptions.function]) {
          return;
        }
        window.measurementFunctions[form.measurementOptions.function]($scope, function(value) {
          // Saving the value should be done here since it's specific to ASF
          var model = $scope.model;
          var pointer;
          form.key.forEach(function(value) {
            // ascending down the object path
            if (typeof model[value] === 'object') {
              model = model[value];
            } else if (form.key.length == form.key.indexOf(value) + 1) {
              // desired model-attribute found (last key)
              pointer = value;
            } else {
              // create objectpath to the desired model-attribute
              model[value] = {};
              model = model[value];
            }
          });
          model[pointer] = value;
        });
      };

      $scope.reset = function(form) {
        $scope.measurements = [];
        $('#measurementContainer' + form.key.slice(-1)[0] + ' input')[0].focus();
        $scope.calculateValue(form);
      };
    }]
  };
}]);