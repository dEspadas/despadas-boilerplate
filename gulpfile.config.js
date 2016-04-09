module.exports = {
// Project Directories

  src: {
    dir: 'src'
  },
  dev: {
    host: 'http://localhost:3000/',
    dir: 'tmp'
  },
  dist: {
    dir: 'dist'
  },

  // bootstrap Files

  bootstrap: {
    js: [
      './node_modules/jquery/dist/jquery.js',
      './node_modules/bootstrap/dist/js/bootstrap.js'
    ],
    css: [
      './node_modules/bootstrap/dist/css/bootstrap.css'
    ],
    fonts: [
      './node_modules/bootstrap/dist/fonts/'
    ]
  },

  // material design lite Files

  material: {
    js: [
      './node_modules/material-design-lite/dist/material.js'
    ],
    css: [
      './node_modules/material-design-lite/dist/material.css'
    ]
  }
}
