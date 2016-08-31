const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');

const DEV = true;
const PATHS = {
  SRC: {
	  CSS: ['source/scss/**/*.scss'],
	  JS: ['source/js/**/*.js']
  },
  DIST: {
    CSS: 'dist/css',
    JS: 'dist/js'
  }
};


/* ---------------------------------------
  1.  CSS
-----------------------------------------*/

gulp.task('css', function() {
  const sass = require('gulp-sass');
  const autoprefixer = require('gulp-autoprefixer');
  const clean = require('gulp-clean-css');
  const rename = require('gulp-rename');

  return gulp
    .src(PATHS.SRC.CSS)
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 versions', 'Android >= 4'] }))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATHS.DIST.CSS))
    .pipe(clean())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(PATHS.DIST.CSS));
});


/* ---------------------------------------
	2.	JS
-----------------------------------------*/

gulp.task('js', function() {
  // https://github.com/google/closure-compiler/wiki/ECMAScript6

  // https://www.npmjs.com/package/google-closure-compiler
  // const closureCompiler = require('google-closure-compiler').gulp();
  //
  // return closureCompiler({
  //   js: PATHS.SRC.JS,
  //   js_output_file: 'main.min.js',
  //   language_in: 'ECMASCRIPT6_STRICT',
  //   language_out: 'ECMASCRIPT5_STRICT',
  //   compilation_level: 'ADVANCED_OPTIMIZATIONS',
  //   output_wrapper: '(function(){\n%output%\n}).call(this)',
  //   warning_level: 'VERBOSE'
  // })
  // .src() // needed to force the plugin to run without gulp.src
  // .pipe(gulp.dest(PATHS.DIST.JS));
  //


  // https://www.npmjs.com/package/gulp-closure-compiler
  const closureCompiler = require('gulp-closure-compiler');

  return gulp.src(PATHS.SRC.JS)
    .pipe(closureCompiler({
      fileName: 'main.min.js',             // generated outfile
      compilerFlags: {
        language_in: 'ECMASCRIPT6_STRICT', // ES6!
        language_out: 'ECMASCRIPT5_STRICT',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        output_wrapper: '(function(){%output%}).call(this);',
        warning_level: 'VERBOSE'
      }
    }))
    .pipe(gulp.dest(PATHS.DIST.JS));
});


/* ---------------------------------------
  3.	Linting
-----------------------------------------*/

gulp.task('lint:css', function() {
  const stylelint = require('gulp-stylelint');
  const formatter = require('stylelint-config-standard');

  return gulp
    .src(PATHS.SRC.CSS)
    .pipe(stylelint({
      failAfterError: true,
      reporters: [
        // { formatter: 'string', console: true }
        { formatter: formatter, console: true }
      ]
    }));
});

gulp.task('lint:js', function() {
  const gjslint = require('gulp-gjslint');

  return gulp
    .src(PATHS.SRC.JS)
    .pipe(gjslint({
      flags: ['--strict']
    }))
    .pipe(gjslint.reporter('console'));

});


/* ---------------------------------------
  4.  Utils
-----------------------------------------*/

gulp.task('watch', function() {
  gulp.watch(PATHS.SRC.CSS, ['css']);
  gulp.watch(PATHS.SRC.JS, ['js']);
});

gulp.task('clean', function() {
  const del = require('del');

  return del(
    [PATHS.DIST.JS, PATHS.DIST.CSS]
  );
});

gulp.task('set-prod', function() {
  DEV = false;
  return process.env.NODE_ENV = 'production';
});


/* ---------------------------------------
  5.  Default Tasks
-----------------------------------------*/

gulp.task('default', ['css', 'js', 'watch']);
gulp.task('build', ['set-prod', 'lint:css', 'lint:js', 'clean', 'css', 'js']);
