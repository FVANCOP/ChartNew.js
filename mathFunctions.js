function mean(params) {
	var datasetNr = params.datasetNr;
	var data = params.data;
	var mean = 0;
	var nr = 0;
	for (var j = 0; j < data.datasets[datasetNr].data.length; j++) {
		// important to check because missing values are possible
		if (data.datasets[datasetNr].data[j]) {
			mean += data.datasets[datasetNr].data[j];
			nr++;
		}
	}
	mean /= nr;

	return mean;
}

function varianz(params) {
	var data = params.data;
	var datasetNr = params.datasetNr;
	var meanVal = mean(params);
	var varianz = 0;
	var nr = 0;
	for (var j = 0; j < data.datasets[datasetNr].data.length; j++) {
		// important to check because missing values are possible
		if (data.datasets[datasetNr].data[j]) {
			varianz += Math.pow(data.datasets[datasetNr].data[j]-meanVal,2);
			nr++;
		}
	}
	return varianz/nr;
}

function stddev(params) {
	return Math.sqrt(varianz(params));
}

function cv(params) {
	return stddev(params)/mean(params);
}



function drawMath(ctx,config,data,vars) {
	var xAxisPosY = vars.xAxisPosY;
	var yAxisPosX = vars.yAxisPosX;
	var valueHop  = vars.valueHop;
	var scaleHop  = vars.scaleHop;
	var zeroY     = vars.zeroY;
	var calculatedScale = vars.calculatedScale;
	var calculateOffset = vars.calculateOffset;

	// check each dataset if a mathDraw function exists
	for (var i = 0; i < data.datasets.length; i++) {
		// get mathFctName (stddev|mean|...)
		var deviationFct = data.datasets[i].drawMathDeviation;
		if (deviationFct) {
			drawMathDeviation(i,deviationFct);
		}
		var lineFct = data.datasets[i].drawMathLine;
		if (lineFct) {
			drawMathLine(i,lineFct);
		}
	}

	/**
	 * Draw a deviation vertical line (if needed with top and bottom horizontal lines)
	 * @param i {integer} dataset number
	 * @param deviationFct {string} math function name
	 */
	function drawMathDeviation(i,deviationFct) {
		var deviation = 0;
		// check if the math function exists
		if (typeof eval(deviationFct) == "function") {
			var parameter = {data:data,datasetNr: i};
			deviation = window[deviationFct](parameter);
		 }
		if (deviation) {
			ctx.strokeStyle= data.datasets[i].deviationStrokeColor ? data.datasets[i].deviationStrokeColor : config.defaultStrokeColor;
			ctx.lineWidth = config.datasetStrokeWidth;
			ctx.beginPath();
			for (var j = 0; j < data.datasets[i].data.length; j++) {
				// important to check because missing values are possible
				if (data.datasets[i].data[j]) {
					var deviationWidth = data.datasets[i].deviationWidth;
					// draw the top and the bottom of the vertical line if a deviationWidth exists
					if (deviationWidth) {
						ctx.moveTo(xPos(j)-deviationWidth,yPos(i,j,-deviation,true));
						ctx.lineTo(xPos(j)+deviationWidth,yPos(i,j,-deviation,true));
						ctx.moveTo(xPos(j)-deviationWidth,yPos(i,j,deviation,true));
						ctx.lineTo(xPos(j)+deviationWidth,yPos(i,j,deviation,true));
					}
					// draw the vertical line
					ctx.moveTo(xPos(j),yPos(i,j,-deviation,true));
					ctx.lineTo(xPos(j),yPos(i,j,deviation,true));
				}
			}
			ctx.stroke();
			ctx.closePath();
		}
	}

	/**
	 * Draw a horizontal line
	 * @param i {integer} numer of dataset
	 * @param lineFct {string} name of the mathfunctions => compute height
	 */
	function drawMathLine(i,lineFct) {
		var line = 0;
		// check if the math function exists
		if (typeof eval(lineFct) == "function") {
			var parameter = {data:data,datasetNr: i};
			line = window[lineFct](parameter);
		 }
		if (isNumber(line)) {
			ctx.strokeStyle= data.datasets[i].mathLineStrokeColor ? data.datasets[i].mathLineStrokeColor : config.defaultStrokeColor;
			ctx.lineWidth = config.datasetStrokeWidth;
			ctx.beginPath();
			ctx.moveTo(xPos(0),yPos(i,0,line,false));
			ctx.lineTo(xPos(data.datasets[i].data.length-1),yPos(i,data.datasets[i].data.length-1,line,false));
			ctx.stroke();
			ctx.closePath();
		}
	}

	/**
	 * Get a y position depending on the current values
	 * @param dataset {integer} number of dataset
	 * @param iteration {integer} number of value inside dataset.data
	 * @param add {float} add a value to the current value if value is true
	 * @param value {bool} true => value+add, false=>add
	 * @returns {float} position (px)
	 */
	function yPos(dataSet, iteration, add,value) {
		value = value ? data.datasets[dataSet].data[iteration] : 0;
		return xAxisPosY - calculateOffset(config, value+add, calculatedScale, scaleHop);
	};
	function xPos(iteration) {
		return yAxisPosX + (valueHop * iteration);
	};
}
