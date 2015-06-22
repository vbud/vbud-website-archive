'use strict';

var gulp = require('gulp');

var chalk = require('chalk');
var argv = require('minimist')(process.argv);

var config = require('../config');
var paths = config.paths;


//===== Generates all the appropriate files for a new page.
gulp.task('filter', function () {
	// copy a filter template, give it a cameledName and the appName
	// put it in a folder if user specifies a directory
	// otherwise, put it in filters folder

	// add the import to the top index.js
	// add the filter to the angular.module block
});
