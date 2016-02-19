var Express = require('express');
var app  = Express();

//Dev server config
app.use(Express.static('./src'));

app.get('/', function (req, res) {
  //Send index in Dev config
  res.sendfile('./src/index.html');
});

app.listen(3000);
