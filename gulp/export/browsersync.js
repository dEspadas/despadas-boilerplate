'use strict'

var config = require('../gulpfile.config')

var gulp = require('gulp')
var browserSync = require('browser-sync')
var nodemon = require('gulp-nodemon')
var reload = browserSync.reload

gulp.task('server:start', ['nodemon', 'watch'], function () {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    notify: true,
    port: 3001
  })
})

gulp.task('nodemon', function (cb) {
  var started = false
  return nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'gulpfile.config.js',
      'package.json',
      'src/',
      'tmp/',
      'dist/',
      'gulp/',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!started) {
      cb()
      started = true
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false })
    }, 1000)
  })
})

gulp.task('watch', function () {
  gulp.watch([config.src.dir + '/css/styles/*.scss'], ['scss-build:dev'])
  gulp.watch([config.src.dir + '/js/custom/*.js', config.src.dir + '/views/*.*'], ['inject-layout:dev'])
})
