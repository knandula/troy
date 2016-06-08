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
                    url: "/welcome",
                    templateUrl: 'client/app/views/welcome.html',
                    controller: 'AppController'
                }).state('main', {
                    url: "/main",
                    templateUrl: 'client/app/views/main.html',
                    controller: 'streatbeatcntrl'
                });
                $urlRouterProvider.otherwise("/welcome");

                $urlRouterProvider.rule(function ($injector, $location) {
                    var path = $location.path(),
                        normalized = path.toLowerCase();
                    if (path !== normalized) {
                        $location.replace().path(normalized);
                    }
                });
            }]);

            appModule.run(["$rootScope", "$state", "$location", function ($rootScope, $state, $location) {

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                    console.log(toState);
                    console.log(fromState);
                });
            }]);

            _export('default', appModule);
        }
    };
});
//# sourceMappingURL=config.js.map
