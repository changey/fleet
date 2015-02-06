require.config({
  paths: {
    backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
    d3: 'd3/d3.min',
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore' // https://github.com/amdjs
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore']
    }
  }
});

require([
  'views/app', 
  'router',
  'fleet'
], function(AppView, Router, Fleet) {
  'use strict';

  Router.initialize({})
});