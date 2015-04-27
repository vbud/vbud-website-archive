'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');

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
  tmpPosts: '.tmp/posts',
  tmpDist: '.tmp/dist',
  tmpDistScripts: '.tmp/dist/scripts',
  tmpDistStyles: '.tmp/dist/styles',
  tmpDistAssets: '.tmp/dist/assets',
  tmpDistImages: '.tmp/dist/assets/images',
  tmpDistFonts: '.tmp/dist/assets/fonts',
  dist: 'dist',
  e2e: 'e2e',
  templates: 'templates',
  posts: 'src/posts' //blog posts
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options, paths);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
