var express = require('express')
// var serveStatic = require('serve-static')
var helmet = require('helmet')
var path = require('path')

var app = express()

app.set('views', path.join(__dirname, 'tmp/views')) // critical to use path.join on windows
app.set('view engine', 'vash')

// app.get(/(templates)\/(bootstrap|material)\/(.+)/, function (req, res) {
//   res.render('templates/' + req.params[1] + '/' + req.params[2] + '/index', {
//     channel: 'Express',
//     title: 'dEspadas Boilerplate - ' + req.params[1] + ' templates'
//   })
// })

app.use(helmet())

app.use('/css', express.static(path.join(__dirname, 'tmp/css')))
app.use('/js', express.static(path.join(__dirname, 'tmp/js')))
app.use('/libs', express.static(path.join(__dirname, 'tmp/libs')))
app.use('/fonts', express.static(path.join(__dirname, 'tmp/fonts')))

// app.use(serveStatic('public'))

// Routes
app.get('/', function (req, res) {
  res.render('index', {
    channel: 'Express',
    title: 'dEspadas Boilerplate'
  })
})

app.listen(3000, function () {
  console.log('Started server in port 3000')
  console.log('Env: ' + process.env.NODE_ENV)
})
