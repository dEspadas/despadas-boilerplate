var express = require('express')
var helmet = require('helmet')
var path = require('path')

var app = express()

app.set('views', path.join(__dirname, 'tmp/views')) // critical to use path.join on windows
app.set('view engine', 'vash')

app.use(helmet())

app.use('/app', express.static(path.join(__dirname, 'tmp/app')))
app.use('/css', express.static(path.join(__dirname, 'tmp/css')))
app.use('/js', express.static(path.join(__dirname, 'tmp/js')))
app.use('/fonts', express.static(path.join(__dirname, 'tmp/fonts')))
app.use('/images', express.static(path.join(__dirname, 'tmp/images')))

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
