(function () {
  'use strict'

  angular
    .module('despadasApp')
    .controller('MainController', MainController)

  /** @ngInject */
  function MainController () {
    var vm = this
    vm.title = "Despadas' Boilerplate"
  }
})()
