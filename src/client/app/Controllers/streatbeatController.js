/**
 * Created by rachanti on 6/23/2015.
 */
app.controller("streatbeatcntrl",['$scope','$http',function($scope,$http){
     var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };

    $scope.callback = function (map) {
        $http.get('http://localhost:3000/api/maplayers').success(function(response){
             $scope.lays= response;

           // L.geoJson($scope.lays,{onEachFeature : onEachFeature}).addTo(map);

            console.log("Next");
        }).error(function()
        {
            console.log("Failed");
        });

        function onEachFeature(feature, layer) {
            // does this feature have a property named popupContent?
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }

        var geojsonFeature = {
            "type": "Feature",
            "properties": {
                "name": "Mooo Field",
                "amenity": "Floating Stadium",
                "popupContent": "This is where we ski!"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-125.99404, 39.75621]
            }
        };
        L.geoJson(geojsonFeature).addTo(map);
        L.geoJson(states, {
            style: function(feature) {
                switch (feature.properties.party) {
                    case 'Republican': return {color: "#ff0000"};
                    case 'Democrat':   return {color: "#0000ff"};
                }
            }
        }).addTo(map);
    };

}])