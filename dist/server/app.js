System.register([], function (_export) {
    'use strict';

    var express, app, port, environment, GeoJson;
    return {
        setters: [],
        execute: function () {
            express = require('express');
            app = express();
            port = process.env.PORT || 7203;
            environment = process.env.NODE_ENV;
            GeoJson = require('geojson');

            console.log('About to crank up node');
            console.log('PORT=' + port);
            console.log('NODE_ENV=' + environment);

            switch (environment) {
                case 'build':
                    console.log('** BUILD **');
                    app.use(express['static']('./build/'));
                    app.use('/*', express['static']('./build/index.html'));
                    break;
                default:
                    console.log('** DEV **');
                    app.use(express['static']('./dist/client/'));
                    app.use(express['static']('./'));
                    app.use(express['static']('./tmp'));
                    app.use('/*', express['static']('./dist/client/index.html'));
                    break;
            }

            app.listen(port, function () {
                console.log('Express server listening on port ' + port);
                console.log('env = ' + app.get('env') + '\n__dirname = ' + __dirname + '\nprocess.cwd = ' + process.cwd());
            });
        }
    };
});
//# sourceMappingURL=app.js.map
