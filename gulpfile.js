'use strict';
var gulp = require('gulp');
var args= require('yargs').argv;
var $=require('gulp-load-plugins')({lazy : true});
var config = require('./gulp.config')();

gulp.task('check',function() {
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose,$.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish',{ verbose:true}))
        .pipe($.jshint.reporter('fail'));
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




