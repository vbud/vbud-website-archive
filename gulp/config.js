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
    posts: 'src/blog/posts',
    // dependencies directories
    bower: 'bower_components',
    // tmp directories
    tmp: '.tmp',
    tmpTemplates: '.tmp/templates',
    tmpServe: '.tmp/serve',
    tmpPosts: '.tmp/serve/blog/posts',
    tmpDist: '.tmp/dist',
    dist: 'dist',
    e2e: 'e2e',
    // generator templates
    templates: 'templates'
  }
};
