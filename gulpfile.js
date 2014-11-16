'use strict';

var program = require('commander');
var chalk = require('chalk');
var path = require('path');
var rimraf = require('rimraf');
var stylish = require('jshint-stylish');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

program.on('--help', function(){
  console.log('  Tasks:');
  console.log();
  console.log('    build       build the game');
  console.log('    clean       delete generated files');
  console.log('    dist        generate archive');
  console.log('    serve       launch development server');
  console.log('    watch       watch for file changes and rebuild automatically');
  console.log();
});

program
  .usage('<task> [options]')
  .option('-P, --prod', 'generate production assets')
  .parse(process.argv);

var prod = !!program.prod;
var testFiles = ['src/**/*.js', 'test/spec/**/*.js'];
gulp.task('default', ['build']);

gulp.task('build', ['build_source', 'build_app', 'build_index', 'build_styles']);

gulp.task('build_source', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(plugins.concat('plexi.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('build_app', function () {
  return gulp.src('app/**/*.js')
    .pipe(gulp.dest('build'));
});

gulp.task('build_index', function () {
  return gulp.src('app/index.html')
    .pipe(plugins.if(prod, plugins.htmlmin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
    })))
    .pipe(gulp.dest('build'));
});

gulp.task('build_styles', function () {
  return gulp.src('app/styles.styl')
    .pipe(plugins.stylus())
    .pipe(plugins.concat('app.css'))
    .pipe(plugins.if(prod, plugins.cssmin()))
    .pipe(gulp.dest('build'));
});

gulp.task('jshint', function () {
  return gulp.src('*.js', 'src/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish));
});

gulp.task('clean', function () {
  rimraf.sync('build');
  rimraf.sync('dist');
});

gulp.task('test', ['build_source'], function () {
  gulp.src(testFiles)
    .pipe(plugins.karma({
      configFile: 'karma.conf.js',
      action: 'run',
    }))
    .on('error', function (err) {
      throw err;
    });
});

gulp.task('dist', ['build'], function () {
  if (!prod) {
    plugins.util(chalk.yellow('WARNING'), chalk.gray('Missing flag --prod'));
    plugins.util(chalk.yellow('WARNING'), chalk.gray('You should generate production assets'));
  }
  return gulp.src('build/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['jshint', 'build_source']);
  gulp.watch('app/**/*.js', ['build_app']);
  gulp.watch('app/styles.styl', ['build_styles']);
  gulp.watch('app/index.html', ['build_index']);
});

gulp.task('jsdoc', function () {
  rimraf.sync('./doc');
  gulp.src('src/**/*.js')
    .pipe(plugins.jsdoc('./doc'));
});

gulp.task('serve', ['build'], function() {
  require('./app').listen(3000);
});

