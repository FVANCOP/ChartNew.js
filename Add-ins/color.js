function gradient(area,data,config,dataSetNr,dataNr,animPct,value,ctx,x0,y0,x1,y1) {
	if (area == "FILLCOLOR") {
		var grd;
		grd = ctx.createLinearGradient(x0,y0,x1,y1);
		var gradientColors = data.datasets[dataSetNr].gradientColors;
		var steps = gradientColors.length;
		var currentStepValue = 0;
		for (var i = 0; i < steps; i++) {
			grd.addColorStop(currentStepValue,gradientColors[i]);
			currentStepValue += 1/steps;
		}
		return grd;
	}
}
