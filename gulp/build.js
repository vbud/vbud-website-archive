'use strict';

var gulp = require('gulp');

var _ = require('lodash');

var $ = require('gulp-load-plugins')();
var mainBowerFiles = require('main-bower-files');
var uglifySaveLicense = require('uglify-save-license');

module.exports = function(options, paths) {
  // If you want an html partial/template/view to be templatecached, make sure it ends with '.template.html' (e.g. 'someDirective.template.html'). Otherwise, it will be copied and minified in the html task. Be sure to point to the correct template file path in your directive templateUrl.
  gulp.task('partials', function () {
    return gulp.src([
      paths.src + '/**/*.template.html'
    ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.debug({title: 'PARTIALS TO BE TEMPLATECACHED:'}))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        // module name is same as appName by default - this can be changed of course if your module name differs from appName
        module: options.appName
      }))
      .pipe(gulp.dest(paths.tmpPartials + '/'));
  });

  gulp.task('dist', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(paths.tmpPartials + '/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: paths.tmpPartials + '/',
      addRootSlash: false
    };

    var indexHtmlFilter = $.filter('**/index.html');
    var htmlFilter = $.filter('**/*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src([
        // grab index.html file in tmp directory
        paths.tmpServe + '/index.html',
        // and all html files in src directory
        paths.src + '/**/*.html',
        // and all md files in src directory
        paths.src + '/**/*.md',
        // ignore all template files, since they get put in templatecache by the 'partials' task
        '!' + paths.src + '/**/*.template.html',
        // ignore the src index.html since we already have the tmp one
        '!' + paths.src + '/index.html'
      ])
      // .pipe($.debug({title: 'SOURCE FILES:'}))
      // STEP: index.html file injection and useref
      .pipe(indexHtmlFilter)
      // .pipe($.debug({title: 'JUST INDEX.HTML:'}))
      // inject the templateCacheHtml.js file into index.html
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      // concat the js and css files in the build blocks of index.html and add the resulting files to the stream
      .pipe(assets = $.useref.assets())
      // .pipe($.debug({title: 'AFTER useref.assets():'}))

      // STEP: JS files
      .pipe(jsFilter)
      // .pipe($.debug({title: 'JS FILES:'}))
      .pipe($.ngAnnotate())
      .pipe($.uglify({ preserveComments: uglifySaveLicense })).on('error', options.errorHandler('Uglify'))
      .pipe(jsFilter.restore())

      // STEP: CSS files
      .pipe(cssFilter)
      // .pipe($.debug({title: 'CSS FILES:'}))
      // replace the font paths with the path to the font folder in the dist folder
      .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../assets/fonts/'))
      .pipe($.csso())
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

      // STEP: Write everything to tmp dist folder
      // .pipe($.debug({title: 'DIST FILES:'}))
      .pipe(gulp.dest(paths.tmpDist + '/'))
      // show some stats about the size of your project
      .pipe( $.size({ title: paths.tmpDist + '/', showFiles: true }) );
  });

  // Fonts from bower dependencies and custom ones from src
  gulp.task('dist-fonts', function () {
    return gulp.src([
      paths.fonts + '/**/*'
    ].concat(mainBowerFiles()))
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe($.flatten())
      .pipe(gulp.dest(paths.tmpDistFonts + '/'));
  });

  // Images from src
  gulp.task('dist-images', function () {
    return gulp.src([
      paths.images + '/**/*'
    ])
      // .pipe($.debug({title: 'SOURCE IMAGES:'}))
      .pipe(gulp.dest(paths.tmpDistImages + '/'));
  });

  // Non-bower dependencies (e.g. highlight.js)
  gulp.task('dist-other-deps', function() {
    return gulp.src(paths.otherDeps + '/*')
      .pipe(gulp.dest(paths.tmpDistOtherDeps + '/'));
  })

  // Processed post .md and .json files from tmp
  gulp.task('dist-posts', ['blog'], function() {
    return gulp.src(paths.tmpPosts + '/*')
      .pipe(gulp.dest(paths.tmpDistPosts + '/'));
  })


  // Setup gulp-rev-all, stop it from renaming index.html and favicon.ico
  var revAll = new $.revAll({
    dontRenameFile: [/^\/favicon.ico$/g, /^\/index.html/g]
  });

  // Revision all the things in tmp dist directory and write to final dist location
  gulp.task('rev', ['dist', 'dist-fonts', 'dist-images', 'dist-other-deps', 'dist-posts'], function() {
    return gulp.src(paths.tmpDist + '/**/*')
      .pipe(revAll.revision())
      .pipe(gulp.dest(paths.dist + '/')) //write revisioned files to dist
      .pipe(revAll.manifestFile())
      .pipe(gulp.dest(paths.dist + '/')); //write rev manifest to dist
  });

  gulp.task('build', ['rev']);
};
