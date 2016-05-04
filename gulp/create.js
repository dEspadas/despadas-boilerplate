'use strict'

var config = require('../gulpfile.config')
var gulp = require('gulp')
var folder = require('gulp-folder')
var argv = require('yargs').argv
var filter = require('gulp-filter')
var rename = require('gulp-rename')
var prompt = require('gulp-prompt')
var jeditor = require('gulp-json-editor')
var merge = require('merge-stream')

var responses = {
  name: '',
  author: '',
  CSSframework: '',
  JSframework: ''
}

var srcDir = argv.dir + '/' + config.src.dir

// Create project

gulp.task('create', ['copy-project-files'], function () {
  console.log('Building base project...')
})

gulp.task('copy-project-files', ['copy-test'], function () {
  console.log('Copying default projetc files...')
  var filtered = filter('base.gulpfile.config.js', {restore: true})
  return gulp.src(['.eslintrc.json', 'app.js', 'index.js', 'proxy.js', 'gulpfile.js', 'base.gulpfile.config.js', 'karma.dev.config.js', 'karma.dist.config.js'])
             .pipe(filtered)
             .pipe(rename('gulpfile.config.js'))
             .pipe(filtered.restore)
             .pipe(gulp.dest(argv.dir))
})

gulp.task('copy-test', ['copy-views'], function () {
  console.log('Copying test files into test directory...')

  return gulp.src('./src/test/**/*.spec.js', { base: './src/' })
    .pipe(gulp.dest(srcDir + '/../'))
})

gulp.task('copy-views', ['copy-gulp'], function () {
  console.log('Copying views files into views directory...')

  return gulp.src('./src/views/*.vash', { base: './src/' })
    .pipe(gulp.dest(srcDir))
})

gulp.task('copy-gulp', ['copy-frameworks'], function () {
  console.log('Copying gulp files into gulp directory...')

  return gulp.src('./gulp/export/*.js', { base: './gulp/export/' })
    .pipe(gulp.dest(argv.dir + '/gulp'))
})

gulp.task('copy-frameworks', ['json-construct'], function () {
  console.log('Copying frameworks files if it is the case...')
  var JSframework
  var CSSframework
  var JStemp
  var CSStemp
  var fontTemp
  var bootstrapMerge

  if (responses.JSframework === 'AngularJs 1.5') {
    JSframework = gulp.src(config.angular.js).pipe(gulp.dest(srcDir + '/js/libs'))
  }

  if (responses.JSframework === 'React') {
    JSframework = gulp.src(config.react.js).pipe(gulp.dest(srcDir + '/js/libs'))
  }

  if (responses.CSSframework === 'Bootstrap') {
    JStemp = gulp.src(config.bootstrap.js).pipe(gulp.dest(srcDir + '/js/libs'))
    CSStemp = gulp.src(config.bootstrap.css).pipe(gulp.dest(srcDir + '/css/libs'))

    bootstrapMerge = merge(JStemp, CSStemp)

    fontTemp = gulp.src(config.bootstrap.fonts).pipe(gulp.dest(srcDir + '/fonts'))

    CSSframework = merge(bootstrapMerge, fontTemp)
  }

  if (responses.CSSframework === 'Material Design Lite') {
    JStemp = gulp.src(config.material.js).pipe(gulp.dest(srcDir + '/js/libs'))
    CSStemp = gulp.src(config.material.css).pipe(gulp.dest(srcDir + '/css/libs'))

    CSSframework = merge(JStemp, CSStemp)
  }

  if (responses.CSSframework !== 'None' && responses.JSframework !== 'None') {
    return merge(JSframework, CSSframework)
  } else if (responses.JSframework !== 'None') {
    return JSframework
  } else if (responses.CSSframework !== 'None') {
    return CSSframework
  }
})

gulp.task('json-construct', ['create-folder'], function () {
  console.log('Creating package.json file...')
  return gulp.src('base.package.json')
             .pipe(prompt.prompt({
               type: 'input',
               name: 'name',
               message: 'What is the name of the project?',
               validate: function (input) {
                 if (input.match(/([A-Z])\w+/)) {
                   console.error('\n' + 'No capital letters allowed!')
                   return false
                 }
                 if (input.match(/\s+/)) {
                   console.error('\n' + 'No spaces allowed!')
                   return false
                 }
                 return true
               }
             }, function (res) {
               responses.name = res.name
             }))
             .pipe(prompt.prompt({
               type: 'input',
               name: 'author',
               message: 'What is the author name?'
             }, function (res) {
               responses.author = res.author
             }))
             .pipe(jeditor(function (json) {
               json.name = responses.name;
               json.author = responses.author;
               return json
             }))
             .pipe(prompt.prompt({
               type: 'list',
               name: 'CSS',
               message: 'What CSS framework should be used?',
               choices: ['None', 'Bootstrap', 'Material Design Lite']
             }, function (res) {
               responses.CSSframework = res.CSS
             }))
             .pipe(prompt.prompt({
               type: 'list',
               name: 'JS',
               message: 'What JS framework should be used?',
               choices: ['None', 'AngularJs 1.5', 'React']
             }, function (res) {
               responses.JSframework = res.JS
             }))
             .pipe(jeditor(function (json) {
               if (responses.CSSframework === 'Bootstrap') {
                 json.dependencies.bootstrap = '^3.3.6';
                 json.dependencies.jquery = '^2.2.3';
               }
               if (responses.CSSframework === 'Material Design Lite') {
                 json.dependencies['material-design-lite'] = '^1.1.3';
               }
               if (responses.JSframework === 'AngularJs 1.5') {
                 json.dependencies.angular = '^1.5.5';
               }
               if (responses.JSframework === 'React') {
                 json.dependencies['babel-preset-es2015'] = '^6.6.0';
                 json.dependencies['babel-preset-react'] = '^6.5.0';
                 json.dependencies['babelify'] = '^7.2.0';
                 json.dependencies['react'] = '^15.0.0';
                 json.dependencies['react-dom'] = '^15.0.0';
               }
               return json
             }))
             .pipe(rename('package.json'))
             .pipe(gulp.dest(argv.dir))
})

gulp.task('create-folder', function () {
  console.log('Creating folder structure...')
  if (argv.dir) {
    return gulp.src(['./src/**/*.*', '!./src/test/**/*.*'], {base: './src/'})
              .pipe(folder({
                root: srcDir,
                folders: {
                  app: './app',
                  css: {
                    libs: './css/libs',
                    styles: './css/styles'
                  },
                  fonts: './fonts',
                  images: {
                    sprites: './images/sprites',
                    svg: './images/svg'
                  },
                  js: {
                    custom: './js/custom',
                    libs: './js/libs'
                  },
                  test: {
                    app: '../test/app',
                    js: {
                      custom: '../test/js/custom'
                    }
                  },
                  views: './views'
                }
              }))
              .pipe(gulp.dest(srcDir))
  } else {
    console.log('no --dir especified...')
  }
})
