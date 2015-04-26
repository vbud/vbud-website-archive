'use strict';

var gulp = require('gulp');

var chalk = require('chalk');
var argv = require('minimist')(process.argv);



module.exports = function(options, paths) {

  //===== Generates a single service.
  gulp.task('service', function() {
    // copy a service template, give it a cameledName and the appName
    // if --component, put it in a specified component
    // if --page, put it in a specified page
    // otherwise, put it in services folder

    // add the import to the top index.js
    // add the service to the angular.module block
  });
};
