
function chartJsResize() {
	for (var i=0;i<jsGraphResize.length;i++)  {
		if(jsGraphResize[i][2].canvas.id.indexOf(current_tag+tag_canvas_suffix)==0) {
			if(typeof jsGraphResize[i][2].firstPass != "undefined") {
				if(jsGraphResize[i][2].firstPass == 5)jsGraphResize[i][2].firstPass=6;
			}
			subUpdateChart(jsGraphResize[i][2],jsGraphResize[i][3],jsGraphResize[i][4]);
		}
	}
};

var tag_canvas_suffix="_Tag_Canvas";
var count_tag_canvas=0;
var first_tag="not_yet_defined";
var current_tag="not_yes_defined";
var tag_canvas_list=[];
var tag_def_height=400;
var tag_def_width=800;
var tag_animation_only_first=false;

function setCanvas(tpgraph,data,options,height,width) { 
	var setheight,setwidth;
	if(typeof height=="undefined")setheight=tag_def_height;
	else setheight=height;
	if(typeof width=="undefined")setwidth=tag_def_width;
	else setwidth=width;
	
	var divs = document.getElementsByTagName('div');
	if(first_tag=="not_yet_defined") { first_tag=divs[divs.length-1].id; current_tag=first_tag; }
	if(typeof tag_canvas_list[divs[divs.length-1].id]=="undefined") tag_canvas_list[divs[divs.length-1].id] = [];
	var cnvcnt=tag_canvas_list[divs[divs.length-1].id].length;
	document.write("<canvas id=\""+divs[divs.length-1].id+tag_canvas_suffix+"_"+cnvcnt+"\" height=\""+setheight+"\" width=\""+setwidth+"\"></canvas>");
	tag_canvas_list[divs[divs.length-1].id][tag_canvas_list[divs[divs.length-1].id].length]={ tpgraph:tpgraph,data:data,options:options };
	if(divs[divs.length-1].id==first_tag){
		console.log("Display Canvas: "+divs[divs.length-1].id+tag_canvas_suffix+"_"+cnvcnt);
		tab_disp_canvas(divs[divs.length-1].id+tag_canvas_suffix+"_"+cnvcnt,tpgraph,data,options);
	}
}


function tab_disp_graph(tab){
	if(typeof tag_canvas_list[tab]!="undefined") {
		for(var i=0;i<tag_canvas_list[tab].length;i++) {
			tab_disp_canvas(tab+tag_canvas_suffix+"_"+i,tag_canvas_list[tab][i]["tpgraph"],tag_canvas_list[tab][i]["data"],tag_canvas_list[tab][i]["options"]);
		}
	}
};

function tab_disp_canvas(canvas,tpgraph,data,options){
	switch (tpgraph) {
		case "Bar":
			var chart = new Chart(document.getElementById(canvas).getContext("2d")).Bar(data,options);
			break;
		case "Pie":
			var chart = new Chart(document.getElementById(canvas).getContext("2d")).Pie(data,options);
			break;
		case "Doughnut":
			var chart = new Chart(document.getElementById(canvas).getContext("2d")).Doughtnut(data,options);
			break;
		case "Radar":
			var chart = new Chart(document.getElementById(canvas).getContext("2d")).Radar(data,options);
			break;
		case "PolarArea":
			var chart = new Chart(document.getElementById(canvas).getContext("2d")).PolarArea(data,options);
			break;
		case "HorizontalBar":
			var chart = new Chart(document.getElementById(canvas).getContext("2d")).HorizontalBar(data,options);
			break;
		case "StackedBar":
			var chart = new Chart(document.getElementById(canvas).getContext("2d")).StackedBar(data,options);
			break;
		case "HorizontalStackedBar":
			var chart = new Chart(document.getElementById(canvas).getContext("2d")).HorizontalStackedBar(data,options);
			break;
		case "Line":
			var chart = new Chart(document.getElementById(canvas).getContext("2d")).Line(data,options);
			break;
	}
};

function setRefreshCanvas() {
$('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
var vl_target=e.target+"";
vl_target=vl_target.split("#").pop();	
current_tag=vl_target;
chartJsResize();
tab_disp_graph(vl_target);
});
};

