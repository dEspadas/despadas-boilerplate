var projectConfig = require('./project.config')
var config = require('./gulpfile.config')

var gulp = require('gulp')
var wiredep = require('wiredep')
var merge = require('merge-stream')
var del = require('del')
var filter = require('gulp-filter')

// CSS and JS bower file injection to temp dir
// http://lab.brightnorth.co.uk/2014/08/13/automating-linkage-how-i-learned-to-stop-worrying-and-love-the-build/
gulp.task('views-build:dev', ['libs-build', 'bootstrap-font', 'build-templates:dev'], function () {
  console.log('Injecting index.html with the bower files...')

  var copyToDir = config.dev.dir
  var filteredFile = filter(['src/views/layout.vash'], {restore: true})
  return gulp.src('src/views/*.vash')
              .pipe(filteredFile)
              .pipe(wiredep.stream({
                bowerJson: require('./bower.' + projectConfig.StyleFramework.name + '.json'),
                fileTypes: {
                  html: {
                    replace: {
                      js: function (filePath) {
                        return '<script src="' + config.dev.host + 'libs/' + filePath.split('/').pop() + '"></script>'
                      },
                      css: function (filePath) {
                        return '<link rel="stylesheet" href="' + config.dev.host + 'css/' + filePath.split('/').pop() + '"/>'
                      }
                    }
                  }
                }
              }))
              .pipe(filteredFile.restore)
              .pipe(gulp.dest(copyToDir + '/views/'))
})

gulp.task('libs-build', function () {
  console.log('Copying bower files to directory...')

  var copyToDir = config.dev.dir

  var vendorScripts = gulp.src(wiredep({bowerJson: require('./bower.' + projectConfig.StyleFramework.name + '.json')}).js).pipe(gulp.dest(copyToDir + '/libs'))
  var vendorCss = gulp.src(wiredep({bowerJson: require('./bower.' + projectConfig.StyleFramework.name + '.json')}).css).pipe(gulp.dest(copyToDir + '/css'))

  return merge(vendorScripts, vendorCss)
})

gulp.task('bootstrap-font', function () {
  var copyToDir = config.dev.dir

  if (projectConfig.StyleFramework.name === 'bootstrap') {
    console.log('Copying bootstrap font files to tmp directory...')

    return gulp.src('./bower_components/bootstrap/dist/fonts/*.*', { base: './bower_components/bootstrap/dist/' })
               .pipe(gulp.dest(copyToDir))
  }
})

gulp.task('build-templates:dev', function () {
  if (projectConfig.StyleFramework.useTemplate) {
    console.log('Building ' + projectConfig.StyleFramework.name + ' example files to tmp directory...')
    if (projectConfig.StyleFramework.name === 'bootstrap') {
      return gulp.src('./src/views/templates/bootstrap/**/*.vash', { base: './src/' })
                 .pipe(gulp.dest(config.dev.dir))
    } else if (projectConfig.StyleFramework.name === 'material') {
      return gulp.src('./src/views/templates/material/**/*.vash', { base: './src/' })
                 .pipe(gulp.dest(config.dev.dir))
    }
  }
})

gulp.task('clean:all', function (done) {
  var copyToDir = config.dev.dir

  console.log('Cleaning ' + copyToDir + ' directory...')

  return del([copyToDir + '/**/*'], done)
})
