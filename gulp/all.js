'use strict'

var config = require('../gulpfile.config')

var gulp = require('gulp')
// var merge = require('merge-stream')
var gulpif = require('gulp-if')
var del = require('del')
// var filter = require('gulp-filter')

var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')

// var inject = require('gulp-inject')
// var injectString = require('gulp-inject-string')

var sprity = require('sprity')

gulp.task('build:dev', ['libs-build:dev', 'copy-fonts:dev', 'copy-views:dev'], function () {

})

gulp.task('libs-build:dev', function () {

})

// Copy fonts commands

gulp.task('copy-fonts:dev', function () {
  console.log('Copying fonts font files to ' + config.dev.dir + ' directory...')
  return gulp.src(config.src.dir + '/fonts/*.*', { base: config.src.dir })
             .pipe(gulp.dest(config.dev.dir))
})

// Scss and css commands

gulp.task('scss-build:dev', ['sprite-build:dev'], function () {
  console.log('Building scss files to ' + config.dev.dir + ' directory...')
  return gulp.src('src/css/style/index.scss', { base: 'src/css/style' })
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(config.dev.dir + '/css'))
})

gulp.task('scss-watch:dev', ['sprite-build:dev'], function () {
  console.log('Building scss files to ' + config.dev.dir + ' directory...')
  return gulp.watch(['src/css/style/*.scss'], ['scss-build:dev'])
})

// Images commands

gulp.task('svg-copy:dev', function () {
  console.log('Copying .svg to ' + config.dev.dir + ' directory...')
  return gulp.src('src/images/svg/**/*.svg', { base: 'src/images/svg/' })
             .pipe(gulp.dest(config.dev.dir + '/images'))
})

gulp.task('images-copy:dev', function () {
  console.log('Copying .png/.jpg to ' + config.dev.dir + ' directory...')

  var images = ['src/images/*.{png,jpg,gif}', 'src/images/**/*.{png,jpg,gif}', '!src/images/spritesfolder/**/*.{png,jpg}']

  return gulp.src(images, { base: 'src/images/' })
             .pipe(gulp.dest(config.dev.dir + '/images'))
})

gulp.task('sprite-build:dev', function () {
  console.log('Building sprites to ' + config.dev.dir + ' directory...')

  return sprity.src({
    src: 'src/images/spritesfolder/**/*.{png,jpg}',
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
  .pipe(gulpif('*.png', gulp.dest(config.dev.dir + '/images'), gulp.dest('src/css/styles')))
})

// Clean commands

gulp.task('clean:dev', function (done) {
  console.log('Cleaning ' + config.dev.dir + ' directory...')
  return del([config.dev.dir + '/**/*'], done)
})
