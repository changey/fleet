define(function(require) {
  'user strict';

  require('jquery.ui');
  
  var Backbone = require('backbone')
     , Fleet = require('fleet')
     , d3 = require('d3')
     , _ = require('underscore')
     , CarDetailsTemplate = require('text!../../templates/carDetails.tmpl')
     , UnoccupiedCarsTemplate = require('text!../../templates/unoccupiedCars.tmpl')
     , UnoccupiedCarsTableTemplate = require('text!../../templates/unoccupiedCarsTable.tmpl')
     , Moment = require('moment')
     , UtilizationTemplate = require('text!../../templates/utilization.tmpl');
  
  var graph = Backbone.View.extend({
    events: {
      'click .change-state': 'changeState',
      'click .unoccupied-search': 'searchUnoccupied',
      'click .utilization-search': 'requestUtilizationRate'
    },
    
    render: function() {
      
      this.requestCar();
      var unoccupiedCarsTemplate = _.template(UnoccupiedCarsTemplate);

      this.$el.find('.unoccupied-cars-container').html(unoccupiedCarsTemplate);
      
      this.$el.find('.unoccupied-date').val(Moment(new Date()).format('MM/DD/YYYY'));

      var utilizationTemplate = _.template(UtilizationTemplate);

      this.$el.find('.utilization-container').html(utilizationTemplate);

      this.$el.find('.datepicker').datepicker();

    },
    
    requestUtilizationRate: function() {
      console.log("here")

      $.ajax({
        type: "POST",
        url: "/requestBooking",
//        data: {
//          queryDate: queryDate
//        },
        success: function(bookings) {

          console.log(bookings)
//          var template = _.template(UnoccupiedCarsTableTemplate, {
//            unoccupiedCars: unoccupiedCars
//          });
//
//          that.$el.find('.unoccupied-table-container').html(template);
        }
      });
    },

    searchUnoccupied: function() {

      var that = this;
      var queryDate = this.$el.find('.unoccupied-date').val();

      $.ajax({
        type: "POST",
        url: "/requestUnoccupiedCars",
        data: {
          queryDate: queryDate
        },
        success: function(unoccupiedCars) {

          var template = _.template(UnoccupiedCarsTableTemplate, {
            unoccupiedCars: unoccupiedCars
          });

          that.$el.find('.unoccupied-table-container').html(template);
        }
      });
    },
    
    changeState: function(e) {
      
      var that = this;
      var carId = $(e.currentTarget).data().id;
      var action = $(e.currentTarget).data().action;

      var carInfo = {
        carId: carId,
        reservedDate: this.$el.find('.reserve-date').val()
      };

      $.ajax({
        type: "POST",
        data: carInfo,
        url: "/" + action,
        success: function() {
          that.requestCar();
        }
      });

    },
    
    requestCar: function() {

      var that = this;
      
      $.ajax({
        url: "/requestCar",
        success: function(response) {
          var cars = JSON.parse(response);
          var totalNumCars = _.size(cars);
          var occupiedCars = _.size(_.where(cars, {state: "O"})) +
            _.size(_.where(cars, {state: "OP"}));
          that.currentUtilizationRate = occupiedCars/totalNumCars;
          that.renderCarDetails();
          that.parseCars(cars);
          that.createGraph(that.cars);
        }
      });
    },
    
    renderCarDetails: function(sequenceArray) {

      var stateSymbol = "";
      var state = "";
      var make = "";
      var model = "";
      var _id = "";
      
      if (sequenceArray) {
        stateSymbol= sequenceArray[0].name;
        state = this.literalizeState(stateSymbol);
        make = sequenceArray[1].name;
        model = sequenceArray[2].name;
        _id = sequenceArray[3].name;
      }
      
      var roundedUtilizationRate = (this.currentUtilizationRate * 100).toFixed(0);
      
      var template = _.template(CarDetailsTemplate, {
        stateSymbol: stateSymbol,
        state: state,
        make: make,
        model: model,
        _id: _id,
        currentUtilizationRate: roundedUtilizationRate
      });
      this.$el.find('.car-details').html(template);
      this.$el.find('.datepicker').datepicker();
      this.$el.find('.datepicker').val(Moment(new Date()).format('MM/DD/YYYY'));
    },
    
    literalizeState: function(state) {
      if (state === "O") {
        return "Occupied";
      } else if (state === "OP") {
        return "Occupied, but pending return";
      } else if (state === "U") {
        return "Unoccupied";
      } else if (state === "UP") {
        return "Unoccupied, but pending pickup";
      }
    },
    
    parseCars: function(cars) {
      
      var that = this;
      
      this.cars = {
        "name": "All cars",
        "children": []
      };
      _.each(cars, function(car) {
        
        that.sortCar(that.cars.children, car.state, "node");
        
        var carState = _.where(that.cars.children, {"name": car.state})[0];
        that.sortCar(carState.children, car.make, "node");
        
        var carMake = _.where(carState.children, {"name": car.make})[0];
        that.sortCar(carMake.children, car.model, "node");

        var carModel = _.where(carMake.children, {"name": car.model})[0];
        that.sortCar(carModel.children, car._id, "leaf");

      });

    },
    
    sortCar: function(parentArray, childName, type) {
      if (_.size(_.where(parentArray, {"name": childName})) === 0) {
        var newState = {
          "name": childName
        };
        
        if (type === "node") {
          newState.children = [];
        } else {
          newState.size = 1;
        }
        
        parentArray.push(newState);
      }
    },
    
    createGraph: function(json) {
      
      var that = this;
      
      // Dimensions of sunburst.
      var width = 550;
      var height = 550;
      var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
      var b = {
        w: 75, h: 30, s: 3, t: 10
      };

      var domain = [0, 1];
// make `colors` an ordinal scale
      var colors = d3.scale.category20();
      var greenColorScale = d3.scale.linear()
        .range(['#1dc28d', '#137B13']) //light->dark
        .domain(domain);

      var redColorScale = d3.scale.linear()
        .range(['#ffe5e5', '#ff0000'])
        .domain(domain);

      var purpleColorScale = d3.scale.linear()
        .range(['#ffc0cb', '#800080'])
        .domain(domain);

      var orangeColorScale = d3.scale.linear()
        .range(['#FBCEB1', '#FF7F00'])
        .domain(domain);

// Total size of all segments; we set this later, after loading the data.
      var totalSize = 0;

      this.$el.find("#chart").empty();
      
      var vis = d3.select("#chart").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var partition = d3.layout.partition()
        .sort(function(a, b) { return d3.ascending(a.name, b.name); })
        .size([2 * Math.PI, radius * radius])
        .value(function(d) { return d.size; });

      var arc = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

// Use d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.

//var text = getText();
//var csv = d3.csv.parseRows(text);
//var json = buildHierarchy(csv);
      
      createVisualization(json);

// Main function to draw and set up the visualization, once we have the data.
      function createVisualization(json) {

        // Basic setup of page elements.
        initializeBreadcrumbTrail();

        d3.select("#togglelegend").on("click", toggleLegend);

        // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.
        vis.append("svg:circle")
          .attr("r", radius)
          .style("opacity", 0);

        // For efficiency, filter nodes to keep only those large enough to see.
        var nodes = partition.nodes(json)
          .filter(function(d) {
            return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
          });

        var uniqueNames = (function(a) {
          var output = [];
          a.forEach(function(d) {
            if (output.indexOf(d.name) === -1) {
              output.push(d.name);
            }
          });
          return output;
        })(nodes);

        // set domain of colors scale based on data
        colors.domain(uniqueNames);

        // make sure this is done after setting the domain
        drawLegend();

        var path = vis.data([json]).selectAll("path")
          .data(nodes)
          .enter().append("svg:path")
          .attr("display", function(d) { return d.depth ? null : "none"; })
          .attr("d", arc)
          .attr("fill-rule", "evenodd")
          .style("fill", function(d) {
            if(d.depth === 1) {
              return getColor(d.depth, d.name, true);
            } else if(d.depth === 2) {
              that.level2flag = !that.level2flag;
              return getColor(d.depth, d.parent.name, that.level2flag);
            } else if(d.depth === 3) {
              that.level3flag = !that.level3flag;
              return getColor(d.depth, d.parent.parent.name, that.level3flag);
            } else if(d.depth === 4) {
              that.level4flag = !that.level4flag;
              return getColor(d.depth, d.parent.parent.parent.name, that.level4flag);
            }
          })
          .style("opacity", 1)
          .on("mouseover", mouseover);

        // Add the mouseleave handler to the bounding circle.
        d3.select("#container").on("mousedown", mouseleave);

        // Get total size of the tree = value of root node from partition.
        totalSize = path.node().__data__.value;
      };
      
      function getColor(depth, category, flag) {
        var colorGradient1;
        var colorGradient2;
        var colorScale;
        
        if(category === "O") {
          colorScale = greenColorScale;
        } else if (category === "U") {
          colorScale = redColorScale;
        } else if (category === "UP") {
          colorScale = purpleColorScale;
        } else {
          colorScale = orangeColorScale;
        }
        
        if(depth === 1) {
          colorGradient1 = 1;
        } else if (depth === 2) {
          colorGradient1 = 0.85;
          colorGradient2 = 0.65;
        } else if(depth === 3) {
          colorGradient1 = 0.5;
          colorGradient2 = 0.35;
        } else if(depth === 4) {
          colorGradient1 = 0.2;
          colorGradient2 = 0;
        }

        return flag ? colorScale(colorGradient1) : colorScale(colorGradient2);
      }

// Fade all but the current sequence, and show it in the breadcrumb trail.
      function mouseover(d) {

        var percentage = (100 * d.value / totalSize).toPrecision(3);
        var percentageString = percentage + "%";
        if (percentage < 0.1) {
          percentageString = "< 0.1%";
        }

        d3.select("#percentage")
          .text(percentageString);

        d3.select("#explanation")
          .style("visibility", "");

        var sequenceArray = getAncestors(d);
        updateBreadcrumbs(sequenceArray, percentageString);
        if (_.size(sequenceArray) === 4) {
          that.renderCarDetails(sequenceArray);
        }

        // Fade all the segments.
        d3.selectAll("path")
          .style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        vis.selectAll("path")
          .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
          })
          .style("opacity", 1);
      }

// Restore everything to full opacity when moving off the visualization.
      function mouseleave(d) {

        // Hide the breadcrumb trail
        d3.select("#trail")
          .style("visibility", "hidden");

        // Deactivate all segments during transition.
        d3.selectAll("path").on("mouseover", null);

        // Transition each segment to full opacity and then reactivate it.
        d3.selectAll("path")
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .each("end", function() {
            d3.select(this).on("mouseover", mouseover);
          });

        d3.select("#explanation")
          .transition()
          .duration(1000)
          .style("visibility", "hidden");
      }

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
      function getAncestors(node) {
        var path = [];
        var current = node;
        while (current.parent) {
          path.unshift(current);
          current = current.parent;
        }
        return path;
      }

      function initializeBreadcrumbTrail() {
        // Add the svg area.
        var trail = d3.select("#sequence").append("svg:svg")
          .attr("width", width)
          .attr("height", 50)
          .attr("id", "trail");
        // Add the label at the end, for the percentage.
        trail.append("svg:text")
          .attr("id", "endlabel")
          .style("fill", "#000");
      }

// Generate a string that describes the points of a breadcrumb polygon.
      function breadcrumbPoints(d, i) {
        var points = [];
        points.push("0,0");
        points.push(b.w + ",0");
        points.push(b.w + b.t + "," + (b.h / 2));
        points.push(b.w + "," + b.h);
        points.push("0," + b.h);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
          points.push(b.t + "," + (b.h / 2));
        }
        return points.join(" ");
      }

// Update the breadcrumb trail to show the current sequence and percentage.
      function updateBreadcrumbs(nodeArray, percentageString) {

        // Data join; key function combines name and depth (= position in sequence).
        var g = d3.select("#trail")
          .selectAll("g")
          .data(nodeArray, function(d) { return d.name + d.depth; });

        // Add breadcrumb and label for entering nodes.
        var entering = g.enter().append("svg:g");

        entering.append("svg:polygon")
          .attr("points", breadcrumbPoints)
          .style("fill", function(d) { return colors(d.name); });

        entering.append("svg:text")
          .attr("x", (b.w + b.t) / 2)
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; });

        // Set position for entering and updating nodes.
        g.attr("transform", function(d, i) {
          return "translate(" + i * (b.w + b.s) + ", 0)";
        });

        // Remove exiting nodes.
        g.exit().remove();

        // Now move and update the percentage at the end.
        d3.select("#trail").select("#endlabel")
          .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(percentageString);

        // Make the breadcrumb trail visible, if it's hidden.
        d3.select("#trail")
          .style("visibility", "");

      }

      function drawLegend() {

        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        var li = {
          w: 75, h: 30, s: 3, r: 3
        };

        var legend = d3.select("#legend").append("svg:svg")
          .attr("width", li.w)
          .attr("height", colors.domain().length * (li.h + li.s));

        var g = legend.selectAll("g")
          .data(colors.domain())
          .enter().append("svg:g")
          .attr("transform", function(d, i) {
            return "translate(0," + i * (li.h + li.s) + ")";
          });

        g.append("svg:rect")
          .attr("rx", li.r)
          .attr("ry", li.r)
          .attr("width", li.w)
          .attr("height", li.h)
          .style("fill", function(d) { return colors(d); });

        g.append("svg:text")
          .attr("x", li.w / 2)
          .attr("y", li.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d; });
      }

      function toggleLegend() {
        var legend = d3.select("#legend");
        if (legend.style("visibility") == "hidden") {
          legend.style("visibility", "");
        } else {
          legend.style("visibility", "hidden");
        }
      }

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
      function buildHierarchy(csv) {
        var root = {"name": "root", "children": []};
        for (var i = 0; i < csv.length; i++) {
          var sequence = csv[i][0];
          var size = +csv[i][1];
          if (isNaN(size)) { // e.g. if this is a header row
            continue;
          }
          var parts = sequence.split("-");
          var currentNode = root;
          for (var j = 0; j < parts.length; j++) {
            var children = currentNode["children"];
            var nodeName = parts[j];
            var childNode;
            if (j + 1 < parts.length) {
              // Not yet at the end of the sequence; move down the tree.
              var foundChild = false;
              for (var k = 0; k < children.length; k++) {
                if (children[k]["name"] == nodeName) {
                  childNode = children[k];
                  foundChild = true;
                  break;
                }
              }
              // If we don't already have a child node for this branch, create it.
              if (!foundChild) {
                childNode = {"name": nodeName, "children": []};
                children.push(childNode);
              }
              currentNode = childNode;
            } else {
              // Reached the end of the sequence; create a leaf node.
              childNode = {"name": nodeName, "size": size};
              children.push(childNode);
            }
          }
        }
        return root;
      };

    }
  });
  
  return graph;
});  