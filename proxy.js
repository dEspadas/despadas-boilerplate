var path = require('path')
var logger = require('bunyan')
var proxy = require('redbird')({
  port: 80,
  xfwd: false,
  bunyan: {
    name: 'proxy-redbird',
    serializers: {
      req: logger.stdSerializers.req
    },
    streams: [
      {
        level: 'info',
        stream: process.stdout            // log INFO and above to stdout
      },
      {
        level: 'error',
        path: path.join(__dirname, '/logs/proxy-error.log') // log ERROR and above to a file (TODO: NEED TO CHECK PATH)
      }
    ]
  }
})

// function reqSerializer (req) {
//   return {
//     ip: req.ip,
//     method: req.method,
//     url: req.url,
//     headers: req.headers
//   }
// }

proxy.register('localhost', 'localhost:3000')
