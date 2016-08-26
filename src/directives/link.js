angular.module('schemaForm').directive('sfLink', ['$rootScope', 'sfSelect', 'sfPath', 'schemaForm',
  function ($rootScope, sel, sfPath, schemaForm) {
    var getQuery = function (scope) {
      return 'model' + scope.form.key.map(function (elm) {
        if (elm === '') {
          elm = scope.$index;
        } else {
          elm = '\'' + elm + '\'';
        }
        return '[' + elm + ']';
      }).join('');
    };
    return {
      require: ['^sfSchema', '^ngModel'],
      options: '=sfOptions',
      scope: false,
      link: {
        pre: function (scope, element, attrs, requireArray) {
          scope.form = requireArray[0].lookup['f' + attrs.sfField];
          scope.$evalAsync(function () {
            if(scope.evalInScope(getQuery(scope)) !== undefined) {
              scope.inputValue = scope.evalInScope(getQuery(scope)).title;
              scope.isValueSet = scope.inputValue !== undefined;
            }
          });
        },
        post: function (scope, element, attrs, requireArray) {
          scope.change = function () {
            scope.isValueSet = false;
            if (scope.inputValue === '') {
              scope.evalInScope(getQuery(scope) + '=undefined');
            }
          };
          scope.setLink = function ($item, $model, $label, $event, $index) {
            /* activate save button after click on dropdown */
            requireArray[1].$setDirty();
            /* update gloabal model */
            scope.$item = $item;
            scope.evalInScope(getQuery(scope) + '=$item');
            /* update view */
            scope.inputValue = $item.title;
            scope.isValueSet = true;
          };
        }
      }
    };
  }]
);
