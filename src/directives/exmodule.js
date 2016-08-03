angular.module('schemaForm').directive('sfExmodule', ['$rootScope', 'sfSelect', 'sfPath', 'schemaForm',
  function ($rootScope, sel, sfPath, schemaForm) {
    return {
      require: '^sfSchema',
      scope: false,
      link: {
        pre: function (scope, element, attrs, sfSchema) {
          scope.form = sfSchema.lookup['f' + attrs.sfField];
        },
        post: function (scope, element, attrs, sfSchema) {
          scope.clickEvent = function () {
            window.moduleFunctions[scope.form.exmoduleOptions.moduleName].click(scope);
          };
        }
      }
    };
  }]
);
