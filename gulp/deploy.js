'use strict';

var gulp = require('gulp');

var $ = {
	ghPages: require('gulp-gh-pages')
};

var config = require('./config');
var paths = config.paths;

// Deploy dist to GitHub pages
gulp.task('deploy', deploy);

function deploy() {
	return gulp.src(paths.dist + '/**/*')
		.pipe($.ghPages({
			branch: 'master'
		}));
}

module.exports = deploy;
