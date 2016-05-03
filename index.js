var express = require('express')
var helmet = require('helmet')
var path = require('path')
var config = require('./gulpfile.config.js')

var app = express()

// Set env dir path
var dirEnvPath
if (process.env.NODE_ENV === 'production') {
  dirEnvPath = config.dist.dir
} else {
  dirEnvPath = config.dev.dir
}

app.set('views', path.join(__dirname, dirEnvPath + '/views')) // critical to use path.join on windows
app.set('view engine', 'vash')

app.use(helmet())

app.use('/app', express.static(path.join(__dirname, dirEnvPath + '/app')))
app.use('/css', express.static(path.join(__dirname, dirEnvPath + '/css')))
app.use('/js', express.static(path.join(__dirname, dirEnvPath + '/js')))
app.use('/fonts', express.static(path.join(__dirname, dirEnvPath + '/fonts')))
app.use('/images', express.static(path.join(__dirname, dirEnvPath + '/images')))

// Routes
app.get('/', function (req, res) {
  res.render('index', {
    channel: 'Express'
  })
})

app.listen(3000, function () {
  console.log('Started server in port 3000')
  console.log('Env: ' + process.env.NODE_ENV)
})
