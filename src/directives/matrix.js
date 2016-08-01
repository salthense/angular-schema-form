angular.module('schemaForm').directive('sfMatrix', ['$rootScope', 'sfSelect', 'sfPath', 'schemaForm',
  function($rootScope, sel, sfPath, schemaForm) {
    return {
      scope: false,
      link: function(scope, element, attrs, sfSchema) {
        /* MUST be updated after every $scope.matrixElements update*/
        var $scope = new Proxy(scope, {
          set: function (obj, prop, newVal) {
            switch (prop) {
              case 'matrixElements':
                obj[prop] = newVal;
                $scope.activeIds = 0;
                $scope.matrixElements.forEach(function (elm, i) {
                  if (elm.selected) {
                    $scope.setGroupState(i, elm.selected);
                  }
                });
                break;
              case 'matrixRows':
                obj[prop] = flattenRowsGroup(newVal);
                break;
              case 'rowGroups':
                obj[prop] = getGroups(newVal);
                break;
              default: obj[prop] = newVal;
            }
          }
        });

        $scope.activeIds = 0;

        /* arguments[1] is the scope with model*/
        $rootScope.$on('modelUpdated', function () {
          var keys = attrs.sfMatrix.split('[').map(function (key) {
            return key.replace(']', '').split('\'').join('');
          });
          var elm = arguments[1];
          keys.forEach(function (key) {
            elm = elm[key];
          });
          $scope.matrixElements = elm;
        });

        var flattenRowsGroup = function (rows) {
          var finalRow = [];
          rows.forEach(function (row) {
            if (Array.isArray(row)) {
              finalRow = finalRow.concat(row);
            } else {
              finalRow.push(row);
            }
          });
          return finalRow;
        };

        var getGroups = function (rows) {
          var counter = -1;
          return rows.map(
            function (arr, i) {
              return {maxIndex: counter += arr.length, group: i + 1};
            }
          );
        };
        $scope.getGroupForRow = function (index) {
          return $scope.rowGroups.find(function (group) {
            return index <= group.maxIndex;
          });
        };
        $scope.rowClass = function (index) {
          return 'matrix-group-' + $scope.getGroupForRow(index).group;
        };
        $scope.setGroupState = function (index, newState) {
          if (newState === false) {
            if (--$scope.activeIds === 0) {
              $scope.activeGroup = -1;
            }
          } else {
            $scope.activeIds++;
            $scope.activeGroup = $scope.getGroupForRow(index).group;
          }
        };

        $scope.activeGroup = -1;
        $scope.rowGroups = $scope.form.schema.items.properties.row.enum;
        $scope.matrixElements = $scope.$eval(attrs.sfMatrix) || [];
        $scope.matrixColumns = $scope.form.schema.items.properties.column.enum;
        $scope.matrixRows = $scope.form.schema.items.properties.row.enum;
        $scope.matrixMap = {};

        var findElement = function(row, column) {
          var found = null;

          $scope.matrixElements.forEach(function(element) {
            if (element.row == row && element.column == column) {
              found = element;
              return;
            }
          });

          return found;
        }

        var newMatrixElements = [];
        var counter = 0;

        $scope.matrixRows.forEach(function(row) {
          $scope.matrixMap[row] = {};

          $scope.matrixColumns.forEach(function(column) {
            $scope.matrixMap[row][column] = counter;
            counter++;

            newMatrixElements.push(findElement(row, column) || {column: column, row: row, selected: false});
          });
        });

        $scope.matrixElements.splice(0, $scope.matrixElements.length);

        newMatrixElements.forEach(function(element) {
          $scope.matrixElements.push(element);
        });
        $scope.$eval(attrs.sfMatrix + '= matrixElements');
      }
    };
  }]
);
