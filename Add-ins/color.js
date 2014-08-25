function gradient(area,params) {
	if (area == "FILLCOLOR") {
		var grd;
		grd = params.ctx.createLinearGradient(params.x0,params.y0,params.x1,params.y1);
		var gradientColors = params.data.datasets[params.i].gradientColors;
		var steps = gradientColors.length;
		var currentStepValue = 0;
		var stepValues = [];
		var PERCENT_REGEX = /(\d{1,2}|100)%\s*?$/g
		for (var i = 0; i < steps; i++) {
			var userStepValue = gradientColors[i].match(PERCENT_REGEX);
			if(!userStepValue) 	{ stepValues[i] = false; continue; }
			userStepValue = parseFloat(userStepValue) / 100.0;
			stepValues[i] = userStepValue;
		}
		for (var i = 0; i < steps; i++) {
			if (stepValues[i] === false) {
				if (i == 0) { stepValues[i] = 0; }
				else if (i == steps-1) { stepValues[i] = 1; }
				else {
					// found next stepValue which isn't false
					var s=i+1;
					while (s < steps-1 && stepValues[s] === false) {
						s++;
					}
					var lastStep  = ((i == 0) ? 0 : stepValues[i-1]);
					stepValues[i] = ((s >= steps-1) ? 1 : stepValues[s+1]) - lastStep;
					stepValues[i] = lastStep + stepValues[i]/(s-i+1);
				}
			}
			GradientcolorsWithoutStep = gradientColors[i].replace(PERCENT_REGEX, "").trim();
			console.log(stepValues[i],GradientcolorsWithoutStep);
			grd.addColorStop(stepValues[i],GradientcolorsWithoutStep);
		}
		return grd;
	}
}
