angular.module('schemaForm').directive('sfRelation', ['$rootScope', 'sfSelect', 'sfPath', 'schemaForm', '$window', '$location',
  function ($rootScope, sel, sfPath, schemaForm, $window, $location) {
    return {
      require: '^sfSchema',
      link: {
        pre: function (scope, element, attrs, sfSchema) {
          scope.form = sfSchema.lookup['f' + attrs.sfField];
          scope.relations = [];
        },
        post: function (scope, element, attrs) {
          /* depends is a function in a parent direktive in gertrude,
           * allows to get record which are related to chosen record
           */
          var schemaId = scope.schema.id;
          var init = function () {
            scope.linking = scope.depends(scope.form.relationOptions.schema, scope.form.relationOptions.path);
            scope.linking.then(function (data) {
              if (data !== null) {
                scope.records = data.records;
                scope.recordTitle = scope.form.relationOptions.schema;
                /* get path to the related field */
                var keys = scope.form.relationOptions.path.split('/').map(function (elm, i, arr) {
                  return elm.replace('[]', '');
                }).filter(function (elm, i, arr) {
                  return elm !== '';
                });
                /* function to fill ids(array) with related record-ids */
                var recursiveIdSearch = function (ids, obj, keys) {
                  if (keys.length > 1) {
                    var nextObj = obj[keys.splice(0, 1)[0]];
                    if (Array.isArray(nextObj)) {
                      /* array */
                      nextObj.forEach(function (elm, i, arr) {
                        recursiveIdSearch(ids, elm, angular.copy(keys));
                      });
                    } else {
                      recursiveIdSearch(ids, nextObj, keys);
                    }
                  } else {
                    ids.push(obj[keys[0]]);
                  }
                };
                scope.records.forEach(function (record, index) {
                  var relationsIds = [];
                  var promisesArray = [];
                  recursiveIdSearch(relationsIds, record.data, angular.copy(keys));
                  /* get related records from server */
                  relationsIds.forEach(function (id) {
                    promisesArray.push(scope.depends(scope.form.relationOptions.schema, id));
                  });
                  Promise.all(promisesArray).then(function (allRelations) {
                    if (allRelations.length > 0) {
                      /* linkedSchemaTitle is used for getting the html-template */
                      if (scope.linkedSchemaTitle === undefined) {
                        /* depends with 1 parameter returns a schema title */
                        scope.depends(allRelations[0].schema.id).then(function (title) {
                          scope.linkedSchemaTitle = title;
                        });
                      }
                      scope.relations[index] = allRelations;
                    }
                  });
                });
              } else {
                scope.relations = [];
                scope.records = null;
              }
            });
          };
          init();
          scope.editRecord = function (record) {
            var breakPoint = '/schemas/';
            /* open clicked record in a new tab */
            $window.open(
              $location.absUrl().slice(0, $location.absUrl().indexOf(breakPoint) + breakPoint.length) +
              record.schema.id +
              '/edit/' + record.id, '_blank'
            );
          };

          var unregisterModelUpdate = $rootScope.$on('modelUpdated', function (event, externalScope) {
            if (schemaId !== externalScope.schema.id) {
              return;
            }
            init();
          });

          scope.$on('$destroy', function () {
            unregisterModelUpdate();
          });

        }
      }
    };
  }]
);
