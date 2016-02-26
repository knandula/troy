System.register(['client/pace_loader', 'client/config', 'jquery', 'jquery-unveil', 'jquery-scrollbar', 'jquery-ui', 'modernizr', 'client/controllers', 'client/directives', 'client/app/pages/pages', 'client/app/pages/directives/pg-search', 'client/app/pages/directives/pg-form-group'], function (_export) {
  'use strict';
  var appModule;
  return {
    setters: [function (_clientPace_loader) {}, function (_clientConfig) {
      appModule = _clientConfig['default'];
    }, function (_jquery) {}, function (_jqueryUnveil) {}, function (_jqueryScrollbar) {}, function (_jqueryUi) {}, function (_modernizr) {}, function (_clientControllers) {}, function (_clientDirectives) {}, function (_clientAppPagesPages) {}, function (_clientAppPagesDirectivesPgSearch) {}, function (_clientAppPagesDirectivesPgFormGroup) {}],
    execute: function () {
      _export('default', appModule);
    }
  };
});
//# sourceMappingURL=streatbeat.js.map
