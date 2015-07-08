'use strict';

var gulp = require('gulp');
var $ = {
	sequence: require('run-sequence'),
	minifyHtml: require('gulp-minify-html'),
	minifyCss: require('gulp-minify-css'),
	angularTemplatecache: require('gulp-angular-templatecache'),
	ngAnnotate: require('gulp-ng-annotate'),
	filter: require('gulp-filter'),
	flatten: require('gulp-flatten'),
	inject: require('gulp-inject'),
	replace: require('gulp-replace'),
	useref: require('gulp-useref'),
	uglify: require('gulp-uglify'),
	revAll: require('gulp-rev-all'),
	size: require('gulp-size'),
	debug: require('gulp-debug')
};

var _ = require('lodash');

var mainBowerFiles = require('main-bower-files');
var uglifySaveLicense = require('uglify-save-license');

var config = require('./config');
var paths = config.paths;


// If you want an html partial/template/view to be templatecached, make sure it ends with '.template.html' (e.g. 'someDirective.template.html'). Otherwise, it will be copied and minified in the 'dist' task.
gulp.task('templates', function () {
	return gulp.src([
		paths.src + '/**/*.template.html'
	])
		.pipe($.debug({title: 'TEMPLATES TO BE TEMPLATECACHED:'}))
		.pipe($.minifyHtml({
			empty: true,
			spare: true,
			quotes: true,
			conditionals: true
		}))
		.pipe($.angularTemplatecache('templateCacheHtml.js', {
			// module name is same as appName by default - this can be changed of course if your module name differs from appName
			module: config.appName
		}))
		.pipe(gulp.dest(paths.tmpTemplates));
});

gulp.task('dist', function () {
	var templatesInjectFile = gulp.src(paths.tmpTemplates + '/templateCacheHtml.js', {read: false});
	var templatesInjectOptions = {
		starttag: '<!-- inject:templates -->',
		ignorePath: paths.tmpTemplates + '/',
		addRootSlash: false
	};

	var indexHtmlFilter = $.filter('**/index.html');
	var htmlFilter = $.filter('**/*.html');
	var jsFilter = $.filter('**/*.js');
	var cssFilter = $.filter('**/*.css');
	var assets;

	return gulp.src([
		// grab all html files in tmp directory
		paths.tmpServe + '/**/*.html',
		// and all html files in src directory
		paths.src + '/**/*.html',
		// ignore all template files, since they get put in templatecache by the 'templates' task
		'!' + paths.src + '/**/*.template.html',
		// ignore the src index.html since we already have the tmp one
		'!' + paths.src + '/index.html'
	])
		// .pipe($.debug({title: 'SOURCE FILES:'}))
		// STEP: index.html file injection and useref
		.pipe(indexHtmlFilter)
		// .pipe($.debug({title: 'JUST INDEX.HTML:'}))
		// inject the templateCacheHtml.js file into index.html
		.pipe($.inject(templatesInjectFile, templatesInjectOptions))
		// concat the js and css files in the build blocks of index.html and add the resulting files to the stream
		.pipe(assets = $.useref.assets())
		// .pipe($.debug({title: 'AFTER useref.assets():'}))

		// STEP: JS files
		.pipe(jsFilter)
		// .pipe($.debug({title: 'JS FILES:'}))
		.pipe($.ngAnnotate())
		.pipe($.uglify({preserveComments: uglifySaveLicense})).on('error', config.errorHandler('Uglify'))
		.pipe(jsFilter.restore())

		// STEP: CSS files
		.pipe(cssFilter)
		// .pipe($.debug({title: 'CSS FILES:'}))
		.pipe($.minifyCss())
		.pipe(cssFilter.restore())
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe(indexHtmlFilter.restore())

		// STEP: HTML files
		.pipe(htmlFilter)
		// .pipe($.debug({title: 'HTML FILES:'}))
		.pipe($.minifyHtml({
			empty: true,
			spare: true,
			quotes: true,
			conditionals: true
		}))
		.pipe(htmlFilter.restore())

		// STEP: Write everything to dist folder
		// .pipe($.debug({title: 'DIST FILES:'}))
		.pipe(gulp.dest(paths.tmpDist))
		// show stats about the size of the HTML, JS, CSS files in your project
		.pipe($.size({title: 'SIZE: ', showFiles: true}))
});

// Fonts from bower dependencies and custom ones from this app
gulp.task('fonts', function () {
	return gulp.src([
		paths.src + '/fonts/*'
	].concat(mainBowerFiles()))
		.pipe($.filter('**/*.{eot,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest(paths.tmpDist + '/fonts'));
});

// Images and .json files
gulp.task('other', function () {
	return gulp.src([
		paths.src + '/**/*.{jpg,jpeg,tiff,gif,png,svg,ico}',
		paths.tmpServe + '/**/*.json'
	])
		// .pipe($.debug({title: 'SOURCE IMAGES:'}))
		.pipe(gulp.dest(paths.tmpDist));
});


// setup gulp-rev-all
var revAll = new $.revAll({
	// stop it from renaming index.html and favicon.ico
	dontRenameFile: ['favicon.ico', 'index.html']
});

// Revision all the things in tmp dist directory and write to final dist location
gulp.task('rev', function () {
	return gulp.src(paths.tmpDist + '/**/*')
		.pipe(revAll.revision())
		// write revisioned files to dist
		.pipe(gulp.dest(paths.dist + '/'))
		// show stats about the size of all minified files in your project
		.pipe($.size({title: 'MINIFIED SIZE: '}))
		.pipe(revAll.manifestFile())
		.pipe(gulp.dest(paths.dist)); //write rev manifest to dist
});

gulp.task('build', function (done) {
	$.sequence(
		'blog',
		['html', 'styles', 'scripts', 'templates', 'fonts', 'other'],
		'dist',
		'rev',
		done
	);
});
