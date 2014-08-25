function gradient(area,params) {
	if (area == "FILLCOLOR") {
		var grd;
		grd = params.ctx.createLinearGradient(params.x0,params.y0,params.x1,params.y1);
		var gradientColors = params.data.datasets[params.i].gradientColors;
		var steps = gradientColors.length;
		var currentStepValue = 0;
		for (var i = 0; i < steps; i++) {
userStepValue=gradientColors[i].match(/\d+% ?/g); 
if(userStepValue){userStepValue=parseFloat(userStepValue) / 100.0;}
if(!userStepValue){userStepValue=currentStepValue;}
GradientcolorsWithoutStep=gradientColors[i].replace(/\d+% ?/g, "");
			grd.addColorStop(userStepValue,GradientcolorsWithoutStep);
			currentStepValue += 1/(steps-1);
		}
		return grd;
	}
}
