var width  = 900;
var height = 700;
var margin = 20;
var pad = margin / 2;
// Generates a tooltip for a SVG circle element based on its ID
function addTooltip(circle) {
    var x = parseFloat(circle.attr("cx"));
    var y = parseFloat(circle.attr("cy"));
    var r = parseFloat(circle.attr("r"));
    var text = circle.attr("id");

    var tooltip = d3.select("#d3container")
        .append("text")
        .text(text)
        .attr("x", x)
        .attr("y", y)
        .attr("dy", -r * 2)
        .attr("id", "tooltip");

    var offset = tooltip.node().getBBox().width / 2;

    if ((x - offset) < 0) {
        tooltip.attr("text-anchor", "start");
        tooltip.attr("dx", -r);
    }
    else if ((x + offset) > (width - margin)) {
        tooltip.attr("text-anchor", "end");
        tooltip.attr("dx", r);
    }
    else {
        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dx", 0);
    }
}

function createHtmlText(label,description,imgurl,slug){
    var htmllabel = "<div><h5>"+label+"</h5>"; 
    var htmldescription = "<p>"+description+"</p>";
    var htmlimage = '<img src="'+ imgurl+ '" alt="Smiley face" height="100" width="100"></div>'
    text = "<a href='http://lasillavacia.com/quienesquien/perfilquien/"+slug+"'>"+ htmllabel + htmlimage + htmldescription + "</a>" ;
    return(text)
};


function drawGraph(graph) {
    console.log(graph)
    var svg = d3.select("#d3container").append("svg")
        .attr("width", width)
        .attr("height", height);
    // draw plot background
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "#F2F2F2");

    // create an area within svg for plotting graph
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + pad + ", 100)");

    //update edges internally so they have the proper source and target node as given in the node id's
    var links = [];

    graph.edges.forEach(function(e) { 
        // Get the source and target nodes
        var sourceNode = graph.nodes.filter(function(n) { return n.id === e.source; })[0],
            targetNode = graph.nodes.filter(function(n) { return n.id === e.target; })[0];

        // Add the edge to the array
        links.push({source: sourceNode, target: targetNode, category1: e.category1,value1: e.value1, label: e.label});
    });

    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-force
    var layout = d3.layout.force()
        .size([width - margin, height - margin])
        .charge(-80)
        .gravity(.2)
        .linkDistance(80)
        // .linkDistance(function(d, i) {
        //     return (d.source.group == d.target.group) ? 50 : 100;
        // })
        .nodes(graph.nodes)
        .links(links)
        .start();
        // console.log(links)

    drawLinks(links);
    drawNodes(graph.nodes);

    // add ability to drag and update layout
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-drag
    var node = d3.selectAll(".node").call(layout.drag);

// Insert legend image
var g = svg.append("g");

var img = g.append("svg:image")
    .attr("xlink:href", "legend.svg")
    .attr("width", 800)
    .attr("height", 100)
    .attr("x", 0)
    .attr("y",0);
//Info 2

 // Change the size here to see it wrap
var w = 230
var h = 230;
var txt = "Haz click en los nodos para ver más detalles";

svg.append("foreignObject")
    .attr({width: w, height: h})
    .attr("transform", "translate(10,100)")
    .append("xhtml:body")
    .append("xhtml:div")
    .html(txt)
    .classed("infotxt",1);
 
    
  
    // Add click event
    // d3.selectAll(".node,.link")
    d3.selectAll(".node")
      .on("click", function(d,i) {                
            var d = this.__data__;
            //text = "Download data: " + d.file;
            text = createHtmlText(d.label,d.Ocupación,d.imgurl,d.slug);            
            d3.selectAll(".infotxt")
            .html(text);

            
        });
  
  //Add hover behavior
  
   svg.selectAll(".node,.link")
    .on("mouseover", function() {
      var sel = d3.select(this);
       sel.classed("hovered",true);
       // addTooltip(sel);
    })
    .on("mouseout", function() {
      var sel = d3.select(this);
       sel.classed("hovered",false);
       // d3.select("#tooltip").remove();
    })  
    layout.on("tick", function() {
        // node.attr("transform", function(d) { return "translate(" + Math.max(d.size, Math.min(w - d.size, d.x)) + "," + 
        //                  Math.max(d.size, Math.min(h - d.size, d.y)) + ")"; });
        d3.selectAll(".link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        d3.selectAll(".node")
            // .attr("cx", function(d) { return d.x = Math.max(r, Math.min(width - d.size, d.x)); })
            // .attr("cy", function(d) { return d.y = Math.max(r, Math.min(height - d.size, d.y)); });
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        // .attr("transform", function(d) { return "translate(" + Math.max(d.size, Math.min(width - d.size, d.x)) + "," + 
        //                  Math.max(d.size, Math.min(height - d.size, d.y)) + ")"; });
    });
}

// Draws nodes on plot
function drawNodes(nodes) {
    // used to assign nodes color by group
    var color = d3.scale.pow().exponent(0.5)
    .domain([0, 1])
    .range(["#f1f8ff" , "green"]);
    
    var sizeMax = d3.max(nodes, function(d) {return d.value2;});
    var sizeMin = d3.min(nodes, function(d) {return d.value2;});
    console.log(sizeMax)

    var scalesize = d3.scale.pow().exponent(0.1).domain([sizeMin, sizeMax])
    .range([2,10]);
    var node = d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function(d, i) { return d.id; })
        .attr("cx", function(d, i) { return d.x; })
        .attr("cy", function(d, i) { return d.y; })
        .attr("r",  function(d, i) { return scalesize(d.value2); })
        .style("fill",   function(d, i) { return color(d.value1); })
        // .style("fill", "000");
        // .on("mouseover", function(d, i) { addTooltip(d3.select(this)); })
        // .on("mouseout",  function(d, i) { d3.select("#tooltip").remove(); });

    node.append("svg:title")
        .text(function(d) { return d.label; });

}

// Draws edges between nodes
function drawLinks(links) {
    var colorlink = d3.scale.category10();
    var scale = d3.scale.linear()
        .domain(d3.extent(links, function(d, i) {
           return d.value;
        }))
        .range([1, 6]);
    var scalewidth = d3.scale.pow().exponent(0.5).domain([0,1]).range([2, 5]);

    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-links
    var link = d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("opacity", .1)
        .style("stroke-width", function(d, i) {
            return scalewidth(d.value1) + "px";
        })
        .style("stroke",   function(d, i) { return colorlink(d.category1); })
        // .style("stroke-dasharray", function(d, i) {
        //     return (d.value <= 1) ? "2, 2" : "none";
        // })
        ;
    link.append("svg:title")
        .text(function(d) { return d.category1; });

}










