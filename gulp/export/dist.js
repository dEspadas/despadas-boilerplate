'use strict'

var config = require('../gulpfile.config')

// var glob = require('glob')
var gulp = require('gulp')
// var gulpif = require('gulp-if')
var del = require('del')

var usemin = require('gulp-usemin')
var rev = require('gulp-rev')
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css')
var sourcemaps = require('gulp-sourcemaps')
var htmlmin = require('gulp-htmlmin')

// var sass = require('gulp-sass')
// var sourcemaps = require('gulp-sourcemaps')
// var autoprefixer = require('gulp-autoprefixer')

// var inject = require('gulp-inject')
// var injectString = require('gulp-inject-string')

// var sprity = require('sprity')

// var browserSync = require('browser-sync')
// var reload = browserSync.reload

gulp.task('build:dist', ['usemin:dist', 'fonts-copy:dist', 'images-copy:dist', 'views-copy:dist'], function () {
  console.log('Building dist env...')
})

gulp.task('usemin:dist', function () {
  return gulp.src(config.dev.dir + '/views/layout.vash')
    .pipe(usemin({
	  assetsDir: config.dev.dir,
	  outputRelativePath: '../',
      css: [ sourcemaps.init(), cleanCSS(), sourcemaps.write(), rev() ],
      html: [ htmlmin() ],
      js: [ uglify({preserveComments: 'license'}), rev() ],
      inlinejs: [ uglify({preserveComments: 'license'}) ],
      inlinecss: [ cleanCSS() ]
    }))
    .pipe(gulp.dest(config.dist.dir + '/views'));
})

// Copy view commands

gulp.task('views-copy:dist', function () {
  console.log('Copying views to ' + config.dist.dir + ' directory...')

  var views = [config.dev.dir + '/views/*.vash', '!' + config.dev.dir + '/views/layout.vash']

  return gulp.src(views, { base: config.dev.dir + '/views' })
             .pipe(gulp.dest(config.dist.dir + '/views'))
})

// Copy fonts commands

gulp.task('fonts-copy:dist', function () {
  console.log('Copying fonts font files to ' + config.dist.dir + ' directory...')
  return gulp.src(config.dev.dir + '/fonts/*.*')
             .pipe(gulp.dest(config.dist.dir + '/fonts'))
})

// Images commands

gulp.task('images-copy:dist', function () {
  console.log('Copying images to ' + config.dist.dir + ' directory...')

  var images = [config.dev.dir + '/images/*.{png,jpg,gif,svg}', config.dev.dir + '/images/**/*.{png,jpg,gif,svg}']

  return gulp.src(images, { base: config.dev.dir + '/images/' })
             .pipe(gulp.dest(config.dist.dir + '/images'))
})

// Watchs

// Clean commands

gulp.task('clean:dist', function (done) {
  console.log('Cleaning ' + config.dist.dir + ' directory...')
  return del([config.dist.dir], done)
})
