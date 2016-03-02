var express = require('express')
// var serveStatic = require('serve-static')
var helmet = require('helmet')
var path = require('path')

var app = express()

app.set('views', path.join(__dirname, 'tmp/views')) // critical to use path.join on windows
app.set('view engine', 'vash')

// Routes
app.get('/', function (req, res) {
  res.render('index', {
    channel: 'Express',
    title: 'dEspadas Boilerplate'
  })
})
app.get('/templates/bootstrap/theme', function (req, res) {
  res.render('templates/bootstrap/theme/index', {
    channel: 'Express',
    title: 'dEspadas Boilerplate - bootstrap templates'
  })
})
app.get('/templates/material', function (req, res) {
  res.render('templates/material/index', {
    channel: 'Express',
    title: 'dEspadas Boilerplate - bootstrap templates'
  })
})

app.use(helmet())

app.use('/css', express.static(path.join(__dirname, 'tmp/css')))
app.use('/js', express.static(path.join(__dirname, 'tmp/js')))
app.use('/libs', express.static(path.join(__dirname, 'tmp/libs')))
app.use('/fonts', express.static(path.join(__dirname, 'tmp/fonts')))

// app.use(serveStatic('public'))

app.listen(3000, function () {
  console.log('Started server in port 3000')
  console.log('Env: ' + process.env.NODE_ENV)
})
