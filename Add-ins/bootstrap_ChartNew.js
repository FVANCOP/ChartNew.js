


var tag_canvas_suffix="_Tag_Canvas";
var count_tag_canvas=0;
var first_tag="not_yet_defined";
var current_tag="not_yet_defined";
var tag_canvas_list=[];
var tag_def_height=400;
var tag_def_width=800;
var tag_animation_only_at_first_display=false;

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
	tag_canvas_list[divs[divs.length-1].id][tag_canvas_list[divs[divs.length-1].id].length]={ firstDisplay: true, width:setwidth, height: setheight, tpgraph:tpgraph,data:data,options:options, runAnimation:true };
        document.getElementById(divs[divs.length-1].id+tag_canvas_suffix+"_"+cnvcnt).getContext("2d").original_height=setheight;
        document.getElementById(divs[divs.length-1].id+tag_canvas_suffix+"_"+cnvcnt).getContext("2d").original_width=setwidth;
	if(divs[divs.length-1].id==first_tag){
		console.log("Display Canvas: "+divs[divs.length-1].id+tag_canvas_suffix+"_"+cnvcnt);
		tab_disp_canvas(divs[divs.length-1].id+tag_canvas_suffix+"_"+cnvcnt,tpgraph,data,options,true,setwidth,setheight,true);
		if(tag_animation_only_at_first_display==true)tag_canvas_list[divs[divs.length-1].id][tag_canvas_list[divs[divs.length-1].id].length-1]["runAnimation"]=false;
		tag_canvas_list[divs[divs.length-1].id][tag_canvas_list[divs[divs.length-1].id].length-1]["firstDisplay"]=false;	
	}
};


function tab_disp_graph(tab){
	if(typeof tag_canvas_list[tab]!="undefined") {
		for(var i=0;i<tag_canvas_list[tab].length;i++) {
			tab_disp_canvas(tab+tag_canvas_suffix+"_"+i,tag_canvas_list[tab][i]["tpgraph"],tag_canvas_list[tab][i]["data"],tag_canvas_list[tab][i]["options"],tag_canvas_list[tab][i]["runAnimation"],tag_canvas_list[tab][i]["width"],tag_canvas_list[tab][i]["height"],tag_canvas_list[tab][i]["firstDisplay"]);
			if(tag_animation_only_at_first_display==true)tag_canvas_list[tab][i]["runAnimation"]=false;
			tag_canvas_list[tab][i]["firstDisplay"]=false;			
		}
	}
};

function tab_disp_canvas(canvas,tpgraph,data,options,runAnimation,setWidth,setHeight,firstDisp){

	if(!runAnimation){
		bootStrapChartJsResize(document.getElementById(canvas).getContext("2d"),data,options);
		return(false);
	}

	if(!firstDisp) {
//		bootStrapChartJsResize(document.getElementById(canvas).getContext("2d"),data,options);
//		document.getElementById(canvas).getContext("2d").firstPass=9;
//		bootStrapChartJsResize(document.getElementById(canvas).getContext("2d"),data,options);
//		document.getElementById(canvas).getContext("2d").stroke();
//		document.getElementById(canvas).getContext("2d").clearRect(0, 0, document.getElementById(canvas).getContext("2d").canvas.width, document.getElementById(canvas).getContext("2d").canvas.height);
//		document.getElementById(canvas).getContext("2d").stroke();
//		document.getElementById(canvas).getContext("2d").firstPass=9;
//		updateChart(document.getElementById(canvas).getContext("2d"),data,options,true,true);
		document.getElementById(canvas).getContext("2d").firstPass=undefined;
		eval("var chart = new Chart(document.getElementById(canvas).getContext(\"2d\"))."+tpgraph+"(data,options);"); 
	}
	else {
		eval("var chart = new Chart(document.getElementById(canvas).getContext(\"2d\"))."+tpgraph+"(data,options);"); 
	}
};

function setRefreshCanvas() {
$('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
var vl_target=e.target+"";
vl_target=vl_target.split("#").pop();	
current_tag=vl_target;
tab_disp_graph(vl_target);
});
};

function bootStrapChartJsResize(ctx,data,options) {
	ctx.firstPass=9;
	updateChart(ctx,data,options,false,false);
};

