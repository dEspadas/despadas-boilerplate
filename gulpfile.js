var bowerProject = require('./bower.project.json')
var config = require('./gulpfile.config')

var gulp = require('gulp')
var wiredep = require('wiredep')
var merge = require('merge-stream')
var del = require('del')
// var filter = require('gulp-filter')
var gulpif = require('gulp-if')
var minifyInline = require('gulp-minify-inline')
var rename = require('gulp-rename')
var argv = require('yargs').argv
var jeditor = require('gulp-json-editor')

// CSS and JS bower file injection to temp dir
// http://lab.brightnorth.co.uk/2014/08/13/automating-linkage-how-i-learned-to-stop-worrying-and-love-the-build/
gulp.task('views-build:dev', ['libs-build:dev', 'bootstrap-font', 'build-templates:dev'], function () {
  console.log('Injecting index.html with the bower files if necessary...')

  var copyToDir = config.dev.dir
  var hasLayout = (bowerProject.dependencies['bootstrap'] || bowerProject.dependencies['material-design-lite']) ? 1 : 0

  return gulp.src('src/views/layout.vash')
              .pipe(gulpif(hasLayout, wiredep.stream({
                bowerJson: require('./bower.project.json'),
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
              })))
              .pipe(gulp.dest(copyToDir + '/views/'))
})

gulp.task('libs-build:dev', function () {
  if (bowerProject.dependencies['bootstrap'] || bowerProject.dependencies['material-design-lite']) {
    console.log('Copying bower files to directory...')
    var vendorScripts = gulp.src(wiredep({bowerJson: require('./bower.project.json')}).js).pipe(gulp.dest(config.dev.dir + '/libs'))
    var vendorCss = gulp.src(wiredep({bowerJson: require('./bower.project.json')}).css).pipe(gulp.dest(config.dev.dir + '/css'))

    return merge(vendorScripts, vendorCss)
  }
  console.log('No framework found! Check bower.project.json file.')
})

gulp.task('bootstrap-font', function () {
  var copyToDir = config.dev.dir

  if (bowerProject.dependencies['bootstrap']) {
    console.log('Copying bootstrap font files to tmp directory...')

    return gulp.src('./bower_components/bootstrap/dist/fonts/*.*', { base: './bower_components/bootstrap/dist/' })
               .pipe(gulp.dest(copyToDir))
  }
})

gulp.task('build-templates:dev', function () {
  console.log('Building example files in views directory...')

  // Add the index view to the dev dir
  // The accepted params are: --material, --bootstrap

  if (bowerProject.dependencies['bootstrap']) {
    return gulp.src('./src/views/index.bootstrap.vash', { base: './src/' })
               .pipe(minifyInline())
               .pipe(rename({
                 basename: 'index',
                 extname: '.vash'
               }))
               .pipe(gulp.dest(config.dev.dir + '/'))
  } else if (bowerProject.dependencies['material-design-lite']) {
    return gulp.src('./src/views/index.material.vash', { base: './src/' })
               .pipe(minifyInline())
               .pipe(rename({
                 basename: 'index',
                 extname: '.vash'
               }))
               .pipe(gulp.dest(config.dev.dir))
  } else {
    return gulp.src('./src/views/index.bare.vash', { base: './src/' })
               .pipe(rename({
                 basename: 'index',
                 extname: '.vash'
               }))
               .pipe(gulp.dest(config.dev.dir))
  }
})

gulp.task('create-project-json', function () {
  console.log('Editing project bower json...')

  // Edits the bower.project.json to add bower dependencies.
  // The accepted params are: --material, --bootstrap, --angular

  return gulp.src('./bower.project.json')
             .pipe(jeditor(function (json) {
               json.dependencies = {}
               json.overrides = {}
               return json
             }))
             .pipe(gulpif(argv.material, jeditor(function (json) {
               json.dependencies['material-design-lite'] = '^1.1.1'
               json.overrides = {}
               return json
             })))
             .pipe(gulpif(argv.angular, jeditor(function (json) {
               json.dependencies['angular'] = '^1.5.0'
               json.overrides = {}
               return json
             })))
             .pipe(gulpif(argv.bootstrap, jeditor(function (json) {
               json.dependencies['bootstrap'] = '^3.3.6'
               json.overrides['bootstrap'] = {}
               json.overrides['bootstrap']['main'] = ['dist/css/bootstrap.css', 'dist/css/bootstrap-theme.css', 'dist/js/bootstrap.js']
               return json
             })))
             .pipe(gulp.dest('./'))
})

gulp.task('clean:dev', function (done) {
  console.log('Cleaning ' + config.dev.dir + ' directory...')

  return del([config.dev.dir + '/**/*'], done)
})
