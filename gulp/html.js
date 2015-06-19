'use strict';

var gulp = require('gulp');

var wiredep = require('wiredep').stream;

var config = require('./config');
var paths = config.paths;


gulp.task('html', html);

function html() {
  return gulp.src(paths.src + '/index.html')
    // inject dependency scripts with wiredep
    .pipe(wiredep(config.wiredep))
    .pipe(gulp.dest(paths.tmp + '/serve'));
}

module.exports = html;
