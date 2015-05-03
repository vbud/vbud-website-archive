'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options, paths) {
  // do a reload after the blog post files have been processed
  gulp.task('reload-posts', ['blog'], browserSync.reload);

  gulp.task('watch', ['scripts:watch', 'inject', 'blog'], function () {

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

    // watch for changes to html files and page md files (not post md files, which have to be reprocessed)
    gulp.watch([
      paths.src + '/**/*.{html,md}',
      '!' + paths.posts + '/*.md'
    ], function(event) {
      browserSync.reload(event.path);
    });

    gulp.watch(paths.posts + '/*.md', ['reload-posts']);
  });
};
