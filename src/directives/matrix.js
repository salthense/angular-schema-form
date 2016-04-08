angular.module('schemaForm').directive('sfMatrix', ['sfSelect', 'sfPath', 'schemaForm',
  function(sel, sfPath, schemaForm) {
    return {
      scope: false,
      link: function(scope, element, attrs, sfSchema) {
        scope.matrixElements = scope.$eval(attrs.sfMatrix);
        scope.matrixColumns = scope.form.schema.items.properties.column.enum;
        scope.matrixRows = scope.form.schema.items.properties.row.enum;
        scope.matrixMap = {};

        var findElement = function(row, column) {
          var found = null;

          scope.matrixElements.forEach(function(element) {
            if (element.row == row && element.column == column) {
              found = element;
              return;
            }
          });

          return found;
        }

        var newMatrixElements = [];
        var counter = 0;

        scope.matrixRows.forEach(function(row) {
          scope.matrixMap[row] = {};

          scope.matrixColumns.forEach(function(column) {
            scope.matrixMap[row][column] = counter;
            counter++;

            newMatrixElements.push(findElement(row, column) || {column: column, row: row, selected: false});
          });
        });

        scope.matrixElements.splice(0, scope.matrixElements.length);

        newMatrixElements.forEach(function(element) {
          scope.matrixElements.push(element);
        });
      }
    };
  }]
);
