var configFile = require('./gulpfile.config')

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      configFile.dist.dir + '/js/*.js',
      './test/**/*.spec.js'
    ]
  })
}
