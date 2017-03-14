angular.module('schemaForm').directive('measurements', ['$compile', function($compile) {
  return {
    require: '^sfSchema',
    link: function (scope, element, attrs, sfSchema) {
      // look for sf index until it will found
      var timer = function () {
        if(element.closest('[sf-field]').length === 0) {
          setTimeout(timer, 50);
        } else {
          scope.form = sfSchema.lookup['f' + element.closest('[sf-field]').attr("sf-field")];
        }
      }
      scope.element = element;
    },
    controller: ['$scope', function($scope) {
      $scope.getLabel = function(titleSchema, index) {
        var label = index + 1;
        if (!titleSchema || titleSchema.length < 1) {
          return label;
        }
        return label + ' (' + titleSchema[index % titleSchema.length] + ')';
      }

      $scope.reset = function(form) {
        for (var key in $scope.modelArray) {
          delete $scope.modelArray[key].messwert;
        }
        $('#measurementContainer' + form.key.join('') + ' input')[0].focus();
      };

      $scope.$watch('modelArray', function(newVal, oldVal) {
        if (angular.isUndefined(newVal)) {
          $scope.modelArray = $scope.$eval($($scope.element).first().attr('ng-model') + ' = []');
        }

        while($scope.modelArray.length < $scope.form.elementCount) {
          $scope.modelArray.push({});
        }
        var deleteEmpty = function () {
          for(var i = 0; i < $scope.modelArray.length; i++) {
            try {
              if($scope.modelArray[i].messwert === null) {
                delete $scope.modelArray[i];
              }
            } catch(e) {}
          }
        }
        $scope.$evalAsync(deleteEmpty);
      });
    }]
  };
}]);