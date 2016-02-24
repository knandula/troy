/**
 * Created by rachanti on 6/23/2015.
 */
app.controller("streatbeatcntrl",['$scope','$http',function($scope,$http){
    //var geojsonFeature = {
    //    "type": "Feature",
    //    "properties": {
    //        "name": "Coors Field",
    //        "amenity": "Baseball Stadium",
    //        "popupContent": "This is where the Rockies play!"
    //    },
    //    "geometry": {
    //        "type": "Point",
    //        "coordinates": [-104.99404, 39.75621]
    //    }
    //};
    //
    //var states = [{
    //    "type": "Feature",
    //    "properties": {"party": "Republican"},
    //    "geometry": {
    //        "type": "Polygon",
    //        "coordinates": [[
    //            [-104.05, 48.99],
    //            [-97.22,  48.98],
    //            [-96.58,  45.94],
    //            [-104.03, 45.94],
    //            [-104.05, 48.99]
    //        ]]
    //    }
    //}, {
    //    "type": "Feature",
    //    "properties": {"party": "Democrat"},
    //    "geometry": {
    //        "type": "Polygon",
    //        "coordinates": [[
    //            [-109.05, 41.00],
    //            [-102.06, 40.99],
    //            [-102.03, 36.99],
    //            [-109.04, 36.99],
    //            [-109.05, 41.00]
    //        ]]
    //    }
    //}];
    //
    //var myLines = [{
    //    "type": "LineString",
    //    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
    //}, {
    //    "type": "LineString",
    //    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
    //}];

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