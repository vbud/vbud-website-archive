var gulp = require('gulp');
var $ = {
	replace: require('gulp-replace')
};

var config = require('./config');
var paths = config.paths;

function renameProject(done) {
	if (!args.name && !args.n) {
		console.error(chalk.red('You must specify a new name for the project.') + '\n\nUsage:\n    gulp renameProject --name [name]\n    gulp renameProject -n [name]');
		return;
	}
	var newName = args.name || args.n;
	console.log('Changing project name from ' + config.appName + ' to ' + newName + '.');

	var oldName = config.appName;

	// if new name is same as old name, do nothing
	if (oldName == newName) {
		done();
		return;
	}

	var kebabOldName = _.kebabCase(oldName);
	var kebabNewName = _.kebabCase(newName);

	return gulp.src([
		'**/*',
		'!bower_components/**/*',
		'!node_modules/**/*',
		'!' + paths.dist + '/**/*',
		'!' + paths.tmp + '/**/*'
	])
		.pipe($.replace(oldName, newName))
		.pipe($.replace(kebabOldName, kebabNewName))
		.pipe(gulp.dest('.'));
}

gulp.task('rename-project', renameProject);
