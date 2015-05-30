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




