'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var _ = require('lodash');
var chalk = require('chalk');
var argv = require('minimist')(process.argv);



module.exports = function(options, paths) {

  //===== Generates all the appropriate files for a new page.
  gulp.task('filter', function() {
    // copy a filter template, give it a cameledName and the appName

    // otherwise, put it in filters folder

    // TODO???:
    // if --component, put it in a specified component
    // if --page, put it in a specified page
    // error if component or page does not exist (???)
    // add the import to the top index.js
    // add the filter to the angular.module block
  });
};
