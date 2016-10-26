var gulp = require('gulp');
var rename = require('gulp-rename');
var clean  = require('gulp-clean');
var run = require('gulp-run');
var replace = require('gulp-replace');
var wrap = require('gulp-wrap');

gulp.task('clean-dist', function () {
	return gulp.src(['./dist', './tmp'], {read: false})
		.pipe(clean());
});

gulp.task('install-pristine-forge', ['clean-dist'], function () {
	return gulp.src('./forge/**/*')
		.pipe(gulp.dest('./tmp/forge'));
});

gulp.task('bundle-forge', ['install-pristine-forge'], function () {
	return run("cd tmp/forge && npm install && npm run bundle")
		.exec();
});

gulp.task('install-forge', ['bundle-forge'], function () {
	return gulp.src('./tmp/forge/js/forge.bundle.js')
			.pipe(replace(/return require/g, "return require_internal"))
			.pipe(replace(/(.*, )require(,.*)/g, "$1require_internal$2"))
			.pipe(replace(/(.* )require( =.*)/g, "$1require_internal$2"))
			.pipe(replace(/(.*factory\()require(,.*)/g,"$1require_internal$2"))
			.pipe(replace(/(.*function\()require(,.*)/g,"$1require_internal$2"))
			//.pipe(replace(/(.*)require(\('crypto.*)/g, "$1require_internal$2"))
			.pipe(wrap({src: 'src/forge.js.template'}))
			.pipe(rename('forge.js'))
			.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['install-forge'], function () {
	return gulp.src('./tmp', {read: false})
		.pipe(clean());
});
