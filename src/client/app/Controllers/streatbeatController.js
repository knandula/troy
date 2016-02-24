/**
 * Created by rachanti on 6/23/2015.
 */
app.controller("streatbeatcntrl",['$scope','$http',function($scope,$http){
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