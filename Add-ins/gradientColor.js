//
// See ..\Samples\issue_102.html
//
// Module intially written by Ole Kroger
// Change 1 : Omar Sedki - possibility to specify a percentage 
// Change 2 : Vancoppenolle François - generalized for all graph types
//


function gradientColor(area,ctx,data,statData,posi,posj,othervars) {
	// v0 = left xAxis of rectangle or xAxis of center
	// v1 = top yAxis of rectangle or yAxis of center
	// v2 = right xAxis of rectangle or internal radius (=0 for PolarArea, Pie and Radar)
	// v3 = bottom yAxis or rectangle or external radius
	var grd;
	switch(ctx.tpchart) {
		case "Radar" :
			if (area == "COLOR") {
				var grd = ctx.createRadialGradient(othervars.midPosX, othervars.midPosY, 0, othervars.midPosX, othervars.midPosY , othervars.ext_radius);
			} else {
				var grd = ctx.createRadialGradient(othervars.xPosLeft + (othervars.xPosRight - othervars.xPosLeft) / 2, othervars.yPosBottom + (othervars.yPosTop - othervars.yPosBottom) / 2, 0, othervars.xPosLeft + (othervars.xPosRight - othervars.xPosLeft) / 2, othervars.yPosBottom + (othervars.yPosTop - othervars.yPosBottom) / 2, Math.max((othervars.xPosRight - othervars.xPosLeft) / 2, (othervars.yPosTop - othervars.yPosBottom) / 2));
			}
			var gradientColors = data.datasets[posi].gradientColors;
			break;
		case "PolarArea" :
		case "Pie" : 
		case "Doughnut" :
			if (area == "COLOR") {
				var grd = ctx.createRadialGradient(statData[0].midPosX, statData[0].midPosY, othervars.scaleAnimation*statData[0].int_radius, statData[0].midPosX, statData[0].midPosY , othervars.scaleAnimation* statData[0].radiusOffset);
			} else {
				var grd = ctx.createRadialGradient(othervars.xPosLeft + (othervars.xPosRight - othervars.xPosLeft) / 2, othervars.yPosBottom + (othervars.yPosTop - othervars.yPosBottom) / 2, 0, othervars.xPosLeft + (othervars.xPosRight - othervars.xPosLeft) / 2, othervars.yPosBottom + (othervars.yPosTop - othervars.yPosBottom) / 2, Math.max((othervars.xPosRight - othervars.xPosLeft) / 2, (othervars.yPosTop - othervars.yPosBottom) / 2));
			}
			var gradientColors = data[posi].gradientColors;
			break;
		case "Line" :
		case "Bar" :
		case "StackedBar" :
			grd = ctx.createLinearGradient(othervars.xPosLeft, othervars.yPosBottom, othervars.xPosLeft, othervars.yPosTop);
			var gradientColors = data.datasets[posi].gradientColors;
			break;
		case "HorizontalBar" :
		case "HorizontalStackedBar" :
			grd = ctx.createLinearGradient(othervars.xPosLeft, othervars.yPosBottom, othervars.xPosRight, othervars.yPosBottom);
			var gradientColors = data.datasets[posi].gradientColors;
			break;
		default : 
			break;
		
	}
	
	var steps = gradientColors.length;
	var currentStepValue = 0;
	var stepValues = [];
	var PERCENT_REGEX = /(\d{1,2}|100)%\s*?$/g
	for (var iter = 0; iter < steps; iter++) {
		var userStepValue = gradientColors[iter].match(PERCENT_REGEX);
		if (!userStepValue) {
			stepValues[iter] = false;
			continue;
		}
		userStepValue = parseFloat(userStepValue) / 100.0;
		stepValues[iter] = userStepValue;
	}
	for (var iter = 0; iter < steps; iter++) {
		if (stepValues[iter] === false) {
			if (iter == 0) {
				stepValues[iter] = 0;
			} else if (iter == steps - 1) {
				stepValues[iter] = 1;
			} else {
				// found next stepValue which isn't false
				var s = iter + 1;
				while (s < steps - 1 && stepValues[s] === false) {
					s++;
				}
				var lastStep = ((iter == 0) ? 0 : stepValues[iter - 1]);
				stepValues[iter] = ((s >= steps - 1) ? 1 : stepValues[s + 1]) - lastStep;
				stepValues[iter] = lastStep + stepValues[iter] / (s - iter + 1);
			}
		}
		GradientcolorsWithoutStep = gradientColors[iter].replace(PERCENT_REGEX, "").trim();
		grd.addColorStop(stepValues[iter], GradientcolorsWithoutStep);
	}
	return grd;
}
