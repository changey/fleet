define(function(require) {
  'user strict';
  var Backbone = require('backbone')
    , GraphView = require('views/graph');

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'main'
    },
    
    main: function() {

      this.graphView = new GraphView({
        el: "#container"
      }).render();
    }
  });

  var initialize = function(options) {

    var router = new AppRouter(options);
    router.initialize();

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});