function gradient(area,params) {
	if (area == "FILLCOLOR") {
		var grd;
		grd = params.ctx.createLinearGradient(params.x0,params.y0,params.x1,params.y1);
		var gradientColors = params.data.datasets[params.i].gradientColors;
		var steps = gradientColors.length;
		var currentStepValue = 0;
		for (var i = 0; i < steps; i++) {
			grd.addColorStop(currentStepValue,gradientColors[i]);
			currentStepValue += 1/steps;
		}
		return grd;
	}
}
