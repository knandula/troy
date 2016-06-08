
import angular from 'angular';
import 'ngSanitize';
import 'angular-material';
import 'angular-messages';
import 'angular-ui-router';
import 'ui-router-extras';
import 'angular-google-analytics';



var appModule = angular.module('app', [
        'ngSanitize',
        'ngMessages',
        'ngMaterial',
        'angular-google-analytics',
        'ct.ui.router.extras',
        'ui.router'
    ]
);

appModule
    .config(function($locationProvider, $httpProvider, $urlRouterProvider, $stateProvider) {
        $httpProvider.useApplyAsync(true);
        $stateProvider
            .state('home', {
                url: "/welcome",
                templateUrl: 'client/app/views/welcome.html',
                controller : 'AppController'
            })
            .state('main', {
                url:"/main",
                templateUrl: 'client/app/views/main.html',
                controller : 'streatbeatcntrl'
            });
        $urlRouterProvider.otherwise("/welcome");
        //      allow case insensitive urls
        $urlRouterProvider.rule(function ($injector, $location) {
//          what this function returns will be set as the $location.url
            var path = $location.path(), normalized = path.toLowerCase();
            if (path !== normalized) {
//              instead of returning a new url ,change the $location.path directly so we needn't to worry about building a new url string and so new state change is not triggered
                $location.replace().path(normalized);
            }
        });
    });

appModule.run(function ($rootScope, $state, $location) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        console.log(toState);
        console.log(fromState);
    });
});

export default appModule;
