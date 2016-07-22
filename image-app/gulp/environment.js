'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var fs   = require('fs');
var rename = require("gulp-rename");

var $ = require('gulp-load-plugins')();

gulp.task('app.env:development', [],function(){
  var configuration = JSON.parse(fs.readFileSync( path.join(conf.paths.src,'app/config.json') ));
  var applicationVersion = JSON.parse(fs.readFileSync( path.join('./package.json') ));
  var environmentConfig = configuration['development'];
  environmentConfig.APPLICATION = {}; // ApplicationConstantInterface
  environmentConfig.APPLICATION.VERSION = applicationVersion.version;
  environmentConfig.APPLICATION.NAME = applicationVersion.name;

  $.ngConstant({
      name: 'app.env',
      constants: environmentConfig,
      wrap: 'commonjs',
      stream: true
  })
    .pipe(rename(function(path){
      path.basename = "environment";
    }))
    .pipe(gulp.dest(path.join(conf.paths.src, '/app/environment/module/')));
});


gulp.task('app.env:production', [],function(){
  var configuration = JSON.parse(fs.readFileSync( path.join(conf.paths.src,'app/config.json') ));
  var applicationVersion = JSON.parse(fs.readFileSync( path.join('./package.json') ));
  var environmentConfig = configuration['production'];
  environmentConfig.APPLICATION = {}; // ApplicationConstantInterface
  environmentConfig.APPLICATION.VERSION = applicationVersion.version;
  environmentConfig.APPLICATION.NAME = applicationVersion.name;

  $.ngConstant({
      name: 'app.env',
      constants: environmentConfig,
      wrap: 'commonjs',
      stream: true
  })
    .pipe(rename(function(path){
      path.basename = "environment";
    }))
    .pipe(gulp.dest(path.join(conf.paths.src, '/app/environment/module/')));
});


gulp.task('app.tracking:development', [],function(){
  $.ngConstant({
    name: 'app.tracking',
    constants: {
      'TRACKING':{

      }
    },
    stream: true,
    wrap: 'commonjs'
  })
    .pipe(rename(function(path){
      path.basename = "tracking";
    }))
    .pipe(gulp.dest(path.join(conf.paths.src, '/app/environment/module/')));
});


gulp.task('app.tracking:production', [],function(){
  $.ngConstant({
    name: 'app.tracking',
    constants: {
      'TRACKING':{

      }
    },
    stream: true,
    wrap: 'commonjs'
  })
    .pipe(rename(function(path){
      path.basename = "tracking";
    }))
    .pipe(gulp.dest(path.join(conf.paths.src, '/app/environment/module/')));
});

gulp.task('environment:development', ['app.env:development','app.tracking:development'], function () {

});


gulp.task('environment:production', ['app.env:production','app.tracking:production'], function () {

});
