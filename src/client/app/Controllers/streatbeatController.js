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
            console.log("Successfully inserted");
        }).error(function()
        {
            console.log("Failed to insert");
        });
    }
    $scope.callback = function (map) {
        //var good_geojson = '{"type": "Feature", "properties": {"name": "Diamond park", "amenity": "Floating Stadium", "popupContent": "Fantastic!"}, "geometry": {"type": "Point","coordinates": [100, 80]}}';
        //$http.post('http://localhost:3000/api/maplayers',good_geojson).success(function(response){
        //    console.log("Successfully inserted");
        //}).error(function()
        //{
        //    console.log("Failed to insert");
        //});
        $http.get('http://localhost:3000/api/maplayers').success(function(response){
             $scope.lays= response;

            console.log(response);
            //method 1
            //var myLayer = L.geoJson().addTo(map);
            //myLayer.addData( $scope.lays);

            //method 2
            L.geoJson($scope.lays,{onEachFeature : onEachFeature}).addTo(map);

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

        //var geojsonFeature = {
        //    "type": "Feature",
        //    "properties": {
        //        "name": "Mooo Field",
        //        "amenity": "Floating Stadium",
        //        "popupContent": "This is where we ski!"
        //    },
        //    "geometry": {
        //        "type": "Point",
        //        "coordinates": [-125.99404, 39.75621]
        //    }
        //};
        //
        //console.log( geojsonFeature);
        //console.log( $scope.lays);  //undefined

        //L.geoJson(geojsonFeature).addTo(map);

        //map.setView([51.433333, 5.483333], 5);
        //L.geoJson(geojsonFeature).addTo(map);
        //L.geoJson(myLines, {style: myStyle}).addTo(map);
        //L.geoJson(states, {
        //    style: function(feature) {
        //        switch (feature.properties.party) {
        //            case 'Republican': return {color: "#ff0000"};
        //            case 'Democrat':   return {color: "#0000ff"};
        //        }
        //    }
        //}).addTo(map);
        //L.marker([50.5, 30.5]).addTo(map);

    };

}])