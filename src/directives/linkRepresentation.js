angular.module('schemaForm').directive('sfLinkRepresentation', ['$rootScope', 'sfSelect', 'sfPath', 'schemaForm',
  function ($rootScope, sel, sfPath, schemaForm) {
    return {
      require: '^sfSchema',
      scope: false,
      link: {
        post: function (scope, element, attrs, sfSchema) {
          var getRecordId = function () {
            return scope.$eval('model.' + scope.form.representationSettings.watchFor + '.id');
          };
          var init = function () {
            var id = parseInt(scope.$eval('model.' + scope.form.representationSettings.watchFor + '.id'), 10);
            /* Function from parent scope in gertrude */
            scope.depends(scope.form.representationSettings.schema, id).then(function (model) {
              scope.representationDatas = model.data;
              if (scope.representationDatas) {
                scope.$evalAsync(function () {
                  scope.isSet = true;
                });
              }
            });
          };
          /* values to get html template */
          scope.recordTitle = scope.form.representationSettings.schema;
          scope.template = scope.form.representationSettings.path;
          /*link directive will trigger this event by linking a new data */
          $rootScope.$on('setLink', function ($scope, key) {
            if(key === ('model.' + scope.form.representationSettings.watchFor)) {
              scope.isSet = false;
              scope.$evalAsync(function () {
                init();
              });
            }
          });
          /* init if the record already exists */
          if (getRecordId() !== undefined) {
            init();
          }
        }
      }
    };
  }]
);
