var gulp = require('gulp');
var pkg = require('./package.json');
var header = require('gulp-header');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var jsFile = 'build/exploded-dom.js',
    jsDest = 'dist/';

gulp.task('dist', function() {
    var headerString = '/** ${pkg.name} v${pkg.version}, ${pkg.license}, ${new Date().getFullYear()} ${pkg.author} */ ';
    
    return gulp.src(jsFile)
        .pipe(rename('exploded-dom.min.js'))
        .pipe(uglify())
        .pipe(header(headerString, {pkg: pkg}))
        .pipe(gulp.dest(jsDest))
});