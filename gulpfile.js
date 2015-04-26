'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');

var options = {
  appName: 'vbudWebsite',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components',
    // exclude jquery because we don't want to include it unless we actually need it
    // exclude bootstrap-sass javascript because we don't want jquery unless we actually need it, and we have angular-bootstrap for native components
    exclude: [/jquery/, /bootstrap-sass\/.*\.js/]
    // NOTE: If you decide to re-enable wiredep of scss files, you will want to use the below exclude property, as it excludes scss files that are already imported by other dependencies. Be sure to also make the required changes in gulp/styles.js and dependencies.scss in order to re-enable wiredep.
    // exclude bootstrap-sass scss files because it-mlaf-sass handles importing them
    // exclude modular-scale scss because it-mlaf-sass handles importing it
    // exclude: [/jquery/, /bootstrap-sass\/.*\.js/, /bootstrap-sass\/.*\.scss/, /modular-scale/, /bourbon/]
  }
};

var paths = {
  src: 'src',
  pages: 'src/pages',
  components: 'src/components',
  styles: 'src/styles',
  assets: 'src/assets',
  images: 'src/assets/images',
  fonts: 'src/assets/fonts',
  tmp: '.tmp',
  tmpPartials: '.tmp/partials',
  tmpStyles: '.tmp/styles',
  tmpServe: '.tmp/serve',
  tmpDist: '.tmp/dist',
  tmpDistScripts: '.tmp/dist/scripts',
  tmpDistStyles: '.tmp/dist/styles',
  tmpDistAssets: '.tmp/dist/assets',
  tmpDistImages: '.tmp/dist/assets/images',
  tmpDistFonts: '.tmp/dist/assets/fonts',
  dist: 'dist',
  e2e: 'e2e',
  templates: 'templates'
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options, paths);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
