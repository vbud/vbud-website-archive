'use strict';

var $ = {
  util: require('gulp-util')
};


module.exports = {
  appName: 'vbudWebsite',
  errorHandler: function(title) {
    return function(err) {
      $.util.log($.util.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components'
  },
  paths: {
    // src directories
    src: 'src',
    styles: 'src/styles',
    fonts: 'src/fonts',
    // dependencies directories
    bower: 'bower_components',
    otherDeps: 'src/_dependencies',
    // tmp directories
    tmp: '.tmp',
    tmpTemplates: '.tmp/templates',
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
    dist: 'dist',
    e2e: 'e2e',
    // generator templates
    templates: 'templates',
    // blog posts
    posts: 'posts'
  }
};
