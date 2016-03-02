var gulp = require('gulp')
var wiredep = require('wiredep')
var merge = require('merge-stream')

var config = {
  dev: {
    host: 'http://localhost:3000/'
  }
}

// CSS and JS bower file injection to temp dir
// http://lab.brightnorth.co.uk/2014/08/13/automating-linkage-how-i-learned-to-stop-worrying-and-love-the-build/
gulp.task('index-build', ['libs-build', 'bootstrap-font', 'bootstrap-examples'], function () {
  console.log('Injecting index.html with the bower files...')

  return gulp.src('src/views/layout.vash')
              .pipe(wiredep.stream({
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
              .pipe(gulp.dest('./tmp/views/'))
})

gulp.task('libs-build', function () {
  console.log('Copying bower files to tmp directory...')

  var vendorScripts = gulp.src(wiredep().js).pipe(gulp.dest('./tmp/libs'))
  var vendorCss = gulp.src(wiredep().css).pipe(gulp.dest('./tmp/css'))

  return merge(vendorScripts, vendorCss)
})

gulp.task('bootstrap-font', function () {
  console.log('Copying bootstrap font files to tmp directory...')

  return gulp.src('./bower_components/bootstrap/dist/fonts/*.*', { base: './bower_components/bootstrap/dist/' })
             .pipe(gulp.dest('./tmp/'))
})

gulp.task('bootstrap-examples', function () {
  console.log('Copying bootstrap example files to tmp directory...')

  return gulp.src(['./src/views/templates/**/*.vash', './src/views/*.vash', '!./src/views/layout.vash'], { base: './src/' })
             .pipe(gulp.dest('./tmp/'))
})
