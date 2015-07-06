/**
 * Created by rachanti on 6/23/2015.
 */
'use strict'
var app =  angular.module('streatbeatmodule',['ngRoute']);

app.config(['$httpProvider','$routeProvider',function($httpProvider,$routeProvider) {
    $httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;

    $routeProvider
        .when('/', {
            templateUrl: 'app/views/streatbeat.html',
            controller: 'streatbeatcntrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}
]);

app.directive('mapbox', [
    function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                callback: "="
            },
            template: '<div></div>',
            link: function (scope, element, attributes) {
                L.mapbox.accessToken = 'pk.eyJ1IjoiYmx1ZWdlbmUiLCJhIjoiZjMwNzU2ZmQyMzdlMGQ3YjlkYTRmYmY3ZGY5N2RhMDMifQ.gnt0BCmgUCChF56g7kEo7Q';
                var map = L.mapbox.map(element[0], 'examples.map-i86nkdio');
                scope.callback(map);
            }
        };
    }
]);