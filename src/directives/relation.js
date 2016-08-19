angular.module('schemaForm').directive('sfRelation', ['$rootScope', 'sfSelect', 'sfPath', 'schemaForm', '$window', '$location',
  function ($rootScope, sel, sfPath, schemaForm, $window, $location) {
    return {
      require: '^sfSchema',
      link: {
        pre: function (scope, element, attrs, sfSchema) {
          scope.form = sfSchema.lookup['f' + attrs.sfField];
        },
        post: function (scope, element, attrs) {
          scope.linking = scope.depends(scope.form.relationOptions.schema, scope.form.relationOptions.path);
          scope.linking.then(function (data) {
            scope.records = data.records;
            scope.recordTitle = scope.form.relationOptions.schema;
          });

          scope.editRecord = function (record) {
            var breakPoint = '/schemas/';
            $window.open(
              $location.absUrl().slice(0, $location.absUrl().indexOf(breakPoint) + breakPoint.length) +
              record.schema.id +
              '/edit/' + record.id, '_blank'
            );
          };
        }
      }
    };
  }]
);
