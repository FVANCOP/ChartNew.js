var moreInChartData_default= {
	position : "INCHART",
	iter : "last",

	link : "Line",
	
	// default values for Line;
	linkStrokeColorLine: "black",
	linkStrokeStyleLine : "solid", 
	linkStrokeSizeLine: 2,
	paddingValXLine : 4,
	paddingValYLine : 0,
	piePaddingY : 0.1,
	paddingX : 0,
	paddingY : 0,


	// default values for Triangle;
	arrowWidth : 2,
	arrowHeight : 0.1,
//     	linkFillColorTriangle : null,
	linkStrokeColorTriangle: "rgba(0,0,0,0)",
	linkStrokeStyleTriangle : "solid", 
	linkStrokeSizeTriangle: 0,
	paddingValXTriangle : 4,
	paddingValYTriangle : -16,
	
	// default for text;
	text : "<Value>",
	fontColor : "black", 
	fontStyle : "normal",
	fontSize : 25,
	fontFamily : "'Arial'",

	// default for Image;
	imageLoad : null,
	imagePos : 1,     // 0 before text, 1 after text;
	imageWidth : 20,   
	imageHeight: 20,   

	spaceBetweenTextAndImage : 5,
//	relativeImagePosition : "smart",
//	rotate : 0,

	// Point position;

	limitToChart : false,
	x1 : null,
	y1 : null,
	x2 : null,
	y2 : null,
	x3 : null,
	y3 : null,
	x4 : null,
	y4 : null,
	x5 : null,
	y5 : null,
	x6 : null,
	y6 : null,
	x7 : null,
	y7 : null,
	x8 : null,
	y8 : null,
	x9 : null,
	y9 : null,
	x10 : null,
	y10 : null,
	paddingX1 : null,
	paddingY1 : null,
	paddingX2 : null,
	paddingY2 : null,
	paddingX3 : null,
	paddingY3 : null,
	paddingX4 : null,
	paddingY4 : null,
	paddingX5 : null,
	paddingY5 : null,
	paddingX6 : null,
	paddingY6 : null,
	paddingX7 : null,
	paddingY7 : null,
	paddingX8 : null,
	paddingY8 : null,
	paddingX9 : null,
	paddingY9 : null,
	paddingX10 : null,
	paddingY10 : null,
	
	// Special values;
	avoidOverwrite : true	
	
	
};

function pushInGraphData(type_chart,data,config,pushInfoDefault) {

	var pushconfig = (pushInfoDefault) ? mergeChartConfig(moreInChartData_default, pushInfoDefault) : moreInChartData_default;
	var resconfig;

	var pushInfo,shapesInChart;
	if(typeof data.datasets == "object") {
		pushInfo=data.datasets;
		if(typeof data.shapesInChart == "undefined") data.shapesInChart=[];
		shapesInChart=data.shapesInChart;
		for (var i=0;i<data.datasets.length;i++){
			for(var j=0;j<data.datasets[i].data.length;j++) {
				if(typeof data.datasets[i].data[j]!="undefined") {
					resconfig = mergeChartConfig(data.datasets[i], pushconfig);
					pushInGraphDataSub(type_chart.toUpperCase(),data.datasets[i],i,j,shapesInChart,data,config,resconfig);
				}
			}
		}
		data.shapesInChart[0].avoidOverwrite=pushconfig.avoidOverwrite;
	}
	else {
		pushInfo=data;
		if(typeof data[0].shapesInChart == "undefined") data[0].shapesInChart=[];
		shapesInChart=data[0].shapesInChart;
		for (var i=0;i<data.length;i++){
			if(typeof data[i].value !="undefined") {
				resconfig = mergeChartConfig(data[i], pushconfig);
				pushInGraphDataSub(type_chart.toUpperCase(),data[i],i,-1,shapesInChart,data,config,resconfig);
			}
		}
		data[0].shapesInChart[0].avoidOverwrite=pushconfig.avoidOverwrite;
	}
	

	function mergeOptionConfig(defaults, userDefined,posj) {
		var returnObj = {};
		for (var attrname in defaults) {
			returnObj[attrname] = defaults[attrname];
		}
		for (var attrnameBis in userDefined) {
			if(typeof  userDefined[attrnameBis]=="object") returnObj[attrnameBis] = userDefined[attrnameBis][Math.min(j,userDefined[attrnameBis].length-1)];
			else returnObj[attrnameBis] = userDefined[attrnameBis];
		}
		return returnObj;
	};


	function pushInGraphDataSub(type_chart,pushInfoI,i,j,shapesInChart,data,config,resconfig) {

        	var addRadius;
		shapesInChart[shapesInChart.length]=mergeOptionConfig(resconfig,pushInfoI,j);
		// push shapesInChart info for the pointer;

		var newShapes=shapesInChart[shapesInChart.length-1];

		if (newShapes.text.indexOf("<Title>") >= 0) newShapes.text=newShapes.text.replace("<Title>",pushInfoI.title);
		if (newShapes.text.indexOf("<Value>") >= 0){
			if(j==-1)newShapes.text=newShapes.text.replace("<Value>",""+pushInfoI.value);
			else newShapes.text=newShapes.text.replace("<Value>",""+pushInfoI.data[j]);
		}
		switch(newShapes.link.toUpperCase()) {
			case  "TRIANGLE" :
				var cumval=0;
				if(typeof data.length!="undefined") {	
					for(var vi=0;vi<data.length;vi++){
						if(data[vi].value>0)cumval=cumval+1*data[vi].value;
					}
				} else {
					for(var vi=0;vi<data.datasets.length;vi++){
						if(data.datasets[vi].data[j]>0)cumval=cumval+1*data.datasets[vi].data[j];
					}
				}
				var arrowWidth=(cumval/360)*newShapes.arrowWidth;
	
				newShapes.shape = annotateTriangleFunction;
				newShapes.strokeColor=newShapes.linkStrokeColorLine;
				newShapes.strokeStyle=newShapes.linkStrokeStyleLine; 
				newShapes.strokeSize=newShapes.linkStrokeSizeLine;
				switch(type_chart) {
					case "DELPIE" :
					case "DELDOUGHNUT" :
						var multRadius;
						var percentageInnerCutout=50;
						if(typeof config.percentageInnerCutout != "undefined")percentageInnerCutout=config.percentageInnerCutout;
						if(type_chart.toUpperCase()=="DOUGHNUT" || type_chart.toUpperCase()=="MDOUGHNUT")multRadius=100/(100-percentageInnerCutout);
						else multRadius=1;
                       	                        addRadius=0;
						if(typeof pushInfoI.expandOutRadius!="undefined")addRadius=1*pushInfoI.expandOutRadius;
						if(newShapes.x1==null)newShapes.x1=  (pushInfoI.data[j]==0 ? i : Math.max(i-0.5,i-(arrowWidth/pushInfoI.data[j])));
						if(newShapes.y1==null)newShapes.y1= 0.99+addRadius;
						if(newShapes.x2==null)newShapes.x2= i;
						if(newShapes.y2==null)newShapes.y2 =1+newShapes.arrowHeight+addRadius;
						if(newShapes.x3==null)newShapes.x3= (pushInfoI.data[j]==0 ? i : Math.min(i+0.5,i+(arrowWidth/pushInfoI.data[j])));
						if(newShapes.y3==null)newShapes.y3 = 0.99+addRadius;
						if(newShapes.x4==null)newShapes.x4 = i;
						if(newShapes.y4==null)newShapes.y4 = 1.2+addRadius;
						if(newShapes.fillColor==null)newShapes.fillColor =pushInfoI.color;
						break;
					case "PIE" :
					case "DOUGHNUT" :
					case "MPIE" :
					case "MDOUGHNUT" :
						var multRadius;
						var percentageInnerCutout=50;

						if(typeof config.percentageInnerCutout != "undefined")percentageInnerCutout=config.percentageInnerCutout;
						if(type_chart.toUpperCase()=="MDOUGHNUT")multRadius=100/(100-percentageInnerCutout);
						else multRadius=1;
                       	                        addRadius=0;
						if(typeof pushInfoI.expandOutRadius!="undefined")addRadius=1*pushInfoI.expandOutRadius;
						if(newShapes.x1==null)newShapes.x1=  (pushInfoI.data[j]==0 ? i : Math.max(i-0.5,i-(arrowWidth/pushInfoI.data[j])));
						if(newShapes.y1==null)newShapes.y1= 0.99+addRadius;
						if(newShapes.x2==null)newShapes.x2= i;
						if(newShapes.y2==null)newShapes.y2 =1+newShapes.arrowHeight+addRadius;
						if(newShapes.x3==null)newShapes.x3= (pushInfoI.data[j]==0 ? i : Math.min(i+0.5,i+(arrowWidth/pushInfoI.data[j])));
						if(newShapes.y3==null)newShapes.y3 = 0.99+addRadius;
						if(newShapes.x4==null)newShapes.x4 = i;
						if(newShapes.y4==null)newShapes.y4 = 1.2+addRadius;
						if(newShapes.posj==null)newShapes.posj = j;
						if(newShapes.fillColor==null)newShapes.fillColor =pushInfoI.fillColor;
						break;
					case "POLARAREA" :
					case "LINE" :
					case "RADAR" :
					case "BAR" :
					case "HORIZONTALBAR" : 
					case "STACKEDBAR" :
					case "HORIZONTALSTACKEDBAR" : 
						// not implemented;
						break;
				};
				break;
			case  "LINE" :	
			default:
				newShapes.shape = annotateLineFunction;
				newShapes.strokeColor=newShapes.linkStrokeColorLine;
				newShapes.strokeStyle=newShapes.linkStrokeStyleLine; 
				newShapes.strokeSize=newShapes.linkStrokeSizeLine;
				switch(type_chart) {
					case "PIE" :
					case "DOUGHNUT" :
					case "MPIE" :
					case "MDOUGHNUT" :
						var multRadius;
						var percentageInnerCutout=50;
						if(typeof config.percentageInnerCutout != "undefined")percentageInnerCutout=config.percentageInnerCutout;
						if(type_chart.toUpperCase()=="MDOUGHNUT")multRadius=100/(100-percentageInnerCutout);
						else multRadius=1;
                                                addRadius=0;
						if(typeof pushInfoI.expandOutRadius!="undefined")addRadius=1*pushInfoI.expandOutRadius;
						if(newShapes.x1==null)newShapes.x1=i;
						if(newShapes.y1==null)newShapes.y1=1+addRadius;
						if(newShapes.x2==null)newShapes.x2=i;
						if(newShapes.y2==null)newShapes.y2=1+newShapes.piePaddingY*multRadius;
						// x10=center of circle;
						if(newShapes.x10==null)newShapes.x10=i;
						if(newShapes.y10==null)newShapes.y10=-999;
						if(newShapes.posj==null)newShapes.posj = j;
						break;
					case "DELPIE" :
					case "DELDOUGHNUT" :
						var multRadius;
						var percentageInnerCutout=50;
						if(typeof config.percentageInnerCutout != "undefined")percentageInnerCutout=config.percentageInnerCutout;
						if(type_chart.toUpperCase()=="DOUGHNUT" || type_chart.toUpperCase()=="DOUGHNUT")multRadius=100/(100-percentageInnerCutout);
						else multRadius=1;
                                                addRadius=0;
						if(typeof pushInfoI.expandOutRadius!="undefined")addRadius=1*pushInfoI.expandOutRadius;
						if(newShapes.x1==null)newShapes.x1=i;
						if(newShapes.y1==null)newShapes.y1=1+addRadius;
						if(newShapes.x2==null)newShapes.x2=i;
						if(newShapes.y2==null)newShapes.y2=1+newShapes.piePaddingY*multRadius;
						if(newShapes.x10==null)newShapes.x10=i;
						if(newShapes.y10==null)newShapes.y10=1-multRadius;
						break;
					case "POLARAREA" :
					case "LINE" :
					case "RADAR" :
					case "BAR" :
					case "HORIZONTALBAR" : 
					case "STACKEDBAR" :
					case "HORIZONTALSTACKEDBAR" : 
						// not implemented;
						break;
				};
				break;
			
		}
	
		// push shapesInChart info for the text and Image;
	
	} ;
};


function annotateLineFunction(area, ctx, data, statData, posi,posj,othervars){

	if (typeof ctx.specialInChartData=="undefined"){
		ctx.specialInChartData=[];
		ctx.specialInChartData.prevMsr=[];
		ctx.specialInChartData.textAlign=[];
        	ctx.specialInChartData.textBaseline=[];
		ctx.specialInChartData.prevXln=[];
		ctx.specialInChartData.prevYln=[];	
	}
	/* compute radius */
	var radius= (Math.sqrt(Math.pow(othervars.xypos2.xpos-othervars.xypos10.xpos,2)+ Math.pow(othervars.xypos2.ypos-othervars.xypos10.ypos,2)));

	var xln, yln;
	var xip, yip;
	var paddingX, paddingY;
	var paddingValX=othervars.shapesInChart.paddingValXLine;
	var paddingValY=othervars.shapesInChart.paddingValYLine;

// line to label;
	
	ctx.beginPath();

	xip=othervars.xypos2.xpos;
	yip=othervars.xypos2.ypos;

		
	if(othervars.xypos10.xpos>othervars.xypos2.xpos) {
		ctx.textAlign="right";
		paddingX=-paddingValX;
		xln=othervars.xypos10.xpos-radius+othervars.shapesInChart.paddingX;
		yln=othervars.xypos2.ypos+othervars.shapesInChart.paddingY;
	} else {
		ctx.textAlign="left";
		paddingX=paddingValX;
		xln=radius + othervars.xypos10.xpos+othervars.shapesInChart.paddingX;
		yln=othervars.xypos2.ypos+othervars.shapesInChart.paddingY;
	}
	var avoidOverwrite;
	if(typeof data.length!="undefined")avoidOverwrite=data[0].shapesInChart[0].avoidOverwrite;
	else avoidOverwrite=data.shapesInChart[0].avoidOverwrite;

        if (typeof ctx.specialInChartData.prevYln=="undefined") {
		ctx.specialInChartData.prevXln=[];
		ctx.specialInChartData.prevYln=[];	
	}
	if(avoidOverwrite) {
	
		if (typeof ctx.specialInChartData.prevYln[othervars.posj]!="undefined") {
			if(Math.abs(ctx.specialInChartData.prevYln[othervars.posj]-yln)<1.5*othervars.shapesInChart.fontSize) {
				if(othervars.xypos10.xpos<othervars.xypos2.xpos)yln=Math.max(yln,ctx.specialInChartData.prevYln[othervars.posj]+1.5*othervars.shapesInChart.fontSize);
				else yln=Math.min(yln,ctx.specialInChartData.prevYln[othervars.posj]-1.5*othervars.shapesInChart.fontSize);
			}
		};
		ctx.specialInChartData.prevXln[othervars.posj]=xln;
		ctx.specialInChartData.prevYln[othervars.posj]=yln;
	};

	ctx.beginPath();
	ctx.moveTo(othervars.xypos1.xpos, othervars.xypos1.ypos);
	ctx.quadraticCurveTo(xip, yip,xln, yln);
	ctx.lineWidth = othervars.shapesInChart.strokeSize;
	ctx.strokeStyle = othervars.shapesInChart.strokeColor;
	ctx.setLineDash(lineStyleFn(othervars.shapesInChart.strokeStyle));	
	ctx.stroke();

// set text/shape position;
	ctx.beginPath();
	ctx.textBaseline="middle";
	if(othervars.xypos2.ypos<othervars.xypos1.ypos) {
		paddingY=-paddingValY;
	} else {
		paddingY=1*paddingValY;
	}

// draw labels/images;
	drawTextAndImage(area, ctx, data,statData, posi,posj,othervars,xln+paddingX, yln+paddingY);

};


function annotateTriangleFunction(area, ctx, data,statData, posi,posj,othervars){


	if (typeof ctx.specialInChartData=="undefined"){
		ctx.specialInChartData=[];
		ctx.specialInChartData.prevMsr=[];
		ctx.specialInChartData.textAlign=[];
        	ctx.specialInChartData.textBaseline=[];
		ctx.specialInChartData.prevXln=[];
		ctx.specialInChartData.prevYln=[];	
	}

// triangle to label;
	ctx.beginPath();
	if(othervars.xypos1.xpos==othervars.xypos3.xpos && othervars.xypos1.ypos==othervars.xypos3.ypos) {
		ctx.strokeStyle = othervars.shapesInChart.fillColor;
		ctx.lineWidth = 2;
		ctx.moveTo(othervars.xypos1.xpos, othervars.xypos1.ypos);
		ctx.lineTo(othervars.xypos2.xpos, othervars.xypos2.ypos);
	} else {	
		ctx.moveTo(othervars.xypos1.xpos, othervars.xypos1.ypos);
		ctx.lineWidth = 0;
		ctx.strokeStyle = "rgba(0,0,0,0)";
		ctx.lineTo(othervars.xypos2.xpos, othervars.xypos2.ypos);
		ctx.lineTo(othervars.xypos3.xpos, othervars.xypos3.ypos);
		ctx.closePath();
		ctx.fillStyle=othervars.shapesInChart.fillColor;
		ctx.fill();
	}
	ctx.stroke();



// set Label/image position;
	var paddingX=0;
	var paddingY=0;
	var paddingValX=othervars.shapesInChart.paddingValXTriangle;
	var paddingValY=othervars.shapesInChart.paddingValYTriangle;
	var xln=othervars.xypos4.xpos;
	var yln=othervars.xypos4.ypos;

	ctx.beginPath();
	if(othervars.xypos4.xpos>=othervars.xypos2.xpos) {
		paddingX=paddingValX;
		ctx.textAlign="left";
	} else {
		paddingX=-paddingValX;
		ctx.textAlign="right";
	}
	
	ctx.textBaseline="middle";

	var avoidOverwrite;
	if(typeof data.length!="undefined")avoidOverwrite=data[0].shapesInChart[0].avoidOverwrite;
	else avoidOverwrite=data.shapesInChart[0].avoidOverwrite;

	
	if(avoidOverwrite) {
		if (typeof ctx.specialInChartData.prevYln[othervars.posj]!="undefined" && ctx.textAlign==ctx.specialInChartData.textAlign[othervars.posj]) {
				if(othervars.xypos4.xpos>=othervars.xypos2.xpos) { 
					yln=Math.max(yln,ctx.specialInChartData.prevYln[othervars.posj]+1.5*othervars.shapesInChart.fontSize);
				} else {
					yln=Math.min(yln,ctx.specialInChartData.prevYln[othervars.posj]-1.5*othervars.shapesInChart.fontSize);
				}
		} 
		ctx.specialInChartData.prevXln[othervars.posj]=xln;
		ctx.specialInChartData.prevYln[othervars.posj]=yln;
	};

// draw labels/images;
	ctx.specialInChartData.prevMsr[othervars.posj]=drawTextAndImage(area, ctx, data,statData, posi,posj,othervars,xln+paddingX, yln+paddingY);
        ctx.specialInChartData.textAlign[othervars.posj]=ctx.textAlign;
        ctx.specialInChartData.textBaseline[othervars.posj]=ctx.textBaseline;
        
};

function drawTextAndImage(area, ctx, data,statData, posi,posj,othervars,xpos,ypos) {

	var paddingTextX=0;
	var paddingTextY=0;
	var paddingImageX=0;
	var paddingImageY=0;
	var lgt=0;
	var hgt=0;
	var txtSize=0;
	
	// compute padding values;
	if(othervars.shapesInChart.imageLoad != null && othervars.shapesInChart.text != "") {
		ctx.save();
		var fontSize=othervars.shapesInChart.fontSize;
		ctx.font = othervars.shapesInChart.fontStyle + " " + othervars.shapesInChart.fontSize.toString() + "px " + othervars.shapesInChart.fontFamily;
		ctx.fillStyle = othervars.shapesInChart.fontColor;
		txtSize=ctx.measureTextMultiLine(othervars.shapesInChart.text,othervars.shapesInChart.fontSize);

		if(othervars.shapesInChart.imagePos==1 && ctx.textAlign=="right") {
			paddingTextX=-(othervars.shapesInChart.imageWidth+othervars.shapesInChart.spaceBetweenTextAndImage);
			paddingImageX=-(othervars.shapesInChart.imageWidth);
		} else if(othervars.shapesInChart.imagePos==0 && ctx.textAlign=="left") {
			paddingTextX=othervars.shapesInChart.imageWidth+othervars.shapesInChart.spaceBetweenTextAndImage;
		} else if(othervars.shapesInChart.imagePos==0 && ctx.textAlign=="right") {
			paddingImageX=-(txtSize.textWidth+othervars.shapesInChart.spaceBetweenTextAndImage+othervars.shapesInChart.imageWidth);
		} else if(othervars.shapesInChart.imagePos==1 && ctx.textAlign=="left") {
			paddingImageX=txtSize.textWidth+othervars.shapesInChart.spaceBetweenTextAndImage;
		}
		ctx.restore();
		lgt=othervars.shapesInChart.spaceBetweenTextAndImage;
	};

	// draw text;
	if(othervars.shapesInChart.text!="") {
		ctx.save();
		ctx.translate(xpos+paddingTextX,ypos+paddingTextY);
		var fontSize=othervars.shapesInChart.fontSize;
		ctx.font = othervars.shapesInChart.fontStyle + " " + othervars.shapesInChart.fontSize.toString() + "px " + othervars.shapesInChart.fontFamily;
		ctx.fillStyle = othervars.shapesInChart.fontColor;
		if (othervars.shapesInChart.iter !=="all" || (othervars.shapesInChart.iter === "all" && othervars.cntiter != othervars.config.animationSteps) || othervars.config.animation==false) {
			ctx.fillTextMultiLine(othervars.shapesInChart.text, 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale*fontSize),true,othervars.config.detectMouseOnText,ctx,"SHAPESINCHART_TEXTMOUSE",0,xpos+paddingTextX,ypos+paddingTextY,-1,-1);
		} else ctx.fillTextMultiLine(othervars.shapesInChart.text, 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale*fontSize),true,false,ctx,"SHAPESINCHART_TEXTMOUSE",0,xpos+paddingTextX,ypos+paddingTextY,-1,-1);
		ctx.restore();
		lgt+=txtSize;
		hgt=Math.max(hgt,1.5* othervars.shapesInChart.fontSize);
	}
	// draw image;
	if(othervars.shapesInChart.imageLoad != null) {
		paddingImageY=-(othervars.shapesInChart.imageHeight-((2/3)*txtSize.textHeight/2));

		ctx.save();
//		ctx.translate(xpos+paddingImageX, ypos+paddingImageY -(othervars.shapesInChart.fontSize/2)+imageAfterPaddingY-(othervars.shapesInChart.imageAfterHeight/2));
		ctx.translate(xpos+paddingImageX, ypos+paddingImageY);
		ctx.drawImage(othervars.shapesInChart.imageLoad, 0, 0,othervars.shapesInChart.imageLoad.width,othervars.shapesInChart.imageLoad.height,0, 0,othervars.shapesInChart.imageWidth,othervars.shapesInChart.imageHeight);
		ctx.restore();
		lgt+=othervars.shapesInChart.imageWidth;
		hgt=Math.max(hgt,othervars.shapesInChart.imageWidth.imageHeight);
	}
	
	return {height : hgt,width : lgt};



};



