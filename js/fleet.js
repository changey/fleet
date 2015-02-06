define(function() {
    'use strict';

    var Fleet = {
      Models: {},
      Views: {},
      Collections: {},
      Router: {},
      constants: {
        API_URL: '/fleet/api'
      }
    };

    window.Fleet = Fleet;
    return window.Fleet;
  }
);