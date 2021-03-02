import firstLine from './firstLine'
import secondLine from './secondLine'
import arrows from './arrows'

// let firstLineMap = firstLine.map(({date, value})=>{
//     return {date: date ,value: +value  }
// })

// console.log(firstLine,firstLineMap)

// let secondLineMap = secondLine.map(({date, value})=>{
//     return {date: date,value: +value  }
// })


var keys = ["secondLine", "firstLine"]

var data = 
[
{
    name : "secondLine",
    values: secondLine
},
{
name : "firstLine",
values : firstLine
},
];

var width = 1000;
var height = 300;
var margin = 50;
var duration = 250;
var legendRectSize = 18;                             
var legendSpacing = 4;
var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3;
var circleRadiusHover = 6;


/* Format Data */
var parseDate = d3.timeParse("%Y-%m-%d");

data.forEach(function(d) { 
  d.values.forEach(function(d) {
    d.date = parseDate(d.date);//parseDate(d.date);
    d.value = d.value;
  });
});


/* Scale */
var xScale = d3.scaleLinear()
  .domain(d3.extent(data[0].values, d => d.date))
  .range([width-margin, 0]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(data[0].values, d => d.value)])
  .range([height-margin, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

/* Add SVG */
var svg = d3.select("#chart").append("svg")
  .attr("width", (width+margin)+"px")
  .attr("height", (height+margin)+"px")
  .append('g')
  .attr("transform", `translate(${margin}, ${margin})`);


/* Add line into SVG */
var line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.value));

let lines = svg.append('g')
  .attr('class', 'lines');

lines.selectAll('.line-group')
  .data(data).enter()
  .append('g')
  .attr('class', 'line-group')  
  .append('path')
  .attr('class', 'line')  
  .attr('d', d => line(d.values))
  .style('stroke', (d, i) => color(i))
  .style('opacity', lineOpacity);


/* Add circles in the line */
lines.selectAll("circle-group")
  .data(data).enter()
  .append("g")
  .style("fill", (d, i) => color(i))
  .selectAll("circle")
  .data(d => d.values).enter()
  .append("g")
  .attr("class", "circle")  
  .append("circle")
  .attr("cx", d => xScale(d.date))
  .attr("cy", d => yScale(d.value))
  .attr("r", circleRadius)
  .style('opacity', circleOpacity);


/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale).ticks(7);
var yAxis = d3.axisLeft(yScale).ticks(5);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height-margin})`)
  .call(xAxis)
  .append('text')
  .attr("y", +20)
  .attr("x" , 0 + (width / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")                   
  .attr("fill", "#000")
  .text("Date(min)");

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append('text')
  .attr("transform", "rotate(-90)")
  .attr("y", -40)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")                   
  .attr("fill", "#000")
  .text("Value");

var legend = svg.selectAll('.legend')                             
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) 
        {                   
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = width - 150;//2 * legendRectSize; 
            var vert = i * height - offset + 50;
            return 'translate(' + horz + ',' + vert + ')';
          });

legend.append('rect') 
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', color) 
          .style('stroke', color);

legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d, i) { return keys[i]; });  

          legend.append("svg:defs").append("svg:marker")
          .attr("id", "triangle")
          .attr("refX", 12500)
          .attr("refY", 2500)
          .attr("markerWidth", 30)
          .attr("markerHeight", 30)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M 0 0 12 6 0 12 3 6")
          .style("fill", "black");