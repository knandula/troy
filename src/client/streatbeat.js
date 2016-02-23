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
            transclude: true,
            scope: {
                callback: "="
            },
            template: '<div><pre id="info" style=" display: block;position: relative;margin: 0px auto;width: 50%;padding: 10px;border: none;border-radius: 3px;font-size: 12px;text-align: center;color: #222;background: #fff;"></pre></div>',
            link: function (scope, element, attributes) {

                var currentlats;
                var currnetlong;

                L.mapbox.accessToken = 'pk.eyJ1IjoiYmx1ZWdlbmUiLCJhIjoiZjMwNzU2ZmQyMzdlMGQ3YjlkYTRmYmY3ZGY5N2RhMDMifQ.gnt0BCmgUCChF56g7kEo7Q';
                var map = L.mapbox.map(element[0], 'bluegene.ffdb711a');

                var map = L.mapbox.map(element[0],null);
                map.zoomControl = false;
                var layers = {
                    SatelliteView : L.mapbox.tileLayer('bluegene.mfl8kdhk'),
                    StreetView : L.mapbox.tileLayer('bluegene.ffdb711a'),
                    DarkView : L.mapbox.tileLayer('bluegene.mfl79iea')
                };

                layers.StreetView.addTo(map);
                console.log("Inside directive");
                var myLayer = L.mapbox.featureLayer().addTo(map);



                L.control.layers(layers).addTo(map);
                map.locate();

                map.on('mousemove', function(e) {
                    console.log(scope.text );
                   // var html =  element.children()[0].html();
                   // // e.point is the x, y coordinates of the mousemove event relative
                   // // to the top-left corner of the map
                   // element.children()[0].text(JSON.stringify(e.point) + '<br />' +
                   //     // e.latLng is the latitude, longitude geographical position of the event
                   //JSON.stringify(e.latLng));
                    console.log("Inside mouse move");
                    console.log(e.containerPoint);
                    console.log(e.latlng);
                    //console.log(e);
                    console.log(scope.text );
                    //element.children()[0].html(html);
                var myLayer = L.mapbox.featureLayer().addTo(map);



                });

                map.on('locationfound', function(e) {
                    currentlats = e.latlng.lat;
                    currnetlong = e.latlng.lng;

                    map.fitBounds(e.bounds);
                    //console.log(e.bounds);
                    myLayer.setGeoJSON({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [e.latlng.lng, e.latlng.lat]
                        },
                        properties: {
                            'title': 'Here I am!',
                            'marker-color': '#ff8888',
                            'marker-symbol': 'star'
                        }
                    });
                    map.setView([currentlats,currnetlong],16);
                });
                // Initialize the geocoder control and add it to the map.
                var geocoderControl = L.mapbox.geocoderControl( 'mapbox.places',
                    {
                     proximity :false,
                     autocomplete: true
                    });
                geocoderControl.addTo(map);


                //map.setView([21.2889,74.7772],5)
                map.touchZoom.enable();
                map.tap.enable();
                scope.callback(map);
            }
        };
    }
]);