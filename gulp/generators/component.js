'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var _ = require('lodash');
var chalk = require('chalk');
var argv = require('minimist')(process.argv);



//===== Generates all the appropriate files for a new component.
// A page is just a type of component, so this is shared between the 'page' and 'component' tasks.
function generateComponent(options, paths, name, type) {
  // type can be: page, directive (component), or include (component)
  if(type !== 'page' && type !== 'directive' && type !== 'include')
    throw 'Invalid type specified.';

  // template filenames
  var templateFilenames;
  if(type === 'page') {
    templateFilenames = {
      html: 'page.template.html',
      scss: '_styles.template.scss',
      js: 'controller.template.js',
      spec: 'controller.spec.template.js'
    };
  }
  else if(type === 'directive') {
    templateFilenames = {
      html: 'template.template.html',
      scss: '_styles.template.scss',
      js: 'directive.template.js',
      spec: 'directive.spec.template.js'
    };
  }
  else if(type === 'include') {
    templateFilenames = {
      html: 'include.template.html',
      scss: '_styles.template.scss',
      js: 'controller.template.js',
      spec: 'controller.spec.template.js'
    };
  }

  // convert name to camelCase
  var cameledName = _.camelCase(name);

  // create new filenames
  var newFilenames;
  if(type === 'page' || type === 'include') {
    newFilenames = {
      html: name + '.html',
      scss: '_' + name  + '.scss',
      js: name + '.controller.js',
      spec: name + '.controller.spec.js'
    };
  }
  else if(type === 'directive') {
    newFilenames = {
      html: name + '.html',
      scss: '_' + name  + '.scss',
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

  // folder path of new page/component
  var folderPath;
  if(type === 'page')
    folderPath = paths.pages + '/' + name + '/';
  else if(type === 'directive' || type === 'include')
    folderPath = paths.components + '/' + name + '/';

  // console.log([
  //     name,
  //     cameledName,
  //     _.map(templateFilenames, function(d) { return d; }),
  //     _.map(newFilenames, function(d) { return d; }),
  //     folderPath
  //   ].join('\n'));

  console.log(paths.templates);

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
      'appName': options.appName,
      'name': name,
      'cameledName': cameledName,
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
    ].concat( _.map(newFilenames, function(filename) { //also print the filenames, but with green text
      return chalk.green(folderPath + filename);
    })).join('\n')); //each string gets its own line

  // TODO???:
  // add the import to the top index.js
  // add the controller/directive to the angular.module block
}



module.exports = function(options, paths) {

  //===== Gulp task to create a new page.
  // Examples:
  // Generate a page named "fancy-page"
  //    gulp page -n fancy-page
  //    gulp page --name fancy-page
  gulp.task('page', function() {

    var name = argv.n || argv.name;

    if(name === undefined) {
      console.error([
        chalk.red('Sorry, you must provide a name to generate a page!'),
        'For example:',
        'gulp page -n fancy-page',
        'gulp page --name fancy-page'
      ].join('\n'));
      return;
    }

    var type = 'page';

    generateComponent(options, paths, name, type);

  });



  //===== Gulp task to create a new component.
  // Examples:
  // Generate a directive component named "fancy-component"
  //    gulp component -n fancy-component
  //    gulp component -n fancy-component -d
  //    gulp component --name fancy-component --directive
  // Generate an include component named "fancy-component"
  //    gulp component -n fancy-component -i
  //    gulp component -n fancy-component --include
  gulp.task('component', function() {

    var name = argv.n || argv.name;

    if(name === undefined) {
      console.error([
        chalk.red('Sorry, you must provide a name to generate a component!'),
        'For example:',
        'gulp component -n fancy-component',
        'gulp component --name fancy-component',
        'gulp component -n fancy-component -d',
        'gulp component --name fancy-component --directive',
        'gulp component -n fancy-component -i',
        'gulp component -n fancy-component --include'
      ].join('\n'));
      return;
    }

    var type = 'directive';
    if(argv.i === true || argv.include === true)
      type = 'include';

    generateComponent(options, paths, name, type);

  });

};
