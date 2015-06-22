'use strict';

var gulp = require('gulp');
var $ = {
	filter: require('gulp-filter'),
	watch: require('gulp-watch')
};

var browserSync = require('browser-sync');

var config = require('./config');
var paths = config.paths;

var styles = require('./styles'); // import styles task as a function
var html = require('./html'); // import html task as a function
var blog = require('./blog'); // import html task as a function


gulp.task('watch', ['blog', 'html', 'styles', 'scripts:watch'], function () {

	$.watch('bower.json', {
		read: false,
		name: 'watch: bower'
	}, function (file) {
		console.log(file.path);
		html();
	});

	$.watch([
		paths.src + '/**/*.scss',
		paths.src + '/**/*.css'
	], {
		read: false,
		name: 'watch: SCSS/CSS'
	}, function (file) {
		console.log(file.path);
		// run the styles task, then inject CSS with BrowserSync
		styles()
			.pipe(browserSync.stream());
	});

	$.watch([
		paths.src + '/**/*.html',
		'!' + paths.src + '/index.html'
	], {
		read: false,
		name: 'watch: HTML'
	}, function (file) {
		console.log(file.path);
		browserSync.reload();
	});

	$.watch(paths.src + '/index.html', {
		read: false,
		name: 'watch: index.html'
	}, function (file) {
		console.log(file.path);
		html()
			.on('end', function () {
				browserSync.reload();
			});
	});

	$.watch(paths.posts + '/*.md', {
		read: false,
		name: 'watch: Markdown posts'
	}, function (file) {
		console.log(file.path);
		blog()
			.on('end', function () {
				browserSync.reload();
			});
	});

	// gulp.watch(paths.src + '/**/*.html', function(event) {
	//   browserSync.reload(event.path);
	// });
});
