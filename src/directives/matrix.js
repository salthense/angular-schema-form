angular.module('schemaForm').directive('sfMatrix', ['$rootScope', 'sfSelect', 'sfPath', 'schemaForm',
  function($rootScope, sel, sfPath, schemaForm) {
    return {
      scope: false,
      link: function(scope, element, attrs) {
        /* MUST be updated after every $scope.matrixElements update*/
        var $scope = new Proxy(scope, {
          set: function (obj, prop, newVal) {
            switch (prop) {
              case 'matrixElements':
                obj[prop] = newVal;
                $scope.activeGroups = [];
                $scope.form.schema.items.properties.row.enum.forEach(function (val) {
                  $scope.activeGroups.push(false);
                });
                $scope.setGroupState();
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

        var schemaId = scope.schema.id;

        var unregisterModelUpdate = $rootScope.$on('modelUpdated', function () {
          /* arguments[1] is the scope with model*/
          if (schemaId !== arguments[1].schema.id) {
            return;
          }
          updateFn();
          var keys = attrs.sfMatrix.split('[').map(function (key) {
            return key.replace(']', '').split('\'').join('');
          });
          var elm = arguments[1];
          keys.forEach(function (key) {
            elm = elm[key];
          });
          $scope.matrixElements = elm;
        });

        $scope.$on('$destroy', function () {
          unregisterModelUpdate();
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

        var getGroups = function (rows) {
          var counter = -1;
          return rows.map(
            function (arr, i) {
              return {maxIndex: counter += arr.length, group: i + 1};
            }
          );
        };
        $scope.isFirstInGroup = function (index) {
          var group = $scope.getGroupForRow(index).group - 1;
          var prevGroup = $scope.rowGroups[group - 1];
          if (index === 0) {
            return true;
          } else if (prevGroup !== undefined) {
            if ($scope.rowGroups[group - 1].maxIndex === index - 1) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        };
        $scope.getGroupForRow = function (index) {
          return $scope.rowGroups.find(function (group) {
            return index <= group.maxIndex;
          });
        };
        $scope.rowClass = function (index) {
          return 'matrix-group-' + $scope.getGroupForRow(index).group + ($scope.isFirstInGroup(index) ? ' matrix-group-first':'');
        };
        $scope.setGroupState = function () {
          $scope.activeGroups = $scope.activeGroups.map(function () { return false; });
          $scope.matrixElements.forEach(function (elm, index) {
            var i = Math.floor(index / $scope.matrixColumns.length);
            if (elm.selected) {
              $scope.activeGroups[$scope.getGroupForRow(i).group - 1] = true;
            }
          });
          var allDisable = $scope.activeGroups.every(function (val) {
            return val === false;
          });
          if (allDisable) {
            $scope.activeGroups = $scope.activeGroups.map(function () { return true; });
          }
        };

        $scope.rowGroups = $scope.form.schema.items.properties.row.enum;
        $scope.matrixColumns = $scope.form.schema.items.properties.column.enum;
        $scope.matrixRows = $scope.form.schema.items.properties.row.enum;
        $scope.matrixMap = {};

        var updateFn = function() {
          $scope.matrixElements = $scope.$eval(attrs.sfMatrix) || [];

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
        updateFn();
      }
    };
  }]
);
