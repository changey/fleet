require.config({
  paths: {
    backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
    d3: 'libs/d3',
    jquery: 'libs/jquery/jquery-min',
    'jquery.ui': 'libs/jquery.ui-min',
    underscore: 'libs/underscore/underscore', // https://github.com/amdjs
    text: '../vendor/js/requirejs/text',
    templates: '../templates',
    moment: 'libs/moment'
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore']
    },
    d3: {
      exports: 'd3'
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