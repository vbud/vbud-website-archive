'use strict';

var gulp = require('gulp');
var $ = {
	filter: require('gulp-filter'),
	template: require('gulp-template'),
	rename: require('gulp-rename'),
	debug: require('gulp-debug')
};

var _ = require('lodash');
var chalk = require('chalk');
var argv = require('minimist')(process.argv);

var config = require('../config');
var paths = config.paths;


//===== Gulp task to scaffold a new component.
// Creates several files for when you need a full component (like a page, or or a big directive, or an include that needs a controller)
gulp.task('component', function () {

	var name = argv.n || argv.name;
	var type = argv.t || argv.type;

	// Check if name and type were both specified as arguments
	if (name === undefined || type === undefined) {
		console.error([
			chalk.red('Sorry, you must provide a name and type to generate a component!'),
			'For example:',
			'To generate a page named "fancy-page":',
			'  gulp component -n fancy-page -t page',
			'To generate a directive component named "fancy-directive" (comes with directive, template html, scss, and test files):',
			'  gulp component -n fancy-directive -t directive',
			'To generate an include component named "fancy-include" (comes with controller, include html, scss, and test files):',
			'  gulp component -n fancy-include -t include'
		].join('\n'));
		return;
	}

	// TODO: also check if folder/component already exists with that same name

	// Check if `type` is valid
	if (type !== 'page' && type !== 'directive' && type !== 'include') {
		console.error(chalk.red('Invalid type specified.'));
		return;
	}

	var templateFilenames;
	if (type === 'page') {
		templateFilenames = {
			html: 'template.template.html',
			scss: '_styles.template.scss',
			js: 'controller.template.js',
			spec: 'controller.spec.template.js'
		};
	}
	else if (type === 'directive') {
		templateFilenames = {
			html: 'template.template.html',
			scss: '_styles.template.scss',
			js: 'directive.template.js',
			spec: 'directive.spec.template.js'
		};
	}
	else if (type === 'include') {
		templateFilenames = {
			html: 'include.template.html',
			scss: '_styles.template.scss',
			js: 'controller.template.js',
			spec: 'controller.spec.template.js'
		};
	}

	// create new filenames
	var newFilenames;
	if (type === 'page' || type === 'include') {
		newFilenames = {
			html: name + '.html',
			scss: '_' + name + '.scss',
			js: name + '.controller.js',
			spec: name + '.controller.spec.js'
		};
	}
	else if (type === 'directive') {
		newFilenames = {
			html: name + '.html',
			scss: '_' + name + '.scss',
			js: name + '.directive.js',
			spec: name + '.directive.spec.js'
		};
	}

	var filters = {
		html: $.filter('**/' + templateFilenames.html),
		scss: $.filter('**/' + templateFilenames.scss),
		js: $.filter('**/' + templateFilenames.js),
		spec: $.filter('**/' + templateFilenames.spec)
	};

	var folderPath = paths.src + '/' + name + '/';

	// console.log([
	//     name,
	//     _.camelCase(name),
	//     _.map(templateFilenames, function(d) { return d; }),
	//     _.map(newFilenames, function(d) { return d; }),
	//     folderPath
	//   ].join('\n'));

	// grab the view, styles, controller, and spec files
	gulp.src([
		paths.templates + '/' + templateFilenames.html,
		paths.templates + '/' + templateFilenames.scss,
		paths.templates + '/' + templateFilenames.js,
		paths.templates + '/' + templateFilenames.spec
	])
		// .pipe($.debug({title: 'SOURCE FILES:'}))
		// run all files through the templater
		.pipe($.template({
			'appName': config.appName,
			'name': name,
			'cameledName': _.camelCase(name),
			'PascaledName': _.capitalize(_.camelCase(name)),
			'type': type,
			'htmlFilename': newFilenames.html
		}))
		// name and create the html file
		.pipe(filters.html)
		.pipe($.rename(newFilenames.html))
		.pipe(gulp.dest(folderPath))
		.pipe(filters.html.restore())
		// name and create the scss file
		.pipe(filters.scss)
		.pipe($.rename(newFilenames.scss))
		.pipe(gulp.dest(folderPath))
		.pipe(filters.scss.restore())
		// name and create the js file
		.pipe(filters.js)
		.pipe($.rename(newFilenames.js))
		.pipe(gulp.dest(folderPath))
		.pipe(filters.js.restore())
		// name and create the spec file
		.pipe(filters.spec)
		.pipe($.rename(newFilenames.spec))
		.pipe(gulp.dest(folderPath))
		.pipe(filters.spec.restore());

	// Print out a nice confirmation about what was created
	// TODO: actually check that the files were created
	console.info([
		chalk.bold(name) + ' ' + type + ' created:',
		chalk.green(folderPath)
	].concat(_.map(newFilenames, function (filename) { //also print the filenames, but with green text
			return chalk.green(folderPath + filename);
		})).join('\n')); //each string gets its own line

	// TODO???:
	// add the import at the top of index.js
	// add the controller/directive to the angular.module block

});
