var configFile = require('./gulpfile.config')

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      configFile.dev.dir + '/app/**/*.js',
      configFile.dev.dir + '/js/custom/*.js',
      './test/**/*.spec.js'
    ]
  })
}
