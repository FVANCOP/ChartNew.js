//
// See ..\Samples\issue_102.html
//
// Module intially written by Ole Kroger
// Change 1 : Omar Sedki - possibility to specify a percentage 
// Change 2 : Vancoppenolle François - generalized for all graph types
//


function gradientColor(area,data,config,i,j,currentAnimPc,value,typegraph,ctx,v0,v1,v2,v3) {

// v0 = left xAxis of rectangle or xAxis of center
// v1 = top yAxis of rectangle or yAxis of center
// v2 = right xAxis of rectangle or internal radius (=0 for PolarArea, Pie and Radar)
// v3 = bottom yAxis or rectangle or external radius


		var grd;
    if(typegraph=="Line" || typegraph=="Bar" || typegraph=="StackedBar") {
		  grd = ctx.createLinearGradient(v0,v1,v0,v3);
		  var gradientColors = data.datasets[i].gradientColors;
    }
    else if(typegraph=="HorizontalStackedBar" || typegraph=="HorizontalBar")
    {
    	grd = ctx.createLinearGradient(v0,v1,v2,v1);
    	var gradientColors = data.datasets[i].gradientColors;
    }
    else if (typegraph=="Pie" || typegraph=="Doughnut" || typegraph=="PolarArea" || typegraph=="Radar")
    {
      if(area== "COLOR" || (typegraph=="Radar" && area=="FILLCOLOR")) { var grd=ctx.createRadialGradient(v0,v1,v2,v0,v1,v3); }
      else { var grd=ctx.createRadialGradient(v0+(v2-v0)/2,v1+(v3-v1)/2,0,v0+(v2-v0)/2,v1+(v3-v1)/2,Math.max((v2-v0)/2,(v3-v1)/2)); }    
      if (typegraph=="Radar") var gradientColors = data.datasets[i].gradientColors;
      else var gradientColors = data[i].gradientColors;
    }
      
		var steps = gradientColors.length;
		var currentStepValue = 0;
		var stepValues = [];
		var PERCENT_REGEX = /(\d{1,2}|100)%\s*?$/g
		for (var iter = 0; iter < steps; iter++) {
			var userStepValue = gradientColors[iter].match(PERCENT_REGEX);
			if(!userStepValue) 	{ stepValues[iter] = false; continue; }
			userStepValue = parseFloat(userStepValue) / 100.0;
			stepValues[iter] = userStepValue;
		}
		for (var iter = 0; iter < steps; iter++) {
			if (stepValues[iter] === false) {
				if (iter == 0) { stepValues[iter] = 0; }
				else if (iter == steps-1) { stepValues[iter] = 1; }
				else {
					// found next stepValue which isn't false
					var s=iter+1;
					while (s < steps-1 && stepValues[s] === false) {
						s++;
					}
					var lastStep  = ((iter == 0) ? 0 : stepValues[iter-1]);
					stepValues[iter] = ((s >= steps-1) ? 1 : stepValues[s+1]) - lastStep;
					stepValues[iter] = lastStep + stepValues[iter]/(s-iter+1);
				}
			}
			GradientcolorsWithoutStep = gradientColors[iter].replace(PERCENT_REGEX, "").trim();
			grd.addColorStop(stepValues[iter],GradientcolorsWithoutStep);
		}
		return grd;
}

