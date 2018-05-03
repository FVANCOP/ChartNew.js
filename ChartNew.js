/*                                                                                                                                                                                                             
 * ChartNew.js  
 *                                                                                                                                                                           
 * Vancoppenolle Francois - January 2014                                                                               
 * francois.vancoppenolle@favomo.be                                                                                    
 *                                                                        
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

// ctx.firstPass=0 or "undefined" : Chart has never been drawn (because dynamicDisplay = true and ctx has never been displayed in current screen)
// ctx.firstPass=1 : Chart has to be drawn with animation (if config.animation = true);
// ctx.firstPass=2 : chart has to be drawn without animation;
// ctx.firstPass=9 : chart is completely drawn;
// If chartJsResize called : increment the value of ctx.firstPass with a value of 10.
// non standard functions;
var annotate_shape = 'divCursor'
var chartJSLineStyle = [];
chartJSLineStyle["solid"] = [];
chartJSLineStyle["dotted"] = [1, 4];
chartJSLineStyle["shortDash"] = [2, 1];
chartJSLineStyle["dashed"] = [4, 2];
chartJSLineStyle["dashSpace"] = [4, 6];
chartJSLineStyle["longDashDot"] = [7, 2, 1, 2];
chartJSLineStyle["longDashShortDash"] = [10, 4, 4, 4];
chartJSLineStyle["gradient"] = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1];

function lineStyleFn(data) {
	if ((typeof chartJSLineStyle[data]) === "object") return chartJSLineStyle[data];
	else return chartJSLineStyle["solid"];
};
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
var charJSPersonalDefaultOptionsLine = {};
var charJSPersonalDefaultOptionsRadar = {};
var charJSPersonalDefaultOptionsPolarArea = {};
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
		var roundVal;
		if (place <= 0) {
			roundVal = -place;
			newval = +(Math.round(newval + "e+" + roundVal) + "e-" + roundVal);
		} else {
			roundVal = place;
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

function fmtChartJSPerso(config, value, fmt) {
	switch (fmt) {
		case "SampleJS_Format":
			if (typeof(value) == "number") return_value = "My Format : " + value.toString() + " $";
			else return_value = value + "XX";
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
	} else if ((fmt == "none" || fmt == "money") && typeof(value) == "number") {
		if (config.roundNumber != "none") {
			var roundVal;
			if (config.roundNumber <= 0) {
				roundVal = -config.roundNumber;
				value = +(Math.round(value + "e+" + roundVal) + "e-" + roundVal);
			} else {
				roundVal = config.roundNumber;
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
		if (fmt == "money") {
			if (config.currencyPosition == "before") return_value = config.currency + return_value;
			else return_value = return_value + config.currency;
		}
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
	return null;
};

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

function tmplbis(str, data, config) {
	newstr = str;
	if (newstr.substr(0, config.templatesOpenTag.length) == config.templatesOpenTag) newstr = "<%=" + newstr.substr(config.templatesOpenTag.length, newstr.length - config.templatesOpenTag.length);
	if (newstr.substr(newstr.length - config.templatesCloseTag.length, config.templatesCloseTag.length) == config.templatesCloseTag) newstr = newstr.substr(0, newstr.length - config.templatesCloseTag.length) + "%>";
	return tmplter(newstr, data);
}

function tmplter(str, data) {
	var mathFunctionList = ["mean", "varianz", "stddev", "cv", "median"];
	var regexMath = new RegExp('<%=((?:(?:.*?)\\W)??)((?:' + mathFunctionList.join('|') + ')(?:Dif)?)\\(([0-9]*?)\\)(.*?)%>', 'g');
	while (regexMath.test(str)) {
		str = str.replace(regexMath, function($0, $1, $2, $3, $4) {
			var rndFac;
			if ($3) rndFac = $3;
			else rndFac = 2;
			var value = addParameters2Function(data, $2, "mathFunctions");
			if (isNumber(value)) return '<%=' + $1 + '' + Math.round(Math.pow(10, rndFac) * value) / Math.pow(10, rndFac) + '' + $4 + '%>';
			return '<%= %>';
		});
	}
	// Figure out if we're getting a template, or if we need to
	// load the template - and be sure to cache the result.
	// first check if it's can be an id
	var fn = /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(str) ? cachebis[str] = cachebis[str] || tmplter(document.getElementById(str).innerHTML) :
		// Generate a reusable function that will serve as a template
		// generator (and which will be cached).
		new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +
			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +
			// Convert the template into pure JavaScript
			str.replace(/[\r\n]/g, "\\n").replace(/[\t]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
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
	 * @param horizontal horizontal
	 */
	CanvasRenderingContext2D.prototype.fillTextMultiLine = function(text, x, y, yLevel, lineHeight, horizontal, detectMouseOnText, ctx, idText, rotate, x_decal, y_decal, posi, posj) {
		var lines = ("" + text).split("\n");
		// if its one line => in the middle 
		// two lines one above the mid one below etc.	
		if (yLevel == "middle") {
			if (horizontal) y -= ((lines.length - 1) / 2) * lineHeight;
		} else if (yLevel == "bottom") { // default
			if (horizontal) y -= (lines.length - 1) * lineHeight;
		}
		var y_pos = y - lineHeight;
		for (var i = 0; i < lines.length; i++) {
			this.fillText(lines[i], x, y);
			y += lineHeight;
		}
		if (detectMouseOnText) {
			var txtSize = ctx.measureTextMultiLine(text, lineHeight);
			var x_pos = [];
			var y_pos = [];
			x_pos.p1 = x_decal + x;
			y_pos.p1 = y_decal + y - lineHeight;
			var rotateRV = (Math.PI / 2) + rotate;
			if (ctx.textAlign == "left" && yLevel == "top") {
				x_pos.p1 += lineHeight * Math.cos(rotateRV);
				y_pos.p1 += lineHeight * Math.sin(rotateRV);
			} else if (ctx.textAlign == "left" && yLevel == "middle") {
				x_pos.p1 += (lineHeight / 2) * Math.cos(rotateRV);
				y_pos.p1 += (lineHeight / 2) * Math.sin(rotateRV);
			} else if (ctx.textAlign == "left" && yLevel == "bottom") {
				// nothing to adapt;
			} else if (ctx.textAlign == "center" && yLevel == "top") {
				x_pos.p1 += lineHeight * Math.cos(rotateRV) - (txtSize.textWidth / 2) * Math.cos(rotate);
				y_pos.p1 += lineHeight * Math.sin(rotateRV) - (txtSize.textWidth / 2) * Math.sin(rotate);
			} else if (ctx.textAlign == "center" && yLevel == "middle") {
				x_pos.p1 += (lineHeight / 2) * Math.cos(rotateRV) - (txtSize.textWidth / 2) * Math.cos(rotate);
				y_pos.p1 += (lineHeight / 2) * Math.sin(rotateRV) - (txtSize.textWidth / 2) * Math.sin(rotate);
			} else if (ctx.textAlign == "center" && yLevel == "bottom") {
				x_pos.p1 -= (txtSize.textWidth / 2) * Math.cos(rotate);
				y_pos.p1 -= (txtSize.textWidth / 2) * Math.sin(rotate);
			} else if (ctx.textAlign == "right" && yLevel == "top") {
				x_pos.p1 += (lineHeight * Math.cos(rotateRV) - txtSize.textWidth * Math.cos(rotate));
				y_pos.p1 += (lineHeight * Math.sin(rotateRV) - txtSize.textWidth * Math.sin(rotate));
			} else if (ctx.textAlign == "right" && yLevel == "middle") {
				x_pos.p1 += (lineHeight / 2) * Math.cos(rotateRV) - txtSize.textWidth * Math.cos(rotate);
				y_pos.p1 += (lineHeight / 2) * Math.sin(rotateRV) - txtSize.textWidth * Math.sin(rotate);
			} else if (ctx.textAlign == "right" && yLevel == "bottom") {
				x_pos.p1 -= txtSize.textWidth * Math.cos(rotate);
				y_pos.p1 -= txtSize.textWidth * Math.sin(rotate);
			}
			// Other corners of the rectangle;
			x_pos.p2 = x_pos.p1 + txtSize.textWidth * Math.cos(rotate);
			y_pos.p2 = y_pos.p1 + txtSize.textWidth * Math.sin(rotate);
			x_pos.p3 = x_pos.p1 - lineHeight * Math.cos(rotateRV);
			y_pos.p3 = y_pos.p1 - lineHeight * Math.sin(rotateRV);
			x_pos.p4 = x_pos.p3 + txtSize.textWidth * Math.cos(rotate);
			y_pos.p4 = y_pos.p3 + txtSize.textWidth * Math.sin(rotate);
			jsTextMousePos[ctx.ChartNewId][jsTextMousePos[ctx.ChartNewId].length] = [idText, text, x_pos, y_pos, rotate, txtSize.textWidth, txtSize.textHeight, posi, posj];
		}
	};
	CanvasRenderingContext2D.prototype.measureTextMultiLine = function(text, lineHeight) {
		var textWidth = 0;
		var textHeight = 0;
		var lg;
		var lines = ("" + text).replace(/<BR>/ig, "\n").split("\n");
		if (lines.length > 0) textHeight = lineHeight + 1.5 * (lines.length - 1) * textHeight;
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
		CanvasRenderingContext2D.prototype.setLineDash = function(listdash) {
			return 0;
		};
	};
	CanvasRenderingContext2D.prototype.drawRectangle = function(TheRectangle) {
		var originalfillStyle = this.fillStyle;
		if (typeof TheRectangle.x == 'undefined') {
			TheRectangle.x = 0;
		}
		if (TheRectangle.width < 0) {
			TheRectangle.x += TheRectangle.width;
			TheRectangle.width *= -1;
		}
		if (TheRectangle.height < 0) {
			TheRectangle.y += TheRectangle.height;
			TheRectangle.height *= -1;
		}
		if (typeof TheRectangle.y == 'undefined') {
			TheRectangle.y = 0;
		}
		if (typeof TheRectangle.y == 'undefined') {
			TheRectangle.y = 0;
		}
		if (typeof TheRectangle.backgroundColor != 'undefined') {
			this.fillStyle = TheRectangle.backgroundColor;
		}
		if (typeof TheRectangle.borderRadius == 'undefined') {
			TheRectangle.borderRadius = 0;
		}
		if (typeof TheRectangle.borderSelection == 'undefined') {
			TheRectangle.borderSelection = 15;
		}
		var rectangleRadius = parseInt(TheRectangle.borderRadius);
		// The radius correction has been set to avoid problems when there is a big border and a color inside the rectangle;
		if (TheRectangle.borders && TheRectangle.bordersWidth > 5 && this.fillStyle != "rgba(0,0,0,0)") rectangleRadius = 0;
		if (TheRectangle.borders && TheRectangle.fill && TheRectangle.borderSelection == 15 && rectangleRadius > 0) return this;
		if (rectangleRadius == 0 && TheRectangle.fill == true) {
			this.fillRect(TheRectangle.x, TheRectangle.y, TheRectangle.width, TheRectangle.height);
		}
		if (rectangleRadius == 0 && TheRectangle.borderSelection >= 15 && TheRectangle.stroke == true) {
			this.strokeRect(TheRectangle.x, TheRectangle.y, TheRectangle.width, TheRectangle.height);
		}
		if (rectangleRadius != 0 || (TheRectangle.borderSelection < 15 && TheRectangle.stroke == true)) {
			if (rectangleRadius > TheRectangle.width / 2) {
				rectangleRadius = TheRectangle.width / 2
			}
			if (TheRectangle.height < TheRectangle.width && rectangleRadius > TheRectangle.height / 2) {
				rectangleRadius = TheRectangle.height / 2
			};
			if (TheRectangle.fill) {
				this.beginPath();
				this.lineWidth = 0;
				this.strokeStyle = "rgba(0,0,0,0)";
				this.moveTo(TheRectangle.x + rectangleRadius, TheRectangle.y);
				this.lineTo(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y);
				this.arc(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y + rectangleRadius, rectangleRadius, 1.5 * Math.PI, 0);
				this.lineTo(TheRectangle.x + TheRectangle.width, TheRectangle.y + TheRectangle.height - rectangleRadius);
				this.arc(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y + TheRectangle.height - rectangleRadius, rectangleRadius, 0, 0.5 * Math.PI);
				this.lineTo(TheRectangle.x + rectangleRadius, TheRectangle.y + TheRectangle.height);
				this.arc(TheRectangle.x + rectangleRadius, TheRectangle.y + TheRectangle.height - rectangleRadius, rectangleRadius, 0.5 * Math.PI, 1 * Math.PI);
				this.lineTo(TheRectangle.x, TheRectangle.y + rectangleRadius);
				this.arc(TheRectangle.x + rectangleRadius, TheRectangle.y + rectangleRadius, rectangleRadius, 1 * Math.PI, 1.5 * Math.PI);
				this.closePath();
				this.fill();
				this.stroke();
			}
			if (TheRectangle.stroke == true) {
				var dleft = (isBorder(TheRectangle.borderSelection, "LEFT") == false);
				var dright = (isBorder(TheRectangle.borderSelection, "RIGHT") == false);
				var dtop = (isBorder(TheRectangle.borderSelection, "TOP") == false);
				var dbottom = (isBorder(TheRectangle.borderSelection, "BOTTOM") == false);
				if (dtop == false && (dleft == true || TheRectangle.borderSelection == 15)) {
					dtop = true;
					this.beginPath();
					this.moveTo(TheRectangle.x + rectangleRadius, TheRectangle.y);
					this.lineTo(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y);
					if (isBorder(TheRectangle.borderSelection, "RIGHT")) this.arc(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y + rectangleRadius, rectangleRadius, 1.5 * Math.PI, 0);
					else this.stroke()
				}
				if (dright == false && (dtop == true || TheRectangle.borderSelection == 15)) {
					dright = true;
					if (isBorder(TheRectangle.borderSelection, "TOP") == false) {
						this.beginPath();
						this.moveTo(TheRectangle.x + TheRectangle.width, TheRectangle.y + rectangleRadius);
					}
					this.lineTo(TheRectangle.x + TheRectangle.width, TheRectangle.y + TheRectangle.height - rectangleRadius);
					if (isBorder(TheRectangle.borderSelection, "BOTTOM")) this.arc(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y + TheRectangle.height - rectangleRadius, rectangleRadius, 0, 0.5 * Math.PI);
					else this.stroke()
				}
				if (dbottom == false && (dright == true || TheRectangle.borderSelection == 15)) {
					dbottom = true;
					if (isBorder(TheRectangle.borderSelection, "RIGHT") == false) {
						this.beginPath();
						this.moveTo(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y + TheRectangle.height);
					}
					this.lineTo(TheRectangle.x + rectangleRadius, TheRectangle.y + TheRectangle.height);
					if (isBorder(TheRectangle.borderSelection, "LEFT")) this.arc(TheRectangle.x + rectangleRadius, TheRectangle.y + TheRectangle.height - rectangleRadius, rectangleRadius, 0.5 * Math.PI, 1 * Math.PI);
					else this.stroke()
				}
				if (dleft == false && (dbottom == true || TheRectangle.borderSelection == 15)) {
					dleft = true;
					if (isBorder(TheRectangle.borderSelection, "BOTTOM") == false) {
						this.beginPath();
						this.moveTo(TheRectangle.x, TheRectangle.y + TheRectangle.height - rectangleRadius);
					}
					this.lineTo(TheRectangle.x, TheRectangle.y + rectangleRadius);
					if (isBorder(TheRectangle.borderSelection, "TOP")) {
						this.arc(TheRectangle.x + rectangleRadius, TheRectangle.y + rectangleRadius, rectangleRadius, 1 * Math.PI, 1.5 * Math.PI);
						if (TheRectangle.borderSelection == 15) {
							this.closePath();
							this.stroke();
						}
					} else this.stroke()
				}
				if (dtop == false && (dleft == true || TheRectangle.borderSelection == 15)) {
					dtop = true;
					if (isBorder(TheRectangle.borderSelection, "LEFT") == false) {
						this.beginPath();
						this.moveTo(TheRectangle.x + rectangleRadius, TheRectangle.y);
					}
					this.lineTo(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y);
					if (isBorder(TheRectangle.borderSelection, "RIGHT")) this.arc(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y + rectangleRadius, rectangleRadius, 1.5 * Math.PI, 0);
					else this.stroke()
				}
				if (dright == false && (dtop == true || TheRectangle.borderSelection == 15)) {
					dright = true;
					if (isBorder(TheRectangle.borderSelection, "TOP") == false) {
						this.beginPath();
						this.moveTo(TheRectangle.x + TheRectangle.width, TheRectangle.y + rectangleRadius);
					}
					this.lineTo(TheRectangle.x + TheRectangle.width, TheRectangle.y + TheRectangle.height - rectangleRadius);
					if (isBorder(TheRectangle.borderSelection, "BOTTOM")) this.arc(TheRectangle.x + TheRectangle.width - rectangleRadius, TheRectangle.y + TheRectangle.height - rectangleRadius, rectangleRadius, 0, 0.5 * Math.PI);
					else this.stroke()
				}
				if (this.fillStyle != "rgba(0,0,0,0)" && TheRectangle.borderSelection == 15) this.fill();
			};
		}
		this.fillStyle = originalfillStyle;
		return this;
	};
};
cursorDivCreated = false;

function createCursorDiv(config) {
	if (cursorDivCreated == false) {
		var div = document.createElement(annotate_shape);
		div.id = annotate_shape;
		div.style.position = 'absolute';
		document.body.appendChild(div);
		cursorDivCreated = true;
	}
};
initChartJsResize = false;
var jsGraphResize = new Array();

function addResponsiveChart(id, ctx, data, config) {
	if (initChartJsResize == false) {
		if (window.addEventListener) {
			window.addEventListener("resize", chartJsResize);
		} else {
			window.attachEvent("resize", chartJsResize);
		}
	}
	jsGraphResize[jsGraphResize.length] = [id, ctx.tpchart, ctx, data, config];
};
var container;

function getMaximumWidth(domNode) {
	if (domNode.parentNode != null)
		if (domNode.parentNode != undefined) container = domNode.parentNode;
	return container.clientWidth;
};

function getMaximumHeight(domNode) {
	if (domNode.parentNode != null)
		if (domNode.parentNode != undefined) container = domNode.parentNode;
	return container.clientHeight;
};

function resizeCtxFunction(iter, ctx, data, config) {
	if (isIE() < 9 && isIE() != false) return (true);
	var beforeWidth, afterWidth;
	var beforeHeight, afterHeight;
	beforeWidth = ctx.canvas.width;
	beforeHeight = ctx.canvas.height;
	afterWidth = beforeWidth;
	afterHeight = beforeHeight;
	var pxRatio = 1;
	if (window.devicePixelRatio > 1) pxRatio = window.devicePixelRatio;
	var maintainAspectRatio, responsiveMinWidth, responsiveMaxWidth, responsiveMaxHeight;
	if (typeof config.maintainAspectRatio == "undefined") maintainAspectRatio = true;
	else maintainAspectRatio = config.maintainAspectRatio;
	if (typeof config.responsiveMinWidth == "undefined") responsiveMinWidth = 0;
	else responsiveMinWidth = config.responsiveMinWidth;
	if (typeof config.responsiveMinHeight == "undefined") responsiveMinHeight = 0;
	else responsiveMinHeight = config.responsiveMinHeight;
	if (typeof config.responsiveMaxWidth == "undefined") responsiveMaxWidth = 9999999;
	else responsiveMaxWidth = config.responsiveMaxWidth;
	if (typeof config.responsiveMaxHeight == "undefined") responsiveMaxHeight = 9999999;
	else responsiveMaxHeight = config.responsiveMaxHeight;
	if (typeof ctx.initialSize == "undefined") { // First Time entered;
		function getCSSText(className) {
			if (typeof document.styleSheets != "object") return "";
			if (document.styleSheets.length <= 0) return "";
			var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
			for (var x = 0; x < classes.length; x++) {
				if (classes[x].selectorText == "." + className || classes[x].selectorText == "#" + className) {
					return ((classes[x].cssText) ? (classes[x].cssText) : (classes[x].style.cssText));
				}
			}
			return "";
		}

		function getCSSVal(source, srch) {
			if (source.indexOf(" " + srch + ":") >= 0) {
				value = source.substring(source.indexOf(" " + srch + ":") + srch.length + 2, 100);
				value = value.substring(0, value.indexOf(";"));
				return value;
			}
			return "";
		}

		function getCSSWH(className) {
			var styleVal = getCSSText(className);
			var width = getCSSVal(styleVal, "width");
			var height = getCSSVal(styleVal, "height");
			return {
				width: width,
				height: height
			};
		}
		// Save initial values before any change;
		ctx.initialSize = {};
		ctx.initialSize.pxRatio = 1;
		ctx.initialSize.width = ctx.canvas.width;
		ctx.initialSize.height = ctx.canvas.height;
		ctx.initialSize.styleWidth = ctx.canvas.style.width;
		ctx.initialSize.styleHeight = ctx.canvas.style.height;
		var cssVal = getCSSWH(ctx.canvas.id);
		ctx.initialSize.cssWidth = cssVal.width;
		if (ctx.initialSize.cssWidth != "") ctx.initialSize.styleWidth = "";
		ctx.initialSize.cssHeight = cssVal.height;
		if (ctx.initialSize.cssHeight != "") ctx.initialSize.styleHeight = "";
		ctx.initialSize.computedWidth = window.getComputedStyle(ctx.canvas).getPropertyValue('width');
		ctx.initialSize.computedWidth = ctx.initialSize.computedWidth.substring(0, ctx.initialSize.computedWidth.indexOf("px"));
		//  correct computedHeight (bad value if ctx.initial)
		if (ctx.initialSize.cssHeight != "") ctx.initialSize.computedHeight = ctx.initialSize.cssHeight;
		else if (ctx.initialSize.styleHeight != "") ctx.initialSize.computedHeight = ctx.initialSize.styleHeight;
		else ctx.initialSize.computedHeight = ctx.initialSize.height;
		if (typeof ctx.initialSize.computedHeight == "string") {
			if (ctx.initialSize.computedHeight.indexOf("px") >= 0) ctx.initialSize.computedHeight = ctx.initialSize.computedHeight.substring(0, ctx.initialSize.computedHeight.indexOf("px"));
			if (ctx.initialSize.computedHeight.indexOf("%") >= 0) ctx.initialSize.computedHeight = "";
		}
		if (ctx.initialSize.computedHeight == "") {
			ctx.initialSize.computedHeight = window.getComputedStyle(ctx.canvas).getPropertyValue('height');
			ctx.initialSize.computedHeight = ctx.initialSize.computedHeight.substring(0, ctx.initialSize.computedHeight.indexOf("px"));
		}
		ctx.chartTextScale = config.chartTextScale;
		ctx.chartLineScale = config.chartLineScale;
		ctx.chartSpaceScale = config.chartSpaceScale;
		////// Pas nÃƒÆ’Ã‚Â©cessaire; Il suffit de prendre config.chartTextScale.... ctx.DefaultchartTextScale=config.chartTextScale;
		////// Pas nÃƒÆ’Ã‚Â©cessaire; Il suffit de prendre config.chartTextScale.... ctx.DefaultchartLineScale=config.chartLineScale;
		////// Pas nÃƒÆ’Ã‚Â©cessaire; Il suffit de prendre config.chartTextScale.... ctx.DefaultchartSpaceScale=config.chartSpaceScale;
		ctx.initialSize.aspectRatio = ctx.canvas.width / ctx.canvas.height;
		if (1 * config.forcedAspectRatio) ctx.initialSize.aspectRatio = 1 / config.forcedAspectRatio;
		// Initialise Width Pct
		ctx.initialSize.widthPct = 0;
		ctx.initialSize.heightPct = 0;
		if (ctx.initialSize.cssWidth.indexOf("%") > 0) ctx.initialSize.widthPct = ctx.initialSize.cssWidth.substring(0, ctx.initialSize.cssWidth.indexOf("%"));
		else if (ctx.initialSize.cssWidth == "" && ctx.initialSize.styleWidth.indexOf("%") > 0) ctx.initialSize.widthPct = ctx.initialSize.styleWidth.substring(0, ctx.initialSize.styleWidth.indexOf("%"));
		else if (ctx.initialSize.cssWidth == "" && ctx.initialSize.styleWidth == "" && config.responsive) ctx.initialSize.widthPct = 100;
		if (ctx.initialSize.cssHeight.indexOf("%") > 0) ctx.initialSize.heightPct = ctx.initialSize.cssHeight.substring(0, ctx.initialSize.cssHeight.indexOf("%"));
		else if (ctx.initialSize.cssHeight == "" && ctx.canvas.style.height.indexOf("%") > 0) ctx.initialSize.heightPct = ctx.canvas.style.height.substring(0, ctx.canvas.style.height.indexOf("%"));
		// reset style width/height; style width/height can not be used because of responsiveMinWidth/Height , responsiveMaxWidth/Height, aspectRatio;
		ctx.canvas.style.width = "";
		ctx.canvas.style.height = "";
		afterWidth = ctx.initialSize.computedWidth;
		afterHeight = ctx.initialSize.computedHeight;
	} else {
		afterWidth = afterWidth / ctx.initialSize.pxRatio;
		afterHeight = afterHeight / ctx.initialSize.pxRatio;
	}
	if (ctx.initialSize.widthPct > 0) {
		afterWidth = (ctx.initialSize.widthPct / 100) * (getMaximumWidth(ctx.canvas) * pxRatio);
	}
	if (ctx.initialSize.heightPct > 0) {
		afterHeight = (ctx.initialSize.heightPct / 100) * (getMaximumHeight(ctx.canvas) * pxRatio);
	}
	if (ctx.initialSize.cssHeight == "") {
		afterHeight = maintainAspectRatio ? afterWidth / ctx.initialSize.aspectRatio : afterHeight;
	}
	afterWidth = Math.min(responsiveMaxWidth, Math.max(responsiveMinWidth, afterWidth));
	afterHeight = Math.min(responsiveMaxHeight, Math.max(responsiveMinHeight, afterHeight));
	if (typeof ctx.chartTextScale != "undefined" && config.responsiveScaleContent) {
		ctx.chartTextScale = config.chartTextScale * (afterWidth / ctx.initialSize.computedWidth);
		ctx.chartLineScale = config.chartLineScale * (afterWidth / ctx.initialSize.computedWidth);
		ctx.chartSpaceScale = config.chartSpaceScale * (afterWidth / ctx.initialSize.computedWidth);
	}
	if (pxRatio > 1 || afterWidth != beforeWidth) {
		if (ctx.initialSize.cssWidth != "" && ctx.initialSize.widthPct == 0) {
			ctx.canvas.width = afterWidth * pxRatio;
			ctx.canvas.style.width = afterWidth + "px";
		} else {
			ctx.canvas.width = afterWidth;
			ctx.canvas.style.width = eval(afterWidth / pxRatio) + "px";
		}
	}
	if (pxRatio > 1 || afterHeight != beforeHeight) {
		if (ctx.initialSize.cssWidth != "" && ctx.initialSize.widthPct == 0) {
			ctx.canvas.height = afterHeight * pxRatio;
			ctx.canvas.style.height = afterHeight + "px";
		} else {
			ctx.canvas.height = afterHeight;
			ctx.canvas.style.height = eval(afterHeight / pxRatio) + "px";
		}
	}
	ctx.scale(pxRatio, pxRatio);
	ctx.initialSize.pxRatio = pxRatio;
};

function chartJsResize() {
	for (var i = 0; i < jsGraphResize.length; i++) {
		if (jsGraphResize[i][2].firstPass == 0) {} else if (jsGraphResize[i][2].firstPass == 9) {
			jsGraphResize[i][2].firstPass = 2;
			resizeCtxFunction(1, jsGraphResize[i][2], jsGraphResize[i][3], jsGraphResize[i][4]);
			redrawGraph(jsGraphResize[i][2], jsGraphResize[i][3], jsGraphResize[i][4]);
		} else if (jsGraphResize[i][2].firstPass < 10) {
			jsGraphResize[i][2].firstPass += 10;
		}
	}
};

function testRedraw(ctx, data, config) {
	if (ctx.firstPass > 10) {
		ctx.firstPass = 2;
		if (config.responsive) resizeCtxFunction(1, ctx, data, config);
		redrawGraph(ctx, data, config);
		return true;
	} else {
		return false;
	}
};

function updateChart(ctx, data, config, animation, runanimationcompletefunction) {
	ctx.addListener = false;
	if (ctx.firstPass == 9) {
		ctx.runanimationcompletefunction = runanimationcompletefunction;
		if (animation) ctx.firstPass = 1;
		else ctx.firstPass = 2;
		if (config.responsive) {
			// update jsGraphResize;
			for (var i = 0; i < jsGraphResize.length; i++) {
				if (jsGraphResize[i][2].ChartNewId == ctx.ChartNewId) {
					jsGraphResize[i][3] = data;
					jsGraphResize[i][4] = config;
				}
			}
		}
		redrawGraph(ctx, data, config);
	}
};

function redrawGraph(ctx, data, config) {
	if (ctx.initialSize.pxRatio == 1 && (ctx.firstPass == 2 || ctx.firstPass == 9) && !(isIE() < 9 && isIE() != false) && (navigator.userAgent.indexOf("Safari") == -1)) {
		var OSC;
		var tmpctx;
		OSC = document.createElement("canvas");
		tmpctx = OSC.getContext("2d");
		tmpctx.vctx = ctx;
		OSC.width = ctx.canvas.width;
		OSC.height = ctx.canvas.height;
		if (typeof ctx.vWidth == "number") {
			var canvasWidth = window.getComputedStyle(ctx.canvas).getPropertyValue('width');
			tmpctx.canvas.width = canvasWidth.substring(0, canvasWidth.indexOf("px"));
			ctx.canvas.width = tmpctx.canvas.width;
			tmpctx.vWidth = ctx.vWidth;
		}
		tmpctx.ChartNewId = ctx.ChartNewId;
		tmpctx.tpchart = ctx.tpchart;
		tmpctx.tpchartSub = ctx.tpchartSub;
		tmpctx.tpdata = ctx.tpdata;
		tmpctx.initialSize = ctx.initialSize;
		tmpctx.chartTextScale = ctx.chartTextScale;
		tmpctx.chartLineScale = ctx.chartLineScale;
		tmpctx.chartSpaceScale = ctx.chartSpaceScale;
		tmpctx.firstPass = ctx.firstPass;
		tmpctx.runanimationcompletefunction = ctx.runanimationcompletefunction;
		//    tmpctx.aspectRatio=ctx.aspectRatio;
		//    tmpctx.widthAtSetMeasures=ctx.widthAtSetMeasures;
		//    tmpctx.heightAtSetMeasures=ctx.heightAtSetMeasures;
		tmpctx.pieces_drawn = ctx.pieces_drawn;
		//    tmpctx.scale(ctx.initialSize.pxRatio, ctx.initialSize.pxRatio);
		//    tmpctx.canvas.width=ctx.canvas.width;
		//    tmpctx.canvas.height=ctx.canvas.height;
		//    tmpctx.canvas.style.width=ctx.canvas.style.width;
		//    tmpctx.canvas.style.height=ctx.canvas.style.height;
		var myGraph = new Chart(tmpctx);
		eval("myGraph." + tmpctx.tpchartSub + "(data,config);");
		if (typeof ctx.vWidth == "number") ctx.vWidth = tmpctx.vWidth;
		ctx.ChartNewId = tmpctx.ChartNewId;
		ctx.tpchart = tmpctx.tpchart;
		ctx.tpchartSub = tmpctx.tpchartSub;
		ctx.tpdata = tmpctx.tpdata;
		ctx.initialSize = tmpctx.initialSize;
		ctx.chartTextScale = tmpctx.chartTextScale;
		ctx.chartLineScale = tmpctx.chartLineScale;
		ctx.chartSpaceScale = tmpctx.chartSpaceScale;
		ctx.firstPass = tmpctx.firstPass;
		ctx.runanimationcompletefunction = tmpctx.runanimationcompletefunction;
		//    ctx.aspectRatio=tmpctx.aspectRatio;
		//    ctx.widthAtSetMeasures=tmpctx.widthAtSetMeasures;
		//    ctx.heightAtSetMeasures=tmpctx.heightAtSetMeasures;
		//    ctx.canvas.width=tmpctx.canvas.width;
		//    ctx.canvas.height=tmpctx.canvas.height;
		//    ctx.canvas.style.width=tmpctx.canvas.style.width;
		//    ctx.canvas.style.height=tmpctx.canvas.style.height;
		ctx.pieces_drawn = tmpctx.pieces_drawn;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(OSC, 0, 0);
	} else {
		var myGraph = new Chart(ctx);
		eval("myGraph." + ctx.tpchartSub + "(data,config);");
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
function makeCursorObj(config, obj, nest) {
	createCursorDiv(config);
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
	for (var attrnameBis in userDefined) {
		returnObj[attrnameBis] = userDefined[attrnameBis];
	}
	return returnObj;
};

function addAnimationEasing(userDefined) {
	var returnObj = {};
	for (var attrname in userDefined) {
		returnObj[attrname] = userDefined[attrname];
	}
	if (typeof returnObj.animationYAxisEasing !== "object") returnObj.animationYAxisEasing = [returnObj.animationEasing];
	if (typeof returnObj.animationRadiusEasing !== "object") returnObj.animationRadiusEasing = [returnObj.animationEasing];
	if (typeof returnObj.animationRotateEasing !== "object") returnObj.animationRotateEasing = [returnObj.animationEasing];
	return returnObj;
};

function sleep(ms) {
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime()) {};
};

function saveCanvas(ctx, data, config) {
	cvSave = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	var saveCanvasConfig1 = {
		savePng: false,
		annotateDisplay: false,
		animation: false,
		dynamicDisplay: false
	};
	savePngConfig1 = mergeChartConfig(config, saveCanvasConfig1);
	savePngConfig1.clearRect = false;
	/* And ink them */
	redrawGraph(ctx, data, savePngConfig1);
	var image;
	if (config.savePngOutput == "NewWindow") {
		image = ctx.canvas.toDataURL();
		ctx.putImageData(cvSave, 0, 0);
		window.open(image, '_blank');
	}
	if (config.savePngOutput == "CurrentWindow") {
		image = ctx.canvas.toDataURL();
		ctx.putImageData(cvSave, 0, 0);
		window.location.href = image;
	}
	if (config.savePngOutput == "Save") {
		image = ctx.canvas.toDataURL();
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
	if (isIE() < 9 && isIE() != false) return (true);
	if (config.dynamicDisplay && ctx.firstPass == 0) {
		if (ctx.canvas.id == "") {
			var cvdate = new Date();
			var cvmillsec = cvdate.getTime();
			ctx.canvas.id = "Canvas_" + cvmillsec;
		}
		if (typeof(dynamicDisplay[ctx.canvas.id]) == "undefined") {
			dynamicDisplayList[dynamicDisplayList["length"]] = ctx.canvas.id;
			dynamicDisplay[ctx.canvas.id] = [ctx, data, config];
			window.onscroll = scrollFunction;
		}
		if (!isScrolledIntoView(ctx.canvas, config)) return false;
	}
	return true;
};

function isScrolledIntoView(element, config) {
	var xPosition = 0;
	var yPosition = 0;
	var eltWidth, eltHeight;
	if (typeof element.recomputedHeight == "undefined") {
		if (window.devicePixelRatio) {
			// 31/12/2015 - On retina display, the size of the canvas changes after the canvas is displayed.
			//              before it is displayd, the size on the screen is the size on non retina display;
			//              If we do not divide the height & width by the devicePixelRatio, and if the
			//              value of config.dynamicDisplayYPartOfChart and if there is a chart on to bottom of the
			//              web page, this chart will never be displayed....
			//              If the Size of the canvas was directly the real size displayed on the web page, we should not
			//              divide the height/width by the devicePixelRatio.... (Bug in Brosers ?)
			element.recomputedHeight = element.height / window.devicePixelRatio;
			element.recomputedWidth = element.width / window.devicePixelRatio;
		} else {
			element.recomputedHeight = element.height;
			element.recomputedWidth = element.width;
		}
	}
	eltWidth = element.recomputedWidth;
	eltHeight = element.recomputedHeight;
	elem = element;
	while (elem) {
		xPosition += (elem.offsetLeft + elem.clientLeft);
		yPosition += (elem.offsetTop + elem.clientTop);
		elem = elem.offsetParent;
	}
	if (xPosition + (eltWidth * config.dynamicDisplayXPartOfChart) >= window.pageXOffset && xPosition + (eltWidth * config.dynamicDisplayXPartOfChart) <= window.pageXOffset + window.innerWidth && yPosition + (eltHeight * config.dynamicDisplayYPartOfChart) >= window.pageYOffset && yPosition + (eltHeight * config.dynamicDisplayYPartOfChart) <= window.pageYOffset + window.innerHeight) {
		return (true);
	} else {
		return false;
	}
};

function scrollFunction() {
	for (var i = 0; i < dynamicDisplayList["length"]; i++) {
		if ((dynamicDisplay[dynamicDisplayList[i]][0]).firstPass == 0) {
			redrawGraph(dynamicDisplay[dynamicDisplayList[i]][0], dynamicDisplay[dynamicDisplayList[i]][1], dynamicDisplay[dynamicDisplayList[i]][2]);
		}
	}
};
var jsGraphAnnotate = new Array();
var jsTextMousePos = new Array();
var mouseActionData = new Array();

function clearAnnotate(ctxid) {
	jsGraphAnnotate[ctxid] = [];
	jsTextMousePos[ctxid] = [];
};

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};

function isHighLighted(reference, ctx, data, statData, posi, posj, othervars) {
	var i;
	if (typeof data.special == "object") {
		for (i = data.special.length - 1; i >= 0; i--) {
			if (data.special[i].typespecial == "highLight" && data.special[i].posi == posi && data.special[i].posj == posj) return true;
		}
	}
	return false;
};

function isNotHighLighted(reference, ctx, data, statData, posi, posj, othervars) {
	return (!isHighLighted(reference, ctx, data, statData, posi, posj, othervars));
}

function deleteHighLight(ctx, data) {
	var i;
	if (typeof data.special == "object") {
		for (i = data.special.length - 1; i >= 0; i--) {
			if (data.special[i].typespecial == "highLight") data.special.splice(i, 1);
		}
	}
};

function highLightAction(action, ctx, data, config, v1, v2) {
	if (ctx.firstPass != 9) return;
	var currentlyDisplayed = [-1, -1];
	var redisplay = false;
	var i, j;
	if (typeof data.special == "object") {
		for (i = 0; i < data.special.length && currentlyDisplayed[0] == -1; i++) {
			if (data.special[i].typespecial == "highLight") currentlyDisplayed = [data.special[i].posi, data.special[i].posj];
		}
	}
	var deleteOld = false;
	var addNew = false;
	var property;
	var output;
	var fndoldspec = false;
	var fndnewspec = false;
	if (action == "HIDE" && currentlyDisplayed[0] != -1) deleteOld = true;
	else if (action != "HIDE" && config.highLightFullLine == "group" && (currentlyDisplayed[1] != v2)) {
		if (currentlyDisplayed[0] != -1) deleteOld = true;
		addNew = true;
	} else if (action != "HIDE" && config.highLightFullLine == false && (currentlyDisplayed[0] != v1 || currentlyDisplayed[1] != v2)) {
		if (currentlyDisplayed[0] != -1) deleteOld = true;
		addNew = true;
	} else if (action != "HIDE" && config.highLightFullLine == true && (currentlyDisplayed[0] != v1)) {
		if (currentlyDisplayed[0] != -1) deleteOld = true;
		addNew = true;
	}
	if (deleteOld) {
		redisplay = true;
		for (i = data.special.length - 1; i >= 0; i--) {
			if (data.special[i].typespecial == "highLight") {
				data.special.splice(i, 1);
				fndoldspec = true;
			}
		}
	}
	if (addNew) {
		redisplay = true;
		if (typeof data.special == "undefined") data.special = [];
		if (config.highLightFullLine == "group") {
			for (j = 0; j < data.datasets.length; j++) {
				if (!(data.datasets[j].mouseDetection == false)) {
					output = "";
					for (property in config.highLightSet) {
						if (output != "") output = output + ",";
						if (typeof config.highLightSet[property] == "string") output += property + ': "' + config.highLightSet[property] + '"';
						else output += property + ': ' + config.highLightSet[property];
					}
					fndnewspec = true;
					eval("data.special[data.special.length]={" + output + "};");
					data.special[data.special.length - 1].posi = j;
					data.special[data.special.length - 1].posj = v2;
					data.special[data.special.length - 1].typespecial = "highLight";
				}
			}
		} else if (config.highLightFullLine == true) {
			if (!(data.datasets[v1].mouseDetection == false)) {
				for (j = 0; j < data.datasets[v1].data.length; j++) {
					output = "";
					for (property in config.highLightSet) {
						if (output != "") output = output + ",";
						if (typeof config.highLightSet[property] == "string") output += property + ': "' + config.highLightSet[property] + '"';
						else output += property + ': ' + config.highLightSet[property];
					}
					fndnewspec = true;
					eval("data.special[data.special.length]={" + output + "};");
					data.special[data.special.length - 1].posi = v1;
					data.special[data.special.length - 1].posj = j;
					data.special[data.special.length - 1].typespecial = "highLight";
				}
			}
		} else if (!(data.datasets[v1].mouseDetection == false)) {
			output = "";
			for (property in config.highLightSet) {
				if (output != "") output = output + ",";
				if (typeof config.highLightSet[property] == "string") output += property + ': "' + config.highLightSet[property] + '"';
				else output += property + ': ' + config.highLightSet[property];
			}
			fndnewspec = true;
			eval("data.special[data.special.length]={" + output + "};");
			data.special[data.special.length - 1].posi = v1;
			data.special[data.special.length - 1].posj = v2;
			data.special[data.special.length - 1].typespecial = "highLight";
		}
	}
	if (redisplay == true) {
		updateChart(ctx, data, config, false, config.highLightRerunEndFunction);
	}
};
var inMouseAction = new Array();

function initAnnotateDiv(annotateDIV, config, ctx) {
	annotateDIV.className = (config.annotateClassName) ? config.annotateClassName : '';
	annotateDIV.style.border = (config.annotateClassName) ? '' : config.annotateBorder;
	annotateDIV.style.padding = (config.annotateClassName) ? '' : config.annotatePadding;
	annotateDIV.style.borderRadius = (config.annotateClassName) ? '' : config.annotateBorderRadius;
	annotateDIV.style.backgroundColor = (config.annotateClassName) ? '' : config.annotateBackgroundColor;
	annotateDIV.style.color = (config.annotateClassName) ? '' : config.annotateFontColor;
	annotateDIV.style.fontFamily = (config.annotateClassName) ? '' : config.annotateFontFamily;
	annotateDIV.style.fontSize = (config.annotateClassName) ? '' : (Math.ceil(ctx.chartTextScale * config.annotateFontSize)).toString() + "pt";
	annotateDIV.style.fontStyle = (config.annotateClassName) ? '' : config.annotateFontStyle;
	annotateDIV.style.zIndex = 999;
};

function displayAnnotate(ctx, data, config, rect, event, annotateDIV, jsGraphAnnotate, piece, myStatData, statData) {
	if (jsGraphAnnotate[ctx.ChartNewId][piece.piece][0] == "ARC") dispString = tmplbis(setOptionValue(true, true, 1, "ANNOTATELABEL", ctx, data, jsGraphAnnotate[ctx.ChartNewId][piece.piece][3], undefined, config.annotateLabel, "annotateLabel", jsGraphAnnotate[ctx.ChartNewId][piece.piece][1], -1, {
		otherVal: true
	}), myStatData, config);
	else dispString = tmplbis(setOptionValue(true, true, 1, "ANNOTATELABEL", ctx, data, jsGraphAnnotate[ctx.ChartNewId][piece.piece][3], undefined, config.annotateLabel, "annotateLabel", jsGraphAnnotate[ctx.ChartNewId][piece.piece][1], jsGraphAnnotate[ctx.ChartNewId][piece.piece][2], {
		otherVal: true
	}), myStatData, config);
	textMsr = ctx.measureTextMultiLine(dispString, 1 * annotateDIV.style.fontSize.replace("pt", ""));
	ctx.restore();
	annotateDIV.innerHTML = dispString;
	x = bw.ns4 || bw.ns5 ? event.pageX : event.x;
	y = bw.ns4 || bw.ns5 ? event.pageY : event.y;
	if (bw.ie4 || bw.ie5) y = y + eval(scrolled);
	if (config.annotateRelocate === true) {
		var relocateX, relocateY;
		relocateX = 0;
		relocateY = 0;
		if (x + fromLeft + textMsr.textWidth > window.innerWidth - rect.left - fromLeft) relocateX = -textMsr.textWidth;
		if (y + fromTop + textMsr.textHeight > 1 * window.innerHeight - 1 * rect.top + fromTop) relocateY -= (textMsr.textHeight + 2 * fromTop);
		oCursor.moveIt(Math.max(8 - rect.left, x + fromLeft + relocateX), Math.max(8 - rect.top, y + fromTop + relocateY));
	} else oCursor.moveIt(x + fromLeft, y + fromTop);
	annotateDIV.style.display = true ? '' : 'none';
};

function doMouseAction(event, ctx, action) {
	if (ctx.firstPass != 9) return;
	if (action == "mousedown") action = action + " " + event.which;
	if (ctx.mouseAction.indexOf(action) < 0) {
		return;
	}
	var config = mouseActionData[ctx.ChartNewId].config;
	var data = mouseActionData[ctx.ChartNewId].data;
	var i, prevShown, prevShowSaved;
	var inRect, P12, D12, D34, P13, D13, D24, y1, y2, y3, y4;
	var pieceOfChartFound = [];
	var textOnChartFound = [];
	var distance, angle, topY, bottomY, leftX, rightX;
	var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"
	var canvas_pos = getMousePos(ctx.canvas, event);
	var realAction, addRadius;
	var annotateDIV, showDiv;
	if (action == "mousedown 1") realAction = "mousedown left";
	else if (action == "mousedown 2") realAction = "mousedown middle";
	else if (action == "mousedown 3") realAction = "mousedown right";
	else if (action == mousewheelevt) realAction = "mousewheel";
	else realAction = action;
	// search if mouse over one or more pieces of chart;
	for (i = 0; i < jsGraphAnnotate[ctx.ChartNewId]["length"]; i++) {
		if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "ARC") {
			myStatData = jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]];
			distance = Math.sqrt((canvas_pos.x - myStatData.midPosX) * (canvas_pos.x - myStatData.midPosX) + (canvas_pos.y - myStatData.midPosY) * (canvas_pos.y - myStatData.midPosY));
			if (distance > myStatData.int_radius && distance < myStatData.radiusOffset) {
				angle = (Math.acos((canvas_pos.x - myStatData.midPosX) / distance) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
				if (canvas_pos.y < myStatData.midPosY) angle = -angle;
				angle = (((angle + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				myStatData.startAngle = (((myStatData.startAngle + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				myStatData.endAngle = (((myStatData.endAngle + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				if (myStatData.endAngle < myStatData.startAngle) myStatData.endAngle += 2 * Math.PI;
				if ((angle > myStatData.startAngle && angle < myStatData.endAngle) || (angle > myStatData.startAngle - 2 * Math.PI && angle < myStatData.endAngle - 2 * Math.PI) || (angle > myStatData.startAngle + 2 * Math.PI && angle < myStatData.endAngle + 2 * Math.PI)) {
					myStatData.graphPosX = canvas_pos.x;
					myStatData.graphPosY = canvas_pos.y;
					pieceOfChartFound[pieceOfChartFound.length] = {
						piece: i,
						i: jsGraphAnnotate[ctx.ChartNewId][i][1],
						j: jsGraphAnnotate[ctx.ChartNewId][i][2],
						myStatData: myStatData
					};
				}
			}
		} else if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "MARC") {
			myStatData = jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]][jsGraphAnnotate[ctx.ChartNewId][i][2]];
			distance = Math.sqrt((canvas_pos.x - myStatData.midPosX) * (canvas_pos.x - myStatData.midPosX) + (canvas_pos.y - myStatData.midPosY) * (canvas_pos.y - myStatData.midPosY));
			if (distance > myStatData.int_radius && distance < myStatData.radiusOffset) {
				angle = (Math.acos((canvas_pos.x - myStatData.midPosX) / distance) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
				if (canvas_pos.y < myStatData.midPosY) angle = -angle;
				angle = (((angle + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				myStatData.startAngle = (((myStatData.startAngle + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				myStatData.endAngle = (((myStatData.endAngle + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				if (myStatData.endAngle < myStatData.startAngle) myStatData.endAngle += 2 * Math.PI;
				if ((angle > myStatData.startAngle && angle < myStatData.endAngle) || (angle > myStatData.startAngle - 2 * Math.PI && angle < myStatData.endAngle - 2 * Math.PI) || (angle > myStatData.startAngle + 2 * Math.PI && angle < myStatData.endAngle + 2 * Math.PI)) {
					myStatData.graphPosX = canvas_pos.x;
					myStatData.graphPosY = canvas_pos.y;
					pieceOfChartFound[pieceOfChartFound.length] = {
						piece: i,
						i: jsGraphAnnotate[ctx.ChartNewId][i][1],
						j: jsGraphAnnotate[ctx.ChartNewId][i][2],
						myStatData: myStatData
					};
				}
			}
		} else if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "RECT") {
			myStatData = jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]][jsGraphAnnotate[ctx.ChartNewId][i][2]];
			topY = Math.max(myStatData.yPosBottom, myStatData.yPosTop);
			bottomY = Math.min(myStatData.yPosBottom, myStatData.yPosTop);
			if (topY - bottomY < config.annotateBarMinimumDetectionHeight) {
				topY = (topY + bottomY + config.annotateBarMinimumDetectionHeight) / 2;
				bottomY = topY - config.annotateBarMinimumDetectionHeight;
			}
			leftX = Math.min(myStatData.xPosLeft, myStatData.xPosRight);
			rightX = Math.max(myStatData.xPosLeft, myStatData.xPosRight);
			if (rightX - leftX < config.annotateBarMinimumDetectionHeight) {
				rightX = (rightX + leftX + config.annotateBarMinimumDetectionHeight) / 2;
				leftX = rightX - config.annotateBarMinimumDetectionHeight;
			}
			if (canvas_pos.x > leftX && canvas_pos.x < rightX && canvas_pos.y < topY && canvas_pos.y > bottomY) {
				myStatData.graphPosX = canvas_pos.x;
				myStatData.graphPosY = canvas_pos.y;
				pieceOfChartFound[pieceOfChartFound.length] = {
					piece: i,
					i: jsGraphAnnotate[ctx.ChartNewId][i][1],
					j: jsGraphAnnotate[ctx.ChartNewId][i][2],
					myStatData: myStatData
				};
			}
		} else if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "POINT") {
			myStatData = jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]][jsGraphAnnotate[ctx.ChartNewId][i][2]];
			addRadius = 0;
			if (typeof myStatData.markerRadius != "undefined") addRadius = myStatData.markerRadius;
			if (config.detectAnnotateOnFullLine) {
				if (canvas_pos.x < Math.min(myStatData.annotateStartPosX, myStatData.annotateEndPosX) - Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius) || canvas_pos.x > Math.max(myStatData.annotateStartPosX, myStatData.annotateEndPosX) + Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius) || canvas_pos.y < Math.min(myStatData.annotateStartPosY, myStatData.annotateEndPosY) - Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius) || canvas_pos.y > Math.max(myStatData.annotateStartPosY, myStatData.annotateEndPosY) + Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius)) {
					distance = Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius) + 1;
				} else {
					if (typeof myStatData.D1A == "undefined") {
						distance = Math.abs(canvas_pos.x - myStatData.posX);
					} else if (typeof myStatData.D2A == "undefined") {
						distance = Math.abs(canvas_pos.y - myStatData.posY);
					} else {
						var D2B = -myStatData.D2A * canvas_pos.x + canvas_pos.y;
						var g = -(myStatData.D1B - D2B) / (myStatData.D1A - myStatData.D2A);
						var h = myStatData.D2A * g + D2B;
						distance = Math.sqrt((canvas_pos.x - g) * (canvas_pos.x - g) + (canvas_pos.y - h) * (canvas_pos.y - h));
					}
				}
			} else {
				distance = Math.sqrt((canvas_pos.x - myStatData.posX) * (canvas_pos.x - myStatData.posX) + (canvas_pos.y - myStatData.posY) * (canvas_pos.y - myStatData.posY));
			}
			if (distance < Math.max(addRadius, Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius))) {
				myStatData.graphPosX = canvas_pos.x;
				myStatData.graphPosY = canvas_pos.y;
				pieceOfChartFound[pieceOfChartFound.length] = {
					piece: i,
					i: jsGraphAnnotate[ctx.ChartNewId][i][1],
					j: jsGraphAnnotate[ctx.ChartNewId][i][2],
					myStatData: myStatData
				};
			}
		}
	}
	// search if mouse over one or more text;
	if (config.detectMouseOnText) {
		for (i = 0; i < jsTextMousePos[ctx.ChartNewId]["length"]; i++) {
			inRect = true;
			if (Math.abs(jsTextMousePos[ctx.ChartNewId][i][3].p1 - jsTextMousePos[ctx.ChartNewId][i][3].p2) < config.zeroValue) {
				// Horizontal;
				if (canvas_pos.x < Math.min(jsTextMousePos[ctx.ChartNewId][i][2].p1, jsTextMousePos[ctx.ChartNewId][i][2].p2)) inRect = false;
				if (canvas_pos.x > Math.max(jsTextMousePos[ctx.ChartNewId][i][2].p1, jsTextMousePos[ctx.ChartNewId][i][2].p2)) inRect = false;
				if (canvas_pos.y < Math.min(jsTextMousePos[ctx.ChartNewId][i][3].p1, jsTextMousePos[ctx.ChartNewId][i][3].p3)) inRect = false;
				if (canvas_pos.y > Math.max(jsTextMousePos[ctx.ChartNewId][i][3].p1, jsTextMousePos[ctx.ChartNewId][i][3].p3)) inRect = false;
			} else if (Math.abs(jsTextMousePos[ctx.ChartNewId][i][2].p1 - jsTextMousePos[ctx.ChartNewId][i][2].p2) < config.zeroValue) {
				// Vertical;
				if (canvas_pos.x < Math.min(jsTextMousePos[ctx.ChartNewId][i][2].p1, jsTextMousePos[ctx.ChartNewId][i][2].p3)) inRect = false;
				if (canvas_pos.x > Math.max(jsTextMousePos[ctx.ChartNewId][i][2].p1, jsTextMousePos[ctx.ChartNewId][i][2].p3)) inRect = false;
				if (canvas_pos.y < Math.min(jsTextMousePos[ctx.ChartNewId][i][3].p1, jsTextMousePos[ctx.ChartNewId][i][3].p2)) inRect = false;
				if (canvas_pos.y > Math.max(jsTextMousePos[ctx.ChartNewId][i][3].p1, jsTextMousePos[ctx.ChartNewId][i][3].p2)) inRect = false;
			} else {
				// D12 & D34;
				P12 = Math.tan(jsTextMousePos[ctx.ChartNewId][i][4]);
				D12 = jsTextMousePos[ctx.ChartNewId][i][3].p1 - P12 * jsTextMousePos[ctx.ChartNewId][i][2].p1;
				D34 = jsTextMousePos[ctx.ChartNewId][i][3].p3 - P12 * jsTextMousePos[ctx.ChartNewId][i][2].p3;
				// D13 & D24;
				P13 = -1 / P12;
				D13 = jsTextMousePos[ctx.ChartNewId][i][3].p1 - P13 * jsTextMousePos[ctx.ChartNewId][i][2].p1;
				D24 = jsTextMousePos[ctx.ChartNewId][i][3].p4 - P13 * jsTextMousePos[ctx.ChartNewId][i][2].p4;
				// Check if in rectangle;
				y1 = P12 * canvas_pos.x + D12;
				y2 = P12 * canvas_pos.x + D34;
				y3 = P13 * canvas_pos.x + D13;
				y4 = P13 * canvas_pos.x + D24;
				if (canvas_pos.y < Math.min(y1, y2)) inRect = false;
				if (canvas_pos.y > Math.max(y1, y2)) inRect = false;
				if (canvas_pos.y < Math.min(y3, y4)) inRect = false;
				if (canvas_pos.y > Math.max(y3, y4)) inRect = false;
			}
			if (inRect) textOnChartFound[textOnChartFound.length] = i;
		}
	}

	function isAction(option, action) {
		return (option == action || (option == "mousemove" && (action == "mousewheel" || action == "mouseout")));
	}
	if (config.savePng && isAction(config.savePngFunction, realAction)) {
		// call savePng function;
		saveCanvas(ctx, data, config);
	}
	var whoToReferAnnotate = -1;
	var whoToReferHighLight = -1;
	var referAnnotateIsPoint = false;
	var referHighLightIsPoint = false;
	for (i = pieceOfChartFound.length - 1; i >= 0; i--) {
		if (jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[i].piece][4]) {
			if (referAnnotateIsPoint == false) {
				if (whoToReferAnnotate == -1) whoToReferAnnotate = i;
				if (jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[i].piece][0] == "POINT") {
					whoToReferAnnotate = i;
					referAnnotateIsPoint = true;
				}
			}
		}
		if (referHighLightIsPoint == false) {
			if (whoToReferHighLight == -1) whoToReferHighLight = i;
			if (jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[i].piece][0] == "POINT") {
				whoToReferHighLight = i;
				referHighLightIsPoint = true;
			}
		}
	}
	if ((config.annotateDisplay || typeof config.annotateDisplay == 'function') && isAction(config.annotateFunction, realAction)) {
		// annotate display functionality;
		annotateDIV = document.getElementById(annotate_shape);
		annotateDIV.style.display = false ? '' : 'none';
		if (pieceOfChartFound.length > 0) {
			initAnnotateDiv(annotateDIV, config, ctx);
			ctx.save();
			ctx.font = annotateDIV.style.fontStyle + " " + annotateDIV.style.fontSize + " " + annotateDIV.style.fontFamily;
			var rect = ctx.canvas.getBoundingClientRect();
			showDiv = false;
			if (whoToReferAnnotate != -1) {
				if (jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferAnnotate].piece][4]) {
					displayAnnotate(ctx, data, config, rect, event, annotateDIV, jsGraphAnnotate, pieceOfChartFound[whoToReferAnnotate], pieceOfChartFound[whoToReferAnnotate].myStatData, jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferAnnotate].piece][3]);
					showDiv = true;
				}
			}
		}
	}
	if (inMouseAction[ctx.ChartNewId] == false && mouseActionData[ctx.ChartNewId].prevShow >= 0 && isAction("mousemove", realAction) && (pieceOfChartFound.length == 0 || mouseActionData[ctx.ChartNewId].prevShow != pieceOfChartFound[pieceOfChartFound.length - 1].piece)) {
		inMouseAction[ctx.ChartNewId] = true;
		prevShow = mouseActionData[ctx.ChartNewId].prevShow;
		mouseActionData[ctx.ChartNewId].prevShow = -1;
		if (config.highLight && isAction(config.highLightMouseFunction, realAction) && pieceOfChartFound.length == 0) {
			highLightAction("HIDE", ctx, data, config, null, null);
		}
		if (typeof config.annotateFunctionOut == "function") {
			if (jsGraphAnnotate[ctx.ChartNewId][prevShow][0] == "ARC") config.annotateFunctionOut("OUTANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][prevShow][3], jsGraphAnnotate[ctx.ChartNewId][prevShow][1], -1, null);
			else config.annotateFunctionOut("OUTANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][prevShow][3], jsGraphAnnotate[ctx.ChartNewId][prevShow][1], jsGraphAnnotate[ctx.ChartNewId][prevShow][2], null);
		}
		inMouseAction[ctx.ChartNewId] = false;
	}
	if (pieceOfChartFound.length > 0 && inMouseAction[ctx.ChartNewId] == false && mouseActionData[ctx.ChartNewId].prevShow != pieceOfChartFound[whoToReferHighLight].piece && isAction("mousemove", realAction)) {
		inMouseAction[ctx.ChartNewId] = true;
		prevShow = mouseActionData[ctx.ChartNewId].prevShow;
		if (config.highLight && isAction(config.highLightMouseFunction, realAction)) {
			if (whoToReferHighLight != -1) {
				if (jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][0] == "ARC") highLightAction("ARC", ctx, data, config, jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][1], -1);
				else highLightAction(jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][0], ctx, data, config, jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][1], jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][2]);
			}
		}
		if (typeof config.annotateFunctionIn == "function") {
			if (jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[pieceOfChartFound.length - 1].piece][0] == "ARC") config.annotateFunctionIn("INANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[pieceOfChartFound.length - 1].piece][3], jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[pieceOfChartFound.length - 1].piece][1], -1, null);
			else config.annotateFunctionIn("INANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[pieceOfChartFound.length - 1].piece][3], jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[pieceOfChartFound.length - 1].piece][1], jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[pieceOfChartFound.length - 1].piece][2], null);
		}
		inMouseAction[ctx.ChartNewId] = false;
		mouseActionData[ctx.ChartNewId].prevShow = pieceOfChartFound[whoToReferHighLight].piece;
	}
	if (config.highLight && isAction(config.highLightMouseFunction, realAction) && isAction("mousemove", realAction) == false) {
		if (pieceOfChartFound.length == 0) highLightAction("HIDE", ctx, data, config, null, null);
		else {
			if (whoToReferHighLight != -1) {
				if (jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][0] == "ARC") highLightAction("ARC", ctx, data, config, jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][1], -1);
				else highLightAction(jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][0], ctx, data, config, jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][1], jsGraphAnnotate[ctx.ChartNewId][pieceOfChartFound[whoToReferHighLight].piece][2]);
			}
		}
	}

	function runFunction(toBeRun) {
		var i;
		for (i = 0; i < pieceOfChartFound.length; i++) {
			toBeRun(event, ctx, config, data, pieceOfChartFound[i].myStatData);
		}
		for (i = 0; i < textOnChartFound.length; i++) {
			toBeRun(event, ctx, config, data, {
				type: "CLICKONTEXT",
				values: jsTextMousePos[ctx.ChartNewId][textOnChartFound[i]]
			});
		}
		if (pieceOfChartFound.length == 0 && textOnChartFound.length == 0) {
			toBeRun(event, ctx, config, data, null);
		}
	};
	if (typeof config.mouseMove == "function" && isAction("mousemove", realAction)) runFunction(config.mouseMove);
	if (typeof config.mouseDownLeft == "function" && isAction("mousedown left", realAction)) runFunction(config.mouseDownLeft);
	if (typeof config.mouseDownRight == "function" && isAction("mousedown right", realAction)) runFunction(config.mouseDownRight);
	if (typeof config.mouseDownMiddle == "function" && isAction("mousedown middle", realAction)) runFunction(config.mouseDownMiddle);
	if (typeof config.mouseWheel == "function" && isAction("mousewheel", realAction)) runFunction(config.mouseWheel);
	if (typeof config.mouseOut == "function" && isAction("mouseout", realAction)) runFunction(config.mouseOut);
	if (typeof config.mouseDblClick == "function" && isAction("dblclick", realAction)) runFunction(config.mouseDblClick);
};
///////// GRAPHICAL PART OF THE SCRIPT ///////////////////////////////////////////
//Define the global Chart Variable as a class.
window.Chart = function(context) {
	var chart = this;
	//Easing functions adapted from Robert Penner's easing equations
	//http://www.robertpenner.com/easing/
	//Variables global to the chart
	var width = context.canvas.width;
	var height = context.canvas.height;
	//	this.Doughnut = function(data, options) {
	//		chart.Doughnut.defaults = chart.defaults.PieAndDoughnutV2;
	//		chart.Doughnut.defaults = mergeChartConfig(chart.defaults.PieAndDoughnut, chart.Doughnut.defaults);
	//		// merge annotate defaults
	//		if(isIE()<9 && isIE() != false)chart.Doughnut.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Doughnut.defaults);
	//		chart.Doughnut.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Doughnut.defaults);
	//		chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptions);
	//		chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptionsDoughnut);
	//    chart.Doughnut.defaults = addAnimationEasing(chart.Doughnut.defaults);  
	//		var config = (options) ? mergeChartConfig(chart.Doughnut.defaults, options) : chart.Doughnut.defaults;
	//    
	//		return new Doughnut(data, config, context);
	//	};
	//	this.PolarArea = function(data, options) {
	//		chart.PolarArea.defaults = chart.defaults.PolarAreaV2;
	//		chart.PolarArea.defaults = mergeChartConfig(chart.defaults.PolarArea, chart.PolarArea.defaults);
	//		if(isIE()<9 && isIE() != false)chart.PolarArea.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.PolarArea.defaults);
	//		chart.PolarArea.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.PolarArea.defaults);
	//		chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptions);
	//		chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptionsPolarArea);
	//    chart.PolarArea.defaults = addAnimationEasing(chart.PolarArea.defaults);  
	//		var config = (options) ? mergeChartConfig(chart.PolarArea.defaults, options) : chart.PolarArea.defaults;
	//		return new PolarArea(data, config, context);
	//	};
	this.PolarArea = function(data, options) {
		chart.PolarArea.defaults = chart.defaults.PolarAreaV2;
		chart.PolarArea.defaults = mergeChartConfig(chart.defaults.PolarArea, chart.PolarArea.defaults);
		if (isIE() < 9 && isIE() != false) chart.PolarArea.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.PolarArea.defaults);
		chart.PolarArea.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.PolarArea.defaults);
		chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptions);
		chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptionsPolarArea);
		var config = (options) ? mergeChartConfig(chart.PolarArea.defaults, options) : chart.PolarArea.defaults;
		config = addAnimationEasing(config);
		return new PolarArea(data, config, context);
	};
	this.Radar = function(data, options) {
		chart.Radar.defaults = {
			highLightSet: {
				pointDotRadius: 15,
				pointDot: true
			},
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
			scaleGridLinesStep: 1,
			scaleOverlay: false,
			scaleOverride: false,
			scaleOverride2: false,
			forceSecondScale: false,
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
			pointDotStrokeStyle: "solid",
			datasetFill: true,
			datasetStrokeWidth: 2,
			datasetStrokeStyle: "solid",
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			alwaysRunFunctionAtCompletion: false,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3%>",
			pointHitDetectionRadius: 10,
			startAngle: 90
		};
		// merge annotate defaults
		if (isIE() < 9 && isIE() != false) chart.Radar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Radar.defaults);
		chart.Radar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Radar.defaults);
		chart.Radar.defaults = mergeChartConfig(chart.Radar.defaults, charJSPersonalDefaultOptions);
		chart.Radar.defaults = mergeChartConfig(chart.Radar.defaults, charJSPersonalDefaultOptionsRadar);
		var config = (options) ? mergeChartConfig(chart.Radar.defaults, options) : chart.Radar.defaults;
		config = addAnimationEasing(config);
		return new Radar(data, config, context);
	};
	this.Pie = function(data, options) {
		chart.Pie.defaults = chart.defaults.PieAndDoughnutV2;
		chart.Pie.defaults = mergeChartConfig(chart.defaults.PieAndDoughnut, chart.Pie.defaults);
		// merge annotate defaults
		if (isIE() < 9 && isIE() != false) chart.Pie.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Pie.defaults);
		chart.Pie.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Pie.defaults);
		chart.Pie.defaults = mergeChartConfig(chart.Pie.defaults, charJSPersonalDefaultOptions);
		chart.Pie.defaults = mergeChartConfig(chart.Pie.defaults, charJSPersonalDefaultOptionsPie);
		var config = (options) ? mergeChartConfig(chart.Pie.defaults, options) : chart.Pie.defaults;
		config = addAnimationEasing(config);
		return new Pie(data, config, context);
	};
	this.Doughnut = function(data, options) {
		chart.Doughnut.defaults = chart.defaults.PieAndDoughnutV2;
		chart.Doughnut.defaults = mergeChartConfig(chart.defaults.PieAndDoughnut, chart.Doughnut.defaults);
		// merge annotate defaults
		if (isIE() < 9 && isIE() != false) chart.Doughnut.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Doughnut.defaults);
		chart.Doughnut.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Doughnut.defaults);
		chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptions);
		chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptionsDoughnut);
		var config = (options) ? mergeChartConfig(chart.Doughnut.defaults, options) : chart.Doughnut.defaults;
		config = addAnimationEasing(config);
		return new Doughnut(data, config, context);
	};
	this.Bubble = function(data, options) {
		chart.Bubble.defaults = {
			highLightSet: {
				pointDotStrokeWidth: 5,
				pointStrokeColor: "red"
			},
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + (vbubble=='' ? '' : ' / '+vbubble)%>",
			inGraphDataTmpl: "<%=v3+(vbubble=='' ? '' : '/'+vbubble)%>",
			inGraphDataAlign: "center",
			inGraphDataVAlign: "middle",
			inGraphDataPaddingX: 0,
			inGraphDataPaddingY: 0,
			saveBackImage: true,
			bubbleMaxVal: "max",
			bubbleMinVal: 0,
			bubbleMaxRadius: 0.2,
			pointDotRadius: 15,
			animationEasing: "linear"
		};
		// merge annotate defaults
		if (isIE() < 9 && isIE() != false) chart.Bubble.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Bubble.defaults);
		chart.Bubble.defaults = mergeChartConfig(chart.defaults.Line_and_Bubble, chart.Bubble.defaults);
		chart.Bubble.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Bubble.defaults);
		chart.Bubble.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Bubble.defaults);
		chart.Bubble.defaults = mergeChartConfig(chart.Bubble.defaults, charJSPersonalDefaultOptions);
		chart.Bubble.defaults = mergeChartConfig(chart.Bubble.defaults, charJSPersonalDefaultOptionsLine);
		var config = (options) ? mergeChartConfig(chart.Bubble.defaults, options) : chart.Bubble.defaults;
		config = addAnimationEasing(config);
		return new Bubble(data, config, context);
	};
	this.Line = function(data, options) {
		chart.Line.defaults = {};
		// merge annotate defaults
		if (isIE() < 9 && isIE() != false) chart.Line.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Line.defaults);
		chart.Line.defaults = mergeChartConfig(chart.defaults.Line_and_Bubble, chart.Line.defaults);
		chart.Line.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Line.defaults);
		chart.Line.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Line.defaults);
		chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptions);
		chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptionsLine);
		var config = (options) ? mergeChartConfig(chart.Line.defaults, options) : chart.Line.defaults;
		config = addAnimationEasing(config);
		return new Line(data, config, context);
	};
	this.StackedBar = function(data, options) {
		chart.StackedBar.defaults = {
			annotateBarMinimumDetectionHeight: 0,
			highLightSet: {
				pointDotRadius: 15,
				barStrokeWidth: 5,
				pointDot: true
			},
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
			forceSecondScale: false,
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
			scaleGridLineStyle: "solid",
			scaleGridLineWidth: 1,
			showYAxisMin: true, // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
			rotateLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
			rotateTLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
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
			barValueSpacing: 5,
			barDatasetSpacing: 1,
			spaceBetweenBar: 0,
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			alwaysRunFunctionAtCompletion: false,
			bezierCurve: true,
			linkType: 0, //0 : direct point to point; 1 = vertical lines; 2=angular link;
			bezierCurveTension: 0.4,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
			pointHitDetectionRadius: 10
		};
		// merge annotate defaults
		if (isIE() < 9 && isIE() != false) chart.StackedBar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.StackedBar.defaults);
		chart.StackedBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.StackedBar.defaults);
		chart.StackedBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.StackedBar.defaults);
		chart.StackedBar.defaults = mergeChartConfig(chart.StackedBar.defaults, charJSPersonalDefaultOptions);
		chart.StackedBar.defaults = mergeChartConfig(chart.StackedBar.defaults, charJSPersonalDefaultOptionsStackedBar);
		var config = (options) ? mergeChartConfig(chart.StackedBar.defaults, options) : chart.StackedBar.defaults;
		config = addAnimationEasing(config);
		return new StackedBar(data, config, context);
	};
	this.HorizontalStackedBar = function(data, options) {
		chart.HorizontalStackedBar.defaults = {
			annotateBarMinimumDetectionHeight: 0,
			highLightSet: {
				pointDotRadius: 15,
				barStrokeWidth: 5,
				pointDot: true
			},
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
			forceSecondScale: false,
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
			rotateTLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
			barShowStroke: true,
			barValueSpacing: 5,
			barDatasetSpacing: 1,
			spaceBetweenBar: 0,
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			alwaysRunFunctionAtCompletion: false,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
			reverseOrder: false
		};
		// merge annotate defaults
		if (isIE() < 9 && isIE() != false) chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.HorizontalStackedBar.defaults);
		chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.HorizontalStackedBar.defaults);
		chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.HorizontalStackedBar.defaults);
		chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.HorizontalStackedBar.defaults, charJSPersonalDefaultOptions);
		chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.HorizontalStackedBar.defaults, charJSPersonalDefaultOptionsHorizontalStackedBar);
		var config = (options) ? mergeChartConfig(chart.HorizontalStackedBar.defaults, options) : chart.HorizontalStackedBar.defaults;
		config = addAnimationEasing(config);
		return new HorizontalStackedBar(data, config, context);
	};
	this.Bar = function(data, options) {
		chart.Bar.defaults = {
			annotateBarMinimumDetectionHeight: 0,
			highLightSet: {
				pointDotRadius: 15,
				barStrokeWidth: 5,
				pointDot: true
			},
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
			forceSecondScale: false,
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
			rotateTLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
			// you can force an integer value between 0 and 180 degres
			logarithmic: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
			logarithmic2: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
			scaleTickSizeLeft: 5,
			scaleTickSizeRight: 5,
			scaleTickSizeBottom: 5,
			scaleTickSizeTop: 5,
			barShowStroke: true,
			barValueSpacing: 5,
			barDatasetSpacing: 1,
			barBorderRadius: 0,
			complementaryBar: false,
			complementaryBarFullHeight: false,
			complementaryColor: "rgba(100,100,100,0.3)",
			complementaryStrokeColor: "rgba(100,100,100,0.1)",
			pointDot: true,
			pointDotRadius: 4,
			pointDotStrokeStyle: "solid",
			pointDotStrokeWidth: 2,
			extrapolateMissingData: true,
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			alwaysRunFunctionAtCompletion: false,
			bezierCurve: true,
			linkType: 0, //0 : direct point to point; 1 = vertical lines; 2=angular link;
			bezierCurveTension: 0.4,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
			pointHitDetectionRadius: 10
		};
		// merge annotate defaults
		if (isIE() < 9 && isIE() != false) chart.Bar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Bar.defaults);
		chart.Bar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Bar.defaults);
		chart.Bar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Bar.defaults);
		chart.Bar.defaults = mergeChartConfig(chart.Bar.defaults, charJSPersonalDefaultOptions);
		chart.Bar.defaults = mergeChartConfig(chart.Bar.defaults, charJSPersonalDefaultOptionsBar);
		var config = (options) ? mergeChartConfig(chart.Bar.defaults, options) : chart.Bar.defaults;
		config = addAnimationEasing(config);
		return new Bar(data, config, context);
	};
	this.HorizontalBar = function(data, options) {
		chart.HorizontalBar.defaults = {
			annotateBarMinimumDetectionHeight: 0,
			highLightSet: {
				pointDotRadius: 15,
				barStrokeWidth: 5,
				pointDot: true
			},
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
			logarithmic: false,
			scaleOverlay: false,
			scaleOverride: false,
			scaleOverride2: false,
			forceSecondScale: false,
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
			rotateTLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
			barShowStroke: true,
			barValueSpacing: 5,
			barDatasetSpacing: 1,
			barBorderRadius: 0,
			complementaryBar: false,
			complementaryColor: "rgba(100,100,100,0.3)",
			complementaryStrokeColor: "rgba(100,100,100,0.1)",
			animation: true,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
			onAnimationComplete: null,
			alwaysRunFunctionAtCompletion: false,
			annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
			reverseOrder: false
		};
		// merge annotate defaults
		if (isIE() < 9 && isIE() != false) chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.HorizontalBar.defaults);
		chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.HorizontalBar.defaults);
		chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.HorizontalBar.defaults);
		chart.HorizontalBar.defaults = mergeChartConfig(chart.HorizontalBar.defaults, charJSPersonalDefaultOptions);
		chart.HorizontalBar.defaults = mergeChartConfig(chart.HorizontalBar.defaults, charJSPersonalDefaultOptionsHorizontalBar);
		var config = (options) ? mergeChartConfig(chart.HorizontalBar.defaults, options) : chart.HorizontalBar.defaults;
		config = addAnimationEasing(config);
		return new HorizontalBar(data, config, context);
	};
	chart.defaults = {};
	chart.defaults.IExplorer8 = {
		annotateBackgroundColor: "black",
		annotateFontColor: "white"
	};
	chart.defaults.Line_and_Bubble = {
		inGraphDataShow: false,
		highLightSet: {
			pointDotRadius: 15,
			pointDot: true
		},
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
		scaleOverlay: false,
		scaleOverride: false,
		scaleOverride2: false,
		forceSecondScale: false,
		scaleSteps: null,
		scaleStepWidth: null,
		scaleStartValue: null,
		scaleSteps2: null,
		scaleStepWidth2: null,
		scaleStartValue2: null,
		scaleLabel2: "<%=value%>",
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
		rotateTLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
		// you can force an integer value between 0 and 180 degres
		logarithmic: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
		logarithmic2: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
		scaleTickSizeLeft: 5,
		scaleTickSizeRight: 5,
		scaleTickSizeBottom: 5,
		scaleTickSizeTop: 5,
		bezierCurve: true,
		linkType: 0, //0 : direct point to point; 1 = vertical lines; 2=angular link;
		bezierCurveTension: 0.4,
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
		alwaysRunFunctionAtCompletion: false,
		annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3%>",
		pointHitDetectionRadius: 10
	};
	chart.defaults.commonOptions = {
		addListener: true,
		saveBackImage: false,
		generateConvertedData: false,
		displayData: true,
		showZeroValue: true,
		chartTextScale: 1,
		chartLineScale: 1,
		chartSpaceScale: 1,
		multiGraph: false,
		forceGraphMin: true,
		forceGraphMax: true,
		forceGraphMin2: true,
		forceGraphMax2: true,
		forceScale: "none",
		forceScale2: "none",
		clearRect: true, // do not change clearRect options; for internal use only
		dynamicDisplay: false,
		dynamicDisplayXPartOfChart: 0.5,
		dynamicDisplayYPartOfChart: 0.5,
		animationForceSetTimeOut: false,
		graphSpaceBefore: 5,
		graphSpaceAfter: 5,
		canvasBorders: false,
		canvasBackgroundColor: "none",
		canvasBordersRadius: 0,
		canvasBordersSelection: 15,
		canvasBordersWidth: 3,
		canvasBordersStyle: "solid",
		canvasBordersColor: "black",
		zeroValue: 0.0000000001,
		graphTitle: "",
		graphTitleAlign: "center",
		graphTitleShift: 10,
		graphTitleFontFamily: "'Arial'",
		graphTitleFontSize: 24,
		graphTitleFontStyle: "bold",
		graphTitleFontColor: "#666",
		graphTitleSpaceBefore: 5,
		graphTitleSpaceAfter: 5,
		graphTitleBorders: false,
		graphTitleBordersRadius: 0,
		graphTitleBordersColor: "black",
		graphTitleBordersXSpace: 3,
		graphTitleBordersYSpace: 3,
		graphTitleBordersSelection: 15,
		graphTitleBordersWidth: 1,
		graphTitleBordersStyle: "solid",
		graphTitleBackgroundColor: "none",
		graphSubTitle: "",
		graphSubTitleAlign: "center",
		graphSubTitleShift: 10,
		graphSubTitleFontFamily: "'Arial'",
		graphSubTitleFontSize: 18,
		graphSubTitleFontStyle: "normal",
		graphSubTitleFontColor: "#666",
		graphSubTitleSpaceBefore: 5,
		graphSubTitleSpaceAfter: 5,
		graphSubTitleBorders: false,
		graphSubTitleBordersColor: "black",
		graphSubTitleBordersRadius: 0,
		graphSubTitleBordersXSpace: 3,
		graphSubTitleBordersYSpace: 3,
		graphSubTitleBordersSelection: 15,
		graphSubTitleBordersWidth: 1,
		graphSubTitleBordersStyle: "solid",
		graphSubTitleBackgroundColor: "none",
		footNote: "",
		footNoteAlign: "center",
		footNoteShift: 10,
		footNoteFontFamily: "'Arial'",
		footNoteFontSize: 8,
		footNoteFontStyle: "bold",
		footNoteFontColor: "#666",
		footNoteSpaceBefore: 5,
		footNoteSpaceAfter: 5,
		footNoteBorders: false,
		footNoteBordersColor: "black",
		footNoteBordersRadius: 0,
		footNoteBordersXSpace: 3,
		footNoteBordersYSpace: 3,
		footNoteBordersSelection: 15,
		footNoteBordersWidth: 1,
		footNoteBordersStyle: "solid",
		footNoteBackgroundColor: "none",
		legend: false,
		legendWhenToDraw: "all",
		legendDrawEmptyData: true,
		showSingleLegend: false,
		maxLegendCols: 999,
		maxLegendLines: 999,
		legendPosY: 4,
		legendPosX: -2,
		legendFontFamily: "'Arial'",
		legendFontSize: 12,
		legendFontStyle: "normal",
		legendFontColor: "#666",
		legendBlockSize: 15,
		legendBlockRadius: 0,
		legendBorders: true,
		legendBordersStyle: "solid",
		legendBordersWidth: 1,
		legendBordersSelection: 15,
		legendBordersColors: "#666",
		legendBordersRadius: 0,
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
		legendFillColor: "rgba(0,0,0,0)",
		legendXPadding: 0,
		legendYPadding: 0,
		inGraphDataBorders: false,
		inGraphDataBordersRadius: 0,
		inGraphDataBordersColor: "black",
		inGraphDataBordersXSpace: 3,
		inGraphDataBordersYSpace: 3,
		inGraphDataBordersSelection: 15,
		inGraphDataBordersWidth: 1,
		inGraphDataBordersStyle: "solid",
		inGraphDataBackgroundColor: "none",
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
		annotateFunctionIn: null,
		annotateFunctionOut: null,
		detectMouseOnText: false,
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
		crossTextBorders: [false],
		crossTextBordersColor: ["black"],
		crossTextBordersRadius: [0],
		crossTextBordersXSpace: [3],
		crossTextBordersYSpace: [3],
		crossTextBordersSelection: [15],
		crossTextBordersWidth: [1],
		crossTextBordersStyle: ["solid"],
		crossTextBackgroundColor: ["none"],
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
		currency: "\u20AC", // 20AC= Euro
		currencyPosition: "after",
		roundNumber: "none",
		roundPct: -1,
		templatesOpenTag: "<%=",
		templatesCloseTag: "%>",
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
		fmtV14: "none",
		fmtV15: "none",
		fmtXLabel: "none",
		fmtTopXLabel: "none",
		fmtYLabel: "none",
		fmtYLabel2: "none",
		fmtLegend: "none",
		fmtVbubble: "none",
		animationYAxis: [1, 0, 1],
		animationRadius: [1, 0, 1],
		animationRotate: [1, 0, 1],
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
		defaultLineWidth: 2,
		graphMaximized: false,
		contextMenu: true,
		mouseDownRight: null,
		mouseDownLeft: null,
		mouseDownMiddle: null,
		mouseMove: null,
		mouseOut: null,
		mouseDblClick: null,
		mouseWheel: null,
		highLight: false,
		highLightMouseFunction: "mousemove",
		highLightFullLine: false, // true, false or "group"
		highLightRerunEndFunction: false,
		savePngName: "canvas",
		responsive: false,
		responsiveMinWidth: 0,
		responsiveMinHeight: 0,
		responsiveMaxWidth: 9999999,
		responsiveMaxHeight: 9999999,
		maintainAspectRatio: true,
		forcedAspectRadio: 0,
		responsiveScaleContent: false,
		responsiveWindowInitialWidth: false,
		markerShape: "circle", // "circle","cross","plus","diamond","triangle","square"
		barStrokeWidth: 2,
		initFunction: null,
		beforeLabelsFunction: null,
		afterLabelsFunction: null,
		beforeDrawFunction: null,
		endDrawDataFunction: null,
		endDrawScaleFunction: null
	};
	chart.defaults.PolarAreaV1 = {
		highLightSet: {
			color: "red"
		},
		inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
		annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>"
	};
	chart.defaults.PolarAreaV2 = {
		highLightSet: {
			fillColor: "red"
		},
		inGraphDataTmpl: "<%=(data.labels.length == 1 ? (v1 == '' ? '' : v1+':') + v3 + ' (' + v6 + ' %)' : (i==0 ? v2 : '') )%>",
		annotateLabel: "<%=(v2 == '' ? '' : v2) + (v2!='' && v1 !='' ? ' - ' : '')+(v1 == '' ? '' : v1)+(v2!='' || v1 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>"
	};
	chart.defaults.PolarArea = {
    angleShowLineOut: false,
		inGraphDataShow: false,
		inGraphDataPaddingRadius: 5,
		inGraphDataPaddingAngle: 0,
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
		forceSecondScale: false,
		scaleGridLinesStep: 1,
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
		animationByData: "ByArc",
		animationSteps: 100,
		animationEasing: "easeOutBounce",
		animateRotate: true,
		animateScale: false,
		onAnimationComplete: null,
		alwaysRunFunctionAtCompletion: false,
		startAngle: 90,
		totalAmplitude: 360,
		radiusScale: 1
	};
	chart.defaults.PieAndDoughnutV1 = {
		inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
		annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>"
	};
	chart.defaults.PieAndDoughnutV2 = {
		inGraphDataTmpl: "<%=(data.labels.length == 1 ? (v1 == '' ? '' : v1+':') + v3 + ' (' + v6 + ' %)' : (i==0 ? v2 : '') )%>",
		annotateLabel: "<%=(v2 == '' ? '' : v2) + (v2!='' && v1 !='' ? ' - ' : '')+(v1 == '' ? '' : v1)+(v2!='' || v1 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>"
	};
	chart.defaults.PieAndDoughnut = {
		highLightSet: {
			expandOutRadius: 0.10,
			expandInRadius: -0.10
		},
		inGraphDataShow: false,
		inGraphDataPaddingRadius: 5,
		inGraphDataPaddingAngle: 0,
		inGraphDataAlign: "off-center", // "right", "center", "left", "off-center" or "to-center"
		inGraphDataVAlign: "off-center", // "bottom", "middle", "top", "off-center" or "to-center"
		inGraphDataRotate: 0, // rotateAngle value (0->360) , "inRadiusAxis" or "inRadiusAxisRotateLabels"
		inGraphDataFontFamily: "'Arial'",
		inGraphDataFontSize: 12,
		inGraphDataFontStyle: "normal",
		inGraphDataFontColor: "#666",
		inGraphDataRadiusPosition: 3,
		inGraphDataAnglePosition: 2,
		inGraphDataMinimumAngle: 0,
		segmentShowStroke: true,
		segmentStrokeColor: "#fff",
		segmentStrokeStyle: "solid",
		segmentStrokeWidth: 2,
		percentageInnerCutout: 50,
		animation: true,
		animationByData: false,
		animationSteps: 100,
		animationEasing: "easeOutBounce",
		animateRotate: true,
		animateScale: false,
		onAnimationComplete: null,
		alwaysRunFunctionAtCompletion: false,
		startAngle: 90,
		totalAmplitude: 360,
		radiusScale: 1,
		radiusDataWeight: 1,
		radiusSpaceWeight: 0.3
	};
	chart.defaults.xyAxisCommonOptions = {
		maxBarWidth: -1,
		drawXScaleLine: [{
			position: "bottom"
		}],
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
		yAxisFontSize2: 0,
		yAxisFontStyle: "normal",
		yAxisFontColor: "#666",
		yAxisFontColor2: "",
		yAxisLabelSpaceRight: 5,
		yAxisLabelSpaceLeft: 5,
		yAxisSpaceRight: 5,
		yAxisSpaceLeft: 5,
		yAxisLabelBorders: false,
		yAxisLabelBordersColor: "black",
		yAxisLabelBordersRadius: 0,
		yAxisLabelBordersXSpace: 3,
		yAxisLabelBordersYSpace: 3,
		yAxisLabelBordersSelection: 15,
		yAxisLabelBordersWidth: 1,
		yAxisLabelBordersStyle: "solid",
		yAxisLabelBackgroundColor: "none",
		xAxisLabel: "",
		xAxisLabel2: "",
		xTAxisLabel: "",
		xAxisFontFamily: "'Arial'",
		xAxisFontSize: 16,
		xAxisFontStyle: "normal",
		xAxisFontColor: "#666",
		xAxisLabelSpaceBefore: 5,
		xAxisLabelSpaceAfter: 5,
		xAxisSpaceBefore: 5,
		xAxisSpaceAfter: 5,
		xAxisLabelBorders: false,
		xAxisLabelBordersColor: "black",
		xAxisLabelBordersRadius: 0,
		xAxisLabelBordersXSpace: 3,
		xAxisLabelBordersYSpace: 3,
		xAxisLabelBordersSelection: 15,
		xAxisLabelBordersWidth: 1,
		xAxisLabelBordersStyle: "solid",
		xAxisLabelBackgroundColor: "none",
		showXLabels: 1,
		firstLabelToShow: 1,
		showYLabels: 1,
		firstYLabelToShow: 1,
		yAxisUnit: "",
		yAxisUnit2: "",
		yAxisUnitFontFamily: "'Arial'",
		yAxisUnitFontSize: 8,
		yAxisUnitFontStyle: "normal",
		yAxisUnitFontColor: "#666",
		yAxisUnitSpaceBefore: 5,
		yAxisUnitSpaceAfter: 5,
		yAxisUnitBorders: false,
		yAxisUnitBordersColor: "black",
		yAxisUnitBordersradius: 0,
		yAxisUnitBordersXSpace: 3,
		yAxisUnitBordersYSpace: 3,
		yAxisUnitBordersSelection: 15,
		yAxisUnitBordersWidth: 1,
		yAxisUnitBordersStyle: "solid",
		yAxisUnitBackgroundColor: "none",
		scaleMinorTickWidth: 1,
		scaleMinorTickColor: "rgba(0,0,0,.05)",
		scaleMinorTickStyle: "solid",
		scaleMinorTickSizeTop: 3,
		scaleMinorTickSizeBottom: 3,
		scaleMinorTickSizeRight: 3,
		scaleMinorTickSizeLeft: 3,
		scaleMinorTickHorizontalCount: 0,
		scaleMinorTickVerticalCount: 0,
		scaleMinorTickVerticalLines: true,
		scaleMinorTickHorizontalLines: true,
		tickColor: "gridLine",
		minorTickColor: "gridLine",
		xAxisMiddle: false,
		yAxisMiddle: false
	};
	var clear = function(c) {
		c.clearRect(0, 0, width, height);
	};

	function init_and_start(ctx, data, config) {
		var i;
		if (typeof ctx.initialSize == "undefined") {
			resizeCtxFunction(0, ctx, data, config);
		}
		if (typeof ctx.firstPass == "undefined") {
			ctx.firstPass = 0;
			if (config.responsive && !config.multiGraph) {
				addResponsiveChart(ctx.ChartNewId, ctx, data, config);
			}
			if (typeof data.labels == "undefined") data.labels = [];
			if (data.labels.length == 0) {
				var mxlgt = 0;
				for (i = 0; i < data.datasets.length; i++) {
					mxlgt = Max([mxlgt, data.datasets[i].data.length]);
				}
				for (i = 0; i < mxlgt; i++) data.labels[i] = "";
			}
		}
		if (typeof ctx.ChartNewId == "undefined") {
			ctx.runanimationcompletefunction = true;
			var cvdate = new Date();
			var cvmillsec = cvdate.getTime();
			ctx.ChartNewId = ctx.tpchart + '_' + cvmillsec;
			ctx._eventListeners = {};
		}
		if (!dynamicFunction(data, config, ctx)) return false; // if config.dynamicDisplay=true, chart has to be displayed only if in current screen;  
		if (!config.multiGraph && ctx.firstPass != 0) {
			clearAnnotate(ctx.ChartNewId);
		}
		if (typeof jsGraphAnnotate[ctx.ChartNewId] == "undefined") {
			jsGraphAnnotate[ctx.ChartNewId] = new Array();
			jsTextMousePos[ctx.ChartNewId] = new Array();
		};
		// convert label to title - for compatibility reasons with Chart.js;
		for (i = 0; i < data.datasets.length; i++) {
			if (typeof data.datasets[i].title == "undefined" && typeof data.datasets[i].label != "undefined") {
				data.datasets[i].title = data.datasets[i].label;
			}
		}
		defMouse(ctx, data, config);
		if (ctx.firstPass == 0) {
			if (config.animation) ctx.firstPass = 1;
			else ctx.firstPass = 2;
		}
		setRect(ctx, config);
		return true;
	};

	function init_result(ctx, data, statData) {
		var i, j;
		var total_data = 0;
		var total_non_missing_data = 0;
		for (i = 0; i < data.datasets.length; i++) {
			if (typeof data.datasets[i].xPos !== "undefined" && ctx.tpchart == "Line") {
				total_data += data.datasets[i].xPos.length;
				for (j = 0; j < data.datasets[i].xPos.length; j++) {
					total_non_missing_data += (!(typeof(data.datasets[i].xPos[j]) == 'undefined'));
				}
			} else {
				total_data += data.labels.length;
				for (j = 0; j < data.datasets[i].data.length; j++) {
					if (((ctx.tpchart == "Pie" || ctx.tpchart == "Doughnut") && 1 * data.datasets[i].data[j] <= 0) || ((ctx.tpchart == "StackedBar" || ctx.tpchart == "HorizontalStackedBar") && Math.abs(1 * data.datasets[i].data[j]) <= 0.001) || typeof data.datasets[i].data[j] == 'undefined') continue;
					total_non_missing_data++;
				}
			}
		};
		ctx.pieces_drawn = {
			total_data: total_data,
			total_non_missing_data: total_non_missing_data,
			total_missing_data: (total_data - total_non_missing_data),
			all_drawn: false,
			completed: false,
			total_drawn: 0,
			points: 0,
			rectangles: 0,
			slices: 0
		};
	};

	function close_result(ctx) {
		ctx.pieces_drawn.completed = true;
		if (ctx.pieces_drawn.total_non_missing_data == ctx.pieces_drawn.total_drawn) {
			ctx.pieces_drawn.all_drawn = true;
		}
	}
	var MPolarArea = function(data, config, ctx) {
		var maxSize, scaleHop, labelHeight, scaleHeight, labelTemplateString, msr, midPosX, midPosY;
		ctx.tpchart = "PolarArea";
		ctx.tpchartSub = "PolarArea";
		ctx.tpdata = 0;
		if (!init_and_start(ctx, data, config)) return;
		var statData = initPassVariableData_part1(data, config, ctx);
		init_result(ctx, data, statData);
		var realCumulativeAngle = (((config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
		var realAmplitude = (((config.totalAmplitude * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
		if (realAmplitude <= config.zeroValue) realAmplitude = 2 * Math.PI;
		var debAngle = ((realCumulativeAngle - realAmplitude) + 4 * Math.PI) % (2 * Math.PI);
		var finAngle = debAngle + realAmplitude;
		var scaleData = computeScale(false, false, false, false, false, false, data, config, ctx, statData, 0);
		scaleData.labels1 = [];
		//    scaleData.labels2=[];
		populateLabels(scaleData.logarithm1, config.fmtYLabel, config, scaleData.labelTemplateString1, scaleData.labels1, scaleData.nbOfStepsAxis1, scaleData.minAxis1, scaleData.maxAxis1, scaleData.stepWidthAxis1);
		//    populateLabels(scaleData.logarithm2,config.fmtYLabel2, config, scaleData.labelTemplateString2, scaleData.labels2, scaleData.nbOfStepsAxis2, scaleData.minAxis2, scaleData.maxAxis2, scaleData.stepWidthAxis2);
		msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, scaleData.labels1, null, true, false, false, true, "PolarArea");
		var outerVal = scaleData.minAxis1 + scaleData.nbOfStepsAxis1 * scaleData.stepWidthAxis1;
		var drwSize = calculatePieDrawingSize(ctx, msr, config, data, statData);
		midPosX = drwSize.midPieX;
		midPosY = drwSize.midPieY;
		scaleHop = Math.floor(drwSize.radius / scaleData.nbOfStepsAxis1);
		var calculatedScale = {
			steps: scaleData.nbOfStepsAxis1,
			stepValue: scaleData.stepWidthAxis1,
			graphMin: scaleData.minAxis1,
			graphMax: scaleData.minAxis1 + scaleData.nbOfStepsAxis1 * scaleData.stepWidthAxis1,
			labels: scaleData.labels1
		};
    ext_radius=scaleHop * scaleData.nbOfStepsAxis1;
		//Wrap in an animation loop wrapper
		if (scaleHop > 0) {
			initPassVariableData_part2(statData, data, config, ctx, scaleData.logarithm1, scaleData.logarithm2, {
				midPosX: midPosX,
				midPosY: midPosY,
				int_radius: 0,
				ext_radius: scaleHop * scaleData.nbOfStepsAxis1,
				calculatedScale: calculatedScale,
				scaleHop: scaleHop,
				outerVal: outerVal
			});
			animationLoop(config, msr.legendMsr, drawScale, drawAllSegments, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPosX, midPosY, midPosX - ((Min([msr.availableHeight, msr.availableWidth]) / 2) - 5), midPosY + ((Min([msr.availableHeight, msr.availableWidth]) / 2) - 5), data, statData);
		} else {
			testRedraw(ctx, data, config);
			if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) {
				config.onAnimationComplete(ctx, config, data, 1, 0, statData);
				ctx.runanimationcompletefunction = false;
			}
			ctx.firstPass = 9;
			close_result(ctx);
		}

		function drawAllSegments(animationDecimal) {
			var fixAngle = 0;
			var correctedAnimationDecimal;
			var firstAngle = statData[0][0].firstAngle;
			if (1 * config.animationStartWithData > 1 && 1 * config.animationStartWithData - 1 < data.length) {
				fixAngle = (statData[config.animationStartWithData - 1].startAngle - statData[0][0].firstAngle);
				firstAngle = statData[config.animationStartWithData - 1].startAngle;
			}
			prevAngle = statData[0][0].firstAngle;
			for (var j = 0; j < data.labels.length; j++) {
				var scaleAnimation = 1,
					rotateAnimation = 1;
				for (var i = 0; i < data.datasets.length; i++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "MPOLARAREA");
					if (config.animation) {
						if (config.animateScale) {
							scaleAnimation = correctedAnimationDecimal.radius;
						}
						if (config.animateRotate) {
							rotateAnimation = correctedAnimationDecimal.rotate;
						}
					}
					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						ctx.beginPath();
						if (config.animationByData == "ByArc") {
							endAngle = statData[i][j].startAngle + rotateAnimation * statData[i][j].segmentAngle;
							ctx.arc(midPosX, midPosY, scaleAnimation * statData[i][j].radiusOffset, statData[i][j].startAngle, endAngle, false);
						} else if (config.animationByData) {
							if (i < 1 * config.animationStartWithData - 1) {
								ctx.arc(midPieX, midPieY, scaleAnimation * statData[i][j].radiusOffset, statData[i][j].startAngle, statData[i][j].endAngle, false);
							} else if (statData[i][j].startAngle <= firstAngle + rotateAnimation * (2 * Math.PI - fixAngle)) {
								endAngle = statData[i][j].endAngle;
								if (statData[i][j].endAngle > firstAngle + rotateAnimation * (2 * Math.PI - fixAngle)) {
									endAngle = firstAngle + rotateAnimation * (2 * Math.PI - fixAngle);
								}
								ctx.arc(midPieX, midPieY, scaleAnimation * statData[i][j].radiusOffset, statData[i][j].startAngle, endAngle, false);
							} else {
								continue;
							}
						} else {
							ctx.arc(midPieX, midPieY, scaleAnimation * statData[i][j].radiusOffset, prevAngle, prevAngle + rotateAnimation * (statData[i][j].endAngle - statData[i][j].startAngle), false);
							prevAngle = prevAngle + rotateAnimation * (statData[i][j].endAngle - statData[i][j].startAngle);
						}
						ctx.lineTo(midPosX, midPosY);
						ctx.closePath();
						if (animationDecimal.animationGlobal >= config.animationStopValue) {
							ctx.pieces_drawn.slices++;
							ctx.pieces_drawn.total_drawn++;
						}
						ctx.fillStyle = setOptionValue(true, true, 1, "FILLCOLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
							animationDecimal: animationDecimal.animationGlobal,
							scaleAnimation: scaleAnimation
						});
						ctx.fill();
						if (config.segmentShowStroke == "merge") { /* avoid blank stripes between piece of chart */
							ctx.lineWidth = 0;
							ctx.strokeStyle = setOptionValue(true, true, 1, "FILLCOLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
								animationDecimal: animationDecimal.animationGlobal,
								scaleAnimation: scaleAnimation
							});
							ctx.setLineDash([]);
							ctx.stroke();
						} else if (config.segmentShowStroke) {
							ctx.strokeStyle = config.segmentStrokeColor;
							ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.segmentStrokeWidth);
							ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "SEGMENTSTROKESTYLE", ctx, data, statData, data.datasets[i].segmentStrokeStyle, config.segmentStrokeStyle, "segmentStrokeStyle", i, j, {
								animationDecimal: animationDecimal.animationGlobal,
								scaleAnimation: scaleAnimation
							})));
							ctx.stroke();
							ctx.setLineDash([]);
						}
					}
				}
			}
			if (animationDecimal.animationGlobal >= config.animationStopValue) {
				for (i = 0; i < data.datasets.length; i++) {
					for (j = 0; j < data.labels.length; j++) {
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["MARC", i, j, statData, setOptionValue(true, true, 1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, "annotateDisplay", i, j, {
							nullValue: true
						})];
						if (setOptionValue(true, true, 1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, "inGraphDataShow", i, j, {
								nullValue: true
							})) {
							if (setOptionValue(true, true, 1, "INGRAPHDATAANGLEPOSITION", ctx, data, statData, undefined, config.inGraphDataAnglePosition, "inGraphDataAnglePosition", i, j, {
									nullValue: true
								}) == 1) posAngle = statData[i][j].realStartAngle + setOptionValue(true, true, 1, "INGRAPHDATAPADDINANGLE", ctx, data, statData, undefined, config.inGraphDataPaddingAngle, "inGraphDataPaddingAngle", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							else if (setOptionValue(true, true, 1, "INGRAPHDATAANGLEPOSITION", ctx, data, statData, undefined, config.inGraphDataAnglePosition, "inGraphDataAnglePosition", i, j, {
									nullValue: true
								}) == 2) posAngle = (2 * statData[i][j].realStartAngle - statData[i][j].segmentAngle) / 2 + setOptionValue(true, true, 1, "INGRAPHDATAPADDINANGLE", ctx, data, statData, undefined, config.inGraphDataPaddingAngle, "inGraphDataPaddingAngle", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							else if (setOptionValue(true, true, 1, "INGRAPHDATAANGLEPOSITION", ctx, data, statData, undefined, config.inGraphDataAnglePosition, "inGraphDataAnglePosition", i, j, {
									nullValue: true
								}) == 3) posAngle = statData[i][j].realStartAngle - statData[i][j].segmentAngle + setOptionValue(true, true, 1, "INGRAPHDATAPADDINANGLE", ctx, data, statData, undefined, config.inGraphDataPaddingAngle, "inGraphDataPaddingAngle", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							if (setOptionValue(true, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 1) labelRadius = 0 + setOptionValue(true, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							else if (setOptionValue(true, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 2) labelRadius = statData[i][j].radiusOffset / 2 + setOptionValue(true, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							else if (setOptionValue(true, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 3) labelRadius = statData[i][j].radiusOffset + setOptionValue(true, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							else if (setOptionValue(true, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 4) labelRadius = scaleHop * scaleData.nbOfStepsAxis1 + setOptionValue(true, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							ctx.save()
							if (setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
									nullValue: true
								}) == "off-center") {
								if (setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
										nullValue: true
									}) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) >= 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) <= Math.PI / 2) ctx.textAlign = "left";
								else ctx.textAlign = "right";
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
									nullValue: true
								}) == "to-center") {
								if (setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
										nullValue: true
									}) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) >= 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) <= Math.PI / 2) ctx.textAlign = "right";
								else ctx.textAlign = "left";
							} else ctx.textAlign = setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
								nullValue: true
							});
							if (setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
									nullValue: true
								}) == "off-center") {
								if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "top";
								else ctx.textBaseline = "bottom";
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
									nullValue: true
								}) == "to-center") {
								if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "bottom";
								else ctx.textBaseline = "top";
							} else ctx.textBaseline = setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
								nullValue: true
							});
							ctx.font = setOptionValue(true, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
								nullValue: true
							}) + ' ' + setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}) + 'px ' + setOptionValue(true, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
								nullValue: true
							});
							ctx.fillStyle = setOptionValue(true, true, 1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, undefined, config.inGraphDataFontColor, "inGraphDataFontColor", i, j, {
								nullValue: true
							});
							var dispString = tmplbis(setOptionValue(true, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
								nullValue: true
							}), statData[i][j], config);
							ctx.translate(midPosX + labelRadius * Math.cos(posAngle), midPosY - labelRadius * Math.sin(posAngle));
							var rotateVal = 0;
							if (setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
									nullValue: true
								}) == "inRadiusAxis") rotateVal = 2 * Math.PI - posAngle;
							else if (setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
									nullValue: true
								}) == "inRadiusAxisRotateLabels") {
								if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (posAngle + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2) rotateVal = 3 * Math.PI - posAngle;
								else rotateVal = 2 * Math.PI - posAngle;
							} else rotateVal = setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							ctx.rotate(rotateVal);
							setTextBordersAndBackground(ctx, dispString, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), 0, 0, setOptionValue(true, true, 1, "INGRAPHDATABORDERS", ctx, data, statData, undefined, config.inGraphDataBorders, "inGraphDataBorders", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSELECTION", ctx, data, statData, undefined, config.inGraphDataBordersSelection, "inGraphDataBordersSelection", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, undefined, config.inGraphDataBordersColor, "inGraphDataBordersColor", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, undefined, config.inGraphDataBordersWidth, "inGraphDataBordersWidth", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, undefined, config.inGraphDataBordersXSpace, "inGraphDataBordersXSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, undefined, config.inGraphDataBordersYSpace, "inGraphDataBordersYSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, undefined, config.inGraphDataBordersStyle, "inGraphDataBordersStyle", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, undefined, config.inGraphDataBackgroundColor, "inGraphDataBackgroundColor", i, j, {
								nullValue: true
							}), "INGRAPHDATA", config.inGraphDataBordersRadius);
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), true, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, midPosX + labelRadius * Math.cos(posAngle), midPosY - labelRadius * Math.sin(posAngle), i, j);
							ctx.restore();
						}
					}
				}
			}
		};

		function drawScale() {
			for (var i = 0; i < scaleData.nbOfStepsAxis1; i++) {
				if (config.scaleShowLine && (i + 1) % config.scaleGridLinesStep == 0) {
					ctx.beginPath();
					ctx.arc(midPosX, midPosY, scaleHop * (i + 1), 4 * Math.PI - debAngle, 4 * Math.PI - finAngle, true);
					ctx.strokeStyle = config.scaleLineColor;
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleLineWidth);
					ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
					ctx.stroke();
					ctx.setLineDash([]);
				}
				if (config.scaleShowLabels) {
					if (Math.abs(config.totalAmplitude - 360) < config.zeroValue) scaleAngle = Math.PI / 2;
					else scaleAngle = (debAngle + finAngle) / 2;
					ctx.textAlign = "center";
					ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
					var label = scaleData.labels1[i + 1];
					if (config.scaleShowLabelBackdrop) {
						var textWidth = ctx.measureTextMultiLine(label, Math.ceil(ctx.chartTextScale * config.scaleFontSize));
						ctx.fillStyle = config.scaleBackdropColor;
						ctx.beginPath();
						ctx.rect(Math.round(midPosX + Math.cos(scaleAngle) * (scaleHop * (i + 1)) - textWidth / 2 - Math.ceil(ctx.chartSpaceScale * config.scaleBackdropPaddingX)), //X
							Math.round(midPosY - Math.sin(scaleAngle) * (scaleHop * (i + 1)) - (Math.ceil(ctx.chartTextScale * config.scaleFontSize)) * 0.5 - Math.ceil(ctx.chartSpaceScale * config.scaleBackdropPaddingY)), //Y
							Math.round(textWidth + (Math.ceil(ctx.chartSpaceScale * config.scaleBackdropPaddingX) * 2)), //Width
							Math.round((Math.ceil(ctx.chartTextScale * config.scaleFontSize)) + (Math.ceil(ctx.chartSpaceScale * config.scaleBackdropPaddingY) * 2)) //Height
						);
						ctx.fill();
					}
					ctx.textBaseline = "middle";
					ctx.fillStyle = config.scaleFontColor;
					ctx.fillTextMultiLine(label, midPosX + Math.cos(scaleAngle) * (scaleHop * (i + 1)), midPosY - Math.sin(scaleAngle) * (scaleHop * (i + 1)), ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "SCALE_TEXTMOUSE", 0, 0, 0, i, -1);
				}
			}
      if (config.angleShowLineOut==true){
					ctx.beginPath();
					ctx.strokeStyle = config.scaleLineColor;
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleLineWidth);
					ctx.setLineDash(lineStyleFn(config.scaleLineStyle));
					ctx.stroke();
          firstdone=false;
          for(j=0;j<data.labels.length;j++){
            for(i=0;i<data.datasets.length;i++){
     					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {

                 if(firstdone==false) {
        					 ctx.beginPath();
    		           ctx.moveTo(midPosX, midPosY);
                   ctx.lineTo(midPosX+ext_radius*Math.cos(2*Math.PI-statData[i][j].startAngle),midPosY-ext_radius*Math.sin(2*Math.PI-statData[i][j].startAngle))  
					         ctx.stroke();
                   firstdone=true;

                 }
      					 ctx.beginPath();
   		           ctx.moveTo(midPosX, midPosY);
                 ctx.lineTo(midPosX+ext_radius*Math.cos(2*Math.PI-(statData[i][j].startAngle+statData[i][j].segmentAngle)),midPosY-ext_radius*Math.sin(2*Math.PI-(statData[i][j].startAngle+statData[i][j].segmentAngle)))  
				         ctx.stroke();
                 
              }
            }
          }
					ctx.setLineDash([]);

      }

		};
		return {
			data: data,
			config: config,
			ctx: ctx
		};
	};
	var PolarArea = function(data, config, ctx) {
		if (typeof data.length != "undefined") return (MPolarArea(convertData(data, config.generateConvertedData), config, ctx));
		else return (MPolarArea(data, config, ctx));
	};
	var Radar = function(data, config, ctx) {
		var maxSize, scaleHop, labelHeight, scaleHeight, labelTemplateString, msr, midPosX, midPosY;
		ctx.tpchart = "Radar";
		ctx.tpchartSub = "Radar";
		ctx.tpdata = 0;
		if (!init_and_start(ctx, data, config)) return;
		var statData = initPassVariableData_part1(data, config, ctx);
		init_result(ctx, data, statData);
		if (!data.labels) data.labels = [];
		var scaleData = computeScale(false, false, false, false, false, false, data, config, ctx, statData, 0);
		scaleData.labels1 = [];
		//    scaleData.labels2=[];
		populateLabels(scaleData.logarithm1, config.fmtYLabel, config, scaleData.labelTemplateString1, scaleData.labels1, scaleData.nbOfStepsAxis1, scaleData.minAxis1, scaleData.maxAxis1, scaleData.stepWidthAxis1);
		//    populateLabels(scaleData.logarithm2,config.fmtYLabel2, config, scaleData.labelTemplateString2, scaleData.labels2, scaleData.nbOfStepsAxis2, scaleData.minAxis2, scaleData.maxAxis2, scaleData.stepWidthAxis2);
		//If no labels are defined set to an empty array, so referencing length for looping doesn't blow up.
		var calculatedScale = {
			steps: scaleData.nbOfStepsAxis1,
			stepValue: scaleData.stepWidthAxis1,
			graphMin: scaleData.minAxis1,
			graphMax: scaleData.minAxis1 + scaleData.nbOfStepsAxis1 * scaleData.stepWidthAxis1,
			labels: scaleData.labels1
		};
		msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, scaleData.labels1, null, true, false, false, config.datasetFill, "Radar");
		calculateDrawingSizes();
		midPosY = msr.topNotUsableHeight + (msr.availableHeight / 2);
		scaleHop = maxSize / (scaleData.nbOfStepsAxis1);
		//Wrap in an animation loop wrapper
		initPassVariableData_part2(statData, data, config, ctx, scaleData.logarithm1, scaleData.logarithm2, {
			midPosX: midPosX,
			midPosY: midPosY,
			calculatedScale: calculatedScale,
			scaleHop: scaleHop,
			maxSize: maxSize,
			outerVal: -1
		});
		animationLoop(config, msr.legendMsr, drawScale, drawAllDataPoints, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPosX, midPosY, midPosX - maxSize, midPosY + maxSize, data, statData);

		function drawAllDataPoints(animationDecimal) {
			var correctedAnimationDecimal;
			var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
			ctx.save();
			//We accept multiple data sets for radar charts, so show loop through each set
			for (var i = 0; i < data.datasets.length; i++) {
				var fPt = -1;
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "RADAR");
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) continue;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
							nullvalue: null
						}) == false) continue;
					//					var currentAnimPc = animationCorrectionOld(correctedAnimationDecimal, data, config, i, j, false).animVal;
					var currentAnimPc = correctedAnimationDecimal.yAxis;
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						if (fPt == -1) {
							ctx.beginPath();
							ctx.moveTo(midPosX + currentAnimPc * statData[i][j].offsetX, midPosY - currentAnimPc * statData[i][j].offsetY);
							fPt = j;
						} else {
							ctx.lineTo(midPosX + currentAnimPc * statData[i][j].offsetX, midPosY - currentAnimPc * statData[i][j].offsetY);
						}
						if (animationDecimal.animationGlobal >= config.animationStopValue) {
							ctx.pieces_drawn.points++;
							ctx.pieces_drawn.total_drawn++;
						}
					}
				}
				ctx.closePath();
				if (config.datasetFill) {
					ctx.fillStyle = setOptionValue(true, true, 1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, -1, {
						animationValue: currentAnimPc,
						midPosX: statData[i][0].midPosX,
						midPosY: statData[i][0].midPosY,
						ext_radius: (config.animationLeftToRight ? 1 : currentAnimPc) * (statData[i][0].calculated_offset_max)
					});
				} else ctx.fillStyle = "rgba(0,0,0,0)";
				ctx.strokeStyle = setOptionValue(true, true, 1, "STROKECOLOR", ctx, data, statData, data.datasets[i].strokeColor, config.defaultStrokeColor, "strokeColor", i, -1, {
					nullvalue: null
				});
				ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, true, 1, "LINEWIDTH", ctx, data, statData, data.datasets[i].datasetStrokeWidth, config.datasetStrokeWidth, "datasetStrokeWidth", i, -1, {
					nullvalue: null
				}));
				ctx.fill();
				ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "LINEDASH", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
					nullvalue: null
				})));
				ctx.stroke();
				ctx.setLineDash([]);
				if (animationDecimal.animationGlobal >= config.animationStopValue) {
					ctx.beginPath();
					for (var k = 0; k < data.datasets[i].data.length; k++) {
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, k, {
								nullvalue: null
							}) == false) continue;
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", k, -1, {
								nullvalue: null
							}) == false) continue;
						if (!(typeof(data.datasets[i].data[k]) == 'undefined')) {
							if (setOptionValue(true, true, 1, "POINTDOT", ctx, data, statData, undefined, config.pointDot, "pointDot", i, k, {
									nullvalue: null
								})) {
								ctx.beginPath();
								ctx.fillStyle = setOptionValue(true, true, 1, "MARKERFILLCOLOR", ctx, data, statData, data.datasets[i].pointColor, config.defaultStrokeColor, "pointColor", i, k, {
									nullvalue: true
								});
								ctx.strokeStyle = setOptionValue(true, true, 1, "MARKERSTROKESTYLE", ctx, data, statData, data.datasets[i].pointStrokeColor, config.defaultStrokeColor, "pointStrokeColor", i, k, {
									nullvalue: true
								});
								ctx.lineWidth = setOptionValue(true, true, ctx.chartLineScale, "MARKERLINEWIDTH", ctx, data, statData, data.datasets[i].pointDotStrokeWidth, config.pointDotStrokeWidth, "pointDotStrokeWidth", i, k, {
									nullvalue: true
								});
								var markerShape = setOptionValue(true, true, 1, "MARKERSHAPE", ctx, data, statData, data.datasets[i].markerShape, config.markerShape, "markerShape", i, k, {
									nullvalue: true
								});
								var markerRadius = setOptionValue(true, true, ctx.chartSpaceScale, "MARKERRADIUS", ctx, data, statData, data.datasets[i].pointDotRadius, config.pointDotRadius, "pointDotRadius", i, k, {
									nullvalue: true
								});
								var markerStrokeStyle = setOptionValue(true, true, 1, "MARKERSTROKESTYLE", ctx, data, statData, data.datasets[i].pointDotStrokeStyle, config.pointDotStrokeStyle, "pointDotStrokeStyle", i, k, {
									nullvalue: true
								});
								drawMarker(ctx, midPosX + currentAnimPc * statData[i][k].offsetX, midPosY - currentAnimPc * statData[i][k].offsetY, markerShape, markerRadius, markerStrokeStyle);
							}
						}
					}
				}
			}
			ctx.restore();
			if (animationDecimal.animationGlobal >= config.animationStopValue) {
				for (i = 0; i < data.datasets.length; i++) {
					for (j = 0; j < data.datasets[i].data.length; j++) {
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
								nullvalue: null
							}) == false) continue;
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
								nullvalue: null
							}) == false) continue;
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["POINT", i, j, statData, setOptionValue(true, true, 1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, "annotateDisplay", i, j, {
							nullValue: true
						})];
						if (setOptionValue(true, true, 1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, "inGraphDataShow", i, j, {
								nullValue: true
							})) {
							ctx.save();
							ctx.beginPath();
							ctx.textAlign = setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
								nullValue: true
							});
							ctx.textBaseline = setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
								nullValue: true
							});
							if (setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
									nullValue: true
								}) == "off-center") {
								if (setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
										nullValue: true
									}) == "inRadiusAxis" || (config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) <= Math.PI / 2) ctx.textAlign = "left";
								else ctx.textAlign = "right";
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
									nullValue: true
								}) == "to-center") {
								if (setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
										nullValue: true
									}) == "inRadiusAxis" || (config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) < Math.PI / 2) ctx.textAlign = "right";
								else ctx.textAlign = "left";
							} else ctx.textAlign = setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
								nullValue: true
							});
							if (setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
									nullValue: true
								}) == "off-center") {
								if ((config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "bottom";
								else ctx.textBaseline = "top";
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
									nullValue: true
								}) == "to-center") {
								if ((config.startAngle * Math.PI / 180 - j * rotationDegree + 4 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "top";
								else ctx.textBaseline = "bottom";
							} else ctx.textBaseline = setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
								nullValue: true
							});
							ctx.font = setOptionValue(true, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
								nullValue: true
							}) + ' ' + setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}) + 'px ' + setOptionValue(true, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
								nullValue: true
							});
							ctx.fillStyle = setOptionValue(true, true, 1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, undefined, config.inGraphDataFontColor, "inGraphDataFontColor", i, j, {
								nullValue: true
							});
							var radiusPrt;
							if (setOptionValue(true, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 1) radiusPrt = 0 + setOptionValue(true, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							else if (setOptionValue(true, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 2) radiusPrt = (statData[i][j].calculated_offset) / 2 + setOptionValue(true, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							else if (setOptionValue(true, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 3) radiusPrt = (statData[i][j].calculated_offset) + setOptionValue(true, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							var x_pos, y_pos;
							if (statData[i][j].calculated_offset > 0) {
								x_pos = midPosX + statData[i][j].offsetX * (radiusPrt / statData[i][j].calculated_offset);
								y_pos = midPosY - statData[i][j].offsetY * (radiusPrt / statData[i][j].calculated_offset);
							} else {
								x_pos = midPosX;
								y_pos = midPosY;
							}
							ctx.translate(x_pos, y_pos);
							var rotateVal = 0;
							if (setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
									nullValue: true
								}) == "inRadiusAxis") rotateVal = j * rotationDegree;
							else if (setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
									nullValue: true
								}) == "inRadiusAxisRotateLabels") {
								if ((j * rotationDegree + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (j * rotationDegree + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2) rotateVal = 3 * Math.PI + j * rotationDegree;
								else rotateVal = 2 * Math.PI + j * rotationDegree;
							} else rotateVal = setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							ctx.rotate(rotateVal);
							var dispString = tmplbis(setOptionValue(true, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
								nullValue: true
							}), statData[i][j], config);
							setTextBordersAndBackground(ctx, dispString, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), 0, 0, setOptionValue(true, true, 1, "INGRAPHDATABORDERS", ctx, data, statData, undefined, config.inGraphDataBorders, "inGraphDataBorders", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSELECTION", ctx, data, statData, undefined, config.inGraphDataBordersSelection, "inGraphDataBordersSelection", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, undefined, config.inGraphDataBordersColor, "inGraphDataBordersColor", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, undefined, config.inGraphDataBordersWidth, "inGraphDataBordersWidth", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, undefined, config.inGraphDataBordersXSpace, "inGraphDataBordersXSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, undefined, config.inGraphDataBordersYSpace, "inGraphDataBordersYSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, undefined, config.inGraphDataBordersStyle, "inGraphDataBordersStyle", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, undefined, config.inGraphDataBackgroundColor, "inGraphDataBackgroundColor", i, j, {
								nullValue: true
							}), "INGRAPHDATA", config.inGraphDataBordersRadius);
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), true, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, x_pos, y_pos, i, j);
							ctx.restore();
						}
					}
				}
			}
		};

		function drawScale() {
			var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
			ctx.save();
			ctx.translate(midPosX, midPosY);
			ctx.rotate((90 - config.startAngle) * Math.PI / 180);
			if (config.angleShowLineOut) {
				ctx.strokeStyle = config.angleLineColor;
				ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.angleLineWidth);
				for (var h = 0; h < data.datasets[0].data.length; h++) {
					ctx.rotate(rotationDegree);
					ctx.beginPath();
					ctx.moveTo(0, 0);
					ctx.lineTo(0, -maxSize);
					ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "ANGLELINESTYLE", ctx, data, statData, undefined, config.angleLineStyle, "angleLineStyle", h, -1, {
						nullValue: true
					})));
					ctx.stroke();
					ctx.setLineDash([]);
				}
			}
			for (var i = 0; i < scaleData.nbOfStepsAxis1; i++) {
				ctx.beginPath();
				if (config.scaleShowLine && (i + 1) % config.scaleGridLinesStep == 0) {
					ctx.strokeStyle = config.scaleLineColor;
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleLineWidth);
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
				for (i = 0; i < scaleData.nbOfStepsAxis1; i++) {
					ctx.textAlign = 'center';
					ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
					ctx.textBaseline = "middle";
					if (config.scaleShowLabelBackdrop) {
						var textWidth = ctx.measureTextMultiLine(scaleData.labels1[i + 1], (Math.ceil(ctx.chartTextScale * config.scaleFontSize))).textWidth;
						ctx.fillStyle = config.scaleBackdropColor;
						ctx.beginPath();
						ctx.rect(Math.round(Math.cos(config.startAngle * Math.PI / 180) * (scaleHop * (i + 1)) - textWidth / 2 - Math.ceil(ctx.chartSpaceScale * config.scaleBackdropPaddingX)), //X
							Math.round((-Math.sin(config.startAngle * Math.PI / 180) * scaleHop * (i + 1)) - (Math.ceil(ctx.chartTextScale * config.scaleFontSize)) * 0.5 - Math.ceil(ctx.chartSpaceScale * config.scaleBackdropPaddingY)), //Y
							Math.round(textWidth + (Math.ceil(ctx.chartSpaceScale * config.scaleBackdropPaddingX) * 2)), //Width
							Math.round((Math.ceil(ctx.chartTextScale * config.scaleFontSize)) + (Math.ceil(ctx.chartSpaceScale * config.scaleBackdropPaddingY) * 2)) //Height
						);
						ctx.fill();
					}
					ctx.fillStyle = config.scaleFontColor;
					ctx.fillTextMultiLine(scaleData.labels1[i + 1], Math.cos(config.startAngle * Math.PI / 180) * (scaleHop * (i + 1)), -Math.sin(config.startAngle * Math.PI / 180) * scaleHop * (i + 1), ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "SCALE_TEXTMOUSE", 0, midPosX, midPosY, i, -1);
				}
			}
			for (var k = 0; k < data.labels.length; k++) {
				ctx.font = config.pointLabelFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.pointLabelFontSize)).toString() + "px " + config.pointLabelFontFamily;
				ctx.fillStyle = config.pointLabelFontColor;
				var opposite = Math.sin((90 - config.startAngle) * Math.PI / 180 + rotationDegree * k) * (maxSize + (Math.ceil(ctx.chartTextScale * config.pointLabelFontSize)));
				var adjacent = Math.cos((90 - config.startAngle) * Math.PI / 180 + rotationDegree * k) * (maxSize + (Math.ceil(ctx.chartTextScale * config.pointLabelFontSize)));
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
				ctx.fillTextMultiLine(data.labels[k], opposite, -adjacent, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.pointLabelFontSize)), true, config.detectMouseOnText, ctx, "LABEL_TEXTMOUSE", 0, midPosX, midPosY, k, -1);
			}
			ctx.restore();
		};

		function calculateDrawingSizes() {
			var midX, mxlb, maxL, maxR, iter, nbiter, prevMaxSize, prevMidX, i, textMeasurement;
			var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
			var rotateAngle = config.startAngle * Math.PI / 180;
			// Compute range for Mid Point of graph
			ctx.font = config.pointLabelFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.pointLabelFontSize)).toString() + "px " + config.pointLabelFontFamily;
			if (!config.graphMaximized) {
				maxR = msr.availableWidth / 2;
				maxL = msr.availableWidth / 2;
				nbiter = 1;
			} else {
				maxR = msr.availableWidth / 2;
				maxL = msr.availableWidth / 2;
				nbiter = 40;
				for (i = 0; i < data.labels.length; i++) {
					textMeasurement = ctx.measureTextMultiLine(data.labels[i], (Math.ceil(ctx.chartTextScale * config.scaleFontSize))).textWidth + ctx.measureTextMultiLine(data.labels[i], (Math.ceil(ctx.chartTextScale * config.scaleFontSize))).textHeight;
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
			midPosX = maxR + msr.leftNotUsableWidth;
			for (midX = maxR, iter = 0; iter < nbiter; ++iter, midX += (msr.availableWidth - maxL - maxR) / nbiter) {
				maxSize = Max([midX, msr.availableWidth - midX]);
				rotateAngle = config.startAngle * Math.PI / 180;
				mxlb = msr.available;
				for (i = 0; i < data.labels.length; i++) {
					textMeasurement = ctx.measureTextMultiLine(data.labels[i], (Math.ceil(ctx.chartTextScale * config.scaleFontSize))).textWidth + ctx.measureTextMultiLine(data.labels[i], (Math.ceil(ctx.chartTextScale * config.scaleFontSize))).textHeight;
					if ((rotateAngle < Math.PI / 2 && rotateAngle > -Math.PI / 2) || rotateAngle > 3 * Math.PI / 2) {
						mxlb = ((msr.availableWidth - midX) - textMeasurement) / Math.abs(Math.cos(rotateAngle));
					} else if (Math.cos(rotateAngle != 0)) {
						mxlb = (midX - textMeasurement) / Math.abs(Math.cos(rotateAngle));
					}
					if (mxlb < maxSize) maxSize = mxlb;
					if (Math.sin(rotateAngle) * msr.availableHeight / 2 > msr.availableHeight / 2 - (Math.ceil(ctx.chartTextScale * config.scaleFontSize)) * 2) {
						mxlb = Math.sin(rotateAngle) * msr.availableHeight / 2 - 1.5 * (Math.ceil(ctx.chartTextScale * config.scaleFontSize));
						if (mxlb < maxSize) maxSize = mxlb;
					}
					rotateAngle -= rotationDegree;
				}
				if (maxSize > prevMaxSize) {
					prevMaxSize = maxSize;
					midPosX = midX + msr.leftNotUsableWidth;
				}
			}
			maxSize = prevMaxSize - (Math.ceil(ctx.chartTextScale * config.scaleFontSize)) / 2;
			//If the label height is less than 5, set it to 5 so we don't have lines on top of each other.
			labelHeight = Default(labelHeight, 5);
		};
		return {
			data: data,
			config: config,
			ctx: ctx
		};
	};
	var Pie = function(data, config, ctx) {
		ctx.tpchart = "Pie";
		ctx.tpchartSub = "Pie";
		if (typeof data.length != "undefined") return (PieDoughnut(convertData(data, config.generateConvertedData), config, ctx, "Pie"));
		else return (PieDoughnut(data, config, ctx, "Pie"));
	};
	var Doughnut = function(data, config, ctx) {
		ctx.tpchart = "Doughnut";
		ctx.tpchartSub = "Doughnut";
		if (typeof data.length != "undefined") return (PieDoughnut(convertData(data, config.generateConvertedData), config, ctx, "Doughnut"));
		else return (PieDoughnut(data, config, ctx, "Doughnut"));
	};
	var PieDoughnut = function(data, config, ctx, chartType) {
		var msr, midPieX, midPieY, doughnutRadius, cutoutRadius;
		ctx.tpdata = 0;
		if (!init_and_start(ctx, data, config)) return;
		var statData = initPassVariableData_part1(data, config, ctx);
		init_result(ctx, data, statData);
		var realCumulativeAngle = (((config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
		msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, "none", "none", true, false, false, true, "Doughnut");
		var drwSize = calculatePieDrawingSize(ctx, msr, config, data, statData);
		midPieX = drwSize.midPieX;
		midPieY = drwSize.midPieY;
		doughnutRadius = drwSize.radius;
		if (chartType == "Pie") cutoutRadius = 0;
		else cutoutRadius = doughnutRadius * (config.percentageInnerCutout / 100);
		if (doughnutRadius > 0) {
			initPassVariableData_part2(statData, data, config, ctx, false, false, {
				midPosX: midPieX,
				midPosY: midPieY,
				int_radius: cutoutRadius,
				ext_radius: doughnutRadius,
				outerVal: -1
			});
			animationLoop(config, msr.legendMsr, null, drawPieSegments, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPieX, midPieY, midPieX - doughnutRadius, midPieY + doughnutRadius, data, statData);
		} else {
			testRedraw(ctx, data, config);
			if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) {
				config.onAnimationComplete(ctx, config, data, 1, 0, statData);
				ctx.runanimationcompletefunction = false;
			}
			ctx.firstPass = 9;
			close_result(ctx);
		}

		function drawPieSegments(animationDecimal) {
			var dataCutoutRadius, dataDoughnutRadius;
			var rdataCutoutRadius, rdataDoughnutRadius;
			var correctedAnimationDecimal;
			var prevAngle, fixAngle, firstAngle, cumulativeAngle;
			prevAngle = [];
			fixAngle = [];
			firstAngle = [];
			cumulativeAngle = [];
			for (var i = 0; i < data.datasets.length; i++) {
				var scaleAnimation = 1,
					rotateAnimation = 1;
				for (j = 0; j < data.labels.length; j++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "PIE");
					if (typeof prevAngle[j] == "undefined" && typeof statData[i][j].firstAngle != "undefined") {
						prevAngle[j] = statData[i][j].firstAngle;
						fixAngle[j] = 0;
						firstAngle[j] = statData[i][j].firstAngle;
						cumulativeAngle[j] = (((-config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
					}
					statData[i][j].inRadius = 0;
					statData[i][j].outRadius = 0;
					if (setOptionValue(false, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) continue;
					if (setOptionValue(false, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", -1, j, {
							nullvalue: null
						}) == false) continue;
					if (typeof data.datasets[i].data[j] == 'undefined' || 1 * data.datasets[i].data[j] <= 0) continue;
					if (chartType == "Pie") dataCutoutRadius = cutoutRadius;
					else dataCutoutRadius = cutoutRadius
					dataDoughnutRadius = doughnutRadius
					// correct radius for Multiple Doughnuts;
					rdataCutoutRadius = dataCutoutRadius + (dataDoughnutRadius - dataCutoutRadius) * statData[i][j].startRadius;
					rdataDoughnutRadius = dataCutoutRadius + (dataDoughnutRadius - dataCutoutRadius) * statData[i][j].stopRadius;
					dataCutoutRadius = rdataCutoutRadius;
					dataDoughnutRadius = rdataDoughnutRadius;
					if (chartType != "Pie" || j > 0) rdataCutoutRadius = dataCutoutRadius - (dataDoughnutRadius - dataCutoutRadius) * setOptionValue(false, true, 1, "EXPANDINRADIUS", ctx, data, statData, data.datasets[i].expandInRadius, 0, "expandInRadius", i, j, {
						animationDecimal: animationDecimal.animationGlobal,
						scaleAnimation: scaleAnimation
					});
					rdataDoughnutRadius = dataDoughnutRadius + (dataDoughnutRadius - dataCutoutRadius) * setOptionValue(false, true, 1, "EXPANDOUTRADIUS", ctx, data, statData, data.datasets[i].expandOutRadius, 0, "expandOutRadius", i, j, {
						animationDecimal: animationDecimal.animationGlobal,
						scaleAnimation: scaleAnimation
					});
					dataCutoutRadius = rdataCutoutRadius;
					dataDoughnutRadius = rdataDoughnutRadius;
					statData[i][j].inRadius = dataCutoutRadius;
					statData[i][j].outRadius = dataDoughnutRadius;
					if (config.animation) {
						if (config.animateScale) {
							scaleAnimation = correctedAnimationDecimal.radius;
						}
						if (config.animateRotate) {
							rotateAnimation = correctedAnimationDecimal.rotate;
						}
					}
					ctx.beginPath();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.segmentStrokeWidth);
					ctx.strokeStyle = "rgba(0,0,0,0)";
					if (config.animationByData == "ByArc") {
						endAngle = statData[i][j].startAngle + rotateAnimation * statData[i][j].segmentAngle;
						ctx.arc(midPieX, midPieY, scaleAnimation * dataDoughnutRadius, statData[i][j].startAngle, endAngle, false);
						ctx.arc(midPieX, midPieY, scaleAnimation * dataCutoutRadius, endAngle, statData[i][j].startAngle, true);
					} else if (config.animationByData) {
						// animationStartWith data not implemented      if (i<1*config.animationStartWithData-1) {
						if (i < 0) {
							ctx.arc(midPieX, midPieY, scaleAnimation * dataDoughnutRadius, statData[i][j].startAngle, statData[i].endAngle, false);
							ctx.arc(midPieX, midPieY, scaleAnimation * dataCutoutRadius, statData[i][j].endAngle, statData[i][j].startAngle, true);
						} else if (statData[i][j].startAngle <= firstAngle[j] + rotateAnimation * (2 * Math.PI - fixAngle[j])) {
							endAngle = statData[i][j].endAngle;
							if (statData[i][j].endAngle > firstAngle[j] + rotateAnimation * (2 * Math.PI - fixAngle[j])) {
								endAngle = firstAngle[j] + rotateAnimation * (2 * Math.PI - fixAngle[j]);
							}
							ctx.arc(midPieX, midPieY, scaleAnimation * dataDoughnutRadius, statData[i][j].startAngle, endAngle, false);
							ctx.arc(midPieX, midPieY, scaleAnimation * dataCutoutRadius, endAngle, statData[i][j].startAngle, true);
						} else {
							continue;
						}
					} else {
						ctx.arc(midPieX, midPieY, scaleAnimation * dataDoughnutRadius, prevAngle[j], prevAngle[j] + rotateAnimation * (statData[i][j].endAngle - statData[i][j].startAngle), false);
						ctx.arc(midPieX, midPieY, scaleAnimation * dataCutoutRadius, prevAngle[j] + rotateAnimation * (statData[i][j].endAngle - statData[i][j].startAngle), prevAngle[j], true);
						prevAngle[j] = prevAngle[j] + rotateAnimation * (statData[i][j].endAngle - statData[i][j].startAngle);
					}
					ctx.closePath();
					ctx.fillStyle = setOptionValue(false, true, 1, "FILLCOLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
						animationDecimal: animationDecimal.animationGlobal,
						scaleAnimation: scaleAnimation
					});
					ctx.fill();
					if (animationDecimal.animationGlobal >= config.animationStopValue) {
						ctx.pieces_drawn.slices++;
						ctx.pieces_drawn.total_drawn++;
					}
					if (config.segmentShowStroke == "merge") { /* avoid blank stripes between piece of chart */
						ctx.lineWidth = 1.5;
						ctx.strokeStyle = setOptionValue(false, true, 1, "FILLCOLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
							animationDecimal: animationDecimal.animationGlobal,
							scaleAnimation: scaleAnimation
						});
						ctx.setLineDash([]);
						ctx.stroke();
					} else if (config.segmentShowStroke) {
						ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.segmentStrokeWidth);
						ctx.strokeStyle = config.segmentStrokeColor;
						ctx.setLineDash(lineStyleFn(setOptionValue(false, true, 1, "SEGMENTSTROKESTYLE", ctx, data, statData, data.datasets[i].segmentStrokeStyle, config.segmentStrokeStyle, "segmentStrokeStyle", i, -1, {
							animationDecimal: animationDecimal.animationGlobal,
							scaleAnimation: scaleAnimation
						})));
						ctx.stroke();
						ctx.setLineDash([]);
					}
				}
			}
			if (animationDecimal.animationGlobal >= config.animationStopValue) {
				for (var i = 0; i < data.datasets.length; i++) {
					for (j = 0; j < data.labels.length; j++) {
						if (setOptionValue(false, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
								nullvalue: null
							}) == false) continue;
						if (setOptionValue(false, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", -1, j, {
								nullvalue: null
							}) == false) continue;
						if (typeof data.datasets[i].data[j] == 'undefined' || 1 * data.datasets[i].data[j] <= 0) continue;
						if (chartType == "Pie") dataCutoutRadius = cutoutRadius;
						else dataCutoutRadius = cutoutRadius - (doughnutRadius - cutoutRadius) * setOptionValue(false, true, 1, "EXPANDINRADIUS", ctx, data, statData, data.datasets[i].expandInRadius, 0, "expandInRadius", i, j, {
							animationDecimal: animationDecimal.animationGlobal,
							scaleAnimation: scaleAnimation
						});
						dataDoughnutRadius = doughnutRadius + (doughnutRadius - cutoutRadius) * setOptionValue(false, true, 1, "EXPANDOUTRADIUS", ctx, data, statData, data.datasets[i].expandOutRadius, 0, "expandOutRadius", i, j, {
							animationDecimal: animationDecimal.animationGlobal,
							scaleAnimation: scaleAnimation
						});
						// correct radius for Multiple Doughnuts;
						rdataCutoutRadius = dataCutoutRadius + (dataDoughnutRadius - dataCutoutRadius) * statData[i][j].startRadius;
						rdataDoughnutRadius = dataCutoutRadius + (dataDoughnutRadius - dataCutoutRadius) * statData[i][j].stopRadius;
						dataCutoutRadius = rdataCutoutRadius;
						dataDoughnutRadius = rdataDoughnutRadius;
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["MARC", i, j, statData, setOptionValue(false, true, 1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, "annotateDisplay", i, j, {
							nullValue: true
						})];
						if (setOptionValue(false, true, 1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, "inGraphDataShow", i, j, {
								nullValue: true
							}) && statData[i][j].segmentAngle >= (Math.PI / 180) * setOptionValue(false, true, 1, "INGRAPHDATAMINIMUMANGLE", ctx, data, statData, undefined, config.inGraphDataMinimumAngle, "inGraphDataMinimumAngle", i, j, {
								nullValue: true
							})) {
							if (setOptionValue(false, true, 1, "INGRAPHDATAANGLEPOSITION", ctx, data, statData, undefined, config.inGraphDataAnglePosition, "inGraphDataAnglePosition", i, j, {
									nullValue: true
								}) == 1) posAngle = statData[i][j].realStartAngle + setOptionValue(false, true, 1, "INGRAPHDATAPADDINANGLE", ctx, data, statData, undefined, config.inGraphDataPaddingAngle, "inGraphDataPaddingAngle", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							else if (setOptionValue(false, true, 1, "INGRAPHDATAANGLEPOSITION", ctx, data, statData, undefined, config.inGraphDataAnglePosition, "inGraphDataAnglePosition", i, j, {
									nullValue: true
								}) == 2) posAngle = statData[i][j].realStartAngle - statData[i][j].segmentAngle / 2 + setOptionValue(false, true, 1, "INGRAPHDATAPADDINANGLE", ctx, data, statData, undefined, config.inGraphDataPaddingAngle, "inGraphDataPaddingAngle", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							else if (setOptionValue(false, true, 1, "INGRAPHDATAANGLEPOSITION", ctx, data, statData, undefined, config.inGraphDataAnglePosition, "inGraphDataAnglePosition", i, j, {
									nullValue: true
								}) == 3) posAngle = statData[i][j].realStartAngle - statData[i][j].segmentAngle + setOptionValue(false, true, 1, "INGRAPHDATAPADDINANGLE", ctx, data, statData, undefined, config.inGraphDataPaddingAngle, "inGraphDataPaddingAngle", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							if (setOptionValue(false, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 1) labelRadius = dataCutoutRadius + setOptionValue(false, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							else if (setOptionValue(false, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 2) labelRadius = dataCutoutRadius + (dataDoughnutRadius - dataCutoutRadius) / 2 + setOptionValue(false, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							else if (setOptionValue(false, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", i, j, {
									nullValue: true
								}) == 3) labelRadius = dataDoughnutRadius + setOptionValue(false, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
								nullValue: true
							});
							ctx.save();
							if (setOptionValue(false, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
									nullValue: true
								}) == "off-center") {
								if (setOptionValue(false, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
										nullValue: true
									}) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) >= 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) <= Math.PI / 2) ctx.textAlign = "left";
								else ctx.textAlign = "right";
							} else if (setOptionValue(false, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
									nullValue: true
								}) == "to-center") {
								if (setOptionValue(false, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
										nullValue: true
									}) == "inRadiusAxis" || (posAngle + 2 * Math.PI) % (2 * Math.PI) >= 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) <= Math.PI / 2) ctx.textAlign = "right";
								else ctx.textAlign = "left";
							} else ctx.textAlign = setOptionValue(false, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
								nullValue: true
							});
							if (setOptionValue(false, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
									nullValue: true
								}) == "off-center") {
								if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "top";
								else ctx.textBaseline = "bottom";
							} else if (setOptionValue(false, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
									nullValue: true
								}) == "to-center") {
								if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI) ctx.textBaseline = "bottom";
								else ctx.textBaseline = "top";
							} else ctx.textBaseline = setOptionValue(false, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
								nullValue: true
							});
							ctx.font = setOptionValue(false, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
								nullValue: true
							}) + ' ' + setOptionValue(false, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}) + 'px ' + setOptionValue(false, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
								nullValue: true
							});
							ctx.fillStyle = setOptionValue(false, true, 1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, undefined, config.inGraphDataFontColor, "inGraphDataFontColor", i, j, {
								nullValue: true
							});
							var dispString = tmplbis(setOptionValue(false, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
								nullValue: true
							}), statData[i][j], config);
							ctx.translate(midPieX + labelRadius * Math.cos(posAngle), midPieY - labelRadius * Math.sin(posAngle));
							var rotateVal = 0;
							if (setOptionValue(false, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
									nullValue: true
								}) == "inRadiusAxis") rotateVal = 2 * Math.PI - posAngle;
							else if (setOptionValue(false, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
									nullValue: true
								}) == "inRadiusAxisRotateLabels") {
								if ((posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (posAngle + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2) rotateVal = 3 * Math.PI - posAngle;
								else rotateVal = 2 * Math.PI - posAngle;
							} else rotateVal = setOptionValue(false, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							ctx.rotate(rotateVal);
							setTextBordersAndBackground(ctx, dispString, setOptionValue(false, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), 0, 0, setOptionValue(false, true, 1, "INGRAPHDATABORDERS", ctx, data, statData, undefined, config.inGraphDataBorders, "inGraphDataBorders", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSELECTION", ctx, data, statData, undefined, config.inGraphDataBordersSelection, "inGraphDataBordersSelection", i, j, {
								nullValue: true
							}), setOptionValue(false, true, 1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, undefined, config.inGraphDataBordersColor, "inGraphDataBordersColor", i, j, {
								nullValue: true
							}), setOptionValue(false, true, ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, undefined, config.inGraphDataBordersWidth, "inGraphDataBordersWidth", i, j, {
								nullValue: true
							}), setOptionValue(false, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, undefined, config.inGraphDataBordersXSpace, "inGraphDataBordersXSpace", i, j, {
								nullValue: true
							}), setOptionValue(false, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, undefined, config.inGraphDataBordersYSpace, "inGraphDataBordersYSpace", i, j, {
								nullValue: true
							}), setOptionValue(false, true, 1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, undefined, config.inGraphDataBordersStyle, "inGraphDataBordersStyle", i, j, {
								nullValue: true
							}), setOptionValue(false, true, 1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, undefined, config.inGraphDataBackgroundColor, "inGraphDataBackgroundColor", i, j, {
								nullValue: true
							}), "INGRAPHDATA", config.inGraphDataBordersRadius);
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue(false, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), true, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, midPieX + labelRadius * Math.cos(posAngle), midPieY - labelRadius * Math.sin(posAngle), i, j);
							ctx.restore();
						}
					}
				}
			}
		};
		return {
			data: data,
			config: config,
			ctx: ctx
		};
	};
	var Bubble = function(data, config, ctx) {
		ctx.tpchart = "Line";
		ctx.tpchartSub = "Bubble";
		return (LineBubble(data, config, ctx, "Pie"));
	};
	var Line = function(data, config, ctx) {
		ctx.tpchart = "Line";
		ctx.tpchartSub = "Line";
		return (LineBubble(data, config, ctx, "Pie"));
	};
	var LineBubble = function(data, config, ctx) {
		var maxSize, scaleHop, scaleHop2, labelHeight, scaleHeight, labelTemplateString, labelTemplateString2;
		var valueHop, xAxisLength, yAxisPosX, xAxisPosY, rotateLabels = 0,
			msr;
		var zeroY = 0;
		var zeroY2 = 0;
		//		ctx.tpchart="Line";
		ctx.tpdata = 0;
		if (!init_and_start(ctx, data, config)) return;
		// adapt data when length is 1;
		var mxlgt = 0;
		for (var i = 0; i < data.datasets.length; i++) {
			mxlgt = Max([mxlgt, data.datasets[i].data.length]);
		}
		if (mxlgt == 1) {
			if (typeof(data.labels[0]) == "string") data.labels = ["", data.labels[0], ""];
			for (i = 0; i < data.datasets.length; i++) {
				if (typeof(data.datasets[i].data[0] != "undefined")) data.datasets[i].data = [undefined, data.datasets[i].data[0], undefined];
			}
			mxlgt = 3;
		}
		var statData = initPassVariableData_part1(data, config, ctx);
		init_result(ctx, data, statData);
		for (i = 0; i < data.datasets.length; i++) {
			if (ctx.tpchartSub == "Line" || data.datasets[i].type == "Line") statData[i][0].tpchart = "Line";
			else statData[i][0].tpchart = "Bubble";
		}
		msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, "nihil", "nihil", false, false, true, (ctx.tpchartSub == "Line" ? config.datasetFill : true), "Line");
		var scaleData = computeScale(true, true, false, true, true, false, data, config, ctx, statData, msr.availableHeight);
		scaleData.labels1 = [];
		scaleData.labels2 = [];
		populateLabels(scaleData.logarithm1, config.fmtYLabel, config, scaleData.labelTemplateString1, scaleData.labels1, scaleData.nbOfStepsAxis1, scaleData.minAxis1, scaleData.maxAxis1, scaleData.stepWidthAxis1);
		populateLabels(scaleData.logarithm2, config.fmtYLabel2, config, scaleData.labelTemplateString2, scaleData.labels2, scaleData.nbOfStepsAxis2, scaleData.minAxis2, scaleData.maxAxis2, scaleData.stepWidthAxis2);
		if (scaleData.maxSteps > 0 && scaleData.minSteps > 0) {
			var calculatedScale = {
				steps: scaleData.nbOfStepsAxis1,
				stepValue: scaleData.stepWidthAxis1,
				graphMin: scaleData.minAxis1,
				graphMax: scaleData.minAxis1 + scaleData.nbOfStepsAxis1 * scaleData.stepWidthAxis1,
				labels: scaleData.labels1
			};
			var calculatedScale2 = {
				steps: scaleData.nbOfStepsAxis2,
				stepValue: scaleData.stepWidthAxis2,
				graphMin: scaleData.minAxis2,
				graphMax: scaleData.minAxis2 + scaleData.nbOfStepsAxis2 * scaleData.stepWidthAxis2,
				labels: scaleData.labels2
			};
			msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, scaleData.labels1, scaleData.labels2, false, false, true, (ctx.tpchartSub == "Line" ? config.datasetFill : true), "Line");
			var prevHeight = msr.availableHeight;
			msr.availableHeight = msr.availableHeight - Math.ceil(ctx.chartLineScale * Math.max(config.scaleTickSizeBottom, config.scaleMinorTickSizeBottom * (config.scaleMinorTickHorizontalCount > 0))) - Math.ceil(ctx.chartLineScale * Math.max(config.scaleTickSizeTop, config.scaleMinorTickSizeTop * (config.scaleMinorTickHorizontalCount > 0)));
			msr.availableWidth = msr.availableWidth - Math.ceil(ctx.chartLineScale * Math.max(config.scaleTickSizeLeft, config.scaleMinorTickSizeLeft * (config.scaleMinorTickVerticalCount > 0))) - Math.ceil(ctx.chartLineScale * Math.max(config.scaleTickSizeRight, config.scaleMinorTickSizeRight * (config.scaleMinorTickVerticalCount > 0)));
			scaleHop = Math.floor(msr.availableHeight / scaleData.nbOfStepsAxis1);
			scaleHop2 = Math.floor(msr.availableHeight / scaleData.nbOfStepsAxis2);
			valueHop = Math.floor(msr.availableWidth / (data.labels.length - 1));
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / (data.labels.length - 1));
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - (data.labels.length - 1) * valueHop);
			msr.topNotUsableHeight += (msr.availableHeight - (scaleData.nbOfStepsAxis1) * scaleHop);
			msr.rightNotUsableWidth += (msr.availableWidth - (data.labels.length - 1) * valueHop);
			msr.availableWidth = (data.labels.length - 1) * valueHop;
			msr.availableHeight = (scaleData.nbOfStepsAxis1) * scaleHop;
			yAxisPosX = msr.leftNotUsableWidth + Math.ceil(ctx.chartLineScale * Math.max(config.scaleTickSizeLeft, config.scaleMinorTickSizeLeft * (config.scaleMinorTickVerticalCount > 0)));
			xAxisPosY = msr.topNotUsableHeight + msr.availableHeight + Math.ceil(ctx.chartLineScale * Math.max(config.scaleTickSizeTop, config.scaleMinorTickSizeTop * (config.scaleMinorTickHorizontalCount > 0)));
			zeroY = calculateOffset(scaleData.logarithm1, 0, calculatedScale, scaleHop);
			zeroY2 = calculateOffset(scaleData.logarithm2, 0, calculatedScale2, scaleHop2);
			initPassVariableData_part2(statData, data, config, ctx, scaleData.logarithm1, scaleData.logarithm2, {
				graphMin: calculatedScale.graphMin,
				graphMax: calculatedScale.graphMax,
				graphMin2: calculatedScale2.graphMin,
				graphMax2: calculatedScale2.graphMax,
				xAxisPosY: xAxisPosY,
				yAxisPosX: yAxisPosX,
				valueHop: valueHop,
				nbValueHop: data.labels.length - 1,
				scaleHop: scaleHop,
				zeroY: zeroY,
				calculatedScale: calculatedScale,
				logarithmic: scaleData.logarithm1,
				scaleHop2: scaleHop2,
				zeroY2: zeroY2,
				msr: msr,
				calculatedScale2: calculatedScale2,
				logarithmic2: scaleData.logarithm12
			});
			if (typeof config.beforeLabelsFunction == "function") config.beforeLabelsFunction("BEFORELABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			drawLabels();
			if (typeof config.afterLabelsFunction == "function") config.afterLabelsFunction("AFTERLABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			animationLoop(config, msr.legendMsr, drawScale, drawLines, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data, statData);
		} else {
			testRedraw(ctx, data, config);
			if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) {
				config.onAnimationComplete(ctx, config, data, 1, 0, statData);
				ctx.runanimationcompletefunction = false;
			}
			ctx.firstPass = 9;
			close_result(ctx);
		}

		function drawLines(animationDecimal) {
			switch (ctx.tpchartSub) {
				case "Bubble":
					//    			  drawLinesDataset(animanimationDecimal, data, config, ctx, statData,{xAxisPosY : xAxisPosY,yAxisPosX : yAxisPosX, valueHop : valueHop, nbValueHop : data.labels.length - 1 });
					drawBubblesDataset(animationDecimal, data, config, ctx, statData, {
						xAxisPosY: xAxisPosY,
						yAxisPosX: yAxisPosX,
						valueHop: valueHop,
						nbValueHop: data.labels.length - 1
					});
					drawLinesDataset(animationDecimal, data, config, ctx, statData, {
						xAxisPosY: xAxisPosY,
						yAxisPosX: yAxisPosX,
						valueHop: valueHop,
						nbValueHop: data.labels.length - 1
					});
					break;
				case "Line":
				default:
					drawLinesDataset(animationDecimal, data, config, ctx, statData, {
						xAxisPosY: xAxisPosY,
						yAxisPosX: yAxisPosX,
						valueHop: valueHop,
						nbValueHop: data.labels.length - 1
					});
					if (animationDecimal.animationGlobal >= 1) {
						if (typeof drawMath == "function") {
							drawMath(ctx, config, data, msr, {
								xAxisPosY: xAxisPosY,
								yAxisPosX: yAxisPosX,
								valueHop: valueHop,
								scaleHop: scaleHop,
								zeroY: zeroY,
								calculatedScale: calculatedScale,
								calculateOffset: calculateOffset,
								statData: statData
							});
						}
					}
					break;
			}
		};

		function drawScale() {
			drawGridScale(ctx, data, config, msr, yAxisPosX, xAxisPosY, zeroY, valueHop, scaleHop, scaleData.nbOfStepsAxis1, data.labels.length + 0);
		};

		function drawLabels() {
			var decal, subloop;
			ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
			//X Labels     
			if (config.xAxisTop || config.xAxisBottom) {
				ctx.textBaseline = "top";
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					if (msr.rotateLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
						//						ctx.textAlign = "right";
					} else if (msr.rotateLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					decal = 0;
					subloop = 0;
					if (config.xAxisMiddle == true) {
						decal = valueHop / 2;
						subloop = 1;
					}
					for (var i = 0; i < data.labels.length - subloop; i++) {
						if (showLabels(ctx, data, config, i)) {
							ctx.save();
							if (msr.rotateLabels > 0) {
								ctx.translate(yAxisPosX + i * valueHop - msr.highestXLabel / 2 + decal, msr.xLabelPos);
								ctx.rotate(-((msr.rotateLabels + 180 * (msr.rotateLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XSCALE_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + i * valueHop - msr.highestXLabel / 2 + decal, msr.xLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), yAxisPosX + i * valueHop + decal, msr.xLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XSCALE_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
				if (config.xAxisTop) {
					if (msr.rotateTLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
					} else if (msr.rotateTLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					var label;
					if (typeof data.labels2 == "object") label = data.labels2;
					else label = data.labels;
					decal = 0;
					subloop = 0;
					if (config.xAxisMiddle == true) {
						decal = valueHop / 2;
						subloop = 1;
					}
					for (var i = 0; i < label.length - subloop; i++) {
						if (showLabels(ctx, data, config, i)) {
							ctx.save();
							if (msr.rotateTLabels > 0) {
								ctx.translate(yAxisPosX + i * valueHop - msr.highestXLabel / 2 + decal, msr.xTLabelPos);
								ctx.rotate(-((msr.rotateTLabels + 180 * (msr.rotateTLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(fmtChartJS(config, label[i], config.fmtXLabel), 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XSCALE_TEXTMOUSE", -(msr.rotateTLabels * (Math.PI / 180)), yAxisPosX + i * valueHop - msr.highestXLabel / 2, msr.xTLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(fmtChartJS(config, label[i], config.fmtXLabel), yAxisPosX + i * valueHop, msr.xTLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XSCALE_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
			}
			//Y Labels
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			decal = 0;
			subloop = 0;
			if (config.yAxisMiddle == true) {
				decal = scaleHop / 2;
				subloop = 1;
			}
			for (var j = ((config.showYAxisMin) ? -1 : 0); j < scaleData.nbOfStepsAxis1 - subloop; j++) {
				if (config.scaleShowLabels) {
					if (showYLabels(ctx, data, config, j + 1, scaleData.labels1[j + 1])) {
						if (config.yAxisLeft) {
							ctx.textAlign = "right";
							ctx.fillTextMultiLine(scaleData.labels1[j + 1], yAxisPosX - (Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - ((j + 1) * scaleHop) - decal, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
						}
						if (config.yAxisRight && !(scaleData.dbAxis || config.forceSecondScale)) {
							ctx.textAlign = "left";
							ctx.fillTextMultiLine(scaleData.labels1[j + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - ((j + 1) * scaleHop) - decal, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
						}
					}
				}
			}
			if (config.yAxisRight && (scaleData.dbAxis || config.forceSecondScale)) {
				for (j = ((config.showYAxisMin) ? -1 : 0); j < scaleData.nbOfStepsAxis2; j++) {
					if (config.scaleShowLabels) {
						ctx.textAlign = "left";
						ctx.fillTextMultiLine(scaleData.labels2[j + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - ((j + 1) * scaleHop2), ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
					}
				}
			}
		};
		return {
			data: data,
			config: config,
			ctx: ctx
		};
	};
	var StackedBar = function(data, config, ctx) {
		var maxSize, scaleHop, scaleHop2, labelHeight, scaleHeight, labelTemplateString, valueHop, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0,
			msr;
		ctx.tpchart = "StackedBar";
		ctx.tpchartSub = "StackedBar";
		ctx.tpdata = 0;
		if (!init_and_start(ctx, data, config)) return;
		var statData = initPassVariableData_part1(data, config, ctx);
		init_result(ctx, data, statData);
		var nrOfBars = data.datasets.length;
		for (var i = 0; i < data.datasets.length; i++) {
			if (data.datasets[i].type == "Line") {
				statData[i][0].tpchart = "Line";
				nrOfBars--;
			} else statData[i][0].tpchart = "Bar";
		}
		msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, "nihil", "nihil", true, false, true, true, "StackedBar");
		var scaleData = computeScale(false, true, true, false, true, true, data, config, ctx, statData, msr.availableHeight);
		scaleData.labels1 = [];
		scaleData.labels2 = [];
		populateLabels(scaleData.logarithm1, config.fmtYLabel, config, scaleData.labelTemplateString1, scaleData.labels1, scaleData.nbOfStepsAxis1, scaleData.minAxis1, scaleData.maxAxis1, scaleData.stepWidthAxis1);
		populateLabels(scaleData.logarithm2, config.fmtYLabel2, config, scaleData.labelTemplateString2, scaleData.labels2, scaleData.nbOfStepsAxis2, scaleData.minAxis2, scaleData.maxAxis2, scaleData.stepWidthAxis2);
		if (scaleData.maxSteps > 0 && scaleData.minSteps > 0) {
			var calculatedScale = {
				steps: scaleData.nbOfStepsAxis1,
				stepValue: scaleData.stepWidthAxis1,
				graphMin: scaleData.minAxis1,
				graphMax: scaleData.minAxis1 + scaleData.nbOfStepsAxis1 * scaleData.stepWidthAxis1,
				labels: scaleData.labels1
			};
			var calculatedScale2 = {
				steps: scaleData.nbOfStepsAxis2,
				stepValue: scaleData.stepWidthAxis2,
				graphMin: scaleData.minAxis2,
				graphMax: scaleData.minAxis2 + scaleData.nbOfStepsAxis2 * scaleData.stepWidthAxis2,
				labels: scaleData.labels2
			};
			msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, scaleData.labels1, scaleData.labels2, true, false, true, true, "StackedBar");
			var prevHeight = msr.availableHeight;
			msr.availableHeight = msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
			msr.availableWidth = msr.availableWidth - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight);
			scaleHop = Math.floor(msr.availableHeight / scaleData.nbOfStepsAxis1);
			scaleHop2 = Math.floor(msr.availableHeight / scaleData.nbOfStepsAxis2);
			valueHop = Math.floor(msr.availableWidth / (data.labels.length));
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / data.labels.length);
			msr.topNotUsableHeight += (msr.availableHeight - (scaleData.nbOfStepsAxis1) * scaleHop);
			msr.rightNotUsableWidth += (msr.availableWidth - (data.labels.length) * valueHop);
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - ((data.labels.length) * valueHop));
			msr.availableWidth = (data.labels.length) * valueHop;
			msr.availableHeight = (scaleData.nbOfStepsAxis1) * scaleHop;
			yAxisPosX = msr.leftNotUsableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft);
			xAxisPosY = msr.topNotUsableHeight + msr.availableHeight + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
			barWidth = (valueHop - Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth) * 2 - (Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) * 2) - (Math.ceil(ctx.chartSpaceScale * config.barDatasetSpacing) * 1 - 1) - (Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2) - 1);
			if (barWidth >= 0 && barWidth <= 1) barWidth = 1;
			if (barWidth < 0 && barWidth >= -1) barWidth = -1;
			var additionalSpaceBetweenBars;
			if (1 * config.maxBarWidth > 0 && barWidth > 1 * config.maxBarWidth) {
				additionalSpaceBetweenBars = (barWidth - 1 * config.maxBarWidth) / 2;
				barWidth = 1 * config.maxBarWidth;
			} else additionalSpaceBetweenBars = 0;
			var zeroY = 0;
			var zeroY2 = 0;
			zeroY = calculateOffset(scaleData.logarithm1, 0, calculatedScale, scaleHop);
			zeroY2 = calculateOffset(scaleData.logarithm2, 0, calculatedScale2, scaleHop2);
			initPassVariableData_part2(statData, data, config, ctx, scaleData.logarithm1, scaleData.logarithm2, {
				graphMin: calculatedScale.graphMin,
				graphMax: calculatedScale.graphMax,
				graphMin2: calculatedScale2.graphMin,
				graphMax2: calculatedScale2.graphMax,
				msr: msr,
				zeroY: zeroY,
				zeroY2: zeroY2,
				logarithmic: false,
				logarithmic2: false,
				calculatedScale: calculatedScale,
				calculatedScale2: calculatedScale2,
				additionalSpaceBetweenBars: additionalSpaceBetweenBars,
				scaleHop: scaleHop,
				scaleHop2: scaleHop2,
				valueHop: valueHop,
				yAxisPosX: yAxisPosX,
				xAxisPosY: xAxisPosY,
				barWidth: barWidth
			});
			if (typeof config.beforeLabelsFunction == "function") config.beforeLabelsFunction("BEFORELABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			drawLabels();
			if (typeof config.afterLabelsFunction == "function") config.afterLabelsFunction("AFTERLABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			animationLoop(config, msr.legendMsr, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data, statData);
		} else {
			testRedraw(ctx, data, config);
			if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) {
				config.onAnimationComplete(ctx, config, data, 1, 0, statData);
				ctx.runanimationcompletefunction = false;
			}
			ctx.firstPass = 9;
			close_result(ctx);
		}

		function drawBars(animationDecimal) {
			var prevTopPos = new Array();
			var prevTopNeg = new Array();
			var correctedAnimationDecimal;
			for (var i = 0; i < data.datasets.length; i++) {
				if (data.datasets[i].type == "Line") continue;
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "STACKEDBAR");
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
							nullvalue: null
						}) == false) continue;
					var currentAnimPc = correctedAnimationDecimal.yAxis;
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					if ((typeof data.datasets[i].data[j] == 'undefined') || 1 * data.datasets[i].data[j] == 0) continue;
					if (Math.abs(data.datasets[i].data[j]) < config.zeroValue && config.showZeroValue == false) continue;
					if (typeof prevTopPos[j] == "undefined") {
						prevTopPos[j] = statData[statData[i][j].firstNotMissing][j].yPosBottom;
						prevTopNeg[j] = statData[statData[i][j].firstNotMissing][j].yPosBottom;
					}
					var botBar, topBar;
					if (1 * data.datasets[i].data[j] > 0) botBar = prevTopPos[j];
					else botBar = prevTopNeg[j];
					topBar = botBar + currentAnimPc * (statData[i][j].yPosTop - statData[i][j].yPosBottom);
					if (1 * data.datasets[i].data[j] > 0) prevTopPos[j] = topBar;
					else prevTopNeg[j] = topBar;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) continue;
					ctx.save();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, true, 1, "BARSTROKEWIDTH", ctx, data, statData, data.datasets[i].barStrokeWidth, config.barStrokeWidth, "barStrokeWidth", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: statData[i][j].xPosLeft,
						yPosBottom: botBar,
						xPosRight: statData[i][j].xPosRight,
						yPosTop: topBar
					}));
					ctx.fillStyle = setOptionValue(true, true, 1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: statData[i][j].xPosLeft,
						yPosBottom: botBar,
						xPosRight: statData[i][j].xPosRight,
						yPosTop: topBar
					});
					ctx.strokeStyle = setOptionValue(true, true, 1, "STROKECOLOR", ctx, data, statData, data.datasets[i].strokeColor, config.defaultStrokeColor, "strokeColor", i, j, {
						nullvalue: null
					});
					if (currentAnimPc != 0 && botBar != topBar) {
						ctx.beginPath();
						ctx.moveTo(statData[i][j].xPosLeft, botBar + (topBar - botBar) / 2);
						ctx.lineTo(statData[i][j].xPosLeft, topBar);
						ctx.lineTo(statData[i][j].xPosRight, topBar);
						ctx.lineTo(statData[i][j].xPosRight, botBar);
						ctx.lineTo(statData[i][j].xPosLeft, botBar);
						ctx.lineTo(statData[i][j].xPosLeft, botBar + (topBar - botBar) / 2);
						if (config.barShowStroke) {
							ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "STROKESTYLE", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
								nullvalue: null
							})));
							ctx.stroke();
							ctx.setLineDash([]);
						};
						ctx.closePath();
						ctx.fill();
					}
					if (animationDecimal.animationGlobal >= config.animationStopValue) {
						ctx.pieces_drawn.rectangles++;
						ctx.pieces_drawn.total_drawn++;
					}
					ctx.restore();
				}
			}
			drawLinesDataset(animationDecimal, data, config, ctx, statData, {
				xAxisPosY: xAxisPosY,
				yAxisPosX: yAxisPosX,
				valueHop: valueHop,
				nbValueHop: data.labels.length
			});
			if (animationDecimal.animationGlobal >= config.animationStopValue) {
				var yPos = 0,
					xPos = 0;
				for (i = 0; i < data.datasets.length; i++) {
					for (j = 0; j < data.datasets[i].data.length; j++) {
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
								nullvalue: null
							}) == false) continue;
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
								nullvalue: null
							}) == false) continue;
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["RECT", i, j, statData, setOptionValue(true, true, 1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, "annotateDisplay", i, j, {
							nullValue: true
						})];
						if (setOptionValue(true, true, 1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, "inGraphDataShow", i, j, {
								nullValue: true
							})) {
							ctx.save();
							ctx.textAlign = setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
								nullValue: true
							});
							ctx.textBaseline = setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
								nullValue: true
							});
							ctx.font = setOptionValue(true, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
								nullValue: true
							}) + ' ' + setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}) + 'px ' + setOptionValue(true, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
								nullValue: true
							});
							ctx.fillStyle = setOptionValue(true, true, 1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, undefined, config.inGraphDataFontColor, "inGraphDataFontColor", i, j, {
								nullValue: true
							});
							var dispString = tmplbis(setOptionValue(true, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
								nullValue: true
							}), statData[i][j], config);
							ctx.beginPath();
							ctx.beginPath();
							yPos = 0;
							xPos = 0;
							if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 1) {
								xPos = statData[i][j].xPosLeft + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 2) {
								xPos = statData[i][j].xPosLeft + barWidth / 2 + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 3) {
								xPos = statData[i][j].xPosLeft + barWidth + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							}
							if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 1) {
								yPos = statData[i][j].yPosBottom - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 2) {
								yPos = (statData[i][j].yPosTop + statData[i][j].yPosBottom) / 2 - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 3) {
								yPos = statData[i][j].yPosTop - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							}
							if (yPos > msr.topNotUsableHeight) {
								ctx.translate(xPos, yPos);
								var rotateVal = setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
									nullValue: true
								}) * (Math.PI / 180);
								ctx.rotate(rotateVal);
								setTextBordersAndBackground(ctx, dispString, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
									nullValue: true
								}), 0, 0, setOptionValue(true, true, 1, "INGRAPHDATABORDERS", ctx, data, statData, undefined, config.inGraphDataBorders, "inGraphDataBorders", i, j, {
									nullValue: true
								}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSELECTION", ctx, data, statData, undefined, config.inGraphDataBordersSelection, "inGraphDataBordersSelection", i, j, {
									nullValue: true
								}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, undefined, config.inGraphDataBordersColor, "inGraphDataBordersColor", i, j, {
									nullValue: true
								}), setOptionValue(true, true, ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, undefined, config.inGraphDataBordersWidth, "inGraphDataBordersWidth", i, j, {
									nullValue: true
								}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, undefined, config.inGraphDataBordersXSpace, "inGraphDataBordersXSpace", i, j, {
									nullValue: true
								}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, undefined, config.inGraphDataBordersYSpace, "inGraphDataBordersYSpace", i, j, {
									nullValue: true
								}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, undefined, config.inGraphDataBordersStyle, "inGraphDataBordersStyle", i, j, {
									nullValue: true
								}), setOptionValue(true, true, 1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, undefined, config.inGraphDataBackgroundColor, "inGraphDataBackgroundColor", i, j, {
									nullValue: true
								}), "INGRAPHDATA", config.inGraphDataBordersRadius);
								ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
									nullValue: true
								}), true, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, xPos, yPos, i, j);
							}
							ctx.restore();
						}
					}
				}
			}
		};

		function drawScale() {
			drawGridScale(ctx, data, config, msr, yAxisPosX, xAxisPosY, zeroY, valueHop, scaleHop, scaleData.nbOfStepsAxis1, data.labels.length + 1);
		};

		function drawLabels() {
			ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
			//X axis labels                                                          
			if (config.xAxisTop || config.xAxisBottom) {
				ctx.textBaseline = "top";
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					if (msr.rotateLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
					} else if (msr.rotateLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					for (var i = 0; i < data.labels.length; i++) {
						if (showLabels(ctx, data, config, i)) {
							ctx.save();
							if (msr.rotateLabels > 0) {
								ctx.translate(yAxisPosX + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) + i * valueHop + additionalSpaceBetweenBars + (barWidth / 2) - msr.highestXLabel / 2, msr.xLabelPos);
								ctx.rotate(-((msr.rotateLabels + 180 * (msr.rotateLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) + i * valueHop + additionalSpaceBetweenBars + (barWidth / 2) - msr.highestXLabel / 2, msr.xLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), yAxisPosX + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) + i * valueHop + additionalSpaceBetweenBars + (barWidth / 2), msr.xLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
				if (config.xAxisTop) {
					if (msr.rotateTLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
					} else if (msr.rotateTLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					var label;
					if (typeof data.labels2 == "object") label = data.labels2;
					else label = data.labels;
					for (var i = 0; i < label.length; i++) {
						if (showLabels(ctx, data, config, i)) {
							ctx.save();
							if (msr.rotateTLabels > 0) {
								ctx.translate(yAxisPosX + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) + i * valueHop + additionalSpaceBetweenBars + (barWidth / 2) - msr.highestTXLabel / 2, msr.xTLabelPos);
								ctx.rotate(-((msr.rotateTLabels + 180 * (msr.rotateTLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(fmtChartJS(config, label[i], config.fmtXLabel), 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) + i * valueHop + additionalSpaceBetweenBars + (barWidth / 2) - msr.highestXLabel / 2, msr.xLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(fmtChartJS(config, label[i], config.fmtXLabel), yAxisPosX + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) + i * valueHop + additionalSpaceBetweenBars + (barWidth / 2), msr.xTLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
			}
			//Y axis
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			subloop = 0;
			decal = 0;
			if (config.yAxisMiddle == true) {
				decal = scaleHop / 2;
				subloop = 1;
			}
			for (var j = ((config.showYAxisMin) ? -1 : 0); j < scaleData.nbOfStepsAxis1 - subloop; j++) {
				if (config.scaleShowLabels) {
					if (showYLabels(ctx, data, config, j + 1, scaleData.labels1[j + 1])) {
						if (config.yAxisLeft) {
							ctx.textAlign = "right";
							ctx.fillTextMultiLine(scaleData.labels1[j + 1], yAxisPosX - (Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - ((j + 1) * scaleHop) - decal, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
						}
						if (config.yAxisRight && !(scaleData.dbAxis || config.forceSecondScale)) {
							ctx.textAlign = "left";
							ctx.fillTextMultiLine(scaleData.labels1[j + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - ((j + 1) * scaleHop) - decal, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
						}
					}
				}
			}
			if (config.yAxisRight && (scaleData.dbAxis || config.forceSecondScale)) {
				subloop = 0;
				decal = 0;
				if (config.yAxisMiddle == true) {
					decal = valueHop / 2;
					subloop = 1;
				}
				for (j = ((config.showYAxisMin) ? -1 : 0); j < scaleData.nbOfStepsAxis2 - subloop; j++) {
					if (config.scaleShowLabels) {
						ctx.textAlign = "left";
						ctx.fillTextMultiLine(scaleData.labels2[j + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - ((j + 1) * scaleHop2) - decal, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
					}
				}
			}
		};
		return {
			data: data,
			config: config,
			ctx: ctx
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
		var maxSize, scaleHop, labelHeight, scaleHeight, labelTemplateString, valueHop, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0,
			msr;
		if (config.reverseOrder && typeof ctx.reversed == "undefined") {
			ctx.reversed = true;
			data = reverseData(data);
		}
		ctx.tpchart = "HorizontalStackedBar";
		ctx.tpchartSub = "HorizontalStackedBar";
		ctx.tpdata = 0;
		if (!init_and_start(ctx, data, config)) return;
		var statData = initPassVariableData_part1(data, config, ctx);
		init_result(ctx, data, statData);
		msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, "nihil", "nihil", true, true, true, true, "HorizontalStackedBar");
		var scaleData = computeScale(false, true, false, false, true, true, data, config, ctx, statData, msr.availableHeight);
		scaleData.labels1 = [];
		scaleData.labels2 = [];
		populateLabels(scaleData.logarithm1, config.fmtYLabel, config, scaleData.labelTemplateString1, scaleData.labels1, scaleData.nbOfStepsAxis1, scaleData.minAxis1, scaleData.maxAxis1, scaleData.stepWidthAxis1);
		populateLabels(scaleData.logarithm2, config.fmtYLabel2, config, scaleData.labelTemplateString2, scaleData.labels2, scaleData.nbOfStepsAxis2, scaleData.minAxis2, scaleData.maxAxis2, scaleData.stepWidthAxis2);
		if (scaleData.maxSteps > 0 && scaleData.minSteps > 0) {
			var calculatedScale = {
				steps: scaleData.nbOfStepsAxis1,
				stepValue: scaleData.stepWidthAxis1,
				graphMin: scaleData.minAxis1,
				graphMax: scaleData.minAxis1 + scaleData.nbOfStepsAxis1 * scaleData.stepWidthAxis1,
				labels: scaleData.labels1
			};
			msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, scaleData.labels1, scaleData.labels2, true, true, true, true, "HorizontalStackedBar");
			msr.availableHeight = msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
			msr.availableWidth = msr.availableWidth - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight);
			scaleHop = Math.floor(msr.availableHeight / data.labels.length);
			valueHop = Math.floor(msr.availableWidth / (scaleData.nbOfStepsAxis1));
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / (scaleData.nbOfStepsAxis1));
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - (scaleData.nbOfStepsAxis1 * valueHop));
			msr.topNotUsableHeight += (msr.availableHeight - data.labels.length * scaleHop);
			msr.rightNotUsableWidth += (msr.availableWidth - scaleData.nbOfStepsAxis1 * valueHop);
			msr.availableWidth = scaleData.nbOfStepsAxis1 * valueHop;
			msr.availableHeight = data.labels.length * scaleHop;
			yAxisPosX = msr.leftNotUsableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft);
			xAxisPosY = msr.topNotUsableHeight + msr.availableHeight + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
			barWidth = (scaleHop - Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth) * 2 - (Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) * 2) - (Math.ceil(ctx.chartSpaceScale * config.barDatasetSpacing) * 1 - 1) - (Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2) - 1);
			if (barWidth >= 0 && barWidth <= 1) barWidth = 1;
			if (barWidth < 0 && barWidth >= -1) barWidth = -1;
			var additionalSpaceBetweenBars;
			if (1 * config.maxBarWidth > 0 && barWidth > 1 * config.maxBarWidth) {
				additionalSpaceBetweenBars = (barWidth - 1 * config.maxBarWidth) / 2;
				barWidth = 1 * config.maxBarWidth;
			} else additionalSpaceBetweenBars = 0;
			var zeroY = HorizontalCalculateOffset(0, calculatedScale, scaleHop);
			initPassVariableData_part2(statData, data, config, ctx, scaleData.logarithm1, scaleData.logarithm2, {
				graphMin: calculatedScale.graphMin,
				graphMax: calculatedScale.graphMax,
				yAxisPosX: yAxisPosX,
				additionalSpaceBetweenBars: additionalSpaceBetweenBars,
				xAxisPosY: xAxisPosY,
				barWidth: barWidth,
				zeroY: zeroY,
				scaleHop: scaleHop,
				valueHop: valueHop,
				calculatedScale: calculatedScale
			});
			if (typeof config.beforeLabelsFunction == "function") config.beforeLabelsFunction("BEFORELABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			drawLabels();
			if (typeof config.afterLabelsFunction == "function") config.afterLabelsFunction("AFTERLABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			animationLoop(config, msr.legendMsr, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data, statData);
		} else {
			testRedraw(ctx, data, config);
			if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) {
				config.onAnimationComplete(ctx, config, data, 1, 0, statData);
				ctx.runanimationcompletefunction = false;
			}
			ctx.firstPass = 9;
			close_result(ctx);
		}

		function HorizontalCalculateOffset(val, calculatedScale, scaleHop) {
			var outerValue = scaleData.nbOfStepsAxis1 * scaleData.stepWidthAxis1;
			var adjustedValue = val - scaleData.minAxis1;
			var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
			return (scaleHop * scaleData.nbOfStepsAxis1) * scalingFactor;
		};

		function drawBars(animationDecimal) {
			var prevLeftPos = new Array();
			var prevLeftNeg = new Array();
			var correctedAnimationDecimal;
			for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "HORIZONTALSTACKEDBAR");
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
							nullvalue: null
						}) == false) continue;
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, true, 1, "BARSTROKEWIDTH", ctx, data, statData, data.datasets[i].barStrokeWidth, config.barStrokeWidth, "barStrokeWidth", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: leftBar,
						yPosBottom: statData[i][j].yPosBottom,
						xPosRight: rightBar,
						yPosTop: statData[i][j].yPosBottom
					}));
					var currentAnimPc = correctedAnimationDecimal.yAxis
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					if ((typeof(data.datasets[i].data[j]) == 'undefined') || 1 * data.datasets[i].data[j] == 0) continue;
					if (Math.abs(data.datasets[i].data[j]) < config.zeroValue && config.showZeroValue == false) continue;
					if (typeof prevLeftPos[j] == "undefined") {
						prevLeftPos[j] = statData[statData[i][j].firstNotMissing][j].xPosLeft;
						prevLeftNeg[j] = statData[statData[i][j].firstNotMissing][j].xPosLeft;
					}
					var leftBar, rightBar;
					if (1 * data.datasets[i].data[j] > 0) leftBar = prevLeftPos[j];
					else leftBar = prevLeftNeg[j];
					rightBar = leftBar + currentAnimPc * (statData[i][j].xPosRight - statData[i][j].xPosLeft);
					if (1 * data.datasets[i].data[j] > 0) prevLeftPos[j] = rightBar;
					else prevLeftNeg[j] = rightBar;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) continue;
					ctx.fillStyle = setOptionValue(true, true, 1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: leftBar,
						yPosBottom: statData[i][j].yPosBottom,
						xPosRight: rightBar,
						yPosTop: statData[i][j].yPosBottom
					});
					ctx.strokeStyle = setOptionValue(true, true, 1, "STROKECOLOR", ctx, data, statData, data.datasets[i].strokeColor, config.defaultStrokeColor, "strokeColor", i, j, {
						nullvalue: null
					});
					if (currentAnimPc != 0 && statData[i][j].xPosLeft != statData[i][j].xPosRight) {
						ctx.beginPath();
						ctx.moveTo(leftBar + (rightBar - leftBar) / 2, statData[i][j].yPosTop);
						ctx.lineTo(rightBar, statData[i][j].yPosTop);
						ctx.lineTo(rightBar, statData[i][j].yPosBottom);
						ctx.lineTo(leftBar, statData[i][j].yPosBottom);
						ctx.lineTo(leftBar, statData[i][j].yPosTop);
						ctx.lineTo(leftBar + (rightBar - leftBar) / 2, statData[i][j].yPosTop);
						if (config.barShowStroke) {
							ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "STROKESTYLE", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
								nullvalue: null
							})));
							ctx.stroke();
							ctx.setLineDash([]);
						}
						ctx.closePath();
						ctx.fill();
					}
					if (animationDecimal.animationGlobal >= config.animationStopValue) {
						ctx.pieces_drawn.rectangles++;
						ctx.pieces_drawn.total_drawn++;
					}
				}
			}
			if (animationDecimal.animationGlobal >= config.animationStopValue) {
				var yPos = 0,
					xPos = 0;
				for (i = 0; i < data.datasets.length; i++) {
					for (j = 0; j < data.datasets[i].data.length; j++) {
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
								nullvalue: null
							}) == false) continue;
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
								nullvalue: null
							}) == false) continue;
						if ((typeof(data.datasets[i].data[j]) == 'undefined')) continue;
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["RECT", i, j, statData, setOptionValue(true, true, 1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, "annotateDisplay", i, j, {
							nullValue: true
						})];
						if (setOptionValue(true, true, 1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, "inGraphDataShow", i, j, {
								nullValue: true
							})) {
							ctx.save();
							ctx.textAlign = setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
								nullValue: true
							});
							ctx.textBaseline = setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
								nullValue: true
							});
							ctx.font = setOptionValue(true, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
								nullValue: true
							}) + ' ' + setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}) + 'px ' + setOptionValue(true, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
								nullValue: true
							});
							ctx.fillStyle = setOptionValue(true, true, 1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, undefined, config.inGraphDataFontColor, "inGraphDataFontColor", i, j, {
								nullValue: true
							});
							var dispString = tmplbis(setOptionValue(true, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
								nullValue: true
							}), statData[i][j], config);
							ctx.beginPath();
							yPos = 0;
							xPos = 0;
							if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 1) {
								xPos = statData[i][j].xPosLeft + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 2) {
								xPos = statData[i][j].xPosLeft + (statData[i][j].xPosRight - statData[i][j].xPosLeft) / 2 + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 3) {
								xPos = statData[i][j].xPosRight + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							}
							if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 1) {
								yPos = statData[i][j].yPosBottom - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 2) {
								yPos = statData[i][j].yPosBottom - barWidth / 2 - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 3) {
								yPos = statData[i][j].yPosTop - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							}
							ctx.translate(xPos, yPos);
							rotateVal = setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							ctx.rotate(rotateVal);
							setTextBordersAndBackground(ctx, dispString, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), 0, 0, setOptionValue(true, true, 1, "INGRAPHDATABORDERS", ctx, data, statData, undefined, config.inGraphDataBorders, "inGraphDataBorders", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSELECTION", ctx, data, statData, undefined, config.inGraphDataBordersSelection, "inGraphDataBordersSelection", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, undefined, config.inGraphDataBordersColor, "inGraphDataBordersColor", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, undefined, config.inGraphDataBordersWidth, "inGraphDataBordersWidth", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, undefined, config.inGraphDataBordersXSpace, "inGraphDataBordersXSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, undefined, config.inGraphDataBordersYSpace, "inGraphDataBordersYSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, undefined, config.inGraphDataBordersStyle, "inGraphDataBordersStyle", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, undefined, config.inGraphDataBackgroundColor, "inGraphDataBackgroundColor", i, j, {
								nullValue: true
							}), "INGRAPHDATA", config.inGraphDataBordersRadius);
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), true, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, xPos, yPos, i, j);
							ctx.restore();
						}
					}
				}
			}
		};

		function drawScale() {
			drawGridScale(ctx, data, config, msr, yAxisPosX, xAxisPosY, zeroY, valueHop, scaleHop, data.labels.length + 0, scaleData.nbOfStepsAxis1 + 1);
		};

		function drawLabels() {
			ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
			//X axis line                                                          
			if (config.scaleShowLabels && (config.xAxisTop || config.xAxisBottom)) {
				ctx.textBaseline = "top";
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					if (msr.rotateLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
					} else if (msr.rotateLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					subloop = 0;
					decal = 0;
					if (config.yAxisMiddle == true) {
						decal = valueHop / 2;
						subloop = 1;
					}
					for (var i = ((config.showYAxisMin) ? -1 : 0); i < scaleData.nbOfStepsAxis1 - subloop; i++) {
						if (showYLabels(ctx, data, config, i + 1, scaleData.labels1[i + 1])) {
							ctx.save();
							if (msr.rotateLabels > 0) {
								ctx.translate(yAxisPosX + (i + 1) * valueHop - msr.highestXLabel / 2 + decal, msr.xLabelPos);
								ctx.rotate(-((msr.rotateLabels + 180 * (msr.rotateLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(scaleData.labels1[i + 1], 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + (i + 1) * valueHop - msr.highestXLabel / 2, msr.xLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(scaleData.labels1[i + 1], yAxisPosX + ((i + 1) * valueHop) + decal, msr.xLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
				if (config.xAxisTop) {
					if (msr.rotateTLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
					} else if (msr.rotateTLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					subloop = 0;
					decal = 0;
					if (config.yAxisMiddle == true) {
						decal = valueHop / 2;
						subloop = 1;
					}
					for (var i = ((config.showYAxisMin) ? -1 : 0); i < scaleData.nbOfStepsAxis1 - subloop; i++) {
						if (showYLabels(ctx, data, config, i + 1, scaleData.labels1[i + 1])) {
							ctx.save();
							if (msr.rotateTLabels > 0) {
								ctx.translate(yAxisPosX + (i + 1) * valueHop - msr.highestTXLabel / 2 + decal, msr.xTLabelPos);
								ctx.rotate(-((msr.rotateTLabels + 180 * (msr.rotateTLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(scaleData.labels1[i + 1], 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + (i + 1) * valueHop - msr.highestXLabel / 2, msr.xLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(scaleData.labels1[i + 1], yAxisPosX + ((i + 1) * valueHop) + decal, msr.xTLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
			}
			//Y axis
			for (var j = 0; j < data.labels.length; j++) {
				if (showLabels(ctx, data, config, j)) {
					if (config.yAxisLeft) {
						ctx.textAlign = "right";
						ctx.textBaseline = "middle";
						ctx.fillTextMultiLine(fmtChartJS(config, data.labels[j], config.fmtXLabel), yAxisPosX - (Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) - scaleHop * (j + 1) + additionalSpaceBetweenBars + barWidth / 2, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
					}
					if (config.yAxisRight) {
						ctx.textAlign = "left";
						ctx.textBaseline = "middle";
						ctx.fillTextMultiLine(fmtChartJS(config, data.labels[j], config.fmtXLabel), yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) - scaleHop * (j + 1) + additionalSpaceBetweenBars + barWidth / 2, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
					}
				}
			}
		};
		return {
			data: data,
			config: config,
			ctx: ctx
		};
	};
	var Bar = function(data, config, ctx) {
		var maxSize, scaleHop, scaleHop2, labelHeight, scaleHeight, labelTemplateString, labelTemplateString2, valueHop, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0,
			msr;
		ctx.tpchart = "Bar";
		ctx.tpchartSub = "Bar";
		ctx.tpdata = 0;
		if (!init_and_start(ctx, data, config)) return;
		var statData = initPassVariableData_part1(data, config, ctx);
		init_result(ctx, data, statData);
		var nrOfBars = data.datasets.length;
		for (var i = 0; i < data.datasets.length; i++) {
			if (data.datasets[i].type == "Line") {
				statData[i][0].tpchart = "Line";
				nrOfBars--;
			} else statData[i][0].tpchart = "Bar";
		}
		// change the order (at first all bars then the lines) (form of BubbleSort)
		var bufferDataset, l = 0;
		msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, "nihil", "nihil", true, false, true, true, "Bar");
		var scaleData = computeScale(true, true, true, true, true, false, data, config, ctx, statData, msr.availableHeight);
		scaleData.labels1 = [];
		scaleData.labels2 = [];
		populateLabels(scaleData.logarithm1, config.fmtYLabel, config, scaleData.labelTemplateString1, scaleData.labels1, scaleData.nbOfStepsAxis1, scaleData.minAxis1, scaleData.maxAxis1, scaleData.stepWidthAxis1);
		populateLabels(scaleData.logarithm2, config.fmtYLabel2, config, scaleData.labelTemplateString2, scaleData.labels2, scaleData.nbOfStepsAxis2, scaleData.minAxis2, scaleData.maxAxis2, scaleData.stepWidthAxis2);
		if (scaleData.maxSteps > 0 && scaleData.minSteps > 0) {
			var calculatedScale = {
				steps: scaleData.nbOfStepsAxis1,
				stepValue: scaleData.stepWidthAxis1,
				graphMin: scaleData.minAxis1,
				graphMax: scaleData.minAxis1 + scaleData.nbOfStepsAxis1 * scaleData.stepWidthAxis1,
				labels: scaleData.labels1
			};
			var calculatedScale2 = {
				steps: scaleData.nbOfStepsAxis2,
				stepValue: scaleData.stepWidthAxis2,
				graphMin: scaleData.minAxis2,
				graphMax: scaleData.minAxis2 + scaleData.nbOfStepsAxis2 * scaleData.stepWidthAxis2,
				labels: scaleData.labels2
			};
			msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, scaleData.labels1, scaleData.labels2, true, false, true, true, "Bar");
			var prevHeight = msr.availableHeight;
			msr.availableHeight = msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
			msr.availableWidth = msr.availableWidth - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight);
			scaleHop = Math.floor(msr.availableHeight / scaleData.nbOfStepsAxis1);
			if (scaleData.nbOfStepsAxis2 != "undefined" && scaleData.nbOfStepsAxis2 > 0) scaleHop2 = Math.floor(msr.availableHeight / scaleData.nbOfStepsAxis2);
			valueHop = Math.floor(msr.availableWidth / data.labels.length);
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / data.labels.length);
			msr.topNotUsableHeight += (msr.availableHeight - (scaleData.nbOfStepsAxis1) * scaleHop);
			msr.rightNotUsableWidth += (msr.availableWidth - (data.labels.length) * valueHop);
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - ((data.labels.length) * valueHop));
			msr.availableWidth = (data.labels.length) * valueHop;
			msr.availableHeight = (scaleData.nbOfStepsAxis1) * scaleHop;
			yAxisPosX = msr.leftNotUsableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft);
			xAxisPosY = msr.topNotUsableHeight + msr.availableHeight + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
			barWidth = (valueHop - Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth) * 2 - (Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) * 2) - (Math.ceil(ctx.chartSpaceScale * config.barDatasetSpacing) * nrOfBars - 1) - ((Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2) * nrOfBars - 1)) / nrOfBars;
			if (barWidth >= 0 && barWidth <= 1) barWidth = 1;
			if (barWidth < 0 && barWidth >= -1) barWidth = -1;
			var additionalSpaceBetweenBars;
			if (1 * config.maxBarWidth > 0 && barWidth > 1 * config.maxBarWidth) {
				additionalSpaceBetweenBars = nrOfBars * (barWidth - 1 * config.maxBarWidth) / 2;
				barWidth = 1 * config.maxBarWidth;
			} else additionalSpaceBetweenBars = 0;
			var zeroY2 = 0;
			var zeroY = calculateOffset(scaleData.logarithm1, 0, calculatedScale, scaleHop);
			zeroY2 = calculateOffset(scaleData.logarithm2, 0, calculatedScale2, scaleHop2);
			initPassVariableData_part2(statData, data, config, ctx, scaleData.logarithm1, scaleData.logarithm2, {
				graphMin: calculatedScale.graphMin,
				graphMax: calculatedScale.graphMax,
				graphMin2: calculatedScale2.graphMin,
				graphMax2: calculatedScale2.graphMax,
				msr: msr,
				yAxisPosX: yAxisPosX,
				xAxisPosY: xAxisPosY,
				valueHop: valueHop,
				nbValueHop: data.labels.length - 1,
				barWidth: barWidth,
				additionalSpaceBetweenBars: additionalSpaceBetweenBars,
				zeroY: zeroY,
				zeroY2: zeroY2,
				calculatedScale: calculatedScale,
				calculatedScale2: calculatedScale2,
				scaleHop: scaleHop,
				scaleHop2: scaleHop2
			});
			if (typeof config.beforeLabelsFunction == "function") config.beforeLabelsFunction("BEFORELABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			drawLabels();
			if (typeof config.afterLabelsFunction == "function") config.afterLabelsFunction("AFTERLABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			animationLoop(config, msr.legendMsr, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data, statData);
		} else {
			testRedraw(ctx, data, config);
			if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) {
				config.onAnimationComplete(ctx, config, data, 1, 0, statData);
				ctx.runanimationcompletefunction = false;
			}
			ctx.firstPass = 9;
			close_result(ctx);
		}

		function drawBars(animationDecimal) {
			var t1, t2, t3, correctedAnimationDecimal, complementaryBar, otherBarHeight, barHeight, i, j, currentAnimPc, fullHeight, sizeTop, sizeBottom, decal;
			for (i = 0; i < data.datasets.length; i++) {
				if (data.datasets[i].type == "Line") continue;
				for (j = 0; j < data.datasets[i].data.length; j++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "BAR");
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) continue;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
							nullvalue: null
						}) == false) continue;
					ctx.save();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, true, 1, "BARSTROKEWIDTH", ctx, data, statData, data.datasets[i].barStrokeWidth, config.barStrokeWidth, "barStrokeWidth", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: statData[i][j].xPosLeft,
						yPosBottom: statData[i][j].yPosBottom,
						xPosRight: statData[i][j].xPosLeft + barWidth,
						yPosTop: statData[i][j].yPosBottom - barHeight
					}));
					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						if (Math.abs(data.datasets[i].data[j]) >= config.zeroValue || config.showZeroValue == true) {
							currentAnimPc = correctedAnimationDecimal.yAxis;
							if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
							if (1 * data.datasets[i].data[j] >= 0) barHeight = currentAnimPc * (statData[i][j].barHeight) - (Math.ceil(ctx.chartLineScale * ctx.lineWidth) / 2);
							else barHeight = currentAnimPc * (statData[i][j].barHeight) + (Math.ceil(ctx.chartLineScale * ctx.lineWidth) / 2);
							ctx.fillStyle = setOptionValue(true, true, 1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
								animationValue: currentAnimPc,
								xPosLeft: statData[i][j].xPosLeft,
								yPosBottom: statData[i][j].yPosBottom,
								xPosRight: statData[i][j].xPosLeft + barWidth,
								yPosTop: statData[i][j].yPosBottom - barHeight
							});
							ctx.strokeStyle = setOptionValue(true, true, 1, "STROKECOLOR", ctx, data, statData, data.datasets[i].strokeColor, config.defaultStrokeColor, "strokeColor", i, j, {
								nullvalue: null
							});
							roundRect(ctx, statData[i][j].xPosLeft, statData[i][j].yPosBottom, barWidth, barHeight, config.barShowStroke, config.barBorderRadius, i, j, (data.datasets[i].data[j] < 0 ? -1 : 1));
							if (animationDecimal.animationGlobal >= config.animationStopValue) {
								ctx.pieces_drawn.rectangles++;
								ctx.pieces_drawn.total_drawn++;
							}
						}
					}
					ctx.restore();
				}
			}
			// complementary bar;
			for (i = 0; i < data.datasets.length; i++) {
				if (data.datasets[i].type == "Line") continue;
				for (j = 0; j < data.datasets[i].data.length; j++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "BAR");
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) continue;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
							nullvalue: null
						}) == false) continue;
					complementaryBar = setOptionValue(true, true, 1, "COMPLEMENTARYBAR", ctx, data, statData, data.datasets[i].complementaryBar, config.complementaryBar, "complementaryBar", i, j, {
						nullvalue: null
					});
					if (complementaryBar == false) continue;
					ctx.save();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, true, 1, "BARSTROKEWIDTH", ctx, data, statData, data.datasets[i].barStrokeWidth, config.barStrokeWidth, "barStrokeWidth", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: statData[i][j].xPosLeft,
						yPosBottom: statData[i][j].yPosBottom,
						xPosRight: statData[i][j].xPosLeft + barWidth,
						yPosTop: statData[i][j].yPosBottom - barHeight
					}));
					currentAnimPc = correctedAnimationDecimal.yAxis;
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						if (1 * data.datasets[i].data[j] >= 0) barHeight = currentAnimPc * (statData[i][j].barHeight) - (Math.ceil(ctx.chartLineScale * ctx.lineWidth) / 2);
						else barHeight = currentAnimPc * (statData[i][j].barHeight) + (Math.ceil(ctx.chartLineScale * ctx.lineWidth) / 2);
					} else barHeight = 0;
					fullHeight = msr.clrheight - Math.ceil(ctx.chartLineScale * (config.scaleTickSizeTop + config.scaleTickSizeBottom));
					sizeTop = statData[i][j].yPosBottom - msr.clry - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
					sizeBottom = fullHeight - sizeTop;
					if (1 * data.datasets[i].data[j] < 0) {
						otherBarHeight = -(sizeBottom + barHeight) + 3 * (ctx.lineWidth / 2);
						otherBarHeight2 = sizeTop - 3 * (ctx.lineWidth / 2);
						decal = -(ctx.lineWidth / 2);
					} else {
						otherBarHeight = (sizeTop - barHeight) - 3 * (ctx.lineWidth / 2);
						otherBarHeight2 = -(sizeBottom - 3 * (ctx.lineWidth / 2));
						decal = +(ctx.lineWidth / 2);
					}
					ctx.fillStyle = setOptionValue(true, true, 1, "COMPLEMENTARYCOLOR", ctx, data, statData, data.datasets[i].complementaryColor, config.complementaryColor, "complementaryColor", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: statData[i][j].xPosLeft,
						yPosBottom: statData[i][j].yPosBottom - barHeight,
						xPosRight: statData[i][j].xPosLeft + barWidth,
						yPosTop: statData[i][j].yPosBottom - barHeight - otherBarHeight
					});
					ctx.strokeStyle = setOptionValue(true, true, 1, "COMPLEMENTARYSTROKECOLOR", ctx, data, statData, data.datasets[i].complementaryStrokeColor, config.complementaryStrokeColor, "strokeColor", i, j, {
						nullvalue: null
					});
					roundRect(ctx, statData[i][j].xPosLeft, statData[i][j].yPosBottom - barHeight - 2 * decal, barWidth, otherBarHeight, config.barShowStroke, config.barBorderRadius, i, j, (data.datasets[i].data[j] < 0 ? -1 : 1));
					if (config.complementaryBarFullHeight) {
						roundRect(ctx, statData[i][j].xPosLeft, statData[i][j].yPosBottom + 2 * decal, barWidth, otherBarHeight2, config.barShowStroke, config.barBorderRadius, i, j, (data.datasets[i].data[j] < 0 ? -1 : 1));
					}
					ctx.restore();
				}
			}
			drawLinesDataset(animationDecimal, data, config, ctx, statData, {
				xAxisPosY: xAxisPosY,
				yAxisPosX: yAxisPosX,
				valueHop: valueHop,
				nbValueHop: data.labels.length
			});
			if (animationDecimal.animationGlobal >= config.animationStopValue) {
				for (i = 0; i < data.datasets.length; i++) {
					for (j = 0; j < data.datasets[i].data.length; j++) {
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
								nullvalue: null
							}) == false) continue;
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
								nullvalue: null
							}) == false) continue;
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						if (data.datasets[i].type == "Line") continue;
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["RECT", i, j, statData, setOptionValue(true, true, 1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, "annotateDisplay", i, j, {
							nullValue: true
						})];
						if (setOptionValue(true, true, 1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, "inGraphDataShow", i, j, {
								nullValue: true
							})) {
							ctx.save();
							ctx.textAlign = setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
								nullValue: true
							});
							ctx.textBaseline = setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
								nullValue: true
							});
							ctx.font = setOptionValue(true, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
								nullValue: true
							}) + ' ' + setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}) + 'px ' + setOptionValue(true, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
								nullValue: true
							});
							ctx.fillStyle = setOptionValue(true, true, 1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, undefined, config.inGraphDataFontColor, "inGraphDataFontColor", i, j, {
								nullValue: true
							});
							t1 = statData[i][j].yPosBottom;
							t2 = statData[i][j].yPosTop;
							ctx.beginPath();
							var yPos = 0,
								xPos = 0;
							if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 1) {
								xPos = statData[i][j].xPosLeft + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 2) {
								xPos = statData[i][j].xPosLeft + barWidth / 2 + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 3) {
								xPos = statData[i][j].xPosLeft + barWidth + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							}
							if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 1) {
								yPos = statData[i][j].yPosBottom - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 2) {
								yPos = (statData[i][j].yPosBottom + statData[i][j].yPosTop) / 2 - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 3) {
								yPos = statData[i][j].yPosTop - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							}
							ctx.translate(xPos, yPos);
							var dispString = tmplbis(setOptionValue(true, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
								nullValue: true
							}), statData[i][j], config);
							rotateVal = setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							ctx.rotate(rotateVal);
							setTextBordersAndBackground(ctx, dispString, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), 0, 0, setOptionValue(true, true, 1, "INGRAPHDATABORDERS", ctx, data, statData, undefined, config.inGraphDataBorders, "inGraphDataBorders", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSELECTION", ctx, data, statData, undefined, config.inGraphDataBordersSelection, "inGraphDataBordersSelection", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, undefined, config.inGraphDataBordersColor, "inGraphDataBordersColor", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, undefined, config.inGraphDataBordersWidth, "inGraphDataBordersWidth", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, undefined, config.inGraphDataBordersXSpace, "inGraphDataBordersXSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, undefined, config.inGraphDataBordersYSpace, "inGraphDataBordersYSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, undefined, config.inGraphDataBordersStyle, "inGraphDataBordersStyle", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, undefined, config.inGraphDataBackgroundColor, "inGraphDataBackgroundColor", i, j, {
								nullValue: true
							}), "INGRAPHDATA", config.inGraphDataBordersRadius);
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), true, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, xPos, yPos, i, j);
							ctx.restore();
						}
					}
				}
			}
			if (animationDecimal.animationGlobal >= 1 && typeof drawMath == "function") {
				drawMath(ctx, config, data, msr, {
					xAxisPosY: xAxisPosY,
					yAxisPosX: yAxisPosX,
					valueHop: valueHop,
					scaleHop: scaleHop,
					zeroY: zeroY,
					calculatedScale: calculatedScale,
					calculateOffset: calculateOffset,
					additionalSpaceBetweenBars: additionalSpaceBetweenBars,
					barWidth: barWidth
				});
			}
			//window.alert("A");
		};

		function roundRect(ctx, x, y, w, h, stroke, radius, i, j, fact) {
			ctx.beginPath();
			ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "STROKESTYLE", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
				nullvalue: null
			})));
			ctx.moveTo(x + (w / 2), y);
			ctx.lineTo(x + w, y);
			ctx.lineTo(x + w, y - h + fact * radius);
			ctx.quadraticCurveTo(x + w, y - h, x + w - radius, y - h);
			ctx.lineTo(x + radius, y - h);
			ctx.quadraticCurveTo(x, y - h, x, y - h + fact * radius);
			ctx.lineTo(x, y);
			ctx.lineTo(x + (w / 2), y);
			if (stroke) ctx.stroke();
			ctx.closePath();
			ctx.fill();
			ctx.setLineDash([]);
		};

		function drawScale() {
			//drawLinesTest(ctx);
			drawGridScale(ctx, data, config, msr, yAxisPosX, xAxisPosY, zeroY, valueHop, scaleHop, scaleData.nbOfStepsAxis1, data.labels.length + 1);
		};

		function drawLabels() {
			var decal, subloop;
			ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
			//X axis line                                                          
			if (config.xAxisTop || config.xAxisBottom) {
				ctx.textBaseline = "top";
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					if (msr.rotateLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
					} else if (msr.rotateLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					subloop = 0;
					decal = 0;
					for (var i = 0; i < data.labels.length; i++) {
						if (showLabels(ctx, data, config, i)) {
							ctx.save();
							if (msr.rotateLabels > 0) {
								ctx.translate(yAxisPosX + i * valueHop + (valueHop / 2) - msr.highestXLabel / 2, msr.xLabelPos);
								ctx.rotate(-((msr.rotateLabels + 180 * (msr.rotateLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + i * valueHop + (valueHop / 2) - msr.highestXLabel / 2, msr.xLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), yAxisPosX + i * valueHop + (valueHop / 2) + decal, msr.xLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
				if (config.xAxisTop) {
					if (msr.rotateTLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
					} else if (msr.rotateTLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					var label;
					if (typeof data.labels2 == "object") label = data.labels2;
					else label = data.labels;
					for (var i = 0; i < label.length; i++) {
						if (showLabels(ctx, data, config, i)) {
							ctx.save();
							if (msr.rotateTLabels > 0) {
								ctx.translate(yAxisPosX + i * valueHop + (valueHop / 2) - msr.highestTXLabel / 2, msr.xTLabelPos);
								ctx.rotate(-((msr.rotateTLabels + 180 * (msr.rotateTLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(fmtChartJS(config, label[i], config.fmtXLabel), 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + i * valueHop + (valueHop / 2) - msr.highestXLabel / 2, msr.xLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(fmtChartJS(config, label[i], config.fmtXLabel), yAxisPosX + i * valueHop + (valueHop / 2), msr.xTLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
			}
			//Y axis
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			subloop = 0;
			decal = 0;
			if (config.yAxisMiddle == true) {
				decal = scaleHop / 2;
				subloop = 1;
			}
			for (var j = ((config.showYAxisMin) ? -1 : 0); j < scaleData.nbOfStepsAxis1 - subloop; j++) {
				if (config.scaleShowLabels) {
					if (showYLabels(ctx, data, config, j + 1, scaleData.labels1[j + 1])) {
						if (config.yAxisLeft) {
							ctx.textAlign = "right";
							ctx.fillTextMultiLine(scaleData.labels1[j + 1], yAxisPosX - (Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - ((j + 1) * scaleHop) - decal, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
						}
						if (config.yAxisRight && !(scaleData.dbAxis || config.forceSecondScale)) {
							ctx.textAlign = "left";
							ctx.fillTextMultiLine(scaleData.labels1[j + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - ((j + 1) * scaleHop) - decal, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
						}
					}
				}
			}
			if (config.yAxisRight && (scaleData.dbAxis || config.forceSecondScale)) {
				subloop = 0;
				decal = 0;
				if (config.yAxisMiddle == true) {
					decal = scaleHop / 2;
					subloop = 1;
				}
				for (j = ((config.showYAxisMin) ? -1 : 0); j < scaleData.nbOfStepsAxis2 - subloop; j++) {
					if (config.scaleShowLabels) {
						ctx.textAlign = "left";
						ctx.fillTextMultiLine(scaleData.labels2[j + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)) - decal, xAxisPosY - ((j + 1) * scaleHop2), ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
					}
				}
			}
		};
		return {
			data: data,
			config: config,
			ctx: ctx
		};
	};
	var HorizontalBar = function(data, config, ctx) {
		var maxSize, scaleHop, labelHeight, scaleHeight, labelTemplateString, valueHop, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0,
			msr;
		ctx.tpchart = "HorizontalBar";
		ctx.tpchartSub = "HorizontalBar";
		ctx.tpdata = 0;
		if (!init_and_start(ctx, data, config)) return;
		if (config.reverseOrder && typeof ctx.reversed == "undefined") {
			ctx.reversed = true;
			data = reverseData(data);
		}
		var statData = initPassVariableData_part1(data, config, ctx);
		init_result(ctx, data, statData);
		msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, "nihil", "nihil", true, true, true, true, "StackedBar");
		var scaleData = computeScale(true, true, false, false, false, false, data, config, ctx, statData, msr.availableHeight);
		scaleData.labels1 = [];
		scaleData.labels2 = [];
		populateLabels(scaleData.logarithm1, config.fmtYLabel, config, scaleData.labelTemplateString1, scaleData.labels1, scaleData.nbOfStepsAxis1, scaleData.minAxis1, scaleData.maxAxis1, scaleData.stepWidthAxis1);
		populateLabels(scaleData.logarithm2, config.fmtYLabel2, config, scaleData.labelTemplateString2, scaleData.labels2, scaleData.nbOfStepsAxis2, scaleData.minAxis2, scaleData.maxAxis2, scaleData.stepWidthAxis2);
		if (scaleData.maxSteps > 0 && scaleData.minSteps > 0) {
			var calculatedScale = {
				steps: scaleData.nbOfStepsAxis1,
				stepValue: scaleData.stepWidthAxis1,
				graphMin: scaleData.minAxis1,
				graphMax: scaleData.minAxis1 + scaleData.nbOfStepsAxis1 * scaleData.stepWidthAxis1,
				labels: scaleData.labels1
			};
			msr = setMeasures(data, config, ctx, ctx.canvas.height, ctx.canvas.width, scaleData.labels1, scaleData.labels1, true, true, true, true, "HorizontalBar");
			msr.availableHeight = msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
			msr.availableWidth = msr.availableWidth - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight);
			scaleHop = Math.floor(msr.availableHeight / data.labels.length);
			valueHop = Math.floor(msr.availableWidth / (scaleData.nbOfStepsAxis1));
			if (valueHop == 0 || config.fullWidthGraph) valueHop = (msr.availableWidth / scaleData.nbOfStepsAxis1);
			msr.clrwidth = msr.clrwidth - (msr.availableWidth - (scaleData.nbOfStepsAxis1 * valueHop));
			msr.topNotUsableHeight += (msr.availableHeight - data.labels.length * scaleHop);
			msr.rightNotUsableWidth += (msr.availableWidth - scaleData.nbOfStepsAxis1 * valueHop);
			msr.availableWidth = (scaleData.nbOfStepsAxis1) * valueHop;
			msr.availableHeight = (data.labels.length) * scaleHop;
			yAxisPosX = msr.leftNotUsableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft);
			xAxisPosY = msr.topNotUsableHeight + msr.availableHeight + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
			barWidth = (scaleHop - Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth) * 2 - (Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) * 2) - (Math.ceil(ctx.chartSpaceScale * config.barDatasetSpacing) * data.datasets.length - 1) - ((Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2) * data.datasets.length - 1)) / data.datasets.length;
			if (barWidth >= 0 && barWidth <= 1) barWidth = 1;
			if (barWidth < 0 && barWidth >= -1) barWidth = -1;
			var additionalSpaceBetweenBars;
			if (1 * config.maxBarWidth > 0 && barWidth > 1 * config.maxBarWidth) {
				additionalSpaceBetweenBars = data.datasets.length * (barWidth - 1 * config.maxBarWidth) / 2;
				barWidth = 1 * config.maxBarWidth;
			} else additionalSpaceBetweenBars = 0;
			var zeroY = 0;
			zeroY = calculateOffset(scaleData.logarithm1, 0, calculatedScale, valueHop);
			initPassVariableData_part2(statData, data, config, ctx, scaleData.logarithm1, scaleData.logarithm2, {
				graphMin: calculatedScale.graphMin,
				graphMax: calculatedScale.graphMax,
				yAxisPosX: yAxisPosX,
				xAxisPosY: xAxisPosY,
				barWidth: barWidth,
				additionalSpaceBetweenBars: additionalSpaceBetweenBars,
				zeroY: zeroY,
				scaleHop: scaleHop,
				valueHop: valueHop,
				calculatedScale: calculatedScale
			});
			if (typeof config.beforeLabelsFunction == "function") config.beforeLabelsFunction("BEFORELABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			drawLabels();
			if (typeof config.afterLabelsFunction == "function") config.afterLabelsFunction("AFTERLABELSFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: 1,
				cntiter: 0,
				config: config
			});
			animationLoop(config, msr.legendMsr, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data, statData);
		} else {
			testRedraw(ctx, data, config);
			if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) {
				config.onAnimationComplete(ctx, config, data, 1, 0, statData);
				ctx.runanimationcompletefunction = false;
			}
			ctx.firstPass = 9;
			close_result(ctx);
		}

		function drawBars(animationDecimal) {
			var i, j, currentAnimPc, barHeight, fullHeight, sizeTop, sizeBottom, otherBarHeight, otherBarHeight2, decal;
			var correctedAnimationDecimal;
			for (i = 0; i < data.datasets.length; i++) {
				for (j = 0; j < data.datasets[i].data.length; j++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "HORIZONTALBAR");
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) continue;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
							nullvalue: null
						}) == false) continue;
					ctx.save();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, true, 1, "BARSTROKEWIDTH", ctx, data, statData, data.datasets[i].barStrokeWidth, config.barStrokeWidth, "barStrokeWidth", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: statData[i][j].xPosLeft,
						yPosBottom: statData[i][j].yPosBottom,
						xPosRight: statData[i][j].xPosLeft + barWidth,
						yPosTop: statData[i][j].yPosBottom
					}));
					currentAnimPc = correctedAnimationDecimal.yAxis
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					if (1 * data.datasets[i].data[j] >= 0) barHeight = currentAnimPc * statData[i][j].barWidth - (Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2);
					else barHeight = currentAnimPc * statData[i][j].barWidth + (Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2);
					ctx.fillStyle = setOptionValue(true, true, 1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: statData[i][j].xPosLeft,
						yPosBottom: statData[i][j].yPosBottom,
						xPosRight: statData[i][j].xPosLeft + barHeight,
						yPosTop: statData[i][j].yPosBottom
					});
					ctx.strokeStyle = setOptionValue(true, true, 1, "STROKECOLOR", ctx, data, statData, data.datasets[i].strokeColor, config.defaultStrokeColor, "strokeColor", i, j, {
						nullvalue: null
					});
					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						if (Math.abs(data.datasets[i].data[j]) >= config.zeroValue || config.showZeroValue == true) {
							roundRect(ctx, statData[i][j].yPosTop, statData[i][j].xPosLeft, barWidth, barHeight, config.barShowStroke, config.barBorderRadius, 0, i, j, (data.datasets[i].data[j] < 0 ? -1 : 1));
							if (animationDecimal.animationGlobal >= config.animationStopValue) {
								ctx.pieces_drawn.rectangles++;
								ctx.pieces_drawn.total_drawn++;
							}
						}
					}
					ctx.restore();
				}
			}
			// complementary bar;
			for (i = 0; i < data.datasets.length; i++) {
				for (j = 0; j < data.datasets[i].data.length; j++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "HORIZONTALBAR");
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) continue;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
							nullvalue: null
						}) == false) continue;
					complementaryBar = setOptionValue(true, true, 1, "COMPLEMENTARYBAR", ctx, data, statData, data.datasets[i].complementaryBar, config.complementaryBar, "complementaryBar", i, j, {
						nullvalue: null
					});
					if (complementaryBar == false) continue;
					ctx.save();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, true, 1, "BARSTROKEWIDTH", ctx, data, statData, data.datasets[i].barStrokeWidth, config.barStrokeWidth, "barStrokeWidth", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: statData[i][j].xPosLeft,
						yPosBottom: statData[i][j].yPosBottom,
						xPosRight: statData[i][j].xPosLeft + barWidth,
						yPosTop: statData[i][j].yPosBottom - barHeight
					}));
					currentAnimPc = correctedAnimationDecimal.yAxis;
					if (currentAnimPc > 1) currentAnimPc = currentAnimPc - 1;
					if (1 * data.datasets[i].data[j] >= 0) barHeight = currentAnimPc * statData[i][j].barWidth - (Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2);
					else barHeight = currentAnimPc * statData[i][j].barWidth + (Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2);
					fullHeight = msr.clrwidth - Math.ceil(ctx.chartLineScale * (config.scaleTickSizeLeft + config.scaleTickSizeRight));
					sizeTop = statData[i][j].xPosLeft - msr.clrx - Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight);
					sizeBottom = fullHeight - sizeTop;
					if (1 * data.datasets[i].data[j] < 0) {
						otherBarHeight = -(msr.clrwidth - ((statData[i][j].xPosLeft - msr.clrx) - barHeight)) + Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft);
						otherBarHeight = -(sizeBottom + barHeight) + 3 * (ctx.lineWidth / 2);
						otherBarHeight2 = sizeTop - 3 * (ctx.lineWidth / 2);
						decal = -(ctx.lineWidth / 2);
					} else {
						otherBarHeight = msr.clrwidth - ((statData[i][j].xPosLeft - msr.clrx) + barHeight + ctx.lineWidth);
						otherBarHeight = (sizeTop - barHeight) - 3 * (ctx.lineWidth / 2);
						otherBarHeight2 = -(sizeBottom - 3 * (ctx.lineWidth / 2));
						decal = +(ctx.lineWidth / 2);
					}
					ctx.fillStyle = setOptionValue(true, true, 1, "COMPLEMENTARYCOLOR", ctx, data, statData, data.datasets[i].complementaryColor, config.complementaryColor, "complementaryColor", i, j, {
						animationValue: currentAnimPc,
						xPosLeft: statData[i][j].xPosLeft + barHeight,
						yPosBottom: statData[i][j].yPosBottom,
						xPosRight: statData[i][j].xPosLeft + barHeight + otherBarHeight,
						yPosTop: statData[i][j].yPosBottom
					});
					ctx.strokeStyle = setOptionValue(true, true, 1, "COMPLEMENTARYSTROKECOLOR", ctx, data, statData, data.datasets[i].complementaryStrokeColor, config.complementaryStrokeColor, "strokeColor", i, j, {
						nullvalue: null
					});
					roundRect(ctx, statData[i][j].yPosTop, statData[i][j].xPosLeft + barHeight + 2 * decal, barWidth, otherBarHeight, config.barShowStroke, config.barBorderRadius, 0, i, j, (data.datasets[i].data[j] < 0 ? -1 : 1));
					if (animationDecimal.animationGlobal >= config.animationStopValue) {
						ctx.pieces_drawn.rectangles++;
						ctx.pieces_drawn.total_drawn++;
					}
					if (config.complementaryBarFullHeight) {
						roundRect(ctx, statData[i][j].yPosTop, statData[i][j].xPosLeft - 2 * decal, barWidth, otherBarHeight2, config.barShowStroke, config.barBorderRadius, 0, i, j, (data.datasets[i].data[j] < 0 ? -1 : 1));
					}
					ctx.restore();
				}
			}
			if (animationDecimal.animationGlobal >= config.animationStopValue) {
				for (i = 0; i < data.datasets.length; i++) {
					for (j = 0; j < data.datasets[i].data.length; j++) {
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
								nullvalue: null
							}) == false) continue;
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
								nullvalue: null
							}) == false) continue;
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["RECT", i, j, statData, setOptionValue(true, true, 1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, "annotateDisplay", i, j, {
							nullValue: true
						})];
						if (setOptionValue(true, true, 1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, "inGraphDataShow", i, j, {
								nullValue: true
							})) {
							ctx.save();
							ctx.textAlign = setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
								nullValue: true
							});
							ctx.textBaseline = setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
								nullValue: true
							});
							ctx.font = setOptionValue(true, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
								nullValue: true
							}) + ' ' + setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}) + 'px ' + setOptionValue(true, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
								nullValue: true
							});
							ctx.fillStyle = setOptionValue(true, true, 1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, undefined, config.inGraphDataFontColor, "inGraphDataFontColor", i, j, {
								nullValue: true
							});
							ctx.beginPath();
							var yPos = 0,
								xPos = 0;
							if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 1) {
								yPos = statData[i][j].yPosTop - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								}) + barWidth;
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 2) {
								yPos = statData[i][j].yPosTop + barWidth / 2 - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAYPOSITION", ctx, data, statData, undefined, config.inGraphDataYPosition, "inGraphDataYPosition", i, j, {
									nullValue: true
								}) == 3) {
								yPos = statData[i][j].yPosTop - setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							}
							if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 1) {
								xPos = statData[i][j].xPosLeft + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 2) {
								xPos = (statData[i][j].xPosLeft + statData[i][j].xPosRight) / 2 + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							} else if (setOptionValue(true, true, 1, "INGRAPHDATAXPOSITION", ctx, data, statData, undefined, config.inGraphDataXPosition, "inGraphDataXPosition", i, j, {
									nullValue: true
								}) == 3) {
								xPos = statData[i][j].xPosRight + setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								});
							}
							ctx.translate(xPos, yPos);
							var dispString = tmplbis(setOptionValue(true, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
								nullValue: true
							}), statData[i][j], config);
							var rotateVal = setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							ctx.rotate(rotateVal);
							setTextBordersAndBackground(ctx, dispString, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), 0, 0, setOptionValue(true, true, 1, "INGRAPHDATABORDERS", ctx, data, statData, undefined, config.inGraphDataBorders, "inGraphDataBorders", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSELECTION", ctx, data, statData, undefined, config.inGraphDataBordersSelection, "inGraphDataBordersSelection", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, undefined, config.inGraphDataBordersColor, "inGraphDataBordersColor", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, undefined, config.inGraphDataBordersWidth, "inGraphDataBordersWidth", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, undefined, config.inGraphDataBordersXSpace, "inGraphDataBordersXSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, undefined, config.inGraphDataBordersYSpace, "inGraphDataBordersYSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, undefined, config.inGraphDataBordersStyle, "inGraphDataBordersStyle", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, undefined, config.inGraphDataBackgroundColor, "inGraphDataBackgroundColor", i, j, {
								nullValue: true
							}), "INGRAPHDATA", config.inGraphDataBordersRadius);
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), true, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, xPos, yPos, i, j);
							ctx.restore();
						}
					}
				}
			}
		};

		function roundRect(ctx, x, y, w, h, stroke, radius, zeroY, i, j, fact) {
			ctx.beginPath();
			ctx.moveTo(y + zeroY, x);
			ctx.lineTo(y + zeroY, x + w);
			ctx.lineTo(y + h - fact * radius, x + w);
			ctx.quadraticCurveTo(y + h, x + w, y + h, x + w - radius);
			ctx.lineTo(y + h, x + radius);
			ctx.quadraticCurveTo(y + h, x, y + h - fact * radius, x);
			ctx.lineTo(y + zeroY, x);
			ctx.quadraticCurveTo(y + zeroY, x, y + zeroY, x + w);
			if (stroke) {
				ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "STROKESTYLE", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
					nullvalue: null
				})));
				ctx.stroke();
				ctx.setLineDash([]);
			};
			ctx.closePath();
			ctx.fill();
		};

		function drawScale() {
			drawGridScale(ctx, data, config, msr, yAxisPosX, xAxisPosY, zeroY, valueHop, scaleHop, data.labels.length + 0, scaleData.nbOfStepsAxis1 + 1);
		};

		function drawLabels() {
			ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
			//X axis line                                                          
			if (config.scaleShowLabels && (config.xAxisTop || config.xAxisBottom)) {
				ctx.textBaseline = "top";
				ctx.fillStyle = config.scaleFontColor;
				if (config.xAxisBottom) {
					if (msr.rotateLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
					} else if (msr.rotateLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					subloop = 0;
					decal = 0;
					if (config.yAxisMiddle == true) {
						decal = valueHop / 2;
						subloop = 1;
					}
					for (var i = ((config.showYAxisMin) ? -1 : 0); i < scaleData.nbOfStepsAxis1 - subloop; i++) {
						if (showYLabels(ctx, data, config, i + 1, scaleData.labels1[i + 1])) {
							ctx.save();
							if (msr.rotateLabels > 0) {
								ctx.translate(yAxisPosX + (i + 1) * valueHop - msr.highestXLabel / 2 + decal, msr.xLabelPos);
								ctx.rotate(-((msr.rotateLabels + 180 * (msr.rotateLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(scaleData.labels1[i + 1], 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + (i + 1) * valueHop - msr.highestXLabel / 2, msr.xLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(scaleData.labels1[i + 1], yAxisPosX + (i + 1) * valueHop + decal, msr.xLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
				if (config.xAxisTop) {
					if (msr.rotateTLabels > 90) {
						ctx.save();
						ctx.textAlign = "left";
					} else if (msr.rotateTLabels > 0) {
						ctx.save();
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "center";
					}
					subloop = 0;
					decal = 0;
					if (config.yAxisMiddle == true) {
						decal = valueHop / 2;
						subloop = 1;
					}
					for (var i = ((config.showYAxisMin) ? -1 : 0); i < scaleData.nbOfStepsAxis1 - subloop; i++) {
						if (showYLabels(ctx, data, config, i + 1, scaleData.labels1[i + 1])) {
							ctx.save();
							if (msr.rotateTLabels > 0) {
								ctx.translate(yAxisPosX + (i + 1) * valueHop - msr.highestTXLabel / 2 + decal, msr.xTLabelPos);
								ctx.rotate(-((msr.rotateTLabels + 180 * (msr.rotateTLabels > 90)) * (Math.PI / 180)));
								ctx.fillTextMultiLine(scaleData.labels1[i + 1], 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + (i + 1) * valueHop - msr.highestXLabel / 2, msr.xLabelPos, i, -1);
							} else {
								ctx.fillTextMultiLine(scaleData.labels1[i + 1], yAxisPosX + ((i + 1) * valueHop) + decal, msr.xTLabelPos, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1);
							}
							ctx.restore();
						}
					}
				}
			}
			//Y axis
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			for (var j = 0; j < data.labels.length; j++) {
				if (showLabels(ctx, data, config, j)) {
					if (config.yAxisLeft) {
						ctx.textAlign = "right";
						ctx.fillTextMultiLine(fmtChartJS(config, data.labels[j], config.fmtXLabel), yAxisPosX - (Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - (j * scaleHop) - scaleHop / 2, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
					}
					if (config.yAxisRight) {
						ctx.textAlign = "left";
						ctx.fillTextMultiLine(fmtChartJS(config, data.labels[j], config.fmtXLabel), yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - (j * scaleHop) - scaleHop / 2, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.scaleFontSize)), true, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, j);
					}
				}
			}
		};
		return {
			data: data,
			config: config,
			ctx: ctx
		};
	};

	function calculateOffset(logarithmic, val, calculatedScale, scaleHop) {
		if (!logarithmic) { // no logarithmic scale
			var outerValue = calculatedScale.steps * calculatedScale.stepValue;
			var adjustedValue = val - calculatedScale.graphMin;
			var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
			return (scaleHop * calculatedScale.steps) * scalingFactor;
		} else { // logarithmic scale
			return CapValue(log10(val) * scaleHop - log10(calculatedScale.graphMin) * scaleHop, undefined, 0);
		}
	};

	function animationLoopOld(config, legendMsr, drawScale, drawData, ctx, clrx, clry, clrwidth, clrheight, midPosX, midPosY, borderX, borderY, data, statData) {
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
		if (config.saveBackImage) {
			ctx.savedImage = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
		if (config.clearRect) {
			if (ctx.firstPass % 10 != 1 || config.animation == false) animLoop();
			else {
				if (config.animationForceSetTimeOut) requestAnimFrameSetTimeOut(animLoop);
				else requestAnimFrame(animLoop);
			}
		} else animLoop();

		function animateFrame() {
			var easeAdjustedAnimationPercent = (config.animation) ? CapValue(easingFunction(percentAnimComplete), null, 0) : 1;
			if (1 * cntiter >= 1 * CapValue(config.animationSteps, Number.MAX_VALUE, 1) || config.animation == false || ctx.firstPass % 10 != 1) easeAdjustedAnimationPercent = 1;
			else if (easeAdjustedAnimationPercent >= 1) easeAdjustedAnimationPercent = 0.9999;
			if (config.animation && !(isIE() < 9 && isIE() != false) && config.clearRect) {
				ctx.clearRect(clrx, clry, clrwidth, clrheight);
			}
			dispCrossImage(ctx, config, midPosX, midPosY, borderX, borderY, false, data, easeAdjustedAnimationPercent, cntiter);
			dispCrossText(ctx, config, midPosX, midPosY, borderX, borderY, false, data, easeAdjustedAnimationPercent, cntiter);
			if (typeof config.beforeDrawFunction == "function") config.beforeDrawFunction("BEFOREDRAWFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: easeAdjustedAnimationPercent,
				cntiter: cntiter,
				config: config,
				borderX: borderX,
				borderY: borderY,
				midPosX: midPosX,
				midPosY: midPosY
			});
			if (config.saveBackImage) {
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.putImageData(ctx.savedImage, 0, 0);
			}
			if (config.scaleOverlay) {
				drawData(easeAdjustedAnimationPercent);
				if (typeof config.endDrawDataFunction == "function") config.endDrawDataFunction("ENDDATAFUNCTION", ctx, data, statData, -1, -1, {
					animationValue: easeAdjustedAnimationPercent,
					cntiter: cntiter,
					config: config,
					borderX: borderX,
					borderY: borderY,
					midPosX: midPosX,
					midPosY: midPosY
				});
				drawScale();
				if (typeof config.endDrawScaleFunction == "function") config.endDrawScaleFunction("ENDSCALEFUNCTION", ctx, data, statData, -1, -1, {
					animationValue: easeAdjustedAnimationPercent,
					cntiter: cntiter,
					config: config,
					borderX: borderX,
					borderY: borderY,
					midPosX: midPosX,
					midPosY: midPosY
				});
			} else {
				drawScale();
				if (typeof config.endDrawScaleFunction == "function") config.endDrawScaleFunction("ENDSCALEFUNCTION", ctx, data, statData, -1, -1, {
					animationValue: easeAdjustedAnimationPercent,
					cntiter: cntiter,
					config: config,
					borderX: borderX,
					borderY: borderY,
					midPosX: midPosX,
					midPosY: midPosY
				});
				drawData(easeAdjustedAnimationPercent);
				if (typeof config.endDrawDataFunction == "function") config.endDrawDataFunction("ENDDATAFUNCTION", ctx, data, statData, -1, -1, {
					animationValue: easeAdjustedAnimationPercent,
					cntiter: cntiter,
					config: config,
					borderX: borderX,
					borderY: borderY,
					midPosX: midPosX,
					midPosY: midPosY
				});
			}
			dispCrossImage(ctx, config, midPosX, midPosY, borderX, borderY, true, data, easeAdjustedAnimationPercent, cntiter);
			dispCrossText(ctx, config, midPosX, midPosY, borderX, borderY, true, data, easeAdjustedAnimationPercent, cntiter);
			drawLegend(legendMsr, data, config, ctx, ctx.tpchart, cntiter);
		};

		function animLoop() {
			//We need to check if the animation is incomplete (less than 1), or complete (1).
			cntiter += multAnim;
			percentAnimComplete += multAnim * animFrameAmount;
			if (cntiter == config.animationSteps || config.animation == false || ctx.firstPass % 10 != 1) percentAnimComplete = 1;
			else if (percentAnimComplete >= 1) percentAnimComplete = 0.999;
			animateFrame();
			//Stop the loop continuing forever
			if (multAnim == -1 && cntiter <= beginAnim) {
				if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) config.onAnimationComplete(ctx, config, data, 0, animationCount + 1, statData);
				multAnim = 1;
				if (config.animationForceSetTimeOut) requestAnimFrameSetTimeOut(animLoop);
				else requestAnimFrame(animLoop);
			} else if (percentAnimComplete < config.animationStopValue) {
				if (config.animationForceSetTimeOut) requestAnimFrameSetTimeOut(animLoop);
				else requestAnimFrame(animLoop);
			} else {
				if ((animationCount < config.animationCount || config.animationCount == 0) && (ctx.firstPass % 10 == 1)) {
					animationCount++;
					if (config.animationBackward && multAnim == 1) {
						percentAnimComplete -= animFrameAmount;
						multAnim = -1;
					} else {
						multAnim = 1;
						cntiter = beginAnim - 1;
						percentAnimComplete = beginAnimPct - animFrameAmount;
					}
					window.setTimeout(animLoop, config.animationPauseTime * 1000);
				} else {
					if (!testRedraw(ctx, data, config)) {
						if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) {
							config.onAnimationComplete(ctx, config, data, 1, animationCount + 1, statData);
							ctx.runanimationcompletefunction = false;
						}
					}
					ctx.firstPass = 9;
					close_result(ctx);
				}
			}
		};
	};

	function animationLoop(config, legendMsr, drawScale, drawData, ctx, clrx, clry, clrwidth, clrheight, midPosX, midPosY, borderX, borderY, data, statData) {
		var cntiter = 0;
		var animationCount = 0 - (config.animationCount == 0);
		var backwardAnimation = false;
		var multIter = 1;
		//		if (config.animationStartValue < 0 || config.animationStartValue > 1) config.animation.StartValue = 0;
		//		if (config.animationStopValue < 0 || config.animationStopValue > 1) config.animation.StopValue = 1;
		//		if (config.animationStopValue < config.animationStartValue) config.animationStopValue = config.animationStartValue;
		if (isIE() < 9 && isIE() != false) config.animation = false;
		var animationIncrementByIteration = (config.animation && ctx.firstPass == 1) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1;
		var currentAnimationValue = (config.animation) ? 0 : 1;
		if (config.animation && config.animationStartValue > 0 && config.animationStartValue <= 1) {
			while (currentAnimationValue < config.animationStartValue) {
				cntiter++;
				currentAnimationValue += animationIncrementByIteration;
			}
		}
		//		var animFrameAmount = (config.animation) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1,
		//			easingFunction = animationOptions[config.animationEasing],
		//			percentAnimComplete = (config.animation) ? 0 : 1;
		//		if (config.animation && config.animationStartValue > 0 && config.animationStartValue <= 1) {
		//			while (percentAnimComplete < config.animationStartValue) {
		//				cntiter++;
		//				percentAnimComplete += animFrameAmount;
		//			}
		//		}
		//		var beginAnim = cntiter;
		//		var beginAnimPct = percentAnimComplete;
		if (typeof drawScale !== "function") drawScale = function() {};
		if (config.saveBackImage) {
			ctx.savedImage = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
		if (config.clearRect) {
			if (ctx.firstPass % 10 != 1 || config.animation == false) animLoop();
			else {
				if (config.animationForceSetTimeOut) requestAnimFrameSetTimeOut(animLoop);
				else requestAnimFrame(animLoop);
			}
		} else animLoop();

		function animLoop() {
			var animationCompleted = false;
			currentAnimationValue += animationIncrementByIteration
			cntiter += multIter;
			if (currentAnimationValue >= 1 - config.zeroValue) currentAnimationValue = 1;
			drawFrame();
			// operation to be performed when animation is completed ;
			if (currentAnimationValue >= config.animationStopValue - config.zeroValue) {
				if (config.animationCount != 0) animationCount++;
				currentAnimationValue = 0;
				// change backwardAnimation value if needed 
				if (config.animationBackward) {
					backwardAnimation = (backwardAnimation == false);
					multIter = 1 - 2 * backwardAnimation;
				}
				// Check if animation is completed ;
				if (config.animation == false || animationCount >= config.animationCount || ctx.firstPass % 10 != 1) animationCompleted = true;
				//* (pause animation and replan it if additional iterations are required) or submit onAnimationComplete function;
				if (!animationCompleted) {
					if (!config.animationBackward) cntiter = 0;
					window.setTimeout(animLoop, config.animationPauseTime * 1000);
				} else {
					if (!testRedraw(ctx, data, config)) {
						if (typeof config.onAnimationComplete == "function" && (config.alwaysRunFunctionAtCompletion == true || ctx.runanimationcompletefunction == true)) {
							config.onAnimationComplete(ctx, config, data, 1, animationCount + 1, statData);
							ctx.runanimationcompletefunction = false;
						}
					}
					ctx.firstPass = 9;
					close_result(ctx);
				}
			} else {
				if (config.animationForceSetTimeOut) requestAnimFrameSetTimeOut(animLoop);
				else requestAnimFrame(animLoop);
			}
		};

		function drawFrame() {
			var easingFunction = animationOptions[config.animationEasing];
			var easeAdjustedAnimationPercent = (config.animation) ? CapValue(easingFunction(currentAnimationValue), null, 0) : 1;
			if (1 * cntiter >= 1 * CapValue(config.animationSteps, Number.MAX_VALUE, 1) || config.animation == false || ctx.firstPass % 10 != 1) easeAdjustedAnimationPercent = 1;
			else if (easeAdjustedAnimationPercent >= 1) easeAdjustedAnimationPercent = 0.9999;
			animationValues = {
				animationGlobal: currentAnimationValue,
				yAxis: computeAnimation(currentAnimationValue, config, config.animationYAxis, config.animationYAxisEasing, -1, -1, null, null, ""),
				radius: computeAnimation(currentAnimationValue, config, config.animationRadius, config.animationRadiusEasing, -1, -1, null, null, ""),
				rotate: computeAnimation(currentAnimationValue, config, config.animationRotate, config.animationRotateEasing, -1, -1, null, null, "")
			};
			if (config.animation && !(isIE() < 9 && isIE() != false) && config.clearRect) {
				ctx.clearRect(clrx, clry, clrwidth, clrheight);
			}
			dispCrossImage(ctx, config, midPosX, midPosY, borderX, borderY, false, data, animationValues.animationGlobal, cntiter);
			dispCrossText(ctx, config, midPosX, midPosY, borderX, borderY, false, data, animationValues.animationGlobal, cntiter);
			if (typeof config.beforeDrawFunction == "function") config.beforeDrawFunction("BEFOREDRAWFUNCTION", ctx, data, statData, -1, -1, {
				animationValue: animationValues.animationGlobal,
				cntiter: cntiter,
				config: config,
				borderX: borderX,
				borderY: borderY,
				midPosX: midPosX,
				midPosY: midPosY
			});
			if (config.saveBackImage) {
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.putImageData(ctx.savedImage, 0, 0);
			}
			if (config.scaleOverlay) {
				drawData(animationValues);
				if (typeof config.endDrawDataFunction == "function") config.endDrawDataFunction("ENDDATAFUNCTION", ctx, data, statData, -1, -1, {
					animationValue: animationValues.animationGlobal,
					cntiter: cntiter,
					config: config,
					borderX: borderX,
					borderY: borderY,
					midPosX: midPosX,
					midPosY: midPosY
				});
				drawScale();
				if (typeof config.endDrawScaleFunction == "function") config.endDrawScaleFunction("ENDSCALEFUNCTION", ctx, data, statData, -1, -1, {
					animationValue: animationValues.animationGlobal,
					cntiter: cntiter,
					config: config,
					borderX: borderX,
					borderY: borderY,
					midPosX: midPosX,
					midPosY: midPosY
				});
			} else {
				drawScale();
				if (typeof config.endDrawScaleFunction == "function") config.endDrawScaleFunction("ENDSCALEFUNCTION", ctx, data, statData, -1, -1, {
					animationValue: animationValues.animationGlobal,
					cntiter: cntiter,
					config: config,
					borderX: borderX,
					borderY: borderY,
					midPosX: midPosX,
					midPosY: midPosY
				});
				drawData(animationValues);
				if (typeof config.endDrawDataFunction == "function") config.endDrawDataFunction("ENDDATAFUNCTION", ctx, data, statData, -1, -1, {
					animationValue: animationValues.animationGlobal,
					cntiter: cntiter,
					config: config,
					borderX: borderX,
					borderY: borderY,
					midPosX: midPosX,
					midPosY: midPosY
				});
			}
			dispCrossImage(ctx, config, midPosX, midPosY, borderX, borderY, true, data, animationValues.animationGlobal, cntiter);
			dispCrossText(ctx, config, midPosX, midPosY, borderX, borderY, true, data, animationValues.animationGlobal, cntiter);
			drawLegend(legendMsr, data, config, ctx, ctx.tpchart, cntiter);
		};
	};
	//Declare global functions to be called within this namespace here.
	// shim layer with setTimeout fallback
	var requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	var requestAnimFrameSetTimeOut = (function() {
		return function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	function computeScale(logarithm, steps_lim, mix_bar_line, mathFct, multAxis, cumulate, data, config, ctx, statData, availableHeight) {
		// mathFct : uniquement pour Bar et Line
		// get value bounds;
		var upperValue1 = -Number.MAX_VALUE;
		var lowerValue1 = Number.MAX_VALUE;
		var upperValue2 = -Number.MAX_VALUE;
		var lowerValue2 = Number.MAX_VALUE;
		var fnd_axis1;
		var fnd_axis2;
		var fnd_positif1;
		var fnd_negatif1;
		var fnd_positif2;
		var fnd_negatif2;
		var cum_positif1;
		var cum_negatif1;
		var cum_positif2;
		var cum_negatif2;
		var first_axis = false;
		var second_axis = false;
		var mathValueHeight;
		var first_positif1, first_negatif1;
		var first_positif2, first_negatif2;
		var i, j, maxi, axis;
		maxi = -1;
		var mathFctName;
		var mathValueHeightVal = [];
		if (mathFct) {
			for (var i = 0; i < data.datasets.length; i++) {
				mathFctName = data.datasets[i].drawMathDeviation;
				if (typeof eval(mathFctName) == "function") {
					var parameter = {
						data: data,
						datasetNr: i
					};
					mathValueHeightVal[i] = window[mathFctName](parameter);
				} else mathValueHeightVal[i] = 0;
			}
		};
		for (i = 0; i < data.datasets.length; i++) maxi = Math.max(data.datasets[i].data.length, maxi);
		for (j = 0; j < maxi; j++) {
			cum_positif1 = 0;
			cum_negatif1 = 0;
			fnd_axis1 = false;
			fnd_axis2 = false;
			fnd_positif1 = false;
			fnd_negatif1 = false;
			cum_positif2 = 0;
			cum_negatif2 = 0;
			fnd_positif2 = false;
			fnd_negatif2 = false;
			for (i = 0; i < data.datasets.length; i++) {
				if (mathFct) {
					if (typeof mathValueHeightVal[i] == "object") mathValueHeight = mathValueHeightVal[i][Math.min(mathValueHeightVal[i].length, j)];
					else mathValueHeight = mathValueHeightVal[i];
				} else mathValueHeight = 0;
				if (typeof data.datasets[i].data[j] == "undefined") continue;
				axis = 1;
				if (!cumulate) { // line, Bar and HorizontalBar, radar
					if (multAxis && data.datasets[i].axis == 2) axis = 2; // for line & Bar charts, axis is 1 or 2;
				} else { // StackedBar, HorizontalStackedBar;
					if (mix_bar_line && multAxis && cumulate && data.datasets[i].axis == 2 && data.datasets[i].type == "Line") axis = 2; // for stackedBar, axis is 1 or 2 but axis 2 is only for the possible line;  
				}
				if (!cumulate || (cumulate && mix_bar_line && data.datasets[i].type == "Line")) {
					if (axis == 1) {
						first_axis = true;
						fnd_axis1 = true;
						upperValue1 = Math.max(upperValue1, 1 * data.datasets[i].data[j] + mathValueHeight);
						lowerValue1 = Math.min(lowerValue1, 1 * data.datasets[i].data[j] - mathValueHeight);
					} else {
						fnd_axis2 = true;
						second_axis = true;
						upperValue2 = Math.max(upperValue2, 1 * data.datasets[i].data[j] + mathValueHeight);
						lowerValue2 = Math.min(lowerValue2, 1 * data.datasets[i].data[j] - mathValueHeight);
					}
				} else {
					if (axis == 1) {
						fnd_axis1 = true;
						first_axis = true;
						if (1 * data.datasets[i].data[j] == 0 && !first_positif1 && !first_negatif1) {
							first_positif1 = 0;
							first_negatif1 = 0;
							fnd_positif1 = true;
							fnd_negatif1 = true;
						} else if (1 * data.datasets[i].data[j] > 0) {
							if (!fnd_positif1) first_positif1 = 1 * data.datasets[i].data[j];
							fnd_positif1 = true;
							cum_positif1 += 1 * data.datasets[i].data[j];
						} else if (1 * data.datasets[i].data[j] < 0) {
							if (!fnd_negatif1) first_negatif1 = 1 * data.datasets[i].data[j];
							fnd_negatif1 = true;
							cum_negatif1 += 1 * data.datasets[i].data[j];
						}
					} else {
						fnd_axis2 = true;
						second_axis = true;
						if (1 * data.datasets[i].data[j] == 0 && !first_positif2 && !first_negatif2) {
							first_positif2 = 0;
							fnd_positif2 = true;
						} else if (1 * data.datasets[i][j] > 0) {
							if (!fnd_positif2) first_positif2 = 1 * data.datasets[i].data[j];
							fnd_positif2 = true;
							cum_positif2 += 1 * data.datasets[i].data[j];
						} else if (1 * data.datasets[i][j] < 0) {
							if (!fnd_negatif2) first_negatif2 = 1 * data.datasets[i].data[j];
							fnd_negatif2 = true;
							cum_negatif2 += 1 * data.datasets[i].data[j];
						}
					}
				}
			}
			if (cumulate) {
				if (fnd_axis1) {
					if (fnd_positif1) upperValue1 = Math.max(upperValue1, cum_positif1 + mathValueHeight);
					else if (fnd_negatif1) upperValue1 = Math.max(upperValue1, cum_negatif1 + mathValueHeight, first_negatif1);
					if (fnd_negatif1) lowerValue1 = Math.min(lowerValue1, cum_negatif1 - mathValueHeight);
					else if (fnd_positif1) lowerValue1 = Math.min(lowerValue1, cum_positif1 - mathValueHeight, first_positif1);
				}
				if (fnd_axis2) {
					if (fnd_positif2) upperValue2 = Math.max(upperValue2, cum_positif2 + mathValueHeight);
					else if (fnd_negatif2) upperValue2 = Math.max(upperValue2, cum_negatif2 + mathValueHeight, first_negatif1);
					if (fnd_negatif2) lowerValue2 = Math.min(lowerValue2, cum_negatif2 - mathValueHeight);
					else if (fnd_positif2) lowerValue2 = Math.min(lowerValue2, cum_positif2 - mathValueHeight);
				}
			}
		};
		if (!second_axis) {
			upperValue2 = upperValue1;
			lowerValue2 = lowerValue1;
		} else if (!first_axis) {
			upperValue1 = upperValue2;
			lowerValue1 = lowerValue2;
		}
		// force values to zero when all data are empty;
		if (upperValue1 < lowerValue1) {
			if (upperValue2 < lowerValue2) {
				upperValue2 = 0;
				lowerValue2 = 0;
			}
			upperValue1 = upperValue2;
			lowerValue1 = lowerValue2;
		}
		if (upperValue2 < lowerValue2) {
			upperValue2 = upperValue1;
			lowerValue2 = upperValue2;
		}

		function correctValue(upperValue, lowerValue, config) {
			// correct upper and lower value when they are identical;
			if (Math.abs(upperValue - lowerValue) < config.zeroValue) {
				if (Math.abs(upperValue) < config.zeroValue) upperValue = .9;
				if (upperValue > 0) {
					upperValue = upperValue * 1.1;
					lowerValue = lowerValue * 0.9;
				} else {
					upperValue = upperValue * 0.9;
					lowerValue = lowerValue * 1.1;
				}
			}
			return {
				upperValue: upperValue,
				lowerValue: lowerValue
			};
		};
		var value1 = correctValue(upperValue1, lowerValue1, config);
		var value2 = correctValue(upperValue2, lowerValue2, config);
		upperValue1 = value1.upperValue;
		lowerValue1 = value1.lowerValue;
		upperValue2 = value2.upperValue;
		lowerValue2 = value2.lowerValue;
		if (typeof config.graphMin == "function") lowerValue1 = setOptionValue(true, true, 1, "GRAPHMIN", ctx, data, statData, undefined, config.graphMin, "graphMin", -1, -1, {
			nullValue: true
		})
		else if (!isNaN(config.graphMin)) {
			if (config.forceGraphMin) lowerValue1 = config.graphMin;
			else lowerValue1 = Math.min(lowerValue1, config.graphMin);
		}
		if (typeof config.graphMax == "function") upperValue1 = setOptionValue(true, true, 1, "GRAPHMAX", ctx, data, statData, undefined, config.graphMax, "graphMax", -1, -1, {
			nullValue: true
		})
		else if (!isNaN(config.graphMax)) {
			if (config.forceGraphMax) upperValue1 = config.graphMax;
			else upperValue1 = Math.max(upperValue1, config.graphMax);
		}
		if (typeof config.graphMin2 == "function") lowerValue2 = setOptionValue(true, true, 1, "GRAPHMIN", ctx, data, statData, undefined, config.graphMin2, "graphMin2", -1, -1, {
			nullValue: true
		})
		else if (!isNaN(config.graphMin2)) {
			if (config.forceGraphMin2) lowerValue2 = config.graphMin2;
			else lowerValue2 = Math.min(lowerValue2, config.graphMin2);
		}
		if (typeof config.graphMax2 == "function") upperValue2 = setOptionValue(true, true, 1, "GRAPHMAX", ctx, data, statData, undefined, config.graphMax2, "graphMax2", -1, -1, {
			nullValue: true
		})
		else if (!isNaN(config.graphMax2)) {
			if (config.forceGraphMax2) upperValue2 = config.graphMax2;
			else upperValue2 = Math.max(upperValue2, config.graphMax2);
		}
		if (upperValue1 < lowerValue1) {
			lowerValue1 = upperValue1 - 1;
		}
		if (upperValue2 < lowerValue2) {
			lowerValue2 = upperValue2 - 1;
		}
		var maxSteps = undefined;
		var minSteps = undefined;
		if (steps_lim) {
			labelHeight = (Math.ceil(ctx.chartTextScale * config.scaleFontSize));
			scaleHeight = availableHeight;
			maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
			minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
		} else {
			//        maxSteps=0;
			//        minSteps=0;
		}
		// Check if logarithm scale;
		var logarithm1, logarithm2, orderOfMagnitude;
		if (!logarithm || config.logarithmic === false || lowerValue1 < 0 || config.scaleOverride) logarithm1 = false;
		else {
			logarithm1 = true;
			// Check if logarithmic is meanigful
			OrderOfMagnitude = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(upperValue1) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(lowerValue1)));
			if (config.logarithmic == 'fuzzy' && OrderOfMagnitude < 4) logarithmic1 = false;
		}
		if (!logarithm || config.logarithmic2 === false || lowerValue2 < 0 || config.scaleOverride2) logarithm2 = false;
		else {
			logarithm2 = true;
			// Check if logarithmic is meanigful
			OrderOfMagnitude = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(upperValue2) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(lowerValue2)));
			if (config.logarithmic2 == 'fuzzy' && OrderOfMagnitude < 4) logarithmic2 = false;
		}
		// Compute scale;
		var labelTemplateString1 = "";
		var labelTemplateString2 = "";
		var scaleStartValue, scaleSteps, scaleStepWidth;
		var scaleAxisData1, scaleAxisData2;
		labelTemplateString1 = (config.scaleShowLabels) ? config.scaleLabel : "";
		if (!config.scaleOverride) {
			if ((maxSteps > 0 && minSteps > 0) || typeof maxSteps == "undefined") {
				scaleAxisData1 = calculateScale(logarithm1, config.yAxisMinimumInterval, config, maxSteps, minSteps, upperValue1, lowerValue1, steps_lim);
				if (config.forceScale == "steps" && typeof config.scaleSteps == "number") {
					scaleSteps = setOptionValue(true, true, 1, "SCALESTEPS", ctx, data, statData, undefined, config.scaleSteps, "scaleSteps", -1, -1, {
						nullValue: true
					});
					if (scaleSteps <= 0) scaleSteps = 1;
					scaleAxisData1 = {
						nbOfStepsAxis: scaleSteps,
						stepWidth: (scaleAxisData1.maxAxis - scaleAxisData1.minAxis) / scaleSteps,
						minAxis: scaleAxisData1.minAxis,
						maxAxis: scaleAxisData1.maxAxis
					}
				} else if (config.forceScale == "stepWidth" && typeof config.scaleStepWidth == "number") {
					scaleStepWidth = setOptionValue(true, true, 1, "SCALESTEPWIDTH", ctx, data, statData, undefined, config.scaleStepWidth, "scaleStepWidth", -1, -1, {
						nullValue: true
					});
					if (scaleStepWidth <= 0) scaleStepWidth = 1;
					scaleSteps = Math.ceil((scaleAxisData1.maxAxis - scaleAxisData1.minAxis) / scaleStepWidth);
					scaleAxisData1.maxAxis = scaleAxisData1.minAxis + scaleSteps * scaleStepWidth;
					if (!second_axis) {
						upperValue2 = scaleAxisData1.maxAxis;
					}
					scaleAxisData1 = {
						nbOfStepsAxis: scaleSteps,
						stepWidth: scaleStepWidth,
						minAxis: scaleAxisData1.minAxis,
						maxAxis: scaleAxisData1.maxAxis
					}
				}
			} else {
				scaleAxisData1 = {
					nbOfStepsAxis: 0,
					stepWidth: 0,
					minAxis: 0,
					maxAxis: 0
				}
			}
		} else {
			scaleStartValue = setOptionValue(true, true, 1, "SCALESTARTVALUE", ctx, data, statData, undefined, config.scaleStartValue, "scaleStartValue", -1, -1, {
				nullValue: true
			});
			if (scaleStartValue == "computed") scaleStartValue = lowerValue1;
			scaleSteps = setOptionValue(true, true, 1, "SCALESTEPS", ctx, data, statData, undefined, config.scaleSteps, "scaleSteps", -1, -1, {
				nullValue: true
			});
			scaleStepWidth = setOptionValue(true, true, 1, "SCALESTEPWIDTH", ctx, data, statData, undefined, config.scaleStepWidth, "scaleStepWidth", -1, -1, {
				nullValue: true
			});
			scaleAxisData1 = {
				nbOfStepsAxis: scaleSteps,
				stepWidth: scaleStepWidth,
				minAxis: scaleStartValue,
				maxAxis: scaleStartValue + scaleSteps * scaleStepWidth
			}
		}
		//			populateLabels(logarithm1,config.fmtYLabel, config, labelTemplateString1, scaleAxisData.labels, scaleAxisData.steps, scaleAxisData.graphMin, scaleAxisData.graphMax, scaleAxisData.stepValue);
		labelTemplateString2 = (config.scaleShowLabels2) ? config.scaleLabel2 : "";
		if (multAxis && (second_axis || config.forceSecondScale)) {
			if (!config.scaleOverride2) {
				if ((maxSteps > 0 && minSteps > 0) || typeof maxSteps == "undefined") {
					scaleAxisData2 = calculateScale(logarithm2, config.yAxisMinimumInterval2, config, maxSteps, minSteps, upperValue2, lowerValue2, steps_lim);
					if (config.forceScale2 == "steps" && typeof config.scaleSteps2 == "number") {
						scaleSteps = setOptionValue(true, true, 1, "SCALESTEPS2", ctx, data, statData, undefined, config.scaleSteps2, "scaleSteps2", -1, -1, {
							nullValue: true
						});
						if (scaleSteps <= 0) scaleSteps = 1;
						scaleAxisData2 = {
							nbOfStepsAxis: scaleSteps,
							stepWidth: (scaleAxisData2.maxAxis - scaleAxisData2.minAxis) / scaleSteps,
							minAxis: scaleAxisData2.minAxis,
							maxAxis: scaleAxisData2.maxAxis
						}
					} else if (config.forceScale2 == "stepWidth" && typeof config.scaleStepWidth2 == "number") {
						scaleStepWidth = setOptionValue(true, true, 1, "SCALESTEPWIDTH2", ctx, data, statData, undefined, config.scaleStepWidth2, "scaleStepWidth2", -1, -1, {
							nullValue: true
						});
						if (scaleStepWidth <= 0) scaleStepWidth = 1;
						scaleSteps = Math.ceil((scaleAxisData2.maxAxis - scaleAxisData2.minAxis) / scaleStepWidth);
						scaleAxisData2.maxAxis = scaleAxisData2.minAxis + scaleSteps * scaleStepWidth;
						scaleAxisData2 = {
							nbOfStepsAxis: scaleSteps,
							stepWidth: scaleStepWidth,
							minAxis: scaleAxisData2.minAxis,
							maxAxis: scaleAxisData2.maxAxis
						}
					}
				} else {
					scaleAxisData2 = {
						nbOfStepsAxis: 0,
						stepWidth: 0,
						minAxis: 0,
						maxAxis: 0
					}
				}
			} else {
				scaleStartValue = setOptionValue(true, true, 1, "SCALESTARTVALUE2", ctx, data, statData, undefined, config.scaleStartValue2, "scaleStartValue2", -1, -1, {
					nullValue: true
				});
				scaleSteps = setOptionValue(true, true, 1, "SCALESTEPS2", ctx, data, statData, undefined, config.scaleSteps2, "scaleSteps2", -1, -1, {
					nullValue: true
				});
				scaleStepWidth = setOptionValue(true, true, 1, "SCALESTEPWIDTH2", ctx, data, statData, undefined, config.scaleStepWidth2, "scaleStepWidth2", -1, -1, {
					nullValue: true
				});
				scaleAxisData2 = {
					nbOfStepsAxis: scaleSteps,
					stepWidth: scaleStepWidth,
					minAxis: scaleStartValue,
					maxAxis: scaleStartValue + scaleSteps * scaleStepWidth
				}
			}
			//			  populateLabels(logarithm2,config.fmtYLabel2, config, labelTemplateString2, scaleAxisData2.labels, scaleAxisData2.steps, scaleAxisData2.graphMin, scaleAxisData2.graphMax, scaleAxisData2.stepValue);
		} else {
			scaleAxisData2 = {
				nbOfStepsAxis: scaleAxisData1.nbOfStepsAxis,
				stepWidth: scaleAxisData1.stepWidth,
				minAxis: scaleAxisData1.minAxis,
				maxAxis: scaleAxisData1.maxAxis
			}
			if (config.forceNbOfStepsAxis2) {
				scaleSteps = setOptionValue(true, true, 1, "SCALESTEPS2", ctx, data, statData, undefined, config.scaleSteps2, "scaleSteps2", -1, -1, {
					nullValue: true
				});
				if (scaleSteps <= 0) scaleSteps = 1;
				scaleAxisData2 = {
					nbOfStepsAxis: scaleSteps,
					stepWidth: (scaleAxisData2.maxAxis - scaleAxisData2.minAxis) / scaleSteps,
					minAxis: scaleAxisData2.minAxis,
					maxAxis: scaleAxisData2.maxAxis
				}
			}
		};
		return {
			/////////////////////////////////;
			// NOT USED VALUES;
			/////////////////////////////////;
			maxValue: upperValue1,
			minValue: lowerValue1,
			maxValue2: upperValue2,
			minValue2: lowerValue2,
			/////////////////////////////////;
			maxSteps: maxSteps,
			minSteps: minSteps,
			dbAxis: second_axis,
			logarithm1: logarithm1,
			logarithm2: logarithm2,
			labelTemplateString1: labelTemplateString1,
			labelTemplateString2: labelTemplateString2,
			minAxis1: scaleAxisData1.minAxis,
			maxAxis1: scaleAxisData1.maxAxis,
			nbOfStepsAxis1: scaleAxisData1.nbOfStepsAxis,
			stepWidthAxis1: scaleAxisData1.stepWidth,
			minAxis2: scaleAxisData2.minAxis,
			maxAxis2: scaleAxisData2.maxAxis,
			nbOfStepsAxis2: scaleAxisData2.nbOfStepsAxis,
			stepWidthAxis2: scaleAxisData2.stepWidth
		};
	};

	function populateLabels(logarithm, fmtYLabel, config, labelTemplateString, labels, numberOfSteps, graphMin, graphMax, stepValue) {
		var i;
		var value = graphMin;
		var decimalValue = stepValue;
		if (labelTemplateString) {
			for (i = 0; i < numberOfSteps + 1; i++) {
				if (logarithm) decimalValue = value;
				labels.push(tmpl(labelTemplateString, {
					value: fmtChartJS(config, 1 * value.toFixed(getDecimalPlaces(decimalValue)), fmtYLabel)
				}, config));
				if (!logarithm) value += stepValue;
				else value *= 10;
			}
		}
	};

	function getDecimalPlaces(num) {
		var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match) {
			return 0;
		}
		return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
	};
	var cache = {};
	//Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
	function tmpl(str, data, config) {
		newstr = str;
		if (newstr.substr(0, config.templatesOpenTag.length) == config.templatesOpenTag) newstr = "<%=" + newstr.substr(config.templatesOpenTag.length, newstr.length - config.templatesOpenTag.length);
		if (newstr.substr(newstr.length - config.templatesCloseTag.length, config.templatesCloseTag.length) == config.templatesCloseTag) newstr = newstr.substr(0, newstr.length - config.templatesCloseTag.length) + "%>";
		return tmplpart2(newstr, data);
	}

	function tmplpart2(str, data) {
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmplpart2(document.getElementById(str).innerHTML) :
			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +
				// Introduce the data as local variables using with(){}
				"with(obj){p.push('" +
				// Convert the template into pure JavaScript
				str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
		// Provide some basic currying to the user
		return data ? fn(data) : fn;
	};

	function calculateScale(logarithmic, yAxisMinimumInterval, config, maxSteps, minSteps, maxValue, minValue, steps_lim) {
		var graphMin, graphMax, graphRange, stepValue, numberOfSteps, valueRange, rangeOrderOfMagnitude, decimalNum;
		if (!logarithmic) { // no logarithmic scale
			valueRange = maxValue - minValue;
			rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);
			if (Math.abs(minValue) > config.zeroValue) graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
			else graphMin = 0;
			if (Math.abs(maxValue) > config.zeroValue) graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
			else graphMax = 0;
			if (typeof yAxisMinimumInterval == "number") {
				if (graphMax >= 0) {
					graphMin = graphMin - (graphMin % yAxisMinimumInterval);
					while (graphMin > minValue) graphMin = graphMin - yAxisMinimumInterval;
					if (graphMax % yAxisMinimumInterval > config.zeroValue && graphMax % yAxisMinimumInterval < yAxisMinimumInterval - config.zeroValue) {
						graphMax = roundScale(config, (1 + Math.floor(graphMax / yAxisMinimumInterval)) * yAxisMinimumInterval);
					}
					while (graphMax < maxValue) graphMax = graphMax + yAxisMinimumInterval;
				}
			}
		} else { // logarithmic scale
			if (minValue == maxValue) maxValue = maxValue + 1;
			if (minValue == 0) minValue = 0.01;
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
			if (steps_lim) {
				while (!stopLoop && (numberOfSteps < minSteps || numberOfSteps > maxSteps)) {
					if (numberOfSteps < minSteps) {
						if (typeof yAxisMinimumInterval == "number") {
							if (stepValue / 2 < yAxisMinimumInterval) {
								stopLoop = true;
								stepValue = yAxisMinimumInterval;
								numberOfSteps = Math.ceil(graphRange / stepValue);
							}
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
			if (config.graphMaximized == true || config.graphMaximized == "bottom" || typeof config.graphMin !== "undefined") {
				while (graphMin + stepValue < minValue && numberOfSteps >= 3) {
					graphMin += stepValue;
					numberOfSteps--
				};
			}
			if (config.graphMaximized == true || config.graphMaximized == "top" || typeof config.graphMax !== "undefined") {
				while (graphMin + (numberOfSteps - 1) * stepValue >= maxValue && numberOfSteps >= 3) numberOfSteps--;
			}
		} else { // logarithmic scale
			numberOfSteps = rangeOrderOfMagnitude; // so scale is 10,100,1000,...
		}
		return {
			nbOfStepsAxis: numberOfSteps,
			stepWidth: stepValue,
			minAxis: graphMin,
			maxAxis: graphMin + numberOfSteps * stepValue
		}
	};

	function calculateOrderOfMagnitude(val) {
		if (val == 0) return 0;
		return Math.floor(Math.log(val) / Math.LN10);
	};

	function roundScale(config, value) {
		var scldec = 0;
		var sscl = "" + config.yAxisMinimumInterval;
		if (sscl.indexOf(".") > 0) {
			scldec = sscl.substr(sscl.indexOf(".")).length;
		}
		return (Math.round(value * Math.pow(10, scldec)) / Math.pow(10, scldec));
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

	function mergeChartConfig(defaults, userDefined) {
		var returnObj = {};
		for (var attrname in defaults) {
			returnObj[attrname] = defaults[attrname];
		}
		for (var attrnameBis in userDefined) {
			returnObj[attrnameBis] = userDefined[attrnameBis];
		}
		return returnObj;
	};

	function dispCrossText(ctx, config, posX, posY, borderX, borderY, overlay, data, animPC, cntiter) {
		var i, disptxt, txtposx, txtposy, textAlign, textBaseline;
		for (i = 0; i < config.crossText.length; i++) {
			if (config.crossText[i] != "" && config.crossTextOverlay[Min([i, config.crossTextOverlay.length - 1])] == overlay && ((cntiter == 1 && config.crossTextIter[Min([i, config.crossTextIter.length - 1])] == "first") || config.crossTextIter[Min([i, config.crossTextIter.length - 1])] == cntiter || config.crossTextIter[Min([i, config.crossTextIter.length - 1])] == "all" || (animPC == 1 && config.crossTextIter[Min([i, config.crossTextIter.length - 1])] == "last"))) {
				ctx.save();
				ctx.beginPath();
				ctx.font = config.crossTextFontStyle[Min([i, config.crossTextFontStyle.length - 1])] + " " + (Math.ceil(ctx.chartTextScale * config.crossTextFontSize[Min([i, config.crossTextFontSize.length - 1])])).toString() + "px " + config.crossTextFontFamily[Min([i, config.crossTextFontFamily.length - 1])];
				ctx.fillStyle = config.crossTextFontColor[Min([i, config.crossTextFontColor.length - 1])];
				textAlign = config.crossTextAlign[Min([i, config.crossTextAlign.length - 1])];
				textBaseline = config.crossTextBaseline[Min([i, config.crossTextBaseline.length - 1])];
				txtposx = 1 * Math.ceil(ctx.chartSpaceScale * config.crossTextPosX[Min([i, config.crossTextPosX.length - 1])]);
				txtposy = 1 * Math.ceil(ctx.chartSpaceScale * config.crossTextPosY[Min([i, config.crossTextPosY.length - 1])]);
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
				var rotateVal = Math.PI * config.crossTextAngle[Min([i, config.crossTextAngle.length - 1])] / 180;
				ctx.rotate(rotateVal);
				if (config.crossText[i].substring(0, 1) == "%") {
					if (typeof config.crossTextFunction == "function") disptxt = config.crossTextFunction(i, config.crossText[i], ctx, config, posX, posY, borderX, borderY, overlay, data, animPC);
				} else disptxt = config.crossText[i];
				setTextBordersAndBackground(ctx, disptxt, Math.ceil(ctx.chartTextScale * config.crossTextFontSize[Min([i, config.crossTextFontSize.length - 1])]), 0, 0, config.crossTextBorders[Min([i, config.crossTextBorders.length - 1])], config.crossTextBordersSelection[Min([i, config.crossTextBorders.length - 1])], config.crossTextBordersColor[Min([i, config.crossTextBordersColor.length - 1])], Math.ceil(ctx.chartLineScale * config.crossTextBordersWidth[Min([i, config.crossTextBordersWidth.length - 1])]), Math.ceil(ctx.chartSpaceScale * config.crossTextBordersXSpace[Min([i, config.crossTextBordersXSpace.length - 1])]), Math.ceil(ctx.chartSpaceScale * config.crossTextBordersYSpace[Min([i, config.crossTextBordersYSpace.length - 1])]), config.crossTextBordersStyle[Min([i, config.crossTextBordersStyle.length - 1])], config.crossTextBackgroundColor[Min([i, config.crossTextBackgroundColor.length - 1])], "CROSSTEXT", config.crossTextBordersRadius);
				if ((animPC == 1 && config.crossTextIter[Min([i, config.crossTextIter.length - 1])] == "all") || config.crossTextIter[Min([i, config.crossTextIter.length - 1])] != "last") {
					ctx.fillTextMultiLine(disptxt, 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.crossTextFontSize[Min([i, config.crossTextFontSize.length - 1])]), true, config.detectMouseOnText, ctx, "CROSSTEXT_TEXTMOUSE", rotateVal, 1 * txtposx, 1 * txtposy, i, -1);
				} else ctx.fillTextMultiLine(disptxt, 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.crossTextFontSize[Min([i, config.crossTextFontSize.length - 1])]), true, false, ctx, "CROSSTEXT_TEXTMOUSE", rotateVal, 1 * txtposx, 1 * txtposy, i, -1);
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
				imageposx = 1 * Math.ceil(ctx.chartSpaceScale * config.crossImagePosX[Min([i, config.crossImagePosX.length - 1])]);
				imageposy = 1 * Math.ceil(ctx.chartSpaceScale * config.crossImagePosY[Min([i, config.crossImagePosY.length - 1])]);
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
	function setMeasures(data, config, ctx, canvasheight, canvaswidth, ylabels, ylabels2, reverseLegend, reverseAxis, drawAxis, legendBox, typegraph) {
		var height = canvasheight;
		var width = canvaswidth;
		if (window.devicePixelRatio > 1) {
			height = height / window.devicePixelRatio;
			width = width / window.devicePixelRatio;
		}
		if (config.canvasBackgroundColor != "none") ctx.canvas.style.background = config.canvasBackgroundColor;
		var i, j, k;
		var borderHeight = 0;
		var borderTHeight = 0;
		var borderBHeight = 0;
		var borderRHeight = 0;
		var borderLHeight = 0;
		var graphTitleHeight = 0;
		var graphTitlePosY = 0;
		var graphSubTitleHeight = 0;
		var graphSubTitlePosY = 0;
		var footNoteHeight = 0;
		var footNotePosY = 0;
		//		ctx.widthAtSetMeasures=width;
		//		ctx.heightAtSetMeasures=height;
		var currentPosition, topNotUsableHeight, bottomNotUsableHeight, leftNotUsableWidth, rightNotUsableWidth, availableWidth, availableHeight;
		availableWidth = width;
		availableHeight = height;
		//// Step 0 : border height;
		// Borders height (and width);
		if (config.canvasBorders && config.canvasBordersSelection > 0) {
			borderHeight = Math.ceil(ctx.chartLineScale * config.canvasBordersWidth);
			if (isBorder(config.canvasBordersSelection, "TOP")) borderTHeight = borderHeight;
			if (isBorder(config.canvasBordersSelection, "BOTTOM")) borderBHeight = borderHeight;
			if (isBorder(config.canvasBordersSelection, "RIGHT")) borderRHeight = borderHeight;
			if (isBorder(config.canvasBordersSelection, "LEFT")) borderLHeight = borderHeight;
		}
		//// Step 1 : compute height/width and position of top elements;
		currentPosition = 0 + borderTHeight + Math.ceil(ctx.chartSpaceScale * config.spaceTop);
		// Title height - Title Position;
		if (config.graphTitle.trim() != "") {
			graphTitleHeight = (Math.ceil(ctx.chartTextScale * config.graphTitleFontSize)) * (config.graphTitle.split("\n").length || 1) + Math.ceil(ctx.chartSpaceScale * config.graphTitleSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.graphTitleSpaceAfter);
			graphTitlePosY = currentPosition + Math.ceil(ctx.chartSpaceScale * config.graphTitleSpaceBefore)
			if (config.graphTitleBackgroundColor != "none" || config.graphTitleBorders) {
				graphTitleHeight += (isBorder(config.graphTitleBordersSelection, "TOP") + isBorder(config.graphTitleBordersSelection, "BOTTOM")) * (Math.ceil(ctx.chartSpaceScale * config.graphTitleBordersYSpace));
				graphTitlePosY += isBorder(config.graphTitleBordersSelection, "TOP") * Math.ceil(ctx.chartSpaceScale * config.graphTitleBordersYSpace);
			}
			if (config.graphTitleBorders) {
				graphTitleHeight += (isBorder(config.graphTitleBordersSelection, "TOP") + isBorder(config.graphTitleBordersSelection, "BOTTOM")) * (Math.ceil(ctx.chartLineScale * config.graphTitleBordersWidth));
				graphTitlePosY += isBorder(config.graphTitleBordersSelection, "TOP") * Math.ceil(ctx.chartLineScale * config.graphTitleBordersWidth);
			}
			currentPosition += graphTitleHeight;
		}
		// subTitle height - position;
		if (config.graphSubTitle.trim() != "") {
			graphSubTitleHeight = (Math.ceil(ctx.chartTextScale * config.graphSubTitleFontSize)) * (config.graphSubTitle.split("\n").length || 1) + Math.ceil(ctx.chartSpaceScale * config.graphSubTitleSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.graphSubTitleSpaceAfter);
			graphSubTitlePosY = currentPosition + Math.ceil(ctx.chartSpaceScale * config.graphSubTitleSpaceBefore);
			if (config.graphSubTitleBackgroundColor != "none" || config.graphSubTitleBorders) {
				graphSubTitleHeight += 2 * (Math.ceil(ctx.chartSpaceScale * config.graphSubTitleBordersYSpace));
				graphSubTitlePosY += Math.ceil(ctx.chartSpaceScale * config.graphSubTitleBordersYSpace);
			}
			if (config.graphSubTitleBorders) {
				graphSubTitleHeight += (isBorder(config.graphTitleBordersSelection, "TOP") + isBorder(config.graphTitleBordersSelection, "BOTTOM")) * (Math.ceil(ctx.chartLineScale * config.graphSubTitleBordersWidth));
				graphSubTitlePosY += isBorder(config.graphTitleBordersSelection, "TOP") * Math.ceil(ctx.chartLineScale * config.graphSubTitleBordersWidth);
			}
			currentPosition += graphSubTitleHeight;
		}
		topNotUsableHeight = currentPosition;
		availableHeight -= topNotUsableHeight;
		//// Step 2 : compute height/width and position of bottom elements;
		currentPosition = height - borderBHeight - Math.ceil(ctx.chartSpaceScale * config.spaceBottom);
		// footNote
		if (typeof(config.footNote) != "undefined") {
			if (config.footNote.trim() != "") {
				footNoteHeight = (Math.ceil(ctx.chartTextScale * config.footNoteFontSize)) * (config.footNote.split("\n").length || 1) + Math.ceil(ctx.chartSpaceScale * config.footNoteSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.footNoteSpaceAfter);
				footNotePosY = currentPosition - Math.ceil(ctx.chartSpaceScale * config.footNoteSpaceAfter);
				if (config.footNoteBackgroundColor != "none" || config.footNoteBorders) {
					footNoteHeight += 2 * (Math.ceil(ctx.chartSpaceScale * config.footNoteBordersYSpace));
					footNotePosY -= Math.ceil(ctx.chartSpaceScale * config.footNoteBordersYSpace);
				}
				if (config.footNoteBorders) {
					footNoteHeight += (isBorder(config.footNoteBordersSelection, "TOP") + isBorder(config.footNoteBordersSelection, "BOTTOM")) * (Math.ceil(ctx.chartLineScale * config.footNoteBordersWidth));
					footNotePosY -= isBorder(config.footNoteBordersSelection, "BOTTOM") * Math.ceil(ctx.chartLineScale * config.footNoteBordersWidth);
				}
				currentPosition -= footNoteHeight;
			}
		}
		bottomNotUsableHeight = height - currentPosition;
		availableHeight -= bottomNotUsableHeight;
		//// Step 3 : compute height/width and position of left elements;
		currentPosition = 0 + borderLHeight + Math.ceil(ctx.chartSpaceScale * config.spaceLeft);
		// No left element to be drawn;
		leftNotUsableWidth = currentPosition;
		availableWidth -= leftNotUsableWidth;
		//// Step 4 : compute height/width and position of right elements;
		currentPosition = width - borderRHeight - Math.ceil(ctx.chartSpaceScale * config.spaceRight);
		// No right element to be drawn;
		rightNotUsableWidth = width - currentPosition;
		availableWidth -= rightNotUsableWidth;
		topNotUsableHeight += Math.ceil(ctx.chartSpaceScale * config.graphSpaceBefore);
		bottomNotUsableHeight += Math.ceil(ctx.chartSpaceScale * config.graphSpaceAfter);
		availableHeight -= (Math.ceil(ctx.chartSpaceScale * config.graphSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.graphSpaceAfter));
		//// Step 5  : compute widest text legend;
		var nbeltLegend = 0;
		var widestLegend = -99999999;
		var highestLegend = 0;
		var drawLegendData;
		if (typeof(config.legend) != "undefined") {
			if (config.legend == true) {
				ctx.font = (Math.ceil(ctx.chartTextScale * config.legendFontSize)).toString() + "px " + config.legendFontFamily;
				//				ctx.font = config.legendFontStyle + " " + (Math.ceil(ctx.chartTextScale*config.legendFontSize)).toString() + "px " + config.legendFontFamily;
				var textLength;
				for (i = 0; i < data.datasets.length; i++) {
					if (!config.legendDrawEmptyData) {
						drawLegendData = false;
						for (j = 0; j < data.datasets[i].data.length; j++) {
							if (typeof(1 * data.datasets[i].data[j]) == "number") {
								if (1 * data.datasets[i].data[j] != 0) drawLegendData = true;
							}
						}
					} else drawLegendData = true;
					if (drawLegendData && typeof(data.datasets[i].title) == "string") {
						if (data.datasets[i].title.trim() != "") {
							nbeltLegend++;
							textLength = ctx.measureTextMultiLine(fmtChartJS(config, data.datasets[i].title, config.fmtLegend), Math.ceil(ctx.chartTextScale * config.legendFontSize));
							widestLegend = Math.max(textLength.textWidth, widestLegend);
							highestLegend = Math.max(Math.ceil(ctx.chartTextScale * config.legendFontSize), highestLegend);
						}
					}
				}
				widestLegend += Math.ceil(ctx.chartTextScale * config.legendBlockSize) + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenBoxAndText);
				if (nbeltLegend == 0 || (nbeltLegend == 1 && !config.showSingleLegend)) widestLegend = 0;
			}
		}
		//// Step 6  : compute legend heights and width if legendPosY = 0 or 4 or if legendPosX = 0 or 4; 
		var legendBorderHeight = 0;
		var legendBorderWidth = 0;
		var spaceLegendHeight = 0;
		var xLegendPos = 0;
		var yLegendPos = 0;
		var nbLegendLines = 0;
		var nbLegendCols = 0;
		var legendHeight = 0;
		var legendWidth = 0;
		var msrLegend;
		if (widestLegend > -99999998) {
			if (config.legendPosY == 0 || config.legendPosY == 4) {
				var availableLegendWidth, maxLegendOnLine;
				if (config.legendPosX == 1 || config.legendPosX == 2 || config.legendPosX == 3) {
					availableLegendWidth = availableWidth - Math.ceil(ctx.chartSpaceScale * Math.ceil(ctx.chartSpaceScale * config.legendSpaceLeftText)) - Math.ceil(ctx.chartSpaceScale * config.legendSpaceRightText);
				} else {
					availableLegendWidth = width - borderRHeight - borderLHeight - Math.ceil(ctx.chartSpaceScale * config.spaceLeft) - Math.ceil(ctx.chartSpaceScale * config.spaceRight) - Math.ceil(ctx.chartSpaceScale * Math.ceil(ctx.chartSpaceScale * config.legendSpaceLeftText)) - Math.ceil(ctx.chartSpaceScale * config.legendSpaceRightText);
				}
				if (config.legendBorders == true || config.legendFillColor != "rgba(0,0,0,0)") availableLegendWidth -= (config.legendBorders * (isBorder(config.legendBordersSelection, "RIGHT") + isBorder(config.legendBordersSelection, "LEFT")) * (Math.ceil(ctx.chartLineScale * config.legendBordersWidth)) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceRight));
				maxLegendOnLine = Min([Math.floor((availableLegendWidth + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextHorizontal)) / (widestLegend + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextHorizontal))), config.maxLegendCols]);
				nbLegendLines = Math.ceil(nbeltLegend / maxLegendOnLine);
				nbLegendCols = Math.ceil(nbeltLegend / nbLegendLines);
				msrLegend = measureLegend(data, ctx, config, widestLegend, highestLegend, nbLegendLines, nbLegendCols, availableLegendWidth);
				legendHeight = msrLegend.legendHeight;
				if (config.legendPosY == 0) {
					yLegendPos = topNotUsableHeight - Math.ceil(ctx.chartSpaceScale * config.graphSpaceBefore);
					topNotUsableHeight += legendHeight;
				} else {
					yLegendPos = height - bottomNotUsableHeight - legendHeight;
					bottomNotUsableHeight += legendHeight;
				}
				availableHeight -= legendHeight;
			} else if (config.legendPosX == 0 || config.legendPosX == 4) {
				var availableLegendHeight, maxLegendOnCols;
				availableLegendHeight = availableHeight - Math.ceil(ctx.chartSpaceScale * Math.ceil(ctx.chartSpaceScale * config.legendSpaceBeforeText)) - Math.ceil(ctx.chartSpaceScale * config.legendSpaceAfterText);
				availableLegendWidth = availableWidth - Math.ceil(ctx.chartSpaceScale * Math.ceil(ctx.chartSpaceScale * config.legendSpaceLeftText)) - Math.ceil(ctx.chartSpaceScale * config.legendSpaceRightText);
				if (config.legendBorders == true || config.legendFillColor != "rgba(0,0,0,0)") availableLegendHeight -= (config.legendBorders * (isBorder(config.legendBordersSelection, "BOTTOM") + isBorder(config.legendBordersSelection, "TOP")) * (Math.ceil(ctx.chartLineScale * config.legendBordersWidth)) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceAfter));
				maxLegendOnCols = Min([Math.floor((availableLegendHeight + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextVertical)) / (highestLegend + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextVertical))), config.maxLegendLines]);
				nbLegendCols = Math.ceil(nbeltLegend / maxLegendOnCols);
				nbLegendLines = Math.ceil(nbeltLegend / nbLegendCols);
				msrLegend = measureLegend(data, ctx, config, widestLegend, highestLegend, nbLegendLines, nbLegendCols, availableLegendWidth);
				legendWidth = msrLegend.legendWidth;
				if (config.legendPosX == 0) {
					xLegendPos = leftNotUsableWidth;
					leftNotUsableWidth += legendWidth;
				} else {
					xLegendPos = width - rightNotUsableWidth - legendWidth;
					rightNotUsableWidth += legendWidth;
				}
				availableWidth -= legendWidth;
			}
		}
		//// Step 7 - Compute Y Unit height and position;
		var yAxisUnit2 = "";
		if (config.yAxisRight) {
			yAxisUnit2 = config.yAxisUnit2;
			if (yAxisUnit2 == '') yAxisUnit2 = config.yAxisUnit;
		}
		var yAxisUnitPosY = 0;
		var yAxisUnitHeight = 0;
		var yAxisUnitWidth = 0;
		var yAxisUnit2Width = 0;
		if (drawAxis && ((config.yAxisUnit.trim() != "" && config.yAxisLeft) || (yAxisUnit2.trim() != "" && config.yAxisRight))) {
			yAxisUnitHeight = (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)) * (config.yAxisUnit.split("\n").length || 1) + Math.ceil(ctx.chartSpaceScale * config.yAxisUnitSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.yAxisUnitSpaceAfter);
			ctx.font = config.yAxisUnitFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)).toString() + "px " + config.yAxisUnitFontFamily;
			var yAxisUnitSize;
			yAxisUnitSize = ctx.measureTextMultiLine(config.yAxisUnit, (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)));
			yAxisUnitWidth = yAxisUnitSize.textWidth;
			yAxisUnitSize = ctx.measureTextMultiLine(yAxisUnit2, (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)));
			yAxisUnit2Width = yAxisUnitSize.textWidth;
			yAxisUnitPosY = topNotUsableHeight + Math.ceil(ctx.chartSpaceScale * config.yAxisUnitSpaceBefore) + yAxisUnitSize.textHeight;
			if (config.yAxisUnitBackgroundColor != "none" || config.yAxisUnitBorders) {
				yAxisUnitHeight += 2 * (Math.ceil(ctx.chartSpaceScale * config.yAxisUnitBordersYSpace));
				yAxisUnitPosY += Math.ceil(ctx.chartSpaceScale * config.yAxisUnitBordersYSpace);
			}
			if (config.yAxisUnitBorders) {
				yAxisUnitHeight += (isBorder(config.yAxisUnitBordersSelection, "TOP") + isBorder(config.yAxisUnitBordersSelection, "BOTTOM")) * (Math.ceil(ctx.chartLineScale * config.yAxisUnitBordersWidth));
				yAxisUnitPosY += isBorder(config.yAxisUnitBordersSelection, "TOP") * Math.ceil(ctx.chartLineScale * config.yAxisUnitBordersWidth);
			}
			topNotUsableHeight += yAxisUnitHeight;
			availableHeight -= yAxisUnitHeight;
		}
		//// Step 8 - compute Labels width;
		var widestXLabel = 0;
		var highestXLabel = 1;
		var widestTXLabel = 0;
		var highestTXLabel = 1;
		var xAxisLabelHeight = 0;
		var xTAxisLabelHeight = 0;
		var xAxisLabelPos = 0;
		var xTAxisLabelPos = 0;
		var widestYLabel = 0;
		var highestYLabel = 1;
		var widestYLabel2 = 0;
		var highestYLabel2 = 1;
		var yAxisLabelWidth = 0;
		var yAxisLabelPosLeft = 0;
		var yAxisLabelPosRight = 0;
		if (drawAxis) {
			var textMsr;
			// compute widest X label
			ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
			widestXLabel = Math.max(1, Math.ceil(ctx.chartTextScale * config.xScaleLabelsMinimumWidth));
			widestTXLabel = widestXLabel;
			for (i = 0; i < data.labels.length; i++) {
				if (showLabels(ctx, data, config, i) === true) {
					textMsr = ctx.measureTextMultiLine(fmtChartJS(config, data.labels[i], config.fmtXLabel), (Math.ceil(ctx.chartTextScale * config.scaleFontSize)));
					//If the text length is longer - make that equal to longest text!
					widestXLabel = Math.max(textMsr.textWidth, widestXLabel);
					highestXLabel = Math.max(textMsr.textHeight, highestXLabel);
				}
			}
			if (typeof data.Labels2 == "object" && config.xAxisBottom && config.xAxisTop) {
				ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
				for (i = 0; i < data.Labels2.length; i++) {
					if (showLabels(ctx, data, config, i) === true) {
						textMsr = ctx.measureTextMultiLine(fmtChartJS(config, data.Labels2[i], config.fmtTopXLabel), (Math.ceil(ctx.chartTextScale * config.scaleFontSize)));
						//If the text length is longer - make that equal to longest text!
						widestTXLabel = Math.max(textMsr.textWidth, widestTXLabel);
						highestTXLabel = Math.max(textMsr.textHeight, highestTXLabel);
					}
				}
			} else {
				widestTXLabel = widestXLabel;
				highestTXLabel = highestXLabel;
			}
			// xAxisLabel height;
			if (typeof(config.xAxisLabel) != "undefined" && config.xAxisBottom) {
				if (config.xAxisLabel.trim() != "") {
					xAxisLabelHeight = (Math.ceil(ctx.chartTextScale * config.xAxisFontSize)) * (config.xAxisLabel.split("\n").length || 1) + Math.ceil(ctx.chartSpaceScale * config.xAxisLabelSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.xAxisLabelSpaceAfter);
					xAxisLabelPos = (height - bottomNotUsableHeight) - Math.ceil(ctx.chartSpaceScale * config.xAxisLabelSpaceAfter);
					if (config.xAxisLabelBackgroundColor != "none" || config.footNoteBorders) {
						xAxisLabelHeight += 2 * (Math.ceil(ctx.chartSpaceScale * config.xAxisLabelBordersYSpace));
						xAxisLabelPos -= Math.ceil(ctx.chartSpaceScale * config.xAxisLabelBordersYSpace);
					}
					if (config.xAxisLabelBorders) {
						xAxisLabelHeight += (isBorder(config.xAxisLabelBordersSelection, "TOP") + isBorder(config.xAxisLabelBordersSelection, "BOTTOM")) * (Math.ceil(ctx.chartLineScale * config.xAxisLabelBordersWidth));
						xAxisLabelPos -= isBorder(config.xAxisLabelBordersSelection, "BOTTOM") * Math.ceil(ctx.chartLineScale * config.xAxisLabelBordersWidth);
					}
				}
			}
			var tLabelT;
			tLabelT = config.xAxisLabel;
			if (typeof(config.xTAxisLabel) != "undefined" && config.xAxisTop) {
				if (config.xTAxisLabel.trim() != "") tLabelT = config.xTAxisLabel;
			}
			if (typeof(tLabelT) != "undefined" && config.xAxisTop) {
				if (tLabelT.trim() != "") {
					xTAxisLabelHeight = (Math.ceil(ctx.chartTextScale * config.xAxisFontSize)) * (tLabelT.split("\n").length || 1) + Math.ceil(ctx.chartSpaceScale * config.xAxisLabelSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.xAxisLabelSpaceAfter);
					xTAxisLabelPos = topNotUsableHeight + Math.ceil(ctx.chartSpaceScale * config.xAxisLabelSpaceBefore);
					if (config.xAxisLabelBackgroundColor != "none") {
						xTAxisLabelHeight += 2 * (Math.ceil(ctx.chartSpaceScale * config.xAxisLabelBordersYSpace));
						xTAxisLabelPos += Math.ceil(ctx.chartSpaceScale * config.xAxisLabelBordersYSpace);
					}
					if (config.xAxisLabelBorders) {
						xTAxisLabelHeight += (isBorder(config.xAxisLabelBordersSelection, "TOP") + isBorder(config.xAxisLabelBordersSelection, "BOTTOM")) * (Math.ceil(ctx.chartLineScale * config.xAxisLabelBordersWidth));
						xTAxisLabelPos += isBorder(config.xAxisLabelBordersSelection, "TOP") * Math.ceil(ctx.chartLineScale * config.xAxisLabelBordersWidth);
					}
				}
			}
			// compute widest Y Label Width
			widestYLabel = Math.max(1, Math.ceil(ctx.chartTextScale * config.yScaleLabelsMinimumWidth));
			widestYLabel2 = widestYLabel;
			if (ylabels != null && ylabels != "nihil") {
				ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
				for (i = ylabels.length - 1; i >= 0; i--) {
					if (typeof(ylabels[i]) == "string") {
						if (showYLabels(ctx, data, config, i, ylabels[i])) {
							if (ylabels[i].trim() != "") {
								//								textMsr = ctx.measureTextMultiLine(fmtChartJS(config, ylabels[i], config.fmtYLabel), (Math.ceil(ctx.chartTextScale*config.scaleFontSize)));
								textMsr = ctx.measureTextMultiLine(ylabels[i], (Math.ceil(ctx.chartTextScale * config.scaleFontSize)));
								widestYLabel = Math.max(widestYLabel, textMsr.textWidth);
								highestYLabel = Math.max(highestYLabel, textMsr.textHeight);
							}
						}
					}
				}
			}
			if (ylabels2 != null && config.yAxisRight) {
				ctx.font = config.scaleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.scaleFontSize)).toString() + "px " + config.scaleFontFamily;
				for (i = ylabels2.length - 1; i >= 0; i--) {
					if (typeof(ylabels2[i]) == "string") {
						if (showYLabels(ctx, data, config, i, ylabels2[i])) {
							//							textMsr = ctx.measureTextMultiLine(fmtChartJS(config, ylabels2[i], config.fmtYLabel2), (Math.ceil(ctx.chartTextScale*config.scaleFontSize)));
							textMsr = ctx.measureTextMultiLine(ylabels2[i], (Math.ceil(ctx.chartTextScale * config.scaleFontSize)));
							widestYLabel2 = Math.max(textMsr.textWidth, widestYLabel2);
							highestYLabel2 = Math.max(textMsr.textHeight, highestYLabel2);
						}
					}
				}
			} else {
				widestYLabel2 = widestYLabel;
				highestYLabel2 = highestYLabel;
			}
			// yAxisLabel width;
			if (typeof(config.yAxisLabel) != "undefined" && (config.yAxisRight || config.yAxisLeft)) {
				if (config.yAxisLabel.trim() != "") {
          yAxisFontSize=config.yAxisFontSize;
          if (config.yAxisRight) {
            if (config.yAxisFontSize2 > config.yAxisFontSize)yAxisFontSize=config.yAxisFontSize2;
          }
					yAxisLabelWidth = (Math.ceil(ctx.chartTextScale * yAxisFontSize)) * (config.yAxisLabel.split("\n").length || 1) + Math.ceil(ctx.chartSpaceScale * config.yAxisLabelSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisLabelSpaceRight);
					yAxisLabelPosLeft = leftNotUsableWidth + Math.ceil(ctx.chartSpaceScale * config.yAxisLabelSpaceLeft) + (Math.ceil(ctx.chartTextScale * yAxisFontSize));
					yAxisLabelPosRight = (width - rightNotUsableWidth) - Math.ceil(ctx.chartSpaceScale * config.yAxisLabelSpaceLeft) - (Math.ceil(ctx.chartTextScale * yAxisFontSize));
					if (config.yAxisLabelBackgroundColor != "none" || config.yAxisLabelBorders) {
						yAxisLabelWidth += 2 * (Math.ceil(ctx.chartSpaceScale * config.yAxisLabelBordersYSpace));
						yAxisLabelPosLeft += Math.ceil(ctx.chartSpaceScale * config.yAxisLabelBordersYSpace);
						yAxisLabelPosRight -= Math.ceil(ctx.chartSpaceScale * config.yAxisLabelBordersYSpace);
					}
					if (config.yAxisLabelBorders) {
						yAxisLabelWidth += (isBorder(config.yAxisLabelBordersSelection, "TOP") + isBorder(config.yAxisLabelBordersSelection, "BOTTOM")) * (Math.ceil(ctx.chartLineScale * config.yAxisLabelBordersWidth));
						yAxisLabelPosLeft += isBorder(config.yAxisLabelBordersSelection, "TOP") * Math.ceil(ctx.chartLineScale * config.yAxisLabelBordersWidth);
						yAxisLabelPosRight -= isBorder(config.yAxisLabelBordersSelection, "TOP") * Math.ceil(ctx.chartLineScale * config.yAxisLabelBordersWidth);
					}
				}
			}
		}
		//// Step 9 - Compute x Label rotation;
		var rotateLabels = 0;
		var rotateTLabels = 0;
		var xLabelWidth = 0;
		var xTLabelWidth = 0;
		var xLabelHeight = 0;
		var xTLabelHeight = 0;
		var xLabelPos = 0;
		var xTLabelPos = 0;
		var widestLabel, highestLabel, nblab, labelAvailableWidth;
		if (drawAxis && config.xAxisBottom) {
			labelAvailableWidth = availableWidth;
			if (reverseAxis == false) {
				widestLabel = widestXLabel;
				highestLabel = highestXLabel;
				nblab = data.labels.length;
				if (config.yAxisLeft == true) labelAvailableWidth -= (widestYLabel + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight));
				if (config.yAxisRight == true) labelAvailableWidth -= (widestYLabel2 + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight));
			} else {
				widestLabel = widestYLabel;
				highestLabel = highestYLabel;
				nblab = ylabels.length;
				if (config.yAxisLeft == true) labelAvailableWidth -= (widestXLabel + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight));
				if (config.yAxisRight == true) labelAvailableWidth -= (widestTXLabel + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight));
			}
			if (typeof(config.yAxisLabel) != "undefined") {
				if (config.yAxisLabel.trim() != "") {
					if (config.yAxisRight) labelAvailableWidth -= yAxisLabelWidth;
					if (config.yAxisLeft) labelAvailableWidth -= yAxisLabelWidth;
				}
			}
			if (config.rotateLabels == "smart") {
				rotateLabels = 0;
				if ((labelAvailableWidth + Math.ceil(ctx.chartTextScale * config.xAxisSpaceBetweenLabels)) / nblab < (widestLabel + Math.ceil(ctx.chartTextScale * config.xAxisSpaceBetweenLabels))) {
					rotateLabels = 45;
					if (labelAvailableWidth / nblab < Math.abs(Math.cos(rotateLabels * Math.PI / 180) * widestLabel)) {
						rotateLabels = 90;
					}
				}
			} else {
				rotateLabels = config.rotateLabels;
				if (rotateLabels < 0) rotateLabels = 0;
				if (rotateLabels > 180) rotateLabels = 180;
			}
			if (rotateLabels > 90) rotateLabels += 180;
			xLabelHeight = Math.abs(Math.sin(rotateLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.sin((rotateLabels + 90) * Math.PI / 180) * highestLabel);
			xLabelWidth = Math.abs(Math.cos(rotateLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.cos((rotateLabels + 90) * Math.PI / 180) * highestLabel);
			xLabelPos = height - bottomNotUsableHeight - xAxisLabelHeight - xLabelHeight - Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceAfter);
		}
		if (drawAxis && config.xAxisTop) {
			labelAvailableWidth = availableWidth;
			if (reverseAxis == false) {
				widestLabel = widestTXLabel;
				highestLabel = highestTXLabel;
				nblab = data.labels.length;
				if (config.yAxisLeft == true) labelAvailableWidth -= (widestYLabel + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight));
				if (config.yAxisRight == true) labelAvailableWidth -= (widestYLabel2 + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight));
			} else {
				widestLabel = widestYLabel2;
				highestLabel = highestYLabel2;
				nblab = ylabels2.length;
				if (config.yAxisLeft == true) labelAvailableWidth -= (widestXLabel + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight));
				if (config.yAxisRight == true) labelAvailableWidth -= (widestTXLabel + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight));
			}
			if (typeof(config.yAxisLabel) != "undefined") {
				if (config.yAxisLabel.trim() != "") {
					if (config.yAxisRight) labelAvailableWidth -= yAxisLabelWidth;
					if (config.yAxisLeft) labelAvailableWidth -= yAxisLabelWidth;
				}
			}
			if (config.rotateTLabels == "smart") {
				rotateTLabels = 0;
				if ((labelAvailableWidth + Math.ceil(ctx.chartTextScale * config.xAxisSpaceBetweenLabels)) / nblab < (widestLabel + Math.ceil(ctx.chartTextScale * config.xAxisSpaceBetweenLabels))) {
					rotateTLabels = 45;
					if (labelAvailableWidth / nblab < Math.abs(Math.cos(rotateTLabels * Math.PI / 180) * widestLabel)) {
						rotateTLabels = 90;
					}
				}
			} else {
				rotateTLabels = config.rotateTLabels;
				if (rotateTLabels < 0) rotateTLabels = 0;
				if (rotateTLabels > 180) rotateTLabels = 180;
			}
			if (rotateLabels > 90) rotateLabels += 180;
			xTLabelHeight = Math.abs(Math.sin(rotateTLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.sin((rotateTLabels + 90) * Math.PI / 180) * highestLabel);
			xTLabelWidth = Math.abs(Math.cos(rotateTLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.cos((rotateTLabels + 90) * Math.PI / 180) * highestLabel);
			xTLabelPos = topNotUsableHeight + xTAxisLabelHeight + Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceBefore);
		}
		// recompute availableWidth/Height with axis label width/height and label width/height;
		var prevLeftNotUsableWidth = leftNotUsableWidth;
		var prevRightNotUsableWidth = rightNotUsableWidth;
		if (drawAxis && config.yAxisLeft) {
			if (reverseAxis == false) leftNotUsableWidth += yAxisLabelWidth + widestYLabel + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight);
			else leftNotUsableWidth += yAxisLabelWidth + widestXLabel + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight);
		}
		if (drawAxis && config.yAxisRight) {
			if (reverseAxis == false) rightNotUsableWidth += yAxisLabelWidth + widestYLabel2 + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight);
			else rightNotUsableWidth += yAxisLabelWidth + widestTXLabel + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight);
		}
		availableWidth = width - leftNotUsableWidth - rightNotUsableWidth;
		if (drawAxis && config.xAxisTop) {
			if (reverseAxis == false) topNotUsableHeight += xTAxisLabelHeight + xTLabelHeight + Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceAfter);
			else {
				var yTLabelHeight = Math.abs(Math.sin(rotateTLabels * Math.PI / 180) * widestYLabel2) + Math.abs(Math.sin((rotateTLabels + 90) * Math.PI / 180) * highestYLabel2);
				topNotUsableHeight += xAxisLabelHeight + yTLabelHeight + Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceAfter);
			}
		}
		if (drawAxis && config.xAxisBottom) {
			if (reverseAxis == false) bottomNotUsableHeight += xAxisLabelHeight + xLabelHeight + Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceAfter);
			else {
				var yTLabelHeight = Math.abs(Math.sin(rotateLabels * Math.PI / 180) * widestYLabel) + Math.abs(Math.sin((rotateLabels + 90) * Math.PI / 180) * highestYLabel);
				bottomNotUsableHeight += xAxisLabelHeight + yTLabelHeight + Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceBefore) + Math.ceil(ctx.chartSpaceScale * config.xAxisSpaceAfter);
			}
		}
		availableHeight = height - topNotUsableHeight - bottomNotUsableHeight;
		// compute space for Legend
		if (widestLegend > -99999998) {
			if (nbLegendLines == 0) { // compute nbLegendLines/nbLegendCols if not yet done;
				availableLegendWidth = availableWidth - Math.ceil(ctx.chartSpaceScale * Math.ceil(ctx.chartSpaceScale * config.legendSpaceLeftText)) - Math.ceil(ctx.chartSpaceScale * config.legendSpaceRightText);
				maxLegendOnLine = Min([Math.floor((availableLegendWidth + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextHorizontal)) / (widestLegend + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextHorizontal))), config.maxLegendCols]);
				nbLegendLines = Math.ceil(nbeltLegend / maxLegendOnLine);
				nbLegendCols = Math.ceil(nbeltLegend / nbLegendLines);
				msrLegend = measureLegend(data, ctx, config, widestLegend, highestLegend, nbLegendLines, nbLegendCols, availableLegendWidth);
			}
			legendHeight = msrLegend.legendHeight;
			legendWidth = msrLegend.legendWidth;
			switch (config.legendPosY) {
				case 0: // already computed;
					break;
				case 1:
					yLegendPos = topNotUsableHeight;
					break;
				case 2:
					yLegendPos = topNotUsableHeight + (availableHeight / 2) - legendHeight / 2;
					break;
				case -2:
					yLegendPos = height / 2 - legendHeight / 2;
					break;
				case 3:
					yLegendPos = height - bottomNotUsableHeight - legendHeight;
					break;
				case 4: // already Computed;
					break;
				default:
					yLegendPos = topNotUsableHeight;
					break;
			}
			switch (config.legendPosX) {
				case 0:
					if (config.legendPosY == 0 || config.legendPosY == 4) xLegendPos = prevLeftNotUsableWidth;
					break;
				case 1:
					xLegendPos = leftNotUsableWidth;
					break;
				case 2:
					xLegendPos = leftNotUsableWidth + (availableWidth) / 2 - legendWidth / 2;
					break;
				case -2:
					xLegendPos = width / 2 - (legendWidth / 2);
					break;
				case 3:
					xLegendPos = width - rightNotUsableWidth - legendWidth;
					break;
				case 4:
					if (config.legendPosY == 0 || config.legendPosY == 4) xLegendPos = width - prevRightNotUsableWidth - legendWidth;
					break;
				default:
					xLegendPos = width - rightNotUsableWidth;
					break;
			}
		}
		// correct space;
		if (drawAxis && config.yAxisLeft && yAxisUnitWidth > 0) leftNotUsableWidth = Math.max(leftNotUsableWidth, borderLHeight + config.spaceLeft + (config.yAxisUnitBorders && isBorder(config.yAxisUnitBordersSelection, "LEFT")) * (config.yAxisUnitBordersWidth) + (config.yAxisUnitBackgroundColor != "none" || config.yAxisUnitBorders) * Math.ceil(ctx.chartSpaceScale * config.yAxisUnitBordersYSpace) + 1 + yAxisUnitWidth / 2);
		if (drawAxis && config.yAxisRight && yAxisUnit2Width > 0) rightNotUsableWidth = Math.max(rightNotUsableWidth, borderRHeight + config.spaceRight + (config.yAxisUnitBorders && isBorder(config.yAxisUnitBordersSelection, "RIGHT")) * (config.yAxisUnitBordersWidth) + (config.yAxisUnitBackgroundColor != "none" || config.yAxisUnitBorders) * Math.ceil(ctx.chartSpaceScale * config.yAxisUnitBordersYSpace) + 1 + yAxisUnit2Width / 2);
		if (config.inGraphDataShow && (typegraph == "Line" || typegraph == "HorizontalBar" || typegraph == "HorizontalStackedBar")) {
			rightNotUsableWidth = Math.max(rightNotUsableWidth, Math.max(widestYLabel, widestYLabel2) + 1 + borderRHeight);
			leftNotUsableWidth = Math.max(leftNotUsableWidth, Math.max(widestYLabel, widestYLabel2) + 1 + borderLHeight);
		}
		if (typegraph == "Line" && (config.xAxisTop || config.xAxisBottom)) {
			rightNotUsableWidth = Math.max(rightNotUsableWidth, Math.max(config.xAxisBottom * Math.cos(rotateLabels) * widestXLabel / 2, config.xAxisTop * Math.cos(rotateTLabels) * widestTXLabel / 2) + 1 + borderRHeight);
			leftNotUsableWidth = Math.max(leftNotUsableWidth, Math.max(config.xAxisBottom * Math.cos(rotateLabels) * widestXLabel / 2, config.xAxisTop * Math.cos(rotateTLabels) * widestTXLabel / 2) + 1 + borderLHeight);
		}
		if ((typegraph == "HorizontalBar" || typegraph == "HorizontalStackedBar") && (config.xAxisTop || config.xAxisBottom)) {
			rightNotUsableWidth = Math.max(rightNotUsableWidth, config.xAxisBottom * Math.cos(rotateLabels) * widestYLabel / 2 + 1 + borderRHeight);
			leftNotUsableWidth = Math.max(leftNotUsableWidth, config.xAxisBottom * Math.cos(rotateLabels) * widestYLabel / 2 + 1 + borderLHeight);
		}
		if (typegraph == "Line" && config.inGraphDataShow) {
			topNotUsableHeight = Math.max(topNotUsableHeight, Math.max(highestYLabel, highestYLabel2) + 1 + borderTHeight);
		}
		if (typegraph == "Line" && ctx.tpchartSub == "Bubble") {
			rightNotUsableWidth = Math.max(rightNotUsableWidth, availableWidth * config.bubbleMaxRadius / 2 + 1 + borderRHeight);
			leftNotUsableWidth = Math.max(leftNotUsableWidth, availableWidth * config.bubbleMaxRadius / 2 + 1 + borderLHeight);
			topNotUsableHeight += availableHeight * config.bubbleMaxRadius / 2;
		}
		availableWidth = width - rightNotUsableWidth - leftNotUsableWidth;
		availableHeight = height - topNotUsableHeight - bottomNotUsableHeight;
		// ----------------------- DRAW EXTERNAL ELEMENTS -------------------------------------------------
		dispCrossImage(ctx, config, width / 2, height / 2, width / 2, height / 2, false, data, -1, -1);
		if (typeof config.initFunction == "function") config.initFunction("INITFUNCTION", ctx, data, null, -1, -1, {
			animationValue: 0,
			cntiter: 0,
			config: config,
			borderX: 0,
			borderY: 0,
			midPosX: 0,
			midPosY: 0
		});
		if (ylabels != "nihil") {
			// Draw Borders
			if (borderHeight > 0) {
				ctx.save();
				ctx.beginPath();
				ctx.setLineDash(lineStyleFn(config.canvasBordersStyle));
				ctx.strokeStyle = config.canvasBordersColor;
				ctx.lineWidth = borderHeight;
				ctx.setLineDash(lineStyleFn(config.canvasBordersStyle));
				ctx.strokeStyle = config.canvasBordersColor;
				ctx.fillStyle = "rgba(0,0,0,0)";
				ctx.drawRectangle({
					x: 0 + borderLHeight / 2,
					y: 0 + borderTHeight / 2,
					width: width - borderRHeight / 2 - borderLHeight / 2,
					height: height - borderTHeight / 2 - borderBHeight / 2,
					borders: true,
					bordersWidth: borderHeight,
					borderSelection: config.canvasBordersSelection,
					borderRadius: config.canvasBordersRadius,
					fill: false,
					stroke: true
				});
				ctx.setLineDash([]);
				ctx.restore();
			}
			// Draw Graph Title
			if (graphTitleHeight > 0) {
				ctx.save();
				ctx.beginPath();
				ctx.font = config.graphTitleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.graphTitleFontSize)).toString() + "px " + config.graphTitleFontFamily;
				ctx.fillStyle = config.graphTitleFontColor;
				ctx.textBaseline = "top";
				var textPos;
				switch (config.graphTitleAlign) {
					case "right":
						ctx.textAlign = "right";
						textPos = Math.ceil(ctx.chartSpaceScale * config.spaceLeft) + (width - Math.ceil(ctx.chartSpaceScale * config.spaceLeft) - Math.ceil(ctx.chartSpaceScale * config.spaceRight)) / 2;
						textPos = width - Math.ceil(ctx.chartSpaceScale * (config.spaceRight + config.graphTitleShift)) - borderRHeight;
						break;
					case "left":
						ctx.textAlign = "left";
						textPos = borderLHeight + Math.ceil(ctx.chartSpaceScale * (config.spaceLeft + config.graphTitleShift));
						break;
					default:
						ctx.textAlign = "center";
						textPos = borderLHeight + Math.ceil(ctx.chartSpaceScale * config.spaceLeft) + (width - borderRHeight - borderLHeight - Math.ceil(ctx.chartSpaceScale * config.spaceLeft) - Math.ceil(ctx.chartSpaceScale * config.spaceRight)) / 2;
						break;
				}
				setTextBordersAndBackground(ctx, config.graphTitle, (Math.ceil(ctx.chartTextScale * config.graphTitleFontSize)), textPos, graphTitlePosY, config.graphTitleBorders, config.graphTitleBordersSelection, config.graphTitleBordersColor, Math.ceil(ctx.chartLineScale * config.graphTitleBordersWidth), Math.ceil(ctx.chartSpaceScale * config.graphTitleBordersXSpace), Math.ceil(ctx.chartSpaceScale * config.graphTitleBordersYSpace), config.graphTitleBordersStyle, config.graphTitleBackgroundColor, "GRAPHTITLE", config.graphTitleBordersRadius);
				ctx.translate(textPos, graphTitlePosY);
				ctx.fillTextMultiLine(config.graphTitle, 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.graphTitleFontSize)), true, config.detectMouseOnText, ctx, "TITLE_TEXTMOUSE", 0, textPos, graphTitlePosY, -1, -1);
				ctx.stroke();
				ctx.restore();
			}
			// Draw Graph Sub-Title
			if (graphSubTitleHeight > 0) {
				ctx.save();
				ctx.beginPath();
				ctx.font = config.graphSubTitleFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.graphSubTitleFontSize)).toString() + "px " + config.graphSubTitleFontFamily;
				ctx.fillStyle = config.graphSubTitleFontColor;
				switch (config.graphSubTitleAlign) {
					case "right":
						ctx.textAlign = "right";
						textPos = width - Math.ceil(ctx.chartSpaceScale * (config.spaceRight + config.graphSubTitleShift)) - borderRHeight;
						break;
					case "left":
						ctx.textAlign = "left";
						textPos = borderLHeight + Math.ceil(ctx.chartSpaceScale * (config.spaceLeft + config.graphSubTitleShift));
						break;
					default:
						ctx.textAlign = "center";
						textPos = borderLHeight + Math.ceil(ctx.chartSpaceScale * config.spaceLeft) + (width - borderRHeight - borderLHeight - Math.ceil(ctx.chartSpaceScale * config.spaceLeft) - Math.ceil(ctx.chartSpaceScale * config.spaceRight)) / 2;
						break;
				}
				ctx.textBaseline = "top";
				setTextBordersAndBackground(ctx, config.graphSubTitle, (Math.ceil(ctx.chartTextScale * config.graphSubTitleFontSize)), textPos, graphSubTitlePosY, config.graphSubTitleBorders, config.graphSubTitleBordersSelection, config.graphSubTitleBordersColor, Math.ceil(ctx.chartLineScale * config.graphSubTitleBordersWidth), Math.ceil(ctx.chartSpaceScale * config.graphSubTitleBordersXSpace), Math.ceil(ctx.chartSpaceScale * config.graphSubTitleBordersYSpace), config.graphSubTitleBordersStyle, config.graphSubTitleBackgroundColor, "GRAPHSUBTITLE", config.graphSubTitleBordersRadius);
				ctx.translate(textPos, graphSubTitlePosY);
				ctx.fillTextMultiLine(config.graphSubTitle, 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.graphSubTitleFontSize)), true, config.detectMouseOnText, ctx, "SUBTITLE_TEXTMOUSE", 0, textPos, graphSubTitlePosY, -1, -1);
				ctx.stroke();
				ctx.restore();
			}
			// Draw FootNote
			if (config.footNote.trim() != "") {
				ctx.save();
				ctx.font = config.footNoteFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.footNoteFontSize)).toString() + "px " + config.footNoteFontFamily;
				ctx.fillStyle = config.footNoteFontColor;
				switch (config.footNoteAlign) {
					case "right":
						ctx.textAlign = "right";
						textPos = width - Math.ceil(ctx.chartSpaceScale * (config.spaceRight + config.footNoteShift)) - borderRHeight;
						break;
					case "left":
						ctx.textAlign = "left";
						textPos = borderLHeight + Math.ceil(ctx.chartSpaceScale * (config.spaceLeft + config.footNoteShift));
						break;
					default:
						ctx.textAlign = "center";
						textPos = leftNotUsableWidth + (availableWidth / 2);
						break;
				}
				ctx.textBaseline = "bottom";
				setTextBordersAndBackground(ctx, config.footNote, (Math.ceil(ctx.chartTextScale * config.footNoteFontSize)), textPos, footNotePosY, config.footNoteBorders, config.footNoteBordersSelection, config.footNoteBordersColor, Math.ceil(ctx.chartLineScale * config.footNoteBordersWidth), Math.ceil(ctx.chartSpaceScale * config.footNoteBordersXSpace), Math.ceil(ctx.chartSpaceScale * config.footNoteBordersYSpace), config.footNoteBordersStyle, config.footNoteBackgroundColor, "FOOTNOTE", config.footNoteBordersRadius);
				ctx.translate(textPos, footNotePosY);
				ctx.fillTextMultiLine(config.footNote, 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.footNoteFontSize)), true, config.detectMouseOnText, ctx, "FOOTNOTE_TEXTMOUSE", 0, textPos, footNotePosY, -1, -1);
				ctx.stroke();
				ctx.restore();
			}
			// Draw Y Axis Unit
			if (yAxisUnitHeight > 0) {
				if (config.yAxisLeft) {
					ctx.save();
					ctx.beginPath();
					ctx.font = config.yAxisUnitFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)).toString() + "px " + config.yAxisUnitFontFamily;
					ctx.fillStyle = config.yAxisUnitFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					setTextBordersAndBackground(ctx, config.yAxisUnit, (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)), leftNotUsableWidth, yAxisUnitPosY, config.yAxisUnitBorders, config.yAxisUnitBordersSelection, config.yAxisUnitBordersColor, Math.ceil(ctx.chartLineScale * config.yAxisUnitBordersWidth), Math.ceil(ctx.chartSpaceScale * config.yAxisUnitBordersXSpace), Math.ceil(ctx.chartSpaceScale * config.yAxisUnitBordersYSpace), config.yAxisUnitBordersStyle, config.yAxisUnitBackgroundColor, "YAXISUNIT", config.yAxisUnitBordersRadius);
					ctx.translate(leftNotUsableWidth, yAxisUnitPosY);
					ctx.fillTextMultiLine(config.yAxisUnit, 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)), true, config.detectMouseOnText, ctx, "YLEFTAXISUNIT_TEXTMOUSE", 0, leftNotUsableWidth, yAxisUnitPosY, -1, -1);
					ctx.stroke();
					ctx.restore();
				}
				if (config.yAxisRight && yAxisUnit2 != "") {
					ctx.save();
					ctx.beginPath();
					ctx.font = config.yAxisUnitFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)).toString() + "px " + config.yAxisUnitFontFamily;
					ctx.fillStyle = config.yAxisUnitFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					setTextBordersAndBackground(ctx, yAxisUnit2, (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)), width - rightNotUsableWidth, yAxisUnitPosY, config.yAxisUnitBorders, config.yAxisUnitBordersSelection, config.yAxisUnitBordersColor, Math.ceil(ctx.chartLineScale * config.yAxisUnitBordersWidth), Math.ceil(ctx.chartSpaceScale * config.yAxisUnitBordersXSpace), Math.ceil(ctx.chartSpaceScale * config.yAxisUnitBordersYSpace), config.yAxisUnitBordersStyle, config.yAxisUnitBackgroundColor, "YAXISUNIT", config.yAxisUnitBordersRadius);
					ctx.translate(width - rightNotUsableWidth, yAxisUnitPosY);
					ctx.fillTextMultiLine(yAxisUnit2, 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.yAxisUnitFontSize)), true, config.detectMouseOnText, ctx, "YRIGHTAXISUNIT_TEXTMOUSE", 0, width - rightNotUsableWidth, yAxisUnitPosY, -1, -1);
					ctx.stroke();
					ctx.restore();
				}
			}
			// Draw Y Axis Label
			if (yAxisLabelWidth > 0) {
				if (config.yAxisLeft) {
					ctx.save();
					ctx.beginPath();
					ctx.font = config.yAxisFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.yAxisFontSize)).toString() + "px " + config.yAxisFontFamily;
					ctx.fillStyle = config.yAxisFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					ctx.translate(yAxisLabelPosLeft, topNotUsableHeight + (availableHeight / 2));
					ctx.rotate(-(90 * (Math.PI / 180)));
					setTextBordersAndBackground(ctx, config.yAxisLabel, (Math.ceil(ctx.chartTextScale * config.yAxisFontSize)), 0, 0, config.yAxisLabelBorders, config.yAxisLabelBordersSelection, config.yAxisLabelBordersColor, Math.ceil(ctx.chartLineScale * config.yAxisLabelBordersWidth), Math.ceil(ctx.chartSpaceScale * config.yAxisLabelBordersXSpace), Math.ceil(ctx.chartSpaceScale * config.yAxisLabelBordersYSpace), config.yAxisLabelBordersStyle, config.yAxisLabelBackgroundColor, "YAXISLABELLEFT", config.yAxisLabelBordersRadius);
					ctx.fillTextMultiLine(config.yAxisLabel, 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.yAxisFontSize)), false, config.detectMouseOnText, ctx, "YLEFTAXISLABEL_TEXTMOUSE", -(90 * (Math.PI / 180)), yAxisLabelPosLeft, topNotUsableHeight + (availableHeight / 2), -1, -1);
					ctx.stroke();
					ctx.restore();
				}
				if (config.yAxisRight) {
					var yAxisLabel2 = config.yAxisLabel2;
					if (yAxisLabel2 == '') yAxisLabel2 = config.yAxisLabel;
					ctx.save();
					ctx.beginPath();
          if (config.yAxisFontSize2==0) {
            yAxisFontSize=config.yAxisFontSize;
          } else {
            yAxisFontSize=config.yAxisFontSize2;
          }
					ctx.font = config.yAxisFontStyle + " " + (Math.ceil(ctx.chartTextScale * yAxisFontSize)).toString() + "px " + config.yAxisFontFamily;
					if (config.yAxisFontColor2 == ""){
            ctx.fillStyle = config.yAxisFontColor;
          } else {
            ctx.fillStyle = config.yAxisFontColor2;
          }
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					ctx.translate(yAxisLabelPosRight, topNotUsableHeight + (availableHeight / 2));
					ctx.rotate(+(90 * (Math.PI / 180)));
					setTextBordersAndBackground(ctx, yAxisLabel2, (Math.ceil(ctx.chartTextScale * yAxisFontSize)), 0, 0, config.yAxisLabelBorders, config.yAxisLabelBordersSelection, config.yAxisLabelBordersColor, Math.ceil(ctx.chartLineScale * config.yAxisLabelBordersWidth), Math.ceil(ctx.chartSpaceScale * config.yAxisLabelBordersXSpace), Math.ceil(ctx.chartSpaceScale * config.yAxisLabelBordersYSpace), config.yAxisLabelBordersStyle, config.yAxisLabelBackgroundColor, "YAXISLABELLEFT", config.yAxisLabelBordersRadius);
					ctx.fillTextMultiLine(yAxisLabel2, 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * yAxisFontSize)), false, config.detectMouseOnText, ctx, "YRIGHTAXISLABEL_TEXTMOUSE", +(90 * (Math.PI / 180)), yAxisLabelPosRight, topNotUsableHeight + (availableHeight / 2), -1, -1);
					ctx.stroke();
					ctx.restore();
				}
			}
			// Draw bottom X Axis Label
			if (xAxisLabelHeight > 0) {
				if (config.xAxisBottom) {
					ctx.save();
					ctx.beginPath();
					ctx.font = config.xAxisFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.xAxisFontSize)).toString() + "px " + config.xAxisFontFamily;
					ctx.fillStyle = config.xAxisFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "bottom";
					setTextBordersAndBackground(ctx, config.xAxisLabel, (Math.ceil(ctx.chartTextScale * config.xAxisFontSize)), leftNotUsableWidth + (availableWidth / 2), xAxisLabelPos, config.xAxisLabelBorders, config.xAxisLabelBordersSelection, config.xAxisLabelBordersColor, Math.ceil(ctx.chartLineScale * config.xAxisLabelBordersWidth), Math.ceil(ctx.chartSpaceScale * config.xAxisLabelBordersXSpace), Math.ceil(ctx.chartSpaceScale * config.xAxisLabelBordersYSpace), config.xAxisLabelBordersStyle, config.xAxisLabelBackgroundColor, "XAXISLABEL", config.xAxisLabelBordersRadius);
					ctx.translate(leftNotUsableWidth + (availableWidth / 2), xAxisLabelPos);
					ctx.fillTextMultiLine(config.xAxisLabel, 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.xAxisFontSize)), true, config.detectMouseOnText, ctx, "XAXISLABEL_TEXTMOUSE", 0, leftNotUsableWidth + (availableWidth / 2), xAxisLabelPos, -1, -1);
					ctx.stroke();
					ctx.restore();
				}
				if (config.xAxisTop) {
					var xAxisLabel2 = config.xAxisLabel2;
					if (xAxisLabel2 == '') xAxisLabel2 = config.xAxisLabel;
					ctx.save();
					ctx.beginPath();
					ctx.font = config.xAxisFontStyle + " " + (Math.ceil(ctx.chartTextScale * config.xAxisFontSize)).toString() + "px " + config.xAxisFontFamily;
					ctx.fillStyle = config.xAxisFontColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "top";
					setTextBordersAndBackground(ctx, xAxisLabel2, (Math.ceil(ctx.chartTextScale * config.xAxisFontSize)), leftNotUsableWidth + (availableWidth / 2), xTAxisLabelPos, config.xAxisLabelBorders, config.xAxisLabelBordersSelection, config.xAxisLabelBordersColor, Math.ceil(ctx.chartLineScale * config.xAxisLabelBordersWidth), Math.ceil(ctx.chartSpaceScale * config.xAxisLabelBordersXSpace), Math.ceil(ctx.chartSpaceScale * config.xAxisLabelBordersYSpace), config.xAxisLabelBordersStyle, config.xAxisLabelBackgroundColor, "XAXISLABEL", config.xAxisLabelBordersRadius);
					ctx.translate(leftNotUsableWidth + (availableWidth / 2), xTAxisLabelPos);
					ctx.fillTextMultiLine(xAxisLabel2, 0, 0, ctx.textBaseline, (Math.ceil(ctx.chartTextScale * config.xAxisFontSize)), true, config.detectMouseOnText, ctx, "XAXISLABEL_TEXTMOUSE", 0, leftNotUsableWidth + (availableWidth / 2), xAxisLabelPos, -1, -1);
					ctx.stroke();
					ctx.restore();
				}
			}
			// Draw Legend
			var legendMsr;
			if (nbeltLegend > 1 || (nbeltLegend == 1 && config.showSingleLegend)) {
				legendMsr = {
					dispLegend: true,
					xLegendPos: xLegendPos,
					yLegendPos: yLegendPos,
					nbLegendLines: nbLegendLines,
					nbLegendCols: nbLegendCols,
					reverseLegend: reverseLegend,
					legendBox: legendBox,
					widestLegend: widestLegend,
					highestLegend: highestLegend,
					legendWidth: msrLegend.legendWidth,
					legendHeight: msrLegend.legendHeight,
					legendBackgroundColorWidth: msrLegend.legendBackgroundColorWidth,
					legendBackgroundColorHeight: msrLegend.legendBackgroundColorHeight,
					legendBorderWidth: msrLegend.legendBorderWidth,
					legendBorderHeight: msrLegend.legendBorderHeight,
					legendFirstTextXPos: msrLegend.legendFirstTextXPos,
					legendFirstTextYPos: msrLegend.legendFirstTextYPos,
					legendBackgroundColorXPos: msrLegend.legendBackgroundColorXPos,
					legendBackgroundColorYPos: msrLegend.legendBackgroundColorYPos,
					legendBorderXPos: msrLegend.legendBorderXPos,
					legendBorderYPos: msrLegend.legendBorderYPos,
					elementMsr: msrLegend.elementMsr
				};
				if (config.legendPosY == 0 || config.legendPosY == 4 || config.legendPosX == 0 || config.legendPosX == 4) {
					drawLegend(legendMsr, data, config, ctx, typegraph, -1);
					legendMsr = {
						dispLegend: false
					};
				}
			} else {
				legendMsr = {
					dispLegend: false
				};
			}
		}
		clrx = leftNotUsableWidth;
		clrwidth = availableWidth;
		clry = topNotUsableHeight;
		clrheight = availableHeight;
		return {
			leftNotUsableWidth: leftNotUsableWidth,
			rightNotUsableWidth: rightNotUsableWidth,
			availableWidth: availableWidth,
			topNotUsableHeight: topNotUsableHeight,
			bottomNotUsableHeight: bottomNotUsableHeight,
			availableHeight: availableHeight,
			widestXLabel: widestXLabel,
			widestTXLabel: widestTXLabel,
			highestXLabel: highestXLabel,
			highestTXLabel: highestTXLabel,
			widestYLabel: widestYLabel,
			widestYLabel2: widestYLabel2,
			highestYLabel: highestYLabel,
			rotateLabels: rotateLabels,
			rotateTLabels: rotateTLabels,
			xLabelPos: xLabelPos,
			xTLabelPos: xTLabelPos,
			clrx: clrx,
			clry: clry,
			clrwidth: clrwidth,
			clrheight: clrheight,
			legendMsr: legendMsr
		};
	};
	// Function for drawing Bubbles
	function drawBubblesDataset(animationDecimal, data, config, ctx, statData, vars) {
		var t1, t2, t3, complementaryBar, otherBarHeight, barHeight, i, j, currentAnimPc, fullHeight, sizeTop, sizeBottom, decal;
		var maxBubbleRadius, markerShape, markerStrokeStyle, markerRadius, centerX, centerY, paddingTextX, paddingTextY, dispString, xRadius, yRadius;
		var newRadius, newX, newY;
		var correctedAnimationDecimal;
		for (i = 0; i < data.datasets.length; i++) {
			if (statData[i][0].tpchart != "Bubble") continue;
			for (j = 0; j < data.datasets[i].data.length; j++) {
				correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "BUBBLE");
				if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
						nullvalue: null
					}) == false) continue;
				if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
						nullvalue: null
					}) == false) continue;
				ctx.save();
				if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
					currentAnimPc = correctedAnimationDecimal.yAxis;
					ctx.beginPath();
					ctx.fillStyle = setOptionValue(true, true, 1, "MARKERFILLCOLOR", ctx, data, statData, data.datasets[i].pointColor, config.defaultStrokeColor, "pointColor", i, j, {
						nullvalue: true
					});
					ctx.strokeStyle = setOptionValue(true, true, 1, "MARKERSTROKESTYLE", ctx, data, statData, data.datasets[i].pointStrokeColor, config.defaultStrokeColor, "pointStrokeColor", i, j, {
						nullvalue: true
					});
					ctx.lineWidth = setOptionValue(true, true, ctx.chartLineScale, "MARKERLINEWIDTH", ctx, data, statData, data.datasets[i].pointDotStrokeWidth, config.pointDotStrokeWidth, "pointDotStrokeWidth", i, j, {
						nullvalue: true
					});
					markerShape = setOptionValue(true, true, 1, "MARKERSHAPE", ctx, data, statData, data.datasets[i].markerShape, config.markerShape, "markerShape", i, j, {
						nullvalue: true
					});
					markerStrokeStyle = setOptionValue(true, true, 1, "MARKERSTROKESTYLE", ctx, data, statData, data.datasets[i].pointDotStrokeStyle, config.pointDotStrokeStyle, "pointDotStrokeStyle", i, j, {
						nullvalue: true
					});
					maxBubbleRadius = config.bubbleMaxRadius * Math.min(statData[i][j].availableHeight, statData[i][j].availableWidth);
					markerRadius = setOptionValue(true, true, ctx.chartSpaceScale, "MARKERRADIUS", ctx, data, statData, data.datasets[i].pointDotRadius, config.pointDotRadius, "pointDotRadius", i, j, {
						nullvalue: true
					});
					markerRadius = currentAnimPc * maxBubbleRadius * (1 * markerRadius - statData[0][0].bubbleMinVal) / (statData[0][0].bubbleMaxVal - statData[0][0].bubbleMinVal);
					markerRadius = setOptionValue(true, true, 1, "MARKERRADIUS", ctx, data, statData, markerRadius, markerRadius, "pointDotRadius", i, j, {
						nullvalue: true
					});
					centerY = statData[i][j].xAxisPosY - statData[i][j].availableHeight / 2;
					centerX = statData[i][j].yAxisPosX + statData[i][j].availableWidth / 2;
					drawMarker(ctx, centerX + currentAnimPc * (statData[i][j].xPos - centerX), centerY + currentAnimPc * (statData[i][j].yAxisPos - centerY - statData[i][j].yPosOffset), markerShape, markerRadius, markerStrokeStyle);
				}
				ctx.restore();
			}
		}
		if (currentAnimPc >= config.animationStopValue) {
			for (i = 0; i < data.datasets.length; i++) {
				for (j = 0; j < data.datasets[i].data.length; j++) {
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) continue;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
							nullvalue: null
						}) == false) continue;
					if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
					if (statData[i][0].tpchart != "Bubble") continue;
					maxBubbleRadius = config.bubbleMaxRadius * Math.min(statData[i][j].availableHeight, statData[i][j].availableWidth);
					markerRadius = setOptionValue(true, true, ctx.chartSpaceScale, "MARKERRADIUS", ctx, data, statData, data.datasets[i].pointDotRadius, config.pointDotRadius, "pointDotRadius", i, j, {
						nullvalue: true
					});
					markerRadius = currentAnimPc * maxBubbleRadius * (1 * markerRadius - statData[0][0].bubbleMinVal) / (statData[0][0].bubbleMaxVal - statData[0][0].bubbleMinVal);
					statData[i][j].markerRadius = markerRadius;
					if (!(data.datasets[i].mouseDetection == false)) jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["POINT", i, j, statData, setOptionValue(true, true, 1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, "annotateDisplay", i, j, {
						nullValue: true
					})];
					if (setOptionValue(true, true, 1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, "inGraphDataShow", i, j, {
							nullValue: true
						})) {
						ctx.save();
						ctx.textAlign = setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
							nullValue: true
						});
						ctx.textBaseline = setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
							nullValue: true
						});
						ctx.font = setOptionValue(true, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
							nullValue: true
						}) + ' ' + setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
							nullValue: true
						}) + 'px ' + setOptionValue(true, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
							nullValue: true
						});
						ctx.fillStyle = setOptionValue(true, true, 1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, undefined, config.inGraphDataFontColor, "inGraphDataFontColor", i, j, {
							nullValue: true
						});
						paddingTextX = setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
							nullValue: true
						});
						paddingTextY = setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
							nullValue: true
						});
						dispString = tmplbis(setOptionValue(true, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
							nullValue: true
						}), statData[i][j], config);
						if (paddingTextY == 0) {
							newY = 0;
							if (paddingTextX == 0) newX = 0;
							else {
								newX = markerRadius;
								if (paddingTextX < 0) newX = -newX;
							}
							newY = 0;
						} else {
							newRadius = markerRadius + Math.sqrt(paddingTextX * paddingTextX + paddingTextY * paddingTextY);
							newY = Math.sqrt(newRadius * newRadius / (Math.pow(paddingTextX / paddingTextY, 2) + 1));
							if (paddingTextY < 0) newY = -newY;
							newX = newY * paddingTextX / paddingTextY;
						}
						ctx.translate(statData[i][j].xPos + newX, statData[i][j].yAxisPos - currentAnimPc * statData[i][j].yPosOffset - newY);
						var rotateVal = setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
							nullValue: true
						}) * (Math.PI / 180);
						ctx.rotate(rotateVal);
						setTextBordersAndBackground(ctx, dispString, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
							nullValue: true
						}), 0, 0, setOptionValue(true, true, 1, "INGRAPHDATABORDERS", ctx, data, statData, undefined, config.inGraphDataBorders, "inGraphDataBorders", i, j, {
							nullValue: true
						}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSELECTION", ctx, data, statData, undefined, config.inGraphDataBordersSelection, "inGraphDataBordersSelection", i, j, {
							nullValue: true
						}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, undefined, config.inGraphDataBordersColor, "inGraphDataBordersColor", i, j, {
							nullValue: true
						}), setOptionValue(true, true, ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, undefined, config.inGraphDataBordersWidth, "inGraphDataBordersWidth", i, j, {
							nullValue: true
						}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, undefined, config.inGraphDataBordersXSpace, "inGraphDataBordersXSpace", i, j, {
							nullValue: true
						}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, undefined, config.inGraphDataBordersYSpace, "inGraphDataBordersYSpace", i, j, {
							nullValue: true
						}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, undefined, config.inGraphDataBordersStyle, "inGraphDataBordersStyle", i, j, {
							nullValue: true
						}), setOptionValue(true, true, 1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, undefined, config.inGraphDataBackgroundColor, "inGraphDataBackgroundColor", i, j, {
							nullValue: true
						}), "INGRAPHDATA", config.inGraphDataBordersRadius);
						ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
							nullValue: true
						}), true, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, statData[i][j].xPos + paddingTextX, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset - paddingTextY, i, j);
						ctx.restore();
					}
				}
			}
		}
		if (animationDecimal.animationGlobal >= 1 && typeof drawMath == "function") {
			drawMath(ctx, config, data, msr, {
				xAxisPosY: xAxisPosY,
				yAxisPosX: yAxisPosX,
				valueHop: valueHop,
				scaleHop: scaleHop,
				zeroY: zeroY,
				calculatedScale: calculatedScale,
				calculateOffset: calculateOffset,
				additionalSpaceBetweenBars: additionalSpaceBetweenBars,
				barWidth: barWidth
			});
		}
	};
	// Function for drawing lines (BarLine|Line)
	function drawLinesDataset(animationDecimal, data, config, ctx, statData, vars) {
		var y1, y2, y3, diffnb, diffnbj, fact, currentAnimPc;
		var prevypos;
		var pts = [];
		var correctedAnimationDecimal;
		for (var i = 0; i < data.datasets.length; i++) {
			if (setOptionValue(true, true, 1, "ANIMATION", ctx, data, statData, data.datasets[i].animation, config.animation, "animation", i, -1, {
					nullvalue: null
				}) == true || animationDecimal.animationGlobal >= 1) {
				prevypos = "undefined";
				if (statData[i][0].tpchart != "Line") continue;
				if (statData[i].length == 0) continue;
				if (statData[i][0].firstNotMissing == -1) continue;
				ctx.save();
				ctx.beginPath();
				prevAnimPc = {
					mainVal: 0,
					subVal: 0,
					animVal: 0
				};
				var firstpt = -1;
				var lastxPos = -1;
				for (var j = statData[i][0].firstNotMissing; j <= statData[i][0].lastNotMissing; j++) {
					correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "LINE");
					todisplay = true;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
							nullvalue: null
						}) == false) todisplay = false;
					if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
							nullvalue: null
						}) == false) todisplay = false;
					if (typeof(data.datasets[i].data[j]) == "undefined") todisplay = false;
					if (prevAnimPc.animVal == 0 && j > statData[i][0].firstNotMissing) continue;
					currentAnimPc = {
						mainVal: correctedAnimationDecimal.yAxis,
						subVal: correctedAnimationDecimal.subYAxis,
						animVal: correctedAnimationDecimal.yAxis + correctedAnimationDecimal.subYAxis
					}
					if (currentAnimPc.mainVal == 0 && (prevAnimPc.mainVal > 0 && firstpt != -1)) {
						ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "LINEDASH", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
							nullvalue: null
						})));
						ctx.stroke();
						ctx.setLineDash([]);
						if (config.extrapolateMissingData) {
							y1 = statData[i][statData[i][j].prevNotMissing].yAxisPos - prevAnimPc.mainVal * statData[i][statData[i][j].prevNotMissing].yPosOffset;
							y2 = statData[i][j].yAxisPos - prevAnimPc.mainVal * statData[i][statData[i][j - 1].nextNotMissing].yPosOffset;
							diffnb = statData[i][j - 1].nextNotMissing - statData[i][j].prevNotMissing;
							diffnbj = (j - 1) - statData[i][j].prevNotMissing;
							fact = (diffnbj + prevAnimPc.subVal) / diffnb;
							y3 = y1 + fact * (y2 - y1);
							traceLine(pts, ctx, statData[i][statData[i][j].prevNotMissing].xPos + fact * (statData[i][statData[i][j - 1].nextNotMissing].xPos - statData[i][statData[i][j].prevNotMissing].xPos), y3, config, data, statData, i, setYposOrigin(i, j, data, statData));
							closebz(pts, ctx, config, i);
							ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "LINEDASH", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
								nullvalue: null
							})));
							ctx.stroke();
							ctx.setLineDash([]);
							ctx.strokeStyle = "rgba(0,0,0,0)";
							if (config.datasetFill && setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
									nullvalue: null
								}) != 1) {
								ctx.lineTo(statData[i][statData[i][j].prevNotMissing].xPos + fact * (statData[i][statData[i][j - 1].nextNotMissing].xPos - statData[i][statData[i][j].prevNotMissing].xPos), statData[i][j].yAxisPos);
								ctx.lineTo(statData[i][firstpt].xPos, statData[i][firstpt].xAxisPosY - statData[i][0].zeroY);
								ctx.closePath();
								ctx.fillStyle = setOptionValue(true, true, 1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
									animationValue: currentAnimPc.mainVal,
									xPosLeft: statData[i][0].xPos,
									yPosBottom: Math.max(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1 * currentAnimPc.mainVal) * statData[i][0].lminvalue_offset),
									xPosRight: statData[i][data.datasets[i].data.length - 1].xPos,
									yPosTop: Math.min(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1 * currentAnimPc.mainVal) * statData[i][0].lmaxvalue_offset)
								});
								ctx.fill();
								firstpt = -1;
							}
						} else if (todisplay == true) {
							traceLine(pts, ctx, statData[i][j - 1].xPos + prevAnimPc.subVal * (statData[i][j].xPos - statData[i][j - 1].xPos), statData[i][j].yAxisPos - prevAnimPc.mainVal * statData[i][statData[i][j - 1].nextNotMissing].yPosOffset, config, data, statData, i, setYposOrigin(i, j, data, statData));
							closebz(pts, ctx, config, i);
							ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "LINEDASH", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
								nullvalue: null
							})));
							ctx.stroke();
							ctx.setLineDash([]);
							ctx.strokeStyle = "rgba(0,0,0,0)";
							if (config.datasetFill && setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
									nullvalue: null
								}) != 1) {
								ctx.lineTo(statData[i][j - 1].xPos + prevAnimPc.subVal * (statData[i][j].xPos - statData[i][j - 1].xPos), statData[i][j].yAxisPos);
								ctx.lineTo(statData[i][firstpt].xPos, statData[i][firstpt].xAxisPosY - statData[i][0].zeroY);
								ctx.closePath();
								ctx.fillStyle = setOptionValue(true, true, 1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
									animationValue: currentAnimPc.mainVal,
									xPosLeft: statData[i][0].xPos,
									yPosBottom: Math.max(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1 * currentAnimPc.mainVal) * statData[i][0].lminvalue_offset),
									xPosRight: statData[i][data.datasets[i].data.length - 1].xPos,
									yPosTop: Math.min(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1 * currentAnimPc.mainVal) * statData[i][0].lmaxvalue_offset)
								});
								ctx.fill();
							}
						}
						prevAnimPc = currentAnimPc;
						continue;
					} else if (currentAnimPc.totVal == 0) {
						ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "LINEDASH", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
							nullvalue: null
						})));
						ctx.stroke();
						ctx.setLineDash([]);
						ctx.strokeStyle = "rgba(0,0,0,0)";
					} else {
						ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "LINEDASH", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
							nullvalue: null
						})));
						ctx.stroke();
						ctx.setLineDash([]);
						ctx.strokeStyle = setOptionValue(true, true, 1, "STROKECOLOR", ctx, data, statData, data.datasets[i].strokeColor, config.defaultStrokeColor, "strokeColor", i, j, {
							nullvalue: null
						});
					}
					prevAnimPc = currentAnimPc;
					switch (todisplay) {
						case false:
							if (!config.extrapolateMissingData) {
								if (firstpt == -1) continue;
								closebz(pts, ctx, config, i);
								ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "LINEDASH", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
									nullvalue: null
								})));
								ctx.stroke();
								ctx.setLineDash([]);
								if (config.datasetFill && firstpt != -1 && setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
										nullvalue: null
									}) != 1) {
									lastxPos = -1;
									ctx.strokeStyle = "rgba(0,0,0,0)";
									ctx.lineTo(statData[i][j - 1].xPos, statData[i][j - 1].yAxisPos);
									ctx.lineTo(statData[i][firstpt].xPos, statData[i][firstpt].yAxisPos);
									ctx.closePath();
									ctx.fillStyle = setOptionValue(true, true, 1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, j, {
										animationValue: currentAnimPc.mainVal,
										xPosLeft: statData[i][0].xPos,
										yPosBottom: Math.max(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1 * currentAnimPc.mainVal) * statData[i][0].lminvalue_offset),
										xPosRight: statData[i][data.datasets[i].data.length - 1].xPos,
										yPosTop: Math.min(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1 * currentAnimPc.mainVal) * statData[i][0].lmaxvalue_offset)
									});
									ctx.fill();
								}
								ctx.beginPath();
								prevAnimPc = {
									mainVal: 0,
									subVal: 0
								};
								firstpt = -1;
							} else if (currentAnimPc.subVal > 0) {
								lastxPos = statData[i][j].xPos + currentAnimPc.subVal * (statData[i][j + 1].xPos - statData[i][j].xPos);
								y1 = statData[i][statData[i][j + 1].prevNotMissing].yAxisPos - statData[i][statData[i][j + 1].prevNotMissing].yPosOffset;
								y2 = statData[i][statData[i][j].nextNotMissing].yAxisPos - statData[i][statData[i][j].nextNotMissing].yPosOffset;
								diffnb = statData[i][j].nextNotMissing - statData[i][j + 1].prevNotMissing;
								diffnbj = (j) - statData[i][j + 1].prevNotMissing;
								fact = (diffnbj + prevAnimPc.subVal) / diffnb;
								y3 = y1 + fact * (y2 - y1);
								traceLine(pts, ctx, statData[i][statData[i][j].prevNotMissing].xPos + fact * (statData[i][statData[i][j - 1].nextNotMissing].xPos - statData[i][statData[i][j].prevNotMissing].xPos), y3, config, data, statData, i, setYposOrigin(i, j, data, statData));
							}
							break;
						default:
							ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, true, 1, "LINEWIDTH", ctx, data, statData, data.datasets[i].datasetStrokeWidth, config.datasetStrokeWidth, "datasetStrokeWidth", i, j, {
								nullvalue: null
							}));
							if (firstpt == -1) {
								firstpt = j;
								ctx.beginPath();
								if (setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
										nullvalue: null
									}) == 1) {
									if (typeof statData[i][j].yPosOffsetOrigin != "undefined") ctx.moveTo(statData[i][j].xPos, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffsetOrigin);
									else ctx.moveTo(statData[i][firstpt].xPos, statData[i][firstpt].xAxisPosY - statData[i][0].zeroY);
									ctx.lineTo(statData[i][j].xPos, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset);
								} else ctx.moveTo(statData[i][j].xPos, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset);
								initbz(pts, statData[i][j].xPos, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset, i);
								lastxPos = statData[i][j].xPos;
							} else {
								lastxPos = statData[i][j].xPos;
								traceLine(pts, ctx, statData[i][j].xPos, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset, config, data, statData, i, setYposOrigin(i, j, data, statData));
							}
							if (currentAnimPc.subVal > 0 && statData[i][j].nextNotMissing != -1 && (config.extrapolateMissing || statData[i][j].nextNotMissing == j + 1)) {
								lastxPos = statData[i][j].xPos + currentAnimPc.subVal * (statData[i][j + 1].xPos - statData[i][j].xPos);
								y1 = statData[i][statData[i][j + 1].prevNotMissing].yAxisPos - statData[i][statData[i][j + 1].prevNotMissing].yPosOffset;
								y2 = statData[i][statData[i][j].nextNotMissing].yAxisPos - statData[i][statData[i][j].nextNotMissing].yPosOffset;
								y3 = y1 + currentAnimPc.subVal * (y2 - y1);
								traceLine(pts, ctx, statData[i][j].xPos + currentAnimPc.subVal * (statData[i][statData[i][j].nextNotMissing].xPos - statData[i][j].xPos), y3, config, data, statData, i, setYposOrigin(i, j, data, statData));
							}
							break
					}
					if (todisplay && animationDecimal.animationGlobal >= config.animationStopValue) {
						ctx.pieces_drawn.points++;
						ctx.pieces_drawn.total_drawn++;
					}
				}
				closebz(pts, ctx, config, i);
				ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "LINEDASH", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
					nullvalue: null
				})));
				ctx.stroke();
				ctx.setLineDash([]);
				if (config.datasetFill && setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
						nullvalue: null
					}) != 1) {
					if (firstpt >= 0) {
						ctx.strokeStyle = "rgba(0,0,0,0)";
						ctx.lineTo(lastxPos, statData[i][0].xAxisPosY - statData[i][0].zeroY);
						ctx.lineTo(statData[i][firstpt].xPos, statData[i][firstpt].xAxisPosY - statData[i][0].zeroY);
						ctx.closePath();
						ctx.fillStyle = setOptionValue(true, true, 1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, "fillColor", i, -1, {
							animationValue: currentAnimPc.mainVal,
							xPosLeft: statData[i][0].xPos,
							yPosBottom: Math.max(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1 * currentAnimPc.mainVal) * statData[i][0].lminvalue_offset),
							xPosRight: statData[i][data.datasets[i].data.length - 1].xPos,
							yPosTop: Math.min(statData[i][0].yAxisPos, statData[i][0].yAxisPos - ((config.animationLeftToRight) ? 1 : 1 * currentAnimPc.mainVal) * statData[i][0].lmaxvalue_offset)
						});
						ctx.fill();
					}
				}
				ctx.restore();
				if (animationDecimal.animationGlobal >= 1) {
					for (j = 0; j < data.datasets[i].data.length; j++) {
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
								nullvalue: null
							}) == false) continue;
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
								nullvalue: null
							}) == false) continue;
						if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
							//							currentAnimPc = animationCorrectionV2(correctedAnimationDecimal.yAxis, data, config, i, j, true);
							correctedAnimationDecimal = correctAnimation(animationDecimal, data, config, i, j, statData, "LINE");
							currentAnimPc = {
								mainVal: correctedAnimationDecimal.yAxis,
								subVal: correctedAnimationDecimal.subYAxis,
								animVal: correctedAnimationDecimal.yAxis + correctedAnimationDecimal.subYAxis
							}
							if (currentAnimPc.mainVal > 0 || !config.animationLeftToRight) {
								if (setOptionValue(true, true, 1, "POINTDOT", ctx, data, statData, undefined, config.pointDot, "pointDot", i, j, {
										nullvalue: null
									})) {
									ctx.beginPath();
									ctx.fillStyle = setOptionValue(true, true, 1, "MARKERFILLCOLOR", ctx, data, statData, data.datasets[i].pointColor, config.defaultStrokeColor, "pointColor", i, j, {
										nullvalue: true
									});
									ctx.strokeStyle = setOptionValue(true, true, 1, "MARKERSTROKESTYLE", ctx, data, statData, data.datasets[i].pointStrokeColor, config.defaultStrokeColor, "pointStrokeColor", i, j, {
										nullvalue: true
									});
									ctx.lineWidth = setOptionValue(true, true, ctx.chartLineScale, "MARKERLINEWIDTH", ctx, data, statData, data.datasets[i].pointDotStrokeWidth, config.pointDotStrokeWidth, "pointDotStrokeWidth", i, j, {
										nullvalue: true
									});
									var markerShape = setOptionValue(true, true, 1, "MARKERSHAPE", ctx, data, statData, data.datasets[i].markerShape, config.markerShape, "markerShape", i, j, {
										nullvalue: true
									});
									var markerRadius = setOptionValue(true, true, ctx.chartSpaceScale, "MARKERRADIUS", ctx, data, statData, data.datasets[i].pointDotRadius, config.pointDotRadius, "pointDotRadius", i, j, {
										nullvalue: true
									});
									var markerStrokeStyle = setOptionValue(true, true, 1, "MARKERSTROKESTYLE", ctx, data, statData, data.datasets[i].pointDotStrokeStyle, config.pointDotStrokeStyle, "pointDotStrokeStyle", i, j, {
										nullvalue: true
									});
									drawMarker(ctx, statData[i][j].xPos, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset, markerShape, markerRadius, markerStrokeStyle);
								}
							}
						}
					}
				}
				if (animationDecimal.animationGlobal >= config.animationStopValue) {
					for (j = 0; j < data.datasets[i].data.length; j++) {
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
								nullvalue: null
							}) == false) continue;
						if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, statData, data.displayData, config.displayData, "displayData", j, -1, {
								nullvalue: null
							}) == false) continue;
						if (typeof(data.datasets[i].data[j]) == 'undefined') continue;
						if (!(data.datasets[i].mouseDetection == false)) jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["POINT", i, j, statData, setOptionValue(true, true, 1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, "annotateDisplay", i, j, {
							nullValue: true
						})];
						if (setOptionValue(true, true, 1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, "inGraphDataShow", i, j, {
								nullValue: true
							})) {
							ctx.save();
							ctx.textAlign = setOptionValue(true, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", i, j, {
								nullValue: true
							});
							ctx.textBaseline = setOptionValue(true, true, 1, "INGRAPHDATAVALIGN", ctx, data, statData, undefined, config.inGraphDataVAlign, "inGraphDataVAlign", i, j, {
								nullValue: true
							});
							ctx.font = setOptionValue(true, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
								nullValue: true
							}) + ' ' + setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}) + 'px ' + setOptionValue(true, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
								nullValue: true
							});
							ctx.fillStyle = setOptionValue(true, true, 1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, undefined, config.inGraphDataFontColor, "inGraphDataFontColor", i, j, {
								nullValue: true
							});
							var paddingTextX = setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, undefined, config.inGraphDataPaddingX, "inGraphDataPaddingX", i, j, {
									nullValue: true
								}),
								paddingTextY = setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, undefined, config.inGraphDataPaddingY, "inGraphDataPaddingY", i, j, {
									nullValue: true
								});
							var dispString = tmplbis(setOptionValue(true, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
								nullValue: true
							}), statData[i][j], config);
							ctx.translate(statData[i][j].xPos + paddingTextX, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset - paddingTextY);
							var rotateVal = setOptionValue(true, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", i, j, {
								nullValue: true
							}) * (Math.PI / 180);
							ctx.rotate(rotateVal);
							setTextBordersAndBackground(ctx, dispString, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), 0, 0, setOptionValue(true, true, 1, "INGRAPHDATABORDERS", ctx, data, statData, undefined, config.inGraphDataBorders, "inGraphDataBorders", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSELECTION", ctx, data, statData, undefined, config.inGraphDataBordersSelection, "inGraphDataBordersSelection", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, undefined, config.inGraphDataBordersColor, "inGraphDataBordersColor", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, undefined, config.inGraphDataBordersWidth, "inGraphDataBordersWidth", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, undefined, config.inGraphDataBordersXSpace, "inGraphDataBordersXSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, undefined, config.inGraphDataBordersYSpace, "inGraphDataBordersYSpace", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, undefined, config.inGraphDataBordersStyle, "inGraphDataBordersStyle", i, j, {
								nullValue: true
							}), setOptionValue(true, true, 1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, undefined, config.inGraphDataBackgroundColor, "inGraphDataBackgroundColor", i, j, {
								nullValue: true
							}), "INGRAPHDATA", config.inGraphDataBordersRadius);
							ctx.fillTextMultiLine(dispString, 0, 0, ctx.textBaseline, setOptionValue(true, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
								nullValue: true
							}), true, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, statData[i][j].xPos + paddingTextX, statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffset - paddingTextY, i, j);
							ctx.restore();
						}
					}
				}
			}
		};

		function initbz(pts, xpos, ypos, i) {
			if (setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
					nullvalue: null
				}) == 0 && setOptionValue(true, true, 1, "BEZIERCURVE", ctx, data, statData, undefined, config.bezierCurve, "bezierCurve", i, -1, {
					nullValue: true
				})) {
				pts.length = 0;
				pts.push(xpos);
				pts.push(ypos);
			}
			prevypos = ypos;
		};

		function setYposOrigin(i, j, data, statData) {
			yposOrigin = "undefined";
			if (typeof statData[i][j].yPosOffsetOrigin != "undefined") yposOrigin = statData[i][j].yAxisPos - currentAnimPc.mainVal * statData[i][j].yPosOffsetOrigin;
			return (yposOrigin);
		};

		function traceLine(pts, ctx, xpos, ypos, config, data, statData, i, yposOrigin) {
			if (setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
					nullvalue: null
				}) == 0 && setOptionValue(true, true, 1, "BEZIERCURVE", ctx, data, statData, undefined, config.bezierCurve, "bezierCurve", i, -1, {
					nullValue: true
				})) {
				pts.push(xpos);
				pts.push(ypos);
			} else {
				if (setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
						nullvalue: null
					}) == 0) ctx.lineTo(xpos, ypos);
				else if (setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
						nullvalue: null
					}) == 1) {
					if (yposOrigin != "undefined") ctx.moveTo(xpos, yposOrigin);
					else ctx.moveTo(xpos, statData[i][0].xAxisPosY - statData[i][0].zeroY);
					ctx.lineTo(xpos, ypos);
				} else if (setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
						nullvalue: null
					}) == 2 && typeof prevypos != "undefined") {
					ctx.lineTo(xpos, prevypos);
					ctx.lineTo(xpos, ypos);
					prevypos = ypos;
				}
			}
		};

		function closebz(pts, ctx, config, i) {
			if (setOptionValue(true, true, 1, "LINKTYPE", ctx, data, statData, data.datasets[i].linkType, config.linkType, "linkType", i, j, {
					nullvalue: null
				}) == 0 && setOptionValue(true, true, 1, "BEZIERCURVE", ctx, data, statData, undefined, config.bezierCurve, "bezierCurve", i, -1, {
					nullValue: true
				})) {
				minimumpos = statData[i][0].xAxisPosY;
				maximumpos = statData[i][0].xAxisPosY - statData[i][0].calculatedScale.steps * statData[i][0].scaleHop;
				drawSpline(ctx, pts, setOptionValue(true, true, 1, "BEZIERCURVETENSION", ctx, data, statData, undefined, config.bezierCurveTension, "bezierCurveTension", i, -1, {
					nullValue: true
				}), minimumpos, maximumpos);
				pts.length = 0;
			}
			prevypos = undefined;
		};
		//Props to Rob Spencer at scaled innovation for his post on splining between points
		//http://scaledinnovation.com/analytics/splines/aboutSplines.html
		function getControlPoints(x0, y0, x1, y1, x2, y2, t) {
			//  x0,y0,x1,y1 are the coordinates of the end (knot) pts of this segment
			//  x2,y2 is the next knot -- not connected here but needed to calculate p2
			//  p1 is the control point calculated here, from x1 back toward x0.
			//  p2 is the next control point, calculated here and returned to become the 
			//  next segment's p1.
			//  t is the 'tension' which controls how far the control points spread.
			//  Scaling factors: distances from this knot to the previous and following knots.
			var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
			var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
			var fa = t * d01 / (d01 + d12);
			var fb = t - fa;
			var p1x = x1 + fa * (x0 - x2);
			var p1y = y1 + fa * (y0 - y2);
			var p2x = x1 - fb * (x0 - x2);
			var p2y = y1 - fb * (y0 - y2);
			return [p1x, p1y, p2x, p2y]
		};

		function drawSpline(ctx, pts, t, minimumpos, maximumpos) {
			var cp = []; // array of control points, as x0,y0,x1,y1,...
			var n = pts.length;
			pts.push(2 * pts[n - 2] - pts[n - 4]);
			pts.push(2 * pts[n - 1] - pts[n - 3]);
			if (n == 4) {
				ctx.moveTo(pts[0], pts[1]);
				ctx.lineTo(pts[2], pts[3]);
				return;
			}
			// Draw an open curve, not connected at the ends
			for (var ti = 0; ti < n - 2; ti += 2) {
				cp = cp.concat(getControlPoints(pts[ti], pts[ti + 1], pts[ti + 2], pts[ti + 3], pts[ti + 4], pts[ti + 5], t));
			}
			//  For first is a simple quadratics.
			ctx.beginPath();
			ctx.strokeStyle = setOptionValue(true, true, 1, "STROKECOLOR", ctx, data, statData, data.datasets[i].strokeColor, config.defaultStrokeColor, "strokeColor", i, j, {
				nullvalue: null
			});
			ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, true, 1, "LINEWIDTH", ctx, data, statData, data.datasets[i].datasetStrokeWidth, config.datasetStrokeWidth, "datasetStrokeWidth", i, j, {
				nullvalue: null
			}));
			ctx.moveTo(pts[0], pts[1]);
			ctx.quadraticCurveTo(cp[0], Math.max(Math.min(cp[1], minimumpos), maximumpos), pts[2], pts[3]);
			ctx.setLineDash(lineStyleFn(setOptionValue(true, true, 1, "LINEDASH", ctx, data, statData, data.datasets[i].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", i, j, {
				nullvalue: null
			})));
			for (ti = 2; ti < pts.length - 4; ti += 2) {
				y1 = Math.max(Math.min(cp[2 * ti - 1], minimumpos), maximumpos);
				y2 = Math.max(Math.min(cp[2 * ti + 1], minimumpos), maximumpos);
				ctx.bezierCurveTo(cp[2 * ti - 2], y1, cp[2 * ti], y2, pts[ti + 2], pts[ti + 3]);
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
		if (typeof ctx.addListener != "undefined") {
			if (ctx.addListener == false) {
				mouseActionData[ctx.ChartNewId] = {
					data: data,
					config: config,
					prevShow: -1
				};
				return;
			}
		}
		//  if(config.addListener==false) return;
		var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"
		// reset mouseAction to check;
		if (typeof ctx.mouseAction == "undefined") {
			ctx.mouseAction = [];
		} else {
			for (var i = 0; i < ctx.mouseAction; i++) {
				if (ctx.mouseAction.substring(0, 1) != "/") ctx.mouseAction[i] = "/" + ctx.mouseAction[i];
			}
		}
		// liste mouse options;
		// ----------------------------------------------------		
		// - annotateDisplay : true, annotateFunction: "mousemove"
		// ----------------------------------------------------		
		// - saveScreen : savePngFunction: "mousedown right" - savePng=true
		// ----------------------------------------------------		
		// highLight : false, 	highLightMouseFunction : "mousemove",
		// ----------------------------------------------------		
		// - mouse sortir ou entrer dans une piece => Pas d'influence sur une action de souris. C'est lie a l'action de annotateFunction
		//      	annotateFunctionIn : inBar,
		//		annotateFunctionOut : outBar,
		// ----------------------------------------------------		
		// - mouseDownRight	mouseDownLeft: null  mouseDownMiddle: null  
		// - mouseMove: null 	mouseWheel : null    mouseOut: null (lorsque la souris sort du canvas) 	
		// ----------------------------------------------------		
		//  mouse sur texte : detectMouseOnText => Pas d'influence sur une action de souris. C'est lie a une autre action;
		// ----------------------------------------------------		
		function setAction(ctx, action) {
			if (ctx.mouseAction.indexOf("/" + action) >= 0) ctx.mouseAction[ctx.mouseAction.indexOf("/" + action)] = action;
			else if (ctx.mouseAction.indexOf(action) < 0) ctx.mouseAction[ctx.mouseAction.length] = action;
		};

		function add_listener(ctx, action) {
			if (isIE() < 9 && isIE() != false) ctx.canvas.attachEvent("on" + action.split(' ')[0], function(event) {
				doMouseAction(event, ctx.ChartNewId, action.split(' ')[0]);
			});
			else ctx.canvas.addEventListener(action.split(' ')[0], function(event) {
				doMouseAction(event, ctx, action.split(' ')[0]);
			}, false);
		};
		// - saveScreen : savePngFunction: "mousedown right" - savePng=true
		if (config.savePng == true) {
			if (config.savePngFunction == "mousedown left") setAction(ctx, "mousedown 1");
			else if (config.savePngFunction == "mousedown middle") setAction(ctx, "mousedown 2");
			else if (config.savePngFunction == "mousedown right") setAction(ctx, "mousedown 3");
		}
		// - annotateDisplay : true, annotateFunction: "mousemove"
		if (config.annotateDisplay || typeof config.annotateDisplay == 'function') {
			if (cursorDivCreated == false) oCursor = new makeCursorObj(config, annotate_shape);
			if (config.annotateFunction == "mousedown left") setAction(ctx, "mousedown 1");
			else if (config.annotateFunction == "mousedown middle") setAction(ctx, "mousedown 2");
			else if (config.annotateFunction == "mousedown right") setAction(ctx, "mousedown 3");
			else if (config.annotateFunction == "mousemove") setAction(ctx, "mousemove");
		}
		// highLight : false, 	highLightMouseFunction : "mousemove",
		if (config.highLight == true) {
			if (config.highLightMouseFunction == "mousedown left") setAction(ctx, "mousedown 1");
			else if (config.highLightMouseFunction == "mousedown middle") setAction(ctx, "mousedown 2");
			else if (config.highLightMouseFunction == "mousedown right") setAction(ctx, "mousedown 3");
			else if (config.highLightMouseFunction == "mousemove") setAction(ctx, "mousemove");
		}
		// mouse actions;
		if (typeof config.mouseMove == "function") setAction(ctx, "mousemove");
		if (typeof config.mouseDownLeft == "function") setAction(ctx, "mousedown 1");
		if (typeof config.mouseDownMiddle == "function") setAction(ctx, "mousedown 2");
		if (typeof config.mouseDownRight == "function") setAction(ctx, "mousedown 3");
		if (typeof config.mouseWheel == "function") setAction(ctx, mousewheelevt);
		if (typeof config.mouseOut == "function") setAction(ctx, "mouseout");
		if (typeof config.mouseDblClick == "function") setAction(ctx, "dblclick");
		var mouseAction = false;
		// add mouse event
		if ((ctx.mouseAction.indexOf("mousemove") >= 0 && ctx.mouseAction.indexOf("/mousemove") < 0) || (ctx.mouseAction.indexOf("mouseout") >= 0 && ctx.mouseAction.indexOf("/mouseout") < 0)) {
			setAction(ctx, "mouseout");
			mouseAction = true;
			add_listener(ctx, "mouseout");
			// mouseOut action;			
		}
		if ((ctx.mouseAction.indexOf("mousemove") >= 0 && ctx.mouseAction.indexOf("/mousemove") < 0) || (ctx.mouseAction.indexOf(mousewheelevt) >= 0 && ctx.mouseAction.indexOf("/" + mousewheelevt) < 0)) {
			setAction(ctx, mousewheelevt);
			mouseAction = true;
			add_listener(ctx, mousewheelevt);
			// mouseWheel action;			
		}
		if (ctx.mouseAction.indexOf("mousemove") >= 0 && ctx.mouseAction.indexOf("/mousemove") < 0) {
			mouseAction = true;
			add_listener(ctx, "mousemove");
			// mouseMove action;			
		}
		if (ctx.mouseAction.indexOf("dblclick") >= 0 && ctx.mouseAction.indexOf("/dblclick") < 0) {
			mouseAction = true;
			add_listener(ctx, "dblclick");
			// mouseMove action;			
		}
		if ((ctx.mouseAction.indexOf("mousedown 1") >= 0 && ctx.mouseAction.indexOf("/mousedown 1") < 0) || (ctx.mouseAction.indexOf("mousedown 2") >= 0 && ctx.mouseAction.indexOf("/mousedown 2") < 0) || (ctx.mouseAction.indexOf("mousedown 3") >= 0 && ctx.mouseAction.indexOf("/mousedown 3") < 0)) {
			mouseAction = true;
			add_listener(ctx, "mousedown");
			// mouseDown action;			
		}
		// remove contextMenu if forced with option contextMenu or if mouseDownRight is defined
		if ((config.contextMenu == false || ctx.mouseAction.indexOf("mousedown 3") >= 0) && ctx.mouseAction.indexOf("/removeContextMenu") < 0) {
			ctx.mouseAction[ctx.mouseAction.length] = "removeContextMenu";
			ctx.canvas.oncontextmenu = function(e) {
				e.preventDefault();
			};
		}
		// initialiser les variables necessaires pour l'action doMouseAction;
		inMouseAction[ctx.ChartNewId] = false;
		mouseActionData[ctx.ChartNewId] = {
			data: data,
			config: config,
			prevShow: -1
		};
	};
};

function showLabels(ctx, data, config, i) {
	var doShowLabels = setOptionValue(true, true, 1, "SHOWLABEL", ctx, data, undefined, undefined, config.showXLabels, "showXLabels", i, -1, undefined, {
		labelValue: fmtChartJS(config, data.labels[i], config.fmtXLabel),
		unformatedLabelValue: data.labels[i]
	});
	if (typeof doShowLabels == "number") {
		if (i >= config.firstLabelToShow - 1) doShowLabels = ((i + config.firstLabelToShow - 1) % parseInt(doShowLabels) == 0 ? true : false);
		else doShowLabels = false;
	}
	return doShowLabels;
};

function showYLabels(ctx, data, config, i, text) {
	var doShowLabels = setOptionValue(true, true, 1, "SHOWYLABEL", ctx, data, undefined, undefined, config.showYLabels, "showYLabels", -1, i, undefined, {
		labelValue: text
	});
	if (typeof doShowLabels == "number") {
		if (i >= config.firstYLabelToShow - 1) doShowLabels = ((i + config.firstYLabelToShow - 1) % parseInt(doShowLabels) == 0 ? true : false);
		else doShowLabels = false;
	}
	return doShowLabels;
};

function drawLegend(legendMsr, data, config, ctx, typegraph, cntiter) {
	if (config.legendPosY == 0 || config.legendPosY == 4 || config.legendPosX == 0 || config.legendPosX == 4) {
		if (cntiter != -1) return;
	} else {
		if (cntiter == -1) return;
		else if (config.animation == true) {
			if (typeof config.legendWhenToDraw == "number") {
				if (cntiter != config.legendWhenToDraw) return;
			} else if (cntiter != 1 && config.legendWhenToDraw == "first") return;
			else if (cntiter != config.animationSteps && config.legendWhenToDraw == "last") return;
		}
	}
	ctx.save();
	if (config.legendFillColor != "rgba(0,0,0,0)") {
		// fill color;
		ctx.setLineDash([]);
		ctx.lineWidth = 0;
		ctx.fillStyle = config.legendFillColor;
		ctx.drawRectangle({
			x: legendMsr.xLegendPos + legendMsr.legendBackgroundColorXPos,
			y: legendMsr.yLegendPos + legendMsr.legendBackgroundColorYPos,
			width: legendMsr.legendBackgroundColorWidth,
			height: legendMsr.legendBackgroundColorHeight,
			borders: config.legendBorders,
			bordersWidth: Math.ceil(ctx.chartLineScale * config.legendBordersWidth),
			borderSelection: config.legendBordersSelection,
			borderRadius: config.legendBordersRadius,
			fill: true,
			stroke: false
		});
	}
	if (config.legendBorders) {
		ctx.fillStyle = config.legendFillColor;
		ctx.setLineDash(lineStyleFn(config.legendBordersStyle));
		ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.legendBordersWidth);
		ctx.strokeStyle = config.legendBordersColors;
		ctx.drawRectangle({
			x: legendMsr.xLegendPos + legendMsr.legendBorderXPos,
			y: legendMsr.yLegendPos + legendMsr.legendBorderYPos,
			width: legendMsr.legendBorderWidth,
			height: legendMsr.legendBorderHeight,
			borders: true,
			bordersWidth: Math.ceil(ctx.chartLineScale * config.legendBordersWidth),
			borderSelection: config.legendBordersSelection,
			borderRadius: config.legendBordersRadius,
			fill: false,
			stroke: true
		});
	}
	ctx.setLineDash([]);
	ctx.restore();
	var xpos, ypos, fromi, orderi, i, tpof, lgtxt, nbcols;
	var drawLegendData;
	var lgdbox = legendMsr.legendBox;
	nbcols = legendMsr.nbLegendCols - 1;
	var yFirstLegendTextPos = legendMsr.yLegendPos + legendMsr.legendFirstTextYPos + legendMsr.highestLegend;
	var xFirstLegendTextPos = legendMsr.xLegendPos + legendMsr.legendFirstTextXPos;
	ypos = yFirstLegendTextPos - ((Math.ceil(ctx.chartTextScale * config.legendFontSize)) + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextVertical));
	xpos = 0;
	fromi = data.datasets.length;
	for (i = fromi - 1; i >= 0; i--) {
		orderi = i;
		if (legendMsr.reverseLegend) {
			orderi = data.datasets.length - i - 1;
		}
		tpof = typeof(data.datasets[orderi].title);
		if (tpof == "string") {
			if (!config.legendDrawEmptyData) {
				drawLegendData = false;
				for (j = 0; j < data.datasets[orderi].data.length; j++) {
					if (typeof(1 * data.datasets[orderi].data[j]) == "number") {
						if (1 * data.datasets[orderi].data[j] != 0) drawLegendData = true;
					}
				}
			} else drawLegendData = true;
			lgtxt = fmtChartJS(config, data.datasets[orderi].title, config.fmtLegend).trim();
			if (drawLegendData && lgtxt != "") {
				nbcols++;
				if (nbcols == legendMsr.nbLegendCols) {
					nbcols = 0;
					xpos = xFirstLegendTextPos;
					ypos += (Math.ceil(ctx.chartTextScale * config.legendFontSize)) + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextVertical);
				} else {
					xpos += legendMsr.widestLegend + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextHorizontal);
				}
				ctx.save();
				ctx.beginPath();
				if (ctx.tpchart == "Bar" || ctx.tpchart == "StackedBar")
					if (data.datasets[orderi].type == "Line" && (!config.datasetFill || setOptionValue(true, false, 1, "LINKTYPE", ctx, data, undefined, data.datasets[orderi].linkType, config.linkType, "linkType", orderi, -1, {
							nullvalue: null
						}) == 1)) lgdbox = false;
				if (ctx.tpchart == "Line" && ctx.tpchartSub == "Bubble")
					if (data.datasets[orderi].type == "Line" && (!config.datasetFill || setOptionValue(true, false, 1, "LINKTYPE", ctx, data, undefined, data.datasets[orderi].linkType, config.linkType, "linkType", orderi, -1, {
							nullvalue: null
						}) == 1)) lgdbox = false;
				if (lgdbox) {
					ctx.lineWidth = Math.ceil(ctx.chartLineScale * setOptionValue(true, false, 1, "LINEWIDTH", ctx, data, undefined, data.datasets[orderi].datasetStrokeWidth, config.datasetStrokeWidth, "datasetStrokeWidth", orderi, -1, {
						nullvalue: null
					}));
					ctx.beginPath();
					if (ctx.tpchartSub == "Bubble" && data.datasets[orderi].type != "Line") {
						ctx.strokeStyle = setOptionValue(true, true, 1, "LEGENDSTROKECOLOR", ctx, data, undefined, data.datasets[orderi].pointStrokeColor, config.defaultStrokeColor, "pointStrokeColor", orderi, -1, {
							animationValue: 1,
							xPosLeft: xpos,
							yPosBottom: ypos,
							xPosRight: xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize),
							yPosTop: ypos - (Math.ceil(ctx.chartTextScale * config.legendFontSize))
						});
					} else {
						ctx.strokeStyle = setOptionValue(true, false, 1, "LEGENDSTROKECOLOR", ctx, data, undefined, data.datasets[orderi].strokeColor, config.defaultFillColor, "strokeColor", orderi, -1, {
							animationValue: 1,
							xPosLeft: xpos,
							yPosBottom: ypos,
							xPosRight: xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize),
							yPosTop: ypos - (Math.ceil(ctx.chartTextScale * config.legendFontSize))
						});
					}
					ctx.setLineDash(lineStyleFn(setOptionValue(true, false, 1, "LEGENDLINEDASH", ctx, data, undefined, data.datasets[orderi].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", orderi, -1, {
						animationValue: 1,
						xPosLeft: xpos,
						yPosBottom: ypos,
						xPosRight: xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize),
						yPosTop: ypos - (Math.ceil(ctx.chartTextScale * config.legendFontSize))
					})));
					ctx.moveTo(xpos, ypos);
					ctx.lineTo(xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize), ypos);
					ctx.lineTo(xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize), ypos - (Math.ceil(ctx.chartTextScale * config.legendFontSize)));
					ctx.lineTo(xpos, ypos - (Math.ceil(ctx.chartTextScale * config.legendFontSize)));
					ctx.lineTo(xpos, ypos);
					ctx.stroke();
					ctx.closePath();
					if (ctx.tpchartSub == "Bubble" && data.datasets[orderi].type != "Line") {
						ctx.fillStyle = setOptionValue(true, true, 1, "LEGENDFILLCOLOR", ctx, data, undefined, data.datasets[orderi].pointColor, config.defaultStrokeColor, "pointColor", orderi, -1, {
							animationValue: 1,
							xPosLeft: xpos,
							yPosBottom: ypos,
							xPosRight: xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize),
							yPosTop: ypos - (Math.ceil(ctx.chartTextScale * config.legendFontSize))
						});
					} else {
						ctx.fillStyle = setOptionValue(true, false, 1, "LEGENDFILLCOLOR", ctx, data, undefined, data.datasets[orderi].fillColor, config.defaultFillColor, "fillColor", orderi, -1, {
							animationValue: 1,
							xPosLeft: xpos,
							yPosBottom: ypos,
							xPosRight: xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize),
							yPosTop: ypos - (Math.ceil(ctx.chartTextScale * config.legendFontSize))
						});
					}
					ctx.fill();
				} else {
					ctx.lineWidth = config.legendColorIndicatorStrokeWidth ? config.legendColorIndicatorStrokeWidth : Math.ceil(ctx.chartLineScale * setOptionValue(true, false, 1, "LINEWIDTH", ctx, data, undefined, data.datasets[orderi].datasetStrokeWidth, config.datasetStrokeWidth, "datasetStrokeWidth", orderi, -1, {
						nullvalue: null
					}));
					if (config.legendColorIndicatorStrokeWidth && config.legendColorIndicatorStrokeWidth > (Math.ceil(ctx.chartTextScale * config.legendFontSize))) {
						ctx.lineWidth = (Math.ceil(ctx.chartTextScale * config.legendFontSize));
					}
					ctx.strokeStyle = setOptionValue(true, false, 1, "LEGENDSTROKECOLOR", ctx, data, undefined, data.datasets[orderi].strokeColor, config.defaultFillColor, "strokeColor", orderi, -1, {
						animationValue: 1,
						xPosLeft: xpos,
						yPosBottom: ypos,
						xPosRight: xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize),
						yPosTop: ypos - (Math.ceil(ctx.chartTextScale * config.legendFontSize))
					});
					ctx.setLineDash(lineStyleFn(setOptionValue(true, false, 1, "LEGENDLINEDASH", ctx, data, undefined, data.datasets[orderi].datasetStrokeStyle, config.datasetStrokeStyle, "datasetStrokeStyle", orderi, -1, {
						animationValue: 1,
						xPosLeft: xpos,
						yPosBottom: ypos,
						xPosRight: xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize),
						yPosTop: ypos - (Math.ceil(ctx.chartTextScale * config.legendFontSize))
					})));
					ctx.moveTo(xpos + 2, ypos - ((Math.ceil(ctx.chartTextScale * config.legendFontSize)) / 2));
					ctx.lineTo(xpos + 2 + Math.ceil(ctx.chartTextScale * config.legendBlockSize), ypos - ((Math.ceil(ctx.chartTextScale * config.legendFontSize)) / 2));
					ctx.stroke();
					ctx.fill();
					if (config.pointDot) {
						ctx.beginPath();
						ctx.fillStyle = setOptionValue(true, false, 1, "LEGENDMARKERFILLCOLOR", ctx, data, undefined, data.datasets[orderi].pointColor, config.defaultStrokeColor, "pointColor", orderi, -1, {
							nullvalue: true
						});
						ctx.strokeStyle = setOptionValue(true, false, 1, "LEGENDMARKERSTROKESTYLE", ctx, data, undefined, data.datasets[orderi].pointStrokeColor, config.defaultStrokeColor, "pointStrokeColor", orderi, -1, {
							nullvalue: true
						});
						ctx.lineWidth = setOptionValue(true, false, ctx.chartLineScale, "LEGENDMARKERLINEWIDTH", ctx, data, undefined, data.datasets[orderi].pointDotStrokeWidth, config.pointDotStrokeWidth, "pointDotStrokeWidth", orderi, -1, {
							nullvalue: true
						});
						var markerShape = setOptionValue(true, false, 1, "LEGENDMARKERSHAPE", ctx, data, undefined, data.datasets[orderi].markerShape, config.markerShape, "markerShape", orderi, -1, {
							nullvalue: true
						});
						var markerRadius = setOptionValue(true, false, ctx.chartSpaceScale, "LEGENDMARKERRADIUS", ctx, data, undefined, data.datasets[orderi].pointDotRadius, config.pointDotRadius, "pointDotRadius", orderi, -1, {
							nullvalue: true
						});
						var markerStrokeStyle = setOptionValue(true, false, 1, "LEGENDMARKERSTROKESTYLE", ctx, data, undefined, data.datasets[orderi].pointDotStrokeStyle, config.pointDotStrokeStyle, "pointDotStrokeStyle", orderi, -1, {
							nullvalue: true
						});
						drawMarker(ctx, xpos + 2 + Math.ceil(ctx.chartTextScale * config.legendBlockSize) / 2, ypos - ((Math.ceil(ctx.chartTextScale * config.legendFontSize)) / 2), markerShape, markerRadius, markerStrokeStyle);
					}
					ctx.fill();
				}
				ctx.restore();
				ctx.save();
				ctx.beginPath();
				ctx.font = setOptionValue(true, false, 1, "LEGENDFONTSTYLE", ctx, data, undefined, config.legendFontStyle, config.legendFontStyle, "config.legendFontStyle", orderi, -1, {
					nullvalue: true
				}) + " " + (Math.ceil(ctx.chartTextScale * config.legendFontSize)).toString() + "px " + config.legendFontFamily;
				ctx.fillStyle = setOptionValue(true, false, 1, "LEGENDFONTCOLOR", ctx, data, undefined, config.legendFontColor, config.legendFontColor, "legendFontColor", orderi, -1, {
					nullvalue: true
				});
				ctx.textAlign = "left";
				ctx.textBaseline = "bottom";
				ctx.translate(xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize) + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenBoxAndText), ypos);
				ctx.fillTextMultiLine(lgtxt, 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.legendFontSize), true, config.detectMouseOnText, ctx, "LEGEND_TEXTMOUSE", 0, xpos + Math.ceil(ctx.chartTextScale * config.legendBlockSize) + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenBoxAndText), ypos, orderi, -1);
				ctx.restore();
			}
		}
	}
};

function measureLegend(data, ctx, config, widestLegend, highestLegend, nbLegendLines, nbLegendCols, availableLegendWidth) {
	var legendWidth = 0;
	var legendHeight = 0;
	var legendBackgroundColorWidth = 0;
	var legendBackgroundColorHeight = 0;
	var legendBorderWidth = 0;
	var legendBorderHeight = 0;
	var legendFirstTextXPos = 0;
	var legendFirstTextYPos = 0;
	var legendBackgroundColorXPos = 0;
	var legendBackgroundColorYPos = 0;
	var legendBorderXPos = 0;
	var legendBorderYPos = 0;
	legendBackgroundColorHeight = nbLegendLines * (highestLegend + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextVertical)) - Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextVertical) + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBeforeText) + Math.ceil(ctx.chartSpaceScale * config.legendSpaceAfterText);
	legendBackgroundColorWidth = nbLegendCols * (widestLegend + Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextHorizontal)) - Math.ceil(ctx.chartSpaceScale * config.legendSpaceBetweenTextHorizontal) + Math.ceil(ctx.chartSpaceScale * config.legendSpaceLeftText) + Math.ceil(ctx.chartSpaceScale * config.legendSpaceRightText);
	legendHeight = legendBackgroundColorHeight;
	legendWidth = legendBackgroundColorWidth;
	legendFirstTextXPos = Math.ceil(ctx.chartSpaceScale * config.legendSpaceLeftText);
	legendFirstTextYPos = Math.ceil(ctx.chartSpaceScale * config.legendSpaceBeforeText);
	if (config.legendBorders == true) {
		legendBorderWidth = legendWidth;
		legendBorderHeight = legendHeight;
		if (isBorder(config.legendBordersSelection, "LEFT")) {
			legendBorderWidth += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) / 2;
			legendWidth += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft);
			legendFirstTextXPos += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft);
			legendBorderXPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft) + Math.ceil(ctx.chartLineScale * config.legendBordersWidth) / 2;
			legendBackgroundColorXPos += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft);
		} else if (config.legendFillColor != "rgba(0,0,0,0)") {
			legendWidth += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft);
			legendFirstTextXPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft);
			legendBackgroundColorXPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft);
			legendBorderXPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft);
		}
		if (isBorder(config.legendBordersSelection, "RIGHT")) {
			legendBorderWidth += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) / 2;
			legendWidth += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceRight);
		} else if (config.legendFillColor != "rgba(0,0,0,0)") {
			legendWidth += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceRight);
		}
		if (isBorder(config.legendBordersSelection, "TOP")) {
			legendBorderHeight += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) / 2;
			legendHeight += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore);
			legendFirstTextYPos += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore);
			legendBackgroundColorYPos += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore);
			legendBorderYPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore) + Math.ceil(ctx.chartLineScale * config.legendBordersWidth) / 2;
		} else if (config.legendFillColor != "rgba(0,0,0,0)") {
			legendHeight += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore);
			legendFirstTextYPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore);
			legendBackgroundColorYPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore);
			legendBorderYPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore);
		}
		if (isBorder(config.legendBordersSelection, "BOTTOM")) {
			legendBorderHeight += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) / 2;
			legendHeight += Math.ceil(ctx.chartLineScale * config.legendBordersWidth) + Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceAfter);
		} else if (config.legendFillColor != "rgba(0,0,0,0)") {
			legendHeight += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceAfter);
		}
	} else if (config.legendFillColor != "rgba(0,0,0,0)") {
		legendWidth += Math.ceil(ctx.chartSpaceScale * (config.legendBordersSpaceRight + config.legendBordersSpaceLeft));
		legendHeight += Math.ceil(ctx.chartSpaceScale * (config.legendBordersSpaceBefore + config.legendBordersSpaceAfter));
		legendBackgroundColorXPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft);
		legendBackgroundColorYPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore);
		legendFirstTextXPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceLeft);
		legendFirstTextYPos += Math.ceil(ctx.chartSpaceScale * config.legendBordersSpaceBefore);
	}
	return {
		legendWidth: legendWidth,
		legendHeight: legendHeight,
		legendBackgroundColorWidth: legendBackgroundColorWidth,
		legendBackgroundColorHeight: legendBackgroundColorHeight,
		legendBorderWidth: legendBorderWidth,
		legendBorderHeight: legendBorderHeight,
		legendFirstTextXPos: legendFirstTextXPos,
		legendFirstTextYPos: legendFirstTextYPos,
		legendBackgroundColorXPos: legendBackgroundColorXPos,
		legendBackgroundColorYPos: legendBackgroundColorYPos,
		legendBorderXPos: legendBorderXPos,
		legendBorderYPos: legendBorderYPos,
		elementMsr: null
	};
};

function drawMarker(ctx, xpos, ypos, marker, markersize, markerStrokeStyle) {
	ctx.setLineDash(lineStyleFn(markerStrokeStyle));
	switch (marker) {
		case "square":
			ctx.rect(xpos - markersize, ypos - markersize, 2 * markersize, 2 * markersize);
			ctx.stroke();
			ctx.fill();
			ctx.setLineDash([]);
			break;
		case "triangle":
			pointA_x = 0;
			pointA_y = 2 / 3 * markersize;
			ctx.moveTo(xpos, ypos - pointA_y);
			ctx.lineTo(xpos + pointA_y * Math.sin(4 / 3), ypos + pointA_y * Math.cos(4 / 3));
			ctx.lineTo(xpos - pointA_y * Math.sin(4 / 3), ypos + pointA_y * Math.cos(4 / 3));
			ctx.lineTo(xpos, ypos - pointA_y);
			ctx.stroke();
			ctx.fill();
			ctx.setLineDash([]);
			break;
		case "diamond":
			ctx.moveTo(xpos, ypos + markersize);
			ctx.lineTo(xpos + markersize, ypos);
			ctx.lineTo(xpos, ypos - markersize);
			ctx.lineTo(xpos - markersize, ypos);
			ctx.lineTo(xpos, ypos + markersize);
			ctx.stroke();
			ctx.fill();
			ctx.setLineDash([]);
			break;
		case "plus":
			ctx.moveTo(xpos, ypos - markersize);
			ctx.lineTo(xpos, ypos + markersize);
			ctx.moveTo(xpos - markersize, ypos);
			ctx.lineTo(xpos + markersize, ypos);
			ctx.stroke();
			ctx.setLineDash([]);
			break;
		case "cross":
			ctx.moveTo(xpos - markersize, ypos - markersize);
			ctx.lineTo(xpos + markersize, ypos + markersize);
			ctx.moveTo(xpos - markersize, ypos + markersize);
			ctx.lineTo(xpos + markersize, ypos - markersize);
			ctx.stroke();
			ctx.setLineDash([]);
			break;
		case "circle":
		default:
			ctx.arc(xpos, ypos, markersize, 0, 2 * Math.PI * 1, true);
			ctx.stroke();
			ctx.fill();
			ctx.setLineDash([]);
			break;
	}
};

function initPassVariableData_part1(data, config, ctx) {
	var i, j, result, mxvalue, mnvalue, cumvalue, totvalue, lmaxvalue, lminvalue, lgtxt, lgtxt2, tp, prevpos, firstNotMissingi, lastNotMissingi, firstNotMissingj, lastNotMissingj, grandtotal;
	var startAngle, segmentAngle, cumulativeAngle, realCumulativeAngle;
	var MstartAngle, McumulativeAngle, MrealCumulativeAngle;
	var startRadius, stopRadius;
	var bubbleMax = -Number.MAX_VALUE;
	var bubbleMin = Number.MAX_VALUE;
	var axis;
	result = [];
	mxvalue = [];
	mxvalue[0] = [];
	mxvalue[1] = [];
	mnvalue = [];
	mnvalue[0] = [];
	mnvalue[1] = [];
	cumvalue = [];
	cumvalue[0] = [];
	cumvalue[1] = [];
	totvalue = [];
	totvalue[0] = [];
	totvalue[1] = [];
	lmaxvalue = [];
	lmaxvalue[0] = [];
	lmaxvalue[1] = [];
	lminvalue = [];
	lminvalue[0] = [];
	lminvalue[1] = [];
	prevpos = [];
	firstNotMissingi = [];
	lastNotMissingi = [];
	firstNotMissingj = [];
	lastNotMissingj = [];
	prevpos[0] = [];
	prevpos[1] = [];
	grandtotal = 0;
	MstartAngle = [];
	McumulativeAngle = [];
	MrealCumulativeAngle = [];
	startRadius = [];
	stopRadius = [];
	switch (ctx.tpchart) {
		case "PolarArea":
			var notemptyval, prevnotemptyval;
			notemptyval = [];
			prevnotemptyval = [];
			for (i = 0; i < data.datasets.length; i++) {
				for (j = 0; j < data.labels.length; j++) {
					if (i == 0) notemptyval[j] = 0;
					if (typeof data.datasets[i].data[j] != "undefined") notemptyval[j]++;
				}
			}
			var maxnotemptyval = 0;
			var nbnotemptyval = 0;
			for (j = 0; j < data.labels.length; j++) {
				prevnotemptyval[j] = nbnotemptyval
				maxnotemptyval = Math.max(notemptyval[j], maxnotemptyval);
				if (notemptyval[j] > 0) nbnotemptyval++;
				startRadius[j] = 0;
				stopRadius[j] = 1;
			}
			var totWeight = 1;
			break;
		case "Doughnut":
		case "Pie":
			var totWeight = 0;
			var debPos = 0;
			var vl1, vl2;
			for (j = 0; j < data.labels.length; j++) {
				vl1 = setOptionValue(true, true, 1, "RADIUSSPACEWEIGHT", ctx, data, null, data.radiusSpaceWeight, config.radiusSpaceWeight, "radiusSpaceWeight", j, -1, {
					nullvalue: null
				});
				vl2 = setOptionValue(true, true, 1, "RADIUSDATAWEIGHT", ctx, data, null, data.radiusDataWeight, config.radiusDataWeight, "radiusDataWeight", j, -1, {
					nullvalue: null
				});
				if (j != 0) {
					debPos += vl1;
					totWeight += vl1;
				}
				startRadius[j] = debPos;
				totWeight += vl2;
				stopRadius[j] = totWeight;
				debPos += vl2;
			}
			break;
		default:
			break;
	}
	for (i = 0; i < data.datasets.length; i++) {
		// BUG when all data are missing !
		if (typeof data.datasets[i].xPos != "undefined" && tpdraw(ctx, data.datasets[i]) == "Line") {
			for (j = data.datasets[i].data.length; j < data.datasets[i].xPos.length; j++) data.datasets[i].data.push(undefined);
		} else {
			for (j = data.datasets[i].data.length; j < data.labels.length; j++) data.datasets[i].data.push(undefined);
		}
		if (data.datasets[i].axis == 2) axis = 0;
		else axis = 1;
		result[i] = [];
		lmaxvalue[0][i] = -Number.MAX_VALUE;
		lmaxvalue[1][i] = -Number.MAX_VALUE;
		lminvalue[0][i] = Number.MAX_VALUE;
		lminvalue[1][i] = Number.MAX_VALUE;
		firstNotMissingi[i] = -1;
		lastNotMissingi[i] = -1;
		for (j = 0; j < data.datasets[i].data.length; j++) {
			if (typeof firstNotMissingj[j] == "undefined") {
				firstNotMissingj[j] = -1;
				lastNotMissingj[j] = -1;
				totvalue[0][j] = 0;
				mxvalue[0][j] = -Number.MAX_VALUE;
				mnvalue[0][j] = Number.MAX_VALUE;
				totvalue[1][j] = 0;
				mxvalue[1][j] = -Number.MAX_VALUE;
				mnvalue[1][j] = Number.MAX_VALUE;
			}
			var todisplay = true;
			if (ctx.tpchart == "Doughnut") {
				if (setOptionValue(false, true, 1, "DISPLAYDATA", ctx, data, null, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
						nullvalue: null
					}) == false) todisplay = false;
				if (setOptionValue(false, true, 1, "DISPLAYDATA", ctx, data, null, data.displayData, config.displayData, "displayData", -1, j, {
						nullvalue: null
					}) == false) todisplay = false;
			} else {
				if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, null, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
						nullvalue: null
					}) == false) todisplay = false;
				if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, null, data.displayData, config.displayData, "displayData", j, -1, {
						nullvalue: null
					}) == false) todisplay = false;
			}
			if (typeof data.datasets[i].data[j] == "undefined") todisplay = false;
			if (todisplay == true) {
				grandtotal += 1 * data.datasets[i].data[j];
				if (firstNotMissingi[i] == -1) firstNotMissingi[i] = j;
				lastNotMissingi[i] = j;
				if (firstNotMissingj[j] == -1) firstNotMissingj[j] = i;
				lastNotMissingj[j] = i;
				totvalue[axis][j] += 1 * data.datasets[i].data[j];
				mxvalue[axis][j] = Math.max(mxvalue[axis][j], 1 * data.datasets[i].data[j]);
				mnvalue[axis][j] = Math.min(mnvalue[axis][j], 1 * data.datasets[i].data[j]);
				lmaxvalue[axis][i] = Math.max(lmaxvalue[axis][i], 1 * data.datasets[i].data[j]);
				lminvalue[axis][i] = Math.min(lminvalue[axis][i], 1 * data.datasets[i].data[j]);
			}
		}
	}
	for (i = 0; i < data.datasets.length; i++) {
		if (data.datasets[i].axis == 2) axis = 0;
		else axis = 1;
		if (typeof(data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
		else lgtxt = "";
		var prevnotemptyj = -1;
		var prevemptyj = -1;
		for (j = 0; j < data.datasets[i].data.length; j++) {
			if (typeof cumvalue[0][j] == "undefined") {
				cumvalue[0][j] = 0;
				prevpos[0][j] = -1;
				cumvalue[1][j] = 0;
				prevpos[1][j] = -1;
			}
			lgtxt2 = "";
			if (typeof data.datasets[i].xPos != "undefined") {
				if (!(typeof data.datasets[i].xPos[j] == "undefined")) lgtxt2 = data.datasets[i].xPos[j];
			}
			if (lgtxt2 == "" && !(typeof(data.labels[j]) == "undefined")) lgtxt2 = data.labels[j];
			if (typeof lgtxt2 == "string") lgtxt2 = lgtxt2.trim();
			var todisplay = true;
			if (tpdraw(ctx, data.datasets[i]) == "Line") {
				if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, null, data.datasets[i].displayData, config.displayData, "displayData", i, j, {
						nullvalue: null
					}) == false) todisplay = false;
				if (setOptionValue(true, true, 1, "DISPLAYDATA", ctx, data, null, data.displayData, config.displayData, "displayData", j, -1, {
						nullvalue: null
					}) == false) todisplay = false;
			}
			if (typeof data.datasets[i].data[j] == "undefined") todisplay = false;
			if (todisplay) {
				cumvalue[axis][j] += 1 * data.datasets[i].data[j];
				switch (tpdraw(ctx, data.datasets[i])) {
					case "PolarArea":
					case "Doughnut":
					case "Pie":
						if (i == 0) {
							if (j == 0) {
								var realAmplitude = (((config.totalAmplitude * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
								if (realAmplitude <= config.zeroValue) realAmplitude = 2 * Math.PI;
							}
							McumulativeAngle[j] = (((-config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
							MrealCumulativeAngle[j] = (((config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
							if (ctx.tpchart == "PolarArea") {
								McumulativeAngle[j] += prevnotemptyval[j] * (realAmplitude / nbnotemptyval);
								MrealCumulativeAngle[j] -= prevnotemptyval[j] * (realAmplitude / nbnotemptyval);
							}
							MstartAngle[j] = McumulativeAngle[j];
						}
						if (ctx.tpchart == "PolarArea") {
							if (notemptyval[j] > 0) segmentAngle = (realAmplitude / nbnotemptyval) / notemptyval[j];
							else segmentAngle = 0;
						} else segmentAngle = (1 * data.datasets[i].data[j] / totvalue[axis][j]) * realAmplitude;
						if (segmentAngle >= Math.PI * 2) segmentAngle = Math.PI * 2 - 0.001; // bug on Android when segmentAngle is >= 2*PI;
						result[i][j] = {
							config: config,
							v1: fmtChartJS(config, lgtxt, config.fmtV1),
							v2: fmtChartJS(config, lgtxt2, config.fmtV2),
							v3: fmtChartJS(config, 1 * data.datasets[i].data[j], config.fmtV3),
							v4: fmtChartJS(config, cumvalue[axis][j], config.fmtV4),
							v5: fmtChartJS(config, totvalue[axis][j], config.fmtV5),
							v6: roundToWithThousands(config, fmtChartJS(config, 100 * data.datasets[i].data[j] / totvalue[axis][j], config.fmtV6), config.roundPct),
							v6T: roundToWithThousands(config, fmtChartJS(config, 100 * data.datasets[i].data[j] / grandtotal, config.fmtV6T), config.roundPct),
							v7: 0,
							v8: 0,
							v9: 0,
							v10: 0,
							v11: fmtChartJS(config, i, config.fmtV11),
							v12: fmtChartJS(config, j, config.fmtV12),
							v13: fmtChartJS(config, segmentAngle, config.fmtV13),
							v14: fmtChartJS(config, McumulativeAngle[j], config.fmtV14),
							v15: fmtChartJS(config, McumulativeAngle[j] + segmentAngle, config.fmtV15),
							lgtxt: lgtxt,
							lgtxt2: lgtxt2,
							datavalue: 1 * data.datasets[i].data[j],
							cumvalue: cumvalue[axis][j],
							totvalue: totvalue[axis][j],
							pctvalue: 100 * data.datasets[i].data[j] / totvalue[axis][j],
							pctvalueT: 100 * data.datasets[i].data[j] / grandtotal,
							maxvalue: mxvalue[axis][j],
							minvalue: mnvalue[axis][j],
							lmaxvalue: lmaxvalue[axis][i],
							lminvalue: lminvalue[axis][i],
							grandtotal: grandtotal,
							firstNotMissing: firstNotMissingj[j],
							lastNotMissing: lastNotMissingj[j],
							prevNotMissing: prevnotemptyj,
							prevMissing: prevemptyj,
							nextNotMissing: -1,
							segmentAngle: segmentAngle,
							firstAngle: MstartAngle[j],
							startAngle: McumulativeAngle[j],
							realStartAngle: MrealCumulativeAngle[j],
							endAngle: McumulativeAngle[j] + segmentAngle,
							radiusOffset: 0,
							midPosX: 0,
							midPosY: 0,
							int_radius: 0,
							ext_radius: 0,
							startRadius: startRadius[j] / totWeight,
							stopRadius: stopRadius[j] / totWeight,
							totRadiusWeight: totWeight,
							j: j,
							i: i,
							data: data
						};
						McumulativeAngle[j] = McumulativeAngle[j] + segmentAngle;
						MrealCumulativeAngle[j] = MrealCumulativeAngle[j] - segmentAngle;
						break;
					case "Bar":
					case "StackedBar":
					case "HorizontalBar":
					case "HorizontalStackedBar":
						result[i][j] = {
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
							maxvalue: mxvalue[axis][j],
							minvalue: mnvalue[axis][j],
							lmaxvalue: lmaxvalue[axis][i],
							lminvalue: lminvalue[axis][i],
							grandtotal: grandtotal,
							firstNotMissing: firstNotMissingj[j],
							lastNotMissing: lastNotMissingj[j],
							prevNotMissing: prevnotemptyj,
							prevMissing: prevemptyj,
							nextNotMissing: -1,
							j: j,
							i: i,
							data: data
						};
						if (1 * data.datasets[i].data[j] == 0 && (tpdraw(ctx, data.datasets[i]) == "HorizontalStackedBar" || tpdraw(ctx, data.datasets[i]) == "StackedBar")) result[i][j].v3 = "";
						break;
					case "Line":
						if (ctx.tpchartSub == "Bubble") {
							if (data.datasets[i].type != "Line") {
								markerRadius = setOptionValue(true, true, ctx.chartSpaceScale, "MARKERRADIUS", ctx, data, null, data.datasets[i].pointDotRadius, config.pointDotRadius, "pointDotRadius", i, j, {
									nullvalue: true
								});
								bubbleMax = Math.max(1 * markerRadius, bubbleMax);
								bubbleMin = Math.min(1 * markerRadius, bubbleMin);
							}
						};
					case "Radar":
						result[i][j] = {
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
							totvalue: totvalue[axis][j],
							cumvalue: cumvalue[axis][j],
							maxvalue: mxvalue[axis][j],
							minvalue: mnvalue[axis][j],
							lmaxvalue: lmaxvalue[axis][i],
							lminvalue: lminvalue[axis][i],
							grandtotal: grandtotal,
							firstNotMissing: firstNotMissingi[i],
							lastNotMissing: lastNotMissingi[i],
							prevNotMissing: prevnotemptyj,
							prevMissing: prevemptyj,
							nextNotMissing: -1,
							j: j,
							i: i,
							data: data
						};
						if (ctx.tpchartSub == "Bubble") {
							if (data.datasets[i].type != "Line") result[i][j].vbubble = setOptionValue(true, true, ctx.chartSpaceScale, "MARKERRADIUS", ctx, data, null, data.datasets[i].pointDotRadius, config.pointDotRadius, "pointDotRadius", i, j, {
								nullvalue: true
							});
							else result[i][j].vbubble = "";
							result[i][j].vbubble = fmtChartJS(config, result[i][j].vbubble, config.fmtVbubble);
						};
						if (prevpos[axis][j] >= 0) {
							result[i][j].v4 = fmtChartJS(config, (prevpos[axis][j] != -1 ? 1 * data.datasets[i].data[j] - result[prevpos[axis][j]][j].datavalue : 1 * data.datasets[i].data[j]), config.fmtV4);
							result[i][j].diffprev = (prevpos[axis][j] != -1 ? 1 * data.datasets[i].data[j] - result[prevpos[axis][j]][j].datavalue : 1 * data.datasets[i].data[j]);
							result[prevpos[axis][j]][j].diffnext = data.datasets[prevpos[axis][j]].data[j] - data.datasets[i].data[j];
							result[prevpos[axis][j]][j].v5 = result[prevpos[axis][j]][j].diffnext;
						} else {
							result[i][j].v4 = 1 * data.datasets[i].data[j];
						}
						prevpos[axis][j] = i;
						break;
					default:
						break;
				}
				if (prevnotemptyj != -1) {
					for (k = prevnotemptyj; k < j; k++) result[i][k].nextNotMissing = j;
				}
				prevnotemptyj = j;
			} else {
				prevemptyj = j;
				switch (tpdraw(ctx, data.datasets[i])) {
					case "PolarArea":
					case "Doughnut":
					case "Pie":
						if (i == 0) {
							if (j == 0) {
								var realAmplitude = (((config.totalAmplitude * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
								if (realAmplitude <= config.zeroValue) realAmplitude = 2 * Math.PI;
							}
							McumulativeAngle[j] = (((-config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
							MrealCumulativeAngle[j] = (((config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
							if (ctx.tpchart == "PolarArea") {
								McumulativeAngle[j] += prevnotemptyval[j] * (realAmplitude / nbnotemptyval);
								MrealCumulativeAngle[j] -= prevnotemptyval[j] * (realAmplitude / nbnotemptyval);
							}
							MstartAngle[j] = McumulativeAngle[j];
						}
					case "Bar":
					case "StackedBar":
					case "HorizontalBar":
					case "HorizontalStackedBar":
						result[i][j] = {
							v1: lgtxt,
							lmaxvalue: lmaxvalue[axis][i],
							lminvalue: lminvalue[axis][i],
							firstNotMissing: firstNotMissingj[j],
							lastNotMissing: lastNotMissingj[j],
							prevNotMissing: prevnotemptyj,
							prevMissing: prevemptyj,
							grandtotal: grandtotal
						};
						break;
					case "Line":
					case "Radar":
						result[i][j] = {
							v1: lgtxt,
							lmaxvalue: lmaxvalue[axis][i],
							lminvalue: lminvalue[axis][i],
							firstNotMissing: firstNotMissingi[i],
							lastNotMissing: lastNotMissingi[i],
							prevNotMissing: prevnotemptyj,
							prevMissing: prevemptyj,
							grandtotal: grandtotal
						};
						break;
				}
			}
		}
	}
	if (config.bubbleMaxVal == "max") result[0][0].bubbleMaxVal = bubbleMax;
	else result[0][0].bubbleMaxVal = 1 * config.bubbleMaxVal;
	if (config.bubbleMinVal == "min") result[0][0].bubbleMinVal = bubbleMin;
	else result[0][0].bubbleMinVal = 1 * config.bubbleMinVal;
	return result;
};

function initPassVariableData_part2(statData, data, config, ctx, logarithm1, logarithm2, othervars) {
	var realbars = 0;
	var i, j;
	var tempp = new Array(data.datasets.length);
	var tempn = new Array(data.datasets.length);
	statData[0][0].GrandTotExtent = 0;
	statData[0][0].cumulValTotExtentI = 0;
	statData[0][0].cumExtent = 0;
	statData[0][0].cumExtentJ = [];
	statData[0][0].totExtentJ = [];
	var mxj = 0;
	for (i = 0; i < data.datasets.length; i++) {
		statData[i][0].totExtentI = 0;
		statData[i][0].cumExtentI = 0;
		if (i > 0) statData[i][0].cumulValTotExtentI = statData[i - 1][0].cumulValTotExtentI + statData[i - 1][0].totExtentI;
		switch (tpdraw(ctx, data.datasets[i])) {
			case "PolarArea":
			case "Pie":
			case "Doughnut":
				for (j = 0; j < data.datasets[i].data.length; j++) {
					if (j >= mxj) {
						mxj++;
						statData[0][0].totExtentJ[j] = 0;
					}
					statData[i][j].v7 = fmtChartJS(config, othervars.midPosX, config.fmtV7);
					statData[i][j].v8 = fmtChartJS(config, othervars.midPosY, config.fmtV8),
					statData[i][j].v9 = fmtChartJS(config, othervars.int_radius + (othervars.ext_radius - othervars.int_radius) * statData[i][j].startRadius, config.fmtV9);
					statData[i][j].v10 = fmtChartJS(config, othervars.int_radius + (othervars.ext_radius - othervars.int_radius) * statData[i][j].stopRadius, config.fmtV10);
					if (ctx.tpchart == "PolarArea") {
						statData[i][j].radiusOffset = calculateOffset(logarithm1, 1 * data.datasets[i].data[j], othervars.calculatedScale, othervars.scaleHop);
						statData[i][j].v10 = fmtChartJS(config, statData[i].radiusOffset, config.fmtV10);
					} else {
					  statData[i][j].v10 = fmtChartJS(config, othervars.ext_radius, config.fmtV10);
						statData[i][j].radiusOffset = othervars.int_radius + (othervars.ext_radius - othervars.int_radius) * statData[i][j].stopRadius;
					}
					statData[i][j].outerVal = othervars.outerVal;
					statData[i][j].midPosX = othervars.midPosX;
					statData[i][j].midPosY = othervars.midPosY;
					statData[i][j].calculatedScale = othervars.calculatedScale;
					statData[i][j].scaleHop = othervars.scaleHop;
					statData[i][j].int_radius = othervars.int_radius + (othervars.ext_radius - othervars.int_radius) * statData[i][j].startRadius;
					statData[i][j].ext_radius = othervars.int_radius + (othervars.ext_radius - othervars.int_radius) * statData[i][j].stopRadius;
					statData[i][j].extent = Math.abs(statData[i][j].stopRadius - statData[i][j].startRadius);
					if (!isNumber(statData[i][j].extent)) statData[i][j].extent = 0;
					statData[i][0].totExtentI += statData[i][j].extent;
					statData[0][0].GrandTotExtent += statData[i][j].extent;
					statData[0][0].totExtentJ[j] += statData[i][j].extent;
					if (j > 0) statData[i][j].cumExtentI = statData[i][j - 1].cumExtentI + statData[i][j - 1].extent;
					if (i > 0 || j > 0) {
						if (j == 0) statData[i][j].cumExtent = statData[i - 1][data.datasets[i].data.length - 1].cumExtent;
						else statData[i][j].cumExtent = statData[i][j - 1].cumExtent
					}
				}
				break;
			case "Line":
				for (j = 0; j < data.datasets[i].data.length; j++) {
					if (j >= mxj) {
						mxj++;
						statData[0][0].totExtentJ[j] = 0;
					}
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
						statData[i][j].logarithmic = othervars.logarithmic;
					}
					statData[i][j].xPos = xPos(i, j, data, othervars.yAxisPosX, othervars.valueHop, othervars.nbValueHop);
					statData[i][j].yAxisPos = othervars.xAxisPosY - statData[i][j].zeroY;
					if (ctx.tpchart == "Bar" || ctx.tpchart == "StackedBar") {
						statData[i][j].xPos += (othervars.valueHop / 2);
						statData[i][j].yAxisPosX += (othervars.valueHop / 2);
					}
					if (j == 0) {
						statData[i][j].lmaxvalue_offset = calculateOffset(statData[i][j].logarithmic, statData[i][j].lmaxvalue, statData[i][j].calculatedScale, statData[i][j].scaleHop) - statData[i][j].zeroY;
						statData[i][j].lminvalue_offset = calculateOffset(statData[i][j].logarithmic, statData[i][j].lminvalue, statData[i][j].calculatedScale, statData[i][j].scaleHop) - statData[i][j].zeroY;
					} else {
						statData[i][j].lmaxvalue_offset = statData[i][0].lmaxvalue_offset;
						statData[i][j].lminvalue_offset = statData[i][0].lminvalue_offset;
					}
					if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {
						statData[i][j].yPosOffset = calculateOffset(statData[i][j].logarithmic, data.datasets[i].data[j], statData[i][j].calculatedScale, statData[i][j].scaleHop) - statData[i][j].zeroY;
						statData[i][j].posY = statData[i][j].yAxisPos - statData[i][j].yPosOffset;
					}
					if (typeof(data.datasets[i].origin) == 'object') {
						if (!(typeof(data.datasets[i].origin[j]) == 'undefined')) {
							statData[i][j].yPosOffsetOrigin = calculateOffset(statData[i][j].logarithmic, data.datasets[i].origin[j], statData[i][j].calculatedScale, statData[i][j].scaleHop) - statData[i][j].zeroY;
							statData[i][j].posYOrigin = statData[i][j].yAxisPos - statData[i][j].yPosOffsetOrigin;
						}
					}
					statData[i][j].posX = statData[i][j].xPos;
					statData[i][j].v9 = statData[i][j].xPos;
					statData[i][j].v10 = statData[i][j].posY;
					statData[i][j].graphMin = othervars.graphMin;
					statData[i][j].graphMax = othervars.graphMax;
					statData[i][j].graphMin2 = othervars.graphMin;
					statData[i][j].graphMax2 = othervars.graphMax;
					statData[i][j].annotateStartPosX = statData[i][j].xPos;
					statData[i][j].annotateEndPosX = statData[i][j].xPos;
					statData[i][j].annotateStartPosY = othervars.xAxisPosY;
					statData[i][j].annotateEndPosY = othervars.xAxisPosY - othervars.msr.availableHeight;
					statData[i][j].D1A = undefined;
					statData[i][j].D1B = undefined;
					statData[i][j].availableHeight = othervars.msr.availableHeight;
					statData[i][j].availableWidth = othervars.msr.availableWidth;
					if (!config.animationLeftToRight) {
						statData[i][j].extent = Math.abs(statData[i][j].yPosOffset);
						if (!isNumber(statData[i][j].extent)) statData[i][j].extent = 0;
					} else statData[i][j].extent = 1;
					statData[i][0].totExtentI += statData[i][j].extent;
					statData[0][0].GrandTotExtent += statData[i][j].extent;
					statData[0][0].totExtentJ[j] += statData[i][j].extent;
					if (j > 0) statData[i][j].cumExtentI = statData[i][j - 1].cumExtentI + statData[i][j - 1].extent;
					if (i > 0 || j > 0) {
						if (j == 0) statData[i][j].cumExtent = statData[i - 1][data.datasets[i-1].data.length - 1].cumExtent;
						else statData[i][j].cumExtent = statData[i][j - 1].cumExtent;
					}
				}
				break;
			case "Radar":
				var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
				for (j = 0; j < data.datasets[i].data.length; j++) {
					if (j >= mxj) {
						mxj++;
						statData[0][0].totExtentJ[j] = 0;
					}
					statData[i][j].midPosX = othervars.midPosX;
					statData[i][j].midPosY = othervars.midPosY;
					statData[i][j].int_radius = 0;
					statData[i][j].ext_radius = othervars.maxSize;
					statData[i][j].radiusOffset = othervars.maxSize;
					statData[i][j].calculatedScale = othervars.calculatedScale;
					statData[i][j].scaleHop = othervars.scaleHop;
					statData[i][j].calculated_offset = calculateOffset(logarithm1, data.datasets[i].data[j], othervars.calculatedScale, othervars.scaleHop);
					statData[i][j].offsetX = Math.cos(config.startAngle * Math.PI / 180 - j * rotationDegree) * statData[i][j].calculated_offset;
					statData[i][j].offsetY = Math.sin(config.startAngle * Math.PI / 180 - j * rotationDegree) * statData[i][j].calculated_offset;
					statData[i][j].v9 = statData[i][j].midPosX + statData[i][j].offsetX;
					statData[i][j].v10 = statData[i][j].midPosY - statData[i][j].offsetY;
					statData[i][j].posX = statData[i][j].midPosX + statData[i][j].offsetX;
					statData[i][j].posY = statData[i][j].midPosY - statData[i][j].offsetY;
					if (j == 0) statData[i][j].calculated_offset_max = calculateOffset(logarithm1, statData[i][j].lmaxvalue, othervars.calculatedScale, othervars.scaleHop);
					else statData[i][j].calculated_offset_max = statData[0][j].calculated_offset_max;
					statData[i][j].annotateStartPosX = othervars.midPosX;
					statData[i][j].annotateEndPosX = othervars.midPosX + Math.cos(config.startAngle * Math.PI / 180 - j * rotationDegree) * othervars.maxSize;
					statData[i][j].annotateStartPosY = othervars.midPosY;
					statData[i][j].annotateEndPosY = othervars.midPosY - Math.sin(config.startAngle * Math.PI / 180 - j * rotationDegree) * othervars.maxSize;
					if (Math.abs(statData[i][j].annotateStartPosX - statData[i][j].annotateEndPosX) < config.zeroValue) {
						statData[i][j].D1A = undefined;
						statData[i][j].D1B = undefined;
						statData[i][j].D2A = 0;
					} else {
						statData[i][j].D1A = (statData[i][j].annotateStartPosY - statData[i][j].annotateEndPosY) / (statData[i][j].annotateStartPosX - statData[i][j].annotateEndPosX);
						statData[i][j].D1B = -statData[i][j].D1A * statData[i][j].annotateStartPosX + statData[i][j].annotateStartPosY;
						if (Math.abs(statData[i][j].D1A) >= config.zeroValue) statData[i][j].D2A = -(1 / statData[i][j].D1A);
						else statData[i][j].D2A = undefined;
					}
					statData[i][j].extent = Math.sqrt(Math.pow(statData[i][j].offsetX - statData[i][j].midPosX, 2) + Math.pow(statData[i][j].offsetY - statData[i][j].midPosY, 2));
					if (!isNumber(statData[i][j].extent)) statData[i][j].extent = 0;
					statData[i][0].totExtentI += statData[i][j].extent;
					statData[0][0].GrandTotExtent += statData[i][j].extent;
					statData[0][0].totExtentJ[j] += statData[i][j].extent;
					if (j > 0) statData[i][j].cumExtentI = statData[i][j - 1].cumExtentI + statData[i][j - 1].extent;
					if (i > 0 || j > 0) {
						if (j == 0) statData[i][j].cumExtent = statData[i - 1][data.datasets[i].data.length - 1].cumExtent;
						else statData[i][j].cumExtent = statData[i][j - 1].cumExtent
					}
				}
				break;
			case "Bar":
				for (j = 0; j < data.datasets[i].data.length; j++) {
					if (j >= mxj) {
						mxj++;
						statData[0][0].totExtentJ[j] = 0;
					}
					statData[i][j].xAxisPosY = othervars.xAxisPosY;
					statData[i][j].yAxisPosX = othervars.yAxisPosX;
					statData[i][j].valueHop = othervars.valueHop;
					statData[i][j].barWidth = othervars.barWidth;
					statData[i][j].additionalSpaceBetweenBars = othervars.additionalSpaceBetweenBars;
					statData[i][j].nbValueHop = othervars.nbValueHop;
					statData[i][j].calculatedScale = othervars.calculatedScale;
					statData[i][j].scaleHop = othervars.scaleHop;
					statData[i][j].xPosLeft = othervars.yAxisPosX + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) + othervars.valueHop * j + othervars.additionalSpaceBetweenBars + othervars.barWidth * realbars + Math.ceil(ctx.chartSpaceScale * config.barDatasetSpacing) * realbars + Math.ceil(ctx.chartLineScale * config.barStrokeWidth) * realbars;
					statData[i][j].xPosRight = statData[i][j].xPosLeft + othervars.barWidth;
					if (data.datasets[i].axis == 2) {
						statData[i][j].yPosBottom = othervars.xAxisPosY - othervars.zeroY2;
						statData[i][j].barHeight = calculateOffset(logarithm2, 1 * data.datasets[i].data[j], othervars.calculatedScale2, othervars.scaleHop2) - othervars.zeroY2;
					} else {
						statData[i][j].yPosBottom = othervars.xAxisPosY - othervars.zeroY
						statData[i][j].barHeight = calculateOffset(logarithm1, 1 * data.datasets[i].data[j], othervars.calculatedScale, othervars.scaleHop) - othervars.zeroY;
					}
					statData[i][j].yPosTop = statData[i][j].yPosBottom - statData[i][j].barHeight + (Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2);
					statData[i][j].v7 = statData[i][j].xPosLeft;
					statData[i][j].v8 = statData[i][j].yPosBottom;
					statData[i][j].v9 = statData[i][j].xPosRight;
					statData[i][j].v10 = statData[i][j].yPosTop;
					statData[i][j].graphMin = othervars.graphMin;
					statData[i][j].graphMax = othervars.graphMax;
					statData[i][j].graphMin2 = othervars.graphMin;
					statData[i][j].graphMax2 = othervars.graphMax;
					statData[i][j].extent = Math.abs(1 * statData[i][j].yPosBottom - 1 * statData[i][j].yPosTop);
					if (!isNumber(statData[i][j].extent)) statData[i][j].extent = 0;
					statData[i][0].totExtentI += statData[i][j].extent;
					statData[0][0].totExtentJ[j] += statData[i][j].extent;
					statData[0][0].GrandTotExtent += statData[i][j].extent;
					if (j > 0) statData[i][j].cumExtentI = statData[i][j - 1].cumExtentI + statData[i][j - 1].extent;
					if (i > 0 || j > 0) {
						if (j == 0) statData[i][j].cumExtent = statData[i - 1][data.datasets[i].data.length - 1].cumExtent;
						else statData[i][j].cumExtent = statData[i][j - 1].cumExtent
					}
				}
				realbars++;
				break;
			case "StackedBar":
				for (j = 0; j < data.datasets[i].data.length; j++) {
					if (j >= mxj) {
						mxj++;
						statData[0][0].totExtentJ[j] = 0;
					}
					statData[i][j].xAxisPosY = othervars.xAxisPosY;
					statData[i][j].yAxisPosX = othervars.yAxisPosX;
					statData[i][j].valueHop = othervars.valueHop;
					statData[i][j].barWidth = othervars.barWidth;
					statData[i][j].additionalSpaceBetweenBars = othervars.additionalSpaceBetweenBars;
					statData[i][j].nbValueHop = othervars.nbValueHop;
					statData[i][j].calculatedScale = othervars.calculatedScale;
					statData[i][j].scaleHop = othervars.scaleHop;
					if (typeof tempp[j] == "undefined") {
						tempp[j] = 0;
						tempn[j] = 0;
						zeroY = calculateOffset(logarithm1, 0, othervars.calculatedScale, othervars.scaleHop);
					}
					if ((typeof data.datasets[i].data[j] == 'undefined')) {
						statData[i][j].extent = 0;
						statData[i][0].totExtentI += statData[i][j].extent;
						statData[0][0].totExtentJ[j] += statData[i][j].extent;
						statData[0][0].GrandTotExtent += statData[i][j].extent;
						if (j > 0) statData[i][j].cumExtentI = statData[i][j - 1].cumExtentI + statData[i][j - 1].extent;
						if (i > 0 || j > 0) {
							if (j == 0) statData[i][j].cumExtent = statData[i - 1][data.datasets[i].data.length - 1].cumExtent;
							else statData[i][j].cumExtent = statData[i][j - 1].cumExtent
						}
						continue;
					}
					statData[i][j].xPosLeft = othervars.yAxisPosX + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) + othervars.valueHop * j + othervars.additionalSpaceBetweenBars;
					if (1 * data.datasets[i].data[j] < 0) {
						statData[i][j].botval = tempn[j];
						statData[i][j].topval = tempn[j] + 1 * data.datasets[i].data[j];
						tempn[j] = tempn[j] + 1 * data.datasets[i].data[j];
					} else {
						statData[i][j].botval = tempp[j];
						statData[i][j].topval = tempp[j] + 1 * data.datasets[i].data[j];
						tempp[j] = tempp[j] + 1 * data.datasets[i].data[j];
					}
					statData[i][j].xPosRight = statData[i][j].xPosLeft + othervars.barWidth;
					statData[i][j].botOffset = calculateOffset(logarithm1, statData[i][j].botval, othervars.calculatedScale, othervars.scaleHop);
					statData[i][j].topOffset = calculateOffset(logarithm1, statData[i][j].topval, othervars.calculatedScale, othervars.scaleHop);
					statData[i][j].yPosBottom = othervars.xAxisPosY - statData[i][j].botOffset;
					statData[i][j].yPosTop = othervars.xAxisPosY - statData[i][j].topOffset;
					// treat spaceBetweenBar 
					if (Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar) > 0) {
						if (1 * data.datasets[i].data[j] < 0) {
							statData[i][j].yPosBottom += Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar);
							if (tempn[j] == 1 * data.datasets[i].data[j]) statData[i][j].yPosBottom -= (Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar) / 2);
							if (statData[i][j].yPosTop < statData[i][j].yPosBottom) statData[i][j].yPosBottom = statData[i][j].yPosTop;
						} else if (1 * data.datasets[i].data[j] > 0) {
							statData[i][j].yPosBottom -= Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar);
							if (tempp[j] == 1 * data.datasets[i].data[j]) statData[i][j].yPosBottom += (Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar) / 2);
							if (statData[i][j].yPosTop > statData[i][j].yPosBottom) statData[i][j].yPosBottom = statData[i][j].yPosTop;
						}
					}
					statData[i][j].v7 = statData[i][j].xPosLeft;
					statData[i][j].v8 = statData[i][j].yPosBottom;
					statData[i][j].v9 = statData[i][j].xPosRight;
					statData[i][j].v10 = statData[i][j].yPosTop;
					statData[i][j].graphMin = othervars.graphMin;
					statData[i][j].graphMax = othervars.graphMax;
					statData[i][j].graphMin2 = othervars.graphMin;
					statData[i][j].graphMax2 = othervars.graphMax;
					statData[i][j].extent = Math.abs(statData[i][j].yPosBottom - statData[i][j].yPosTop);
					if (!isNumber(statData[i][j].extent)) statData[i][j].extent = 0;
					statData[i][0].totExtentI += statData[i][j].extent;
					statData[0][0].totExtentJ[j] += statData[i][j].extent;
					statData[0][0].GrandTotExtent += statData[i][j].extent;
					if (j > 0) statData[i][j].cumExtentI = statData[i][j - 1].cumExtentI + statData[i][j - 1].extent;
					if (i > 0 || j > 0) {
						if (j == 0) statData[i][j].cumExtent = statData[i - 1][data.datasets[i].data.length - 1].cumExtent;
						else statData[i][j].cumExtent = statData[i][j - 1].cumExtent
					}
				}
				break;
			case "HorizontalBar":
				for (j = 0; j < data.datasets[i].data.length; j++) {
					if (j >= mxj) {
						mxj++;
						statData[0][0].totExtentJ[j] = 0;
					}
					statData[i][j].xAxisPosY = othervars.xAxisPosY;
					statData[i][j].yAxisPosX = othervars.yAxisPosX;
					statData[i][j].valueHop = othervars.valueHop;
					statData[i][j].barWidth = othervars.barWidth;
					statData[i][j].additionalSpaceBetweenBars = othervars.additionalSpaceBetweenBars;
					statData[i][j].nbValueHop = othervars.nbValueHop;
					statData[i][j].calculatedScale = othervars.calculatedScale;
					statData[i][j].scaleHop = othervars.scaleHop;
					statData[i][j].xPosLeft = othervars.yAxisPosX + othervars.zeroY;
					statData[i][j].yPosTop = othervars.xAxisPosY + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) - othervars.scaleHop * (j + 1) + othervars.additionalSpaceBetweenBars + othervars.barWidth * i + Math.ceil(ctx.chartSpaceScale * config.barDatasetSpacing) * i + Math.ceil(ctx.chartLineScale * config.barStrokeWidth) * i;
					statData[i][j].yPosBottom = statData[i][j].yPosTop + othervars.barWidth;
					statData[i][j].barWidth = calculateOffset(logarithm1, 1 * data.datasets[i].data[j], othervars.calculatedScale, othervars.valueHop) - othervars.zeroY;
					statData[i][j].xPosRight = statData[i][j].xPosLeft + statData[i][j].barWidth;
					statData[i][j].v7 = statData[i][j].xPosLeft;
					statData[i][j].v8 = statData[i][j].yPosBottom;
					statData[i][j].v9 = statData[i][j].xPosRight;
					statData[i][j].v10 = statData[i][j].yPosTop;
					statData[i][j].graphMin = othervars.graphMin;
					statData[i][j].graphMax = othervars.graphMax;
					statData[i][j].extent = Math.abs(statData[i][j].xPosLeft - statData[i][j].xPosRight);
					if (!isNumber(statData[i][j].extent)) statData[i][j].extent = 0;
					statData[i][0].totExtentI += statData[i][j].extent;
					statData[0][0].totExtentJ[j] += statData[i][j].extent;
					statData[0][0].GrandTotExtent += statData[i][j].extent;
					if (j > 0) statData[i][j].cumExtentI = statData[i][j - 1].cumExtentI + statData[i][j - 1].extent;
					if (i > 0 || j > 0) {
						if (j == 0) statData[i][j].cumExtent = statData[i - 1][data.datasets[i].data.length - 1].cumExtent;
						else statData[i][j].cumExtent = statData[i][j - 1].cumExtent
					}
				}
				break;
			case "HorizontalStackedBar":
				for (j = 0; j < data.datasets[i].data.length; j++) {
					if (j >= mxj) {
						mxj++;
						statData[0][0].totExtentJ[j] = 0;
					}
					statData[i][j].xAxisPosY = othervars.xAxisPosY;
					statData[i][j].yAxisPosX = othervars.yAxisPosX;
					statData[i][j].valueHop = othervars.valueHop;
					statData[i][j].barWidth = othervars.barWidth;
					statData[i][j].additionalSpaceBetweenBars = othervars.additionalSpaceBetweenBars;
					statData[i][j].nbValueHop = othervars.nbValueHop;
					statData[i][j].calculatedScale = othervars.calculatedScale;
					statData[i][j].scaleHop = othervars.scaleHop;
					if (i == 0) {
						tempp[j] = 0;
						tempn[j] = 0;
					}
					if ((typeof data.datasets[i].data[j] == 'undefined')) {
						statData[i][j].extent = 0;
						statData[i][0].totExtentI += statData[i][j].extent;
						statData[0][0].totExtentJ[j] += statData[i][j].extent;
						statData[0][0].GrandTotExtent += statData[i][j].extent;
						if (j > 0) statData[i][j].cumExtentI = statData[i][j - 1].cumExtentI + statData[i][j - 1].extent;
						if (i > 0 || j > 0) {
							if (j == 0) statData[i][j].cumExtent = statData[i - 1][data.datasets[i].data.length - 1].cumExtent;
							else statData[i][j].cumExtent = statData[i][j - 1].cumExtent
						}
						continue;
					}
					statData[i][j].xPosLeft = othervars.yAxisPosX + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) + othervars.valueHop * j;
					if (1 * data.datasets[i].data[j] < 0) {
						statData[i][j].leftval = tempn[j];
						statData[i][j].rightval = tempn[j] + 1 * data.datasets[i].data[j];
						tempn[j] = tempn[j] + 1 * data.datasets[i].data[j];
					} else {
						statData[i][j].leftval = tempp[j];
						statData[i][j].rightval = tempp[j] + 1 * data.datasets[i].data[j];
						tempp[j] = tempp[j] + 1 * data.datasets[i].data[j];
					}
					statData[i][j].rightOffset = HorizontalCalculateOffset(statData[i][j].rightval, othervars.calculatedScale, othervars.valueHop);
					statData[i][j].leftOffset = HorizontalCalculateOffset(statData[i][j].leftval, othervars.calculatedScale, othervars.valueHop);
					statData[i][j].xPosRight = othervars.yAxisPosX + statData[i][j].rightOffset;
					statData[i][j].xPosLeft = othervars.yAxisPosX + statData[i][j].leftOffset;
					statData[i][j].yPosTop = othervars.xAxisPosY + Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) - othervars.scaleHop * (j + 1) + othervars.additionalSpaceBetweenBars;
					statData[i][j].yPosBottom = statData[i][j].yPosTop + othervars.barWidth;
					// treat spaceBetweenBar 
					if (Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar) > 0) {
						if (1 * data.datasets[i].data[j] < 0) {
							statData[i][j].xPosLeft -= Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar);
							if (tempn[j] == 1 * data.datasets[i].data[j]) statData[i][j].xPosLeft += (Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar) / 2);
							if (statData[i][j].xPosLeft < statData[i][j].xPosRight) statData[i][j].xPosLeft = statData[i][j].xPosRight;
						} else if (1 * data.datasets[i].data[j] > 0) {
							statData[i][j].xPosLeft += Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar);
							if (tempp[j] == 1 * data.datasets[i].data[j]) statData[i][j].xPosLeft -= (Math.ceil(ctx.chartSpaceScale * config.spaceBetweenBar) / 2);
							if (statData[i][j].xPosLeft > statData[i][j].xPosRight) statData[i][j].xPosLeft = statData[i][j].xPosRight;
						}
					}
					statData[i][j].v7 = statData[i][j].xPosLeft;
					statData[i][j].v8 = statData[i][j].yPosBottom;
					statData[i][j].v9 = statData[i][j].xPosRight;
					statData[i][j].v10 = statData[i][j].yPosTop;
					statData[i][j].graphMin = othervars.graphMin;
					statData[i][j].graphMax = othervars.graphMax;
					statData[i][j].extent = Math.abs(statData[i][j].xPosLeft - statData[i][j].xPosRight);
					if (!isNumber(statData[i][j].extent)) statData[i][j].extent = 0;
					statData[i][0].totExtentI += statData[i][j].extent;
					statData[0][0].totExtentJ[j] += statData[i][j].extent;
					statData[0][0].GrandTotExtent += statData[i][j].extent;
					statData[i][j].allCumExtent = statData[0][0].GrandTotExtent;
					if (j > 0) statData[i][j].cumExtentI = statData[i][j - 1].cumExtentI + statData[i][j - 1].extent;
					if (i > 0 || j > 0) {
						if (j == 0) statData[i][j].cumExtent = statData[i - 1][data.datasets[i].data.length - 1].cumExtent;
						else statData[i][j].cumExtent = statData[i][j - 1].cumExtent
					}
				}
				break;
			default:
				break;
		}
		statData[0][0].cumExtentJ[0] = 0;
		for (j = 1; j < mxj; j++) {
			statData[0][0].cumExtentJ[j] = statData[0][0].cumExtentJ[j - 1] + statData[0][0].totExtentJ[j - 1];
		}
	}

	function xPos(ival, iteration, data, yAxisPosX, valueHop, nbValueHop) {
		if (typeof data.datasets[ival].xPos == "object") {
			if (!(typeof data.datasets[ival].xPos[Math.floor(iteration + config.zeroValue)] == "undefined")) {
				var width = valueHop * nbValueHop;
				var deb = (typeof data.xBegin != "undefined") ? data.xBegin : (typeof(1 * data.labels[0]) == "number" && !isNaN(1 * data.labels[0]) ? 1 * data.labels[0] : 0);
				var fin = (typeof data.xEnd != "undefined") ? data.xEnd : ((typeof(1 * data.labels[data.labels.length - 1]) == "number") && !isNaN(1 * data.labels[data.labels.length - 1]) ? 1 * data.labels[data.labels.length - 1] : data.labels.length - 1);
				if (fin <= deb) fin = deb + 100;
				if (1 * data.datasets[ival].xPos[Math.floor(iteration + config.zeroValue)] >= deb && data.datasets[ival].xPos[Math.floor(iteration + config.zeroValue)] <= fin) {
					var p1 = yAxisPosX + width * ((1 * data.datasets[ival].xPos[Math.floor(iteration + config.zeroValue)] - deb) / (fin - deb));
					var p2 = p1;
					if (Math.abs(iteration - Math.floor(iteration + config.zeroValue)) > config.zeroValue) {
						p2 = xPos(ival, Math.ceil(iteration - config.zeroValue), data);
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
			return CapValue(log10(val) * scaleHop - log10(calculatedScale.graphMin) * scaleHop, undefined, 0);
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

function isBooleanOptionTrue(optionVar, defaultvalue) {
	var j;
	if (typeof optionvar == "undefined") {
		if (typeof defaultvalue == "function") return true;
		else if (typeof defaultvalue == "object") {
			for (j = 0; j < defaultvalue.length; j++)
				if (defaultvalue[j]) return true;
			return false;
		} else return defaultvalue;
	}
	if (typeof optionvar == "function") return true;
	else if (typeof optionvar == "object") {
		for (j = 0; j < optionvar.length; j++)
			if (optionvar[j]) return true;
		return false;
	} else return optionvar;
};

function setOptionValue(config_on_posi, treat_special, rescale, reference, ctx, data, statData, optionvar, defaultvalue, varname, posi, posj, othervars) {
	var rv;
	if (treat_special == true) {
		if (typeof(data.special) == "object") {
			for (var t = data.special.length - 1; t >= 0; t--) {
				if (typeof data.special[t].posi == "undefined" || typeof data.special[t].posj == "undefined") continue;
				if (data.special[t].posi != posi || data.special[t].posj != posj || posi == -1 || posj == -1) continue;
				if (typeof data.special[t][varname] != "undefined") {
					return data.special[t][varname];
				}
			}
		}
	}
	if (typeof optionvar == "undefined") {
		if (typeof defaultvalue == "function") return defaultvalue(reference, ctx, data, statData, posi, posj, othervars);
		else if (typeof defaultvalue == "object") {
			if (config_on_posi) rv = defaultvalue[Math.min(defaultvalue.length - 1, Math.max(0, posi))];
			else rv = defaultvalue[Math.min(defaultvalue.length - 1, Math.max(0, posj))];
		} else {
			rv = defaultvalue;
		}
		if (rescale != 1) rv = Math.ceil(rv * rescale);
		return rv;
	}
	if (typeof optionvar == "function") rv = optionvar(reference, ctx, data, statData, posi, posj, othervars);
	else if (typeof optionvar == "object") {
		if (posj == -1) rv = optionvar[Math.min(optionvar.length - 1, Math.max(0, posi))];
		else rv = optionvar[Math.min(optionvar.length - 1, Math.max(0, posj))];
	} else rv = optionvar;
	if (rescale != 1) rv = Math.ceil(rv * rescale);
	return rv;
};

function tpdraw(ctx, dataval) {
	switch (ctx.tpchart) {
		case "Bar":
		case "StackedBar":
			if (dataval.type == "Line") {
				tp = "Line";
			} else {
				tp = ctx.tpchart;
			}
			break;
		default:
			tp = ctx.tpchart;
			break;
	}
	return tp;
};

function setTextBordersAndBackground(ctx, text, fontsize, xpos, ypos, borders, bordersselection, borderscolor, borderswidth, bordersxspace, bordersyspace, bordersstyle, backgroundcolor, optiongroup, BordersRadius) {
	var textHeight, textWidth;
	// compute text width and text height;
	if (typeof text != "string") {
		var txt = text.toString();
		textHeight = fontsize * (txt.split("\n").length || 1);
		textWidth = ctx.measureText(txt).width;
	} else {
		textHeight = fontsize * (text.split("\n").length || 1);
		textWidth = ctx.measureText(text).width;
	}
	// compute xright, xleft, ytop, ybot;
	var xright, xleft, ytop, ybot;
	if (ctx.textAlign == "center") {
		xright = -textWidth / 2;
		xleft = textWidth / 2;
	} else if (ctx.textAlign == "left") {
		xright = 0;
		xleft = textWidth;
	} else if (ctx.textAlign == "right") {
		xright = -textWidth;
		xleft = 0;
	}
	if (ctx.textBaseline == "top") {
		ytop = 0;
		ybottom = textHeight;
	} else if (ctx.textBaseline == "center" || ctx.textBaseline == "middle") {
		ytop = -textHeight / 2;
		ybottom = textHeight / 2;
	} else if (ctx.textBaseline == "bottom") {
		ytop = -textHeight;
		ybottom = 0;
	}
	ctx.save();
	ctx.beginPath();
	ctx.translate(xpos, ypos);
	if (backgroundcolor != "none") {
		this.lineWidth = 0;
		ctx.strokeStyle = "rgba(0,0,0,0)";
		ctx.fillStyle = backgroundcolor;
		ctx.drawRectangle({
			x: xright - bordersxspace,
			y: ybottom + bordersyspace,
			width: xleft - xright + 2 * bordersxspace,
			height: ytop - ybottom - 2 * bordersyspace,
			borders: borders,
			bordersWidth: borderswidth,
			borderSelection: bordersselection,
			borderRadius: BordersRadius,
			fill: true,
			stroke: false
		})
	}
	// draw border;
	if (borders) {
		ctx.lineWidth = borderswidth;
		ctx.strokeStyle = borderscolor;
		if (backgroundcolor != "none") ctx.fillStyle = backgroundcolor;
		else ctx.fillStyle = "rgba(0,0,0,0)";
		ctx.setLineDash(lineStyleFn(bordersstyle));
		ctx.drawRectangle({
			x: xright - bordersxspace - isBorder(bordersselection, "LEFT") * borderswidth / 2,
			y: ybottom + bordersyspace + isBorder(bordersselection, "BOTTOM") * borderswidth / 2,
			width: xleft - xright + 2 * bordersxspace + (isBorder(bordersselection, "LEFT") + isBorder(bordersselection, "RIGHT")) * borderswidth / 2,
			height: -textHeight - 2 * bordersyspace - (isBorder(bordersselection, "BOTTOM") + isBorder(bordersselection, "TOP")) * borderswidth / 2,
			borders: borders,
			bordersWidth: borderswidth,
			borderSelection: bordersselection,
			borderRadius: BordersRadius,
			fill: false,
			stroke: true
		})
		ctx.setLineDash([]);
	}
	ctx.beginPath();
	ctx.restore();
};

function calculatePieDrawingSize(ctx, msr, config, data, statData) {
	var realCumulativeAngle = (((config.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
	var realAmplitude = (((config.totalAmplitude * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
	if (realAmplitude <= config.zeroValue) realAmplitude = 2 * Math.PI;
	var debAngle = ((realCumulativeAngle - realAmplitude) + 4 * Math.PI) % (2 * Math.PI);
	var finAngle = debAngle + realAmplitude;
	var qposdeb = Math.floor(((debAngle + config.zeroValue) / (Math.PI / 2)) % 4);
	var qposfin = Math.floor(((finAngle - config.zeroValue) / (Math.PI / 2)) % 4);
	var q = [0, 0, 0, 0];
	if (qposdeb <= qposfin)
		for (var i = qposdeb; i <= qposfin; i++) q[i] = 1;
	else {
		for (var i = qposdeb; i < 4; i++) q[i] = 1;
		for (var i = 0; i <= qposfin; i++) q[i] = 1;
	}
	if (q[0] == 0 && q[1] == 0) {
		midPieY = msr.topNotUsableHeight + 5;
		doughnutRadius = msr.availableHeight - 5;
	} else if (q[2] == 0 && q[3] == 0) {
		midPieY = msr.topNotUsableHeight + msr.availableHeight;
		doughnutRadius = msr.availableHeight - 5;
	} else {
		midPieY = msr.topNotUsableHeight + (msr.availableHeight / 2);
		doughnutRadius = msr.availableHeight / 2 - 5;
	}
	var realAvailableWidth;
	if (q[0] == 0 && q[3] == 0) {
		midPieX = msr.leftNotUsableWidth + msr.availableWidth - 5;
		doughnutRadius = Math.min(doughnutRadius, msr.availableWidth - 5);
		realAvailableWidth = msr.availableWidth - 5
	} else if (q[1] == 0 && q[2] == 0) {
		midPieX = msr.leftNotUsableWidth + 5;
		doughnutRadius = Math.min(doughnutRadius, msr.availableWidth - 5);
		realAvailableWidth = msr.availableWidth - 5
	} else {
		midPieX = msr.leftNotUsableWidth + (msr.availableWidth / 2);
		doughnutRadius = Math.min(doughnutRadius, (msr.availableWidth / 2) - 5);
		realAvailableWidth = (msr.availableWidth / 2) - 5
	}
	// Computerange Pie Radius
	var j = data.labels.length - 1;
	if (isBooleanOptionTrue(undefined, config.inGraphDataShow) && setOptionValue(false, true, 1, "INGRAPHDATARADIUSPOSITION", ctx, data, statData, undefined, config.inGraphDataRadiusPosition, "inGraphDataRadiusPosition", 0, j, {
			nullValue: true
		}) == 3 && setOptionValue(false, true, 1, "INGRAPHDATAALIGN", ctx, data, statData, undefined, config.inGraphDataAlign, "inGraphDataAlign", 0, j, {
			nullValue: true
		}) == "off-center" && setOptionValue(false, true, 1, "INGRAPHDATAROTATE", ctx, data, statData, undefined, config.inGraphDataRotate, "inGraphDataRotate", 0, j, {
			nullValue: true
		}) == 0) {
		doughnutRadius = doughnutRadius - setOptionValue(false, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", 0, j, {
			nullValue: true
		}) - setOptionValue(false, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", 0, j, {
			nullValue: true
		}) - 5;
		var posAngle;
		for (var i = 0; i < data.datasets.length; i++) {
			if (!(typeof(data.datasets[i].data[j]) == 'undefined') && 1 * data.datasets[i].data[j] >= 0) {
				ctx.font = setOptionValue(false, true, 1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, undefined, config.inGraphDataFontStyle, "inGraphDataFontStyle", i, j, {
					nullValue: true
				}) + ' ' + setOptionValue(false, true, ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, undefined, config.inGraphDataFontSize, "inGraphDataFontSize", i, j, {
					nullValue: true
				}) + 'px ' + setOptionValue(false, true, 1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, undefined, config.inGraphDataFontFamily, "inGraphDataFontFamily", i, j, {
					nullValue: true
				});
				if (setOptionValue(false, true, 1, "INGRAPHDATAANGLEPOSITION", ctx, data, statData, undefined, config.inGraphDataAnglePosition, "inGraphDataAnglePosition", i, j, {
						nullValue: true
					}) == 1) posAngle = realCumulativeAngle + setOptionValue(false, true, 1, "INGRAPHDATAPADDINANGLE", ctx, data, statData, undefined, config.inGraphDataPaddingAngle, "inGraphDataPaddingAngle", i, j, {
					nullValue: true
				}) * (Math.PI / 180);
				else if (setOptionValue(false, true, 1, "INGRAPHDATAANGLEPOSITION", ctx, data, statData, undefined, config.inGraphDataAnglePosition, "inGraphDataAnglePosition", i, j, {
						nullValue: true
					}) == 2) posAngle = realCumulativeAngle - statData[i][j].segmentAngle / 2 + setOptionValue(false, true, 1, "INGRAPHDATAPADDINANGLE", ctx, data, statData, undefined, config.inGraphDataPaddingAngle, "inGraphDataPaddingAngle", i, j, {
					nullValue: true
				}) * (Math.PI / 180);
				else if (setOptionValue(false, true, 1, "INGRAPHDATAANGLEPOSITION", ctx, data, statData, undefined, config.inGraphDataAnglePosition, "inGraphDataAnglePosition", i, j, {
						nullValue: true
					}) == 3) posAngle = realCumulativeAngle - statData[i][j].segmentAngle + setOptionValue(false, true, 1, "INGRAPHDATAPADDINANGLE", ctx, data, statData, undefined, config.inGraphDataPaddingAngle, "inGraphDataPaddingAngle", i, j, {
					nullValue: true
				}) * (Math.PI / 180);
				realCumulativeAngle -= statData[i][j].segmentAngle;
				var dispString = tmplbis(setOptionValue(false, true, 1, "INGRAPHDATATMPL", ctx, data, statData, undefined, config.inGraphDataTmpl, "inGraphDataTmpl", i, j, {
					nullValue: true
				}), statData[i][j], config);
				var textMeasurement = ctx.measureTextMultiLine(dispString).textWidth;
				var MaxRadiusX = Math.abs((realAvailableWidth - textMeasurement) / Math.cos(posAngle)) - setOptionValue(false, true, 1, "INGRAPHDATAPADDINGRADIUS", ctx, data, statData, undefined, config.inGraphDataPaddingRadius, "inGraphDataPaddingRadius", i, j, {
					nullValue: true
				}) - 5;
				if (MaxRadiusX < doughnutRadius) doughnutRadius = MaxRadiusX;
			}
		}
	}
	doughnutRadius = doughnutRadius * config.radiusScale;
	return {
		radius: doughnutRadius,
		midPieX: midPieX,
		midPieY: midPieY
	};
};

function drawGridScale(ctx, data, config, msr, yAxisPosX, xAxisPosY, zeroY, valueHop, scaleHop, nbxlines, nbylines) {
	var i, j, tickHop;
	var lineColor;
	var lineWidth;
	// draw X Scale
	var bottomDrawn = false;
	var topDrawn = false;
	if (config.drawXScaleLine !== false) {
		for (var s = 0; s < config.drawXScaleLine.length; s++) {
			// get special lineWidth and lineColor for this xScaleLine
			var yPosXScale;
			switch (config.drawXScaleLine[s].position) {
				case "bottom":
					yPosXScale = xAxisPosY;
					bottomDrawn = true;
					break;
				case "top":
					yPosXScale = xAxisPosY - (nbxlines * scaleHop);
					topDrawn = true;
					break;
				case "0":
				case 0:
					// check if zero exists
					yPosXScale = xAxisPosY;
					if (zeroY != 0) yPosXScale = xAxisPosY - zeroY;
					else bottomDrawn = true;
					if (Math.abs(yPosXScale - (xAxisPosY - (nbxlines * scaleHop))) < config.zeroValue) topDrawn = true;
					break;
			}
			drawScaleLine(ctx, yAxisPosX - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft), yPosXScale, yAxisPosX + msr.availableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight), yPosXScale, config.drawXScaleLine[s].lineWidth ? config.drawXScaleLine[s].lineWidth : Math.ceil(ctx.chartLineScale * config.scaleLineWidth), config.drawXScaleLine[s].lineColor ? config.drawXScaleLine[s].lineColor : config.scaleLineColor, config.scaleGridLineStyle);
		}
	}
	// draw line parallel to X Scale;
	for (i = -1 + (bottomDrawn == true); i < nbxlines; i++) {
		if (i < nbxlines - (topDrawn == true)) {
			if ((i == -1 && config.xAxisBottom) || (i == nbxlines - 1 && config.xAxisTop) || config.scaleShowGridLines && (i + 1) % config.scaleYGridLinesStep == 0) {
				drawFirst = false;
				if (config.scaleTickSizeLeft > 0) {
					drawScaleLine(ctx, yAxisPosX - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft), xAxisPosY - ((i + 1) * scaleHop), yAxisPosX, xAxisPosY - ((i + 1) * scaleHop), Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), config.tickColor != "gridLine" && config.yAxisLeft ? config.scaleLineColor : config.scaleGridLineColor, config.scaleGridLineStyle);
				}
				drawScaleLine(ctx, yAxisPosX, xAxisPosY - ((i + 1) * scaleHop), yAxisPosX + msr.availableWidth, xAxisPosY - ((i + 1) * scaleHop), Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), config.scaleGridLineColor, config.scaleGridLineStyle);
				if (config.scaleTickSizeRight > 0) {
					drawScaleLine(ctx, yAxisPosX + msr.availableWidth, xAxisPosY - ((i + 1) * scaleHop), yAxisPosX + msr.availableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight), xAxisPosY - ((i + 1) * scaleHop), Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), config.tickColor != "gridLine" && config.yAxisRight ? config.scaleLineColor : config.scaleGridLineColor, config.scaleGridLineStyle);
				}
			} else {
				if (config.scaleTickSizeLeft > 0) {
					drawScaleLine(ctx, yAxisPosX - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft), xAxisPosY - ((i + 1) * scaleHop), yAxisPosX, xAxisPosY - ((i + 1) * scaleHop), Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), config.tickColor != "gridLine" && config.yAxisLeft ? config.scaleLineColor : config.scaleGridLineColor, config.scaleGridLineStyle);
				}
				if (config.scaleTickSizeRight > 0) {
					drawScaleLine(ctx, yAxisPosX + msr.availableWidth, xAxisPosY - ((i + 1) * scaleHop), yAxisPosX + msr.availableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight), xAxisPosY - ((i + 1) * scaleHop), Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), config.tickColor != "gridLine" && config.yAxisRight ? config.scaleLineColor : config.scaleGridLineColor, config.scaleGridLineStyle);
				}
			}
		}
		// Minor ticks ;
		if (config.scaleMinorTickVerticalCount > 0 && i != -1) {
			tickHop = scaleHop / (config.scaleMinorTickVerticalCount + 1);
			for (j = 1; j < config.scaleMinorTickVerticalCount + 1; j++) {
				if (config.scaleMinorTickHorizontalLines) {
					if (config.scaleMinorTickSizeLeft > 0) {
						drawScaleLine(ctx, yAxisPosX - Math.ceil(ctx.chartLineScale * config.scaleMinorTickSizeLeft), xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, yAxisPosX, xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.minorTickColor != "gridLine" && config.yAxisLeft ? config.scaleLineColor : config.scaleMinorTickColor, config.scaleMinorTickStyle);
					}
					drawScaleLine(ctx, yAxisPosX, xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, yAxisPosX + msr.availableWidth, xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.scaleMinorTickColor, config.scaleMinorTickStyle);
					if (config.scaleMinorTickSizeRight > 0) {
						drawScaleLine(ctx, yAxisPosX + msr.availableWidth, xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, yAxisPosX + msr.availableWidth + Math.ceil(ctx.chartLineScale * config.scaleMinorTickSizeRight), xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.minorTickColor != "gridLine" && config.yAxisRight ? config.scaleLineColor : config.scaleMinorTickColor, config.scaleMinorTickStyle);
					}
				} else {
					if (config.scaleMinorTickSizeLeft > 0) {
						drawScaleLine(ctx, yAxisPosX - Math.ceil(ctx.chartLineScale * config.scaleMinorTickSizeLeft), xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, yAxisPosX, xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.minorTickColor != "gridLine" && config.yAxisLeft ? config.scaleLineColor : config.scaleMinorTickColor, config.scaleMinorTickStyle);
					}
					if (config.scaleMinorTickSizeRight > 0) {
						drawScaleLine(ctx, yAxisPosX + msr.availableWidth, xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, yAxisPosX + msr.availableWidth + Math.ceil(ctx.chartLineScale * config.scaleMinorTickSizeRight), xAxisPosY - ((i + 1) * scaleHop) + j * tickHop, Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.minorTickColor != "gridLine" && config.yAxisRight ? config.scaleLineColor : config.scaleMinorTickColor, config.scaleMinorTickStyle);
					}
				}
			}
		}
	}
	var lineColor;
	var lineWidth;
	// Y Axis and lines parallel to Y axis;
	for (i = 0; i < nbylines; i++) {
		ctx.beginPath();
		if ((i == 0 && config.yAxisLeft) || (i == (nbylines - 1) && config.yAxisRight)) {
			lineColor = config.scaleLineColor;
			lineWidth = config.scaleLineWidth;
		} else {
			lineColor = config.scaleGridLineColor;
			lineWidth = config.scaleGridLineWidth
		}
		if ((i == 0 && config.yAxisLeft) || (i == (nbylines - 1) && config.yAxisRight) || (i == nbylines - 1 && config.scaleTickSizeRight > 0) || (config.scaleShowGridLines && i % config.scaleXGridLinesStep == 0)) {
			if (config.scaleTickSizeBottom > 0) {
				drawScaleLine(ctx, yAxisPosX + i * valueHop, xAxisPosY + Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom), yAxisPosX + i * valueHop, xAxisPosY, Math.ceil(ctx.chartLineScale * lineWidth), config.tickColor != "gridLine" && bottomDrawn ? config.scaleLineColor : lineColor, config.scaleGridLineStyle);
			}
			drawScaleLine(ctx, yAxisPosX + i * valueHop, xAxisPosY, yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight, Math.ceil(ctx.chartLineScale * lineWidth), lineColor, config.scaleGridLineStyle);
			if (config.scaleTickSizeTop > 0) {
				drawScaleLine(ctx, yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight, yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop), Math.ceil(ctx.chartLineScale * lineWidth), config.tickColor != "gridLine" && topDrawn ? config.scaleLineColor : lineColor, config.scaleGridLineStyle);
			}
		} else {
			if (config.scaleTickSizeBottom > 0) {
				drawScaleLine(ctx, yAxisPosX + i * valueHop, xAxisPosY, yAxisPosX + i * valueHop, xAxisPosY + Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom), Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), config.tickColor != "gridLine" && bottomDrawn ? config.scaleLineColor : config.scaleGridLineColor, config.scaleGridLineStyle);
			}
			if (config.scaleTickSizeTop > 0) {
				drawScaleLine(ctx, yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight, yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop), Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), config.tickColor != "gridLine" && topDrawn ? config.scaleLineColor : config.scaleGridLineColor, config.scaleGridLineStyle);
			}
		}
		// Minor ticks ;
		if (i < nbylines - 1) {
			if (config.scaleMinorTickHorizontalCount > 0) {
				tickHop = valueHop / (config.scaleMinorTickHorizontalCount + 1);
				for (j = 1; j < config.scaleMinorTickHorizontalCount + 1; j++) {
					if (config.scaleMinorTickVerticalLines) {
						if (config.scaleMinorTickSizeTop > 0) {
							drawScaleLine(ctx, yAxisPosX + i * valueHop + j * tickHop, xAxisPosY - msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleMinorTickSizeTop), yAxisPosX + i * valueHop + j * tickHop, xAxisPosY - msr.availableHeight, Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.minorTickColor != "gridLine" && bottomDrawn ? config.scaleLineColor : config.scaleMinorTickColor, config.scaleMinorTickStyle);
						}
						drawScaleLine(ctx, yAxisPosX + i * valueHop + j * tickHop, xAxisPosY - msr.availableHeight, yAxisPosX + i * valueHop + j * tickHop, xAxisPosY, Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.scaleMinorTickColor, config.scaleMinorTickStyle);
						if (config.scaleMinorTickSizeBottom > 0) {
							drawScaleLine(ctx, yAxisPosX + i * valueHop + j * tickHop, xAxisPosY, yAxisPosX + i * valueHop + j * tickHop, xAxisPosY + Math.ceil(ctx.chartLineScale * config.scaleMinorTickSizeBottom), Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.minorTickColor != "gridLine" && bottomDrawn ? config.scaleLineColor : config.scaleMinorTickColor, config.scaleMinorTickStyle);
						}
					} else {
						if (config.scaleMinorTickSizeBottom > 0) {
							drawScaleLine(ctx, yAxisPosX + i * valueHop + j * tickHop, xAxisPosY, yAxisPosX + i * valueHop + j * tickHop, xAxisPosY + Math.ceil(ctx.chartLineScale * config.scaleMinorTickSizeBottom), Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.minorTickColor != "gridLine" && bottomDrawn ? config.scaleLineColor : config.scaleMinorTickColor, config.scaleMinorTickStyle);
						}
						if (config.scaleMinorTickSizeTop > 0) {
							drawScaleLine(ctx, yAxisPosX + i * valueHop + j * tickHop, xAxisPosY - msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleMinorTickSizeTop), yAxisPosX + i * valueHop + j * tickHop, xAxisPosY - msr.availableHeight, Math.ceil(ctx.chartLineScale * config.scaleMinorTickWidth), config.minorTickColor != "gridLine" && topDrawn ? config.scaleLineColor : config.scaleMinorTickColor, config.scaleMinorTickStyle);
						}
					}
				}
			}
		}
	}
};

function drawScaleLine(ctx, x_start, y_start, x_end, y_end, lineWidth, lineColor, lineStyle) {
	ctx.beginPath();
	ctx.moveTo(x_start, y_start);
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = lineColor;
	ctx.lineTo(x_end, y_end);
	ctx.setLineDash(lineStyleFn(lineStyle));
	ctx.stroke();
	ctx.setLineDash([]);
};

function drawTick(ctx, direction, x_start, x_end, y_start, y_end, tickCount, tickSize, tickWidth, tickColor, tickStyle) {
	var tickHop, i;
	if (direction == 0) tickHop = (x_end - x_start) / (tickCount + 1);
	else tickHop = (y_end - y_start) / (tickCount + 1);
	for (i = 1; i <= tickCount; i++) {
		ctx.beginPath();
		ctx.moveTo(x_start + i * tickHop * (direction == 0), y_start + i * tickHop * (direction == 1));
		ctx.lineWidth = Math.ceil(ctx.chartLineScale * tickWidth);
		ctx.strokeStyle = tickColor;
		//Check i isnt 0, so we dont go over the Y axis twice.
		ctx.lineTo(x_start + i * tickHop * (direction == 0) + tickSize * (direction == 1), y_start + i * tickHop * (direction == 1) - tickSize * (direction == 0));
		ctx.setLineDash(lineStyleFn(tickStyle));
		ctx.stroke();
		ctx.setLineDash([]);
	}
};

function isBorder(option, position) {
	var voption = option;
	if (voption >= 8) {
		if (position == "RIGHT") return (true);
		else voption -= 8;
	}
	if (voption >= 4) {
		if (position == "TOP") return (true);
		else voption -= 4;
	}
	if (voption >= 2) {
		if (position == "LEFT") return (true);
		else voption -= 2;
	}
	if (voption >= 1) {
		if (position == "BOTTOM") return (true);
		else voption -= 1;
	}
	return (false);
};
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
			s = p / 4;
		} else s = p / (2 * Math.PI) * Math.asin(1 / a);
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
			s = p / 4;
		} else s = p / (2 * Math.PI) * Math.asin(1 / a);
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
			s = p / 4;
		} else s = p / (2 * Math.PI) * Math.asin(1 / a);
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

function computeAnimation(currentAnimationValue, config, animationVal, easingFunc, i, j, data, statData, chartType) {
	var vl = 0;
	var startAnim = 0;
	var stopAnim = 1;
	var debAnim = 1;
	var finAnim = 1;
	var easeAdjustedAnimationPercent;
	while (3 * vl < animationVal.length && typeof(1 * animationVal[3 * vl]) === "number" && startAnim + Math.abs(1 * animationVal[3 * vl]) < currentAnimationValue) {
		startAnim += Math.min(Math.abs(1 * animationVal[3 * vl]), 1);
		vl++;
	}
	if (3 * vl < animationVal.length && typeof(1 * animationVal[3 * vl]) === "number") stopAnim = Math.min(startAnim + Math.abs(1 * animationVal[3 * vl]), 1);
	if (3 * vl + 1 < animationVal.length && typeof(1 * animationVal[3 * vl + 1]) === "number") debAnim = Math.min(Math.abs(1 * animationVal[3 * vl + 1]), 1);
	if (3 * vl + 2 < animationVal.length && typeof(1 * animationVal[3 * vl + 2]) === "number") finAnim = Math.min(Math.abs(1 * animationVal[3 * vl + 2]), 1);
	if (stopAnim != startAnim) newAnimValue = debAnim + ((currentAnimationValue - startAnim) / (stopAnim - startAnim)) * (finAnim - debAnim);
	else newAnimValue = 1;
	if (i != -1 && j != -1) {
		if (i < config.animationStartWithDataset - 1) newAnimValue = 1;
		else if (i <= config.animationStartWithDataset - 1 && j < config.animationStartWithData - 1) newAnimValue = 1;
		else {
			switch (config.animationByDataset) {
				case true:
					if (newAnimValue < statData[i][0].cumulValTotExtentI / statData[0][0].GrandTotExtent) newAnimValue = 0;
					else if (newAnimValue < (statData[i][0].cumulValTotExtentI + statData[i][0].totExtentI) / statData[0][0].GrandTotExtent) {
						newAnimValue = (newAnimValue - statData[i][0].cumulValTotExtentI / statData[0][0].GrandTotExtent);
						newAnimValue = newAnimValue / (statData[i][0].totExtentI / statData[0][0].GrandTotExtent);
						if (config.animationLeftToRight) {
							if (newAnimValue < statData[i][j].cumExtentI / statData[i][0].totExtentI) newAnimValue = 0;
							else if (newAnimValue < (statData[i][j].cumExtentI + statData[i][j].extent) / statData[i][0].totExtentI) {
								newAnimValue = newAnimValue - statData[i][j].cumExtentI / statData[i][0].totExtentI;
								newAnimValue = newAnimValue / (statData[i][j].extent / statData[i][0].totExtentI);
							} else newAnimValue = 1;
						}
					} else newAnimValue = 1;
					break;
				case false:
				default:
					switch (config.animationLeftToRight) {
						case true:
							if (newAnimValue < statData[0][0].cumExtentJ[j] / statData[0][0].GrandTotExtent) newAnimValue = 0;
							else if (newAnimValue < (statData[0][0].cumExtentJ[j] + statData[0][0].totExtentJ[j]) / statData[0][0].GrandTotExtent) {
								newAnimValue = newAnimValue - statData[0][0].cumExtentJ[j] / statData[0][0].GrandTotExtent;
								newAnimValue = newAnimValue / (statData[0][0].totExtentJ[j] / statData[0][0].GrandTotExtent);
							} else newAnimValue = 1;
							break;
						case false:
						default:
							break;
					}
					break;
			}
		}
	}
	var easingFunction = animationOptions[easingFunc[Math.min(vl, easingFunc.length - 1)]];
	if (typeof easingFunction === "function") easeAdjustedAnimationPercent = (config.animation) ? easingFunction(newAnimValue) : 1;
	else easeAdjustedAnimationPercent = currentAnimationValue;
	return easeAdjustedAnimationPercent;
};

function valAnimation(value, globalValue, data, config, i, j, statData, configData, configFunction, tableData, tableFunction, chartType) {
	var newTableData = undefined;
	var newTableFunction = undefined;
	if (typeof tableData === "object") {
		if (typeof tableData[j] === "object") {
			newTableData = tableData[j];
		}
	};
	if (typeof tableFunction === "object") {
		if (typeof tableFunction[j] === "object") {
			newTableFunction = tableFunction[j];
		}
	};
	if (typeof newTableData == "undefined") newTableData = configData;
	if (typeof newTableFunction == "undefined") newTableFunction = configFunction;
	value = computeAnimation(globalValue, config, newTableData, newTableFunction, i, j, data, statData, chartType);
	return value;
};

function correctAnimation(animationDecimal, data, config, i, j, statData, chartType) {
	var correctAnimationDecimal = {
		animationGlobal: animationDecimal.animationGlobal,
		yAxis: valAnimation(animationDecimal.yAxis, animationDecimal.animationGlobal, data, config, i, j, statData, config.animationYAxis, config.animationYAxisEasing, data.datasets[i].animationYAxis, data.datasets[i].animationYAxisEasing, chartType),
		subYAxis: 0,
		radius: valAnimation(animationDecimal.radius, animationDecimal.animationGlobal, data, config, i, j, statData, config.animationRadius, config.animationRadiusEasing, data.datasets[i].animationRadius, data.datasets[i].animationRadiusEasing, chartType),
		rotate: valAnimation(animationDecimal.rotate, animationDecimal.animationGlobal, data, config, i, j, statData, config.animationRotate, config.animationRotateEasing, data.datasets[i].animationRotate, data.datasets[i].animationRotateEasing, chartType)
	};
	if (chartType == "LINE" && config.animationLeftToRight && correctAnimationDecimal.yAxis > 0 && correctAnimationDecimal.yAxis < 1) {
		correctAnimationDecimal.subYAxis = correctAnimationDecimal.yAxis;
		correctAnimationDecimal.yAxis = 1;
	}
	return correctAnimationDecimal;
};

function convertData(data, generate) {
	console.log("GENERATE:" + generate);
	if (generate) console.log("var data = {");
	if (generate) console.log('     labels : [""],');
	if (generate) console.log('     datasets : [');
	var newData = {
		labels: [""],
		datasets: []
	}
	for (var i = 0; i < data.length; i++) {
		if (generate) console.log("           {")
		newData.datasets[i] = {
			data: []
		};
		if (typeof data[i].value != "undefined") {
			if (generate) console.log("      data : [" + data[i].value + "],");
			newData.datasets[i].data = [data[i].value];
		} else {
			if (generate) console.log("      data : [" + data[i].value + "],");
			newData.datasets[i].data = [];
		}
		if (typeof data[i].color != "undefined") {
			if (generate) console.log('      fillColor : "' + data[i].color + '",');
			newData.datasets[i].fillColor = data[i].color;
		}
		if (typeof data[i].title != "undefined") {
			if (generate) console.log('      title : "' + data[i].title + '",');
			newData.datasets[i].title = data[i].title;
		}
		if (typeof data[i].link != "undefined") {
			if (generate) console.log('      link : "' + data[i].link + '",');
			newData.datasets[i].link = data[i].link;
		}
		if (typeof data[i].imageLoad != "undefined") {
			if (generate) console.log('      imageLoad : <image>,');
			newData.datasets[i].imageLoad = data[i].imageLoad;
		}
		if (typeof data[i].imagePos != "undefined") {
			if (generate) console.log('      imagePos : ' + data[i].imagePos + ',');
			newData.datasets[i].imagePos = data[i].imagePos;
		}
		if (typeof data[i].imageHeight != "undefined") {
			if (generate) console.log('      imageHeight : ' + data[i].imageHeight + ',');
			newData.datasets[i].imageHeight = data[i].imageHeight;
		}
		if (typeof data[i].imageWidth != "undefined") {
			if (generate) console.log('      imageWidth : ' + data[i].imageWidth + ',');
			newData.datasets[i].imageWidth = data[i].imageWidth;
		}
		if (typeof data[i].text != "undefined") {
			if (generate) console.log('      text : "' + data[i].text + '",');
			newData.datasets[i].text = data[i].text;
		}
		if (typeof data[i].fontStyle != "undefined") {
			if (generate) console.log('      fontStyle : "' + data[i].fontStyle + '",');
			newData.datasets[i].fontStyle = data[i].fontStyle;
		}
		if (typeof data[i].fontSize != "undefined") {
			if (generate) console.log('      fontSize : ' + data[i].fontSize + ',');
			newData.datasets[i].fontSize = data[i].fontSize;
		}
		if (typeof data[i].expandOutRadius != "undefined") {
			if (generate) console.log('      expandOutRadius : ' + data[i].expandOutRadius + ',');
			newData.datasets[i].expandOutRadius = data[i].expandOutRadius;
		}
		if (typeof data[i].expandInRadius != "undefined") {
			if (generate) console.log('      expandInRadius : ' + data[i].expandInRadius + ',');
			newData.datasets[i].expandInRadius = data[i].expandInRadius;
		}
		if (typeof data[i].gradientColors != "undefined") {
			if (generate) console.log('      gradientColors : < put here the gradient Colors definitions> ' + data[i].gradientColors + ',');
			newData.datasets[i].gradientColors = data[i].gradientColors;
		}
		if (generate) {
			console.log('      nothing : true    // line added to avoid a comma after last line');
			if (i == data.length - 1) console.log("           }");
			else console.log("           },");
		}
	}
	if (generate) console.log(']');
	if (data.length > 0) {
		if (typeof data[0].shapesInChart != "undefined") newData.shapesInChart = data[0].shapesInChart;
		if (generate) {
			console.log("     ,");
			console.log("     <   put here the shapesInChart    >");
		}
	}
	if (generate) console.log("};");
	return newData;
};
