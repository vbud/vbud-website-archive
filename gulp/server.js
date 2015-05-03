'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var middleware = require('./proxy');

module.exports = function(options, paths) {

  function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if(baseDir === paths.src || (util.isArray(baseDir) && baseDir.indexOf(paths.src) !== -1)) {
      routes = {
        '/bower_components': 'bower_components'
      };
    }

    var server = {
      baseDir: baseDir,
      routes: routes
    };

    if(middleware.length > 0) {
      server.middleware = middleware;
    }

    browserSync.instance = browserSync.init({
      startPath: '/',
      server: server,
      browser: browser
    });
  }

  browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
  }));

  gulp.task('serve', ['watch'], function () {
    // serve the tmp serve and src directories
    browserSyncInit([paths.tmpServe, paths.src]);
  });

  gulp.task('serve:dist', ['build'], function () {
    // serve the dist directory
    browserSyncInit(paths.dist);
  });

  gulp.task('serve:e2e', ['inject'], function () {
    browserSyncInit([paths.tmpServe, paths.src], []);
  });

  gulp.task('serve:e2e-dist', ['build'], function () {
    browserSyncInit(paths.dist, []);
  });
};
