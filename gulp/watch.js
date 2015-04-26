'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options, paths) {
  gulp.task('watch', ['scripts:watch', 'inject'], function () {

    gulp.watch([paths.src + '/*.html', 'bower.json'], ['inject']);

    gulp.watch([
      paths.src + '/**/*.css',
      paths.src + '/**/*.scss'
    ], function(event) {
      if(isOnlyChange(event)) {
        gulp.start('styles');
      } else {
        gulp.start('inject');
      }
    });


    gulp.watch(paths.src + '/**/*.html', function(event) {
      browserSync.reload(event.path);
    });
  });
};
