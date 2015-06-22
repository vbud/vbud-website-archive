'use strict';

var gulp = require('gulp');

var chalk = require('chalk');
var argv = require('minimist')(process.argv);

var config = require('../config');
var paths = config.paths;


//===== Creates a single factory (type of service).
gulp.task('factory', function () {
	// copy a factory template, give it a cameledName and the appName
	// put it in a folder if user specifies a directory
	// otherwise, put it in services folder

	// add the import to the top of index.js
	// add the factory to the angular.module block
});
