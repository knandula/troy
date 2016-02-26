System.register(['client/config'], function (_export) {
    'use strict';
    var appModule;
    return {
        setters: [function (_clientConfig) {
            appModule = _clientConfig['default'];
        }],
        execute: function () {

            appModule.controller('LoginController', ['$rootScope', function ($rootScope) {
                var self = this;
            }]);

            appModule.controller('AppController', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
                $scope.app = {
                    name: 'StreatBeat',
                    description: 'StreatBeat',
                    author: 'StreatBeat'
                };

                $scope.is = function (name) {
                    return $state.is(name);
                };

                $scope.includes = function (name) {
                    return $state.includes(name);
                };

                $scope.showSearchOverlay = function () {
                    $scope.$broadcast('toggleSearchOverlay', {
                        show: true
                    });
                };
            }]);

            appModule.controller("streatbeatcntrl", ['$scope', '$http', function ($scope, $http) {
                var myStyle = {
                    "color": "#ff7800",
                    "weight": 5,
                    "opacity": 0.65
                };

                $scope.postLayer = function () {
                    var good_geojson = '{"type": "Feature", "properties": {"name": "Diamond park", "amenity": "Floating Stadium", "popupContent": "Fantastic!"}, "geometry": {"type": "Point","coordinates": [100, 80]}}';
                    $http.post('http://localhost:3000/api/maplayers', good_geojson).success(function (response) {}).error(function () {});
                };

                $scope.callback = function (map) {
                    $http.get('http://localhost:3000/api/maplayers').success(function (response) {
                        $scope.lays = response;
                        L.geoJson($scope.lays, { onEachFeature: onEachFeature }).addTo(map);
                    }).error(function () {});

                    function onEachFeature(feature, layer) {
                        if (feature.properties && feature.properties.popupContent) {
                            layer.bindPopup(feature.properties.popupContent);
                        }
                    }
                };
            }]);
        }
    };
});
//# sourceMappingURL=controllers.js.map
