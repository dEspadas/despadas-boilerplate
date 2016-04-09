var config = require('./gulpfile.config')

var gulp = require('gulp')
// var merge = require('merge-stream')
var gulpif = require('gulp-if')
var del = require('del')
var argv = require('yargs').argv
var folder = require('gulp-folder')
// var filter = require('gulp-filter')

var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')


var through2 = require('through2');


// var inject = require('gulp-inject')
// var injectString = require('gulp-inject-string')

// var sprity = require('sprity')

// CSS and JS bower file injection to temp dir
// http://lab.brightnorth.co.uk/2014/08/13/automating-linkage-how-i-learned-to-stop-worrying-and-love-the-build/
gulp.task('build:dev', ['libs-build:dev', 'copy-fonts:dev', 'copy-views:dev'], function () {
  // console.log('Injecting index.html with the bower files if necessary...')

  // var hasLayout = (argv.bootstrap || argv.material) ? 1 : 0

  // return gulp.src('src/views/layout.vash')
  //   .pipe(gulpif(hasLayout, wiredep.stream({
  //     bowerJson: require('./bower.project.json'),
  //     fileTypes: {
  //       html: {
  //         replace: {
  //           js: function (filePath) {
  //             return '<script src="' + config.dev.host + 'libs/' + filePath.split('/').pop() + '"></script>'
  //           },
  //           css: function (filePath) {
  //             return '<link rel="stylesheet" href="' + config.dev.host + 'css/' + filePath.split('/').pop() + '"/>'
  //           }
  //         }
  //       }
  //     }
  //   })))
  //   .pipe(gulp.dest(config.dev.dir + '/views/'))
})

gulp.task('libs-build:dev', function () {
  // if (argv.bootstrap || argv.material) {
  //   console.log('Copying bower files to directory...')
  //   var vendorScripts = gulp.src(wiredep({ bowerJson: require('./bower.project.json') }).js).pipe(gulp.dest(config.dev.dir + '/libs'))
  //   var vendorCss = gulp.src(wiredep({ bowerJson: require('./bower.project.json') }).css).pipe(gulp.dest(config.dev.dir + '/css'))

  //   return merge(vendorScripts, vendorCss)
  // }
  // console.log('No framework found! Check bower.project.json file.')
})

gulp.task('copy-views:dev', function () {
  console.log('Copy views files in views directory...')

  return gulp.src('./src/views/*.vash', { base: './src/' })
    .pipe(gulp.dest(config.dev.dir))
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

// Create project

gulp.task('create-folder', function () {
  console.log('Creating directories...')
  if (argv.dir) {
    return gulp.src('./src/**/*.*', {base: './src/'})
              .pipe(folder({
                root: argv.dir,
                folders: {
                  app: './app',
                  css: {
                    libs: './css/libs',
                    styles: './css/styles'
                  },
                  fonts: './fonts',
                  images: {
                    spritesfolder: './images/spritesfolder',
                    svg: './images/svg'
                  },
                  js: {
                    custom: './js/custom',
                    libs: './js/libs'
                  },
                  views: './views'
                }
              }))
              .pipe(gulp.dest(argv.dir))
  } else {
    console.log('no --dir especified...')
  }
})

gulp.task('copy-project-files', function () {
  console.log('Copying default projetc files...')
  return gulp.src(['.eslintrc.json', 'app.js', 'index.js', 'proxy.js'])
             .pipe(gulp.dest(argv.dir))
})

gulp.task('copy-bootstrap-font:dev', function () {
  console.log('Copying bootstrap font files to ' + config.src.dir + ' directory...')

  return gulp.src(config.bootstrap.fonts + '*.*', { base: config.bootstrap.fonts })
    .pipe(gulp.dest(argv.dir + config.src + '/fonts'))
})

