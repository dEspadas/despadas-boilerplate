'use strict'

var config = require('../gulpfile.config')

var glob = require('glob')
var gulp = require('gulp')
var gulpif = require('gulp-if')
var del = require('del')

var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')

var inject = require('gulp-inject')
var injectString = require('gulp-inject-string')

var sprity = require('sprity')

var browserSync = require('browser-sync')
var reload = browserSync.reload

gulp.task('build:dev', ['scss-build:dev', 'inject-layout:dev', 'copy-fonts:dev', 'svg-copy:dev', 'images-copy:dev'], function () {
  console.log('Building dev env...')
})

// Copy and inject view commands

gulp.task('inject-layout:dev', ['inject-custom:dev'], function () {
  console.log('Injecting and adjusting all view files...')
  return gulp.src(config.dev.dir + '/views/*.vash')
             .pipe(injectString.replace('/' + config.dev.dir + '/', '/'))
             .pipe(injectString.replace('/' + config.src.dir + '/', '/'))
             .pipe(injectString.replace('/' + config.dist.dir + '/', '/'))
             .pipe(gulp.dest(config.dev.dir + '/views'))
             .pipe(reload({stream: true}))
})

gulp.task('inject-custom:dev', ['inject-libs:dev'], function () {
  console.log('Injecting view with custom files...')

  return gulp.src(config.dev.dir + '/views/index.vash')
             .pipe(inject(gulp.src([config.dev.dir + '/js/custom/*.js', config.dev.dir + '/css/*.css'], { read: false }), {name: 'custom'}))
             .pipe(inject(gulp.src(config.dev.dir + '/app/**/*.js', { read: false }), {name: 'app'}))
             .pipe(gulp.dest(config.dev.dir + '/views'))
})

gulp.task('inject-libs:dev', ['views-copy:dev'], function () {
  console.log('Injecting view with libs files...')

  return gulp.src(config.dev.dir + '/views/index.vash')
             .pipe(inject(gulp.src([config.dev.dir + '/js/libs/angular.js', config.dev.dir + '/js/libs/angular-route.js'], { read: false }), {name: 'libs'}))
             .pipe(inject(gulp.src([config.dev.dir + '/js/libs/react.js', config.dev.dir + '/js/libs/react-dom.js'], { read: false }), {name: 'libs'}))
             .pipe(inject(gulp.src(config.dev.dir + '/js/libs/jquery.js', { read: false }), {name: 'jquery'}))
             .pipe(inject(gulp.src(config.dev.dir + '/js/libs/bootstrap.js', { read: false }), {name: 'framework'}))
             .pipe(inject(gulp.src(config.dev.dir + '/js/libs/material.js', { read: false }), {name: 'framework'}))
             .pipe(inject(gulp.src(config.dev.dir + '/css/libs/bootstrap.css', { read: false }), {name: 'framework'}))
             .pipe(inject(gulp.src(config.dev.dir + '/css/libs/material.css', { read: false }), {name: 'framework'}))
             .pipe(gulp.dest(config.dev.dir + '/views'))
})

gulp.task('views-copy:dev', ['app-copy:dev'], function () {
  console.log('Copying views to ' + config.dev.dir + ' directory...')
  return gulp.src(config.src.dir + '/views/*.vash', { base: config.src.dir + '/views/' })
             .pipe(gulp.dest(config.dev.dir + '/views'))
})

// JS commands

gulp.task('app-copy:dev', ['js-copy:dev'], function () {
  console.log('Copying app .js to ' + config.dev.dir + ' directory...')
  return gulp.src(config.src.dir + '/app/**/*.{js,html}', { base: config.src.dir + '/app/' })
             .pipe(gulp.dest(config.dev.dir + '/app'))
})

gulp.task('js-copy:dev', function () {
  console.log('Copying .js to ' + config.dev.dir + ' directory...')
  return gulp.src(config.src.dir + '/js/**/*.js', { base: config.src.dir + '/js/' })
             .pipe(gulp.dest(config.dev.dir + '/js'))
})

// Copy fonts commands

gulp.task('copy-fonts:dev', function () {
  console.log('Copying fonts font files to ' + config.dev.dir + ' directory...')
  return gulp.src(config.src.dir + '/fonts/*.*')
             .pipe(gulp.dest(config.dev.dir + '/fonts'))
})

// Scss and css commands

gulp.task('scss-build:dev', ['sprite-build:dev', 'copy-css:dev'], function () {
  console.log('Building scss and css files to ' + config.dev.dir + ' directory...')
  return gulp.src(config.src.dir + '/css/styles/index.scss', { base: config.src.dir + '/css/styles' })
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(config.dev.dir + '/css'))
    .pipe(reload({stream: true}))
})

gulp.task('copy-css:dev', function () {
  console.log('Copying css libs files to ' + config.dev.dir + ' directory...')
  return gulp.src(config.src.dir + '/css/libs/*.css', { base: config.src.dir + '/css' })
             .pipe(gulp.dest(config.dev.dir + '/css'))
})

// Images commands

gulp.task('svg-copy:dev', function () {
  console.log('Copying .svg to ' + config.dev.dir + ' directory...')
  return gulp.src(config.src.dir + '/images/svg/**/*.svg', { base: config.src.dir + '/images/' })
             .pipe(gulp.dest(config.dev.dir + '/images'))
})

gulp.task('images-copy:dev', function () {
  console.log('Copying .png/.jpg to ' + config.dev.dir + ' directory...')

  var images = [config.src.dir + '/images/*.{png,jpg,gif}', config.src.dir + '/images/**/*.{png,jpg,gif}', '!' + config.src.dir + '/images/spritesfolder/**/*.{png,jpg}']

  return gulp.src(images, { base: 'src/images/' })
             .pipe(gulp.dest(config.dev.dir + '/images'))
})

gulp.task('sprite-build:dev', function (done) {
  console.log('Building sprites to ' + config.dev.dir + ' directory...')

  if (glob.sync(config.src.dir + '/images/sprites/**/*.{png,jpg}').length === 0) {
    done()
    return
  }

  return sprity.src({
    src: config.src.dir + '/images/sprites/**/*.{png,jpg}',
    style: './sprite.scss',
    // processor: 'sass',
    'dimension': [{
      ratio: 1,
      dpi: 72
    }, {
      ratio: 2,
      dpi: 192
    }],
    split: true
  })
  .pipe(gulpif('*.png', gulp.dest(config.dev.dir + '/images'), gulp.dest(config.src.dir + '/css/styles')))
})

// Watchs

gulp.task('scss-watch:dev', ['sprite-build:dev'], function () {
  console.log('Building scss files to ' + config.dev.dir + ' directory...')
  return gulp.watch([config.src.dir + '/css/styles/*.scss'], ['scss-build:dev'])
})

gulp.task('all-watch:dev', function () {
  console.log('Watching all...')
  gulp.watch([config.src.dir + '/js/custom/*.js', config.src.dir + '/app/**/*.js', config.src.dir + '/views/*.*'], ['inject-layout:dev'])
  gulp.watch([config.src.dir + '/css/styles/*.scss'], ['scss-build:dev'])
  gulp.watch([config.src.dir + '/images/**/*.{png,jpg,gif,svg}'], ['svg-copy:dev', 'images-copy:dev', 'scss-build:dev'])
})

// Clean commands

gulp.task('clean:dev', function (done) {
  console.log('Cleaning ' + config.dev.dir + ' directory...')
  return del([config.dev.dir], done)
})
