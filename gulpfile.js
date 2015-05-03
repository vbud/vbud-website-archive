'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var del = require('del');

var options = {
  appName: 'vbudWebsite',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components'
  }
};

var paths = {
  src: 'src',
  pages: 'src/pages',
  components: 'src/components',
  styles: 'src/styles',
  assets: 'src/assets',
  images: 'src/assets/images',
  fonts: 'src/assets/fonts',
  tmp: '.tmp',
  tmpPartials: '.tmp/partials',
  tmpStyles: '.tmp/styles',
  tmpServe: '.tmp/serve',
  tmpPosts: '.tmp/serve/posts',
  tmpDist: '.tmp/dist',
  tmpDistScripts: '.tmp/dist/scripts',
  tmpDistStyles: '.tmp/dist/styles',
  tmpDistPosts: '.tmp/dist/posts',
  tmpDistAssets: '.tmp/dist/assets',
  tmpDistImages: '.tmp/dist/assets/images',
  tmpDistFonts: '.tmp/dist/assets/fonts',
  dist: 'dist',
  e2e: 'e2e',
  templates: 'templates',
  posts: 'posts' //blog posts
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options, paths);
});

gulp.task('clean', function (done) {
  del([paths.dist + '/', paths.tmp + '/'], done);
});

// default task is serve
gulp.task('default', function () {
    gulp.start('serve');
});
