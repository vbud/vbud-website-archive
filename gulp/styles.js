'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options, paths) {
  gulp.task('styles', function () {
    var sassOptions = {
      includePaths: ['bower_components'],
      style: 'expanded'
    };

    var injectFiles = gulp.src([
      paths.src + '/styles/**/*.scss', //shared scss first
      paths.src + '/pages/**/*.scss', //then pages
      paths.src + '/components/**/*.scss', //then components
      '!' + paths.styles + '/index.scss' //ignore index.scss
    ], { read: false });

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(paths.src, '..');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    return gulp.src([
      paths.styles + '/index.scss'
    ])
      // STEP: inject paths of scss files in this app
      .pipe($.inject(injectFiles, injectOptions))
      // TODO: write something that will write the resulting scss to .tmp so we can see the result of the injection, but will not modify the source file in the stream
      // In the meantime, you can use the below for debugging if you want to see what is injected, but it is annoying with version control because the file is always changing.
      // .pipe(gulp.dest(paths.styles + '/'))

      // NOTE: If you want to re-enable wiredep of dependencies, you will need to add comments like the two below to index.scss, and remove the manual import paths:
      // bower:scss
      // bower
      // Be sure to also make the required changes in index.scss and gulpfile.js in order to re-enable wiredep.
      // // STEP: inject paths of dependency scss files in dependencies
      // .pipe(wiredep(options.wiredep))
      // // write the injected paths to the source file so we can see the result of the injection
      // .pipe(gulp.dest(paths.styles + '/'))

      // STEP: sourcemaps to make debugging easier
      .pipe($.sourcemaps.init())
      .pipe($.sass(sassOptions)).on('error', options.errorHandler('Sass'))
      // autoprefix CSS that needs autoprefixing
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())

      // STEP: write the resulting compiled CSS to CSS files to be served
      .pipe(gulp.dest(paths.tmpServe + '/'))
      // trigger a browserSync reload
      .pipe(browserSync.reload({ stream: true }));
  });
};
