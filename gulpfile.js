'use strict';
var gulp = require('gulp');
var args= require('yargs').argv;
var browsersync = require('browser-sync');
var $=require('gulp-load-plugins')({lazy : true});
var config = require('./gulp.config')();
var port = process.env.PORT  || config.defaultPort;




gulp.task('check',function() {
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose,$.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish',{ verbose:true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('inject',['wiredep'], function () {

    return gulp
        .src(config.index)
        .pipe(gulp.dest(config.client));

});

gulp.task('serve-dev',['inject'],function(){

    var isDev = true;
        var nodeOptions = {
        script: config.nodeServer,
        delayTime:1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart',function(ev){
            console.log("*** nodemon restarted" + ev);
         })
        .on('start',function(){
            console.log("*** nodemon start *** ");
            startBrowserSync();
         })
        .on('crash',function(){
            console.log("*** crash ");
          })
        .on('exit',function(){
            console.log("*** exit ** ");
         });
});


gulp.task('wiredep',function(){

    var options = config.getWireDepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

function startBrowserSync(){
    if(browsersync.active){
        return;
    }
    console.log('Starting browser-sync on port ' + port);
    var options = {
      proxy: 'localhost:' + port,
        port: 3000,
        files: [config.client + "**/*.*"],
        ghostMode: {
            clicks: true,
            location:false,
            forms:true,
            scroll:true
        },injectChanges:true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify:true,
        reloadDelay:1000
    };

    browsersync(options);
}


