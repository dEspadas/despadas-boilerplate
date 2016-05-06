module.exports = {
// Project Directories

  src: {
    dir: 'src'
  },

  // bootstrap Files

  bootstrap: {
    js: ['./node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js'],
    css: './node_modules/bootstrap/dist/css/bootstrap.css',
    fonts: './node_modules/bootstrap/dist/fonts/*.*'
  },

  // material design lite Files

  material: {
    js: './node_modules/material-design-lite/dist/material.js',
    css: './node_modules/material-design-lite/dist/material.css'
  },

  // Angular Js 1.5

  angular: {
    js: ['./node_modules/angular/angular.js',
         './node_modules/angular-route/angular-route.js']
  },

  // React

  react: {
    js: ['./node_modules/react/dist/react.js',
        './node_modules/react-dom/dist/react-dom.js']
  }
}
