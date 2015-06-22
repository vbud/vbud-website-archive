'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var config = require('./config');
var paths = config.paths;


function browserSyncInit(baseDir, browser) {
	browser = browser === undefined ? 'default' : browser;

	var routes;
	// if src path is in the baseDir(s) provided, add /bower_components as a route
	if (baseDir === paths.src || (Array.isArray(baseDir) && baseDir.indexOf(paths.src) !== -1)) {
		routes = {
			'/bower_components': 'bower_components'
		};
	}

	var server = {
		baseDir: baseDir,
		routes: routes
	};

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
	// serve the .tmp and src directories
	browserSyncInit([paths.tmpServe, paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
	// serve the dist directory
	browserSyncInit(paths.dist);
});

gulp.task('serve-e2e', ['blog', 'html', 'styles', 'scripts:watch'], function () {
	browserSyncInit([paths.tmpServe, paths.src], []);
});

gulp.task('serve-e2e:dist', ['build'], function () {
	browserSyncInit(paths.dist, []);
});
