System.register(['client/config'], function (_export) {
    'use strict';

    var appModule;
    return {
        setters: [function (_clientConfig) {
            appModule = _clientConfig['default'];
        }],
        execute: function () {

            appModule.directive('mapbox', [function () {
                return {
                    restrict: 'EA',
                    replace: true,
                    transclude: true,
                    scope: {
                        callback: '='
                    },
                    template: '<div><pre id="info" style=" display: block;position: relative;margin: 0px auto;width: 50%;padding: 10px;border: none;border-radius: 3px;font-size: 12px;text-align: center;color: #222;background: #fff;"></pre></div>',
                    link: function link(scope, element, attributes) {

                        var currentlats;
                        var currnetlong;

                        L.mapbox.accessToken = 'pk.eyJ1IjoiYmx1ZWdlbmUiLCJhIjoiY2lsMms0OHJnM2N3ZXU0bTN4Y3k2NTVsMCJ9.CRmZ9bRkRykd6v-5nqbGBg';
                        var map = L.mapbox.map(element[0], 'bluegene.ffdb711a');

                        map.zoomControl = false;
                        var layers = {
                            SatelliteView: L.mapbox.tileLayer('bluegene.mfl8kdhk'),
                            StreetView: L.mapbox.tileLayer('bluegene.ffdb711a'),
                            DarkView: L.mapbox.tileLayer('bluegene.mfl79iea')
                        };

                        layers.StreetView.addTo(map);
                        var myLayer = L.mapbox.featureLayer().addTo(map);
                        L.control.layers(layers).addTo(map);
                        map.locate();

                        map.on('mousemove', function (e) {
                            var myLayer = L.mapbox.featureLayer().addTo(map);
                        });

                        map.on('locationfound', function (e) {
                            currentlats = e.latlng.lat;
                            currnetlong = e.latlng.lng;

                            map.fitBounds(e.bounds);
                            myLayer.setGeoJSON({
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [e.latlng.lng, e.latlng.lat]
                                },
                                properties: {
                                    'title': 'StreatBeat',
                                    'marker-color': '#ff8888',
                                    'marker-symbol': 'star'
                                }
                            });
                            map.setView([currentlats, currnetlong], 16);
                        });

                        var geocoderControl = L.mapbox.geocoderControl('mapbox.places', {
                            proximity: false,
                            autocomplete: true
                        });
                        geocoderControl.addTo(map);

                        scope.callback(map);
                    }
                };
            }]);

            appModule.directive('sidebar', function () {
                return {
                    restrict: 'E',
                    templateUrl: 'client/app/views/sidebar.html',
                    link: function link(scope, element) {
                        var $sidebar = $(element).children('[data-pages="sidebar"]');
                        $sidebar.sidebar($sidebar.data());
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=directives.js.map
