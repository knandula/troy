/**
 * Created by knandula on 26/02/16.
 */
'use strict'
import appModule from 'client/config';

appModule.controller('LoginController',
    ['$rootScope',
        function($rootScope){
            var self = this;

        }
]);

appModule.controller('AppController', ['$scope', '$rootScope', '$state',
    function($scope, $rootScope, $state) {
        // App globals
        $scope.app = {
            name: 'StreatBeat',
            description: 'StreatBeat',
            author: 'StreatBeat'
        };
        // Checks if the given state is the current state
        $scope.is = function(name) {
            return $state.is(name);
        };

        // Checks if the given state/child states are present
        $scope.includes = function(name) {
            return $state.includes(name);
        };

        // Broadcasts a message to pgSearch directive to toggle search overlay
        $scope.showSearchOverlay = function() {
            $scope.$broadcast('toggleSearchOverlay', {
                show: true
            });
        };
    }]);

appModule.controller("streatbeatcntrl",['$scope','$http',function($scope,$http){
    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };

    $scope.postLayer= function() {
        var good_geojson = '{"type": "Feature", "properties": {"name": "Diamond park", "amenity": "Floating Stadium", "popupContent": "Fantastic!"}, "geometry": {"type": "Point","coordinates": [100, 80]}}';
        $http.post('http://localhost:3000/api/maplayers',good_geojson).success(function(response){

        }).error(function()
        {

        });
    }

    $scope.callback = function (map) {
        $http.get('http://localhost:3000/api/maplayers').success(function(response){
            $scope.lays= response;
            L.geoJson($scope.lays,{onEachFeature : onEachFeature}).addTo(map);
        }).error(function()
        {

        });

        function onEachFeature(feature, layer) {
            // does this feature have a property named popupContent?
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }
    };

}])