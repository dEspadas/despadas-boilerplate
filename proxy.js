var proxy = require('redbird')({ port: 80, xfwd: false })

proxy.register('localhost', 'http://localhost:3000')
