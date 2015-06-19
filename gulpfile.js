'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var del = require('del');

var paths = require('./gulp/config').paths;

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return ( file !== 'config.js' && (/\.(js)$/i).test(file) );
}).map(function(file) {
  require('./gulp/' + file);
});

gulp.task('clean', function (done) {
  del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('default', ['serve']);
