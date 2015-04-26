'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

module.exports = function(options, paths) {

  // Deploy dist to Github pages
  gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
      .pipe($.ghPages({
        branch: 'master'
      }));
  });
};
