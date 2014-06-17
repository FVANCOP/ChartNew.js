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



// Draw function
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
		var mathFctName = data.datasets[i].drawMathDeviation;
		if (mathFctName) {
			var deviation = 0;
			// check if the math function exists
			if (typeof eval(mathFctName) == "function") {
				var parameter = {data:data,datasetNr: i};
				deviation = window[mathFctName](parameter);
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
							ctx.moveTo(xPos(j)-deviationWidth,yPos(i,j,-deviation));
							ctx.lineTo(xPos(j)+deviationWidth,yPos(i,j,-deviation));
							ctx.moveTo(xPos(j)-deviationWidth,yPos(i,j,deviation));
							ctx.lineTo(xPos(j)+deviationWidth,yPos(i,j,deviation));
						}
						// draw the vertical line
						ctx.moveTo(xPos(j),yPos(i,j,-deviation));
						ctx.lineTo(xPos(j),yPos(i,j,deviation));
					}
				}
				ctx.stroke();
				ctx.closePath();
			}

		}

	}

	function yPos(dataSet, iteration, deviation) {
		return xAxisPosY - calculateOffset(config, data.datasets[dataSet].data[iteration]+deviation, calculatedScale, scaleHop);
	};
	function xPos(iteration) {
		return yAxisPosX + (valueHop * iteration);
	};
}
