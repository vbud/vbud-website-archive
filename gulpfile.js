'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var del = require('del');

var paths = {
  // src directories
  src: 'src',
  pages: 'src/pages',
  components: 'src/components',
  styles: 'src/styles',
  assets: 'src/assets',
  images: 'src/assets/images',
  fonts: 'src/assets/fonts',
  // dependencies directories
  bower: 'bower_components',
  otherDeps: 'src/_dependencies',
  // tmp directories
  tmp: '.tmp',
  tmpPartials: '.tmp/partials',
  tmpStyles: '.tmp/styles',
  tmpServe: '.tmp/serve',
  tmpPosts: '.tmp/serve/posts',
  tmpDist: '.tmp/dist',
  tmpDistScripts: '.tmp/dist/scripts',
  tmpDistStyles: '.tmp/dist/styles',
  tmpDistOtherDeps: '.tmp/dist/_dependencies',
  tmpDistPosts: '.tmp/dist/posts',
  tmpDistAssets: '.tmp/dist/assets',
  tmpDistImages: '.tmp/dist/assets/images',
  tmpDistFonts: '.tmp/dist/assets/fonts',
  // dist
  dist: 'dist',
  // generator templates
  templates: 'templates',
  // blog posts
  posts: 'posts'
};

var options = {
  appName: 'vbudWebsite',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: paths.bower
  }
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
