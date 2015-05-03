/*              
 * ChartNew.js  
 *
 * Vancoppenolle Francois - January 2014
 * francois.vancoppenolle@favomo.be
 *
 * Source location : http:\\www.favomo.be\graphjs
 * GitHub community : https://github.com/FVANCOP/ChartNew.js
 *
 * This file is originally an adaptation of the chart.js source developped by Nick Downie (2013)
 * https://github.com/nnnick/Chart.js. But since june 2014, Nick puts a new version with a
 * refunded code. Current code of ChartNew.js is no more comparable to the code of Chart.js 
 *
 * new charts compared to Chart.js
 *
 *     horizontalBar
 *     horizontalStackedBar
 *
 * Added items compared to Chart.js:
 *
 *     Title, Subtitle, footnotes, axis labels, unit label
 *     Y Axis on the right and/or the left
 *     canvas Border
 *     Legend
 *     crossText, crossImage
 *     graphMin, graphMax
 *     logarithmic y-axis (for line and bar)
 *     rotateLabels
 *     and lot of others...
 *
 */
// non standard functions;

var chartJSLineStyle=[];

chartJSLineStyle["solid"]=[];
chartJSLineStyle["dotted"]=[1,4];
chartJSLineStyle["shortDash"]=[2,1];
chartJSLineStyle["dashed"]=[4,2];
chartJSLineStyle["dashSpace"]=[4,6];
chartJSLineStyle["longDashDot"]=[7,2,1,2];
chartJSLineStyle["longDashShortDash"]=[10,4,4,4];
chartJSLineStyle["gradient"]=[1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,9,9,8,8,7,7,6,6,5,5,4,4,3,3,2,2,1];



function lineStyleFn(data)
{

if ((typeof chartJSLineStyle[data]) === "object")return chartJSLineStyle[data];
else return chartJSLineStyle["solid"];

}

if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}
};
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {
		"use strict";
		if (this == null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 0) {
			n = Number(arguments[1]);
			if (n != n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n != 0 && n != Infinity && n != -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	}
};
var charJSPersonalDefaultOptions = {};
var charJSPersonalDefaultOptionsLine = {} ;
var charJSPersonalDefaultOptionsRadar = {} ;
var charJSPersonalDefaultOptionsPolarArea = {} ;
var charJSPersonalDefaultOptionsPie = {};
var charJSPersonalDefaultOptionsDoughnut = {};
var charJSPersonalDefaultOptionsBar = {};
var charJSPersonalDefaultOptionsStackedBar = {};
var charJSPersonalDefaultOptionsHorizontalBar = {};
var charJSPersonalDefaultOptionsHorizontalStackedBar = {};
	///////// FUNCTIONS THAN CAN BE USED IN THE TEMPLATES ///////////////////////////////////////////

function roundToWithThousands(config, num, place) {
	var newval = 1 * unFormat(config, num);
	if (typeof(newval) == "number" && place != "none") {
		if (place <= 0) {
			var roundVal = -place;
			newval = +(Math.round(newval + "e+" + roundVal) + "e-" + roundVal);
		} else {
			var roundVal = place;
			var divval = "1e+" + roundVal;
			newval = +(Math.round(newval / divval)) * divval;
		}
	}
	newval = fmtChartJS(config, newval, "none");
	return (newval);
};

function unFormat(config, num) {
	if ((config.decimalSeparator != "." || config.thousandSeparator != "") && typeof(num) == "string") {
		var v1 = "" + num;
		if (config.thousandSeparator != "") {
			while (v1.indexOf(config.thousandSeparator) >= 0) v1 = "" + v1.replace(config.thousandSeparator, "");
		}
		if (config.decimalSeparator != ".") v1 = "" + v1.replace(config.decimalSeparator, ".")
		return 1 * v1;
	} else {
		return num;
	}
};
///////// ANNOTATE PART OF THE SCRIPT ///////////////////////////////////////////
/********************************************************************************
Copyright (C) 1999 Thomas Brattli
This script is made by and copyrighted to Thomas Brattli
Visit for more great scripts. This may be used freely as long as this msg is intact!
I will also appriciate any links you could give me.
Distributed by Hypergurl
********************************************************************************/
var cachebis = {};

function abbreviateNumber(num) {
	var suffixes = ["", "k", "m", "b","t"];
	if (num < 1000) return num;
	var i = parseInt(Math.floor(Math.log(num) / Math.log(1000)));
	return ((i % 1 == 0 ) ? (num / Math.pow(1000, i)) : (num / Math.pow(1000, i)).toFixed(1)) + '' + suffixes[i];
};

function fmtChartJSPerso(config, value, fmt) {
	switch (fmt) {
		case "abbreviateNumber":
			if (typeof(value) == "number") {
				var retValue = abbreviateNumber(value);
			}
			return retValue;
			break;
		case "Change_Month":
			if (typeof(value) == "string") return_value = value.toString() + " 2014";
			else return_value = value.toString() + "YY";
			break;
		default:
			return_value = value;
			break;
	}
	return (return_value);
};

function fmtChartJS(config, value, fmt) {
	var return_value;
	if (fmt == "notformatted") {
		return_value = value;
	} else if (fmt == "none" && typeof(value) == "number") {
		if (config.roundNumber != "none") {
			if (config.roundNumber <= 0) {
				var roundVal = -config.roundNumber;
				value = +(Math.round(value + "e+" + roundVal) + "e-" + roundVal);
			} else {
				var roundVal = config.roundNumber;
				var divval = "1e+" + roundVal;
				value = +(Math.round(value / divval)) * divval;
			}
		}
		if (config.decimalSeparator != "." || config.thousandSeparator != "") {
			return_value = value.toString().replace(/\./g, config.decimalSeparator);
			if (config.thousandSeparator != "") {
				var part1 = return_value;
				var part2 = "";
				var posdec = part1.indexOf(config.decimalSeparator);
				if (posdec >= 0) {
					part2 = part1.substring(posdec + 1, part1.length);
					part2 = part2.split('').reverse().join(''); // reverse string
					part1 = part1.substring(0, posdec);
				}
				part1 = part1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
				part2 = part2.split('').reverse().join(''); // reverse string
				return_value = part1
				if (part2 != "") return_value = return_value + config.decimalSeparator + part2;
			}
		} else return_value = value;
	} else if (fmt != "none" && fmt != "notformatted") {
		return_value = fmtChartJSPerso(config, value, fmt);
	} else {
		return_value = value;
	}
	return (return_value);
};

function addParameters2Function(data, fctName, fctList) {
	var mathFunctions = {
		mean: {
			data: data.data,
			datasetNr: data.v11
		},
		varianz: {
			data: data.data,
			datasetNr: data.v11
		},
		stddev: {
			data: data.data,
			datasetNr: data.v11
		},
		cv: {
			data: data.data,
			datasetNr: data.v11
		},
		median: {
			data: data.data,
			datasetNr: data.v11
		}
	};
	// difference to current value (v3)
	dif = false;
	if (fctName.substr(-3) == "Dif") {
		fctName = fctName.substr(0, fctName.length - 3);
		dif = true;
	}
	if (typeof eval(fctName) == "function") {
		var parameter = eval(fctList + "." + fctName);
		if (dif) {
			// difference between v3 (current value) and math function
			return data.v3 - window[fctName](parameter);
		}
		return window[fctName](parameter);
	}
	return;
};

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

function tmplbis(str, data,config) {
	newstr=str;
	if(newstr.substr(0,config.templatesOpenTag.length)==config.templatesOpenTag)newstr="<%="+newstr.substr(config.templatesOpenTag.length,newstr.length-config.templatesOpenTag.length);
	if(newstr.substr(newstr.length-config.templatesCloseTag.length,config.templatesCloseTag.length)==config.templatesCloseTag)newstr=newstr.substr(0,newstr.length-config.templatesCloseTag.length)+"%>";
	return tmplter(newstr,data);
}

function tmplter(str, data) {
	var mathFunctionList = ["mean", "varianz", "stddev", "cv", "median"];
	var regexMath = new RegExp('<%=((?:(?:.*?)\\W)??)((?:' + mathFunctionList.join('|') + ')(?:Dif)?)\\(([0-9]*?)\\)(.*?)%>', 'g');
	while (regexMath.test(str)) {
		str = str.replace(regexMath, function($0, $1, $2, $3, $4) {
			if ($3) {
				var rndFac = $3;
			} else {
				var rndFac = 2;
			}
			var value = addParameters2Function(data, $2, "mathFunctions");
			if (isNumber(value)) {
				return '<%=' + $1 + '' + Math.round(Math.pow(10, rndFac) * value) / Math.pow(10, rndFac) + '' + $4 + '%>';
			}
			return '<%= %>';
		});
	}
	// Figure out if we're getting a template, or if we need to
	// load the template - and be sure to cache the result.
	// first check if it's can be an id
	var fn = /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(str) ? cachebis[str] = cachebis[str] ||
		tmplter(document.getElementById(str).innerHTML) :
		// Generate a reusable function that will serve as a template
		// generator (and which will be cached).
		new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +
			// Convert the template into pure JavaScript
			str
			.replace(/[\r\n]/g, "\\n")
			.replace(/[\t]/g, " ")
			.split("<%").join("\t")
			.replace(/((^|%>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)%>/g, "',$1,'")
			.split("\t").join("');")
			.split("%>").join("p.push('")
			.split("\r").join("\\'") + "');}return p.join('');");
	// Provide some basic currying to the user
	return data ? fn(data) : fn;
};
if (typeof CanvasRenderingContext2D !== 'undefined') {
	/**
	 * ctx.prototype
	 * fillText option for canvas Multiline Support
	 * @param text string \n for newline
	 * @param x x position
	 * @param y y position
	 * @param yLevel = "bottom" => last line has this y-Pos [default], = "middle" => the middle line has this y-Pos)
	 * @param lineHeight lineHeight
	 */
	CanvasRenderingContext2D.prototype.fillTextMultiLine = function(text, x, y, yLevel, lineHeight,horizontal) {
		var lines = ("" + text).split("\n");
		// if its one line => in the middle 
		// two lines one above the mid one below etc.	
		if (yLevel == "middle") {
			if(horizontal)y -= ((lines.length - 1) / 2) * lineHeight;
		} else if (yLevel == "bottom") { // default
			if(horizontal)y -= (lines.length - 1) * lineHeight;
		}
		for (var i = 0; i < lines.length; i++) {
			this.fillText(lines[i], x, y);
			y += lineHeight;
		}	
	};
	CanvasRenderingContext2D.prototype.measureTextMultiLine = function(text, lineHeight) {
		var textWidth = 0;
		var lg;
		var lines = ("" + text).split("\n");
		var textHeight = lines.length * lineHeight;
		// if its one line => in the middle 
		// two lines one above the mid one below etc.	
		for (var i = 0; i < lines.length; i++) {
			lg = this.measureText(lines[i]).width;
			if (lg > textWidth) textWidth = lg;
		}
		return {
			textWidth: textWidth,
			textHeight: textHeight
		};
	};
	if (typeof CanvasRenderingContext2D.prototype.setLineDash !== 'function') {
		CanvasRenderingContext2D.prototype.setLineDash = function( listdash) {
			return 0;
		};
	};	
};
cursorDivCreated = false;

function createCursorDiv() {
	if (cursorDivCreated == false) {
		var div = document.createElement('divCursor');
		div.id = 'divCursor';
		div.style.position = 'absolute';
		document.body.appendChild(div);
		cursorDivCreated = true;
	}
};

initChartJsResize = false;
var jsGraphResize = new Array();

function addResponsiveChart(id,ctx,data,config) {
	initChartResize();
	var newSize=resizeGraph(ctx,config);

	if(typeof ctx.prevWidth != "undefined") {
		resizeCtx(ctx,newSize.newWidth,newSize.newHeight);
		ctx.prevWidth=newSize.newWidth;
	}
	ctx.prevWidth=newSize.newWidth;
	ctx.prevHeight=newSize.newHeight;
	jsGraphResize[jsGraphResize.length]= [id,ctx.tpchart,ctx,data,config];
};

function initChartResize() {
	if(initChartJsResize==false) {
		if (window.addEventListener) {
			window.addEventListener("resize", chartJsResize);
		} else {
			window.attachEvent("resize", chartJsResize);
		}
	}
};

function getMaximumWidth(domNode){
	var container = domNode.parentNode;
	return container.clientWidth;
};

function getMaximumHeight(domNode){
	var container = domNode.parentNode;
	return container.clientHeight;
};


function resizeCtx(ctx,newWidth,newHeight)
{
	if (window.devicePixelRatio) {    // Retina device

		ctx.canvas.style.width = newWidth/window.devicePixelRatio + "px";
		ctx.canvas.style.height = newHeight/window.devicePixelRatio + "px";
		ctx.canvas.height = newHeight/window.devicePixelRatio * window.devicePixelRatio;
		ctx.canvas.width = newWidth/window.devicePixelRatio * window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	} else {
		ctx.canvas.height = newHeight ;
		ctx.canvas.width = newWidth;
	}
};

function resizeGraph(ctx,config) {
	if(typeof config.maintainAspectRatio == "undefined")config.maintainAspectRatio=true;
	if(typeof config.responiveMinWidth == "undefined")config.responsiveMinWidth=0;
	if(typeof config.responsiveMinHeight  == "undefined")config.responsiveMinHeight=0;
	if(typeof config.responsiveMaxWidth  == "undefined")config.responsiveMaxWidth=9999999;
	if(typeof config.responsiveMaxHeight  == "undefined")config.responsiveMaxHeight=9999999;
	var canvas = ctx.canvas;
	if(typeof ctx.aspectRatio == "undefined") {
		ctx.aspectRatio = canvas.width / canvas.height;
	}
	
  	var newWidth = getMaximumWidth(canvas);
	var newHeight = config.maintainAspectRatio ? newWidth / ctx.aspectRatio : getMaximumHeight(canvas);
	newWidth=Math.min(config.responsiveMaxWidth,Math.max(config.responsiveMinWidth,newWidth));
	newHeight=Math.min(config.responsiveMaxHeight,Math.max(config.responsiveMinHeight,newHeight));
        return { newWidth : parseInt(newWidth), newHeight :  parseInt(newHeight)};
};



function chartJsResize() {
	for (var i=0;i<jsGraphResize.length;i++)  {
		if(typeof jsGraphResize[i][2].firstPass != "undefined") {
			if(jsGraphResize[i][2].firstPass == 5)jsGraphResize[i][2].firstPass=6;
		}
		subUpdateChart(jsGraphResize[i][2],jsGraphResize[i][3],jsGraphResize[i][4]);
	}
};

function testRedraw(ctx,data,config) {
	if (ctx.firstPass==2 || ctx.firstPass==4 || ctx.firstPass==9) {
		ctx.firstPass=6;
		subUpdateChart(ctx,data,config) ;
		return true;
	} else {
		ctx.firstPass=5;
		return false;
	}		
};

function updateChart(ctx,data,config,animation,runanimationcompletefunction) {
	if (ctx.firstPass==5)
	{
		ctx.runanimationcompletefunction=runanimationcompletefunction;
		if(animation)ctx.firstPass=0;
		else if (config.responsive) ctx.firstPass=7;
		else ctx.firstPass=7;
		subUpdateChart(ctx,data,config) ;
		
	}
};

function subUpdateChart(ctx,data,config) {
	// ctx.firstPass==undefined => graph never drawn
	// ctx.firstPass==0 => graph is drawn but need to be redrawn with animation
	// ctx.firstPass==1 => graph is drawn with animation 
	// ctx.firstPass==2 => graph is in animation but at the end the graph need perhaps to be redrawn;
	// ctx.firstPass==3 => graph currently drawing without animation; 
	// ctx.firstPass==4 => graph currently drawing without animationb but at the end, the graph need perhaps to be redrawn;
	// ctx.firstPass==5 => graph is displayed ; 
	// ctx.firstPass==6 => graph is displayed but need to be redraw without animation (because of a resize);
	// ctx.firstPass==7 => graph is displayed but need to be redraw without responsivity;
	if(!dynamicFunction(data, config, ctx)) { return; }

	if(typeof ctx.firstPass == "undefined") { 
		ctx.firstPass=1;
		var newSize=resizeGraph(ctx,config);
		if(config.responsive) {
			resizeCtx(ctx,newSize.newWidth,newSize.newHeight);
			ctx.prevWidth=newSize.newWidth;
			ctx.prevHeight=newSize.newHeight;
		} else {
			ctx.prevWidth=0;
			ctx.prevHeight=0;
		}
		ctx.runanimationcompletefunction=true;
		redrawGraph(ctx,data,config);
	} else if(ctx.firstPass == 0) { 
		ctx.firstPass=1;
		var newSize=resizeGraph(ctx,config);
		if(config.responsive) {
			resizeCtx(ctx,newSize.newWidth,newSize.newHeight);
			ctx.prevWidth=newSize.newWidth;
			ctx.prevHeight=newSize.newHeight;
		} else {
			ctx.prevWidth=0;
			ctx.prevHeight=0;
		}
		redrawGraph(ctx,data,config);
	} else if(ctx.firstPass==1 || ctx.firstPass==2) {
		ctx.firstPass=2;
	} else if (ctx.firstPass==3 || ctx.firstPass==4) {
		ctx.firstPass=4;
	} else if(ctx.firstPass==5) {
		ctx.firstPass=1;
		redrawGraph(ctx,data,config);
	} else if(ctx.firstPass==6) {
		var newSize=resizeGraph(ctx,config);
		if (newSize.newWidth!=ctx.prevWidth || newSize.newHeight != ctx.prevHeight) {
			ctx.firstPass=3;
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			if(config.responsive) {
				resizeCtx(ctx,newSize.newWidth,newSize.newHeight);
				ctx.prevWidth=newSize.newWidth;
				ctx.prevHeight=newSize.newHeight;
			} else {
				ctx.prevWidth=0;
				ctx.prevHeight=0;
			}
			redrawGraph(ctx,data,config);
		} else ctx.firstPass=5;
	} else if(ctx.firstPass==7) {
		var newSize=resizeGraph(ctx,config);
		ctx.firstPass=3;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		if(config.responsive) {
			resizeCtx(ctx,newSize.newWidth,newSize.newHeight);
			ctx.prevWidth=newSize.newWidth;
			ctx.prevHeight=newSize.newHeight;
		} else {
			ctx.prevWidth=0;
			ctx.prevHeight=0;
		}
		redrawGraph(ctx,data,config);
	} 
};

function redrawGraph(ctx,data,config) {
	var myGraph = new Chart(ctx);	
	switch (ctx.tpchart) {
		case "Bar":
			myGraph.Bar(data,config);
			break;
		case "Pie":
			myGraph.Pie(data,config);
			break;
		case "Doughnut":
			myGraph.Doughnut(data,config);
			break;
		case "Radar":
			myGraph.Radar(data,config);
			break;
		case "PolarArea":
			myGraph.PolarArea(data,config);
			break;
		case "HorizontalBar":
			myGraph.HorizontalBar(data,config);
			break;
		case "StackedBar":
			myGraph.StackedBar(data,config);
			break;
		case "HorizontalStackedBar":
			myGraph.HorizontalStackedBar(data,config);
			break;
		case "Line":
			myGraph.Line(data,config);
			break;
	}
};


//Default browsercheck, added to all scripts!                                   
function checkBrowser() {
	this.ver = navigator.appVersion
	this.dom = document.getElementById ? 1 : 0
	this.ie5 = (this.ver.indexOf("MSIE 5") > -1 && this.dom) ? 1 : 0;
	this.ie4 = (document.all && !this.dom) ? 1 : 0;
	this.ns5 = (this.dom && parseInt(this.ver) >= 5) ? 1 : 0;
	this.ns4 = (document.layers && !this.dom) ? 1 : 0;
	this.bw = (this.ie5 || this.ie4 || this.ns4 || this.ns5)
	return this
};
bw = new checkBrowser();
//Set these variables:
fromLeft = 10; // How much from the left of the cursor should the div be?
fromTop = 10; // How much from the top of the cursor should the div be?
/********************************************************************
Initilizes the objects
*********************************************************************/
function cursorInit() {
	scrolled = bw.ns4 || bw.ns5 ? "window.pageYOffset" : "document.body.scrollTop"
	if (bw.ns4) document.captureEvents(Event.MOUSEMOVE)
};
/********************************************************************
Contructs the cursorobjects
*********************************************************************/
function makeCursorObj(obj, nest) {
	createCursorDiv();
	nest = (!nest) ? '' : 'document.' + nest + '.'
	this.css = bw.dom ? document.getElementById(obj).style : bw.ie4 ? document.all[obj].style : bw.ns4 ? eval(nest + "document.layers." + obj) : 0;
	this.moveIt = b_moveIt;
	cursorInit();
	return this
};

function b_moveIt(x, y) {
	this.x = x;
	this.y = y;
	this.css.left = this.x + "px";
	this.css.top = this.y + "px";
};

function isIE() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
};

function mergeChartConfig(defaults, userDefined) {
	var returnObj = {};
	for (var attrname in defaults) {
		returnObj[attrname] = defaults[attrname];
	}
	for (var attrname in userDefined) {
		returnObj[attrname] = userDefined[attrname];
	}
	return returnObj;
};

function sleep(ms) {
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime()) {};
};

function saveCanvas(ctx, data, config) {
	cvSave = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	var saveCanvasConfig = {
		savePng: false,
		annotateDisplay: false,
		animation: false,
		dynamicDisplay: false
	};
	var savePngConfig = mergeChartConfig(config, saveCanvasConfig);
	savePngConfig.clearRect = false;
	/* And ink them */

	redrawGraph(ctx,data,savePngConfig);
	if (config.savePngOutput == "NewWindow") {
		var image = ctx.canvas.toDataURL();
		ctx.putImageData(cvSave, 0, 0);
		window.open(image, '_blank');
	}
	if (config.savePngOutput == "CurrentWindow") {
		var image = ctx.canvas.toDataURL();
		ctx.putImageData(cvSave, 0, 0);
		window.location.href = image;
	}
	if (config.savePngOutput == "Save") {
		var image = ctx.canvas.toDataURL();
		var downloadLink = document.createElement("a");
		downloadLink.href = image;
		downloadLink.download = config.savePngName + ".png";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}
};
if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}
};
var dynamicDisplay = new Array();
var dynamicDisplayList = new Array();

function dynamicFunction(data, config, ctx) {

	if (isIE() < 9 && isIE() != false) return(true);


	if (config.dynamicDisplay) {
		if (ctx.canvas.id == "") {
			var cvdate = new Date();
			var cvmillsec = cvdate.getTime();
			ctx.canvas.id = "Canvas_" + cvmillsec;
		}
		if (typeof(dynamicDisplay[ctx.canvas.id]) == "undefined") {
			dynamicDisplayList[dynamicDisplayList["length"]] = ctx.canvas.id;
			dynamicDisplay[ctx.canvas.id] = [ctx, false, false, data, config, ctx.canvas];
			dynamicDisplay[ctx.canvas.id][1] = isScrolledIntoView(ctx.canvas);
			window.onscroll = scrollFunction;
		} else if (dynamicDisplay[ctx.canvas.id][2] == false) {
			dynamicDisplay[ctx.canvas.id][1] = isScrolledIntoView(ctx.canvas);
		}
		if (dynamicDisplay[ctx.canvas.id][1] == false && dynamicDisplay[ctx.canvas.id][2] == false) {
			return false;
		}
		dynamicDisplay[ctx.canvas.id][2] = true;
	}
	return true;
};

function isScrolledIntoView(element) {
	var xPosition = 0;
	var yPosition = 0;
	elem = element;
	while (elem) {
		xPosition += (elem.offsetLeft - elem.scrollLeft + elem.clientLeft);
		yPosition += (elem.offsetTop - elem.scrollTop + elem.clientTop);
		elem = elem.offsetParent;
	}
	if (xPosition + element.width / 2 >= window.pageXOffset &&
		xPosition + element.width / 2 <= window.pageXOffset + window.innerWidth &&
		yPosition + element.height / 2 >= window.pageYOffset &&
		yPosition + element.height / 2 <= window.pageYOffset + window.innerHeight
	) return (true);
	else return false;
};

function scrollFunction() {
	for (var i = 0; i < dynamicDisplayList["length"]; i++) {
		if (isScrolledIntoView(dynamicDisplay[dynamicDisplayList[i]][5]) && dynamicDisplay[dynamicDisplayList[i]][2] == false) {
			dynamicDisplay[dynamicDisplayList[i]][1] = true;
			redrawGraph(dynamicDisplay[dynamicDisplayList[i]][0],dynamicDisplay[dynamicDisplayList[i]][3], dynamicDisplay[dynamicDisplayList[i]][4]);
		}
	}
};

var jsGraphAnnotate = new Array();

function clearAnnotate(ctxid) {
	jsGraphAnnotate[ctxid] = [];
};

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};

function doMouseAction(config, ctx, event, data, action, funct) {

	var onData = false;
	var textMsr;
	
	if (action == "annotate") {
		var annotateDIV = document.getElementById('divCursor');
		var show = false;
		annotateDIV.className = (config.annotateClassName) ? config.annotateClassName : '';
		annotateDIV.style.border = (config.annotateClassName) ? '' : config.annotateBorder;
		annotateDIV.style.padding = (config.annotateClassName) ? '' : config.annotatePadding;
		annotateDIV.style.borderRadius = (config.annotateClassName) ? '' : config.annotateBorderRadius;
		annotateDIV.style.backgroundColor = (config.annotateClassName) ? '' : config.annotateBackgroundColor;
		annotateDIV.style.color = (config.annotateClassName) ? '' : config.annotateFontColor;
		annotateDIV.style.fontFamily = (config.annotateClassName) ? '' : config.annotateFontFamily;
		annotateDIV.style.fontSize = (config.annotateClassName) ? '' : config.annotateFontSize + "pt";
		annotateDIV.style.fontStyle = (config.annotateClassName) ? '' : config.annotateFontStyle;
		annotateDIV.style.zIndex = 999;
		ctx.save();
		ctx.font= annotateDIV.style.fontStyle+" "+ annotateDIV.style.fontSize+" "+annotateDIV.style.fontFamily;
		var rect = ctx.canvas.getBoundingClientRect();
	}
	if (action=="annotate") {
		show=false;
		annotateDIV.style.display = show ? '' : 'none';
	}
	canvas_pos = getMousePos(ctx.canvas, event);
	for (var i = 0; i < jsGraphAnnotate[ctx.ChartNewId]["length"]; i++) {
		if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "ARC") {
			myStatData=jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]];
			distance = Math.sqrt((canvas_pos.x - myStatData.midPosX) * (canvas_pos.x - myStatData.midPosX) + (canvas_pos.y - myStatData.midPosY) * (canvas_pos.y - myStatData.midPosY));
			if (distance > myStatData.int_radius && distance < myStatData.radiusOffset) {
				angle = (Math.acos((canvas_pos.x - myStatData.midPosX) / distance) % (2* Math.PI) + 2*Math.PI) % (2*Math.PI);
				if (canvas_pos.y < myStatData.midPosY) angle = -angle;
				angle = (((angle  + 2 * Math.PI) % (2 * Math.PI)) + 2* Math.PI) % (2* Math.PI) ; 
				myStatData.startAngle=(((myStatData.startAngle  + 2 * Math.PI) % (2 * Math.PI)) + 2* Math.PI) % (2* Math.PI);
				myStatData.endAngle=(((myStatData.endAngle  + 2 * Math.PI) % (2 * Math.PI)) + 2* Math.PI) % (2* Math.PI);
				if(myStatData.endAngle<myStatData.startAngle)myStatData.endAngle+=2 * Math.PI;
				if ((angle > myStatData.startAngle && angle < myStatData.endAngle) || (angle > myStatData.startAngle - 2 * Math.PI && angle < myStatData.endAngle - 2 * Math.PI) || (angle > myStatData.startAngle + 2 * Math.PI && angle < myStatData.endAngle + 2 * Math.PI)) {
					myStatData.graphPosX = canvas_pos.x;
					myStatData.graphPosY = canvas_pos.y;
					onData = true;
					if (action == "annotate") {
						dispString = tmplbis(setOptionValue("ANNOTATELABEL",ctx,data,jsGraphAnnotate[ctx.ChartNewId][i][3],undefined,config.annotateLabel,jsGraphAnnotate[ctx.ChartNewId][i][1],-1,{otherVal:true}), myStatData,config);
						textMsr=ctx.measureTextMultiLine(dispString);
						ctx.restore();
						annotateDIV.innerHTML = dispString;
						show = true;
					} else {
						funct(event, ctx, config, data, myStatData );
					}
					if (action == "annotate") {
						x = bw.ns4 || bw.ns5 ? event.pageX : event.x;
						y = bw.ns4 || bw.ns5 ? event.pageY : event.y;
						if (bw.ie4 || bw.ie5) y = y + eval(scrolled);
						if(config.annotateRelocate && x+fromLeft+textMsr.textWidth > window.innerWidth-rect.left-10) oCursor.moveIt(x + fromLeft-textMsr.textWidth, y + fromTop);
						else oCursor.moveIt(x + fromLeft, y + fromTop);
					}
				}
			}
		} else if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "RECT") {
			myStatData=jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]][jsGraphAnnotate[ctx.ChartNewId][i][2]];
			
			if (canvas_pos.x > Math.min(myStatData.xPosLeft,myStatData.xPosRight) && canvas_pos.x < Math.max(myStatData.xPosLeft,myStatData.xPosRight) && canvas_pos.y < Math.max(myStatData.yPosBottom,myStatData.yPosTop) && canvas_pos.y > Math.min(myStatData.yPosBottom,myStatData.yPosTop)) {
				myStatData.graphPosX = canvas_pos.x;
				myStatData.graphPosY = canvas_pos.y;
				onData = true;
				if (action == "annotate") {
					dispString = tmplbis(setOptionValue("ANNOTATELABEL",ctx,data,jsGraphAnnotate[ctx.ChartNewId][i][3],undefined,config.annotateLabel,jsGraphAnnotate[ctx.ChartNewId][i][1],jsGraphAnnotate[ctx.ChartNewId][i][2],{otherVal:true}), myStatData,config);
					textMsr=ctx.measureTextMultiLine(dispString);
					ctx.restore();
					annotateDIV.innerHTML = dispString;
					show = true;
				} else {
					funct(event, ctx, config, data, myStatData );
				}
				if (action == "annotate") {
					x = bw.ns4 || bw.ns5 ? event.pageX : event.x;
					y = bw.ns4 || bw.ns5 ? event.pageY : event.y;
					if (bw.ie4 || bw.ie5) y = y + eval(scrolled);
					if(config.annotateRelocate && x+fromLeft+textMsr.textWidth > window.innerWidth-rect.left-10) oCursor.moveIt(x + fromLeft-textMsr.textWidth, y + fromTop);
					else oCursor.moveIt(x + fromLeft, y + fromTop);
				}
			}
		} else if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "POINT") {
			myStatData=jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]][jsGraphAnnotate[ctx.ChartNewId][i][2]];
			var distance;
			if(config.detectAnnotateOnFullLine) {
				if(canvas_pos.x < Math.min(myStatData.annotateStartPosX,myStatData.annotateEndPosX)-config.pointHitDetectionRadius || canvas_pos.x > Math.max(myStatData.annotateStartPosX,myStatData.annotateEndPosX)+config.pointHitDetectionRadius || canvas_pos.y < Math.min(myStatData.annotateStartPosY,myStatData.annotateEndPosY)-config.pointHitDetectionRadius || canvas_pos.y > Math.max(myStatData.annotateStartPosY,myStatData.annotateEndPosY)+config.pointHitDetectionRadius) {
					distance=config.pointHitDetectionRadius+1;
				} else { 
					if(typeof myStatData.D1A=="undefined") {
						distance=Math.abs(canvas_pos.x-myStatData.posX);
					} else if(typeof myStatData.D2A=="undefined") {
						distance=Math.abs(canvas_pos.y-myStatData.posY);
					} else {
						var D2B=-myStatData.D2A*canvas_pos.x+canvas_pos.y;
						var g=-(myStatData.D1B-D2B)/(myStatData.D1A-myStatData.D2A);
						var h=myStatData.D2A*g+D2B;
						distance=Math.sqrt((canvas_pos.x - g) * (canvas_pos.x - g) + (canvas_pos.y - h) * (canvas_pos.y - h));
					}
					
				}
								
			} else {
				distance = Math.sqrt((canvas_pos.x - myStatData.posX) * (canvas_pos.x - myStatData.posX) + (canvas_pos.y - myStatData.posY) * (canvas_pos.y - myStatData.posY));
			}
			if (distance < config.pointHitDetectionRadius) {
				myStatData.graphPosX = canvas_pos.x;
				myStatData.graphPosY = canvas_pos.y;
				onData = true;
				if (action == "annotate") {
					dispString = tmplbis(setOptionValue("ANNOTATELABEL",ctx,data,jsGraphAnnotate[ctx.ChartNewId][i][3],undefined,config.annotateLabel,jsGraphAnnotate[ctx.ChartNewId][i][1],jsGraphAnnotate[ctx.ChartNewId][i][2],{otherVal:true}), myStatData,config);
					textMsr=ctx.measureTextMultiLine(dispString);
					ctx.restore();
					annotateDIV.innerHTML = dispString;
					show = true;
				} else {
					funct(event, ctx, config, data, myStatData);
				}
				if (action == "annotate") {
					x = bw.ns4 || bw.ns5 ? event.pageX : event.x;
					y = bw.ns4 || bw.ns5 ? event.pageY : event.y;
					if (bw.ie4 || bw.ie5) y = y + eval(scrolled);
					if(config.annotateRelocate && x+fromLeft+textMsr.textWidth > window.innerWidth-rect.left-10) oCursor.moveIt(x + fromLeft-textMsr.textWidth, y + fromTop);
					else oCursor.moveIt(x + fromLeft, y + fromTop);
				}
			}
		}
		if (action == "annotate") {
			annotateDIV.style.display = show ? '' : 'none';
		}
	}
	if (onData == false && action != "annotate") {
		funct(event, ctx, config, data, null);
	}
};
///////// GRAPHICAL PART OF THE SCRIPT ///////////////////////////////////////////
//Define the global Chart Variable as a class.
window.Chart = function(context) {
	var chart = this;
	//Easing functions adapted from Robert Penner's easing equations
	//http://www.robertpenner.com/easing/
	var animationOptions = {
		linear: function(t) {
			return t;
		},
		easeInQuad: function(t) {
			return t * t;
		},
		easeOutQuad: function(t) {
			return -1 * t * (t - 2);
		},
		easeInOutQuad: function(t) {
			if ((t /= 1 / 2) < 1) return 1 / 2 * t * t;
			return -1 / 2 * ((--t) * (t - 2) - 1);
		},
		easeInCubic: function(t) {
			return t * t * t;
		},
		easeOutCubic: function(t) {
			return 1 * ((t = t / 1 - 1) * t * t + 1);
		},
		easeInOutCubic: function(t) {
			if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t;
			return 1 / 2 * ((t -= 2) * t * t + 2);
		},
		easeInQuart: function(t) {
			return t * t * t * t;
		},
		easeOutQuart: function(t) {
			return -1 * ((t = t / 1 - 1) * t * t * t - 1);
		},
		easeInOutQuart: function(t) {
			if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t;
			return -1 / 2 * ((t -= 2) * t * t * t - 2);
		},
		easeInQuint: function(t) {
			return 1 * (t /= 1) * t * t * t * t;
		},
		easeOutQuint: function(t) {
			return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
		},
		easeInOutQuint: function(t) {
			if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t * t;
			return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
		},
		easeInSine: function(t) {
			return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
		},
		easeOutSine: function(t) {
			return 1 * Math.sin(t / 1 * (Math.PI / 2));
		},
		easeInOutSine: function(t) {
			return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
		},
		easeInExpo: function(t) {
			return (t == 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
		},
		easeOutExpo: function(t) {
			return (t == 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
		},
		easeInOutExpo: function(t) {
			if (t == 0) return 0;
			if (t == 1) return 1;
			if ((t /= 1 / 2) < 1) return 1 / 2 * Math.pow(2, 10 * (t - 1));
			return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
		},
		easeInCirc: function(t) {
			if (t >= 1) return t;
			return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
		},
		easeOutCirc: function(t) {
			return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
		},
		easeInOutCirc: function(t) {
			if ((t /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
			return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
		},
		easeInElastic: function(t) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t == 0) return 0;
			if ((t /= 1) == 1) return 1;
			if (!p) p = 1 * .3;
			if (a < Math.abs(1)) {
				a = 1;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(1 / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
		},
		easeOutElastic: function(t) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t == 0) return 0;
			if ((t /= 1) == 1) return 1;
			if (!p) p = 1 * .3;
			if (a < Math.abs(1)) {
				a = 1;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(1 / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
		},
		easeInOutElastic: function(t) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t == 0) return 0;
			if ((t /= 1 / 2) == 2) return 1;
			if (!p) p = 1 * (.3 * 1.5);
			if (a < Math.abs(1)) {
				a = 1;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(1 / a);
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * .5 + 1;
		},
		easeInBack: function(t) {
			var s = 1.70158;
			return 1 * (t /= 1) * t * ((s + 1) * t - s);
		},
		easeOutBack: function(t) {
			var s = 1.70158;
			return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
		},
		easeInOutBack: function(t) {
			var s = 1.70158;
			if ((t /= 1 / 2) < 1) return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
			return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
		},
		easeInBounce: function(t) {
			return 1 - animationOptions.easeOutBounce(1 - t);
		},
		easeOutBounce: function(t) {
			if ((t /= 1) < (1 / 2.75)) {
				return 1 * (7.5625 * t * t);
			} else if (t < (2 / 2.75)) {
				return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
			} else if (t < (2.5 / 2.75)) {
				return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
			} else {
				return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
			}
		},
		easeInOutBounce: function(t) {
			if (t < 1 / 2) return animationOptions.easeInBounce(t * 2) * .5;
			return animationOptions.easeOutBounce(t * 2 - 1) * .5 + 1 * .5;
		}
	};
	//Variables global to the chart
	var width = context.canvas.width;
	var height = context.canvas.height;
	//High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
	if (window.devicePixelRatio) {
		context.canvas.style.width = width + "px";
		context.canvas.style.height = height + "px";
		context.canvas.height = height * window.devicePixelRatio;
		context.canvas.width = width * window.devicePixelRatio;
		context.scale(window.devicePixelRatio, window.devicePixelRatio);
	};
	this.PolarArea = function(data, options) {
		chart.PolarArea.defaults = {
			inGraphDataShow: false,
			inGraphDataPaddingRadius: 5,
			inGraphDataPaddingAngle: 0,
			inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
			inGraphDataAlign: "off-center", // "right", "center", "left", "off-center" or "to-center"
			inGraphDataVAlign: "off-center", // "bottom", "center", "top", "off-center" or "to-center"
			inGraphDataRotate: 0, // rotateAngle value (0->360) , "inRadiusAxis" or "inRadiusAxisRotateLabels"
			inGraphDataFontFamily: "'Arial'",
			inGraphDataFontSize: 12,
			inGraphDataFontStyle: "normal",
			inGraphDataFontColor: "#666",
			inGraphDataRadiusPosition: 3,
			inGraphDataAnglePosition: 2,
			scaleOverlay: true,
			scaleOverride: false,
			scaleOverride2: false,
			scaleGridLinesStep : 1,
			scaleSteps: null,
			scaleStepWidth: null,
			scaleStartValue: null,
			scaleShowLine: true,
			scaleLineColor: "rgba(0,0,0,.1)",
			scaleLineWidth: 1,
			scaleLineStyle: "solid",
			scaleShowLabels: true,
			scaleShowLabels2: true,
			scaleLabel: "<%=value%>",
			scaleFontFamily: "'Arial'",
			scaleFontSize: 12,
			scaleFontStyle: "normal",
			scaleFontColor: "#666",
			scaleShowLabelBackdrop: true,
			scaleBackdropColor: "rgba(255,255,255,0.75)",
			scaleBackdropPaddingY: 2,
			scaleBackdropPaddingX: 2,
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeStyle: "solid",
			segmentStrokeWidth: 2,
			animation: true,
			animationByData : "ByArc",
			animationSteps: 100,
			animationEasing: "easeOutBounce",
			animateRotate: true,
			animateScale: false,
			onAnimationComplete: null,
			annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
			startAngle: 90
		};
		chart.PolarArea.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.PolarArea.defaults);
		chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptions);
		chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptionsPolarArea);
		var config = (options) ? mergeChartConfig(chart.PolarArea.defaults, options) : chart.PolarArea.defaults;
		return new PolarArea(data, config, context);
	};
	this.Radar = function(data, options) {
		chart.Radar.defaults = {
			inGraphDataShow: false,
			inGraphDataPaddingRadius: 5,
			inGraphDataTmpl: "<%=v3%>",
			inGraphDataAlign: "off-center", // "right", "center", "left", "off-center" or "to-center"
			inGraphDataVAlign: "off-center", // "right", "center", "left", "off-center" or "to-center"
			inGraphDataRotate: 0, // rotateAngle value (0->360) , "inRadiusAxis" or "inRadiusAxisRotateLabels"
			inGraphDataFontFamily: "'Arial'",
			inGraphDataFontSize: 12,
			inGraphDataFontStyle: "normal",
			inGraphDataFontColor: "#666",
			inGraphDataRadiusPosition: 3,
			yAxisMinimumInterval: "none",
			scaleGridLinesStep : 1,
			scaleOverlay: false,
			scaleOverride: false,
			scaleOverride2: false,
			scaleSteps: null,
			scaleStepWidth: null,
			scaleStartValue: null,
			scaleShowLine: true,
			scaleLineColor: "rgba(0,0,0,.1)",
			scaleLineStyle: "solid",
			scaleLineWidth: 1,
			scaleShowLabels: false,
			scaleShowLabels2: true,
			scaleLabel: "<%=value%>",
			scaleFontFamily: "'Arial'",
			scaleFontSize: 12,
			scaleFontStyle: "normal",
			scaleFontColor: "#666",
			scaleShowLabelBackdrop: true,
			scaleBackdropColor: "rgba(255,255,255,0.75)",
			scaleBackdropPaddingY: 2,
			scaleBackdropPaddingX: 2,
			angleShowLineOut: true,
			angleLineColor: "rgba(0,0,0,.1)",
			angleLineStyle: "solid",
			angleLineWidth: 1,
			pointLabelFontFamily: "'Arial'",
			pointLabelFontStyle: "normal",
			pointLabelFontSize: 12,
			pointLabelFontColor: "#666",
			pointDot: true,
			pointDotRadius: 3,
			pointDotStrokeWidth: 1,
			pointDotStrokeStyle:"solid",
			datasetFill: true,
			datasetStrokeWidth: 2,
			datasetStrokeStyle:"solid",
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3%>",
			pointHitDetectionRadius : 10,
			startAngle: 90
		};
		// merge annotate defaults
		chart.Radar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Radar.defaults);
		chart.Radar.defaults = mergeChartConfig(chart.Radar.defaults, charJSPersonalDefaultOptions);
		chart.Radar.defaults = mergeChartConfig(chart.Radar.defaults, charJSPersonalDefaultOptionsRadar);
		var config = (options) ? mergeChartConfig(chart.Radar.defaults, options) : chart.Radar.defaults;
		return new Radar(data, config, context);
	};
	this.Pie = function(data, options) {
		chart.Pie.defaults = {
			inGraphDataShow: false,
			inGraphDataPaddingRadius: 5,
			inGraphDataPaddingAngle: 0,
			inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
			inGraphDataAlign: "off-center", // "right", "center", "left", "off-center" or "to-center"
			inGraphDataVAlign: "off-center", // "bottom", "center", "top", "off-center" or "to-center"
			inGraphDataRotate: 0, // rotateAngle value (0->360) , "inRadiusAxis" or "inRadiusAxisRotateLabels"
			inGraphDataFontFamily: "'Arial'",
			inGraphDataFontSize: 12,
			inGraphDataFontStyle: "normal",
			inGraphDataFontColor: "#666",
			inGraphDataRadiusPosition: 3,
			inGraphDataAnglePosition: 2,
			inGraphDataMinimumAngle : 0,
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeStyle: "solid",
			segmentStrokeWidth: 2,
			animation: true,
			animationByData : false,
			animationSteps: 100,
			animationEasing: "easeOutBounce",
			animateRotate: true,
			animateScale: false,
			onAnimationComplete: null,
			annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
			startAngle: 90,
			radiusScale: 1
		};
		// merge annotate defaults
		chart.Pie.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Pie.defaults);
		chart.Pie.defaults = mergeChartConfig(chart.Pie.defaults, charJSPersonalDefaultOptions);
		chart.Pie.defaults = mergeChartConfig(chart.Pie.defaults, charJSPersonalDefaultOptionsPie);
		var config = (options) ? mergeChartConfig(chart.Pie.defaults, options) : chart.Pie.defaults;
		return new Pie(data, config, context);
	};
	this.Doughnut = function(data, options) {
		chart.Doughnut.defaults = {
			inGraphDataShow: false,
			inGraphDataPaddingRadius: 5,
			inGraphDataPaddingAngle: 0,
			inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
			inGraphDataAlign: "off-center", // "right", "center", "left", "off-center" or "to-center"
			inGraphDataVAlign: "off-center", // "bottom", "middle", "top", "off-center" or "to-center"
			inGraphDataRotate: 0, // rotateAngle value (0->360) , "inRadiusAxis" or "inRadiusAxisRotateLabels"
			inGraphDataFontFamily: "'Arial'",
			inGraphDataFontSize: 12,
			inGraphDataFontStyle: "normal",
			inGraphDataFontColor: "#666",
			inGraphDataRadiusPosition: 3,
			inGraphDataAnglePosition: 2,
		        inGraphDataMinimumAngle : 0,
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeStyle: "solid",
			segmentStrokeWidth: 2,
			percentageInnerCutout: 50,
			animation: true,
			animationByData : false,
			animationSteps: 100,
			animationEasing: "easeOutBounce",
			animateRotate: true,
			animateScale: false,
			onAnimationComplete: null,
			annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
			startAngle: 90,
			radiusScale: 1
		};
		// merge annotate defaults
		chart.Doughnut.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Doughnut.defaults);
		chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptions);
		chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptionsDoughnut);
		var config = (options) ? mergeChartConfig(chart.Doughnut.defaults, options) : chart.Doughnut.defaults;
		return new Doughnut(data, config, context);
	};
	this.Line = function(data, options) {
		chart.Line.defaults = {
			inGraphDataShow: false,
			inGraphDataPaddingX: 3,
			inGraphDataPaddingY: 3,
			inGraphDataTmpl: "<%=v3%>",
			inGraphDataAlign: "left",
			inGraphDataVAlign: "bottom",
			inGraphDataRotate: 0,
			inGraphDataFontFamily: "'Arial'",
			inGraphDataFontSize: 12,
			inGraphDataFontStyle: "normal",
			inGraphDataFontColor: "#666",
			drawXScaleLine: [{
				position: "bottom"
			}],
			scaleOverlay: false,
			scaleOverride: false,
			scaleOverride2: false,
			scaleSteps: null,
			scaleStepWidth: null,
			scaleStartValue: null,
			scaleSteps2: null,
			scaleStepWidth2: null,
			scaleStartValue2: null,
			scaleLabel2 : "<%=value%>",
			scaleLineColor: "rgba(0,0,0,.1)",
			scaleLineStyle: "solid",
			scaleLineWidth: 1,
			scaleShowLabels: true,
			scaleShowLabels2: true,
			scaleLabel: "<%=value%>",
			scaleFontFamily: "'Arial'",
			scaleFontSize: 12,
			scaleFontStyle: "normal",
			scaleFontColor: "#666",
			scaleShowGridLines: true,
			scaleXGridLinesStep: 1,
			scaleYGridLinesStep: 1,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineStyle: "solid",
			scaleGridLineWidth: 1,
			showYAxisMin: true, // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
			rotateLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
			// you can force an integer value between 0 and 180 degres
			logarithmic: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
			logarithmic2: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
			scaleTickSizeLeft: 5,
			scaleTickSizeRight: 5,
			scaleTickSizeBottom: 5,
			scaleTickSizeTop: 5,
			bezierCurve: true,
			bezierCurveTension : 0.4,
			pointDot: true,
			pointDotRadius: 4,
			pointDotStrokeStyle: "solid",
			pointDotStrokeWidth: 2,
			datasetStrokeStyle: "solid",
			datasetStrokeWidth: 2,
			datasetFill: true,
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			extrapolateMissingData: true,
			onAnimationComplete: null,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3%>",
			pointHitDetectionRadius : 10
		};
		// merge annotate defaults
		chart.Line.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Line.defaults);
		chart.Line.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Line.defaults);
		chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptions);
		chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptionsLine);
		var config = (options) ? mergeChartConfig(chart.Line.defaults, options) : chart.Line.defaults;
		return new Line(data, config, context);
	};
	this.StackedBar = function(data, options) {
		chart.StackedBar.defaults = {
			inGraphDataShow: false,
			inGraphDataPaddingX: 0,
			inGraphDataPaddingY: -3,
			inGraphDataTmpl: "<%=v3%>",
			inGraphDataAlign: "center",
			inGraphDataVAlign: "top",
			inGraphDataRotate: 0,
			inGraphDataFontFamily: "'Arial'",
			inGraphDataFontSize: 12,
			inGraphDataFontStyle: "normal",
			inGraphDataFontColor: "#666",
			inGraphDataXPosition: 2,
			inGraphDataYPosition: 3,
			scaleOverlay: false,
			scaleOverride: false,
			scaleOverride2: false,
			scaleSteps: null,
			scaleStepWidth: null,
			scaleStartValue: null,
			scaleLineColor: "rgba(0,0,0,.1)",
			scaleLineStyle: "solid",
			scaleLineWidth: 1,
			scaleShowLabels: true,
			scaleShowLabels2: true,
			scaleLabel: "<%=value%>",
			scaleFontFamily: "'Arial'",
			scaleFontSize: 12,
			scaleFontStyle: "normal",
			scaleFontColor: "#666",
			scaleShowGridLines: true,
			scaleXGridLinesStep: 1,
			scaleYGridLinesStep: 1,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineStyle: "solid",
			scaleGridLineWidth: 1,
			showYAxisMin: true, // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
			rotateLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
			// you can force an integer value between 0 and 180 degres
			scaleTickSizeLeft: 5,
			scaleTickSizeRight: 5,
			scaleTickSizeBottom: 5,
			scaleTickSizeTop: 5,
			pointDot: true,
			pointDotRadius: 4,
			pointDotStrokeStyle: "solid",
			pointDotStrokeWidth: 2,
			barShowStroke: true,
//			barStrokeStyle: "solid",
			barStrokeWidth: 2,
			barValueSpacing: 5,
			barDatasetSpacing: 1,
			spaceBetweenBar : 0,
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
			pointHitDetectionRadius : 10
		};
		// merge annotate defaults
		chart.StackedBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.StackedBar.defaults);
		chart.StackedBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.StackedBar.defaults);
		chart.StackedBar.defaults = mergeChartConfig(chart.StackedBar.defaults, charJSPersonalDefaultOptions);
		chart.StackedBar.defaults = mergeChartConfig(chart.StackedBar.defaults, charJSPersonalDefaultOptionsStackedBar);
		var config = (options) ? mergeChartConfig(chart.StackedBar.defaults, options) : chart.StackedBar.defaults;
		return new StackedBar(data, config, context);
	};
	this.HorizontalStackedBar = function(data, options) {
		chart.HorizontalStackedBar.defaults = {
			inGraphDataShow: false,
			inGraphDataPaddingX: -3,
			inGraphDataPaddingY: 0,
			inGraphDataTmpl: "<%=v3%>",
			inGraphDataAlign: "right",
			inGraphDataVAlign: "middle",
			inGraphDataRotate: 0,
			inGraphDataFontFamily: "'Arial'",
			inGraphDataFontSize: 12,
			inGraphDataFontStyle: "normal",
			inGraphDataFontColor: "#666",
			inGraphDataXPosition: 3,
			inGraphDataYPosition: 2,
			scaleOverlay: false,
			scaleOverride: false,
			scaleOverride2: false,
			scaleSteps: null,
			scaleStepWidth: null,
			scaleStartValue: null,
			scaleLineColor: "rgba(0,0,0,.1)",
			scaleLineStyle: "solid",
			scaleLineWidth: 1,
			scaleShowLabels: true,
			scaleShowLabels2: true,
			scaleLabel: "<%=value%>",
			scaleFontFamily: "'Arial'",
			scaleFontSize: 12,
			scaleFontStyle: "normal",
			scaleFontColor: "#666",
			scaleShowGridLines: true,
			scaleXGridLinesStep: 1,
			scaleYGridLinesStep: 1,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineStyle: "solid",
			scaleGridLineWidth: 1,
			scaleTickSizeLeft: 5,
			scaleTickSizeRight: 5,
			scaleTickSizeBottom: 5,
			scaleTickSizeTop: 5,
			showYAxisMin: true, // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
			rotateLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
			barShowStroke: true,
//			barStrokeStyle: "solid",
			barStrokeWidth: 2,
			barValueSpacing: 5,
			barDatasetSpacing: 1,
			spaceBetweenBar : 0,
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
			reverseOrder: false
		};
		// merge annotate defaults
		chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.HorizontalStackedBar.defaults);
		chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.HorizontalStackedBar.defaults);
		chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.HorizontalStackedBar.defaults, charJSPersonalDefaultOptions);
		chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.HorizontalStackedBar.defaults, charJSPersonalDefaultOptionsHorizontalStackedBar);
		var config = (options) ? mergeChartConfig(chart.HorizontalStackedBar.defaults, options) : chart.HorizontalStackedBar.defaults;
		return new HorizontalStackedBar(data, config, context);
	};
	this.Bar = function(data, options) {
		chart.Bar.defaults = {
			inGraphDataShow: false,
			inGraphDataPaddingX: 0,
			inGraphDataPaddingY: 3,
			inGraphDataTmpl: "<%=v3%>",
			inGraphDataAlign: "center",
			inGraphDataVAlign: "bottom",
			inGraphDataRotate: 0,
			inGraphDataFontFamily: "'Arial'",
			inGraphDataFontSize: 12,
			inGraphDataFontStyle: "normal",
			inGraphDataFontColor: "#666",
			inGraphDataXPosition: 2,
			inGraphDataYPosition: 3,
			scaleOverlay: false,
			scaleOverride: false,
			scaleOverride2: false,
			scaleSteps: null,
			scaleStepWidth: null,
			scaleStartValue: null,
			scaleSteps2: null,
			scaleStepWidth2: null,
			scaleStartValue2: null,
			scaleLineColor: "rgba(0,0,0,.1)",
			scaleLineStyle: "solid",
			scaleLineWidth: 1,
			scaleShowLabels: true,
			scaleShowLabels2: true,
			scaleLabel: "<%=value%>",
			scaleLabel2: "<%=value%>",
			scaleFontFamily: "'Arial'",
			scaleFontSize: 12,
			scaleFontStyle: "normal",
			scaleFontColor: "#666",
			scaleShowGridLines: true,
			scaleXGridLinesStep: 1,
			scaleYGridLinesStep: 1,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineWidth: 1,
			scaleGridLineStyle: "solid",
			showYAxisMin: true, // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
			rotateLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
			// you can force an integer value between 0 and 180 degres
			logarithmic: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
			logarithmic2: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
			scaleTickSizeLeft: 5,
			scaleTickSizeRight: 5,
			scaleTickSizeBottom: 5,
			scaleTickSizeTop: 5,
			barShowStroke: true,
//			barStrokeStyle: "solid",
			barStrokeWidth: 2,
			barValueSpacing: 5,
			barDatasetSpacing: 1,
			barBorderRadius: 0,
			pointDot: true,
			pointDotRadius: 4,
			pointDotStrokeStyle: "solid",
			pointDotStrokeWidth: 2,
			extrapolateMissingData: true,
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			pointDot: true,
			bezierCurve: true,
			bezierCurveTension : 0.4,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
			pointHitDetectionRadius : 10
		};
		// merge annotate defaults
		chart.Bar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Bar.defaults);
		chart.Bar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Bar.defaults);
		chart.Bar.defaults = mergeChartConfig(chart.Bar.defaults, charJSPersonalDefaultOptions);
		chart.Bar.defaults = mergeChartConfig(chart.Bar.defaults, charJSPersonalDefaultOptionsBar);
		var config = (options) ? mergeChartConfig(chart.Bar.defaults, options) : chart.Bar.defaults;
		return new Bar(data, config, context);
	};
	this.HorizontalBar = function(data, options) {
		chart.HorizontalBar.defaults = {
			inGraphDataShow: false,
			inGraphDataPaddingX: 3,
			inGraphDataPaddingY: 0,
			inGraphDataTmpl: "<%=v3%>",
			inGraphDataAlign: "left",
			inGraphDataVAlign: "middle",
			inGraphDataRotate: 0,
			inGraphDataFontFamily: "'Arial'",
			inGraphDataFontSize: 12,
			inGraphDataFontStyle: "normal",
			inGraphDataFontColor: "#666",
			inGraphDataXPosition: 3,
			inGraphDataYPosition: 2,
			scaleOverlay: false,
			scaleOverride: false,
			scaleOverride2: false,
			scaleSteps: null,
			scaleStepWidth: null,
			scaleStartValue: null,
			scaleLineColor: "rgba(0,0,0,.1)",
			scaleLineStyle: "solid",
			scaleLineWidth: 1,
			scaleShowLabels: true,
			scaleShowLabels2: true,
			scaleLabel: "<%=value%>",
			scaleFontFamily: "'Arial'",
			scaleFontSize: 12,
			scaleFontStyle: "normal",
			scaleFontColor: "#666",
			scaleShowGridLines: true,
			scaleXGridLinesStep: 1,
			scaleYGridLinesStep: 1,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineStyle: "solid",
			scaleGridLineWidth: 1,
			scaleTickSizeLeft: 5,
			scaleTickSizeRight: 5,
			scaleTickSizeBottom: 5,
			scaleTickSizeTop: 5,
			showYAxisMin: true, // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
			rotateLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
			barShowStroke: true,
//			barStrokeStyle: "solid",
			barStrokeWidth: 2,
			barValueSpacing: 5,
			barDatasetSpacing: 1,
			barBorderRadius: 0,
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
			reverseOrder: false
		};
		// merge annotate defaults
		chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.HorizontalBar.defaults);
		chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.HorizontalBar.defaults);
		chart.HorizontalBar.defaults = mergeChartConfig(chart.HorizontalBar.defaults, charJSPersonalDefaultOptions);
		chart.HorizontalBar.defaults = mergeChartConfig(chart.HorizontalBar.defaults, charJSPersonalDefaultOptionsHorizontalBar);
		var config = (options) ? mergeChartConfig(chart.HorizontalBar.defaults, options) : chart.HorizontalBar.defaults;
		return new HorizontalBar(data, config, context);
	};
	chart.defaults = {};
	chart.defaults.commonOptions = {
		multiGraph: false,
		clearRect: true, // do not change clearRect options; for internal use only
		dynamicDisplay: false,
		graphSpaceBefore: 5,
		graphSpaceAfter: 5,
		canvasBorders: false,
		canvasBackgroundColor: "none",
		canvasBordersWidth: 3,
		canvasBordersStyle: "solid",
		canvasBordersColor: "black",
		zeroValue : 0.0000000001,
		graphTitle: "",
		graphTitleFontFamily: "'Arial'",
		graphTitleFontSize: 24,
		graphTitleFontStyle: "bold",
		graphTitleFontColor: "#666",
		graphTitleSpaceBefore: 5,
		graphTitleSpaceAfter: 5,
		graphSubTitle: "",
		graphSubTitleFontFamily: "'Arial'",
		graphSubTitleFontSize: 18,
		graphSubTitleFontStyle: "normal",
		graphSubTitleFontColor: "#666",
		graphSubTitleSpaceBefore: 5,
		graphSubTitleSpaceAfter: 5,
		footNote: "",
		footNoteFontFamily: "'Arial'",
		footNoteFontSize: 8,
		footNoteFontStyle: "bold",
		footNoteFontColor: "#666",
		footNoteSpaceBefore: 5,
		footNoteSpaceAfter: 5,
		legend : false,
		showSingleLegend: false,
		maxLegendCols : 999,
		legendPosY :4,
		legendPosX : -2, 
		legendFontFamily: "'Arial'",
		legendFontSize: 12,
		legendFontStyle: "normal",
		legendFontColor: "#666",
		legendBlockSize: 15,
		legendBorders: true,
		legendBordersStyle: "solid",
		legendBordersWidth: 1,
		legendBordersColors: "#666",
		legendBordersSpaceBefore: 5,
		legendBordersSpaceAfter: 5,
		legendBordersSpaceLeft: 5,
		legendBordersSpaceRight: 5,
		legendSpaceBeforeText: 5,
		legendSpaceAfterText: 5,
		legendSpaceLeftText: 5,
		legendSpaceRightText: 5,
		legendSpaceBetweenTextVertical: 5,
		legendSpaceBetweenTextHorizontal: 5,
		legendSpaceBetweenBoxAndText: 5,
		legendFillColor : "rgba(0,0,0,0)",
		legendXPadding : 0,
		legendYPadding : 0,
		annotateDisplay: false,
		annotateRelocate: false,
		savePng: false,
		savePngOutput: "NewWindow", // Allowed values : "NewWindow", "CurrentWindow", "Save"
		savePngFunction: "mousedown right",
		savePngBackgroundColor: 'WHITE',
		annotateFunction: "mousemove",
		annotateFontFamily: "'Arial'",
		annotateBorder: 'none',
		annotateBorderRadius: '2px',
		annotateBackgroundColor: 'rgba(0,0,0,0.8)',
		annotateFontSize: 12,
		annotateFontColor: 'white',
		annotateFontStyle: "normal",
		annotatePadding: "3px",
		annotateClassName: "",
		crossText: [""],
		crossTextIter: ["all"],
		crossTextOverlay: [true],
		crossTextFontFamily: ["'Arial'"],
		crossTextFontSize: [12],
		crossTextFontStyle: ["normal"],
		crossTextFontColor: ["rgba(220,220,220,1)"],
		crossTextRelativePosX: [2],
		crossTextRelativePosY: [2],
		crossTextBaseline: ["middle"],
		crossTextAlign: ["center"],
		crossTextPosX: [0],
		crossTextPosY: [0],
		crossTextAngle: [0],
		crossTextFunction: null,
		crossImage: [undefined],
		crossImageIter: ["all"],
		crossImageOverlay: [true],
		crossImageRelativePosX: [2],
		crossImageRelativePosY: [2],
		crossImageBaseline: ["middle"],
		crossImageAlign: ["center"],
		crossImagePosX: [0],
		crossImagePosY: [0],
		crossImageAngle: [0],
		spaceTop: 0,
		spaceBottom: 0,
		spaceRight: 0,
		spaceLeft: 0,
		decimalSeparator: ".",
		thousandSeparator: "",
		roundNumber: "none",
		roundPct: -1,
		templatesOpenTag : "<%=",
		templatesCloseTag : "%>",
		fmtV1: "none",
		fmtV2: "none",
		fmtV3: "none",
		fmtV4: "none",
		fmtV5: "none",
		fmtV6: "none",
		fmtV6T: "none",
		fmtV7: "none",
		fmtV8: "none",
		fmtV8T: "none",
		fmtV9: "none",
		fmtV10: "none",
		fmtV11: "none",
		fmtV12: "none",
		fmtV13: "none",
		fmtXLabel: "none",
		fmtYLabel: "none",
		fmtYLabel2: "none",
		fmtLegend: "none",
		animationStartValue: 0,
		animationStopValue: 1,
		animationCount: 1,
		animationPauseTime: 5,
		animationBackward: false,
		animationStartWithDataset: 1,
		animationStartWithData: 1,
		animationLeftToRight: false,
		animationByDataset: false,
		defaultStrokeColor: "rgba(220,220,220,1)",
		defaultFillColor: "rgba(220,220,220,0.5)",
		defaultLineWidth : 2,
		graphMaximized: false,
		mouseDownRight: null,
		mouseDownLeft: null,
		mouseDownMiddle: null,
		mouseMove: null,
		mouseOut: null,
		mouseWheel : null,
		savePngName: "canvas",
		responsive : false,
		responsiveMinWidth : 0,
		responsiveMinHeight : 0,
		responsiveMaxWidth : 9999999,
		responsiveMaxHeight : 9999999,
		maintainAspectRatio: true,
		pointMarker : "circle"    // "circle","cross","plus","diamond","triangle","square"
	};
	chart.defaults.xyAxisCommonOptions = {
		yAxisMinimumInterval: "none",
		yAxisMinimumInterval2: "none",
		yScaleLabelsMinimumWidth: 0,
		xScaleLabelsMinimumWidth: 0,
		yAxisLeft: true,
		yAxisRight: false,
		xAxisBottom: true,
		xAxisTop: false,
		xAxisSpaceBetweenLabels: 5,
		fullWidthGraph: false,
		yAxisLabel: "",
		yAxisLabel2: "",
		yAxisFontFamily: "'Arial'",
		yAxisFontSize: 16,
		yAxisFontStyle: "normal",
		yAxisFontColor: "#666",
		yAxisLabelSpaceRight: 5,
		yAxisLabelSpaceLeft: 5,
		yAxisSpaceRight: 5,
		yAxisSpaceLeft: 5,
		xAxisLabel: "",
		xAxisFontFamily: "'Arial'",
		xAxisFontSize: 16,
		xAxisFontStyle: "normal",
		xAxisFontColor: "#666",
		xAxisLabelSpaceBefore: 5,
		xAxisLabelSpaceAfter: 5,
		xAxisSpaceBefore: 5,
		xAxisSpaceAfter: 5,
		yAxisUnit: "",
		yAxisUnit2: "",
		yAxisUnitFontFamily: "'Arial'",
		yAxisUnitFontSize: 8,
		yAxisUnitFontStyle: "normal",
		yAxisUnitFontColor: "#666",
		yAxisUnitSpaceBefore: 5,
		yAxisUnitSpaceAfter: 5
	};
	var clear = function(c) {
		c.clearRect(0, 0, width, height);
	};

	function init_and_start(ctx,data,config) {
	
		if (typeof ctx.ChartNewId === typeof undefined) {
			ctx.runanimationcompletefunction=true;
			var cvdate = new Date();
			var cvmillsec = cvdate.getTime();
			ctx.ChartNewId = ctx.tpchart + '_' + cvmillsec;
			ctx._eventListeners = {};
		}
		if (!dynamicFunction(data, config, ctx)) { 
	        	if(config.responsive && typeof ctx.firstPass == "undefined") { if(!config.multiGraph) { addResponsiveChart(ctx.ChartNewId,ctx,data,config); } }
			return false; 
		}
        	if(config.responsive && typeof ctx.firstPass == "undefined") {
        		if(!config.multiGraph) {
				addResponsiveChart(ctx.ChartNewId,ctx,data,config);
        			subUpdateChart(ctx,data,config);
        			return false;
        		} else { ctx.firstPass=1; }
		} 

		if (typeof jsGraphAnnotate[ctx.ChartNewId] == "undefined") jsGraphAnnotate[ctx.ChartNewId] = new Array();
		else if (!config.multiGraph) clearAnnotate(ctx.ChartNewId);

		defMouse(ctx, data, config);

		setRect(ctx, config);

		return true;
	} ;

	var PolarArea = function(data, config, ctx) {
		var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, msr, midPosX, midPosY;
		ctx.tpchart="PolarArea";
		
	        if (!init_and_start(ctx,data,config)) return;
		var statData=initPassVariableData_part1(data,config,ctx);

		valueBounds = getValueBounds();

		config.logarithmic = false;
		config.logarithmic2 = false;

		//Check and set the scale
		labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
		if (!config.scaleOverride) {
			calculatedScale = calculateScale(1, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
			msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, false, false, false, true, "PolarArea");
		} else {
			var scaleStartValue= setOptionValue("SCALESTARTVALUE",ctx,data,statData,undefined,config.scaleStartValue,-1,-1,{nullValue : true} );
			var scaleSteps =setOptionValue("SCALESTEPS",ctx,data,statData,undefined,config.scaleSteps,-1,-1,{nullValue : true} );
			var scaleStepWidth = setOptionValue("SCALESTEPWIDTH",ctx,data,statData,undefined,config.scaleStepWidth,-1,-1,{nullValue : true} );

			calculatedScale = {
				steps: scaleSteps,
				stepValue: scaleStepWidth,
				graphMin: scaleStartValue,
				graphMax: scaleStartValue + scaleSteps * scaleStepWidth,
				labels: []
			}
			populateLabels(1, config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, scaleStartValue, calculatedScale.graphMax, scaleStepWidth);
			msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, false, false, false, true, "PolarArea");
		}

		midPosX = msr.leftNotUsableSize + (msr.availableWidth / 2);
		midPosY = msr.topNotUsableSize + (msr.availableHeight / 2);
		scaleHop = Math.floor(((Min([msr.availableHeight, msr.availableWidth]) / 2) - 5) / calculatedScale.steps);
		//Wrap in an animation loop wrapper
 		if(scaleHop > 0) {
			initPassVariableData_part2(statData,data,config,ctx,{midPosX : midPosX,midPosY : midPosY,int_radius : 0,ext_radius : scaleHop*calculatedScale.steps, calculatedScale : calculatedScale, scaleHop : scaleHop});
			animationLoop(config, drawScale, drawAllSegments, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPosX, midPosY, midPosX - ((Min([msr.availableHeight, msr.availableWidth]) / 2) - 5), midPosY + ((Min([msr.availableHeight, msr.availableWidth]) / 2) - 5), data);
		} else {
			testRedraw(ctx,data,config);
		}

		function drawAllSegments(animationDecimal) {

			for (var i = 0; i < data.length; i++) {
				var	scaleAnimation = 1,
					rotateAnimation = 1;
                	
				if (config.animation) {
					if (config.animateScale) {
						scaleAnimation = animationDecimal;
					}
					if (config.animateRotate) {
						rotateAnimation = animationDecimal;
					}
				}
				correctedRotateAnimation = animationCorrection(rotateAnimation, data, config, i, -1, 0).mainVal;
				if (!(typeof(data[i].value) == 'undefined')) {
					ctx.beginPath();
					if(config.animationByData == "ByArc") {
						endAngle=statData[i].startAngle+correctedRotateAnimation*statData[i].segmentAngle;
						ctx.arc(midPosX, midPosY, scaleAnimation * statData[i].radiusOffset, statData[i].startAngle, endAngle, false);
					} else if(config.animationByData) {
						if(statData[i].startAngle-statData[i].firstAngle < correctedRotateAnimation*2*Math.PI ) {
							endAngle=statData[i].endAngle;
							if((statData[i].endAngle-statData[i].firstAngle)> correctedRotateAnimation*2*Math.PI) endAngle=statData[i].firstAngle+correctedRotateAnimation*2*Math.PI;							
							ctx.arc(midPosX, midPosY, scaleAnimation * statData[i].radiusOffset, statData[i].startAngle, endAngle, false);
							
						}
						else continue;
					} else {
						ctx.arc(midPosX, midPosY, scaleAnimation * statData[i].radiusOffset, statData[i].firstAngle+correctedRotateAnimation * (statData[i].startAngle-statData[i].firstAngle), statData[i].firstAngle+correctedRotateAnimation * (statData[i].endAngle-statData[i].firstAngle));
					}
					ctx.lineTo(midPosX, midPosY);
					ctx.closePath();
					ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data[i].color,config.defaultFillColor,i,-1,{animationDecimal: animationDecimal, scaleAnimation : scaleAnimation} );
					ctx.fill();
					if (config.segmentShowStroke) {
						ctx.strokeStyle = config.segmentStrokeColor;
						ctx.lineWidth = config.segmentStrokeWidth;
						ctx.setLineDash(lineStyleFn(setOptionValue("SEGMENTSTROKESTYLE",ctx,data,statData,data[i].segmentStrokeStyle,config.segmentStrokeStyle,i,-1,{animationDecimal: animationDecimal, scaleAnimation : scaleAnimation} )));
						ctx.stroke();
						ctx.setLineDash([]);
					}
				}
			}


			if (animationDecimal >= config.animationStopValue) {
				for (var i = 0; i < data.length; i++) {
					if (typeof(data[i].value) == 'undefined') continue;
					if (setOptionValue("ANNOTATEDISPLAY",ctx,data,statData,undefined,config.annotateDisplay,i,-1,{nullValue : true})) {
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["ARC", i, -1,statData];
					}
					if (setOptionValue("INGRAPHDATASHOW",ctx,data,statData,undefined,config.inGraphDataShow,i,-1,{nullValue : true})) {
						if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 1) posAngle = statData[i].realStartAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 2) posAngle = (2*statData[i].realStartAngle - statData[i].segmentAngle) / 2 + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 3) posAngle = statData[i].realStartAngle - statData[i].segmentAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 1) labelRadius = 0 + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						else if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 2) labelRadius = statData[i].radiusOffset / 2 + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						else if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 3) labelRadius = statData[i].radiusOffset + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						else if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 4) labelRadius = scaleHop * calculatedScale.steps + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						ctx.save()
						if (setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  }) == "off-center") {
							if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2) ctx.textAlign = "left";
							else ctx.textAlign = "right";
						} else if (setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  }) == "to-center") {
							if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2) ctx.textAlign = "right";
							else ctx.textAlign = "left";
						} else ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  });
						if (setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} ) == "off-center") {
							if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "top";
							else ctx.textBaseline = "bottom";
						} else if (setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} ) == "to-center") {
							if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "bottom";
							else ctx.textBaseline = "top";
						} else ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} );
						ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,-1,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,-1,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,-1,{nullValue : true} );
						ctx.fillStyle = setOptionValue("INGRAPHDATAFONTCOLOR",ctx,data,statData,undefined,config.inGraphDataFontColor,i,-1,{nullValue : true} );
						var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,-1,{nullValue : true} ), statData[i],config);
						ctx.translate(midPosX + labelRadius * Math.cos(posAngle), midPosY - labelRadius * Math.sin(posAngle));
						if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis") ctx.rotate(2 * Math.PI - posAngle);
						else if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxisRotateLabels") {
							if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (posAngle + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2) ctx.rotate(3 * Math.PI - posAngle);
							else ctx.rotate(2 * Math.PI - posAngle);
						} else ctx.rotate(setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) * (Math.PI / 180));
						ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,-1,{nullValue : true} ), true);
						ctx.restore();
					}
				}
			}
			if(msr.legendMsr.dispLegend)drawLegend(msr.legendMsr,data,config,ctx,"PolarArea");
		};

		function drawScale() {
			for (var i = 0; i < calculatedScale.steps; i++) {
				if (config.scaleShowLine && (i+1) % config.scaleGridLinesStep==0) {
					ctx.beginPath();
					ctx.arc(midPosX, midPosY, scaleHop * (i + 1), 0, (Math.PI * 2), true);
					ctx.strokeStyle = config.scaleLineColor;
					ctx.lineWidth = config.scaleLineWidth;
					ctx.setLineDash(lineStyleFn(config.scaleLineStyle));

					ctx.stroke();
					ctx.setLineDash([]);
				}
				if (config.scaleShowLabels) {
					ctx.textAlign = "center";
					ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
					var label = calculatedScale.labels[i + 1];
					if (config.scaleShowLabelBackdrop) {
						var textWidth = ctx.measureTextMultiLine(label, config.scaleFontSize).textWidth;
						ctx.fillStyle = config.scaleBackdropColor;
						ctx.beginPath();
						ctx.rect(
							Math.round(midPosX - textWidth / 2 - config.scaleBackdropPaddingX), //X
							Math.round(midPosY - (scaleHop * (i + 1)) - config.scaleFontSize * 0.5 - config.scaleBackdropPaddingY), //Y
							Math.round(textWidth + (config.scaleBackdropPaddingX * 2)), //Width
							Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY * 2)) //Height
						);
						ctx.fill();
					}
					ctx.textBaseline = "middle";
					ctx.fillStyle = config.scaleFontColor;
					ctx.fillTextMultiLine(label, midPosX, midPosY - (scaleHop * (i + 1)), ctx.textBaseline, config.scaleFontSize,true);
				}
			}
		};

		function getValueBounds() {
			var upperValue = -Number.MAX_VALUE;
			var lowerValue = Number.MAX_VALUE;
			for (var i = 0; i < data.length; i++) {
				if(typeof data[i].value == "undefined") continue;
				if (1 * data[i].value > upperValue) {
					upperValue = 1 * data[i].value;
				}
				if (1 * data[i].value < lowerValue) {
					lowerValue = 1 * data[i].value;
				}
			};
			if(upperValue<lowerValue){upperValue=0;lowerValue=0;}
			if (Math.abs(upperValue - lowerValue) < config.zeroValue) {
				if(Math.abs(upperValue)< config.zeroValue) upperValue = .9;
				if(upperValue>0) {
					upperValue=upperValue*1.1;
					lowerValue=lowerValue*0.9;
				} else {
					upperValue=upperValue*0.9;
					lowerValue=lowerValue*1.1;
				}
			}
			if(typeof config.graphMin=="function") lowerValue= setOptionValue("GRAPHMIN",ctx,data,statData,undefined,config.graphMin,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
			if(typeof config.graphMax=="function") upperValue= setOptionValue("GRAPHMAX",ctx,data,statData,undefined,config.graphMax,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMax)) upperValue = config.graphMax;
			var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
			return {
				maxValue: upperValue,
				minValue: lowerValue,
				maxSteps: maxSteps,
				minSteps: minSteps
			};
		};
	};
	var Radar = function(data, config, ctx) {
		var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, msr, midPosX, midPosY;

		ctx.tpchart="Radar";
	        if (!init_and_start(ctx,data,config)) return;
		var statData=initPassVariableData_part1(data,config,ctx);

		valueBounds = getValueBounds();

		config.logarithmic = false;
		config.logarithmic2 = false;
		//If no labels are defined set to an empty array, so referencing length for looping doesn't blow up.
		if (!data.labels) data.labels = [];
		//Check and set the scale
		labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
		if (!config.scaleOverride) {
			calculatedScale = calculateScale(1, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
			msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, false, false, true, config.datasetFill, "Radar");
		} else {
			var scaleStartValue= setOptionValue("SCALESTARTVALUE",ctx,data,statData,undefined,config.scaleStartValue,-1,-1,{nullValue : true} );
			var scaleSteps =setOptionValue("SCALESTEPS",ctx,data,statData,undefined,config.scaleSteps,-1,-1,{nullValue : true} );
			var scaleStepWidth = setOptionValue("SCALESTEPWIDTH",ctx,data,statData,undefined,config.scaleStepWidth,-1,-1,{nullValue : true} );
			calculatedScale = {
				steps: scaleSteps,
				stepValue: scaleStepWidth,
				graphMin: scaleStartValue,
				graphMax: scaleStartValue + scaleSteps * scaleStepWidth,
				labels: []
			}
			populateLabels(1, config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, scaleStartValue, calculatedScale.graphMax, scaleStepWidth);
			msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, false, false, true, config.datasetFill, "Radar");
		}

		calculateDrawingSizes();
		midPosY = msr.topNotUsableSize + (msr.availableHeight / 2);
		scaleHop = maxSize / (calculatedScale.steps);
		//Wrap in an animation loop wrapper
		initPassVariableData_part2(statData,data,config,ctx,{midPosX : midPosX, midPosY : midPosY, calculatedScale: calculatedScale, scaleHop: scaleHop, maxSize:maxSize});
		animationLoop(config, drawScale, drawAllDataPoints, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPosX, midPosY, midPosX - maxSize, midPosY + maxSize, data);
		//Radar specific functions.
		function drawAllDataPoints(animationDecimal) {
			var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
			ctx.save();
			//We accept multiple data sets for radar charts, so show loop through each set
			for (var i = 0; i < data.datasets.length; i++) {
				var fPt = -1;
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					var currentAnimPc = animationCorrection(animationDecimal, data, config, i, j, 1).animVal;
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						if (fPt == -1) {
							ctx.beginPath();
							ctx.moveTo(midPosX + currentAnimPc * statData[i][j].offsetX, midPosY - currentAnimPc * statData[i][j].offsetY);
							fPt = j;
						} else {
							ctx.lineTo(midPosX + currentAnimPc * statData[i][j].offsetX, midPosY - currentAnimPc * statData[i][j].offsetY);
						}
					}
				}
				ctx.closePath();
				if (config.datasetFill) {
					ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data.datasets[i].fillColor,config.defaultFillColor,i,-1,{animationValue : currentAnimPc, midPosX : statData[i][0].midPosX, midPosY : statData[i][0].midPosY, ext_radius : (config.animationLeftToRight ? 1 : currentAnimPc) * (statData[i][0].calculated_offset_max)} );
				} else ctx.fillStyle = "rgba(0,0,0,0)";

				ctx.strokeStyle=setOptionValue("STROKECOLOR",ctx,data,statData,data.datasets[i].strokeColor,config.defaultStrokeColor,i,-1,{nullvalue : null} );

				ctx.lineWidth = config.datasetStrokeWidth;
				ctx.fill();
//				ctx.setLineDash(lineStyleFn(config.datasetStrokeStyle));
				ctx.setLineDash(lineStyleFn(setOptionValue("LINEDASH",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
				ctx.stroke();
				ctx.setLineDash([]);
				if (config.pointDot && (!config.animationLeftToRight || (config.animationLeftToRight && animationDecimal >= 1))) {
					ctx.beginPath();
					ctx.fillStyle=setOptionValue("MARKERFILLCOLOR",ctx,data,statData,data.datasets[i].pointColor,config.defaultStrokeColor,i,-1,{nullvalue: true} );
					ctx.strokeStyle=setOptionValue("MARKERSTROKESTYLE",ctx,data,statData,data.datasets[i].pointStrokeColor,config.defaultStrokeColor,i,-1,{nullvalue: true} );
					ctx.lineWidth=setOptionValue("MARKERLINEWIDTH",ctx,data,statData,data.datasets[i].pointDotStrokeWidth,config.pointDotStrokeWidth,i,-1,{nullvalue: true} );

					for (var k = 0; k < data.datasets[i].data.length; k++) {
						if (!(typeof(data.datasets[i].data[k]) == 'undefined')) {
							ctx.beginPath();
							var markerShape=setOptionValue("MARKERSHAPE",ctx,data,statData,data.datasets[i].markerShape,config.markerShape,i,j,{nullvalue: true} );
							var markerRadius=setOptionValue("MARKERRADIUS",ctx,data,statData,data.datasets[i].pointDotRadius,config.pointDotRadius,i,j,{nullvalue: true} );
							var markerStrokeStyle=setOptionValue("MARKERSTROKESTYLE",ctx,data,statData,data.datasets[i].pointDotStrokeStyle,config.pointDotStrokeStyle,i,j,{nullvalue: true} );
							drawMarker(ctx,midPosX + currentAnimPc * statData[i][k].offsetX, midPosY - currentAnimPc * statData[i][k].offsetY, markerShape,markerRadius,markerStrokeStyle);							
						}
					}
				}
			}
			ctx.restore();
			if (animationDecimal >= config.animationStopValue) {
				for (var i = 0; i < data.datasets.length; i++) {
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						if (setOptionValue("ANNOTATEDISPLAY",ctx,data,statData,undefined,config.annotateDisplay,i,j,{nullValue : true})) {
							jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["POINT", i,j,statData];
						}
						if(setOptionValue("INGRAPHDATASHOW",ctx,data,statData,undefined,config.inGraphDataShow,i,j,{nullValue : true})) {


							ctx.save();
							ctx.beginPath();
							ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  });
							ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} );
							if (setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  }) == "off-center") {
								if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis" || (config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) <= Math.PI / 2) ctx.textAlign = "left";
								else ctx.textAlign = "right";
							} else if (setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  }) == "to-center") {
								if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis" || (config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) < Math.PI / 2) ctx.textAlign = "right";
								else ctx.textAlign = "left";
							} else ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  });
							if (setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} ) == "off-center") {
								if ((config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "bottom";
								else ctx.textBaseline = "top";
							} else if (setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} ) == "to-center") {
								if ((config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "top";
								else ctx.textBaseline = "bottom";
							} else ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} );
							ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,-1,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,-1,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,-1,{nullValue : true} );
							ctx.fillStyle = setOptionValue("INGRAPHDATAFONTCOLOR",ctx,data,statData,undefined,config.inGraphDataFontColor,i,-1,{nullValue : true} );
							var radiusPrt;
							if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 1) radiusPrt = 0 + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
							else if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 2) radiusPrt = (statData[i][j].calculated_offset) / 2 + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
							else if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 3) radiusPrt = (statData[i][j].calculated_offset) + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
							if(statData[i][j].calculated_offset>0) {
								ctx.translate(midPosX + statData[i][j].offsetX * (radiusPrt/statData[i][j].calculated_offset), midPosY - statData[i][j].offsetY * (radiusPrt/statData[i][j].calculated_offset));
							} else {
								ctx.translate(midPosX, midPosY);
							}
							if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis") ctx.rotate(j * rotationDegree);
							else if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxisRotateLabels") {
								if ((j * rotationDegree + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (j * rotationDegree + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2) ctx.rotate(3 * Math.PI + j * rotationDegree);
								else ctx.rotate(2 * Math.PI + j * rotationDegree);
							} else ctx.rotate(setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) * (Math.PI / 180));
							var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,-1,{nullValue : true} ), statData[i][j],config);
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,-1,{nullValue : true} ),true);
							ctx.restore();
						}
					}
				}
			}
			if(msr.legendMsr.dispLegend)drawLegend(msr.legendMsr,data,config,ctx,"Radar");
		};

		function drawScale() {
			var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
			ctx.save();
			ctx.translate(midPosX, midPosY);
			ctx.rotate((90 - config.startAngle) * Math.PI / 180);
			if (config.angleShowLineOut) {
				ctx.strokeStyle = config.angleLineColor;
				ctx.lineWidth = config.angleLineWidth;
				for (var h = 0; h < data.datasets[0].data.length; h++) {
					ctx.rotate(rotationDegree);
					ctx.beginPath();
					ctx.moveTo(0, 0);
					ctx.lineTo(0, -maxSize);
//					ctx.setLineDash(lineStyleFn(config.angleLineStyle));
					ctx.setLineDash(lineStyleFn(setOptionValue("ANGLELINESTYLE",ctx,data,statData,undefined,config.angleLineStyle,h,-1,{nullValue : true} )));
					ctx.stroke();
					ctx.setLineDash([]);
				}
			}
			for (var i = 0; i < calculatedScale.steps; i++) {
				ctx.beginPath();
				if (config.scaleShowLine && (i+1) % config.scaleGridLinesStep == 0 ) {
					ctx.strokeStyle = config.scaleLineColor;
					ctx.lineWidth = config.scaleLineWidth;
					ctx.moveTo(0, -scaleHop * (i + 1));
					for (var j = 0; j < data.datasets[0].data.length; j++) {
						ctx.rotate(rotationDegree);
						ctx.lineTo(0, -scaleHop * (i + 1));
					}
					ctx.closePath();
					ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
					ctx.stroke();
					ctx.setLineDash([]);
				}
			}
			ctx.rotate(-(90 - config.startAngle) * Math.PI / 180);
			if (config.scaleShowLabels) {
				for (var i = 0; i < calculatedScale.steps; i++) {
					ctx.textAlign = 'center';
					ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
					ctx.textBaseline = "middle";
					if (config.scaleShowLabelBackdrop) {
						var textWidth = ctx.measureTextMultiLine(calculatedScale.labels[i + 1], config.scaleFontSize).textWidth;
						ctx.fillStyle = config.scaleBackdropColor;
						ctx.beginPath();
						ctx.rect(
							Math.round(Math.cos(config.startAngle * Math.PI / 180) * (scaleHop * (i + 1)) - textWidth / 2 - config.scaleBackdropPaddingX), //X
							Math.round((-Math.sin(config.startAngle * Math.PI / 180) * scaleHop * (i + 1)) - config.scaleFontSize * 0.5 - config.scaleBackdropPaddingY), //Y
							Math.round(textWidth + (config.scaleBackdropPaddingX * 2)), //Width
							Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY * 2)) //Height
						);
						ctx.fill();
					}
					ctx.fillStyle = config.scaleFontColor;
					ctx.fillTextMultiLine(calculatedScale.labels[i + 1], Math.cos(config.startAngle * Math.PI / 180) * (scaleHop * (i + 1)), -Math.sin(config.startAngle * Math.PI / 180) * scaleHop * (i + 1), ctx.textBaseline, config.scaleFontSize,true);
				}
			}
			for (var k = 0; k < data.labels.length; k++) {
				ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize + "px " + config.pointLabelFontFamily;
				ctx.fillStyle = config.pointLabelFontColor;
				var opposite = Math.sin((90 - config.startAngle) * Math.PI / 180 + rotationDegree * k) * (maxSize + config.pointLabelFontSize);
				var adjacent = Math.cos((90 - config.startAngle) * Math.PI / 180 + rotationDegree * k) * (maxSize + config.pointLabelFontSize);
				var vangle = (90 - config.startAngle) * Math.PI / 180 + rotationDegree * k;
				while (vangle < 0) vangle = vangle + 2 * Math.PI;
				while (vangle > 2 * Math.PI) vangle = vangle - 2 * Math.PI;
				if (vangle == Math.PI || vangle == 0) {
					ctx.textAlign = "center";
				} else if (vangle > Math.PI) {
					ctx.textAlign = "right";
				} else {
					ctx.textAlign = "left";
				}
				ctx.textBaseline = "middle";
				ctx.fillTextMultiLine(data.labels[k], opposite, -adjacent, ctx.textBaseline, config.pointLabelFontSize,true);
			}
			ctx.restore();
		};

		function calculateDrawingSizes() {
			var midX, mxlb, maxL, maxR, iter, nbiter, prevMaxSize, prevMidX;
			var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
			var rotateAngle = config.startAngle * Math.PI / 180;
			// Compute range for Mid Point of graph
			ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize + "px " + config.pointLabelFontFamily;
			if (!config.graphMaximized) {
				maxR = msr.availableWidth / 2;
				maxL = msr.availableWidth / 2;
				nbiter = 1;
			} else {
				maxR = msr.availableWidth / 2;
				maxL = msr.availableWidth / 2;
				nbiter = 40;
				for (var i = 0; i < data.labels.length; i++) {
					var textMeasurement = ctx.measureTextMultiLine(data.labels[i], config.scaleFontSize).textWidth + ctx.measureTextMultiLine(data.labels[i], config.scaleFontSize).textHeight;
					mxlb = (msr.availableWidth - textMeasurement) / (1 + Math.abs(Math.cos(rotateAngle)));
					if ((rotateAngle < Math.PI / 2 && rotateAngle > -Math.PI / 2) || rotateAngle > 3 * Math.PI / 2) {
						if (mxlb < maxR) maxR = mxlb;
					} else if (Math.cos(rotateAngle) != 0) {
						if (mxlb < maxL) maxL = mxlb;
					}
					rotateAngle -= rotationDegree;
				}
			}
			// compute max Radius and midPoint in that range
			prevMaxSize = 0;
			prevMidX = 0;
			midPosX = maxR + msr.rightNotUsableSize;
			for (midX = maxR, iter = 0; iter < nbiter; ++iter, midX += (msr.availableWidth - maxL - maxR) / nbiter) {
				maxSize = Max([midX, msr.availableWidth - midX]);
				var rotateAngle = config.startAngle * Math.PI / 180;
				mxlb = msr.available;
				for (var i = 0; i < data.labels.length; i++) {
					var textMeasurement = ctx.measureTextMultiLine(data.labels[i], config.scaleFontSize).textWidth + ctx.measureTextMultiLine(data.labels[i], config.scaleFontSize).textHeight;
					if ((rotateAngle < Math.PI / 2 && rotateAngle > -Math.PI / 2) || rotateAngle > 3 * Math.PI / 2) {
						mxlb = ((msr.availableWidth - midX) - textMeasurement) / Math.abs(Math.cos(rotateAngle));
					} else if (Math.cos(rotateAngle != 0)) {
						mxlb = (midX - textMeasurement) / Math.abs(Math.cos(rotateAngle));
					}
					if (mxlb < maxSize) maxSize = mxlb;
					if (Math.sin(rotateAngle) * msr.availableHeight / 2 > msr.availableHeight / 2 - config.scaleFontSize * 2) {
						mxlb = Math.sin(rotateAngle) * msr.availableHeight / 2 - 1.5 * config.scaleFontSize;
						if (mxlb < maxSize) maxSize = mxlb;
					}
					rotateAngle -= rotationDegree;
				}
				if (maxSize > prevMaxSize) {
					prevMaxSize = maxSize;
					midPosX = midX + msr.rightNotUsableSize;
				}
			}
			maxSize = prevMaxSize - config.scaleFontSize / 2;
			//If the label height is less than 5, set it to 5 so we don't have lines on top of each other.
			labelHeight = Default(labelHeight, 5);
		};

		function getValueBounds() {
			var upperValue = -Number.MAX_VALUE;
			var lowerValue = Number.MAX_VALUE;
			for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					if(typeof data.datasets[i].data[j]=="undefined")continue;
					if (1 * data.datasets[i].data[j] > upperValue) {
						upperValue = 1 * data.datasets[i].data[j]
					}
					if (1 * data.datasets[i].data[j] < lowerValue) {
						lowerValue = 1 * data.datasets[i].data[j]
					}
				}
			}
			if(upperValue<lowerValue){upperValue=0;lowerValue=0;}
			if (Math.abs(upperValue - lowerValue) < config.zeroValue) {
				if(Math.abs(upperValue)< config.zeroValue){ upperValue = .9;lowerValue=-.9;}
				if(upperValue>0) {
					upperValue=upperValue*1.1;
					lowerValue=lowerValue*0.9;
				} else {
					upperValue=upperValue*0.9;
					lowerValue=lowerValue*1.1;
				}
			}
			if(typeof config.graphMin=="function") lowerValue= setOptionValue("GRAPHMIN",ctx,data,statData,undefined,config.graphMin,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
			if(typeof config.graphMax=="function") upperValue= setOptionValue("GRAPHMAX",ctx,data,statData,undefined,config.graphMax,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMax)) upperValue = config.graphMax;
			var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
			return {
				maxValue: upperValue,
				minValue: lowerValue,
				maxSteps: maxSteps,
				minSteps: minSteps
			};
		};
	};


	var Pie = function(data, config, ctx) {
		var totvalue = 0;
		var msr, midPieX, midPieY, pieRadius;

		ctx.tpchart="Pie";
	        if (!init_and_start(ctx,data,config)) return;
		var statData=initPassVariableData_part1(data,config,ctx);
		config.logarithmic = false;
		config.logarithmic2 = false;
		msr = setMeasures(data, config, ctx, height, width, "none", null, true, false, false, false, true, "Pie");
		calculateDrawingSize();
		if(pieRadius > 0) {
			initPassVariableData_part2(statData,data,config,ctx,{midPosX : midPieX,midPosY : midPieY,int_radius : 0,ext_radius : pieRadius});
			animationLoop(config, null, drawPieSegments, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPieX, midPieY, midPieX - pieRadius, midPieY + pieRadius, data);
		} else {
			testRedraw(ctx,data,config);
		}
		function drawPieSegments(animationDecimal) {
			for (var i = 0; i < data.length; i++) {
				var	scaleAnimation = 1,
					rotateAnimation = 1;
                	
				if (config.animation) {
					if (config.animateScale) {
						scaleAnimation = animationDecimal;
					}
					if (config.animateRotate) {
						rotateAnimation = animationDecimal;
					}
				}
				correctedRotateAnimation = animationCorrection(rotateAnimation, data, config, i, -1, 0).mainVal;
				if (!(typeof(data[i].value) == 'undefined')&& 1*data[i].value >=0) {
					ctx.beginPath();
					if(config.animationByData == "ByArc") {
						endAngle=statData[i].startAngle+correctedRotateAnimation*statData[i].segmentAngle;
						ctx.arc(midPieX, midPieY, scaleAnimation * pieRadius, statData[i].startAngle, endAngle);
					} else if(config.animationByData) {
						if(statData[i].startAngle-statData[i].firstAngle < correctedRotateAnimation*2*Math.PI ) {
							endAngle=statData[i].endAngle;
							if((statData[i].endAngle-statData[i].firstAngle)> correctedRotateAnimation*2*Math.PI) endAngle=statData[i].firstAngle+correctedRotateAnimation*2*Math.PI;							
							ctx.arc(midPieX, midPieY, scaleAnimation * pieRadius, statData[i].startAngle, endAngle);
							
						}
						else continue;
					} else {
						ctx.arc(midPieX, midPieY, scaleAnimation * pieRadius, statData[i].firstAngle+correctedRotateAnimation * (statData[i].startAngle-statData[i].firstAngle), statData[i].firstAngle+correctedRotateAnimation * (statData[i].endAngle-statData[i].firstAngle));
					}
					ctx.lineTo(midPieX, midPieY);
					ctx.closePath();
					ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data[i].color,config.defaultFillColor,i,-1,{animationDecimal: animationDecimal, scaleAnimation : scaleAnimation} );
					ctx.fill();
					if (config.segmentShowStroke) {
						ctx.lineWidth = config.segmentStrokeWidth;
						ctx.strokeStyle = config.segmentStrokeColor;
						ctx.setLineDash(lineStyleFn(setOptionValue("SEGMENTSTROKESTYLE",ctx,data,statData,data[i].segmentStrokeStyle,config.segmentStrokeStyle,i,-1,{animationDecimal: animationDecimal, scaleAnimation : scaleAnimation} )));
						ctx.stroke();					 
						ctx.setLineDash([]);
					}
				}
			}
			if (animationDecimal >= config.animationStopValue) {
				for (var i = 0; i < data.length; i++) {
					if (typeof(data[i].value) == 'undefined' || 1*data[i].value<0) continue;
					if (setOptionValue("ANNOTATEDISPLAY",ctx,data,statData,undefined,config.annotateDisplay,i,-1,{nullValue : true})) {
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["ARC", i,-1,statData];
					}
					if (setOptionValue("INGRAPHDATASHOW",ctx,data,statData,undefined,config.inGraphDataShow,i,-1,{nullValue : true}) && statData[i]["segmentAngle"] >= (Math.PI/180) * setOptionValue("INGRAPHDATAMINIMUMANGLE",ctx,data,statData,undefined,config.inGraphDataMinimumAngle,i,-1,{nullValue : true} )) {
						if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 1) posAngle = statData[i].realStartAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 2) posAngle = statData[i].realStartAngle - statData[i]["segmentAngle"] / 2 + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 3) posAngle = statData[i].realStartAngle - statData[i].segmentAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 1) labelRadius = 0 + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						else if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 2) labelRadius = pieRadius / 2 + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						else if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 3) labelRadius = pieRadius + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						ctx.save();
						if (setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  }) == "off-center") {
							if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2) ctx.textAlign = "left";
							else ctx.textAlign = "right";
						} else if (setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  }) == "to-center") {
							if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2) ctx.textAlign = "right";
							else ctx.textAlign = "left";
						} else ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  });
						if (setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} ) == "off-center") {
							if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "top";
							else ctx.textBaseline = "bottom";
						} else if (setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} ) == "to-center") {
							if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "bottom";
							else ctx.textBaseline = "top";
						} else ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} );
						ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,-1,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,-1,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,-1,{nullValue : true} );
						ctx.fillStyle = setOptionValue("INGRAPHDATAFONTCOLOR",ctx,data,statData,undefined,config.inGraphDataFontColor,i,-1,{nullValue : true} );
						var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,-1,{nullValue : true} ), statData[i],config);
						ctx.translate(midPieX + labelRadius * Math.cos(posAngle), midPieY - labelRadius * Math.sin(posAngle));
						if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis") ctx.rotate(2 * Math.PI - posAngle);
						else if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxisRotateLabels") {
							if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (posAngle + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2) ctx.rotate(3 * Math.PI - posAngle);
							else ctx.rotate(2 * Math.PI - posAngle);
						} else ctx.rotate(setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) * (Math.PI / 180));
						ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,-1,{nullValue : true} ),true);
						ctx.restore();
					}
				}

			}
			if(msr.legendMsr.dispLegend)drawLegend(msr.legendMsr,data,config,ctx,"Pie");
		};

		function calculateDrawingSize() {
			midPieX = msr.leftNotUsableSize + (msr.availableWidth / 2);
			midPieY = msr.topNotUsableSize + (msr.availableHeight / 2);
			pieRadius = Min([msr.availableHeight / 2, msr.availableWidth / 2]) - 5;
			// Computerange Pie Radius
			if (isBooleanOptionTrue(undefined,config.inGraphDataShow) && setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,0,-1,{nullValue : true} ) == 3 && setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,0,-1,{nullValue: true  }) == "off-center" && setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,0,-1,{nullValue : true} ) == 0) {
				pieRadius = Min([msr.availableHeight / 2, msr.availableWidth / 2]) - setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,0,-1,{nullValue : true} ) - setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,0,-1,{nullValue: true} ) - 5;
				var realCumulativeAngle = ((config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2*Math.PI) + 2*Math.PI) % (2*Math.PI);
				for (var i = 0; i < data.length; i++) {
					if (!(typeof(data[i].value) == 'undefined') && 1*data[i].value>=0) {
						ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,-1,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,0,-1,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,-1,{nullValue : true} );
						if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 1) posAngle = realCumulativeAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 2) posAngle = realCumulativeAngle - statData[i].segmentAngle / 2 + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 3) posAngle = realCumulativeAngle - statData[i].segmentAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						realCumulativeAngle -= statData[i].segmentAngle;
						var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,-1,{nullValue : true} ), statData[i],config);
						var textMeasurement = ctx.measureText(dispString).width;
						var MaxRadiusX = Math.abs((msr.availableWidth / 2 - textMeasurement) / Math.cos(posAngle)) - setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} ) - 5;
						if (MaxRadiusX < pieRadius) pieRadius = MaxRadiusX;
					}
				}
			}
			pieRadius = pieRadius * config.radiusScale;
		};
	};
	var Doughnut = function(data, config, ctx) {
		var msr, midPieX, midPieY, doughnutRadius;

		ctx.tpchart="Doughnut";
	        if (!init_and_start(ctx,data,config)) return;
		var statData=initPassVariableData_part1(data,config,ctx);

		var realCumulativeAngle = (((config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2* Math.PI) % (2* Math.PI) ; 
		config.logarithmic = false;
		config.logarithmic2 = false;
		msr = setMeasures(data, config, ctx, height, width, "none", null, true, false, false, false, true, "Doughnut");
		calculateDrawingSize();

		var cutoutRadius = doughnutRadius * (config.percentageInnerCutout / 100);
		if(doughnutRadius > 0) {
			initPassVariableData_part2(statData,data,config,ctx,{midPosX : midPieX,midPosY : midPieY ,int_radius : cutoutRadius ,ext_radius : doughnutRadius});
			animationLoop(config, null, drawPieSegments, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPieX, midPieY, midPieX - doughnutRadius, midPieY + doughnutRadius, data);
		} else {
			testRedraw(ctx,data,config);
		}


		function drawPieSegments(animationDecimal) {
			var cumulativeAngle = (((-config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2* Math.PI) % (2* Math.PI) ; 

			for (var i = 0; i < data.length; i++) {
				var	scaleAnimation = 1,
					rotateAnimation = 1;
                	
				if (config.animation) {
					if (config.animateScale) {
						scaleAnimation = animationDecimal;
					}
					if (config.animateRotate) {
						rotateAnimation = animationDecimal;
					}
				}
				correctedRotateAnimation = animationCorrection(rotateAnimation, data, config, i, -1, 0).mainVal;
				if (!(typeof(data[i].value) == 'undefined') && 1*data[i].value >=0) {
					ctx.beginPath();
					if (config.animationByData == "ByArc") {
						endAngle=statData[i].startAngle+correctedRotateAnimation*statData[i].segmentAngle;
						ctx.arc(midPieX, midPieY, scaleAnimation * doughnutRadius, statData[i].startAngle, endAngle,false);
						ctx.arc(midPieX, midPieY, scaleAnimation * cutoutRadius, endAngle,statData[i].startAngle, true);
					} else if(config.animationByData) {
						if(statData[i].startAngle-statData[i].firstAngle < correctedRotateAnimation*2*Math.PI ) {
							endAngle=statData[i].endAngle;
							if((statData[i].endAngle-statData[i].firstAngle)> correctedRotateAnimation*2*Math.PI) endAngle=statData[i].firstAngle+correctedRotateAnimation*2*Math.PI;							
							ctx.arc(midPieX, midPieY, scaleAnimation * doughnutRadius, statData[i].startAngle, endAngle,false);
							ctx.arc(midPieX, midPieY, scaleAnimation * cutoutRadius, endAngle,statData[i].startAngle, true);
							
						}
						else continue;
					} else {
						ctx.arc(midPieX, midPieY, scaleAnimation * doughnutRadius, statData[i].firstAngle+correctedRotateAnimation * (statData[i].startAngle-statData[i].firstAngle), statData[i].firstAngle+correctedRotateAnimation * (statData[i].endAngle-statData[i].firstAngle),false);
						ctx.arc(midPieX, midPieY, scaleAnimation * cutoutRadius, statData[i].firstAngle+correctedRotateAnimation * (statData[i].endAngle-statData[i].firstAngle), statData[i].firstAngle+correctedRotateAnimation * (statData[i].startAngle-statData[i].firstAngle), true);
					}
					ctx.closePath();
					ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data[i].color,config.defaultFillColor,i,-1,{animationDecimal: animationDecimal, scaleAnimation : scaleAnimation} );
					ctx.fill();
					if (config.segmentShowStroke) {
						ctx.lineWidth = config.segmentStrokeWidth;
						ctx.strokeStyle = config.segmentStrokeColor;
						ctx.setLineDash(lineStyleFn(setOptionValue("SEGMENTSTROKESTYLE",ctx,data,statData,data[i].segmentStrokeStyle,config.segmentStrokeStyle,i,-1,{animationDecimal: animationDecimal, scaleAnimation : scaleAnimation} )));
						ctx.stroke();					 
						ctx.setLineDash([]);
					}
				}
			}
			if (animationDecimal >= config.animationStopValue) {
				for (var i = 0; i < data.length; i++) {
					if (typeof(data[i].value) == 'undefined' || 1*data[i].value<0) continue;
					if(setOptionValue("ANNOTATEDISPLAY",ctx,data,statData,undefined,config.annotateDisplay,i,-1,{nullValue : true})) {
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["ARC", i,-1,statData];
					}
					if (setOptionValue("INGRAPHDATASHOW",ctx,data,statData,undefined,config.inGraphDataShow,i,-1,{nullValue : true}) && statData[i].segmentAngle >= (Math.PI/180) * setOptionValue("INGRAPHDATAMINIMUMANGLE",ctx,data,statData,undefined,config.inGraphDataMinimumAngle,i,-1,{nullValue : true} )) {
						if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 1) posAngle = statData[i].realStartAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 2) posAngle = statData[i].realStartAngle- statData[i].segmentAngle / 2 + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 3) posAngle = statData[i].realStartAngle - statData[i].segmentAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 1) labelRadius = cutoutRadius + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						else if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 2) labelRadius = cutoutRadius + (doughnutRadius - cutoutRadius) / 2 + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						else if (setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,i,-1,{nullValue : true} ) == 3) labelRadius = doughnutRadius + setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} );
						ctx.save();
						if (setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  }) == "off-center") {
							if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2) ctx.textAlign = "left";
							else ctx.textAlign = "right";
						} else if (setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  }) == "to-center") {
							if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2) ctx.textAlign = "right";
							else ctx.textAlign = "left";
						} else ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,-1,{nullValue: true  });
						if (setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} ) == "off-center") {
							if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "top";
							else ctx.textBaseline = "bottom";
						} else if (setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} ) == "to-center") {
							if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "bottom";
							else ctx.textBaseline = "top";
						} else ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,-1,{nullValue : true} );
						ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,-1,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,-1,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,-1,{nullValue : true} );
						ctx.fillStyle = setOptionValue("INGRAPHDATAFONTCOLOR",ctx,data,statData,undefined,config.inGraphDataFontColor,i,-1,{nullValue : true} );
						var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,-1,{nullValue : true} ), statData[i],config);
						ctx.translate(midPieX + labelRadius * Math.cos(posAngle), midPieY - labelRadius * Math.sin(posAngle));
						if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxis") ctx.rotate(2 * Math.PI - posAngle);
						else if (setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) == "inRadiusAxisRotateLabels") {
							if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (posAngle + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2) ctx.rotate(3 * Math.PI - posAngle);
							else ctx.rotate(2 * Math.PI - posAngle);
						} else ctx.rotate(setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,-1,{nullValue : true} ) * (Math.PI / 180));
						ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,-1,{nullValue : true} ),true);
						ctx.restore();
					}
				}
			}
			if(msr.legendMsr.dispLegend)drawLegend(msr.legendMsr,data,config,ctx,"Doughnut");
		};

		function calculateDrawingSize() {
			midPieX = msr.leftNotUsableSize + (msr.availableWidth / 2);
			midPieY = msr.topNotUsableSize + (msr.availableHeight / 2);
			doughnutRadius = Min([msr.availableHeight / 2, msr.availableWidth / 2]) - 5;
			// Computerange Pie Radius
			if (isBooleanOptionTrue(undefined,config.inGraphDataShow) && setOptionValue("INGRAPHDATARADIUSPOSITION",ctx,data,statData,undefined,config.inGraphDataRadiusPosition,0,-1,{nullValue : true} ) == 3 && setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,0,-1,{nullValue: true  }) == "off-center" && setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,0,-1,{nullValue : true} ) == 0) {
				doughnutRadius = Min([msr.availableHeight / 2, msr.availableWidth / 2]) - setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,0,-1,{nullValue : true} ) - setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,0,-1,{nullValue: true} ) - 5;
				var realCumulativeAngle = (((config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2* Math.PI) % (2* Math.PI) ; 
				var posAngle;
				for (var i = 0; i < data.length; i++) {
					if (!(typeof(data[i].value) == 'undefined') && 1*data[i].value>=0) {
						ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,-1,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,-1,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,-1,{nullValue : true} );
						if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 1) posAngle = realCumulativeAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 2) posAngle = realCumulativeAngle - statData[i].segmentAngle / 2 + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						else if (setOptionValue("INGRAPHDATAANGLEPOSITION",ctx,data,statData,undefined,config.inGraphDataAnglePosition,i,-1,{nullValue : true} ) == 3) posAngle = realCumulativeAngle - statData[i].segmentAngle + setOptionValue("INGRAPHDATAPADDINANGLE",ctx,data,statData,undefined,config.inGraphDataPaddingAngle,i,-1,{nullValue: true  }) * (Math.PI / 180);
						realCumulativeAngle -= statData[i].segmentAngle;
						var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,-1,{nullValue : true} ), statData[i],config);
						var textMeasurement = ctx.measureText(dispString).width;
						var MaxRadiusX = Math.abs((msr.availableWidth / 2 - textMeasurement) / Math.cos(posAngle)) - setOptionValue("INGRAPHDATAPADDINGRADIUS",ctx,data,statData,undefined,config.inGraphDataPaddingRadius,i,-1,{nullValue: true} ) - 5;
						if (MaxRadiusX < doughnutRadius) doughnutRadius = MaxRadiusX;
					}
				}
			}
			doughnutRadius = doughnutRadius * config.radiusScale;
		};
	};
	var Line = function(data, config, ctx) {
		var maxSize, scaleHop, scaleHop2, calculatedScale, calculatedScale2, labelHeight, scaleHeight, valueBounds, labelTemplateString, labelTemplateString2;
		var valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, rotateLabels = 0,
			msr;
		var zeroY = 0;
		var zeroY2 = 0;
		ctx.tpchart="Line";
	        if (!init_and_start(ctx,data,config)) return;
		// adapt data when length is 1;
		var mxlgt = 0;
		for (var i = 0; i < data.datasets.length; i++) {mxlgt = Max([mxlgt, data.datasets[i].data.length]);}
		if (mxlgt == 1) {
			if (typeof(data.labels[0]) == "string") data.labels = ["", data.labels[0], ""];
			for (var i = 0; i < data.datasets.length; i++) {
				if (typeof(data.datasets[i].data[0] != "undefined")) data.datasets[i].data = [undefined, data.datasets[i].data[0], undefined];
			}
			mxlgt=3;
		}
		var statData=initPassVariableData_part1(data,config,ctx);
		for (var i = 0; i < data.datasets.length; i++) statData[i][0].tpchart="Line";
		msr = setMeasures(data, config, ctx, height, width, "nihil", [""], false, false, true, true, config.datasetFill, "Line");
		valueBounds = getValueBounds();
		// true or fuzzy (error for negativ values (included 0))
		if (config.logarithmic !== false) {
			if (valueBounds.minValue <= 0) {
				config.logarithmic = false;
			}
		}
		if (config.logarithmic2 !== false) {
			if (valueBounds.minValue2 <= 0) {
				config.logarithmic2 = false;
			}
		}
		// Check if logarithmic is meanigful
		var OrderOfMagnitude = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue)));
		if ((config.logarithmic == 'fuzzy' && OrderOfMagnitude < 4) || config.scaleOverride) {
			config.logarithmic = false;
		}
		// Check if logarithmic is meanigful
		var OrderOfMagnitude2 = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue2) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue2)));
		if ((config.logarithmic2 == 'fuzzy' && OrderOfMagnitude2 < 4) || config.scaleOverride2) {
			config.logarithmic2 = false;
		}
		//Check and set the scale
		labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
		labelTemplateString2 = (config.scaleShowLabels2) ? config.scaleLabel2 : "";
		if (!config.scaleOverride) {
			if(valueBounds.maxSteps>0 && valueBounds.minSteps>0) {
				calculatedScale = calculateScale(1, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
			}
		} else {
			var scaleStartValue= setOptionValue("SCALESTARTVALUE",ctx,data,statData,undefined,config.scaleStartValue,-1,-1,{nullValue : true} );
			var scaleSteps =setOptionValue("SCALESTEPS",ctx,data,statData,undefined,config.scaleSteps,-1,-1,{nullValue : true} );
			var scaleStepWidth = setOptionValue("SCALESTEPWIDTH",ctx,data,statData,undefined,config.scaleStepWidth,-1,-1,{nullValue : true} );
			calculatedScale = {
				steps: scaleSteps,
				stepValue: scaleStepWidth,
				graphMin: scaleStartValue,
				graphMax: scaleStartValue + scaleSteps * scaleStepWidth,
				labels: []
			}
			populateLabels(1, config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, scaleStartValue, calculatedScale.graphMax, scaleStepWidth);
		}

		if (valueBounds.dbAxis) {
			if (!config.scaleOverride2) {
				if(valueBounds.maxSteps>0 && valueBounds.minSteps>0) {
					calculatedScale2 = calculateScale(2, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue2, valueBounds.minValue2, labelTemplateString);
				}
			} else {
				var scaleStartValue2= setOptionValue("SCALESTARTVALUE2",ctx,data,statData,undefined,config.scaleStartValue2,-1,-1,{nullValue : true} );
				var scaleSteps2 =setOptionValue("SCALESTEPS2",ctx,data,statData,undefined,config.scaleSteps2,-1,-1,{nullValue : true} );
				var scaleStepWidth2 = setOptionValue("SCALESTEPWIDTH2",ctx,data,statData,undefined,config.scaleStepWidth2,-1,-1,{nullValue : true} );

				calculatedScale2 = {
					steps: scaleSteps2,
					stepValue: scaleStepWidth2,
					graphMin: scaleStartValue2,
					graphMax: scaleStartValue2 + scaleSteps2 * scaleStepWidth2,
					labels: []
				}
				populateLabels(2, config, labelTemplateString2, calculatedScale2.labels, calculatedScale2.steps, scaleStartValue2, calculatedScale2.graphMax, scaleStepWidth2);
			}
		} else {
			calculatedScale2 = {
				steps: 0,
				stepValue: 0,
				graphMin: 0,
				graphMax: 0,
				labels: null
			}
		}
		if(valueBounds.maxSteps>0 && valueBounds.minSteps>0) {
			msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, calculatedScale2.labels, false, false, true, true, config.datasetFill, "Line");
			var prevHeight=msr.availableHeight;
			msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
			msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;
			scaleHop = Math.floor(msr.availableHeight / calculatedScale.steps);
			scaleHop2 = Math.floor(msr.availableHeight / calculatedScale2.steps);
			valueHop = Math.floor(msr.availableWidth / (data.labels.length - 1));
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / (data.labels.length - 1));
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - (data.labels.length - 1) * valueHop);
			msr.availableWidth = (data.labels.length - 1) * valueHop;
			msr.availableHeight = (calculatedScale.steps) * scaleHop;
			msr.xLabelPos+=(config.scaleTickSizeBottom + config.scaleTickSizeTop - (prevHeight-msr.availableHeight));
			msr.clrheight+=(config.scaleTickSizeBottom + config.scaleTickSizeTop - (prevHeight-msr.availableHeight));
  			yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
			xAxisPosY = msr.topNotUsableSize + msr.availableHeight + config.scaleTickSizeTop;
			drawLabels();
			if (valueBounds.minValue < 0) {
				zeroY = calculateOffset(config.logarithmic, 0, calculatedScale, scaleHop);
			}
			if (valueBounds.minValue2 < 0) {
				zeroY2 = calculateOffset(config.logarithmic2, 0, calculatedScale2, scaleHop2);
			}
			initPassVariableData_part2(statData,data,config,ctx,{
				xAxisPosY : xAxisPosY,
				yAxisPosX : yAxisPosX,
				valueHop : valueHop,
				nbValueHop : data.labels.length - 1,
				scaleHop : scaleHop,
				zeroY : zeroY,
				calculatedScale : calculatedScale,
				logarithmic  : config.logarithmic,
				scaleHop2: scaleHop2,
				zeroY2: zeroY2,
				msr : msr,
				calculatedScale2: calculatedScale2,
				logarithmic2: config.logarithmic2} );
			animationLoop(config, drawScale, drawLines, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);
		} else {
			testRedraw(ctx,data,config);
		}


		function drawLines(animPc) {
		
			drawLinesDataset(animPc, data, config, ctx, statData,{xAxisPosY : xAxisPosY,yAxisPosX : yAxisPosX, valueHop : valueHop, nbValueHop : data.labels.length - 1 });
			if (animPc >= 1) {
				if (typeof drawMath == "function") {
					drawMath(ctx, config, data, msr, {
						xAxisPosY: xAxisPosY,
						yAxisPosX: yAxisPosX,
						valueHop: valueHop,
						scaleHop: scaleHop,
						zeroY: zeroY,
						calculatedScale: calculatedScale,
						calculateOffset: calculateOffset,
						statData : statData

					});
				}
			}
			if(msr.legendMsr.dispLegend)drawLegend(msr.legendMsr,data,config,ctx,"Line");
		};

		function drawScale() {
			//X axis line
			// if the xScale should be drawn
			if (config.drawXScaleLine !== false) {
				for (var s = 0; s < config.drawXScaleLine.length; s++) {
					// get special lineWidth and lineColor for this xScaleLine
					ctx.lineWidth = config.drawXScaleLine[s].lineWidth ? config.drawXScaleLine[s].lineWidth : config.scaleLineWidth;
					ctx.strokeStyle = config.drawXScaleLine[s].lineColor ? config.drawXScaleLine[s].lineColor : config.scaleLineColor;
					ctx.beginPath();
					var yPosXScale;
					switch (config.drawXScaleLine[s].position) {
						case "bottom":
							yPosXScale = xAxisPosY;
							break;
						case "top":
							yPosXScale = xAxisPosY - msr.availableHeight - config.scaleTickSizeTop;
							break;
						case "0":
						case 0:
							// check if zero exists
							if (zeroY != 0) {
								yPosXScale = xAxisPosY - zeroY;
							}
							break;
					}
					// draw the scale line
					ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, yPosXScale);
					ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, yPosXScale);
					ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
					ctx.stroke();
					ctx.setLineDash([]);
 
				}
			}
			for (var i = 0; i < data.labels.length; i++) {
				ctx.beginPath();
				ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
				ctx.lineWidth = config.scaleGridLineWidth;
				ctx.strokeStyle = config.scaleGridLineColor;
				//Check i isnt 0, so we dont go over the Y axis twice.
				if (config.scaleShowGridLines && i > 0 && i % config.scaleXGridLinesStep == 0) {
					ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
				} else {
					ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
				}
				ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
				ctx.stroke();
            			ctx.setLineDash([]);
			}
			//Y axis
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.beginPath();
			ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
			ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
			ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
			ctx.stroke();
			ctx.setLineDash([]);
			for (var j = 0; j < calculatedScale.steps; j++) {
				ctx.beginPath();
				ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
				ctx.lineWidth = config.scaleGridLineWidth;
				ctx.strokeStyle = config.scaleGridLineColor;
				if (config.scaleShowGridLines && (j+1) % config.scaleYGridLinesStep == 0) {
					ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY - ((j + 1) * scaleHop));
				} else {
					ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
				}
				ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
				ctx.stroke();
            			ctx.setLineDash([]);
			}
		};

		function drawLabels() {
			ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
			//X Labels     
			if (config.xAxisTop || config.xAxisBottom) {
				ctx.textBaseline = "top";
				if (msr.rotateLabels > 90) {
					ctx.save();
					ctx.textAlign = "left";
				} else if (msr.rotateLabels > 0) {
					ctx.save();
					ctx.textAlign = "right";
				} else {
					ctx.textAlign = "center";
				}
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					for (var i = 0; i < data.labels.length; i++) {
						ctx.save();
						if (msr.rotateLabels > 0) {
							ctx.translate(yAxisPosX + i * valueHop - msr.highestXLabel / 2, msr.xLabelPos);
							ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
							ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), 0, 0, ctx.textBaseline, config.scaleFontSize,true);
						} else {
							ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), yAxisPosX + i * valueHop, msr.xLabelPos, ctx.textBaseline, config.scaleFontSize,true);
						}
						ctx.restore();
					}
				}
			}
			//Y Labels
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			for (var j = ((config.showYAxisMin) ? -1 : 0); j < calculatedScale.steps; j++) {
				if (config.scaleShowLabels) {
					if (config.yAxisLeft) {
						ctx.textAlign = "right";
						ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop), ctx.textBaseline, config.scaleFontSize,true);
					}
					if (config.yAxisRight && !valueBounds.dbAxis) {
						ctx.textAlign = "left";
						ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop), ctx.textBaseline, config.scaleFontSize,true);
					}
				}
			}
			if (config.yAxisRight && valueBounds.dbAxis) {
				for (var j = ((config.showYAxisMin) ? -1 : 0); j < calculatedScale2.steps; j++) {
					if (config.scaleShowLabels) {
						ctx.textAlign = "left";
						ctx.fillTextMultiLine(calculatedScale2.labels[j + 1], yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop2), ctx.textBaseline, config.scaleFontSize,true);
					}
				}
			}
		};

		function getValueBounds() {
			var upperValue = -Number.MAX_VALUE;
			var lowerValue = Number.MAX_VALUE;
			var upperValue2 = -Number.MAX_VALUE;
			var lowerValue2 = Number.MAX_VALUE;
			var secondAxis = false;
			var firstAxis = false;
			for (var i = 0; i < data.datasets.length; i++) {
				var mathFctName = data.datasets[i].drawMathDeviation;
				var mathValueHeight = 0;
				if (typeof eval(mathFctName) == "function") {
					var parameter = {
						data: data,
						datasetNr: i
					};
					mathValueHeight = window[mathFctName](parameter);
				}
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					if(typeof data.datasets[i].data[j] == "undefined") continue;
					if (data.datasets[i].axis == 2) {
						secondAxis = true;
						if (1 * data.datasets[i].data[j] + mathValueHeight > upperValue2) {
							upperValue2 = 1 * data.datasets[i].data[j] + mathValueHeight
						};
						if (1 * data.datasets[i].data[j] - mathValueHeight < lowerValue2) {
							lowerValue2 = 1 * data.datasets[i].data[j] - mathValueHeight
						};
					} else {
						firstAxis = true;
						if (1 * data.datasets[i].data[j] + mathValueHeight > upperValue) {
							upperValue = 1 * data.datasets[i].data[j] + mathValueHeight
						};
						if (1 * data.datasets[i].data[j] - mathValueHeight < lowerValue) {
							lowerValue = 1 * data.datasets[i].data[j] - mathValueHeight
						};
					}
				}
			};
			if(upperValue<lowerValue){upperValue=0;lowerValue=0;}
			if (Math.abs(upperValue - lowerValue) < config.zeroValue) {
				if(Math.abs(upperValue)< config.zeroValue) upperValue = .9;
				if(upperValue>0) {
					upperValue=upperValue*1.1;
					lowerValue=lowerValue*0.9;
				} else {
					upperValue=upperValue*0.9;
					lowerValue=lowerValue*1.1;
				}
				
			}
			if(typeof config.graphMin=="function")lowerValue= setOptionValue("GRAPHMIN",ctx,data,statData,undefined,config.graphMin,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
			if(typeof config.graphMax=="function") upperValue= setOptionValue("GRAPHMAX",ctx,data,statData,undefined,config.graphMax,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMax)) upperValue = config.graphMax;

			if (secondAxis) {
				if(upperValue2<lowerValue2){upperValue2=0;lowerValue2=0;}
				if (Math.abs(upperValue2 - lowerValue2) < config.zeroValue) {
					if(Math.abs(upperValue2)< config.zeroValue) upperValue2 = .9;
					if(upperValue2>0) {
						upperValue2=upperValue2*1.1;
						lowerValue2=lowerValue2*0.9;
					} else {
						upperValue2=upperValue2*0.9;
						lowerValue2=lowerValue2*1.1;
					}
				}
				if(typeof config.graphMin2=="function")lowerValue2= setOptionValue("GRAPHMIN",ctx,data,statData,undefined,config.graphMin2,-1,-1,{nullValue : true})
				else if (!isNaN(config.graphMin2)) lowerValue2 = config.graphMin2;
				if(typeof config.graphMax2=="function") upperValue2= setOptionValue("GRAPHMAX",ctx,data,statData,undefined,config.graphMax2,-1,-1,{nullValue : true})
				else if (!isNaN(config.graphMax2)) upperValue2 = config.graphMax2;
			}

			if (!firstAxis && secondAxis) {
				upperValue = upperValue2;
				lowerValue = lowerValue2;
			}
			
			labelHeight = config.scaleFontSize;
			scaleHeight = msr.availableHeight;
			var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
			return {
				maxValue: upperValue,
				minValue: lowerValue,
				maxValue2: upperValue2,
				minValue2: lowerValue2,
				dbAxis: secondAxis,
				maxSteps: maxSteps,
				minSteps: minSteps
			};
		};
	};
	var StackedBar = function(data, config, ctx) {
		var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0,
			msr;
		ctx.tpchart="StackedBar";
	        if (!init_and_start(ctx,data,config)) return;
		var statData=initPassVariableData_part1(data,config,ctx);

		config.logarithmic = false;
		msr = setMeasures(data, config, ctx, height, width, "nihil", [""], true, false, true, true, true, "StackedBar");
		valueBounds = getValueBounds();
		
		if(valueBounds.maxSteps>0 && valueBounds.minSteps>0) {
			//Check and set the scale
			labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
			if (!config.scaleOverride) {
				calculatedScale = calculateScale(1, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
				msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, false, true, true, true, "StackedBar");
			} else {
				var scaleStartValue= setOptionValue("SCALESTARTVALUE",ctx,data,statData,undefined,config.scaleStartValue,-1,-1,{nullValue : true} );
				var scaleSteps =setOptionValue("SCALESTEPS",ctx,data,statData,undefined,config.scaleSteps,-1,-1,{nullValue : true} );
				var scaleStepWidth = setOptionValue("SCALESTEPWIDTH",ctx,data,statData,undefined,config.scaleStepWidth,-1,-1,{nullValue : true} );

				calculatedScale = {
					steps: scaleSteps,
					stepValue: scaleStepWidth,
					graphMin: scaleStartValue,
					labels: []
				}
				for (var i = 0; i <= calculatedScale.steps; i++) {
					if (labelTemplateString) {
						calculatedScale.labels.push(tmpl(labelTemplateString, {
							value: fmtChartJS(config, 1 * ((scaleStartValue + (scaleStepWidth * i)).toFixed(getDecimalPlaces(scaleStepWidth))), config.fmtYLabel)
						},config));
					}
				}
				msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, false, true, true, true, "StackedBar");
			}
       	
			var prevHeight=msr.availableHeight;
       	
			msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
			msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;
			scaleHop = Math.floor(msr.availableHeight / calculatedScale.steps);
			valueHop = Math.floor(msr.availableWidth / (data.labels.length));
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / data.labels.length);
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - ((data.labels.length) * valueHop));
			msr.availableWidth = (data.labels.length) * valueHop;
			msr.availableHeight = (calculatedScale.steps) * scaleHop;
			msr.xLabelPos+=(config.scaleTickSizeBottom + config.scaleTickSizeTop - (prevHeight-msr.availableHeight));
			msr.clrheight+=(config.scaleTickSizeBottom + config.scaleTickSizeTop - (prevHeight-msr.availableHeight));
       	
			yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
			xAxisPosY = msr.topNotUsableSize + msr.availableHeight + config.scaleTickSizeTop;
			barWidth = (valueHop - config.scaleGridLineWidth * 2 - (config.barValueSpacing * 2) - (config.barDatasetSpacing * data.datasets.length - 1) - (config.barStrokeWidth / 2) - 1);
			if(barWidth>=0 && barWidth<=1)barWidth=1;
			if(barWidth<0 && barWidth>=-1)barWidth=-1;
       	
			drawLabels();
			initPassVariableData_part2(statData,data,config,ctx,{ 
				calculatedScale : calculatedScale,
				scaleHop : scaleHop,
				valueHop : valueHop,
				yAxisPosX : yAxisPosX,
				xAxisPosY : xAxisPosY,
				barWidth : barWidth
			 });
			animationLoop(config, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);
		} else {
			testRedraw(ctx,data,config);
		}
		function drawBars(animPc) {
			ctx.lineWidth = config.barStrokeWidth;
			for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					var currentAnimPc = animationCorrection(animPc, data, config, i, j, 1).animVal;
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					if ((typeof data.datasets[i].data[j] == 'undefined') || 1*data.datasets[i].data[j] == 0 ) continue;
					if(config.animationByDataset) {
						var botBar=statData[i][j].yPosBottom;
						var topBar=statData[i][j].yPosTop;
						topBar=botBar+currentAnimPc*(topBar-botBar);
					} else {
						var botBar=statData[statData[i][j].firstNotMissing][j].yPosBottom - currentAnimPc*(statData[statData[i][j].firstNotMissing][j].yPosBottom-statData[i][j].yPosBottom);
						var topBar=statData[statData[i][j].firstNotMissing][j].yPosBottom - currentAnimPc*(statData[statData[i][j].firstNotMissing][j].yPosBottom-statData[i][j].yPosTop);
					}
					ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data.datasets[i].fillColor,config.defaultFillColor,i,j,{animationValue: currentAnimPc, xPosLeft : statData[i][j].xPosLeft, yPosBottom : botBar, xPosRight : statData[i][j].xPosRight, yPosTop : topBar} );
					ctx.strokeStyle=setOptionValue("STROKECOLOR",ctx,data,statData,data.datasets[i].strokeColor,config.defaultStrokeColor,i,j,{nullvalue : null} );

					if(currentAnimPc !=0 && botBar!=topBar) {
						ctx.beginPath();
						ctx.moveTo(statData[i][j].xPosLeft, botBar);
						ctx.lineTo(statData[i][j].xPosLeft, topBar);
						ctx.lineTo(statData[i][j].xPosRight, topBar);
						ctx.lineTo(statData[i][j].xPosRight, botBar);
						if (config.barShowStroke) { 
							ctx.setLineDash(lineStyleFn(setOptionValue("STROKESTYLE",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
							ctx.stroke();
							ctx.setLineDash([]);
						};
						ctx.closePath();
						ctx.fill();
					}
				}
			}
			if (animPc >= config.animationStopValue) {
				var 	yPos = 0,
					xPos = 0;
				for (var i = 0; i < data.datasets.length; i++) {
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						if(setOptionValue("ANNOTATEDISPLAY",ctx,data,statData,undefined,config.annotateDisplay,i,j,{nullValue : true})) {
							jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["RECT", i, j, statData];
						}
						if(setOptionValue("INGRAPHDATASHOW",ctx,data,statData,undefined,config.inGraphDataShow,i,j,{nullValue : true})) {
							ctx.save();
							ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,j,{nullValue: true  });
							ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,j,{nullValue : true} );
							ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,j,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,j,{nullValue : true} );
							ctx.fillStyle = setOptionValue("INGRAPHDATAFONTCOLOR",ctx,data,statData,undefined,config.inGraphDataFontColor,i,j,{nullValue : true} );
							var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,j,{nullValue : true} ), statData[i][j],config);
							ctx.beginPath();
							ctx.beginPath();
							yPos = 0;
							xPos = 0;
							if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 1) {
								xPos = statData[i][j].xPosLeft + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 2) {
								xPos = statData[i][j].xPosLeft + barWidth / 2 + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 3) {
								xPos = statData[i][j].xPosLeft+ barWidth + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							}
							if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 1) {
								yPos = statData[i][j].yPosBottom - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 2) {
								yPos = (statData[i][j].yPosTop + statData[i][j].yPosBottom)/2 - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 3) {
								yPos = statData[i][j].yPosTop - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							}
							if(yPos>msr.topNotUsableSize) {
								ctx.translate(xPos, yPos);
								ctx.rotate(setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,j,{nullValue : true} ) * (Math.PI / 180));
								ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ),true);
							}
							ctx.restore();
						}
					}
				}
			}
			if(msr.legendMsr.dispLegend)drawLegend(msr.legendMsr,data,config,ctx,"StackedBar");
		};

		function drawScale() {
			//X axis line                                                          
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
			ctx.beginPath();
			ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
			ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
			for (var i = 0; i < data.labels.length; i++) {
				ctx.beginPath();
				ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
				ctx.lineWidth = config.scaleGridLineWidth;
				ctx.strokeStyle = config.scaleGridLineColor;
				//Check i isnt 0, so we dont go over the Y axis twice.
				if (config.scaleShowGridLines && i > 0 && i % config.scaleXGridLinesStep == 0) {
					ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
				} else {
					ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
				}
				ctx.stroke();
			}
			ctx.setLineDash([]);
			
			//Y axis
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
			ctx.beginPath();
			ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
			ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
			ctx.stroke();
			ctx.setLineDash([]);
			
			ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
			for (var j = ((config.showYAxisMin) ? -1 : 0); j < calculatedScale.steps; j++) {
				ctx.beginPath();
				ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
				ctx.lineWidth = config.scaleGridLineWidth;
				ctx.strokeStyle = config.scaleGridLineColor;
				if (config.scaleShowGridLines && (j+1) % config.scaleYGridLinesStep == 0) {
					ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY - ((j + 1) * scaleHop));
				} else {
					ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
				}
				ctx.stroke();
			}
			ctx.setLineDash([]);
		};

		function drawLabels() {
			ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
			//X axis labels                                                          
			if (config.xAxisTop || config.xAxisBottom) {
				ctx.textBaseline = "top";
				if (msr.rotateLabels > 90) {
					ctx.save();
					ctx.textAlign = "left";
				} else if (msr.rotateLabels > 0) {
					ctx.save();
					ctx.textAlign = "right";
				} else {
					ctx.textAlign = "center";
				}
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					for (var i = 0; i < data.labels.length; i++) {
						ctx.save();
						if (msr.rotateLabels > 0) {
							ctx.translate(yAxisPosX + config.barValueSpacing + i * valueHop + (barWidth / 2) - msr.highestXLabel / 2, msr.xLabelPos);
							ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
							ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), 0, 0, ctx.textBaseline, config.scaleFontSize,true);
						} else {
							ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), yAxisPosX + config.barValueSpacing + i * valueHop + (barWidth / 2), msr.xLabelPos, ctx.textBaseline, config.scaleFontSize,true);
						}
						ctx.restore();
					}
				}
			}
			//Y axis
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			for (var j = ((config.showYAxisMin) ? -1 : 0); j < calculatedScale.steps; j++) {
				if (config.scaleShowLabels) {
					if (config.yAxisLeft) {
						ctx.textAlign = "right";
						ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop), ctx.textBaseline, config.scaleFontSize,true);
					}
					if (config.yAxisRight) {
						ctx.textAlign = "left";
						ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop), ctx.textBaseline, config.scaleFontSize,true);
					}
				}
			}
		};

		function getValueBounds() {
			var upperValue = -Number.MAX_VALUE;
			var lowerValue = Number.MAX_VALUE;
			var minvl = new Array(data.datasets.length);
			var maxvl = new Array(data.datasets.length);
			for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					var k = i;
					var tempp = 0;
					var tempn = 0;
					if (!(typeof(data.datasets[0].data[j]) == 'undefined')) {
						if(1 * data.datasets[0].data[j] > 0) {
							tempp += 1 * data.datasets[0].data[j];
							if (tempp > upperValue) {
								upperValue = tempp;
							};
							if (tempp < lowerValue) {
								lowerValue = tempp;
							};
						} else {
							tempn += 1 * data.datasets[0].data[j];
							if (tempn > upperValue) {
								upperValue = tempn;
							};
							if (tempn < lowerValue) {
								lowerValue = tempn;
							};
						}
					}
					while (k > 0) { //get max of stacked data
						if (!(typeof(data.datasets[k].data[j]) == 'undefined')) {
							if(1 * data.datasets[k].data[j] > 0) {
								tempp += 1 * data.datasets[k].data[j];
								if (tempp > upperValue) {
									upperValue = tempp;
								};
								if (tempp < lowerValue) {
									lowerValue = tempp;
								};
							} else {
								tempn += 1 * data.datasets[k].data[j];
								if (tempn > upperValue) {
									upperValue = tempn;
								};
								if (tempn < lowerValue) {
									lowerValue = tempn;
								};
							}
						}
						k--;
					}
				}
			};
			if(typeof config.graphMin=="function")lowerValue= setOptionValue("GRAPHMIN",ctx,data,statData,undefined,config.graphMin,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
			if(typeof config.graphMax=="function") upperValue= setOptionValue("GRAPHMAX",ctx,data,statData,undefined,config.graphMax,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMax)) upperValue = config.graphMax;
			if(upperValue<lowerValue){upperValue=0;lowerValue=0;}
			if (Math.abs(upperValue - lowerValue) < config.zeroValue) {
				if(Math.abs(upperValue)< config.zeroValue) upperValue = .9;
				if(upperValue>0) {
					upperValue=upperValue*1.1;
					lowerValue=lowerValue*0.9;
				} else {
					upperValue=upperValue*0.9;
					lowerValue=lowerValue*1.1;
				}
			}
			labelHeight = config.scaleFontSize;
			scaleHeight = msr.availableHeight;
			var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
			return {
				maxValue: upperValue,
				minValue: lowerValue,
				maxSteps: maxSteps,
				minSteps: minSteps
			};
		};
	};
	/**
	 * Reverse the data structure for horizontal charts
	 * - reverse labels and every array inside datasets
	 * @param {object} data datasets and labels for the chart
	 * @return return the reversed data
	 */
	function reverseData(data) {
		data.labels = data.labels.reverse();
		for (var i = 0; i < data.datasets.length; i++) {
			for (var key in data.datasets[i]) {
				if (Array.isArray(data.datasets[i][key])) {
					data.datasets[i][key] = data.datasets[i][key].reverse();
				}
			}
		}
		return data;
	};
	var HorizontalStackedBar = function(data, config, ctx) {
		var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0,
			msr;

		if (config.reverseOrder && typeof ctx.reversed == "undefined") {
			ctx.reversed=true;
			data = reverseData(data);
		}

		ctx.tpchart="HorizontalStackedBar";
	        if (!init_and_start(ctx,data,config)) return;
		var statData=initPassVariableData_part1(data,config,ctx);

		config.logarithmic = false;
		msr = setMeasures(data, config, ctx, height, width, "nihil", [""], true, true, true, true, true, "HorizontalStackedBar");
 		valueBounds = getValueBounds();
		
		if(valueBounds.maxSteps>0 && valueBounds.minSteps>0) {
			//Check and set the scale
			labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
			if (!config.scaleOverride) {
				calculatedScale = calculateScale(1, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
				msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, true, true, true, true, "HorizontalStackedBar");
			} else {
				var scaleStartValue= setOptionValue("SCALESTARTVALUE",ctx,data,statData,undefined,config.scaleStartValue,-1,-1,{nullValue : true} );
				var scaleSteps =setOptionValue("SCALESTEPS",ctx,data,statData,undefined,config.scaleSteps,-1,-1,{nullValue : true} );
				var scaleStepWidth = setOptionValue("SCALESTEPWIDTH",ctx,data,statData,undefined,config.scaleStepWidth,-1,-1,{nullValue : true} );

				calculatedScale = {
					steps: scaleSteps,
					stepValue: scaleStepWidth,
					graphMin: scaleStartValue,
					labels: []
				}
				for (var i = 0; i <= calculatedScale.steps; i++) {
					if (labelTemplateString) {
						calculatedScale.labels.push(tmpl(labelTemplateString, {
							value: fmtChartJS(config, 1 * ((scaleStartValue + (scaleStepWidth * i)).toFixed(getDecimalPlaces(scaleStepWidth))), config.fmtYLabel)
						},config));
					}
				}
				msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, true, true, true, true, "HorizontalStackedBar");
			}
			msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
			msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;
			scaleHop = Math.floor(msr.availableHeight / data.labels.length);
			valueHop = Math.floor(msr.availableWidth / (calculatedScale.steps));
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / (calculatedScale.steps));
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - (calculatedScale.steps * valueHop));
			msr.availableWidth = (calculatedScale.steps) * valueHop;
			msr.availableHeight = (data.labels.length) * scaleHop;
			yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
			xAxisPosY = msr.topNotUsableSize + msr.availableHeight + config.scaleTickSizeTop;
			barWidth = (scaleHop - config.scaleGridLineWidth * 2 - (config.barValueSpacing * 2) - (config.barDatasetSpacing * data.datasets.length - 1) - (config.barStrokeWidth / 2) - 1);
			if(barWidth>=0 && barWidth<=1)barWidth=1;
			if(barWidth<0 && barWidth>=-1)barWidth=-1;
			drawLabels();
			zeroY=  HorizontalCalculateOffset(0 , calculatedScale, scaleHop);
			initPassVariableData_part2(statData,data,config,ctx,{ 
				yAxisPosX : yAxisPosX,
				xAxisPosY : xAxisPosY,
				barWidth : barWidth,
				zeroY : zeroY,
				scaleHop : scaleHop,
				valueHop : valueHop,
				calculatedScale : calculatedScale
			});
			
			animationLoop(config, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);
		} else {
			testRedraw(ctx,data,config);
		}
		function HorizontalCalculateOffset(val, calculatedScale, scaleHop) {
			var outerValue = calculatedScale.steps * calculatedScale.stepValue;
			var adjustedValue = val - calculatedScale.graphMin;
			var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
			return (scaleHop * calculatedScale.steps) * scalingFactor;
		};

		function drawBars(animPc) {
			ctx.lineWidth = config.barStrokeWidth;
			for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					var currentAnimPc = animationCorrection(animPc, data, config, i, j, 1).animVal;
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					if ((typeof(data.datasets[i].data[j]) == 'undefined') || 1*data.datasets[i].data[j] == 0 ) continue;
					if(config.animationByDataset) {
						var leftBar= statData[i][j].xPosLeft;
						var rightBar= statData[i][j].xPosRight;
						rightBar=leftBar+currentAnimPc*(rightBar-leftBar);
					} else {
						var leftBar=statData[statData[i][j].firstNotMissing][j].xPosLeft + currentAnimPc*(statData[i][j].xPosLeft-statData[statData[i][j].firstNotMissing][j].xPosLeft);
						var rightBar=statData[statData[i][j].firstNotMissing][j].xPosLeft + currentAnimPc*(statData[i][j].xPosRight-statData[statData[i][j].firstNotMissing][j].xPosLeft);
					}
					ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data.datasets[i].fillColor,config.defaultFillColor,i,j,{animationValue: currentAnimPc, xPosLeft : leftBar, yPosBottom : statData[i][j].yPosBottom, xPosRight : rightBar, yPosTop : statData[i][j].yPosBottom} );

					ctx.strokeStyle=setOptionValue("STROKECOLOR",ctx,data,statData,data.datasets[i].strokeColor,config.defaultStrokeColor,i,j,{nullvalue : null} );

					if(currentAnimPc !=0 && statData[i][j].xPosLeft!=statData[i][j].xPosRight ) {
						ctx.beginPath();
						ctx.moveTo(leftBar, statData[i][j].yPosTop);
						ctx.lineTo(rightBar, statData[i][j].yPosTop);
						ctx.lineTo(rightBar, statData[i][j].yPosBottom);
						ctx.lineTo(leftBar, statData[i][j].yPosBottom);
						ctx.lineTo(leftBar, statData[i][j].yPosTop);
						if (config.barShowStroke){  
							ctx.setLineDash(lineStyleFn(setOptionValue("STROKESTYLE",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
							ctx.stroke(); 
							ctx.setLineDash([]);
						}
						ctx.closePath();
						ctx.fill();
					}
				}
			}
			if (animPc >= config.animationStopValue) {
				var yPos = 0,
					xPos = 0;
				for (var i = 0; i < data.datasets.length; i++) {
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						if ((typeof(data.datasets[i].data[j]) == 'undefined')) continue;
						if (setOptionValue("ANNOTATEDISPLAY",ctx,data,statData,undefined,config.annotateDisplay,i,j,{nullValue : true})) {
							jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["RECT", i ,j, statData];
						}
						if(setOptionValue("INGRAPHDATASHOW",ctx,data,statData,undefined,config.inGraphDataShow,i,j,{nullValue : true})) {
							ctx.save();
							ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,j,{nullValue: true  });
							ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,j,{nullValue : true} );
							ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,j,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,j,{nullValue : true} );
							ctx.fillStyle = setOptionValue("INGRAPHDATAFONTCOLOR",ctx,data,statData,undefined,config.inGraphDataFontColor,i,j,{nullValue : true} );
							var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,j,{nullValue : true} ),statData[i][j],config);
							ctx.beginPath();
							yPos = 0;
							xPos = 0;
							if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 1) {
								xPos = statData[i][j].xPosLeft + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 2) {
								xPos = statData[i][j].xPosLeft + (statData[i][j].xPosRight-statData[i][j].xPosLeft)/2 + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 3) {
								xPos = statData[i][j].xPosRight + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							}
							if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 1) {
								yPos = statData[i][j].yPosBottom - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 2) {
								yPos = statData[i][j].yPosBottom - barWidth / 2 - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 3) {
								yPos = statData[i][j].yPosTop - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							}
//								if(xPos<=msr.availableWidth+msr.leftNotUsableSize) {
								ctx.translate(xPos, yPos);
								ctx.rotate(setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,j,{nullValue : true} ) * (Math.PI / 180));
								ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ),true);
								ctx.restore();
//							}
						}
					}
				}
			}
			if(msr.legendMsr.dispLegend)drawLegend(msr.legendMsr,data,config,ctx,"HorizontalStackedBar");
		};

		function drawScale() {
			//X axis line                                                          
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
			ctx.beginPath();
			ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
			ctx.lineTo(yAxisPosX + msr.availableWidth, xAxisPosY);
			ctx.stroke();
			ctx.setLineDash([]);
			
			ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
			for (var i = ((config.showYAxisMin) ? -1 : 0); i < calculatedScale.steps; i++) {
				if (i >= 0) {
					ctx.beginPath();
					ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
					ctx.lineWidth = config.scaleGridLineWidth;
					ctx.strokeStyle = config.scaleGridLineColor;
					//Check i isnt 0, so we dont go over the Y axis twice.
					if (config.scaleShowGridLines && i > 0 && i % config.scaleXGridLinesStep == 0) {
						ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
					} else {
						ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
					}
					ctx.stroke();
				}
				ctx.setLineDash([]);
			}
			//Y axis
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
			ctx.beginPath();
			ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
			ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
			for (var j = 0; j < data.labels.length; j++) {
				ctx.beginPath();
				ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
				ctx.lineWidth = config.scaleGridLineWidth;
				ctx.strokeStyle = config.scaleGridLineColor;
				if (config.scaleShowGridLines && (j+1) % config.scaleYGridLinesStep == 0) {
					ctx.lineTo(yAxisPosX + msr.availableWidth, xAxisPosY - ((j + 1) * scaleHop));
				} else {
					ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
				}
				ctx.stroke();
			}
			ctx.setLineDash([]);
		};

		function drawLabels() {
			ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
			//X axis line                                                          
			if (config.scaleShowLabels && (config.xAxisTop || config.xAxisBottom)) {
				ctx.textBaseline = "top";
				if (msr.rotateLabels > 90) {
					ctx.save();
					ctx.textAlign = "left";
				} else if (msr.rotateLabels > 0) {
					ctx.save();
					ctx.textAlign = "right";
				} else {
					ctx.textAlign = "center";
				}
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					for (var i = ((config.showYAxisMin) ? -1 : 0); i < calculatedScale.steps; i++) {
						ctx.save();
						if (msr.rotateLabels > 0) {
							ctx.translate(yAxisPosX + (i + 1) * valueHop - msr.highestXLabel / 2, msr.xLabelPos);
							ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
							ctx.fillTextMultiLine(calculatedScale.labels[i + 1], 0, 0, ctx.textBaseline, config.scaleFontSize,true);
						} else {
							ctx.fillTextMultiLine(calculatedScale.labels[i + 1], yAxisPosX + ((i + 1) * valueHop), msr.xLabelPos, ctx.textBaseline, config.scaleFontSize,true);
						}
						ctx.restore();
					}
				}
			}
			//Y axis
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			for (var j = 0; j < data.labels.length; j++) {
				if (config.yAxisLeft) {
					ctx.textAlign = "right";
					ctx.fillTextMultiLine(fmtChartJS(config, data.labels[j], config.fmtXLabel), yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop) + barWidth / 2, ctx.textBaseline, config.scaleFontSize,true);
				}
				if (config.yAxisRight) {
					ctx.textAlign = "left";
					ctx.fillTextMultiLine(fmtChartJS(config, data.labels[j], config.fmtXLabel), yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop) + barWidth / 2, ctx.textBaseline, config.scaleFontSize,true);
				}
			}
		};

		function getValueBounds() {
			var upperValue = -Number.MAX_VALUE;
			var lowerValue = Number.MAX_VALUE;
			var minvl = new Array(data.datasets.length);
			var maxvl = new Array(data.datasets.length);
			for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					var k = i;
					var tempp = 0;
					var tempn = 0;
					if (!(typeof(data.datasets[0].data[j]) == 'undefined')) {
						if(1 * data.datasets[0].data[j] > 0) {
							tempp += 1 * data.datasets[0].data[j];
							if (tempp > upperValue) {
								upperValue = tempp;
							};
							if (tempp < lowerValue) {
								lowerValue = tempp;
							};
						} else {
							tempn += 1 * data.datasets[0].data[j];
							if (tempn > upperValue) {
								upperValue = tempn;
							};
							if (tempn < lowerValue) {
								lowerValue = tempn;
							};
						}
					}
					while (k > 0) { //get max of stacked data
						if (!(typeof(data.datasets[k].data[j]) == 'undefined')) {
							if(1 * data.datasets[k].data[j] > 0) {
								tempp += 1 * data.datasets[k].data[j];
								if (tempp > upperValue) {
									upperValue = tempp;
								};
								if (tempp < lowerValue) {
									lowerValue = tempp;
								};
							} else {
								tempn += 1 * data.datasets[k].data[j];
								if (tempn > upperValue) {
									upperValue = tempn;
								};
								if (tempn < lowerValue) {
									lowerValue = tempn;
								};
							}
						}
						k--;
					}
				}
			};
			if(typeof config.graphMin=="function")lowerValue= setOptionValue("GRAPHMIN",ctx,data,statData,undefined,config.graphMin,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
			if(typeof config.graphMax=="function") upperValue= setOptionValue("GRAPHMAX",ctx,data,statData,undefined,config.graphMax,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMax)) upperValue = config.graphMax;
			if(upperValue<lowerValue){upperValue=0;lowerValue=0;}
			if (Math.abs(upperValue - lowerValue) < config.zeroValue) {
				if(Math.abs(upperValue)< config.zeroValue) upperValue = .9;
				if(upperValue>0) {
					upperValue=upperValue*1.1;
					lowerValue=lowerValue*0.9;
				} else {
					upperValue=upperValue*0.9;
					lowerValue=lowerValue*1.1;
				}
			}
			labelHeight = config.scaleFontSize;
			scaleHeight = msr.availableHeight;
			var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
			return {
				maxValue: upperValue,
				minValue: lowerValue,
				maxSteps: maxSteps,
				minSteps: minSteps
			};


		};
	};
	var Bar = function(data, config, ctx) {
		var maxSize, scaleHop, scaleHop2, calculatedScale, calculatedScale2, labelHeight, scaleHeight, valueBounds, labelTemplateString, labelTemplateString2, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0,
			msr;
	
		ctx.tpchart="Bar";
	        if (!init_and_start(ctx,data,config)) return;
		var statData=initPassVariableData_part1(data,config,ctx);

		var nrOfBars = data.datasets.length;
		for (var i = 0; i < data.datasets.length; i++) {
			if (data.datasets[i].type == "Line") { statData[i][0].tpchart="Line";nrOfBars--;}
			else statData[i][0].tpchart="Bar";	
		}                               


		// change the order (at first all bars then the lines) (form of BubbleSort)
		var bufferDataset, l = 0;
		

		msr = setMeasures(data, config, ctx, height, width, "nihil", [""], true, false, true, true, true, "Bar");
		valueBounds = getValueBounds();
		if(valueBounds.minValue<=0)config.logarithmic=false;
		if(valueBounds.maxSteps>0 && valueBounds.minSteps>0) {

			// true or fuzzy (error for negativ values (included 0))
			if (config.logarithmic !== false) {
				if (valueBounds.minValue <= 0) {
					config.logarithmic = false;
				}
			}
			if (config.logarithmic2 !== false) {
				if (valueBounds.minValue2 <= 0) {
					config.logarithmic2 = false;
				}
			}
			// Check if logarithmic is meanigful
			var OrderOfMagnitude = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue)));
			if ((config.logarithmic == 'fuzzy' && OrderOfMagnitude < 4) || config.scaleOverride) {
				config.logarithmic = false;
			}
			// Check if logarithmic is meanigful
			var OrderOfMagnitude2 = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue2) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue2)));
			if ((config.logarithmic2 == 'fuzzy' && OrderOfMagnitude2 < 4) || config.scaleOverride2) {
				config.logarithmic2 = false;
			}

			//Check and set the scale
			labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
			labelTemplateString2 = (config.scaleShowLabels2) ? config.scaleLabel2 : "";
			if (!config.scaleOverride) {
				calculatedScale = calculateScale(1, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
			} else {
				var scaleStartValue= setOptionValue("SCALESTARTVALUE",ctx,data,statData,undefined,config.scaleStartValue,-1,-1,{nullValue : true} );
				var scaleSteps =setOptionValue("SCALESTEPS",ctx,data,statData,undefined,config.scaleSteps,-1,-1,{nullValue : true} );
				var scaleStepWidth = setOptionValue("SCALESTEPWIDTH",ctx,data,statData,undefined,config.scaleStepWidth,-1,-1,{nullValue : true} );

				calculatedScale = {
					steps: scaleSteps,
					stepValue: scaleStepWidth,
					graphMin: scaleStartValue,
					graphMax: scaleStartValue + scaleSteps * scaleStepWidth,
					labels: []
				}
				populateLabels(1, config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, scaleStartValue, calculatedScale.graphMax, scaleStepWidth);
			}
			if (valueBounds.dbAxis) {
				if (!config.scaleOverride2) {
					calculatedScale2 = calculateScale(2, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue2, valueBounds.minValue2, labelTemplateString);
				} else {
					var scaleStartValue2= setOptionValue("SCALESTARTVALUE2",ctx,data,statData,undefined,config.scaleStartValue2,-1,-1,{nullValue : true} );
					var scaleSteps2 =setOptionValue("SCALESTEPS2",ctx,data,statData,undefined,config.scaleSteps2,-1,-1,{nullValue : true} );
					var scaleStepWidth2 = setOptionValue("SCALESTEPWIDTH2",ctx,data,statData,undefined,config.scaleStepWidth2,-1,-1,{nullValue : true} );

					calculatedScale2 = {
						steps: scaleSteps2,
						stepValue: scaleStepWidth2,
						graphMin: scaleStartValue2,
						graphMax: scaleStartValue2 + scaleSteps2 * scaleStepWidth2,
						labels: []
					}
					populateLabels(2, config, labelTemplateString2, calculatedScale2.labels, calculatedScale2.steps, scaleStartValue2, calculatedScale2.graphMax, scaleStepWidth2);
				}
			} else {
				calculatedScale2 = {
					steps: 0,
					stepValue: 0,
					graphMin: 0,
					graphMax: 0,
					labels: null
				}
			}
			msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, calculatedScale2.labels, true, false, true, true, true, "Bar");

			var prevHeight=msr.availableHeight;

			msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
			msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;
			scaleHop = Math.floor(msr.availableHeight / calculatedScale.steps);
			scaleHop2 = Math.floor(msr.availableHeight / calculatedScale2.steps);
			valueHop = Math.floor(msr.availableWidth / (data.labels.length));
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / data.labels.length);
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - ((data.labels.length) * valueHop));
			msr.availableWidth = (data.labels.length) * valueHop;
			msr.availableHeight = (calculatedScale.steps) * scaleHop;
			msr.xLabelPos+=(config.scaleTickSizeBottom + config.scaleTickSizeTop - (prevHeight-msr.availableHeight));
			msr.clrheight+=(config.scaleTickSizeBottom + config.scaleTickSizeTop - (prevHeight-msr.availableHeight));

			yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
			xAxisPosY = msr.topNotUsableSize + msr.availableHeight + config.scaleTickSizeTop;
			barWidth = (valueHop - config.scaleGridLineWidth * 2 - (config.barValueSpacing * 2) - (config.barDatasetSpacing * nrOfBars - 1) - ((config.barStrokeWidth / 2) * nrOfBars - 1)) / nrOfBars;
			if(barWidth>=0 && barWidth<=1)barWidth=1;
			if(barWidth<0 && barWidth>=-1)barWidth=-1;
			var zeroY = 0;
			var zeroY2 = 0;
			if (valueBounds.minValue < 0) {
				var zeroY = calculateOffset(config.logarithmic, 0, calculatedScale, scaleHop);
			}
			if (valueBounds.minValue2 < 0) {
				var zeroY2 = calculateOffset(config.logarithmic2, 0, calculatedScale2, scaleHop2);
			}
			initPassVariableData_part2(statData,data,config,ctx,{ 
				msr: msr,
				yAxisPosX : yAxisPosX,
				xAxisPosY : xAxisPosY,
				valueHop : valueHop,
				barWidth : barWidth,
				zeroY : zeroY,
				zeroY2 : zeroY2,
				calculatedScale : calculatedScale,
				calculatedScale2 : calculatedScale2,
				scaleHop : scaleHop,	
				scaleHop2 : scaleHop2	
			});
			drawLabels();
			animationLoop(config, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);
		} else {
			testRedraw(ctx,data,config);
		}

		function drawBars(animPc) {
			var t1, t2, t3;


			ctx.lineWidth = config.barStrokeWidth;
			for (var i = 0; i < data.datasets.length; i++) {
				if(data.datasets[i].type=="Line") continue;
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						var currentAnimPc = animationCorrection(animPc, data, config, i, j, 1).animVal;
						if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
						var barHeight = currentAnimPc * (statData[i][j].barHeight) + (config.barStrokeWidth / 2);
						ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data.datasets[i].fillColor,config.defaultFillColor,i,j,{animationValue: currentAnimPc, xPosLeft : statData[i][j].xPosLeft, yPosBottom : statData[i][j].yPosBottom, xPosRight : statData[i][j].xPosLeft+barWidth, yPosTop : statData[i][j].yPosBottom-barHeight} );
						ctx.strokeStyle=setOptionValue("STROKECOLOR",ctx,data,statData,data.datasets[i].strokeColor,config.defaultStrokeColor,i,j,{nullvalue : null} );
						roundRect(ctx, statData[i][j].xPosLeft, statData[i][j].yPosBottom, barWidth, barHeight, config.barShowStroke, config.barBorderRadius,i,j);
					}
				}
			}
			drawLinesDataset(animPc, data, config, ctx, statData,{xAxisPosY : xAxisPosY,yAxisPosX : yAxisPosX, valueHop : valueHop, nbValueHop : data.labels.length });

			if (animPc >= config.animationStopValue) {

				for (var i = 0; i < data.datasets.length; i++) {
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						if (data.datasets[i].type == "Line") continue;
						if(setOptionValue("ANNOTATEDISPLAY",ctx,data,statData,undefined,config.annotateDisplay,i,j,{nullValue : true}))
							jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["RECT", i , j, statData];
						if(setOptionValue("INGRAPHDATASHOW",ctx,data,statData,undefined,config.inGraphDataShow,i,j,{nullValue : true})) {
							ctx.save();
							ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,j,{nullValue: true  });
							ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,j,{nullValue : true} );
							ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,j,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,j,{nullValue : true} );
							ctx.fillStyle = setOptionValue("INGRAPHDATAFONTCOLOR",ctx,data,statData,undefined,config.inGraphDataFontColor,i,j,{nullValue : true} );
							t1 = statData[i][j].yPosBottom;
							t2 = statData[i][j].yPosTop;
							ctx.beginPath();
							var yPos = 0,
								xPos = 0;
							if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 1) {
								xPos = statData[i][j].xPosLeft + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 2) {
								xPos = statData[i][j].xPosLeft + barWidth / 2 + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 3) {
								xPos = statData[i][j].xPosLeft + barWidth + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							}
							if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 1) {
								yPos = statData[i][j].yPosBottom - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 2) {
								yPos = (statData[i][j].yPosBottom+statData[i][j].yPosTop)/2 - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 3) {
								yPos = statData[i][j].yPosTop - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							}
							ctx.translate(xPos, yPos);
							var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,j,{nullValue : true} ), statData[i][j],config);
							ctx.rotate(setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,j,{nullValue : true} ) * (Math.PI / 180));
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ),true);
							ctx.restore();
						}
					}
				}
			}
			if (animPc >= 1 && typeof drawMath == "function") {
				drawMath(ctx, config, data, msr, {
					xAxisPosY: xAxisPosY,
					yAxisPosX: yAxisPosX,
					valueHop: valueHop,
					scaleHop: scaleHop,
					zeroY: zeroY,
					calculatedScale: calculatedScale,
					calculateOffset: calculateOffset,
					barWidth: barWidth
				});
			}
			if(msr.legendMsr.dispLegend)drawLegend(msr.legendMsr,data,config,ctx,"Bar");
		};

		function roundRect(ctx, x, y, w, h, stroke, radius,i,j) {
			ctx.beginPath();
			ctx.setLineDash(lineStyleFn(setOptionValue("STROKESTYLE",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + w - radius, y);
			ctx.quadraticCurveTo(x + w, y, x + w, y);
			ctx.lineTo(x + w, y - h + radius);
			ctx.quadraticCurveTo(x + w, y - h, x + w - radius, y - h);
			ctx.lineTo(x + radius, y - h);
			ctx.quadraticCurveTo(x, y - h, x, y - h + radius);
			ctx.lineTo(x, y);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			if (stroke) ctx.stroke();
			ctx.closePath();
			ctx.fill();
			ctx.setLineDash([]);
		};

		function drawScale() {
			//X axis line                                                          
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.setLineDash(lineStyleFn(config.scaleLineStyle));

			ctx.beginPath();
			ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
			ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY);
			ctx.stroke();
			ctx.setLineDash([]);
			
			ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
			for (var i = 0; i < data.labels.length; i++) {
				ctx.beginPath();
				ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
				ctx.lineWidth = config.scaleGridLineWidth;
				ctx.strokeStyle = config.scaleGridLineColor;
				//Check i isnt 0, so we dont go over the Y axis twice.
				if (config.scaleShowGridLines && i > 0 && i % config.scaleXGridLinesStep == 0) {
					ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
				} else {
					ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
				}
				ctx.stroke();
			}
			ctx.setLineDash([]);
			
			//Y axis
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
			ctx.beginPath();
			ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
			ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
			ctx.stroke();
			ctx.setLineDash([]);
			
			ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
			for (var j = 0; j < calculatedScale.steps; j++) {
				ctx.beginPath();
				ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
				ctx.lineWidth = config.scaleGridLineWidth;
				ctx.strokeStyle = config.scaleGridLineColor;
				if (config.scaleShowGridLines && (j+1) % config.scaleYGridLinesStep == 0) {
					ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY - ((j + 1) * scaleHop));
				} else {
					ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
				}
				ctx.stroke();
			}
			ctx.setLineDash([]);
		};

		function drawLabels() {
			ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
			//X axis line                                                          
			if (config.xAxisTop || config.xAxisBottom) {
				ctx.textBaseline = "top";
				if (msr.rotateLabels > 90) {
					ctx.save();
					ctx.textAlign = "left";
				} else if (msr.rotateLabels > 0) {
					ctx.save();
					ctx.textAlign = "right";
				} else {
					ctx.textAlign = "center";
				}
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					for (var i = 0; i < data.labels.length; i++) {
						ctx.save();
						if (msr.rotateLabels > 0) {

							ctx.translate(yAxisPosX + i * valueHop + (valueHop / 2) - msr.highestXLabel / 2, msr.xLabelPos);
							ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
							ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), 0, 0, ctx.textBaseline, config.scaleFontSize,true);
						} else {
							ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), yAxisPosX + i * valueHop + (valueHop / 2), msr.xLabelPos, ctx.textBaseline, config.scaleFontSize,true);
						}
						ctx.restore();
					}
				}
			}
			//Y axis
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			for (var j = ((config.showYAxisMin) ? -1 : 0); j < calculatedScale.steps; j++) {
				if (config.scaleShowLabels) {
					if (config.yAxisLeft) {
						ctx.textAlign = "right";
						ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop), ctx.textBaseline, config.scaleFontSize,true);
					}
					if (config.yAxisRight && !valueBounds.dbAxis) {
						ctx.textAlign = "left";
						ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop), ctx.textBaseline, config.scaleFontSize,true);
					}
				}
			}
			if (config.yAxisRight && valueBounds.dbAxis) {
				for (var j = ((config.showYAxisMin) ? -1 : 0); j < calculatedScale2.steps; j++) {
					if (config.scaleShowLabels) {
						ctx.textAlign = "left";
						ctx.fillTextMultiLine(calculatedScale2.labels[j + 1], yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop2), ctx.textBaseline, config.scaleFontSize,true);
					}
				}
			}
		};

		function getValueBounds() {
			var upperValue = -Number.MAX_VALUE;
			var lowerValue = Number.MAX_VALUE;
			var upperValue2 = -Number.MAX_VALUE;
			var lowerValue2 = Number.MAX_VALUE;
			var secondAxis = false;
			var firstAxis = false;
			
			for (var i = 0; i < data.datasets.length; i++) {
				var mathFctName = data.datasets[i].drawMathDeviation;
				var mathValueHeight = 0;
				if (typeof eval(mathFctName) == "function") {
					var parameter = {
						data: data,
						datasetNr: i
					};
					mathValueHeight = window[mathFctName](parameter);
				}
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					if(typeof data.datasets[i].data[j]=="undefined")continue;
					if (data.datasets[i].axis == 2) {
						secondAxis = true;
						if (1 * data.datasets[i].data[j] + mathValueHeight > upperValue2) {
							upperValue2 = 1 * data.datasets[i].data[j] + mathValueHeight;
						};
						if (1 * data.datasets[i].data[j] - mathValueHeight < lowerValue2) {
							lowerValue2 = 1 * data.datasets[i].data[j] - mathValueHeight;
						};
					} else {
						firstAxis=true;
						if (1 * data.datasets[i].data[j] + mathValueHeight > upperValue) {
							upperValue = 1 * data.datasets[i].data[j] + mathValueHeight;
						};
						if (1 * data.datasets[i].data[j] - mathValueHeight < lowerValue) {
							lowerValue = 1 * data.datasets[i].data[j] - mathValueHeight;
						};
					}
				}
			};
			if(upperValue<lowerValue){upperValue=0;lowerValue=0;}
			if (Math.abs(upperValue - lowerValue) < config.zeroValue) {
				if(Math.abs(upperValue)< config.zeroValue) upperValue = .9;
				if(upperValue>0) {
					upperValue=upperValue*1.1;
					lowerValue=lowerValue*0.9;
				} else {
					upperValue=upperValue*0.9;
					lowerValue=lowerValue*1.1;
				}
			}
			if(typeof config.graphMin=="function")lowerValue= setOptionValue("GRAPHMIN",ctx,data,statData,undefined,config.graphMin,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
			if(typeof config.graphMax=="function") upperValue= setOptionValue("GRAPHMAX",ctx,data,statData,undefined,config.graphMax,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMax)) upperValue = config.graphMax;

			if (secondAxis) {
				if(upperValue2<lowerValue2){upperValue2=0;lowerValue2=0;}
				if (Math.abs(upperValue2 - lowerValue2) < config.zeroValue) {
					if(Math.abs(upperValue2)< config.zeroValue) upperValue2 = .9;
					if(upperValue2>0) {
						upperValue2=upperValue2*1.1;
						lowerValue2=lowerValue2*0.9;
					} else {
						upperValue2=upperValue2*0.9;
						lowerValue2=lowerValue2*1.1;
					}
				}
				if(typeof config.graphMin2=="function")lowerValue2= setOptionValue("GRAPHMIN",ctx,data,statData,undefined,config.graphMin2,-1,-1,{nullValue : true})
				else if (!isNaN(config.graphMin2)) lowerValue2 = config.graphMin2;
				if(typeof config.graphMax2=="function") upperValue2= setOptionValue("GRAPHMAX",ctx,data,statData,undefined,config.graphMax2,-1,-1,{nullValue : true})
				else if (!isNaN(config.graphMax2)) upperValue2 = config.graphMax2;
			}
			if (!firstAxis && secondAxis) {
				upperValue = upperValue2;
				lowerValue = lowerValue2;
			}

			labelHeight = config.scaleFontSize;
			scaleHeight = msr.availableHeight;
			var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
			return {
				maxValue: upperValue,
				minValue: lowerValue,
				maxValue2: upperValue2,
				minValue2: lowerValue2,
				dbAxis: secondAxis,
				maxSteps: maxSteps,
				minSteps: minSteps
			};
		};
	};

	var HorizontalBar = function(data, config, ctx) {
		var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0,
			msr;
		ctx.tpchart="HorizontalBar";
	        if (!init_and_start(ctx,data,config)) return;

		if (config.reverseOrder && typeof ctx.reversed == "undefined") {
			ctx.reversed=true;
			data = reverseData(data);
		}

		var statData=initPassVariableData_part1(data,config,ctx);

		msr = setMeasures(data, config, ctx, height, width, "nihil", [""], true, true, true, true, true, "StackedBar");
		valueBounds = getValueBounds();
		if(valueBounds.minValue<=0)config.logarithmic=false;
		if(valueBounds.maxSteps>0 && valueBounds.minSteps>0) {
			if (config.logarithmic !== false) {
				if (valueBounds.minValue <= 0) {
					config.logarithmic = false;
				}
			}
			//Check and set the scale
			labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
			if (!config.scaleOverride) {
				calculatedScale = calculateScale(1, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
				msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, true, true, true, true, "HorizontalBar");
			} else {
				var scaleStartValue= setOptionValue("SCALESTARTVALUE",ctx,data,statData,undefined,config.scaleStartValue,-1,-1,{nullValue : true} );
				var scaleSteps =setOptionValue("SCALESTEPS",ctx,data,statData,undefined,config.scaleSteps,-1,-1,{nullValue : true} );
				var scaleStepWidth = setOptionValue("SCALESTEPWIDTH",ctx,data,statData,undefined,config.scaleStepWidth,-1,-1,{nullValue : true} );

				calculatedScale = {
					steps: scaleSteps,
					stepValue: scaleStepWidth,
					graphMin: scaleStartValue,
					graphMax: scaleStartValue + scaleSteps * scaleStepWidth,
					labels: []
				}
				populateLabels(1, config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, scaleStartValue, calculatedScale.graphMax, scaleStepWidth);
				msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, null, true, true, true, true, true, "HorizontalBar");
			}
			msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
			msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;
			scaleHop = Math.floor(msr.availableHeight / data.labels.length);
			valueHop = Math.floor(msr.availableWidth / (calculatedScale.steps));
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / calculatedScale.steps);
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - (calculatedScale.steps * valueHop));
			msr.availableWidth = (calculatedScale.steps) * valueHop;
			msr.availableHeight = (data.labels.length) * scaleHop;
			yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
			xAxisPosY = msr.topNotUsableSize + msr.availableHeight + config.scaleTickSizeTop;
			barWidth = (scaleHop - config.scaleGridLineWidth * 2 - (config.barValueSpacing * 2) - (config.barDatasetSpacing * data.datasets.length - 1) - ((config.barStrokeWidth / 2) * data.datasets.length - 1)) / data.datasets.length;
			if(barWidth>=0 && barWidth<=1)barWidth=1;
			if(barWidth<0 && barWidth>=-1)barWidth=-1;
			var zeroY = 0;
			if (valueBounds.minValue < 0) {
				var zeroY = calculateOffset(config.logarithmic, 0, calculatedScale, valueHop);
			}
			drawLabels();
			initPassVariableData_part2(statData,data,config,ctx,{ 
				yAxisPosX : yAxisPosX,
				xAxisPosY : xAxisPosY,
				barWidth : barWidth,
				zeroY : zeroY,
				scaleHop : scaleHop,
				valueHop : valueHop,
				calculatedScale : calculatedScale
			});
			animationLoop(config, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);
		} else {
			testRedraw(ctx,data,config);
		}

		function drawBars(animPc) {
			for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					ctx.lineWidth = config.barStrokeWidth;
					var currentAnimPc = animationCorrection(animPc, data, config, i, j, 1).animVal;
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					var barHeight = currentAnimPc * statData[i][j].barWidth + (config.barStrokeWidth / 2);
					ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data.datasets[i].fillColor,config.defaultFillColor,i,j,{animationValue: currentAnimPc, xPosLeft : statData[i][j].xPosLeft, yPosBottom : statData[i][j].yPosBottom, xPosRight : statData[i][j].xPosLeft+barHeight, yPosTop : statData[i][j].yPosBottom} );
					ctx.strokeStyle=setOptionValue("STROKECOLOR",ctx,data,statData,data.datasets[i].strokeColor,config.defaultStrokeColor,i,j,{nullvalue : null} );

					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						roundRect(ctx, statData[i][j].yPosTop, statData[i][j].xPosLeft , barWidth, barHeight, config.barShowStroke, config.barBorderRadius, 0,i,j);
					}
				}
			}
			if (animPc >= config.animationStopValue) {
				for (var i = 0; i < data.datasets.length; i++) {
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						if(setOptionValue("ANNOTATEDISPLAY",ctx,data,statData,undefined,config.annotateDisplay,i,j,{nullValue : true})) {
							jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["RECT", i ,j ,statData];
                       				}
                       				if(setOptionValue("INGRAPHDATASHOW",ctx,data,statData,undefined,config.inGraphDataShow,i,j,{nullValue : true}))  {
							ctx.save();
							ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,j,{nullValue: true  });
							ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,j,{nullValue : true} );
							ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,j,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,j,{nullValue : true} );
							ctx.fillStyle = setOptionValue("INGRAPHDATAFONTCOLOR",ctx,data,statData,undefined,config.inGraphDataFontColor,i,j,{nullValue : true} );
							ctx.beginPath();
							var yPos = 0,
								xPos = 0;
							if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 1) {
								yPos = statData[i][j].yPosTop - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} ) + barWidth;
							} else if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 2) {
								yPos = statData[i][j].yPosTop + barWidth / 2 - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAYPOSITION",ctx,data,statData,undefined,config.inGraphDataYPosition,i,j,{nullValue : true} ) == 3) {
								yPos = statData[i][j].yPosTop - setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
							}
							if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 1) {
								xPos = statData[i][j].xPosLeft + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 2) {
								xPos = (statData[i][j].xPosLeft+statData[i][j].xPosRight)/2 + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							} else if (setOptionValue("INGRAPHDATAXPOSITION",ctx,data,statData,undefined,config.inGraphDataXPosition,i,j,{nullValue : true} ) == 3) {
								xPos = statData[i][j].xPosRight + setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} );
							}
							ctx.translate(xPos, yPos);
							var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,j,{nullValue : true} ), statData[i][j],config);
							ctx.rotate(setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,j,{nullValue : true} ) * (Math.PI / 180));
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ),true);
							ctx.restore();
						}
					}
				}
			}
			if(msr.legendMsr.dispLegend)drawLegend(msr.legendMsr,data,config,ctx,"HorizontalBar");
		};

		function roundRect(ctx, x, y, w, h, stroke, radius, zeroY,i,j) {
			ctx.beginPath();
			ctx.moveTo(y + zeroY, x + radius);
			ctx.lineTo(y + zeroY, x + w - radius);
			ctx.quadraticCurveTo(y + zeroY, x + w, y + zeroY, x + w);
			ctx.lineTo(y + h - radius, x + w);
			ctx.quadraticCurveTo(y + h, x + w, y + h, x + w - radius);
			ctx.lineTo(y + h, x + radius);
			ctx.quadraticCurveTo(y + h, x, y + h - radius, x);
			ctx.lineTo(y + zeroY, x);
			ctx.quadraticCurveTo(y + zeroY, x, y + zeroY, x + radius);
			if (stroke) { 
				ctx.setLineDash(lineStyleFn(setOptionValue("STROKESTYLE",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
				ctx.stroke();
				ctx.setLineDash([]);
			};
			ctx.closePath();
			ctx.fill();
		};

		function drawScale() {
			//X axis line                                                          
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
			ctx.beginPath();
			ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
			ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY);
			ctx.stroke();
			ctx.setLineDash([]);
			
			ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
			for (var i = ((config.showYAxisMin) ? -1 : 0); i < calculatedScale.steps; i++) {
				if (i >= 0) {
					ctx.beginPath();
					ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
					ctx.lineWidth = config.scaleGridLineWidth;
					ctx.strokeStyle = config.scaleGridLineColor;
					//Check i isnt 0, so we dont go over the Y axis twice.
					if (config.scaleShowGridLines && i > 0 && i % config.scaleXGridLinesStep == 0) {
						ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
					} else {
						ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
					}
					ctx.stroke();
				}

			}
			ctx.setLineDash([]);
			//Y axis
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
			ctx.beginPath();
			ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
			ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
			for (var j = 0; j < data.labels.length; j++) {
				ctx.beginPath();
				ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
				ctx.lineWidth = config.scaleGridLineWidth;
				ctx.strokeStyle = config.scaleGridLineColor;
				if (config.scaleShowGridLines && (j+1) % config.scaleYGridLinesStep == 0) {
					ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY - ((j + 1) * scaleHop));
				} else {
					ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
				}
				ctx.stroke();
			}
			ctx.setLineDash([]);
		};

		function drawLabels() {
			ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
			//X axis line                                                          
			if (config.scaleShowLabels && (config.xAxisTop || config.xAxisBottom)) {
				ctx.textBaseline = "top";
				if (msr.rotateLabels > 90) {
					ctx.save();
					ctx.textAlign = "left";
				} else if (msr.rotateLabels > 0) {
					ctx.save();
					ctx.textAlign = "right";
				} else {
					ctx.textAlign = "center";
				}
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					for (var i = ((config.showYAxisMin) ? -1 : 0); i < calculatedScale.steps; i++) {
						ctx.save();
						if (msr.rotateLabels > 0) {
							ctx.translate(yAxisPosX + (i + 1) * valueHop - msr.highestXLabel / 2, msr.xLabelPos);
							ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
							ctx.fillTextMultiLine(calculatedScale.labels[i + 1], 0, 0, ctx.textBaseline, config.scaleFontSize,true);
						} else {
							ctx.fillTextMultiLine(calculatedScale.labels[i + 1], yAxisPosX + (i + 1) * valueHop, msr.xLabelPos, ctx.textBaseline, config.scaleFontSize,true);
						}
						ctx.restore();
					}
				}
			}
			//Y axis
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			for (var j = 0; j < data.labels.length; j++) {
				if (config.yAxisLeft) {
					ctx.textAlign = "right";
					ctx.fillTextMultiLine(fmtChartJS(config, data.labels[j], config.fmtXLabel), yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - (j * scaleHop) - scaleHop / 2, ctx.textBaseline, config.scaleFontSize,true);
				}
				if (config.yAxisRight) {
					ctx.textAlign = "left";
					ctx.fillTextMultiLine(fmtChartJS(config, data.labels[j], config.fmtXLabel), yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - (j * scaleHop) - scaleHop / 2, ctx.textBaseline, config.scaleFontSize,true);
				}
			}
		};

		function getValueBounds() {
			var upperValue = -Number.MAX_VALUE;
			var lowerValue = Number.MAX_VALUE;
			for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					if(typeof data.datasets[i].data[j]=="undefined")continue;
					if (1 * data.datasets[i].data[j] > upperValue) {
						upperValue = 1 * data.datasets[i].data[j]
					};
					if (1 * data.datasets[i].data[j] < lowerValue) {
						lowerValue = 1 * data.datasets[i].data[j]
					};
				}
			};
			if(upperValue<lowerValue){upperValue=0;lowerValue=0;}
			if (Math.abs(upperValue - lowerValue) < config.zeroValue) {
				if(Math.abs(upperValue)< config.zeroValue) upperValue = .9;
				if(upperValue>0) {
					upperValue=upperValue*1.1;
					lowerValue=lowerValue*0.9;
				} else {
					upperValue=upperValue*0.9;
					lowerValue=lowerValue*1.1;
				}
			}
			// AJOUT CHANGEMENT
			if(typeof config.graphMin=="function")lowerValue= setOptionValue("GRAPHMIN",ctx,data,statData,undefined,config.graphMin,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
			if(typeof config.graphMax=="function") upperValue= setOptionValue("GRAPHMAX",ctx,data,statData,undefined,config.graphMax,-1,-1,{nullValue : true})
			else if (!isNaN(config.graphMax)) upperValue = config.graphMax;

			labelHeight = config.scaleFontSize;
			scaleHeight = msr.availableHeight;

			var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
			return {
				maxValue: upperValue,
				minValue: lowerValue,
				maxSteps: maxSteps,
				minSteps: minSteps
			};
		};
	};

	function calculateOffset(logarithmic, val, calculatedScale, scaleHop) {
		if (!logarithmic) { // no logarithmic scale
			var outerValue = calculatedScale.steps * calculatedScale.stepValue;
			var adjustedValue = val - calculatedScale.graphMin;
			var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
			return (scaleHop * calculatedScale.steps) * scalingFactor;
		} else { // logarithmic scale
			return CapValue(log10(val) * scaleHop - calculateOrderOfMagnitude(calculatedScale.graphMin) * scaleHop, undefined, 0);
		}
	};

	function animationLoop(config, drawScale, drawData, ctx, clrx, clry, clrwidth, clrheight, midPosX, midPosY, borderX, borderY, data) {
		var cntiter = 0;
		var animationCount = 1;
		var multAnim = 1;
		if (config.animationStartValue < 0 || config.animationStartValue > 1) config.animation.StartValue = 0;
		if (config.animationStopValue < 0 || config.animationStopValue > 1) config.animation.StopValue = 1;
		if (config.animationStopValue < config.animationStartValue) config.animationStopValue = config.animationStartValue;
		if (isIE() < 9 && isIE() != false) config.animation = false;
		var animFrameAmount = (config.animation) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1,
			easingFunction = animationOptions[config.animationEasing],
			percentAnimComplete = (config.animation) ? 0 : 1;
		if (config.animation && config.animationStartValue > 0 && config.animationStartValue <= 1) {
			while (percentAnimComplete < config.animationStartValue) {
				cntiter++;
				percentAnimComplete += animFrameAmount;
			}
		}
		var beginAnim = cntiter;
		var beginAnimPct = percentAnimComplete;
		if (typeof drawScale !== "function") drawScale = function() {};
		if (config.clearRect) requestAnimFrame(animLoop);
		else animLoop();

		function animateFrame() {
			var easeAdjustedAnimationPercent = (config.animation) ? CapValue(easingFunction(percentAnimComplete), null, 0) : 1;
			if (1 * cntiter >= 1 * CapValue(config.animationSteps, Number.MAX_VALUE, 1) || config.animation == false || ctx.firstPass==3 || ctx.firstPass==4 || ctx.firstPass==8 || ctx.firstPass==9) easeAdjustedAnimationPercent = 1;
			else if (easeAdjustedAnimationPercent >= 1) easeAdjustedAnimationPercent = 0.9999;
			if (config.animation && !(isIE() < 9 && isIE() != false) && config.clearRect) ctx.clearRect(clrx, clry, clrwidth, clrheight);
			dispCrossImage(ctx, config, midPosX, midPosY, borderX, borderY, false, data, easeAdjustedAnimationPercent, cntiter);
			dispCrossText(ctx, config, midPosX, midPosY, borderX, borderY, false, data, easeAdjustedAnimationPercent, cntiter);
			if (config.scaleOverlay) {
				drawData(easeAdjustedAnimationPercent);
				drawScale();
			} else {
				drawScale();
				drawData(easeAdjustedAnimationPercent);
			}
			dispCrossImage(ctx, config, midPosX, midPosY, borderX, borderY, true, data, easeAdjustedAnimationPercent, cntiter);
			dispCrossText(ctx, config, midPosX, midPosY, borderX, borderY, true, data, easeAdjustedAnimationPercent, cntiter);
		};

		function animLoop() {
			//We need to check if the animation is incomplete (less than 1), or complete (1).
			cntiter += multAnim;
			percentAnimComplete += multAnim * animFrameAmount;
			if (cntiter == config.animationSteps || config.animation == false || ctx.firstPass==3 || ctx.firstPass==4 || ctx.firstPass==8 || ctx.firstPass==9) percentAnimComplete = 1;
			else if (percentAnimComplete >= 1) percentAnimComplete = 0.999;
			animateFrame();
			//Stop the loop continuing forever
			if (multAnim == -1 && cntiter <= beginAnim) {
				if (typeof config.onAnimationComplete == "function" && ctx.runanimationcompletefunction==true) config.onAnimationComplete(ctx, config, data, 0, animationCount + 1);
				multAnim = 1;
				requestAnimFrame(animLoop);
			} else if (percentAnimComplete < config.animationStopValue) {
				requestAnimFrame(animLoop);
			} else {
				if ((animationCount < config.animationCount || config.animationCount == 0) && (ctx.firstPass ==1 || ctx.firstPass!=2)) {
					animationCount++;
					if (config.animationBackward && multAnim == 1) {
						percentAnimComplete -= animFrameAmount;
						multAnim = -1;
					} else {
						multAnim = 1;
						cntiter = beginAnim - 1;
						percentAnimComplete = beginAnimPct - animFrameAmount;
					}
					window.setTimeout(animLoop, config.animationPauseTime*1000);
				} else {
					if(!testRedraw(ctx,data,config) ) {
						if (typeof config.onAnimationComplete == "function" && ctx.runanimationcompletefunction==true) {
							config.onAnimationComplete(ctx, config, data, 1, animationCount + 1);
							ctx.runanimationcompletefunction=false;
						}
					}
				}
				
			}
		};
	};
	//Declare global functions to be called within this namespace here.
	// shim layer with setTimeout fallback
	var requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	function calculateScale(axis, config, maxSteps, minSteps, maxValue, minValue, labelTemplateString) {
		var graphMin, graphMax, graphRange, stepValue, numberOfSteps, valueRange, rangeOrderOfMagnitude, decimalNum;
		var logarithmic, yAxisMinimumInterval;
		if (axis == 2) {
			logarithmic = config.logarithmic2;
			yAxisMinimumInterval = config.yAxisMinimumInterval2;
		} else {
			logarithmic = config.logarithmic;
			yAxisMinimumInterval = config.yAxisMinimumInterval;
		}

		if (!logarithmic) { // no logarithmic scale
			valueRange = maxValue - minValue;
			rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);
			if(Math.abs(minValue)>config.zeroValue)graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
			else graphMin=0;
			if(Math.abs(maxValue)>config.zeroValue)graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
			else graphMax=0;
			if (typeof yAxisMinimumInterval == "number") {
				if(graphMax>=0) {
					graphMin = graphMin - (graphMin % yAxisMinimumInterval);
					while (graphMin > minValue) graphMin = graphMin - yAxisMinimumInterval;
					if (graphMax % yAxisMinimumInterval > config.zeroValue && graphMax % yAxisMinimumInterval < yAxisMinimumInterval - config.zeroValue) {
						graphMax = roundScale(config, (1 + Math.floor(graphMax / yAxisMinimumInterval)) * yAxisMinimumInterval);
					}
					while (graphMax < maxValue) graphMax = graphMax + yAxisMinimumInterval;
				}
			}
		} else { // logarithmic scale
			if(minValue==maxValue)maxValue=maxValue+1;
			if(minValue==0)minValue=0.01;
			var minMag = calculateOrderOfMagnitude(minValue);
			var maxMag = calculateOrderOfMagnitude(maxValue) + 1;
			graphMin = Math.pow(10, minMag);
			graphMax = Math.pow(10, maxMag);
			rangeOrderOfMagnitude = maxMag - minMag;
		}
		graphRange = graphMax - graphMin;
		stepValue = Math.pow(10, rangeOrderOfMagnitude);
		numberOfSteps = Math.round(graphRange / stepValue);
		if (!logarithmic) { // no logarithmic scale
			//Compare number of steps to the max and min for that size graph, and add in half steps if need be.
			var stopLoop = false;
			while (!stopLoop && (numberOfSteps < minSteps || numberOfSteps > maxSteps)) {
				if (numberOfSteps < minSteps) {
					if (typeof yAxisMinimumInterval == "number") {
						if (stepValue / 2 < yAxisMinimumInterval) stopLoop = true;
					}
					if (!stopLoop) {
						stepValue /= 2;
						numberOfSteps = Math.round(graphRange / stepValue);
					}
				} else {
					stepValue *= 2;
					numberOfSteps = Math.round(graphRange / stepValue);
				}
			}

			if (typeof yAxisMinimumInterval == "number") {
				if (stepValue < yAxisMinimumInterval) {
					stepValue = yAxisMinimumInterval;
					numberOfSteps = Math.ceil(graphRange / stepValue);
				}
				if (stepValue % yAxisMinimumInterval > config.zeroValue && stepValue % yAxisMinimumInterval < yAxisMinimumInterval - config.zeroValue) {
					if ((2 * stepValue) % yAxisMinimumInterval < config.zeroValue || (2 * stepValue) % yAxisMinimumInterval > yAxisMinimumInterval - config.zeroValue) {
						stepValue = 2 * stepValue;
						numberOfSteps = Math.ceil(graphRange / stepValue);
					} else {
						stepValue = roundScale(config, (1 + Math.floor(stepValue / yAxisMinimumInterval)) * yAxisMinimumInterval);
						numberOfSteps = Math.ceil(graphRange / stepValue);
					}
				}
			}
			if(config.graphMaximized==true || config.graphMaximized=="bottom" || typeof config.graphMin!=="undefined") {
				while (graphMin+stepValue < minValue && numberOfSteps>=3){graphMin+=stepValue;numberOfSteps--};
			}
			if(config.graphMaximized==true || config.graphMaximized=="top" || typeof config.graphMax!=="undefined") {

				while (graphMin+(numberOfSteps-1)*stepValue >= maxValue && numberOfSteps>=3) numberOfSteps--;
			}
		} else { // logarithmic scale
			numberOfSteps = rangeOrderOfMagnitude; // so scale is 10,100,1000,...
		}
		var labels = [];
		populateLabels(1, config, labelTemplateString, labels, numberOfSteps, graphMin, graphMax, stepValue);
		return {
			steps: numberOfSteps,
			stepValue: stepValue,
			graphMin: graphMin,
			labels: labels,
			maxValue: maxValue
		}
	};

	function roundScale(config, value) {
		var scldec = 0;
		var sscl = "" + config.yAxisMinimumInterval;
		if (sscl.indexOf(".") > 0) {
			scldec = sscl.substr(sscl.indexOf(".")).length;
		}
		return (Math.round(value * Math.pow(10, scldec)) / Math.pow(10, scldec));
	} ;

	function calculateOrderOfMagnitude(val) {
		if (val==0)return 0;
		return Math.floor(Math.log(val) / Math.LN10);
	};
	//Populate an array of all the labels by interpolating the string.
	function populateLabels(axis, config, labelTemplateString, labels, numberOfSteps, graphMin, graphMax, stepValue) {
		var logarithmic;
		if (axis == 2) {
			logarithmic = config.logarithmic2;
			fmtYLabel = config.fmtYLabel2;
		} else {
			logarithmic = config.logarithmic;
			fmtYLabel = config.fmtYLabel;
		}
		if (labelTemplateString) {
			//Fix floating point errors by setting to fixed the on the same decimal as the stepValue.
			if (!logarithmic) { // no logarithmic scale
				for (var i = 0; i < numberOfSteps + 1; i++) {
					labels.push(tmpl(labelTemplateString, {
						value: fmtChartJS(config, 1 * ((graphMin + (stepValue * i)).toFixed(getDecimalPlaces(stepValue))), fmtYLabel)
					},config));
				}
			} else { // logarithmic scale 10,100,1000,...
				var value = graphMin;
				for (var i = 0; i < numberOfSteps + 1; i++) {
					labels.push(tmpl(labelTemplateString, {
						value: fmtChartJS(config, 1 * value.toFixed(getDecimalPlaces(value)), fmtYLabel)
					},config));
					value *= 10;
				}
			}
		}
	};
	//Max value from array
	function Max(array) {
		return Math.max.apply(Math, array);
	};
	//Min value from array
	function Min(array) {
		return Math.min.apply(Math, array);
	};
	//Default if undefined
	function Default(userDeclared, valueIfFalse) {
		if (!userDeclared) {
			return valueIfFalse;
		} else {
			return userDeclared;
		}
	};
	//Apply cap a value at a high or low number
	function CapValue(valueToCap, maxValue, minValue) {
		if (isNumber(maxValue)) {
			if (valueToCap > maxValue) {
				return maxValue;
			}
		}
		if (isNumber(minValue)) {
			if (valueToCap < minValue) {
				return minValue;
			}
		}
		return valueToCap;
	};

	function getDecimalPlaces(num) {
		var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match) { 
			return 0;
		}
		return Math.max(
			0,
			(match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
		);
	};

	function mergeChartConfig(defaults, userDefined) {
		var returnObj = {};
		for (var attrname in defaults) {
			returnObj[attrname] = defaults[attrname];
		}
		for (var attrname in userDefined) {
			returnObj[attrname] = userDefined[attrname];
		}
		return returnObj;
	};
	//Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
	var cache = {};
	
	function tmpl(str, data,config) {
		newstr=str;
		if(newstr.substr(0,config.templatesOpenTag.length)==config.templatesOpenTag)newstr="<%="+newstr.substr(config.templatesOpenTag.length,newstr.length-config.templatesOpenTag.length);
		if(newstr.substr(newstr.length-config.templatesCloseTag.length,config.templatesCloseTag.length)==config.templatesCloseTag)newstr=newstr.substr(0,newstr.length-config.templatesCloseTag.length)+"%>";
		return tmplpart2(newstr,data);
	}

	function tmplpart2(str, data) {
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
			cache[str] = cache[str] ||
			tmplpart2(document.getElementById(str).innerHTML) :
			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			new Function("obj",
				"var p=[],print=function(){p.push.apply(p,arguments);};" +
				// Introduce the data as local variables using with(){}
				"with(obj){p.push('" +
				// Convert the template into pure JavaScript
				str
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'") + "');}return p.join('');");
		// Provide some basic currying to the user
		return data ? fn(data) : fn;
	};

	function dispCrossText(ctx, config, posX, posY, borderX, borderY, overlay, data, animPC, cntiter) {
		var i, disptxt, txtposx, txtposy, textAlign, textBaseline;
		for (i = 0; i < config.crossText.length; i++) {
			if (config.crossText[i] != "" && config.crossTextOverlay[Min([i, config.crossTextOverlay.length - 1])] == overlay && ((cntiter == 1 && config.crossTextIter[Min([i, config.crossTextIter.length - 1])] == "first") || config.crossTextIter[Min([i, config.crossTextIter.length - 1])] == cntiter || config.crossTextIter[Min([i, config.crossTextIter.length - 1])] == "all" || (animPC == 1 && config.crossTextIter[Min([i, config.crossTextIter.length - 1])] == "last"))) {
				ctx.save();
				ctx.beginPath();
				ctx.font = config.crossTextFontStyle[Min([i, config.crossTextFontStyle.length - 1])] + " " + config.crossTextFontSize[Min([i, config.crossTextFontSize.length - 1])] + "px " + config.crossTextFontFamily[Min([i, config.crossTextFontFamily.length - 1])];
				ctx.fillStyle = config.crossTextFontColor[Min([i, config.crossTextFontColor.length - 1])];
				textAlign = config.crossTextAlign[Min([i, config.crossTextAlign.length - 1])];
				textBaseline = config.crossTextBaseline[Min([i, config.crossTextBaseline.length - 1])];
				txtposx = 1 * config.crossTextPosX[Min([i, config.crossTextPosX.length - 1])];
				txtposy = 1 * config.crossTextPosY[Min([i, config.crossTextPosY.length - 1])];
				switch (1 * config.crossTextRelativePosX[Min([i, config.crossTextRelativePosX.length - 1])]) {
					case 0:
						if (textAlign == "default") textAlign = "left";
						break;
					case 1:
						txtposx += borderX;
						if (textAlign == "default") textAlign = "right";
						break;
					case 2:
						txtposx += posX;
						if (textAlign == "default") textAlign = "center";
						break;
					case -2:
						txtposx += context.canvas.width / 2;
						if (textAlign == "default") textAlign = "center";
						break;
					case 3:
						txtposx += txtposx + 2 * posX - borderX;
						if (textAlign == "default") textAlign = "left";
						break;
					case 4:
						txtposx += context.canvas.width;
						if (textAlign == "default") textAlign = "right";
						break;
					default:
						txtposx += posX;
						if (textAlign == "default") textAlign = "center";
						break;
				}
				switch (1 * config.crossTextRelativePosY[Min([i, config.crossTextRelativePosY.length - 1])]) {
					case 0:
						if (textBaseline == "default") textBaseline = "top";
						break;
					case 3:
						txtposy += borderY;
						if (textBaseline == "default") textBaseline = "top";
						break;
					case 2:
						txtposy += posY;
						if (textBaseline == "default") textBaseline = "middle";
						break;
					case -2:
						txtposy += context.canvas.height / 2;
						if (textBaseline == "default") textBaseline = "middle";
						break;
					case 1:
						txtposy += txtposy + 2 * posY - borderY;
						if (textBaseline == "default") textBaseline = "bottom";
						break;
					case 4:
						txtposy += context.canvas.height;
						if (textBaseline == "default") textBaseline = "bottom";
						break;
					default:
						txtposy += posY;
						if (textBaseline == "default") textBaseline = "middle";
						break;
				}
				ctx.textAlign = textAlign;
				ctx.textBaseline = textBaseline;
				ctx.translate(1 * txtposx, 1 * txtposy);
				ctx.rotate(Math.PI * config.crossTextAngle[Min([i, config.crossTextAngle.length - 1])] / 180);
				if (config.crossText[i].substring(0, 1) == "%") {
					if (typeof config.crossTextFunction == "function") disptxt = config.crossTextFunction(i, config.crossText[i], ctx, config, posX, posY, borderX, borderY, overlay, data, animPC);
				} else disptxt = config.crossText[i];
				ctx.fillTextMultiLine(disptxt, 0, 0, ctx.textBaseline, config.crossTextFontSize[Min([i, config.crossTextFontSize.length - 1])],true);
				ctx.stroke();
				ctx.restore();
			}
		}
	};

	function dispCrossImage(ctx, config, posX, posY, borderX, borderY, overlay, data, animPC, cntiter) {
		var i, disptxt, imageposx, imageposy, imageAlign, imageBaseline;
		for (i = 0; i < config.crossImage.length; i++) {
			if (typeof config.crossImage[i] != "undefined" && config.crossImageOverlay[Min([i, config.crossImageOverlay.length - 1])] == overlay && ((cntiter == -1 && config.crossImageIter[Min([i, config.crossImageIter.length - 1])] == "background") || (cntiter == 1 && config.crossImageIter[Min([i, config.crossImageIter.length - 1])] == "first") || config.crossImageIter[Min([i, config.crossImageIter.length - 1])] == cntiter || (cntiter != -1 && config.crossImageIter[Min([i, config.crossImageIter.length - 1])] == "all") || (animPC == 1 && config.crossImageIter[Min([i, config.crossImageIter.length - 1])] == "last"))) {
				ctx.save();
				ctx.beginPath();
				imageAlign = config.crossImageAlign[Min([i, config.crossImageAlign.length - 1])];
				imageBaseline = config.crossImageBaseline[Min([i, config.crossImageBaseline.length - 1])];
				imageposx = 1 * config.crossImagePosX[Min([i, config.crossImagePosX.length - 1])];
				imageposy = 1 * config.crossImagePosY[Min([i, config.crossImagePosY.length - 1])];
				switch (1 * config.crossImageRelativePosX[Min([i, config.crossImageRelativePosX.length - 1])]) {
					case 0:
						if (imageAlign == "default") imageAlign = "left";
						break;
					case 1:
						imageposx += borderX;
						if (imageAlign == "default") imageAlign = "right";
						break;
					case 2:
						imageposx += posX;
						if (imageAlign == "default") imageAlign = "center";
						break;
					case -2:
						imageposx += context.canvas.width / 2;
						if (imageAlign == "default") imageAlign = "center";
						break;
					case 3:
						imageposx += imageposx + 2 * posX - borderX;
						if (imageAlign == "default") imageAlign = "left";
						break;
					case 4:
						imageposx += context.canvas.width;
						if (imageAlign == "default") imageAlign = "right";
						break;
					default:
						imageposx += posX;
						if (imageAlign == "default") imageAlign = "center";
						break;
				}
				switch (1 * config.crossImageRelativePosY[Min([i, config.crossImageRelativePosY.length - 1])]) {
					case 0:
						if (imageBaseline == "default") imageBaseline = "top";
						break;
					case 3:
						imageposy += borderY;
						if (imageBaseline == "default") imageBaseline = "top";
						break;
					case 2:
						imageposy += posY;
						if (imageBaseline == "default") imageBaseline = "middle";
						break;
					case -2:
						imageposy += context.canvas.height / 2;
						if (imageBaseline == "default") imageBaseline = "middle";
						break;
					case 1:
						imageposy += imageposy + 2 * posY - borderY;
						if (imageBaseline == "default") imageBaseline = "bottom";
						break;
					case 4:
						imageposy += context.canvas.height;
						if (imageBaseline == "default") imageBaseline = "bottom";
						break;
					default:
						imageposy += posY;
						if (imageBaseline == "default") imageBaseline = "middle";
						break;
				}
				var imageWidth = config.crossImage[i].width;
				switch (imageAlign) {
					case "left":
						break;
					case "right":
						imageposx -= imageWidth;
						break;
					case "center":
						imageposx -= (imageWidth / 2);
						break;
					default:
						break;
				}
				var imageHeight = config.crossImage[i].height;
				switch (imageBaseline) {
					case "top":
						break;
					case "bottom":
						imageposy -= imageHeight;
						break;
					case "middle":
						imageposy -= (imageHeight / 2);
						break;
					default:
						break;
				}
				ctx.translate(1 * imageposx, 1 * imageposy);
				ctx.rotate(Math.PI * config.crossImageAngle[Min([i, config.crossImageAngle.length - 1])] / 180);
				ctx.drawImage(config.crossImage[i], 0, 0);
				ctx.restore();
			}
		}
	};
	//****************************************************************************************
	function setMeasures(data, config, ctx, height, width, ylabels, ylabels2, reverseLegend, reverseAxis, drawAxis, drawLegendOnData, legendBox, typegraph) {
		if (config.canvasBackgroundColor != "none") ctx.canvas.style.background = config.canvasBackgroundColor;
		var borderWidth = 0;
		var xAxisLabelPos = 0;
		var graphTitleHeight = 0;
		var graphTitlePosY = 0;
		var graphSubTitleHeight = 0;
		var graphSubTitlePosY = 0;
		var footNoteHeight = 0;
		var footNotePosY = 0;
		var yAxisUnitHeight = 0;
		var yAxisUnitPosY = 0;
		var widestLegend = 0;
		var nbeltLegend = 0;
		var nbLegendLines = 0;
		var nbLegendCols = 0;
		var spaceLegendHeight = 0;
		var xFirstLegendTextPos = 0;
		var yFirstLegendTextPos = 0;
		var xLegendBorderPos = 0;
		var yLegendBorderPos = 0;
		var yAxisLabelWidth = 0;
		var yAxisLabelPosLeft = 0;
		var yAxisLabelPosRight = 0;
		var xAxisLabelHeight = 0;
		var xLabelHeight = 0;
		var widestXLabel = 1;
		var highestXLabel = 1;
		var widestYLabel = 0;
		var highestYLabel = 1;
		var widestYLabel2 = 0;
		var highestYLabel2 = 1;
		var leftNotUsableSize = 0;
		var rightNotUsableSize = 0;
		var rotateLabels = 0;
		var xLabelPos = 0;
		var legendBorderWidth = 0;
		var legendBorderHeight = 0;
		
		ctx.widthAtSetMeasures=width;
		ctx.heightAtSetMeasures=height;
		
		// Borders
		if (config.canvasBorders) borderWidth = config.canvasBordersWidth;
		// compute widest X label
		if (drawAxis) {
			ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
			for (var i = 0; i < data.labels.length; i++) {
				var textMsr = ctx.measureTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), config.scaleFontSize);
				//If the text length is longer - make that equal to longest text!
				widestXLabel = (textMsr.textWidth > widestXLabel) ? textMsr.textWidth : widestXLabel;
				highestXLabel = (textMsr.textHeight > highestXLabel) ? textMsr.textHeight : highestXLabel;
			}
			if (widestXLabel < config.xScaleLabelsMinimumWidth) {
				widestXLabel = config.xScaleLabelsMinimumWidth;
			}
		}
		// compute Y Label Width
		if (drawAxis) {
			widestYLabel = 1;
			if (ylabels != null && ylabels != "nihil") {
				ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
				for (var i = ylabels.length - 1; i >= 0; i--) {
					if (typeof(ylabels[i]) == "string") {
						if (ylabels[i].trim() != "") {
							var textMsr = ctx.measureTextMultiLine(fmtChartJS(config, ylabels[i], config.fmtYLabel), config.scaleFontSize);
							//If the text length is longer - make that equal to longest text!
							widestYLabel = (textMsr.textWidth > widestYLabel) ? textMsr.textWidth : widestYLabel;
							highestYLabel = (textMsr.textHeight > highestYLabel) ? textMsr.textHeight : highestYLabel;
						}
					}
				}
			}
			if (widestYLabel < config.yScaleLabelsMinimumWidth) {
				widestYLabel = config.yScaleLabelsMinimumWidth;
			}
			widestYLabel2 = 1;
			if (ylabels2 != null && config.yAxisRight) {
				ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
				for (var i = ylabels2.length - 1; i >= 0; i--) {
					if (typeof(ylabels2[i]) == "string") {
						if (ylabels2[i].trim() != "") {
							var textMsr = ctx.measureTextMultiLine(fmtChartJS(config, ylabels2[i], config.fmtYLabel2), config.scaleFontSize);
							//If the text length is longer - make that equal to longest text!
							widestYLabel2 = (textMsr.textWidth > widestYLabel2) ? textMsr.textWidth : widestYLabel2;
							highestYLabel2 = (textMsr.textHeight > highestYLabel2) ? textMsr.textHeight : highestYLabel2;
						}
					}
				}
			} else {
				widestYLabel2 = widestYLabel;
			}
			if (widestYLabel2 < config.yScaleLabelsMinimumWidth) {
				widestYLabel2 = config.yScaleLabelsMinimumWidth;
			}
		}
		// yAxisLabel
		leftNotUsableSize = borderWidth + config.spaceLeft
		rightNotUsableSize = borderWidth + config.spaceRight;
		if (drawAxis) {
			if (typeof(config.yAxisLabel) != "undefined") {
				if (config.yAxisLabel.trim() != "") {
					yAxisLabelWidth = config.yAxisFontSize * (config.yAxisLabel.split("\n").length || 1) + config.yAxisLabelSpaceLeft + config.yAxisLabelSpaceRight;
					yAxisLabelPosLeft = borderWidth + config.spaceLeft + config.yAxisLabelSpaceLeft + config.yAxisFontSize;
					yAxisLabelPosRight = width - borderWidth - config.spaceRight - config.yAxisLabelSpaceLeft - config.yAxisFontSize;
				}
			}
			if (config.yAxisLeft) {
				if (reverseAxis == false) leftNotUsableSize = borderWidth + config.spaceLeft + yAxisLabelWidth + widestYLabel + config.yAxisSpaceLeft + config.yAxisSpaceRight;
				else leftNotUsableSize = borderWidth + config.spaceLeft + yAxisLabelWidth + widestXLabel + config.yAxisSpaceLeft + config.yAxisSpaceRight;
			}
			if (config.yAxisRight) {
				if (reverseAxis == false) rightNotUsableSize = borderWidth + config.spaceRight + yAxisLabelWidth + widestYLabel2 + config.yAxisSpaceLeft + config.yAxisSpaceRight;
				else rightNotUsableSize = borderWidth + config.spaceRight + yAxisLabelWidth + widestXLabel + config.yAxisSpaceLeft + config.yAxisSpaceRight;
			}
		}
		availableWidth = width - leftNotUsableSize - rightNotUsableSize;
		// Title
		if (config.graphTitle.trim() != "") {
			graphTitleHeight = config.graphTitleFontSize * (config.graphTitle.split("\n").length || 1) + config.graphTitleSpaceBefore + config.graphTitleSpaceAfter;
			graphTitlePosY = borderWidth + config.spaceTop + graphTitleHeight - config.graphTitleSpaceAfter;
		}
		// subTitle
		if (config.graphSubTitle.trim() != "") {
			graphSubTitleHeight = config.graphSubTitleFontSize * (config.graphSubTitle.split("\n").length || 1) + config.graphSubTitleSpaceBefore + config.graphSubTitleSpaceAfter;
			graphSubTitlePosY = borderWidth + config.spaceTop + graphTitleHeight + graphSubTitleHeight - config.graphSubTitleSpaceAfter;
		}
		// yAxisUnit
		if (drawAxis) {
			if (config.yAxisUnit.trim() != "") {
				yAxisUnitHeight = config.yAxisUnitFontSize * (config.yAxisUnit.split("\n").length || 1) + config.yAxisUnitSpaceBefore + config.yAxisUnitSpaceAfter;
				yAxisUnitPosY = borderWidth + config.spaceTop + graphTitleHeight + graphSubTitleHeight + yAxisUnitHeight - config.yAxisUnitSpaceAfter;
			}
		}
		topNotUsableSize = borderWidth + config.spaceTop + graphTitleHeight + graphSubTitleHeight + yAxisUnitHeight + config.graphSpaceBefore;
		// footNote
		if (typeof(config.footNote) != "undefined") {
			if (config.footNote.trim() != "") {
				footNoteHeight = config.footNoteFontSize * (config.footNote.split("\n").length || 1) + config.footNoteSpaceBefore + config.footNoteSpaceAfter;
				footNotePosY = height - config.spaceBottom - borderWidth - config.footNoteSpaceAfter;
			}
		}
		
		// xAxisLabel
		if (drawAxis) {
			if (typeof(config.xAxisLabel) != "undefined") {
				if (config.xAxisLabel.trim() != "") {
					xAxisLabelHeight = config.xAxisFontSize * (config.xAxisLabel.split("\n").length || 1) + config.xAxisLabelSpaceBefore + config.xAxisLabelSpaceAfter;
					xAxisLabelPos = height - borderWidth - config.spaceBottom - footNoteHeight - config.xAxisLabelSpaceAfter;
				}
			}
		}

		bottomNotUsableHeightWithoutXLabels = borderWidth + config.spaceBottom + footNoteHeight + xAxisLabelHeight + config.graphSpaceAfter;

		// compute space for Legend
		if (typeof(config.legend) != "undefined") {
			if (config.legend == true) {
				ctx.font = config.legendFontStyle + " " + config.legendFontSize + "px " + config.legendFontFamily;
				if (drawLegendOnData) {
					for (var i = data.datasets.length - 1; i >= 0; i--) {
						if (typeof(data.datasets[i].title) == "string") {
							if (data.datasets[i].title.trim() != "") {
								nbeltLegend++;
								var textLength = ctx.measureText(fmtChartJS(config, data.datasets[i].title, config.fmtLegend)).width;
								//If the text length is longer - make that equal to longest text!
								widestLegend = (textLength > widestLegend) ? textLength : widestLegend;
							}
						}
					}
				} else {
					for (var i = data.length - 1; i >= 0; i--) {
						if (typeof(data[i].title) == "string") {
							if (data[i].title.trim() != "") {
								nbeltLegend++;
								var textLength = ctx.measureText(fmtChartJS(config, data[i].title, config.fmtLegend)).width;
								//If the text length is longer - make that equal to longest text!
								widestLegend = (textLength > widestLegend) ? textLength : widestLegend;
							}
						}
					}
				}
				if (nbeltLegend > 1 || (nbeltLegend == 1 && config.showSingleLegend)) {
					widestLegend += config.legendBlockSize + config.legendSpaceBetweenBoxAndText;
					if(config.legendPosY==1 || config.legendPosY==2 || config.legendPosY==3) {
						availableLegendWidth = availableWidth- config.legendSpaceLeftText - config.legendSpaceRightText;
					} else {
						availableLegendWidth = width - config.spaceLeft - config.spaceRight - 2 * (borderWidth) - config.legendSpaceLeftText - config.legendSpaceRightText;
					}
					if (config.legendBorders == true) availableLegendWidth -= 2 * (config.legendBordersWidth) - config.legendBordersSpaceLeft - config.legendBordersSpaceRight;
					maxLegendOnLine = Min([Math.floor((availableLegendWidth + config.legendSpaceBetweenTextHorizontal) / (widestLegend + config.legendSpaceBetweenTextHorizontal)),config.maxLegendCols]);
					nbLegendLines = Math.ceil(nbeltLegend / maxLegendOnLine);
					nbLegendCols = Math.ceil(nbeltLegend / nbLegendLines);
				
					var legendHeight = nbLegendLines * (config.legendFontSize + config.legendSpaceBetweenTextVertical) - config.legendSpaceBetweenTextVertical + config.legendSpaceBeforeText + config.legendSpaceAfterText;

					switch (config.legendPosY) {
						case 0:
							xFirstLegendTextPos = config.spaceLeft + (width - config.spaceLeft - config.spaceRight - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal) / 2;
							spaceLegendHeight = legendHeight;
							if (config.legendBorders == true) {
								yLegendBorderPos = topNotUsableSize + config.legendBordersSpaceBefore + (config.legendBordersWidth/2);
								yFirstLegendTextPos = yLegendBorderPos  + (config.legendBordersWidth/2) + config.legendSpaceBeforeText+config.legendFontSize;
								spaceLegendHeight += 2 * config.legendBordersWidth + config.legendBordersSpaceBefore + config.legendBordersSpaceAfter;
								xLegendBorderPos = Math.floor(xFirstLegendTextPos - config.legendSpaceLeftText - (config.legendBordersWidth / 2));
								legendBorderHeight = Math.ceil(spaceLegendHeight - config.legendBordersWidth) - config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
								legendBorderWidth = Math.ceil(nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal)) - config.legendSpaceBetweenTextHorizontal + config.legendBordersWidth + config.legendSpaceRightText + config.legendSpaceLeftText;
							} else {
								yFirstLegendTextPos = topNotUsableSize + config.legendBordersSpaceBefore + (config.legendBordersWidth/2);
							}
							if(yAxisUnitHeight>0) {
								yAxisUnitPosY+=spaceLegendHeight;
								if(config.legendBorders==true)yLegendBorderPos-=yAxisUnitHeight;
								yFirstLegendTextPos-=yAxisUnitHeight;
							}
							topNotUsableSize += spaceLegendHeight;
							break;
						case 1:
							spaceLegendHeight = legendHeight;
							xFirstLegendTextPos = config.spaceLeft + (width - config.spaceLeft - config.spaceRight - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal) / 2;
							yFirstLegendTextPos = topNotUsableSize + config.legendSpaceBeforeText+config.legendFontSize;
							if (config.legendBorders == true) {
								yFirstLegendTextPos += config.legendBordersSpaceBefore+config.legendBordersWidth;
								yLegendBorderPos = yFirstLegendTextPos - config.legendSpaceBeforeText - config.legendFontSize - (config.legendBordersWidth /2 );
								spaceLegendHeight += 2 * config.legendBordersWidth + config.legendBordersSpaceBefore + config.legendBordersSpaceAfter;
								xLegendBorderPos = Math.floor(xFirstLegendTextPos - config.legendSpaceLeftText - (config.legendBordersWidth / 2));
								legendBorderHeight = Math.ceil(spaceLegendHeight - config.legendBordersWidth) - config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
								legendBorderWidth = Math.ceil(nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal)) - config.legendSpaceBetweenTextHorizontal + config.legendBordersWidth + config.legendSpaceRightText + config.legendSpaceLeftText;
							}
							break;
						case 2:
							spaceLegendHeight = legendHeight;
							xFirstLegendTextPos = config.spaceLeft + (width - config.spaceLeft - config.spaceRight - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal) / 2;
							yFirstLegendTextPos = topNotUsableSize + (height - topNotUsableSize - bottomNotUsableHeightWithoutXLabels - spaceLegendHeight) /2 + config.legendSpaceBeforeText+config.legendFontSize;
							if (config.legendBorders == true) {
								yFirstLegendTextPos += config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
								yLegendBorderPos = yFirstLegendTextPos - config.legendSpaceBeforeText - config.legendFontSize - (config.legendBordersWidth /2 );
								spaceLegendHeight += 2 * config.legendBordersWidth + config.legendBordersSpaceBefore + config.legendBordersSpaceAfter;
								xLegendBorderPos = Math.floor(xFirstLegendTextPos - config.legendSpaceLeftText - (config.legendBordersWidth / 2));
								legendBorderHeight = Math.ceil(spaceLegendHeight - config.legendBordersWidth) - config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
								legendBorderWidth = Math.ceil(nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal)) - config.legendSpaceBetweenTextHorizontal + config.legendBordersWidth + config.legendSpaceRightText + config.legendSpaceLeftText;
							}
							break;
						case -2:
							spaceLegendHeight = legendHeight;
							xFirstLegendTextPos = config.spaceLeft + (width - config.spaceLeft - config.spaceRight - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal) / 2;
							yFirstLegendTextPos = (height - spaceLegendHeight) /2 + config.legendSpaceBeforeText+config.legendFontSize;
							if (config.legendBorders == true) {
								yFirstLegendTextPos += config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
								yLegendBorderPos = yFirstLegendTextPos - config.legendSpaceBeforeText - config.legendFontSize - (config.legendBordersWidth /2 );
								spaceLegendHeight += 2 * config.legendBordersWidth + config.legendBordersSpaceBefore + config.legendBordersSpaceAfter;
								xLegendBorderPos = Math.floor(xFirstLegendTextPos - config.legendSpaceLeftText - (config.legendBordersWidth / 2));
								legendBorderHeight = Math.ceil(spaceLegendHeight - config.legendBordersWidth) - config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
								legendBorderWidth = Math.ceil(nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal)) - config.legendSpaceBetweenTextHorizontal + config.legendBordersWidth + config.legendSpaceRightText + config.legendSpaceLeftText;
							}
							break;
						case 3:
							spaceLegendHeight = legendHeight;
							xFirstLegendTextPos = config.spaceLeft + (width - config.spaceLeft - config.spaceRight - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal) / 2;
							availableHeight = height - topNotUsableSize - bottomNotUsableHeightWithoutXLabels;
							yFirstLegendTextPos = topNotUsableSize + availableHeight - spaceLegendHeight + config.legendSpaceBeforeText+config.legendFontSize;
							if (config.legendBorders == true) {
								yFirstLegendTextPos -= (config.legendBordersSpaceAfter+config.legendBordersWidth);
								yLegendBorderPos = yFirstLegendTextPos - config.legendSpaceBeforeText - config.legendFontSize - (config.legendBordersWidth /2 );
								spaceLegendHeight += 2 * config.legendBordersWidth + config.legendBordersSpaceBefore + config.legendBordersSpaceAfter;
								xLegendBorderPos = Math.floor(xFirstLegendTextPos - config.legendSpaceLeftText - (config.legendBordersWidth / 2));
								legendBorderHeight = Math.ceil(spaceLegendHeight - config.legendBordersWidth) - config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
								legendBorderWidth = Math.ceil(nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal)) - config.legendSpaceBetweenTextHorizontal + config.legendBordersWidth + config.legendSpaceRightText + config.legendSpaceLeftText;
							}
							break;
						default:
							spaceLegendHeight = legendHeight;
							yFirstLegendTextPos = height - borderWidth - config.spaceBottom - footNoteHeight - spaceLegendHeight + config.legendSpaceBeforeText + config.legendFontSize;
							xFirstLegendTextPos = config.spaceLeft + (width - config.spaceLeft - config.spaceRight - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal) / 2;
							if (config.legendBorders == true) {
								spaceLegendHeight += 2 * config.legendBordersWidth + config.legendBordersSpaceBefore + config.legendBordersSpaceAfter;
								yFirstLegendTextPos -= (config.legendBordersWidth + config.legendBordersSpaceAfter);
								yLegendBorderPos = Math.floor(height - borderWidth - config.spaceBottom - footNoteHeight - spaceLegendHeight + (config.legendBordersWidth / 2) + config.legendBordersSpaceBefore);
								xLegendBorderPos = Math.floor(xFirstLegendTextPos - config.legendSpaceLeftText - (config.legendBordersWidth / 2));
								legendBorderHeight = Math.ceil(spaceLegendHeight - config.legendBordersWidth) - config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
								legendBorderWidth = Math.ceil(nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal)) - config.legendSpaceBetweenTextHorizontal + config.legendBordersWidth + config.legendSpaceRightText + config.legendSpaceLeftText;
							} 
							xAxisLabelPos -= spaceLegendHeight;
							bottomNotUsableHeightWithoutXLabels +=spaceLegendHeight;
							break;
					}		
					var fullLegendWidth=config.legendSpaceRightText + nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) - config.legendSpaceBetweenTextHorizontal +config.legendSpaceLeftText;
					if (config.legendBorders == true) {
						fullLegendWidth+=2*config.legendBordersWidth+config.legendBordersSpaceLeft+config.legendBordersSpaceRight;
					}

					switch (config.legendPosX) {
						case 0:
							xFirstLegendTextPos = config.spaceLeft + config.canvasBorders * config.canvasBordersWidth + config.legendSpaceLeftText;  
							if (config.legendBorders == true) {
								xFirstLegendTextPos += (config.legendBordersWidth/2)+config.legendBordersSpaceLeft;
								xLegendBorderPos = config.spaceLeft + config.canvasBorders * config.canvasBordersWidth + config.legendBordersSpaceLeft;
							}
							if((config.legendPosY>=1 && config.legendPosY <=3) || config.legendPosY==-2) {
								leftNotUsableSize+=fullLegendWidth;
								yAxisLabelPosLeft+=fullLegendWidth;
							}
							break;
						case 1:
							xFirstLegendTextPos = leftNotUsableSize + config.legendSpaceLeftText;  
							if (config.legendBorders == true) {
								xLegendBorderPos = xFirstLegendTextPos;
								xFirstLegendTextPos += (config.legendBordersWidth/2) +config.legendBordersSpaceLeft;
							}
							break;
						case 2:
							xFirstLegendTextPos = leftNotUsableSize + (width - rightNotUsableSize - leftNotUsableSize)/2 - (config.legendSpaceLeftText-config.legendSpaceRightText) - (nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) - config.legendSpaceBetweenTextHorizontal) / 2;  
							if (config.legendBorders == true) {
								xFirstLegendTextPos -= ((config.legendBordersWidth/2) + config.legendBordersSpaceRight);
								xLegendBorderPos = xFirstLegendTextPos - config.legendBordersWidth/2 - config.legendSpaceLeftText ;
							}
							break;
						case 3:
							
							xFirstLegendTextPos = width - rightNotUsableSize - config.legendSpaceRightText - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal / 2;  
							if (config.legendBorders == true) {
								xFirstLegendTextPos -= ((config.legendBordersWidth/2) + config.legendBordersSpaceRight);
								xLegendBorderPos = xFirstLegendTextPos - config.legendBordersWidth/2 - config.legendSpaceLeftText ;
							}
							break;
						case 4:
							xFirstLegendTextPos = width - config.spaceRight - config.canvasBorders * config.canvasBordersWidth - config.legendSpaceRightText - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal / 2;  
							if (config.legendBorders == true) {
								xFirstLegendTextPos -= ((config.legendBordersWidth/2)+config.legendBordersSpaceRight);
								xLegendBorderPos = xFirstLegendTextPos - config.legendBordersSpaceLeft - config.legendBordersWidth/2;
							}
							if((config.legendPosY>=1 && config.legendPosY <=3) || config.legendPosY==-2) {
								rightNotUsableSize+=fullLegendWidth;
								yAxisLabelPosRight-=fullLegendWidth;
							}
							break;
							
						default:
							break;
					}
					if(config.legendBorders==true) {
						yLegendBorderPos+=config.legendYPadding;
						xLegendBorderPos+=config.legendXPadding;
						
					}
					yFirstLegendTextPos+=config.legendYPadding;	
					xFirstLegendTextPos+=config.legendXPadding;	
					
				}
			}
		}
		xLabelWidth = 0;
		bottomNotUsableHeightWithXLabels = bottomNotUsableHeightWithoutXLabels;
		if (drawAxis && (config.xAxisBottom || config.xAxisTop)) {
			if (reverseAxis == false) {
				var widestLabel = widestXLabel;
				var highestLabel = highestXLabel;
				nblab = data.labels.length;
			} else {
				var widestLabel = widestYLabel;
				var highestLabel = highestYLabel;
				nblab = ylabels.length;
			}
			if (config.rotateLabels == "smart") {
				rotateLabels = 0;
				if ((availableWidth + config.xAxisSpaceBetweenLabels) / nblab < (widestLabel + config.xAxisSpaceBetweenLabels)) {
					rotateLabels = 45;
					if (availableWidth / nblab < Math.abs(Math.cos(rotateLabels * Math.PI / 180) * widestLabel)) {
						rotateLabels = 90;
					}
				}
			} else {
				rotateLabels = config.rotateLabels
				if (rotateLabels < 0) rotateLabels = 0;
				if (rotateLabels > 180) rotateLabels = 180;
			}
			if (rotateLabels > 90) rotateLabels += 180;
			xLabelHeight = Math.abs(Math.sin(rotateLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.sin((rotateLabels + 90) * Math.PI / 180) * highestLabel) + config.xAxisSpaceBefore + config.xAxisSpaceAfter;
			xLabelPos = height - borderWidth - config.spaceBottom - footNoteHeight - xAxisLabelHeight - (xLabelHeight - config.xAxisSpaceBefore) - config.graphSpaceAfter;
			xLabelWidth = Math.abs(Math.cos(rotateLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.cos((rotateLabels + 90) * Math.PI / 180) * highestLabel);
			leftNotUsableSize = Max([leftNotUsableSize, borderWidth + config.spaceLeft + xLabelWidth / 2]);
			rightNotUsableSize = Max([rightNotUsableSize, borderWidth + config.spaceRight + xLabelWidth / 2]);
			availableWidth = width - leftNotUsableSize - rightNotUsableSize;
			if (config.legend && config.xAxisBottom && config.legendPosY==4) {
				xLabelPos-=spaceLegendHeight;
			} 
			bottomNotUsableHeightWithXLabels = bottomNotUsableHeightWithoutXLabels + xLabelHeight ;
		}  else {
			availableWidth = width - leftNotUsableSize - rightNotUsableSize;
		}

		availableHeight = height - topNotUsableSize - bottomNotUsableHeightWithXLabels;

		// ----------------------- DRAW EXTERNAL ELEMENTS -------------------------------------------------
		dispCrossImage(ctx, config, width / 2, height / 2, width / 2, height / 2, false, data, -1, -1);
 		if (ylabels != "nihil") {
			// Draw Borders
			if (borderWidth > 0) {
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth = 2 * borderWidth;
				ctx.setLineDash(lineStyleFn(config.canvasBordersStyle));
				ctx.strokeStyle = config.canvasBordersColor;
				ctx.moveTo(0, 0);
				ctx.lineTo(0, height);
				ctx.lineTo(width, height);
				ctx.lineTo(width, 0);
				ctx.lineTo(0, 0);
				ctx.stroke();
				ctx.setLineDash([]);
				ctx.restore();
			}
			// Draw Graph Title
			if (graphTitleHeight > 0) {
				ctx.save();
				ctx.beginPath();
				ctx.font = config.graphTitleFontStyle + " " + config.graphTitleFontSize + "px " + config.graphTitleFontFamily;
				ctx.fillStyle = config.graphTitleFontColor;
				ctx.textAlign = "center";
				ctx.textBaseline = "bottom";
				ctx.translate(config.spaceLeft + (width - config.spaceLeft - config.spaceRight) / 2, graphTitlePosY);
				ctx.fillTextMultiLine(config.graphTitle, 0, 0, ctx.textBaseline, config.graphTitleFontSize,true);
				ctx.stroke();
				ctx.restore();
			}
			// Draw Graph Sub-Title
			if (graphSubTitleHeight > 0) {
				ctx.save();
				ctx.beginPath();
				ctx.font = config.graphSubTitleFontStyle + " " + config.graphSubTitleFontSize + "px " + config.graphSubTitleFontFamily;
				ctx.fillStyle = config.graphSubTitleFontColor;
				ctx.textAlign = "center";
				ctx.textBaseline = "bottom";
				ctx.translate(config.spaceLeft + (width - config.spaceLeft - config.spaceRight) / 2, graphSubTitlePosY);
				ctx.fillTextMultiLine(config.graphSubTitle, 0, 0, ctx.textBaseline, config.graphSubTitleFontSize,true);
				ctx.stroke();
				ctx.restore();
			}
			// Draw Y Axis Unit
			if (yAxisUnitHeight > 0) {
				if (config.yAxisLeft) {
					ctx.save();
					ctx.beginPath();
					ctx.font = config.yAxisUnitFontStyle + " " + config.yAxisUnitFontSize + "px " + config.yAxisUnitFontFamily;
					ctx.fillStyle = config.yAxisUnitFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					ctx.translate(leftNotUsableSize, yAxisUnitPosY);
					ctx.fillTextMultiLine(config.yAxisUnit, 0, 0, ctx.textBaseline, config.yAxisUnitFontSize,true);
					ctx.stroke();
					ctx.restore();
				}
				if (config.yAxisRight) {
					if (config.yAxisUnit2 == '') config.yAxisUnit2 = config.yAxisUnit;
					ctx.save();
					ctx.beginPath();
					ctx.font = config.yAxisUnitFontStyle + " " + config.yAxisUnitFontSize + "px " + config.yAxisUnitFontFamily;
					ctx.fillStyle = config.yAxisUnitFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					ctx.translate(width - rightNotUsableSize, yAxisUnitPosY);
					ctx.fillTextMultiLine(config.yAxisUnit2, 0, 0, ctx.textBaseline, config.yAxisUnitFontSize,true);
					ctx.stroke();
					ctx.restore();
				}
			}
			// Draw Y Axis Label
			if (yAxisLabelWidth > 0) {
				if (config.yAxisLeft) {
					ctx.save();
					ctx.beginPath();
					ctx.font = config.yAxisFontStyle + " " + config.yAxisFontSize + "px " + config.yAxisFontFamily;
					ctx.fillStyle = config.yAxisFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					ctx.translate(yAxisLabelPosLeft, topNotUsableSize + (availableHeight / 2));
					ctx.rotate(-(90 * (Math.PI / 180)));
					ctx.fillTextMultiLine(config.yAxisLabel, 0, 0, ctx.textBaseline, config.yAxisFontSize,false);
					ctx.stroke();
					ctx.restore();
				}
				if (config.yAxisRight) {
					if (config.yAxisLabel2 == '') config.yAxisLabel2 = config.yAxisLabel;
					ctx.save();
					ctx.beginPath();
					ctx.font = config.yAxisFontStyle + " " + config.yAxisFontSize + "px " + config.yAxisFontFamily;
					ctx.fillStyle = config.yAxisFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					ctx.translate(yAxisLabelPosRight, topNotUsableSize + (availableHeight / 2));
					ctx.rotate(+(90 * (Math.PI / 180)));
					ctx.fillTextMultiLine(config.yAxisLabel2, 0, 0, ctx.textBaseline, config.yAxisFontSize,false);
					ctx.stroke();
					ctx.restore();
				}
			}
			// Draw X Axis Label
			if (xAxisLabelHeight > 0) {
				if (config.xAxisBottom) {
					ctx.save();
					ctx.beginPath();
					ctx.font = config.xAxisFontStyle + " " + config.xAxisFontSize + "px " + config.xAxisFontFamily;
					ctx.fillStyle = config.xAxisFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					ctx.translate(leftNotUsableSize + (availableWidth / 2), xAxisLabelPos);
					ctx.fillTextMultiLine(config.xAxisLabel, 0, 0, ctx.textBaseline, config.xAxisFontSize,true);
					ctx.stroke();
					ctx.restore();
				}
			}
			// Draw Legend

			if (nbeltLegend > 1 || (nbeltLegend == 1 && config.showSingleLegend)) {
				var legendMsr={dispLegend : true, xLegendBorderPos : xLegendBorderPos,
					   yLegendBorderPos : yLegendBorderPos, legendBorderWidth : legendBorderWidth, legendBorderHeight : legendBorderHeight, 
					   nbLegendCols: nbLegendCols, xFirstLegendTextPos : xFirstLegendTextPos , yFirstLegendTextPos : yFirstLegendTextPos, 
					   drawLegendOnData : drawLegendOnData, reverseLegend : reverseLegend, legendBox : legendBox, widestLegend : widestLegend };
				if(config.legendPosY==0 || config.legendPosY==4 || config.legendPosX==0 || config.legendPosX==4) {

					drawLegend(legendMsr,data,config,ctx,typegraph);
					var legendMsr={dispLegend : false};
				} 
			} else {
				var legendMsr={dispLegend : false };
			}
			// Draw FootNote
			if (config.footNote.trim() != "") {
				ctx.save();
				ctx.font = config.footNoteFontStyle + " " + config.footNoteFontSize + "px " + config.footNoteFontFamily;
				ctx.fillStyle = config.footNoteFontColor;
				ctx.textAlign = "center";
				ctx.textBaseline = "bottom";
				ctx.translate(leftNotUsableSize + (availableWidth / 2), footNotePosY);
				ctx.fillTextMultiLine(config.footNote, 0, 0, ctx.textBaseline, config.footNoteFontSize,true);
				ctx.stroke();
				ctx.restore();
			}
		}
		clrx = leftNotUsableSize;
		clrwidth = availableWidth;
		clry = topNotUsableSize;
		clrheight = availableHeight;
		return {
			leftNotUsableSize: leftNotUsableSize,
			rightNotUsableSize: rightNotUsableSize,
			availableWidth: availableWidth,
			topNotUsableSize: topNotUsableSize,
			bottomNotUsableHeightWithoutXLabels: bottomNotUsableHeightWithoutXLabels,
			bottomNotUsableHeightWithXLabels: bottomNotUsableHeightWithXLabels,
			availableHeight: availableHeight,
			widestXLabel: widestXLabel,
			highestXLabel: highestXLabel,
			widestYLabel: widestYLabel,
			widestYLabel2: widestYLabel2,
			highestYLabel: highestYLabel,
			rotateLabels: rotateLabels,
			xLabelPos: xLabelPos,
			clrx: clrx,
			clry: clry,
			clrwidth: clrwidth,
			clrheight: clrheight,
			legendMsr : legendMsr
		};
	};

	// Function for drawing lines (BarLine|Line)

	function drawLinesDataset(animPc, data, config, ctx, statData,vars) {
		var y1,y2,y3,diffnb,diffnbj,fact;
		var pts=[];

		for (var i = 0; i < data.datasets.length; i++) {
			if(statData[i][0].tpchart!="Line")continue;
			if (statData[i].length == 0) continue;
			if (statData[i][0].firstNotMissing == -1) continue;

			ctx.save();
			ctx.beginPath();

			prevAnimPc={ mainVal:0 , subVal : 0,animVal : 0 };
			var firstpt=-1;
			var lastxPos=-1;
			for (var j = statData[i][0].firstNotMissing; j <= statData[i][0].lastNotMissing; j++) {
				if(prevAnimPc.animVal==0 && j>statData[i][0].firstNotMissing) continue;	
				var currentAnimPc = animationCorrection(animPc, data, config, i, j, 0);
				if (currentAnimPc.mainVal == 0  && (prevAnimPc.mainVal > 0 && firstpt !=-1)) {
					
//					ctx.setLineDash(lineStyleFn(config.datasetStrokeStyle));
					ctx.setLineDash(lineStyleFn(setOptionValue("LINEDASH",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
					ctx.stroke();
					ctx.setLineDash([]);
					if(config.extrapolateMissingData) {
						y1=statData[i][statData[i][j].prevNotMissing].yAxisPos - prevAnimPc.mainVal*statData[i][statData[i][j].prevNotMissing].yPosOffset;					
						y2=statData[i][j].yAxisPos - prevAnimPc.mainVal*statData[i][statData[i][j-1].nextNotMissing].yPosOffset;
						diffnb=statData[i][j-1].nextNotMissing-statData[i][j].prevNotMissing;
						diffnbj=(j-1)-statData[i][j].prevNotMissing;
						fact=(diffnbj+prevAnimPc.subVal)/diffnb;
						y3=y1+fact*(y2-y1);					
						traceLine(pts,ctx,statData[i][j-1].xPos + prevAnimPc.subVal*(statData[i][j].xPos-statData[i][j-1].xPos) , y3,config,data,statData,i);
						closebz(pts,ctx,config,i);
//						ctx.setLineDash(lineStyleFn(config.datasetStrokeStyle));
						ctx.setLineDash(lineStyleFn(setOptionValue("LINEDASH",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
						ctx.stroke();
						ctx.setLineDash([]);
						ctx.strokeStyle = "rgba(0,0,0,0)";
						if(config.datasetFill) {
							ctx.lineTo(statData[i][j-1].xPos + prevAnimPc.subVal*(statData[i][j].xPos-statData[i][j-1].xPos) , statData[i][j].yAxisPos );
							ctx.lineTo(statData[i][firstpt].xPos, statData[i][firstpt].xAxisPosY-statData[i][0].zeroY);
							ctx.closePath();
							ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data.datasets[i].fillColor,config.defaultFillColor,i,j,{animationValue: currentAnimPc.mainVal, xPosLeft : statData[i][0].xPos, yPosBottom : Math.max(statData[i][0].yAxisPos,statData[i][0].yAxisPos- ((config.animationLeftToRight) ? 1 : 1*currentAnimPc.mainVal) * statData[i][0].lminvalue_offset), xPosRight : statData[i][data.datasets[i].data.length-1].xPos, yPosTop : Math.min(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1*currentAnimPc.mainVal) * statData[i][0].lmaxvalue_offset)} );
							ctx.fill();
							firstpt=-1;
						}
					} else if (!(typeof statData[i][j].value == "undefined")) {
						traceLine(pts,ctx,statData[i][j-1].xPos + prevAnimPc.subVal*(statData[i][j].xPos-statData[i][j-1].xPos) , statData[i][j].yAxisPos - prevAnimPc.mainVal*statData[i][statData[i][j-1].nextNotMissing].yPosOffset,config,data,statData,i);
						closebz(pts,ctx,config,i);
//						ctx.setLineDash(lineStyleFn(config.datasetStrokeStyle));
						ctx.setLineDash(lineStyleFn(setOptionValue("LINEDASH",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
						ctx.stroke();
						ctx.setLineDash([]);
						ctx.strokeStyle = "rgba(0,0,0,0)";
						if(config.datasetFill) {
							ctx.lineTo(statData[i][j-1].xPos + prevAnimPc.subVal*(statData[i][j].xPos-statData[i][j-1].xPos) , statData[i][j].yAxisPos );
							ctx.lineTo(statData[i][firstpt].xPos, statData[i][firstpt].xAxisPosY-statData[i][0].zeroY);
							ctx.closePath();
							ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data.datasets[i].fillColor,config.defaultFillColor,i,j,{animationValue: currentAnimPc.mainVal, xPosLeft : statData[i][0].xPos, yPosBottom : Math.max(statData[i][0].yAxisPos,statData[i][0].yAxisPos- ((config.animationLeftToRight) ? 1 : 1*currentAnimPc.mainVal) * statData[i][0].lminvalue_offset), xPosRight : statData[i][data.datasets[i].data.length-1].xPos, yPosTop : Math.min(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1*currentAnimPc.mainVal) * statData[i][0].lmaxvalue_offset)} );
							ctx.fill();
						}
					}
					prevAnimPc = currentAnimPc;
					continue;
				} else if(currentAnimPc.totVal ==0) {
//					ctx.setLineDash(lineStyleFn(config.datasetStrokeStyle));
					ctx.setLineDash(lineStyleFn(setOptionValue("LINEDASH",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
					ctx.stroke();
					ctx.setLineDash([]);
					ctx.strokeStyle = "rgba(0,0,0,0)";
				} else {
//					ctx.setLineDash(lineStyleFn(config.datasetStrokeStyle));
					ctx.setLineDash(lineStyleFn(setOptionValue("LINEDASH",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
					ctx.stroke();
					ctx.setLineDash([]);
					ctx.strokeStyle=setOptionValue("STROKECOLOR",ctx,data,statData,data.datasets[i].strokeColor,config.defaultStrokeColor,i,j,{nullvalue : null} );
				}
				
				prevAnimPc = currentAnimPc;

				switch(typeof data.datasets[i].data[j]) {
					case "undefined" :
							if (!config.extrapolateMissingData) {
								if(firstpt==-1) continue;
								closebz(pts,ctx,config,i);
//								ctx.setLineDash(lineStyleFn(config.datasetStrokeStyle));
								ctx.setLineDash(lineStyleFn(setOptionValue("LINEDASH",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
								ctx.stroke();
								ctx.setLineDash([]);
								if (config.datasetFill && firstpt != -1) {
									lastxPos=-1;
									ctx.strokeStyle = "rgba(0,0,0,0)";
									ctx.lineTo(statData[i][j-1].xPos, statData[i][j-1].yAxisPos);
									ctx.lineTo(statData[i][firstpt].xPos, statData[i][firstpt].yAxisPos);
									ctx.closePath();
									ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data.datasets[i].fillColor,config.defaultFillColor,i,j,{animationValue: currentAnimPc.mainVal, xPosLeft : statData[i][0].xPos, yPosBottom : Math.max(statData[i][0].yAxisPos,statData[i][0].yAxisPos- ((config.animationLeftToRight) ? 1 : 1*currentAnimPc.mainVal) * statData[i][0].lminvalue_offset), xPosRight : statData[i][data.datasets[i].data.length-1].xPos, yPosTop : Math.min(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1*currentAnimPc.mainVal) * statData[i][0].lmaxvalue_offset)} );
									ctx.fill();
								}
								ctx.beginPath();
								prevAnimPc={ mainVal:0 , subVal : 0 };
								firstpt=-1;
							} else if (currentAnimPc.subVal > 0) {
								lastxPos=statData[i][j].xPos + currentAnimPc.subVal*(statData[i][j+1].xPos-statData[i][j].xPos);
								y1=statData[i][statData[i][j+1].prevNotMissing].yAxisPos - statData[i][statData[i][j+1].prevNotMissing].yPosOffset;					
								y2=statData[i][statData[i][j].nextNotMissing].yAxisPos - statData[i][statData[i][j].nextNotMissing].yPosOffset;
								diffnb=statData[i][j].nextNotMissing-statData[i][j+1].prevNotMissing;
								diffnbj=(j)-statData[i][j+1].prevNotMissing;
								fact=(diffnbj+prevAnimPc.subVal)/diffnb;
								var y3=y1+fact*(y2-y1);					
								traceLine(pts,ctx,statData[i][j].xPos + currentAnimPc.subVal*(statData[i][j+1].xPos-statData[i][j].xPos), y3,config,data,statData,i);
							}
							break;
					default : 
						ctx.lineWidth = config.datasetStrokeWidth;
						if (firstpt==-1) {
							firstpt=j;
							ctx.beginPath();
							ctx.moveTo(statData[i][j].xPos, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset);
							initbz(pts,statData[i][j].xPos, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset,i);							
							lastxPos=statData[i][j].xPos;
						} else {
							lastxPos=statData[i][j].xPos;
							traceLine(pts,ctx,statData[i][j].xPos, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset,config,data,statData,i);
						}
						
						if (currentAnimPc.subVal > 0 && statData[i][j].nextNotMissing !=-1 && (config.extrapolateMissing || statData[i][j].nextNotMissing==j+1)) {
							lastxPos=statData[i][j].xPos + currentAnimPc.subVal*(statData[i][j+1].xPos-statData[i][j].xPos);
							var y1=statData[i][statData[i][j+1].prevNotMissing].yAxisPos - statData[i][statData[i][j+1].prevNotMissing].yPosOffset;					
							var y2=statData[i][statData[i][j].nextNotMissing].yAxisPos - statData[i][statData[i][j].nextNotMissing].yPosOffset;
							var y3=y1+currentAnimPc.subVal*(y2-y1);					
							traceLine(pts,ctx,statData[i][j].xPos + currentAnimPc.subVal*(statData[i][j+1].xPos-statData[i][j].xPos), y3,config,data,statData,i);
						}
						break
				}
			}
			closebz(pts,ctx,config,i);
//			ctx.setLineDash(lineStyleFn(config.datasetStrokeStyle));
			ctx.setLineDash(lineStyleFn(setOptionValue("LINEDASH",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
			ctx.stroke();
			ctx.setLineDash([]);
			if (config.datasetFill) {
				if (firstpt>=0 ) {
					ctx.strokeStyle = "rgba(0,0,0,0)";
					ctx.lineTo(lastxPos, statData[i][0].xAxisPosY-statData[i][0].zeroY);
					ctx.lineTo(statData[i][firstpt].xPos, statData[i][firstpt].xAxisPosY-statData[i][0].zeroY);
					ctx.closePath();
					ctx.fillStyle=setOptionValue("COLOR",ctx,data,statData,data.datasets[i].fillColor,config.defaultFillColor,i,-1,{animationValue: currentAnimPc.mainVal, xPosLeft : statData[i][0].xPos, yPosBottom : Math.max(statData[i][0].yAxisPos,statData[i][0].yAxisPos- ((config.animationLeftToRight) ? 1 : 1*currentAnimPc.mainVal) * statData[i][0].lminvalue_offset), xPosRight : statData[i][data.datasets[i].data.length-1].xPos, yPosTop : Math.min(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1*currentAnimPc.mainVal) * statData[i][0].lmaxvalue_offset)} );
					ctx.fill();
				}
			} 
			ctx.restore();
			if (config.pointDot && animPc >= 1) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						var currentAnimPc = animationCorrection(animPc, data, config, i, j, 0);
						if (currentAnimPc.mainVal > 0 || !config.animationLeftToRight) {
							ctx.beginPath();
							ctx.fillStyle=setOptionValue("MARKERFILLCOLOR",ctx,data,statData,data.datasets[i].pointColor,config.defaultStrokeColor,i,j,{nullvalue: true} );
							ctx.strokeStyle=setOptionValue("MARKERSTROKESTYLE",ctx,data,statData,data.datasets[i].pointStrokeColor,config.defaultStrokeColor,i,j,{nullvalue: true} );
							ctx.lineWidth=setOptionValue("MARKERLINEWIDTH",ctx,data,statData,data.datasets[i].pointDotStrokeWidth,config.pointDotStrokeWidth,i,j,{nullvalue: true} );
							var markerShape=setOptionValue("MARKERSHAPE",ctx,data,statData,data.datasets[i].markerShape,config.markerShape,i,j,{nullvalue: true} );
							var markerRadius=setOptionValue("MARKERRADIUS",ctx,data,statData,data.datasets[i].pointDotRadius,config.pointDotRadius,i,j,{nullvalue: true} );
							var markerStrokeStyle=setOptionValue("MARKERSTROKESTYLE",ctx,data,statData,data.datasets[i].pointDotStrokeStyle,config.pointDotStrokeStyle,i,j,{nullvalue: true} );
							drawMarker(ctx, statData[i][j].xPos , statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset, markerShape,markerRadius,markerStrokeStyle);							
						}
					}
				}
			}

			if (animPc >= config.animationStopValue) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
					if(setOptionValue("ANNOTATEDISPLAY",ctx,data,statData,undefined,config.annotateDisplay,i,j,{nullValue : true})) {
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["POINT", i, j, statData];
					}
					if (setOptionValue("INGRAPHDATASHOW",ctx,data,statData,undefined,config.inGraphDataShow,i,j,{nullValue : true})) {
 						ctx.save();
						ctx.textAlign = setOptionValue("INGRAPHDATAALIGN",ctx,data,statData,undefined,config.inGraphDataAlign,i,j,{nullValue: true  });
						ctx.textBaseline = setOptionValue("INGRAPHDATAVALIGN",ctx,data,statData,undefined,config.inGraphDataVAlign,i,j,{nullValue : true} );
						ctx.font = setOptionValue("INGRAPHDATAFONTSTYLE",ctx,data,statData,undefined,config.inGraphDataFontStyle,i,j,{nullValue : true} ) + ' ' + setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ) + 'px ' + setOptionValue("INGRAPHDATAFONTFAMILY",ctx,data,statData,undefined,config.inGraphDataFontFamily,i,j,{nullValue : true} );
						ctx.fillStyle = setOptionValue("INGRAPHDATAFONTCOLOR",ctx,data,statData,undefined,config.inGraphDataFontColor,i,j,{nullValue : true} );
						var paddingTextX = setOptionValue("INGRAPHDATAPADDINGX",ctx,data,statData,undefined,config.inGraphDataPaddingX,i,j,{nullValue : true} ),
							paddingTextY = setOptionValue("INGRAPHDATAPADDINGY",ctx,data,statData,undefined,config.inGraphDataPaddingY,i,j,{nullValue : true} );
						var dispString = tmplbis(setOptionValue("INGRAPHDATATMPL",ctx,data,statData,undefined,config.inGraphDataTmpl,i,j,{nullValue : true} ), statData[i][j],config);
						ctx.translate(statData[i][j].xPos + paddingTextX, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset - paddingTextY);
						ctx.rotate(setOptionValue("INGRAPHDATAROTATE",ctx,data,statData,undefined,config.inGraphDataRotate,i,j,{nullValue : true} ) * (Math.PI / 180));
						ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue("INGRAPHDATAFONTSIZE",ctx,data,statData,undefined,config.inGraphDataFontSize,i,j,{nullValue : true} ),true);
						ctx.restore();
					}
				}
			}
		};

			 
		
		function initbz(pts,xpos,ypos,i) {
			if (setOptionValue("BEZIERCURVE",ctx,data,statData,undefined,config.bezierCurve,i,-1,{nullValue : true})) {
				pts.length=0;
				pts.push(xpos);pts.push(ypos);
			}
		} ;
		
		function traceLine(pts,ctx,xpos,ypos,config,data,statData,i) {
			if (setOptionValue("BEZIERCURVE",ctx,data,statData,undefined,config.bezierCurve,i,-1,{nullValue : true})) {
				pts.push(xpos);	pts.push(ypos);
			} else {
				ctx.lineTo(xpos,ypos);
			}
		} ;
		
		function closebz(pts,ctx,config,i){
		
			if(setOptionValue("BEZIERCURVE",ctx,data,statData,undefined,config.bezierCurve,i,-1,{nullValue : true})) {
				minimumpos= statData[i][0].xAxisPosY;
				maximumpos= statData[i][0].xAxisPosY - statData[i][0].calculatedScale.steps*statData[i][0].scaleHop;
				drawSpline(ctx,pts,setOptionValue("BEZIERCURVETENSION",ctx,data,statData,undefined,config.bezierCurveTension,i,-1,{nullValue : true}),minimumpos,maximumpos);
				pts.length=0;			
			}
		};		

		//Props to Rob Spencer at scaled innovation for his post on splining between points
		//http://scaledinnovation.com/analytics/splines/aboutSplines.html

		function getControlPoints(x0,y0,x1,y1,x2,y2,t){
			//  x0,y0,x1,y1 are the coordinates of the end (knot) pts of this segment
			//  x2,y2 is the next knot -- not connected here but needed to calculate p2
			//  p1 is the control point calculated here, from x1 back toward x0.
			//  p2 is the next control point, calculated here and returned to become the 
			//  next segment's p1.
			//  t is the 'tension' which controls how far the control points spread.
        	
			//  Scaling factors: distances from this knot to the previous and following knots.
			var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
			var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
   
			var fa=t*d01/(d01+d12);
			var fb=t-fa;
  
			var p1x=x1+fa*(x0-x2);
			var p1y=y1+fa*(y0-y2);

			var p2x=x1-fb*(x0-x2);
			var p2y=y1-fb*(y0-y2);  
    
			return [p1x,p1y,p2x,p2y]
		};

		function drawSpline(ctx,pts,t,minimumpos,maximumpos){
			var cp=[];   // array of control points, as x0,y0,x1,y1,...
			var n=pts.length;

			pts.push(2*pts[n-2]-pts[n-4]);
			pts.push(2*pts[n-1]-pts[n-3]);

			if (n==4){
				ctx.moveTo(pts[0],pts[1]);
				ctx.lineTo(pts[2],pts[3]);
				return;
			}
			// Draw an open curve, not connected at the ends
			for(var ti=0;ti<n-2;ti+=2){
				cp=cp.concat(getControlPoints(pts[ti],pts[ti+1],pts[ti+2],pts[ti+3],pts[ti+4],pts[ti+5],t));
        		}    
			//  For first is a simple quadratics.

			ctx.beginPath();
			ctx.strokeStyle=setOptionValue("STROKECOLOR",ctx,data,statData,data.datasets[i].strokeColor,config.defaultStrokeColor,i,j,{nullvalue : null} );
			ctx.lineWidth = config.datasetStrokeWidth;
			ctx.moveTo(pts[0],pts[1]);
			ctx.quadraticCurveTo(cp[0],Math.max(Math.min(cp[1],minimumpos),maximumpos),pts[2],pts[3]);
			
//        		ctx.setLineDash(lineStyleFn(config.datasetStrokeStyle));
			ctx.setLineDash(lineStyleFn(setOptionValue("LINEDASH",ctx,data,statData,data.datasets[i].datasetStrokeStyle,config.datasetStrokeStyle,i,j,{nullvalue : null} )));
			for(var ti=2;ti<pts.length-3;ti+=2){
				y1=Math.max(Math.min(cp[2*ti-1],minimumpos),maximumpos);
				y2=Math.max(Math.min(cp[2*ti+1],minimumpos),maximumpos);
				ctx.bezierCurveTo(cp[2*ti-2],y1,cp[2*ti],y2,pts[ti+2],pts[ti+3]);
			}
			ctx.stroke();
		};
 		ctx.setLineDash([]);
	};

	function log10(val) {
		return Math.log(val) / Math.LN10;
	};

	function setRect(ctx, config) {
		if (config.clearRect) {
			if (!config.multiGraph) {
				clear(ctx);
				ctx.clearRect(0, 0, width, height);
			}
		} else {
			clear(ctx);
			ctx.clearRect(0, 0, width, height);
	
			ctx.fillStyle = config.savePngBackgroundColor;
			ctx.strokeStyle = config.savePngBackgroundColor;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, ctx.canvas.height);
			ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
			ctx.lineTo(ctx.canvas.width, 0);
			ctx.lineTo(0, 0);
			ctx.stroke();
			ctx.fill();
		}
	};

	function defMouse(ctx, data, config) {
		var todoannotate=false;
		if(typeof config.annotateDisplay=="function") { todoannotate=true;
		} else if(typeof config.annotateDisplay == "object") {
			for(var j=0;j<config.annotateDisplay.length;j++) if (config.annotateDisplay[j]) todoannotate=true;
		} else todoannotage=config.annotateDisplay;
		
		if (isBooleanOptionTrue(undefined,config.annotateDisplay)) {
			if (cursorDivCreated == false) oCursor = new makeCursorObj('divCursor');
			if (isIE() < 9 && isIE() != false) ctx.canvas.attachEvent("on" + config.annotateFunction.split(' ')[0], function(event) {
				if ((config.annotateFunction.split(' ')[1] == "left" && event.which == 1) ||
					(config.annotateFunction.split(' ')[1] == "middle" && event.which == 2) ||
					(config.annotateFunction.split(' ')[1] == "right" && event.which == 3) ||
					(typeof(config.annotateFunction.split(' ')[1]) != "string")) doMouseAction(config, ctx, event, data, "annotate", config.mouseDownRight)
			});
			else ctx.canvas.addEventListener(config.annotateFunction.split(' ')[0], function(event) {
				if ((config.annotateFunction.split(' ')[1] == "left" && event.which == 1) ||
					(config.annotateFunction.split(' ')[1] == "middle" && event.which == 2) ||
					(config.annotateFunction.split(' ')[1] == "right" && event.which == 3) ||
					(typeof(config.annotateFunction.split(' ')[1]) != "string")) doMouseAction(config, ctx, event, data, "annotate", config.mouseDownRight)
			}, false);
		}
		if (config.savePng) {
			if (isIE() < 9 && isIE() != false) ctx.canvas.attachEvent("on" + config.savePngFunction.split(' ')[0], function(event) {
				if ((config.savePngFunction.split(' ')[1] == "left" && event.which == 1) ||
					(config.savePngFunction.split(' ')[1] == "middle" && event.which == 2) ||
					(config.savePngFunction.split(' ')[1] == "right" && event.which == 3) ||
					(typeof(config.savePngFunction.split(' ')[1]) != "string")) saveCanvas(ctx, data, config);
			});
			else ctx.canvas.addEventListener(config.savePngFunction.split(' ')[0], function(event) {
				if ((config.savePngFunction.split(' ')[1] == "left" && event.which == 1) ||
					(config.savePngFunction.split(' ')[1] == "middle" && event.which == 2) ||
					(config.savePngFunction.split(' ')[1] == "right" && event.which == 3) ||
					(typeof(config.savePngFunction.split(' ')[1]) != "string")) saveCanvas(ctx, data, config);
			}, false);
		}

		if (isIE() < 9 && isIE() != false) ctx.canvas.attachEvent("onmousewheel", function(event) {
			if (cursorDivCreated) document.getElementById('divCursor').style.display = 'none';
		});
		else ctx.canvas.addEventListener("DOMMouseScroll", function(event) {
			if (cursorDivCreated) document.getElementById('divCursor').style.display = 'none';
		}, false);



		function add_event_listener(type, func, chk)
		{
			if(typeof func != 'function')
				return;

			function do_func(event) {
				if (chk == null || chk(event)) doMouseAction(config,ctx,event,data,"mouseaction",func);
			};

			var hash = type+' '+func.name;
			if(hash in ctx._eventListeners) {
				if(ctx.canvas.removeEventListener)
					ctx.canvas.removeEventListener(type, ctx._eventListeners[hash]);
				else if(ctx.canvas.detachEvent)
					ctx.canvas.detachEvent(type, ctx._eventListeners[hash]);
			}

			ctx._eventListeners[hash] = do_func;

			if(ctx.canvas.addEventListener) {
				if(type=="mousewheel") type="DOMMouseScroll";
				ctx.canvas.addEventListener(type, do_func, false);
			} else if(ctx.canvas.attachEvent) {
				ctx.canvas.attachEvent("on"+type, do_func);
			}
		};

		add_event_listener("mousedown", config.mouseDownLeft, function(e) { return e.which == 1; });
		add_event_listener("mousedown", config.mouseDownMiddle, function(e) { return e.which == 2; });
		add_event_listener("mousedown", config.mouseDownRight, function(e) { return e.which == 3; });
		add_event_listener("mousemove", config.mouseMove);
		add_event_listener("mouseout", config.mouseOut);
		add_event_listener("mousewheel", config.mouseWheel);
	};
};



function animationCorrection(animationValue, data, config, vdata, vsubdata, addone) {
	var animValue = animationValue;
	var animSubValue = 0;
	if (vsubdata != -1) {
		if (animValue < 1 && (vdata < (config.animationStartWithDataset - 1) && (config.animationStartWithDataset - 1) != -1)) {
			animValue = 1;
		}
		if (animValue < 1 && (vsubdata < (config.animationStartWithData - 1) && (config.animationStartWithData - 1) != -1)) {
			animValue = 1;
		}
		var totreat = 1;
		var newAnimationValue = animationValue;
		if (animValue < 1 && config.animationByDataset) {
			animValue = 0;
			totreat = 0;
			var startDataset = (config.animationStartWithDataset - 1);
			if ((config.animationStartWithDataset - 1) == -1) startDataset = 0
			var nbstepsperdatasets = config.animationSteps / (data.datasets.length - startDataset);
			if (animationValue >= (vdata - startDataset + 1) * nbstepsperdatasets / config.animationSteps) animValue = 1;
			else if (animationValue >= (vdata - startDataset) * nbstepsperdatasets / config.animationSteps) {
				var redAnimationValue = animationValue - (vdata - startDataset) * nbstepsperdatasets / config.animationSteps;
				if (!config.animationLeftToRight) {
					animValue = redAnimationValue * (data.datasets.length - startDataset);
				} else {
					newAnimationValue = redAnimationValue * (data.datasets.length - startDataset);
				}
				totreat = 1;
			}
		}
		if (totreat == 1 && animValue < 1 && config.animationLeftToRight) {
			animValue = 0;
			var startSub = (config.animationStartWithData - 1);
			if ((config.animationStartWithData - 1) == -1) startSub = 0
			var nbstepspervalue = config.animationSteps / (data.datasets[vdata].data.length - startSub - 1 + addone);
			if (newAnimationValue >= (vsubdata - startSub) * nbstepspervalue / config.animationSteps) {
				animValue = 1;
				if (newAnimationValue <= (vsubdata + 1 - startSub) * nbstepspervalue / config.animationSteps) {
					animSubValue = (data.datasets[vdata].data.length - startSub - 1) * (newAnimationValue - ((vsubdata - startSub) * nbstepspervalue / config.animationSteps));
				}
			}
		}
	} else {
		if (animValue < 1 && (vdata < (config.animationStartWithData - 1))) {
			animValue = 1;
		}
	}
	return {
		mainVal: animValue,
		subVal: animSubValue,
		animVal: animValue + animSubValue
	};
};


function drawLegend(legendMsr,data,config,ctx,typegraph) {
	if (config.legendBorders == true) {
		ctx.save();
		ctx.setLineDash(lineStyleFn(config.legendBordersStyle));
		ctx.beginPath();
		ctx.lineWidth = config.legendBordersWidth;
		ctx.strokeStyle = config.legendBordersColors;
		ctx.moveTo(legendMsr.xLegendBorderPos, legendMsr.yLegendBorderPos);
		ctx.lineTo(legendMsr.xLegendBorderPos, legendMsr.yLegendBorderPos + legendMsr.legendBorderHeight);
		ctx.lineTo(legendMsr.xLegendBorderPos + legendMsr.legendBorderWidth, legendMsr.yLegendBorderPos + legendMsr.legendBorderHeight);
		ctx.lineTo(legendMsr.xLegendBorderPos + legendMsr.legendBorderWidth, legendMsr.yLegendBorderPos);
		ctx.lineTo(legendMsr.xLegendBorderPos, legendMsr.yLegendBorderPos);
		//ctx.lineTo(legendMsr.xLegendBorderPos + legendMsr.legendBorderWidth, legendMsr.yLegendBorderPos);
		//ctx.lineTo(legendMsr.xLegendBorderPos, legendMsr.yLegendBorderPos);
		//ctx.lineTo(legendMsr.xLegendBorderPos, legendMsr.yLegendBorderPos + legendMsr.legendBorderHeight);

					
		ctx.stroke();
		ctx.closePath();
		ctx.setLineDash([]);
		
		ctx.fillStyle = "rgba(0,0,0,0)"; // config.legendFillColor;
		ctx.fillStyle = config.legendFillColor;
		ctx.fill();
		ctx.restore();
	}
	nbcols = legendMsr.nbLegendCols - 1;
	ypos = legendMsr.yFirstLegendTextPos - (config.legendFontSize + config.legendSpaceBetweenTextVertical);
	xpos = 0;
	if (legendMsr.drawLegendOnData) fromi = data.datasets.length;
	else fromi = data.length;
	for (var i = fromi - 1; i >= 0; i--) {
		orderi = i;
		if (legendMsr.reverseLegend) {
			if (legendMsr.drawLegendOnData) orderi = data.datasets.length - i - 1;
			else orderi = data.length - i - 1;
		}
		if (legendMsr.drawLegendOnData) tpof = typeof(data.datasets[orderi].title);
		else tpof = typeof(data[orderi].title)
		if (tpof == "string") {
			if (legendMsr.drawLegendOnData) lgtxt = fmtChartJS(config, data.datasets[orderi].title, config.fmtLegend).trim();
			else lgtxt = fmtChartJS(config, data[orderi].title, config.fmtLegend).trim();
			if (lgtxt != "") {
				nbcols++;
				if (nbcols == legendMsr.nbLegendCols) {
					nbcols = 0;
					xpos = legendMsr.xFirstLegendTextPos;
					ypos += config.legendFontSize + config.legendSpaceBetweenTextVertical;
				} else {
					xpos += legendMsr.widestLegend + config.legendSpaceBetweenTextHorizontal;
				}
				ctx.save();
				ctx.beginPath();
				var lgdbox=legendMsr.legendBox;
				if(ctx.tpchart=="Bar") if (data.datasets[orderi].type=="Line" && !config.datasetFill) lgdbox=false;
				if (lgdbox) {
					ctx.lineWidth = config.datasetStrokeWidth;
					ctx.beginPath();
					if (legendMsr.drawLegendOnData) {
						ctx.strokeStyle=setOptionValue("LEGENDSTROKECOLOR",ctx,data,undefined,data.datasets[orderi].strokeColor,config.defaultFillColor,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} );
						ctx.setLineDash(lineStyleFn(setOptionValue("LEGENDLINEDASH",ctx,data,undefined,data.datasets[orderi].datasetStrokeStyle,config.datasetStrokeStyle,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} )));

					} else {
						ctx.strokeStyle=setOptionValue("LEGENDSTROKECOLOR",ctx,data,undefined,data[orderi].strokeColor,config.defaultFillColor,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} );
						ctx.setLineDash(lineStyleFn(setOptionValue("LEGENDSEGMENTTROKESTYLE",ctx,data,undefined,data[orderi].segmentStrokeStyle,config.segmentStrokeStyle,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} )));
					}
					ctx.moveTo(xpos, ypos);
					ctx.lineTo(xpos + config.legendBlockSize, ypos);
					ctx.lineTo(xpos + config.legendBlockSize, ypos - config.legendFontSize);
					ctx.lineTo(xpos, ypos - config.legendFontSize);
					ctx.lineTo(xpos, ypos);
					ctx.stroke();
					ctx.closePath();
					if (legendMsr.drawLegendOnData) {
						ctx.fillStyle=setOptionValue("LEGENDFILLCOLOR",ctx,data,undefined,data.datasets[orderi].fillColor,config.defaultFillColor,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} );
					} else {
						ctx.fillStyle=setOptionValue("LEGENDFILLCOLOR",ctx,data,undefined,data[orderi].color,config.defaultFillColor,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} );
					}
					ctx.fill();
				} else {
					ctx.lineWidth = config.legendColorIndicatorStrokeWidth ?
						config.legendColorIndicatorStrokeWidth : config.datasetStrokeWidth;
					if (config.legendColorIndicatorStrokeWidth && config.legendColorIndicatorStrokeWidth > config.legendFontSize) {
						ctx.lineWidth = config.legendFontSize;
					}
					if (legendMsr.drawLegendOnData) {
						ctx.strokeStyle=setOptionValue("LEGENDSTROKECOLOR",ctx,data,undefined,data.datasets[orderi].strokeColor,config.defaultFillColor,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} );
						ctx.setLineDash(lineStyleFn(setOptionValue("LEGENDLINEDASH",ctx,data,undefined,data.datasets[orderi].datasetStrokeStyle,config.datasetStrokeStyle,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} )));
					} else {
						ctx.strokeStyle=setOptionValue("LEGENDSTROKECOLOR",ctx,data,undefined,data[orderi].strokeColor,config.defaultFillColor,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} );
						ctx.setLineDash(lineStyleFn(setOptionValue("LEGENDSEGMENTTROKESTYLE",ctx,data,undefined,data[orderi].segmentStrokeStyle,config.segmentStrokeStyle,orderi,-1,{animationValue: 1, xPosLeft : xpos, yPosBottom : ypos, xPosRight : xpos + config.legendBlockSize, yPosTop : ypos - config.legendFontSize} )));
					}

					ctx.moveTo(xpos + 2, ypos - (config.legendFontSize / 2));
					ctx.lineTo(xpos + 2 + config.legendBlockSize, ypos - (config.legendFontSize / 2));
					ctx.stroke();

					
					ctx.fill();

					if(config.pointDot) {
						ctx.beginPath();
				 		ctx.fillStyle=setOptionValue("LEGENDMARKERFILLCOLOR",ctx,data,undefined,data.datasets[orderi].pointColor,config.defaultStrokeColor,orderi,-1,{nullvalue: true} );
						ctx.strokeStyle=setOptionValue("LEGENDMARKERSTROKESTYLE",ctx,data,undefined,data.datasets[orderi].pointStrokeColor,config.defaultStrokeColor,orderi,-1,{nullvalue: true} );
						ctx.lineWidth=setOptionValue("LEGENDMARKERLINEWIDTH",ctx,data,undefined,data.datasets[orderi].pointDotStrokeWidth,config.pointDotStrokeWidth,orderi,-1,{nullvalue: true} );
                        	
						var markerShape=setOptionValue("LEGENDMARKERSHAPE",ctx,data,undefined,data.datasets[orderi].markerShape,config.markerShape,orderi,-1,{nullvalue: true} );
						var markerRadius=setOptionValue("LEGENDMARKERRADIUS",ctx,data,undefined,data.datasets[orderi].pointDotRadius,config.pointDotRadius,orderi,-1,{nullvalue: true} );
						var markerStrokeStyle=setOptionValue("LEGENDMARKERSTROKESTYLE",ctx,data,undefined,data.datasets[orderi].pointDotStrokeStyle,config.pointDotStrokeStyle,orderi,-1,{nullvalue: true} );
						drawMarker(ctx,xpos + 2 + config.legendBlockSize/2, ypos - (config.legendFontSize / 2), markerShape,markerRadius,markerStrokeStyle);							
					}
					ctx.fill();

				}
				ctx.restore();
				ctx.save();
				ctx.beginPath();
				ctx.font = config.legendFontStyle + " " + config.legendFontSize + "px " + config.legendFontFamily;
				ctx.fillStyle = setOptionValue("LEGENDFONTCOLOR",ctx,data,undefined,undefined,config.legendFontColor,orderi,-1,{nullvalue: true} );
				ctx.textAlign = "left";
				ctx.textBaseline = "bottom";
				ctx.translate(xpos + config.legendBlockSize + config.legendSpaceBetweenBoxAndText, ypos);
				ctx.fillText(lgtxt, 0, 0);
				ctx.restore();
			}
		}
	}
};

function drawMarker(ctx,xpos,ypos,marker,markersize,markerStrokeStyle) {
	ctx.setLineDash(lineStyleFn(markerStrokeStyle));
	switch (marker) {
		case "square":
			ctx.rect(xpos-markersize,ypos-markersize,2*markersize,2*markersize);
			ctx.stroke();
			ctx.fill();
			ctx.setLineDash([]);
			break;
		case "triangle":
			pointA_x=0;
			pointA_y=2/3*markersize;
			ctx.moveTo(xpos,ypos-pointA_y);
			ctx.lineTo(xpos+pointA_y*Math.sin(4/3),ypos+pointA_y*Math.cos(4/3));
			ctx.lineTo(xpos-pointA_y*Math.sin(4/3),ypos+pointA_y*Math.cos(4/3));
			ctx.lineTo(xpos,ypos-pointA_y);
			ctx.stroke();
			ctx.fill();
			ctx.setLineDash([]);
			break;
		case "diamond":
			ctx.moveTo(xpos, ypos+markersize);
			ctx.lineTo(xpos+markersize, ypos);
			ctx.lineTo(xpos, ypos-markersize);
			ctx.lineTo(xpos-markersize, ypos);
			ctx.lineTo(xpos, ypos+markersize);
			ctx.stroke();
			ctx.fill();
			ctx.setLineDash([]);
			break;
		case "plus":
			ctx.moveTo(xpos, ypos-markersize);
			ctx.lineTo(xpos, ypos+markersize);
			ctx.moveTo(xpos-markersize, ypos);
			ctx.lineTo(xpos+markersize, ypos);
			ctx.stroke();
			ctx.setLineDash([]);
			break;
		case "cross":
			ctx.moveTo(xpos-markersize, ypos-markersize);
			ctx.lineTo(xpos+markersize, ypos+markersize);
			ctx.moveTo(xpos-markersize, ypos+markersize);
			ctx.lineTo(xpos+markersize, ypos-markersize);
			ctx.stroke();
			ctx.setLineDash([]);
			break;
		case "circle":
		default:
			ctx.arc(xpos, ypos, markersize, 0, 2*Math.PI * 1, true);
			ctx.stroke();
			ctx.fill();
			ctx.setLineDash([]);
			break;
	}
};

function initPassVariableData_part1(data,config,ctx) {

switch(ctx.tpchart) {
	case "Pie" :
	case "Doughnut" :
	case "PolarArea" :

		var result=[];
		var lgtxt,totvalue,cumvalue,segmentAngle,cumulativeAngle,realCumulativeAngle;

		cumulativeAngle = (((-config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2* Math.PI) % (2* Math.PI) ; 
		realCumulativeAngle = (((config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2* Math.PI) % (2* Math.PI) ; 

		startAngle=cumulativeAngle;
		totvalue = 0;
		notemptyval=0;
		var firstNotMissing = -1;
		var lastNotMissing = -1;
		var prevNotMissing = -1;
		var mxvalue=-Number.MAX_VALUE;
		var mnvalue=Number.MAX_VALUE;
		for (var i = 0; i < data.length; i++) {
			if(ctx.tpchart != "PolarArea" && 1*data[i].value<0)continue;
			if (!(typeof(data[i].value) == 'undefined')) { 
				if(firstNotMissing==-1)firstNotMissing=i;
				mxvalue=Math.max(mxvalue,1*data[i].value);
				mnvalue=Math.min(mnvalue,1*data[i].value);
				notemptyval++; 
				totvalue += 1 * data[i].value;
				lastNotMissing=i;
			}
		}
	
		cumvalue=0;
		var prevMissing=-1;
		for(i=0;i<data.length;i++) {
			if (typeof(data[i].title) == "string") lgtxt = data[i].title.trim();
			else lgtxt = "";
			if (!(typeof(data[i].value) == 'undefined') && (ctx.tpchart == "PolarArea" || 1*data[i].value>=0)) {
				if(ctx.tpchart=="PolarArea") { if(notemptyval>0)segmentAngle= (Math.PI *2)/notemptyval; else segmentAngle=0; }
				else segmentAngle = (1 * data[i].value / totvalue) * (Math.PI * 2);
				if (segmentAngle >= Math.PI * 2) segmentAngle = Math.PI * 2 - 0.001; // bug on Android when segmentAngle is >= 2*PI;
				cumvalue += 1 * data[i].value;
				result[i]= {
					config: config,
					v1: fmtChartJS(config, lgtxt, config.fmtV1),
					v2: fmtChartJS(config, 1 * data[i].value, config.fmtV2),
					v3: fmtChartJS(config, cumvalue, config.fmtV3),
					v4: fmtChartJS(config, totvalue, config.fmtV4),
					v5: fmtChartJS(config, segmentAngle, config.fmtV5),
					v6: roundToWithThousands(config, fmtChartJS(config, 100 * data[i].value / totvalue, config.fmtV6), config.roundPct),
					v7 : 0,
					v8 : 0,
					v9 : 0,
					v10 : 0,
					v11: fmtChartJS(config, cumulativeAngle - segmentAngle, config.fmtV11),
					v12: fmtChartJS(config, cumulativeAngle, config.fmtV12),
					v13: fmtChartJS(config, i, config.fmtV13),
					lgtxt: lgtxt,
					datavalue: 1 * data[i].value,
					cumvalue: cumvalue,
					totvalue: totvalue,
					segmentAngle: segmentAngle,
					firstAngle : startAngle,
					pctvalue: 100 * data[i].value / totvalue,
					startAngle: cumulativeAngle,
					realStartAngle : realCumulativeAngle,
					endAngle: cumulativeAngle+segmentAngle,
					maxvalue : mxvalue,
					minvalue : mnvalue,
					i: i,
					firstNotMissing : firstNotMissing,
					lastNotMissing : lastNotMissing,
					prevNotMissing : prevNotMissing,
					prevMissing : prevMissing,
					nextNotMissing : -1,
				        radiusOffset : 0,
					midPosX : 0,
					midPosY : 0,
					int_radius : 0,
					ext_radius : 0,
					data: data
				};   
				cumulativeAngle += segmentAngle;
				realCumulativeAngle -= segmentAngle;
				if(prevNotMissing != -1) result[prevNotMissing].nextNotMissing=i;
				prevNotMissing = i;
        		} else {
				result[i]={ 
					v1:lgtxt,
					maxvalue : mxvalue,
					minvalue : mnvalue,
					i: i,
					firstNotMissing : firstNotMissing,
					lastNotMissing : lastNotMissing,
					prevNotMissing : prevNotMissing
				 }; 
				 prevMissing=i;
			}
		}
		break;
	case "Bar" :
	case "Line" :
	case "HorizontalBar" :
	case "StackedBar" :
	case "HorizontalStackedBar" :
	case "Radar" :
		var axis;
		var result=[];
		var mxvalue=[];
		mxvalue[0]=[];
		mxvalue[1]=[];
		var mnvalue=[];
		mnvalue[0]=[];
		mnvalue[1]=[];
		var cumvalue=[];
		cumvalue[0]=[];
		cumvalue[1]=[];
		var totvalue=[];
		totvalue[0]=[];
		totvalue[1]=[];
		var lmaxvalue=[];
		lmaxvalue[0]=[];
		lmaxvalue[1]=[];
		var lminvalue=[];
		lminvalue[0]=[];
		lminvalue[1]=[];
		var lgtxt,lgtxt2,tp;
		var prevpos=[];
		var firstNotMissingi=[];
		var lastNotMissingi=[];
		var firstNotMissingj=[];
		var lastNotMissingj=[];
		prevpos[0]=[];
		prevpos[1]=[];
		var grandtotal=0;
		for (var i = 0; i < data.datasets.length; i++) {
			// BUG when all data are missing !
			if (typeof data.datasets[i].xPos != "undefined" && tpdraw(ctx,data.datasets[i])=="Line") {
				for(var j=data.datasets[i].data.length;j<data.datasets[i].xPos.length;j++)data.datasets[i].data.push(undefined);
			} else {
				for(var j=data.datasets[i].data.length;j<data.labels.length;j++)data.datasets[i].data.push(undefined);
			}
				

			if(data.datasets[i].axis == 2) axis=0;else axis=1;
			result[i]=[];
			lmaxvalue[0][i]=-Number.MAX_VALUE;
			lmaxvalue[1][i]=-Number.MAX_VALUE;
			lminvalue[0][i]=Number.MAX_VALUE;
			lminvalue[1][i]=Number.MAX_VALUE;
			firstNotMissingi[i]=-1;
			lastNotMissingi[i]=-1;
			for (var j = 0; j < data.datasets[i].data.length; j++) {

				if(typeof firstNotMissingj[j]== "undefined"){
					firstNotMissingj[j]=-1;
					lastNotMissingj[j]=-1;
					totvalue[0][j] = 0; 
					mxvalue[0][j]=-Number.MAX_VALUE;
					mnvalue[0][j]=Number.MAX_VALUE;
					totvalue[1][j] = 0; 
					mxvalue[1][j]=-Number.MAX_VALUE;
					mnvalue[1][j]=Number.MAX_VALUE;
				}
				if (!(typeof data.datasets[i].data[j] == 'undefined')) {
					grandtotal += 1 * data.datasets[i].data[j];
					if(firstNotMissingi[i]==-1)firstNotMissingi[i]=j;
					lastNotMissingi[i]=j;
					if(firstNotMissingj[j]==-1)firstNotMissingj[j]=i;
					lastNotMissingj[j]=i;
					totvalue[axis][j] += 1 * data.datasets[i].data[j]; 
					mxvalue[axis][j] =Math.max(mxvalue[axis][j],1 * data.datasets[i].data[j]);
					mnvalue[axis][j] =Math.min(mnvalue[axis][j],1 * data.datasets[i].data[j]);
					lmaxvalue[axis][i] =Math.max(lmaxvalue[axis][i],1 * data.datasets[i].data[j]);
					lminvalue[axis][i] =Math.min(lminvalue[axis][i],1 * data.datasets[i].data[j]);
				}
			}
		}
		
		for (var i = 0; i < data.datasets.length; i++) {
			if(data.datasets[i].axis == 2) axis=0;else axis=1;
			if (typeof(data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
			else lgtxt = "";
			var prevnotemptyj=-1;
			var prevemptyj=-1;
			for (var j = 0; j < data.datasets[i].data.length; j++) {
			
				if(typeof cumvalue[0][j]== "undefined"){cumvalue[0][j] = 0; prevpos[0][j]=-1;cumvalue[1][j] = 0; prevpos[1][j]=-1; }
				lgtxt2 = "";
				if (typeof data.datasets[i].xPos != "undefined") {
					if (!(typeof data.datasets[i].xPos[j] == "undefined")) lgtxt2 = data.datasets[i].xPos[j];
				}
				if (lgtxt2 == "" && !(typeof(data.labels[j]) == "undefined")) lgtxt2 = data.labels[j];
				if (typeof lgtxt2 == "string") lgtxt2 = lgtxt2.trim();

//				if (!(typeof(data.datasets[i].data[j]) == 'undefined') && data.datasets[i].data[j] != 0) {
				if (!(typeof(data.datasets[i].data[j]) == 'undefined') ) {
					cumvalue[axis][j]+=1*data.datasets[i].data[j];
					switch(tpdraw(ctx,data.datasets[i]))  {
						case "Bar" :
						case "StackedBar" :
						case "HorizontalBar" :
						case "HorizontalStackedBar" :
							result[i][j]= {
								config: config,
								v1: fmtChartJS(config, lgtxt, config.fmtV1),
								v2: fmtChartJS(config, lgtxt2, config.fmtV2),
								v3: fmtChartJS(config, 1 * data.datasets[i].data[j], config.fmtV3),
								v4: fmtChartJS(config, cumvalue[axis][j], config.fmtV4),
								v5: fmtChartJS(config, totvalue[axis][j], config.fmtV5),
								v6: roundToWithThousands(config, fmtChartJS(config, 100 * data.datasets[i].data[j] / totvalue[axis][j], config.fmtV6), config.roundPct),
								v6T: roundToWithThousands(config, fmtChartJS(config, 100 * data.datasets[i].data[j] / grandtotal, config.fmtV6T), config.roundPct),
								v11: fmtChartJS(config, i, config.fmtV11),
								v12: fmtChartJS(config, j, config.fmtV12),
								lgtxt: lgtxt,
								lgtxt2: lgtxt2,
								datavalue: 1 * data.datasets[i].data[j],
								cumvalue: cumvalue[axis][j],
								totvalue: totvalue[axis][j],
								pctvalue: 100 * data.datasets[i].data[j] / totvalue[axis][j],
								pctvalueT: 100 * data.datasets[i].data[j] / grandtotal,
								maxvalue : mxvalue[axis][j],
								minvalue : mnvalue[axis][j],
								lmaxvalue : lmaxvalue[axis][i],
								lminvalue : lminvalue[axis][i],
								grandtotal : grandtotal,
								firstNotMissing : firstNotMissingj[j],
								lastNotMissing : lastNotMissingj[j],
								prevNotMissing : prevnotemptyj,
								prevMissing : prevemptyj,
								nextNotMissing : -1,
								j: j,
								i: i,
								data: data
							};
							if(1 * data.datasets[i].data[j]==0 && (tpdraw(ctx,data.datasets[i])=="HorizontalStackedBar" || tpdraw(ctx,data.datasets[i])=="StackedBar"))result[i][j].v3="";
							break;
						case "Line" :
						case "Radar" :
							result[i][j]= {
								config: config,
								v1: fmtChartJS(config, lgtxt, config.fmtV1),
								v2: fmtChartJS(config, lgtxt2, config.fmtV2),
								v3: fmtChartJS(config, 1 * data.datasets[i].data[j], config.fmtV3),
								v5: fmtChartJS(config, 1 * data.datasets[i].data[j], config.fmtV5),
								v6: fmtChartJS(config, mxvalue[axis][j], config.fmtV6),
								v7: fmtChartJS(config, totvalue[axis][j], config.fmtV7),
								v8: roundToWithThousands(config, fmtChartJS(config, 100 * data.datasets[i].data[j] / totvalue[axis][j], config.fmtV8), config.roundPct),
								v8T: roundToWithThousands(config, fmtChartJS(config, 100 * data.datasets[i].data[j] / grandtotal, config.fmtV8T), config.roundPct),
								v11: fmtChartJS(config, i, config.fmtV11),
								v12: fmtChartJS(config, j, config.fmtV12),
								lgtxt: lgtxt,
								lgtxt2: lgtxt2,
								datavalue: 1 * data.datasets[i].data[j],
								diffnext: 1 * data.datasets[i].data[j],
								pctvalue: 100 * data.datasets[i].data[j] / totvalue[axis][j],
								pctvalueT: 100 * data.datasets[i].data[j] / grandtotal,
								totvalue : totvalue[axis][j],
								cumvalue: cumvalue[axis][j],
								maxvalue : mxvalue[axis][j],
								minvalue : mnvalue[axis][j],
								lmaxvalue : lmaxvalue[axis][i],
								lminvalue : lminvalue[axis][i],
								lminvalue : lminvalue[axis][i],
								grandtotal : grandtotal,
								firstNotMissing : firstNotMissingi[i],
								lastNotMissing : lastNotMissingi[i],
								prevNotMissing : prevnotemptyj,
								prevMissing : prevemptyj,
								nextNotMissing : -1,
								j: j,
								i: i,
								data: data
							};
							if(prevpos[axis][j]>=0){
								result[i][j].v4=fmtChartJS(config, (prevpos[axis][j] != -1 ? 1 * data.datasets[i].data[j]-result[prevpos[axis][j]][j].datavalue : 1 * data.datasets[i].data[j]), config.fmtV4);
								result[i][j].diffprev=(prevpos[axis][j] != -1 ? 1 * data.datasets[i].data[j]-result[prevpos[axis][j]][j].datavalue : 1 * data.datasets[i].data[j]);
								result[prevpos[axis][j]][j].diffnext=data.datasets[prevpos[axis][j]].data[j] - data.datasets[i].data[j];
								result[prevpos[axis][j]][j].v5=result[prevpos[axis][j]][j].diffnext;
							} else {
								result[i][j].v4=1 * data.datasets[i].data[j];
								
							}
							prevpos[axis][j]=i;
							break;
						default:
							break;
					}
					if(!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						if(prevnotemptyj!= -1) {for(k=prevnotemptyj;k<j;k++) result[i][k].nextNotMissing=j;}	
						prevnotemptyj=j;
					}
				} else {
					prevemptyj=j; 
					switch(tpdraw(ctx,data.datasets[i]))  {
						case "Bar" :
						case "StackedBar" :
						case "HorizontalBar" :
						case "HorizontalStackedBar" :
							result[i][j] ={ 
								v1:lgtxt,
								lmaxvalue : lmaxvalue[axis][i],
								lminvalue : lminvalue[axis][i],
								firstNotMissing : firstNotMissingj[j],
								lastNotMissing : lastNotMissingj[j],
								prevNotMissing : prevnotemptyj,
								prevMissing : prevemptyj,
								grandtotal : grandtotal,
								 }; 
							break;
						case "Line" :
						case "Radar" :
							result[i][j] ={ 
								v1:lgtxt,
								lmaxvalue : lmaxvalue[axis][i],
								lminvalue : lminvalue[axis][i],
								firstNotMissing : firstNotMissingi[i],
								lastNotMissing : lastNotMissingi[i],
								prevNotMissing : prevnotemptyj,
								prevMissing : prevemptyj,
								grandtotal : grandtotal,
								 }; 
							break;
						}
				}
			}
		}
		break;
	default:	
		break;
	}

	
return result;

};

function initPassVariableData_part2(statData,data,config,ctx,othervars) {

var realbars=0;

switch(ctx.tpchart) {
	case "Pie" :
	case "Doughnut" :
	case "PolarArea" :
		for(i=0;i<data.length;i++) {
			statData[i].v7= fmtChartJS(config, othervars.midPosX, config.fmtV7);
			statData[i].v8= fmtChartJS(config, othervars.midPosY, config.fmtV8),
			statData[i].v9= fmtChartJS(config, othervars.int_radius, config.fmtV9);
			statData[i].v10= fmtChartJS(config, othervars.ext_radius, config.fmtV10);
			if(ctx.tpchart=="PolarArea") {
				statData[i].radiusOffset= calculateOffset(config.logarithmic, 1 * data[i].value, othervars.calculatedScale, othervars.scaleHop);
				statData[i].v10= fmtChartJS(config, statData[i].radiusOffset, config.fmtV10); 
			}
			else {
				statData[i].v10= fmtChartJS(config, othervars.ext_radius, config.fmtV10); 
				statData[i].radiusOffset=othervars.ext_radius;
			}
			statData[i].midPosX= othervars.midPosX;
			statData[i].midPosY= othervars.midPosY;
			statData[i].int_radius= othervars.int_radius;
			statData[i].ext_radius= othervars.ext_radius;
		}
		break;
	case "Radar" :
	case "Line" :
	case "Bar" :
	case "StackedBar" :
	case "HorizontalBar" :
	case "HorizontalStackedBar" :
		var tp;
		var tempp = new Array(data.datasets.length);
		var tempn = new Array(data.datasets.length);
		for (var i = 0; i < data.datasets.length; i++) {
			switch(tpdraw(ctx,data.datasets[i])) {
				case "Line" :
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						statData[i][j].xAxisPosY = othervars.xAxisPosY;
						statData[i][j].yAxisPosX = othervars.yAxisPosX;
						statData[i][j].valueHop = othervars.valueHop;
						statData[i][j].nbValueHop = othervars.nbValueHop;
						if (data.datasets[i].axis == 2) {
							statData[i][j].scaleHop = othervars.scaleHop2;
							statData[i][j].zeroY = othervars.zeroY2;
							statData[i][j].calculatedScale = othervars.calculatedScale2;
							statData[i][j].logarithmic = othervars.logarithmic2;
						} else {
							statData[i][j].scaleHop = othervars.scaleHop;
							statData[i][j].zeroY = othervars.zeroY;
							statData[i][j].calculatedScale = othervars.calculatedScale;
							statData[i][j].logarithmic  = othervars.logarithmic;
						}
						statData[i][j].xPos=xPos(i,j,data,othervars.yAxisPosX,othervars.valueHop,othervars.nbValueHop);
						statData[i][j].yAxisPos=othervars.xAxisPosY - statData[i][j].zeroY;
						if(ctx.tpchart=="Bar") {
							statData[i][j].xPos+=(othervars.valueHop/2);
							statData[i][j].yAxisPosX += (othervars.valueHop/2);
						}			
						if(j==0) {
							statData[i][j].lmaxvalue_offset=calculateOffset(statData[i][j].logarithmic, statData[i][j].lmaxvalue, statData[i][j].calculatedScale, statData[i][j].scaleHop) - statData[i][j].zeroY;
							statData[i][j].lminvalue_offset=calculateOffset(statData[i][j].logarithmic, statData[i][j].lminvalue, statData[i][j].calculatedScale, statData[i][j].scaleHop) - statData[i][j].zeroY;
						} else {
							statData[i][j].lmaxvalue_offset=statData[i][0].lmaxvalue_offset;
							statData[i][j].lminvalue_offset=statData[i][0].lminvalue_offset;
						}
						
						if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
							statData[i][j].yPosOffset= calculateOffset(statData[i][j].logarithmic, data.datasets[i].data[j], statData[i][j].calculatedScale, statData[i][j].scaleHop) - statData[i][j].zeroY;
							statData[i][j].posY=statData[i][j].yAxisPos - statData[i][j].yPosOffset;
						}
						statData[i][j].posX=statData[i][j].xPos;
						statData[i][j].v9= statData[i][j].xPos;
						statData[i][j].v10=statData[i][j].posY;

						statData[i][j].annotateStartPosX = statData[i][j].xPos;
						statData[i][j].annotateEndPosX = statData[i][j].xPos;
						statData[i][j].annotateStartPosY = othervars.xAxisPosY;
						statData[i][j].annotateEndPosY = othervars.xAxisPosY-othervars.msr.availableHeight;
						statData[i][j].D1A=undefined;
						statData[i][j].D1B=undefined;
					}
					break;
				case "Radar" :
					var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						statData[i][j].midPosX =  othervars.midPosX;
						statData[i][j].midPosY =  othervars.midPosY;
						statData[i][j].int_radius= 0;
						statData[i][j].ext_radius= othervars.maxSize;
						statData[i][j].radiusOffset= othervars.maxSize;
						statData[i][j].calculated_offset= calculateOffset(config.logarithmic, data.datasets[i].data[j], othervars.calculatedScale, othervars.scaleHop);
						statData[i][j].offsetX=Math.cos(config.startAngle * Math.PI / 180 - j * rotationDegree) * statData[i][j].calculated_offset;
						statData[i][j].offsetY=Math.sin(config.startAngle * Math.PI / 180 - j * rotationDegree) * statData[i][j].calculated_offset;
						statData[i][j].v9=statData[i][j].midPosX + statData[i][j].offsetX;
						statData[i][j].v10=statData[i][j].midPosY - statData[i][j].offsetY;
						statData[i][j].posX=statData[i][j].midPosX + statData[i][j].offsetX;
						statData[i][j].posY=statData[i][j].midPosY - statData[i][j].offsetY;
						if(j==0)statData[i][j].calculated_offset_max=calculateOffset(config.logarithmic, statData[i][j].lmaxvalue, othervars.calculatedScale, othervars.scaleHop);
						else    statData[i][j].calculated_offset_max=statData[0][j].calculated_offset_max;
						statData[i][j].annotateStartPosX = othervars.midPosX;
						statData[i][j].annotateEndPosX = othervars.midPosX+Math.cos(config.startAngle * Math.PI / 180 - j * rotationDegree) * othervars.maxSize;
						statData[i][j].annotateStartPosY = othervars.midPosY;
						statData[i][j].annotateEndPosY = othervars.midPosY-Math.sin(config.startAngle * Math.PI / 180 - j * rotationDegree) * othervars.maxSize;
						if(Math.abs(statData[i][j].annotateStartPosX-statData[i][j].annotateEndPosX)<config.zeroValue) {
							statData[i][j].D1A=undefined;
							statData[i][j].D1B=undefined;
							statData[i][j].D2A=0;
						} else {
							statData[i][j].D1A=(statData[i][j].annotateStartPosY-statData[i][j].annotateEndPosY)/(statData[i][j].annotateStartPosX-statData[i][j].annotateEndPosX);
							statData[i][j].D1B=-statData[i][j].D1A*statData[i][j].annotateStartPosX+statData[i][j].annotateStartPosY;
							if(Math.abs(statData[i][j].D1A)>=config.zeroValue)statData[i][j].D2A=-(1/statData[i][j].D1A);
							else statData[i][j].D2A=undefined;
						}

				        }
					break;
				case "Bar" :
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						statData[i][j].xPosLeft= othervars.yAxisPosX + config.barValueSpacing + othervars.valueHop * j + othervars.barWidth * realbars + config.barDatasetSpacing * realbars + config.barStrokeWidth * realbars;
						statData[i][j].xPosRight = statData[i][j].xPosLeft + othervars.barWidth;
						statData[i][j].yPosBottom =othervars.xAxisPosY - othervars.zeroY
						statData[i][j].barHeight=calculateOffset(config.logarithmic, 1 * data.datasets[i].data[j], othervars.calculatedScale, othervars.scaleHop) - othervars.zeroY;
						if (data.datasets[i].axis == 2) {
							statData[i][j].yPosBottom =othervars.xAxisPosY - othervars.zeroY2;
							statData[i][j].barHeight=calculateOffset(config.logarithmic2, 1 * data.datasets[i].data[j], othervars.calculatedScale2, othervars.scaleHop2) - othervars.zeroY2;
						} else {
							statData[i][j].yPosBottom =othervars.xAxisPosY - othervars.zeroY
							statData[i][j].barHeight=calculateOffset(config.logarithmic, 1 * data.datasets[i].data[j], othervars.calculatedScale, othervars.scaleHop) - othervars.zeroY;
						}
						statData[i][j].yPosTop = statData[i][j].yPosBottom - statData[i][j].barHeight + (config.barStrokeWidth / 2);
						statData[i][j].v7=statData[i][j].xPosLeft;
						statData[i][j].v8=statData[i][j].yPosBottom;
						statData[i][j].v9=statData[i][j].xPosRight;
						statData[i][j].v10=statData[i][j].yPosTop;

					}
					realbars++;
					break;			
				case "StackedBar" :
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						if (typeof tempp[j]=="undefined") {
							tempp[j]=0;
							tempn[j]=0;
							zeroY=  calculateOffset(config.logarithmic, 0 , othervars.calculatedScale, othervars.scaleHop);
						}
						if ((typeof data.datasets[i].data[j] == 'undefined')) continue;
						statData[i][j].xPosLeft= othervars.yAxisPosX + config.barValueSpacing + othervars.valueHop * j;
						if (1*data.datasets[i].data[j]<0) {
							statData[i][j].botval=tempn[j];
							statData[i][j].topval=tempn[j]+1*data.datasets[i].data[j] ;
							tempn[j]=tempn[j]+1*data.datasets[i].data[j] ;
						} else {
							statData[i][j].botval=tempp[j];
							statData[i][j].topval=tempp[j]+1*data.datasets[i].data[j] ;
							tempp[j]=tempp[j]+1*data.datasets[i].data[j] ;
						}
						statData[i][j].xPosRight = statData[i][j].xPosLeft + othervars.barWidth;
						statData[i][j].botOffset = calculateOffset(config.logarithmic, statData[i][j].botval , othervars.calculatedScale, othervars.scaleHop);
						statData[i][j].topOffset = calculateOffset(config.logarithmic, statData[i][j].topval , othervars.calculatedScale, othervars.scaleHop);
						statData[i][j].yPosBottom =othervars.xAxisPosY - statData[i][j].botOffset;
						statData[i][j].yPosTop = othervars.xAxisPosY - statData[i][j].topOffset;
						// treat spaceBetweenBar 
						if(config.spaceBetweenBar > 0)
						{
							if(1*data.datasets[i].data[j]<0) {
								statData[i][j].yPosBottom+=config.spaceBetweenBar;
								if(tempn[j]==1*data.datasets[i].data[j])statData[i][j].yPosBottom-=(config.spaceBetweenBar/2);	
								if(statData[i][j].yPosTop<statData[i][j].yPosBottom)statData[i][j].yPosBottom=statData[i][j].yPosTop;
							} else if (1*data.datasets[i].data[j]>0) {
								statData[i][j].yPosBottom-=config.spaceBetweenBar;	
								if(tempp[j]==1*data.datasets[i].data[j])statData[i][j].yPosBottom+=(config.spaceBetweenBar/2);	
								if(statData[i][j].yPosTop>statData[i][j].yPosBottom)statData[i][j].yPosBottom=statData[i][j].yPosTop;
							}
						}
						statData[i][j].v7=statData[i][j].xPosLeft;
						statData[i][j].v8=statData[i][j].yPosBottom;
						statData[i][j].v9=statData[i][j].xPosRight;
						statData[i][j].v10=statData[i][j].yPosTop;
					}
					break;			
				case "HorizontalBar" :
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						statData[i][j].xPosLeft= othervars.yAxisPosX + othervars.zeroY;
						statData[i][j].yPosTop=othervars.xAxisPosY + config.barValueSpacing - othervars.scaleHop * (j + 1) + othervars.barWidth * i + config.barDatasetSpacing * i + config.barStrokeWidth * i;
						statData[i][j].yPosBottom=statData[i][j].yPosTop+othervars.barWidth;
						statData[i][j].barWidth = calculateOffset(config.logarithmic, 1 * data.datasets[i].data[j], othervars.calculatedScale, othervars.valueHop) - othervars.zeroY;
						statData[i][j].xPosRight = statData[i][j].xPosLeft + statData[i][j].barWidth;

						statData[i][j].v7=statData[i][j].xPosLeft;
						statData[i][j].v8=statData[i][j].yPosBottom;
						statData[i][j].v9=statData[i][j].xPosRight;
						statData[i][j].v10=statData[i][j].yPosTop;
					}
					break;			
				case "HorizontalStackedBar" :
					for (var j = 0; j < data.datasets[i].data.length; j++) {
						if (i == 0) {
							tempp[j]=0;
							tempn[j]=0;
						}
						if (typeof(data.datasets[i].data[j]) == 'undefined')  continue;
//						if ((typeof(data.datasets[i].data[j]) == 'undefined') || 1*data.datasets[i].data[j] == 0 ) continue;

						statData[i][j].xPosLeft= othervars.yAxisPosX + config.barValueSpacing + othervars.valueHop * j;
						if (1*data.datasets[i].data[j]<0) {
							statData[i][j].leftval=tempn[j];
							statData[i][j].rightval=tempn[j]+1*data.datasets[i].data[j] ;
							tempn[j]=tempn[j]+1*data.datasets[i].data[j] ;
						} else {
							statData[i][j].leftval=tempp[j];
							statData[i][j].rightval=tempp[j]+1*data.datasets[i].data[j] ;
							tempp[j]=tempp[j]+1*data.datasets[i].data[j] ;
						}
						statData[i][j].rightOffset = HorizontalCalculateOffset(statData[i][j].rightval , othervars.calculatedScale, othervars.valueHop);
						statData[i][j].leftOffset  = HorizontalCalculateOffset(statData[i][j].leftval , othervars.calculatedScale, othervars.valueHop);
						statData[i][j].xPosRight = othervars.yAxisPosX + statData[i][j].rightOffset;
						statData[i][j].xPosLeft  = othervars.yAxisPosX + statData[i][j].leftOffset;
						statData[i][j].yPosTop =othervars.xAxisPosY + config.barValueSpacing - othervars.scaleHop * (j + 1);
						statData[i][j].yPosBottom = statData[i][j].yPosTop+othervars.barWidth;
						// treat spaceBetweenBar 
						if(config.spaceBetweenBar > 0)
						{
							if(1*data.datasets[i].data[j]<0) {
								statData[i][j].xPosLeft-=config.spaceBetweenBar;	
								if(tempn[j]==1*data.datasets[i].data[j])statData[i][j].xPosLeft+=(config.spaceBetweenBar/2);	
								if(statData[i][j].xPosLeft<statData[i][j].xPosRight)statData[i][j].xPosLeft=statData[i][j].xPosRight;
							} else if (1*data.datasets[i].data[j]>0) {
								statData[i][j].xPosLeft+=config.spaceBetweenBar;	
								if(tempp[j]==1*data.datasets[i].data[j])statData[i][j].xPosLeft-=(config.spaceBetweenBar/2);	
								if(statData[i][j].xPosLeft>statData[i][j].xPosRight)statData[i][j].xPosLeft=statData[i][j].xPosRight;
							}
						}

						statData[i][j].v7=statData[i][j].xPosLeft;
						statData[i][j].v8=statData[i][j].yPosBottom;
						statData[i][j].v9=statData[i][j].xPosRight;
						statData[i][j].v10=statData[i][j].yPosTop;
					}
					break;
				default : 
					break;
			}
	}
	
} ;



	function xPos(ival, iteration, data,yAxisPosX,valueHop,nbValueHop) {
		if (typeof data.datasets[ival].xPos == "object") {
			if (!(typeof data.datasets[ival].xPos[Math.floor(iteration + config.zeroValue)] == "undefined")) {
				var width = valueHop * nbValueHop;
				var deb = (typeof data.xBegin != "undefined") ? data.xBegin : 1 * data.labels[0];
				var fin = (typeof data.xEnd != "undefined") ? data.xEnd : 1 * data.labels[data.labels.length - 1];
				if (fin <= deb) fin = deb + 100;
				if (1 * data.datasets[ival].xPos[Math.floor(iteration + config.zeroValue)] >= deb && data.datasets[ival].xPos[Math.floor(iteration + config.zeroValue)] <= fin) {
					var p1 = yAxisPosX + width * ((1 * data.datasets[ival].xPos[Math.floor(iteration + config.zeroValue)] - deb) / (fin - deb));
					var p2 = p1;
					if (Math.abs(iteration - Math.floor(iteration + config.zeroValue)) > config.zeroValue) {
						var tt = iteration + Math.floor(iteration + config.zeroValue);
						var p2 = xPos(ival, Math.ceil(iteration - config.zeroValue), data);
					}
					return p1 + (iteration - Math.floor(iteration + config.zeroValue)) * (p2 - p1);
				}
			}
		}
		return yAxisPosX + (valueHop * iteration);
	};


	function calculateOrderOfMagnitude(val) {
		return Math.floor(Math.log(val) / Math.LN10);
	};

	function calculateOffset(logarithmic, val, calculatedScale, scaleHop) {
		if (!logarithmic) { // no logarithmic scale
			var outerValue = calculatedScale.steps * calculatedScale.stepValue;
			var adjustedValue = val - calculatedScale.graphMin;
			var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
			return (scaleHop * calculatedScale.steps) * scalingFactor;
		} else { // logarithmic scale
			return CapValue(log10(val) * scaleHop - calculateOrderOfMagnitude(calculatedScale.graphMin) * scaleHop, undefined, 0);
		}
	};

	function HorizontalCalculateOffset(val, calculatedScale, scaleHop) {
		var outerValue = calculatedScale.steps * calculatedScale.stepValue;
		var adjustedValue = val - calculatedScale.graphMin;
		var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
		return (scaleHop * calculatedScale.steps) * scalingFactor;
	};

	//Apply cap a value at a high or low number
	function CapValue(valueToCap, maxValue, minValue) {
		if (isNumber(maxValue)) {
			if (valueToCap > maxValue) {
				return maxValue;
			}
		}
		if (isNumber(minValue)) {
			if (valueToCap < minValue) {
				return minValue;
			}
		}
		return valueToCap;
	};
	function log10(val) {
		return Math.log(val) / Math.LN10;
	};
};

function isBooleanOptionTrue(optionVar,defaultvalue) {
	if(typeof optionvar == "undefined") {
		if(typeof defaultvalue=="function") return true;
		else if(typeof defaultvalue == "object") { 
			for(var j=0;j<defaultvalue.length;j++) if (defaultvalue[j])return true;
			return false;
		}
		else return defaultvalue;
	}
	if(typeof optionvar=="function") return true;
	else if(typeof optionvar == "object") {
			for(var j=0;j<optionvar.length;j++) if (optionvar[j])return true;
			return false;
	} else return optionvar;
};

function setOptionValue(reference,ctx,data,statData,optionvar,defaultvalue,posi,posj,othervars) {

	if(typeof optionvar == "undefined") {
		if(typeof defaultvalue=="function") return defaultvalue(reference,ctx,data,statData,posi,posj,othervars);
		else if(typeof defaultvalue == "object") {
			if(posj==-1)return defaultvalue[Math.min(defaultvalue.length-1,Math.max(0,posi))];
			else return defaultvalue[Math.min(defaultvalue.length-1,Math.max(0,posj))];
		}
		else return defaultvalue;
	}
	if(typeof optionvar=="function") return optionvar(reference,ctx,data,statData,posi,posj,othervars);
	else if(typeof optionvar == "object") {
		if (posj==-1)return optionvar[Math.min(optionvar.length-1,Math.max(0,posi))];
		else return optionvar[Math.min(optionvar.length-1,Math.max(0,posj))];
	}
	else return optionvar;
};

function tpdraw(ctx,dataval) {
	switch(ctx.tpchart)  {
		case "Bar" :
			if (dataval.type=="Line") { tp="Line";} 	
			else {tp=ctx.tpchart;}
			break;
		default : 
			tp=ctx.tpchart;
			break;
	}
	return tp;
};


