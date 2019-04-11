var width = 500;
var height = 500;

d3.csv("calvinCollegeSeniorScores.csv", function(csv) {
  for (var i = 0; i < csv.length; ++i) {
    csv[i].GPA = Number(csv[i].GPA);
    csv[i].SATM = Number(csv[i].SATM);
    csv[i].SATV = Number(csv[i].SATV);
    csv[i].ACT = Number(csv[i].ACT);
  }
  var satmExtent = d3.extent(csv, function(row) {
    return row.SATM;
  });
  var satvExtent = d3.extent(csv, function(row) {
    return row.SATV;
  });
  var actExtent = d3.extent(csv, function(row) {
    return row.ACT;
  });
  var gpaExtent = d3.extent(csv, function(row) {
    return row.GPA;
  });

  var satExtents = {
    SATM: satmExtent,
    SATV: satvExtent
  };

  // Axis setup
  var xScale = d3
    .scaleLinear()
    .domain(satmExtent)
    .range([50, 470]);
  var yScale = d3
    .scaleLinear()
    .domain(satvExtent)
    .range([470, 30]);

  var xScale2 = d3
    .scaleLinear()
    .domain(actExtent)
    .range([50, 470]);
  var yScale2 = d3
    .scaleLinear()
    .domain(gpaExtent)
    .range([470, 30]);

  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);

  var xAxis2 = d3.axisBottom().scale(xScale2);
  var yAxis2 = d3.axisLeft().scale(yScale2);

  //Create SVGs for charts
  var chart1 = d3
    .select("#chart1")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  var chart2 = d3
    .select("#chart2")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  var brushContainer1 = chart1.append("g").attr("id", "brush-container1");
  var brushContainer2 = chart2.append("g").attr("id", "brush-container2");

  /******************************************
		
		ADD BRUSHING CODE HERE

	 ******************************************/
  var brush1 = d3.brush().extent([[-10, -10], [width + 10, height + 10]]);
  var brush2 = d3.brush().extent([[-10, -10], [width + 10, height + 10]]);

  brush1
    .on("start", handleBrushStart1) // in-line alternative: .on('start', function() { // do stuff })
    .on("brush", handleBrushMove1)
    .on("end", handleBrushEnd1);

  brush2
    .on("start", handleBrushStart2) // in-line alternative: .on('start', function() { // do stuff })
    .on("brush", handleBrushMove2)
    .on("end", handleBrushEnd2);

  brushContainer1.call(brush1);
  brushContainer2.call(brush2);

  function handleBrushStart1() {
    clearSelected1();
    clearSelected2();
    brush2.move(brushContainer2, null);
  }

  function handleBrushStart2() {
    clearSelected1();
    clearSelected2();
    brush1.move(brushContainer1, null);
  }

  function handleBrushMove1() {
    var sel = d3.event.selection;
    if (!sel) {
      // sel is null when we clear the brush
      return;
    }

    // The d3.event.selection contains the boundary of your current brush. It is a nested array that has
    //  the form [[x0, y0], [x1, y1]], where (x0, y0) is the coordinate of the top-left corner and
    //  (x1, y1) is the coordinate of the bottom right corner.

    // You can also think is as [[left, top], [right, bottom]] if that is more intuitive to you

    // Get the boundaries.
    var [[left, top], [right, bottom]] = sel;

    // Check all the dots, highlight the ones inside the brush
    d3.selectAll(".circle").classed("selected", function(d) {
      var cx = xScale(d.SATM);
      var cy = yScale(d.SATV);
      return left <= cx && cx <= right && top <= cy && cy <= bottom;
    });
  }

  function handleBrushMove2() {
    var sel = d3.event.selection;
    if (!sel) {
      // sel is null when we clear the brush
      return;
    }

    // The d3.event.selection contains the boundary of your current brush. It is a nested array that has
    //  the form [[x0, y0], [x1, y1]], where (x0, y0) is the coordinate of the top-left corner and
    //  (x1, y1) is the coordinate of the bottom right corner.

    // You can also think is as [[left, top], [right, bottom]] if that is more intuitive to you

    // Get the boundaries.
    var [[left, top], [right, bottom]] = sel;

    d3.selectAll(".circle").classed("selected2", function(d) {
      var cx = xScale2(d.ACT);
      var cy = yScale2(d.GPA);
      return left <= cx && cx <= right && top <= cy && cy <= bottom;
    });
  }

  function handleBrushEnd1() {
    // Clear existing styles when the brush is reset
    if (!d3.event.selection) {
      clearSelected1();
    }
  }

  function handleBrushEnd2() {
    // Clear existing styles when the brush is reset
    if (!d3.event.selection) {
      clearSelected2();
    }
  }

  function clearSelected1() {
    d3.selectAll(".circle").classed("selected", false);
  }

  function clearSelected2() {
    d3.selectAll(".circle").classed("selected2", false);
  }

  //add scatterplot points
  var temp1 = chart1
    .selectAll("circle")
    .data(csv)
    .enter()
    .append("circle")
    .classed("circle", true)
    .attr("id", function(d, i) {
      return "circle-" + i;
    })
    .attr("stroke", "black")
    .attr("cx", function(d) {
      return xScale(d.SATM);
    })
    .attr("cy", function(d) {
      return yScale(d.SATV);
    })
    .attr("r", 5)
    .attr("fill", "rgba(0, 0, 0, 0.2)")
    .on("click", function(d, i) {
      d3.select("#satm").text(d.SATM);
      d3.select("#satv").text(d.SATV);
      d3.select("#act").text(d.ACT);
      d3.select("#gpa").text(d.GPA);
      d3.selectAll("circle").classed("selected", false);
      d3.selectAll("#circle-" + i).classed("selected", true);
    });

  var temp2 = chart2
    .selectAll("circle")
    .data(csv)
    .enter()
    .append("circle")
    .classed("circle", true)
    .attr("id", function(d, i) {
      return "circle-" + i;
    })
    .attr("stroke", "black")
    .attr("cx", function(d) {
      return xScale2(d.ACT);
    })
    .attr("cy", function(d) {
      return yScale2(d.GPA);
    })
    .attr("r", 5)
    .attr("fill", "rgba(0, 0, 0, 0.2)")
    .on("click", function(d, i) {
      d3.select("#satm").text(d.SATM);
      d3.select("#satv").text(d.SATV);
      d3.select("#act").text(d.ACT);
      d3.select("#gpa").text(d.GPA);
      d3.selectAll("circle").classed("selected", false);
      d3.selectAll("#circle-" + i).classed("selected", true);
    });

  chart1 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(0," + (width - 30) + ")")
    .call(xAxis) // call the axis generator
    .append("text")
    .attr("class", "label")
    .style("fill", "black")
    .attr("x", width - 16)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("SATM");

  chart1 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(50, 0)")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .style("fill", "black")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("SATV");

  chart2 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(0," + (width - 30) + ")")
    .call(xAxis2)
    .append("text")
    .attr("class", "label")
    .style("fill", "black")
    .attr("x", width - 16)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("ACT");

  chart2 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(50, 0)")
    .call(yAxis2)
    .append("text")
    .attr("class", "label")
    .style("fill", "black")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("GPA");
});
