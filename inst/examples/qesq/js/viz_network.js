
// file to segment data
var data_lib = '../data/'
var seg_file = data_lib + 'node_data.csv'
var net_file = data_lib + 'empresarios02.json'

var fixed_drag = true;  // are nodes to be fixed to dragged location?

// some more drawing params
var w = 800,
    h = 600;
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;
var min_size = 6;
var colours = d3.scale.category20();
var ncolours = 20;

var nodes;
var links;
var force;

d3.csv(seg_file, function(err, segs) {
    if (err) return console.warn(err);
    d3.json(net_file, function(err, net) {
	if (err) return console.warn(err);
        nodes = net.nodes;
        links = net.edges;

	// create name -> index mapping
        var n_id2idx = {};
        for (var i = 0; i < nodes.length; i++) {
            n_id2idx[nodes[i].id] = i;
        }

        // add entity segment to corresponding nodes in network
        for (var i = 0; i < segs.length; i++) {
	    var nidx = n_id2idx[segs[i].name];
            nodes[nidx].segment = segs[i].segment;
            nodes[nidx].btw_size = Math.pow(segs[i].betweenness,1/4)+min_size;
            nodes[nidx].str_size = Math.pow(segs[i].strength,1.5/2)+min_size;
            nodes[nidx].size = nodes[nidx].btw_size;
            nodes[nidx].color = colours(segs[i].segment % ncolours);
	    nodes[nidx].fixed = false;
        }
	
	//check_integrity(nodes, links);	// check data integrity

        // convert edge list to D3 format
        for (var i = 0; i < links.length; i++) {
            links[i].source = n_id2idx[links[i].source];
            links[i].target = n_id2idx[links[i].target];
        }
	
        draw_viz();
    })
    
})


function draw_viz(){

    // set up layout
    force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .start();

        // .gravity(.2)
        // .distance(100)
        // .linkStrength(.2)
        // .charge(-100)

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link")
        .data(links)
      .enter().append("line")
        .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(nodes)
      .enter().append("g")
	.attr("class", "node")
        .call(force.drag);

    node.append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return d.size; })
        .style("fill", function(d) { return d.color; });

    node.append("svg:title")
        .text(function(d) { return d.name; });

    node.append("image")
	.attr("xlink:href", "https://github.com/favicon.ico")
	.attr("x", function(d) { return -d.size/2; })
	.attr("y", function(d) { return -d.size/2; })
	.attr("width", function(d) { return d.size; })
	.attr("height", function(d) { return d.size; })
	.attr("opacity", .8);

    force.on("tick", function() {
	node.attr("transform", function(d) { return "translate(" + Math.max(d.size, Math.min(w - d.size, d.x)) + "," + 
					     Math.max(d.size, Math.min(h - d.size, d.y)) + ")"; });
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    });

    // custom drag function to stick dragged nodes to their position
    if (fixed_drag) {
	function dragstart(d) {
            d.fixed = true;
	}
	var drag = force.drag()
            .on('dragstart', dragstart);
	// add reset layout label
	svg.append('text')
    	    .attr('class', 'setterlabel')       		
    	    .attr('text-anchor', 'start')
    	    .attr('x', 5+'px')
    	    .attr('y', height+'px')
    	    .text('reset')
    	    .on('mousedown', function(){resetForce();});
	
	// Reset layout by allowing sticked nodes to move again
	function resetForce(){
            for (var i = 0; i < nodes.length; i++) {
		nodes[i].fixed=false;
	    }
	    force.start();
	}
    }
}


function check_integrity(nodes, links) {
    // is there any node referred to in links that are not actually defined in nodes?
    var node_names = {};
    for (var i = 0; i < nodes.length; i++) {
	node_names[nodes[i].id] = nodes[i].label;
    }
    for (var i = 0; i < links.length; i++) {
	if (!node_names.hasOwnProperty(links[i].source)) {
	    console.log('link', i, 'has source', links[i].source, ' not defined among network nodes');
	} 
	if (!node_names.hasOwnProperty(links[i].target)) {
	    console.log('link', i, 'has target', links[i].target, ' not defined among network nodes');
	} 
    }    
}
