var gulp = require('gulp')
var Server = require('karma').Server
var path = require('path')

gulp.task('test:dev', function (done) {
  new Server({
    configFile: path.join(__dirname, '/../karma.dev.config.js'),
    singleRun: true
  }, done).start()
})

gulp.task('tdd:dev', function (done) {
  new Server({
    configFile: path.join(__dirname, '/../karma.dev.config.js')
  }, done).start()
})

gulp.task('test:dist', function (done) {
  new Server({
    configFile: path.join(__dirname, '/../karma.dist.config.js'),
    singleRun: true
  }, done).start()
})

gulp.task('tdd:dist', function (done) {
  new Server({
    configFile: path.join(__dirname, '/../karma.dist.config.js')
  }, done).start()
})
