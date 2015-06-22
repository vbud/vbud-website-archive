'use strict';

var gulp = require('gulp');

var chalk = require('chalk');
var argv = require('minimist')(process.argv);

var config = require('../config');
var paths = config.paths;


//===== Generates a single service.
gulp.task('service', function () {
	// copy a service template, give it a cameledName and the appName
	// put it in a folder if user specifies a directory
	// otherwise, put it in services folder

	// add the import to the top index.js
	// add the service to the angular.module block
});
