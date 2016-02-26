System.register(['angular', 'ngSanitize', 'angular-material', 'angular-messages', 'angular-ui-router', 'ui-router-extras', 'angular-google-analytics'], function (_export) {
    'use strict';

    var angular, appModule;
    return {
        setters: [function (_angular) {
            angular = _angular['default'];
        }, function (_ngSanitize) {}, function (_angularMaterial) {}, function (_angularMessages) {}, function (_angularUiRouter) {}, function (_uiRouterExtras) {}, function (_angularGoogleAnalytics) {}],
        execute: function () {
            appModule = angular.module('app', ['ngSanitize', 'ngMessages', 'ngMaterial', 'angular-google-analytics', 'ct.ui.router.extras', 'ui.router']);

            appModule.config(["$locationProvider", "$httpProvider", "$urlRouterProvider", "$stateProvider", function ($locationProvider, $httpProvider, $urlRouterProvider, $stateProvider) {
                $httpProvider.useApplyAsync(true);
                $stateProvider.state('home', {
                    url: '/',
                    templateUrl: 'index.html'
                });
                return $urlRouterProvider.otherwise(function ($injector) {
                    var $state = $injector.get('$state');
                    $state.go('home');
                });
            }]);

            _export('default', appModule);
        }
    };
});
//# sourceMappingURL=config.js.map
