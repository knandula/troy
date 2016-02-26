
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
                url: '/',
                templateUrl: 'index.html'
            });
        return $urlRouterProvider.otherwise(function($injector){
            var $state = $injector.get('$state');
            $state.go('home');
        });
    });

export default appModule;
