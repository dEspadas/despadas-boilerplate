var Express = require('express');
var app  = Express();
var serveStatic = require('serve-static');
var helmet = require('helmet');

//Dev server config
//app.use(Express.static('./src'));

//app.get('/', function (req, res) {
//  Send index in Dev config
//  res.sendfile('./src/index.html');
//});

app.use(helmet());
app.use(serveStatic('src', { 'index': ['index.html', 'index.htm'] }));

app.listen(3000);
