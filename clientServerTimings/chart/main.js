var margin = {top: 20, right: 60, bottom: 50, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
 
var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);
 
var x1 = d3.scale.ordinal();
var groupSpacing = 1;
var y = d3.scale.linear()
    .range([height, 0]);
 
var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");
 


var xAxis2 = d3.svg.axis()
.scale(x1)
.orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
//    .tickFormat(d3.format(".2s"));
 
var color = d3.scale.ordinal()
    .range(["#98abc5",  "#ff8c00"]);
 
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
var yBegin;
 

 
d3.csv("data.csv", function(error, data) {
  var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "Query"; });
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Query"; }));
  var x1DomainVals = {};
  var legendVals = {};
  data.forEach(function(d) {
    var yColumn = new Array();
    d.columnDetails = columnHeaders.map(function(name) {
        var splitted = name.split(" ");
        var sp2bSize = splitted[0];
        x1DomainVals[sp2bSize] = true;
        var clientOrServer = splitted[1];
        legendVals[clientOrServer] = true;
        if (!yColumn[sp2bSize]){
            yColumn[sp2bSize] = 0;
          }
        yBegin = yColumn[sp2bSize];
        yColumn[sp2bSize] += +d[name];
//        console.log(yBegin, +d[name] + yColumn[sp2bSize]);
        return {name: clientOrServer, column: sp2bSize, yBegin: yBegin, yEnd: +d[name] + yBegin,};
        
//        
//        if (!yColumn[ic]){
//            yColumn[ic] = 0;
//          }
//          yBegin = yColumn[ic];
//          yColumn[ic] += +d[name];
//          return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
          
          
    });
    d.total = d3.max(d.columnDetails, function(d) { 
      return d.yEnd; 
    });
  });
//  console.log(data);
//  console.log(d3.keys(x1DomainVals));
  
  x0.domain(data.map(function(d) { return d.Query; }));
  var x1DomainSize = d3.keys(x1DomainVals).length;
  x1.domain(d3.keys(x1DomainVals)).rangeRoundBands([0, x0.rangeBand()]);
  
  y.domain([0, 1]);
//  y.domain([0, d3.max(data, function(d) { 
//      return d.total; 
//  })]);
//  svg.append("g")
//  .attr("class", "x axis")
//  .attr("transform", "translate(0," + (height) + ")")
//  .call(xAxis2);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  

  
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
//      .attr("transform", "translate(5," + height + ")")
      .attr("y", 0)
      .attr("dy", ".7em")
      .style("text-anchor", "end")
      .text("Distribution of computation")
      ;
 
  var project_stackedbar = svg.selectAll(".project_stackedbar")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.Query) + ",0)"; });
  project_stackedbar.selectAll("rect")
      .data(function(d) { return d.columnDetails; })
    .enter().append("rect")
      .attr("width", x1.rangeBand() - groupSpacing)
      .attr("x", function(d) { 
        return x1(d.column);
      })
      .attr("y", function(d) { 
        return y(d.yEnd); 
      })
      .attr("height", function(d) { 
        return y(d.yBegin) - y(d.yEnd); 
      })
      .style("fill", function(d) { return color(d.name); });
 
  var legend = svg.selectAll(".legend")
//      .data(columnHeaders.slice().reverse())
      .data(d3.keys(legendVals))
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(50," + i * 20 + ")"; });
 
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
 
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
 
});