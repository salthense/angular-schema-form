/**
 * Takes the form definition as argument.
 * Evaluates the expression passed as "formula" and sets it as the new value of
 * the underlying model property.
 */
angular.module('schemaForm').directive('sfFormula', function() {
  return {
    require: 'ngModel',
    restrict: 'AC',
    scope: false,
    link: function(scope, element, attrs, ctrl) {
      var form = scope.$eval(attrs.sfFormula);
      //"form" is really guaranteed to be here since the decorator directive
      //waits for it. But best be sure.
      if (form && form.formula) {
        if (form.formula.indexOf(';') != -1) {
          var formulaParts = form.formula.split(';');
          var variablesToWatch = formulaParts[0].split(',');
          var formulaExpression = formulaParts[1];

          var watchVariable = function (variable) {
            scope.$watch(variable, function() {
              ctrl.$setViewValue(scope.$eval(formulaExpression));
              ctrl.$render();
            });
          }

          for (var i = 0; i < variablesToWatch.length; i++) {
            watchVariable(variablesToWatch[i]);
          }
        }
      }
    }
  };
});
