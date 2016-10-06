// JavaScript Document

// element Default;
var defaultNextLineBaseline="center";
var defaultNextLineAlign="left";
var defaultCRSpace=5;
var defaultMaxLegendCols=999;




var defaultLegendValues = {
	
	element : "shapeText", // "shapeText" ou "CR"
	textHPos : 4,           // 0 : text at the left of the shape, 1 : text in the shape and left aligned, 2 : text in the shape and centered,
	                       // 3 : text in the shape and right aligned, 4 : text at the right of the shape,
	textVPos : 2,          // 0 : text under the shape, 1 : text in the shape and bottom aligned, 2 : text in the shape and centered,
	                       // 3 : text in the shape and top aligned, 4 : text over the shape,
//	HspaceBetweenShapeAndText : config.legendSpaceBetweenBoxAndText,
	VspaceBetweenShapeAndText : 5,
	spaceBefore : 5,
	spaceAfter : 5,
	elementWidth : "maxwidth",    //  a string or an integer
	elementHeight : "maxheight",   //  a string or an integer
	shape : "",         // "line", "rectangle", "ellipse" ou "none"
//	shapeHeight : config.legendFontSize,  // a string or an integer
//	shapeWidth : config.legendBlockSize,  // a string or an integer 
	markerShape : "",
	markerCount : 1,        // number of marker to draw
//	markerRadius : config.pointDotRadius,
//	markerStrokeStyle : config.pointDotStrokeStyle,
//	markerFillColor : config.defaultStrokeColor,
//      markerLineWidth : config.pointDotStrokeWidth,
	shapeBorders :   true,
	shapePaddingX : 0,
	shapePaddingY : 0,
	shapeBordersRadius :  0,
	shapeBordersSelection : 15,
//	shapeBordersWidth : config.datasetStrokeWidth,
//	shapeBordersStyle : config.datasetStrokeStyle,
//	shapeBordersColor :  config.legendBordersColors,
//	shapeFillColor : config.defaultFillColor,
// textDefault :
	text : "",
	textPaddingX : 0,
	textPaddingY : 0,
////	textAlign : "left",             // not implemented - put text at a logic position;
////	textBaseline : "bottom"		// not implemented - put text at a logic position;
//	fontFamily: config.legendFontFamily,
//	fontSize: config.legendFontSize,
//	fontStyle: config.legendFontStyle,
//	fontColor: config.legendFontColor
	
};

function drawLegend(legendMsr,data,config,ctx,typegraph,cntiter) {

	if(config.legendPosY==0 || config.legendPosY==4 || config.legendPosX==0 || config.legendPosX==4){
		if(cntiter!=-1) return;
	}
	else {
		if(cntiter==-1)return;
		else if (config.animation==true) {
		
			if(typeof config.legendWhenToDraw=="number") {
				if (cntiter !=config.legendWhenToDraw)return;
			} else if (cntiter !=1 && config.legendWhenToDraw=="first")return;
			else if (cntiter != config.animationSteps && config.legendWhenToDraw=="last")return;
		}
	}

	ctx.save();
	if (config.legendFillColor != "rgba(0,0,0,0)") {
		// fill color;
		ctx.setLineDash([]);
		ctx.lineWidth=0;
		ctx.fillStyle = config.legendFillColor;
		ctx.drawRectangle({x:legendMsr.xLegendPos+legendMsr.legendBackgroundColorXPos,y:legendMsr.yLegendPos+legendMsr.legendBackgroundColorYPos,width:legendMsr.legendBackgroundColorWidth,height:legendMsr.legendBackgroundColorHeight,borders:config.legendBorders,bordersWidth:Math.ceil(ctx.chartLineScale*config.legendBordersWidth),borderSelection:config.legendBordersSelection,borderRadius:config.legendBordersRadius,fill:true,stroke:false});
	}	
	if(config.legendBorders) {
		ctx.fillStyle = config.legendFillColor;
		ctx.setLineDash(lineStyleFn(config.legendBordersStyle));
		ctx.lineWidth = Math.ceil(ctx.chartLineScale*config.legendBordersWidth);
		ctx.strokeStyle = config.legendBordersColors;
		ctx.drawRectangle({x:legendMsr.xLegendPos+legendMsr.legendBorderXPos,y:legendMsr.yLegendPos+legendMsr.legendBorderYPos,width:legendMsr.legendBorderWidth,height:legendMsr.legendBorderHeight,borders:true,bordersWidth:Math.ceil(ctx.chartLineScale*config.legendBordersWidth),borderSelection:config.legendBordersSelection,borderRadius:config.legendBordersRadius,fill:false,stroke:true});
	}
	ctx.setLineDash([]);
	ctx.restore();

	var xpos,ypos,i,j;
	for(i=0;i<legendMsr.elementMsr.length;i++) {
		if(legendMsr.elementMsr[i].element.element=="shapeText") {
			// draw Shape;
			xpos=legendMsr.xLegendPos+legendMsr.legendFirstTextXPos+legendMsr.elementMsr[i].eltPosX+legendMsr.elementMsr[i].shapePosX;
			ypos=legendMsr.yLegendPos+legendMsr.legendFirstTextYPos+legendMsr.elementMsr[i].eltPosY+legendMsr.elementMsr[i].shapePosY;


			if(legendMsr.elementMsr[i].shapeHeight>0 && legendMsr.elementMsr[i].shapeWidth>0) {
				ctx.save();
				ctx.beginPath();
				switch (legendMsr.elementMsr[i].element.shape) {
					case "ellipse":
						ctx.beginPath();

						var height=legendMsr.elementMsr[i].shapeHeight;
						var width= legendMsr.elementMsr[i].shapeWidth;
						var el_xpos =legendMsr.elementMsr[i].element.shapePaddingX+xpos+(width/2);
						var el_ypos =legendMsr.elementMsr[i].element.shapePaddingY+ypos-(height/2);

						ctx.moveTo(el_xpos, el_ypos - height/2); // A1
						ctx.bezierCurveTo(
    							el_xpos + width/2, el_ypos - height/2, // C1
    							el_xpos + width/2, el_ypos + height/2, // C2
    							el_xpos, el_ypos + height/2); // A2
						ctx.bezierCurveTo(
							el_xpos - width/2, el_ypos + height/2, // C3
							el_xpos - width/2, el_ypos - height/2, // C4
							el_xpos, el_ypos - height/2); // A1
						ctx.closePath();
						ctx.fillStyle=legendMsr.elementMsr[i].element.shapeFillColor;
						ctx.fill();
 						ctx.lineWidth = Math.ceil(ctx.chartLineScale*legendMsr.elementMsr[i].element.shapeBordersWidth);
						ctx.strokeStyle=legendMsr.elementMsr[i].element.shapeBordersColor;
						ctx.setLineDash(lineStyleFn(legendMsr.elementMsr[i].element.shapeBordersStyle));
						ctx.stroke();
						ctx.setLineDash([]);

						break;
					case "line":
						ctx.save();
 						ctx.lineWidth = Math.ceil(ctx.chartLineScale*legendMsr.elementMsr[i].element.shapeBordersWidth);
						ctx.strokeStyle=legendMsr.elementMsr[i].element.shapeBordersColor;
						ctx.setLineDash(lineStyleFn(legendMsr.elementMsr[i].element.shapeBordersStyle));
				     		ctx.moveTo(legendMsr.elementMsr[i].element.shapePaddingX+xpos , legendMsr.elementMsr[i].element.shapePaddingY+ypos - (Math.ceil(ctx.chartTextScale*legendMsr.elementMsr[i].shapeHeight) / 2));
						ctx.lineTo(legendMsr.elementMsr[i].element.shapePaddingX+xpos + legendMsr.elementMsr[i].shapeWidth, legendMsr.elementMsr[i].element.shapePaddingY+ypos - ((Math.ceil(ctx.chartTextScale*legendMsr.elementMsr[i].shapeHeight)) / 2));
						ctx.stroke();
						ctx.restore();
				
						ctx.fill();
						if((config.pointDot==1 || legendMsr.elementMsr[i].element.drawMarker==true)  && legendMsr.elementMsr[i].element.markerCount>0 && legendMsr.elementMsr[i].element.markerShape!="") {
							var markerDispl=legendMsr.elementMsr[i].shapeWidth/(legendMsr.elementMsr[i].element.markerCount+1);
							for(j=0;j<legendMsr.elementMsr[i].element.markerCount;j++) {
								ctx.beginPath();
					 			ctx.fillStyle=legendMsr.elementMsr[i].element.markerFillColor;
								ctx.strokeStyle=legendMsr.elementMsr[i].element.markerStrokeStyle;
								ctx.lineWidth=legendMsr.elementMsr[i].element.markerLineWidth;
								var markerShape=legendMsr.elementMsr[i].element.markerShape;
								var markerRadius=legendMsr.elementMsr[i].element.markerRadius;
								var markerStrokeStyle=legendMsr.elementMsr[i].element.markerStrokeStyle;
								drawMarker(ctx,legendMsr.elementMsr[i].element.shapePaddingX+xpos+(j+1)*markerDispl,legendMsr.elementMsr[i].element.shapePaddingY+ypos - (Math.ceil(ctx.chartTextScale*legendMsr.elementMsr[i].shapeHeight) / 2),markerShape,markerRadius,markerStrokeStyle);
							}
						}
						ctx.fill();
						break;
					case "rectangle":
					default:
						ctx.beginPath();
						if (legendMsr.elementMsr[i].element.shapeFillColor != "rgba(0,0,0,0)") {
							ctx.save();
	 						ctx.lineWidth = 0;
							ctx.strokeStyle= "rgba(0,0,0,0)";
							ctx.fillStyle=legendMsr.elementMsr[i].element.shapeFillColor;
			
							ctx.drawRectangle({x:legendMsr.elementMsr[i].element.shapePaddingX+xpos+legendMsr.elementMsr[i].element.shapeBorders*isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"LEFT")*legendMsr.elementMsr[i].element.shapeBordersWidth,y:legendMsr.elementMsr[i].element.shapePaddingY+ypos-legendMsr.elementMsr[i].element.shapeBorders*isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"BOTTOM")*legendMsr.elementMsr[i].element.shapeBordersWidth,width:legendMsr.elementMsr[i].shapeWidth-legendMsr.elementMsr[i].element.shapeBorders*(isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"LEFT")+isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"RIGHT"))*legendMsr.elementMsr[i].element.shapeBordersWidth,height:-legendMsr.elementMsr[i].shapeHeight+legendMsr.elementMsr[i].element.shapeBorders*(isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"BOTTOM")+isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"TOP"))*legendMsr.elementMsr[i].element.shapeBordersWidth,borders:legendMsr.elementMsr[i].element.shapeBorders,bordersWidth:legendMsr.elementMsr[i].element.shapeBordersWidth,borderSelection:legendMsr.elementMsr[i].element.shapeBordersSelection,borderRadius:legendMsr.elementMsr[i].element.shapeBordersRadius,fill:true,stroke:false})
							ctx.restore();
                				}
						if (legendMsr.elementMsr[i].element.shapeBorders) {
							ctx.save();
	 						ctx.lineWidth = Math.ceil(ctx.chartLineScale*legendMsr.elementMsr[i].element.shapeBordersWidth);
							if(legendMsr.elementMsr[i].element.shapeFillColor!="none")ctx.fillStyle=legendMsr.elementMsr[i].element.shapeFillColor;
							else ctx.fillStyle= "rgba(0,0,0,0)";
							ctx.strokeStyle=legendMsr.elementMsr[i].element.shapeBordersColor;
							ctx.setLineDash(lineStyleFn(legendMsr.elementMsr[i].element.shapeBordersStyle));
							ctx.drawRectangle({x:legendMsr.elementMsr[i].element.shapePaddingX+xpos+isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"LEFT")*legendMsr.elementMsr[i].element.shapeBordersWidth/2,y:legendMsr.elementMsr[i].element.shapePaddingY+ypos-isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"BOTTOM")*legendMsr.elementMsr[i].element.shapeBordersWidth/2,width:legendMsr.elementMsr[i].shapeWidth-(isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"RIGHT")+isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"LEFT"))*legendMsr.elementMsr[i].element.shapeBordersWidth/2,height:-legendMsr.elementMsr[i].shapeHeight+(isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"TOP")+isBorder(legendMsr.elementMsr[i].element.shapeBordersSelection,"BOTTOM"))*legendMsr.elementMsr[i].element.shapeBordersWidth/2,borders:legendMsr.elementMsr[i].element.shapeBorders,bordersWidth:legendMsr.elementMsr[i].element.shapeBordersWidth,borderSelection:legendMsr.elementMsr[i].element.shapeBordersSelection,borderRadius:legendMsr.elementMsr[i].element.shapeBordersRadius,fill:false,stroke:true})
							ctx.setLineDash([]);
							ctx.restore();
						}
                				
						break;
				}
			}
			// draw Text;
			if(legendMsr.elementMsr[i].textHeight>0 && legendMsr.elementMsr[i].textWidth>0) {
				ctx.save();
				ctx.beginPath();
				ctx.font = legendMsr.elementMsr[i].element.fontStyle + " " + (Math.ceil(ctx.chartTextScale*legendMsr.elementMsr[i].element.fontSize)).toString() + "px " + legendMsr.elementMsr[i].element.fontFamily;
				ctx.fillStyle = legendMsr.elementMsr[i].element.fontColor;
				ctx.textAlign = "left";
				ctx.textBaseline = "bottom";
				xpos=legendMsr.xLegendPos+legendMsr.legendFirstTextXPos+legendMsr.elementMsr[i].eltPosX+legendMsr.elementMsr[i].textPosX;
				ypos=legendMsr.yLegendPos+legendMsr.legendFirstTextYPos+legendMsr.elementMsr[i].eltPosY+legendMsr.elementMsr[i].textPosY;
				ctx.translate(xpos, ypos);
				ctx.fillTextMultiLine(legendMsr.elementMsr[i].element.text, 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale*legendMsr.elementMsr[i].element.fontSize), true,config.detectMouseOnText,ctx,"LEGEND_TEXTMOUSE",0,xpos , ypos,i,-1);
				ctx.restore();
			}
		}
	}
};

function measureLegend(data,ctx,config,widestLegend,highestLegend,nbLegendLines,nbLegendCols,availableLegendWidth) {
	var elementMsr =[];
	var i;
	var cntLegend;
	var element;
	var textLength;
	var mxtextwidth,curmxtextwidth,mxtextheight,curmxtextheight;
	var legendDefaultValuesFromConfig = legendDefaultValuesFromConfigInit(config);
	mxtextheight=0;
	mxtextwidth=0;
	if(typeof data.legend == "object") {
		cntLegend=data.legend.length;
		for(i=0;i<data.legend.length;i++) {
			elementMsr[i]={};
			elementMsr[i].element=setLegendElementValue(data,i,config,legendDefaultValuesFromConfig);
		}		
	} else {
		cntLegend=data.datasets.length;
		for (i = 0;i<data.datasets.length ; i++) {
			if(ctx.tpchart=="Line")j=data.datasets.length-1-i;
			else j=i;
			elementMsr[i]={};
			elementMsr[i].element={};
			
			elementMsr[i].element.text="";
			if (typeof(data.datasets[j].title) == "string") {
				if (data.datasets[j].title.trim() != "") {
					elementMsr[i].element.text=data.datasets[j].title.trim();
				}
			}
			if((ctx.tpchart=="Radar" || ctx.tpchart=="Line" || ctx.tpchart=="Bar" || ctx.tpchart=="StackedBar") && ((ctx.tpchart=="Radar" || ctx.tpchart=="Line" || data.datasets[j].type=="Line") && (!config.datasetFill || setOptionValue(true,false,1,"LINKTYPE",ctx,data,undefined,data.datasets[j].linkType,config.linkType,"linkType",i,-1,{nullvalue : null} )==1))) {
				elementMsr[i].element.shape="line";
				elementMsr[i].element.shapeBordersWidth = setOptionValue(true,false,1,"LINEWIDTH",ctx,data,undefined,data.datasets[j].datasetStrokeWidth,config.datasetStrokeWidth,"datasetStrokeWidth",i,-1,{nullvalue : null} );
				elementMsr[i].element.shapeBordersColor=setOptionValue(true,false,1,"LEGENDSTROKECOLOR",ctx,data,undefined,data.datasets[j].strokeColor,config.defaultFillColor,"strokeColor",i,-1,{animationValue: 1, xPosLeft : 0, yPosBottom : 0, xPosRight : 0 + Math.ceil(ctx.chartTextScale*config.legendBlockSize), yPosTop : 0 - (Math.ceil(ctx.chartTextScale*config.legendFontSize))} );
				elementMsr[i].element.shapeBordersStyle=setOptionValue(true,false,1,"LEGENDLINEDASH",ctx,data,undefined,data.datasets[j].datasetStrokeStyle,config.datasetStrokeStyle,"datasetStrokeStyle",i,-1,{animationValue: 1, xPosLeft : 0, yPosBottom : 0, xPosRight : 0 + Math.ceil(ctx.chartTextScale*config.legendBlockSize), yPosTop : 0 - (Math.ceil(ctx.chartTextScale*config.legendFontSize))} );
				if(config.pointDot || typeof data.datasets[j].pointColor=="string") {
					elementMsr[i].element.drawMarker=true;
		 			elementMsr[i].element.markerFillColor=setOptionValue(true,false,1,"LEGENDMARKERFILLCOLOR",ctx,data,undefined,data.datasets[j].pointColor,config.defaultStrokeColor,"pointColor",i,-1,{nullvalue: true} );
					elementMsr[i].element.markerStrokeStyle=setOptionValue(true,false,1,"LEGENDMARKERSTROKESTYLE",ctx,data,undefined,data.datasets[j].pointStrokeColor,config.defaultStrokeColor,"pointStrokeColor",i,-1,{nullvalue: true} );
					elementMsr[i].element.markerLineWidth=setOptionValue(true,false,ctx.chartLineScale,"LEGENDMARKERLINEWIDTH",ctx,data,undefined,data.datasets[j].pointDotStrokeWidth,config.pointDotStrokeWidth,"pointDotStrokeWidth",i,-1,{nullvalue: true} );
					elementMsr[i].element.markerShape=setOptionValue(true,false,1,"LEGENDMARKERSHAPE",ctx,data,undefined,data.datasets[j].markerShape,config.markerShape,"markerShape",i,-1,{nullvalue: true} );
					elementMsr[i].element.markerRadius=setOptionValue(true,false,ctx.chartSpaceScale,"LEGENDMARKERRADIUS",ctx,data,undefined,data.datasets[j].pointDotRadius,config.pointDotRadius,"pointDotRadius",i,-1,{nullvalue: true} );
				}
			} else {
				elementMsr[i].element.shape="rectangle";
				elementMsr[i].element.shapeBordersWidth = Math.ceil(ctx.chartLineScale*setOptionValue(true,true ,1,"BARSTROKEWIDTH",ctx,data,undefined,data.datasets[j].barStrokeWidth,    config.barStrokeWidth    ,"barStrokeWidth",i,-1,{nullvalue : null} ));				
				elementMsr[i].element.shapeBordersColor=setOptionValue(true,false,1,"LEGENDSTROKECOLOR",ctx,data,undefined,data.datasets[j].strokeColor,config.defaultFillColor,"strokeColor",i,-1,{animationValue: 1, xPosLeft : 0, yPosBottom : 0, xPosRight : 0 + Math.ceil(ctx.chartTextScale*config.legendBlockSize), yPosTop : 0 - (Math.ceil(ctx.chartTextScale*config.legendFontSize))} );
				elementMsr[i].element.shapeBordersStyle=setOptionValue(true,false,1,"LEGENDLINEDASH",ctx,data,undefined,data.datasets[j].datasetStrokeStyle,config.datasetStrokeStyle,"datasetStrokeStyle",i,-1,{animationValue: 1, xPosLeft : 0, yPosBottom : 0, xPosRight : 0 + Math.ceil(ctx.chartTextScale*config.legendBlockSize), yPosTop : 0 - (Math.ceil(ctx.chartTextScale*config.legendFontSize))} );
				elementMsr[i].element.shapeFillColor=setOptionValue(true,false,1,"LEGENDFILLCOLOR",ctx,data,undefined,data.datasets[j].fillColor,config.defaultFillColor,"fillColor",i,-1,{animationValue: 1, xPosLeft : 0, yPosBottom : 0, xPosRight : 0 + Math.ceil(ctx.chartTextScale*config.legendBlockSize), yPosTop : 0 - (Math.ceil(ctx.chartTextScale*config.legendFontSize))} );
			}
			elementMsr[i].element=setLegendElementValueBis(elementMsr[i].element,config,legendDefaultValuesFromConfig);
		}
	}
	// compute width and height of each Element;
	for(i=0;i<cntLegend;i++)
	{
		// text size;
		if(elementMsr[i].element.text !="" && elementMsr[i].element.element=="shapeText") {
			ctx.font = elementMsr[i].element.fontStyle + " " + (Math.ceil(ctx.chartTextScale*elementMsr[i].element.fontSize)).toString() + "px " + elementMsr[i].element.fontFamily;
			textLength = ctx.measureTextMultiLine(elementMsr[i].element.text,Math.ceil(ctx.chartTextScale*elementMsr[i].element.fontSize));
			elementMsr[i].textWidth=textLength.textWidth;
			elementMsr[i].textHeight=textLength.textHeight;
		} else {
			elementMsr[i].textWidth=0;
			elementMsr[i].textHeight=0;
		}

		// Shape size;
		elementMsr[i].shapeWidth=0;
		elementMsr[i].shapeHeight=0;
		elementMsr[i].shapePosX=0;
		elementMsr[i].shapePosY=0;



		if((elementMsr[i].element.shape =="rectangle" || elementMsr[i].element.shape =="ellipse" || elementMsr[i].element.shape =="line") && elementMsr[i].element.element=="shapeText") {
			if(elementMsr[i].textWidth>0 && elementMsr[i].textHeight>0 && elementMsr[i].element.textHPos>0 && elementMsr[i].element.textHPos<4 && elementMsr[i].element.textVPos>0 && elementMsr[i].element.textVPos<4){
				elementMsr[i].shapeWidth=elementMsr[i].textWidth+2*elementMsr[i].element.HspaceBetweenShapeAndText;
				elementMsr[i].shapeHeight=elementMsr[i].textHeight+2*elementMsr[i].element.VspaceBetweenShapeAndText;
				if(typeof elementMsr[i].element.shapeWidth=="number")elementMsr[i].shapeWidth=Math.max(elementMsr[i].shapeWidth,elementMsr[i].element.shapeWidth);
				if(typeof elementMsr[i].element.shapeHeight=="number")elementMsr[i].shapeHeight=Math.max(elementMsr[i].shapeHeight,elementMsr[i].element.shapeHeight);
			}  else {
				if(typeof elementMsr[i].element.shapeWidth=="number")elementMsr[i].shapeWidth=elementMsr[i].element.shapeWidth;
				else  elementMsr[i].shapeWidth=config.legendBlockSize;
				if(typeof elementMsr[i].element.shapeHeight=="number")elementMsr[i].shapeHeight=elementMsr[i].element.shapeHeight;
				else  elementMsr[i].shapeHeight=config.legendFontSize;
			}
		}
		if(elementMsr[i].shapeWidth==0 || elementMsr[i].shapeHeight==0){
			elementMsr[i].shapeWidth=0;
			elementMsr[i].shapeHeight=0;
		}
		computeWidthHeight();
		if(elementMsr[i].height==0 || elementMsr[i].width==0) {
			elementMsr[i].width=0;
			elementMsr[i].height=0;
			elementMsr[i].textWidth=0;
			elementMsr[i].textHeight=0;
			elementMsr[i].shapeWidth=0;
			elementMsr[i].shapeHeight=0;
		} 
	}	
	// correct shape height/width;
	for(i=0;i<cntLegend;i++)
	{
		if(elementMsr[i].element.element=="shapeText") {
			if(elementMsr[i].width>0 && elementMsr[i].shapeWidth>0 && typeof elementMsr[i].element.shapeWidth=="string") {
				for(j=i+1;j<cntLegend;j++) {
					if(elementMsr[j].width>0 && elementMsr[j].shapeWidth>=0 && typeof elementMsr[j].element.shapeWidth=="string" && elementMsr[i].element.shapeWidth==elementMsr[j].element.shapeWidth) {
						elementMsr[i].shapeWidth=Math.max(elementMsr[i].shapeWidth,elementMsr[j].shapeWidth);
						elementMsr[j].shapeWidth=elementMsr[i].shapeWidth;
					}					
				}
			}		
			if(elementMsr[i].height >0 && elementMsr[i].shapeHeight>0 && typeof elementMsr[i].element.shapeHeight=="string") {
				for(j=i+1;j<cntLegend;j++) {
					if(elementMsr[j].height >0 && elementMsr[j].shapeHeight>=0 && typeof elementMsr[j].element.shapeHeight=="string" && elementMsr[i].element.shapeHeight==elementMsr[j].element.shapeHeight) {
						elementMsr[i].shapeHeight=Math.max(elementMsr[i].shapeHeight,elementMsr[j].shapeHeight);
						elementMsr[j].shapeHeight=elementMsr[i].shapeHeight;
					}					
				}
			}
			// recompute elt width/height;		
			computeWidthHeight();
		}	
	}
	// recompute element height/width ...;
	var eltMaxWidth=0;
	var eltMaxHeight=0;
	var nextLineAlign=defaultNextLineAlign;
	var nextLineBaseline=defaultNextLineBaseline;
	var decalelt;

	// store align / baseline for all elt;
	for(i=0;i<cntLegend;i++)
	{
		if(elementMsr[i].element.element=="shapeText") {
			elementMsr[i].align=nextLineAlign;
			elementMsr[i].baseline=nextLineBaseline;
		} else if (elementMsr[i].element.element=="CR") {
			if(typeof elementMsr[i].element.nextLineAlign!="undefined")nextLineAlign=elementMsr[i].element.nextLineAlign;
			if(typeof elementMsr[i].element.nextLineBaseline!="undefined")nextLineBaseline=elementMsr[i].element.nextLineBaseline;
		}
	}	
	
	// correct element height/width according parameters elementWidth/elementHeight;
	for(i=0;i<cntLegend;i++)
	{
		if(elementMsr[i].element.element=="shapeText") {
			if(typeof elementMsr[i].element.elementWidth=="number" && elementMsr[i].width>0)
			{
				if(elementMsr[i].width < elementMsr[i].element.elementWidth) {
					decalelt=elementMsr[i].element.elementWidth-elementMsr[i].width;
					adjustAlign(i,decalelt);
					elementMsr[i].width=elementMsr[i].element.elementWidth;
		
				}
			} else if(elementMsr[i].width > 0 && typeof elementMsr[i].element.elementWidth=="string") {

 
				for(j=i+1;j<cntLegend;j++) {
					if(elementMsr[j].width>0 && typeof elementMsr[j].element.elementWidth=="string" && elementMsr[i].element.elementWidth==elementMsr[j].element.elementWidth) {
						if(elementMsr[j].width>elementMsr[i].width) {
							decalelt=elementMsr[j].width-elementMsr[i].width;
							adjustAlign(i,decalelt);
							elementMsr[i].width=elementMsr[j].width;
						} else {
							decalelt=elementMsr[i].width-elementMsr[j].width;
							adjustAlign(j,decalelt);
							elementMsr[j].width=elementMsr[i].width;
						}
					}					
				}
 			}
			if(typeof elementMsr[i].element.elementHeight=="number" && elementMsr[i].height>0)
			{
				if(elementMsr[i].height < elementMsr[i].element.elementHeight) {
					decalelt=elementMsr[i].element.elementHeight-elementMsr[i].height;
					adjustBaseline(i,decalelt);
					elementMsr[i].height=elementMsr[i].element.elementHeight;
				} 
			} else if(elementMsr[i].height > 0 && typeof elementMsr[i].element.elementHeight=="string") {
				for(j=i+1;j<cntLegend;j++) {
					if(elementMsr[j].height>0 && typeof elementMsr[j].element.elementHeight=="string" && elementMsr[i].element.elementHeight==elementMsr[j].element.elementHeight) {
						if(elementMsr[j].height>elementMsr[i].height) {
							decalelt=elementMsr[j].height-elementMsr[i].height;
							adjustBaseline(i,decalelt);
							elementMsr[i].height=elementMsr[j].height;
						} else {
							decalelt=elementMsr[i].height-elementMsr[j].height;
							adjustBaseline(j,decalelt);
							elementMsr[j].height=elementMsr[i].height;
						}
					}					
				}
			}
		} 
	}	

	// compute line of each element;
	var curline=0;
	var cureltinline=0;
	var curlinewidth=0;
	var maxlinewidth=0;
	var legendHeight=0;
	var curlineheight=0;
	var legendHeight=0;
	var nextLineSpace=config.legendSpaceBetweenTextVertical;
	maxLegendCols=config.maxLegendCols;
	var shapetextfound=0;
	for(i=0;i<cntLegend;i++)
	{
		if(elementMsr[i].element.element=="shapeText") {
			shapetextfound=1;
			elementMsr[i].line=curline;
			curlinewidth+=elementMsr[i].width+(cureltinline!=0)*elementMsr[i].element.spaceBefore;
			cureltinline++;
			curlineheight=Math.max(curlineheight,elementMsr[i].height);
			if (cureltinline>=maxLegendCols || curlinewidth+elementMsr[i].element.spaceBefore+elementMsr[i].width+elementMsr[i].element.spaceAfter>availableLegendWidth) {
				curline++;
				cureltinline=0;
				legendHeight+=curlineheight+nextLineSpace;
//				legendHeight+=nextLineSpace;
				curlineheight=0;
				maxlinewidth=Math.max(maxlinewidth,curlinewidth);	
				curlinewidth=0;
			}

		} else if(elementMsr[i].element.element=="CR") {
			legendHeight+=curlineheight;
			curline++;
			cureltinline=0;
			curlinewidth=0;
//			if(typeof elementMsr[i].element.CRSpace!="undefined")legendHeight+=curlineheight+elementMsr[i].element.CRSpace;
			if(typeof elementMsr[i].element.CRSpace!="undefined")nextLineSpace=elementMsr[i].element.CRSpace;
			if(typeof elementMsr[i].element.maxLegendCols=="number")maxLegendCols=elementMsr[i].element.maxLegendCols;
			if(shapetextfound==1)legendHeight+=nextLineSpace;
			curlineheight=0;
		}
		maxlinewidth=Math.max(maxlinewidth,curlinewidth);	
	}	
//	maxlinewidth=Math.max(maxlinewidth,curlinewidth);	
	legendHeight+=curlineheight;

	// Compute position of each element
	nextLineAlign=defaultNextLineAlign;
	nextLineBaseline=defaultNextLineBaseline;
	nextLineSpace=defaultCRSpace;
	var toElt=0;
	var Vpos=0;
	while(toElt < cntLegend && elementMsr[toElt].element.element!="shapeText"){
		if(elementMsr[toElt].element.element=="CR") {
			if(typeof elementMsr[toElt].element.CRSpace!="undefined")nextLineSpace=elementMsr[toElt].element.CRSpace;
//			Vpos+=nextLineSpace;
			if(typeof elementMsr[toElt].element.nextLineAlign!="undefined")nextLineAlign=elementMsr[toElt].element.nextLineAlign;
			if(typeof elementMsr[toElt].element.nextLineBaseline!="undefined")nextLineBaseline=elementMsr[toElt].element.nextLineBaseline;
		}
		toElt=toElt+1;
	}
	if(toElt<cntLegend)curline=elementMsr[toElt].line;
	var lineWidth, lineHeight;
	var doneCR;	
	var eltPosX;	
	while(toElt<cntLegend )  {
		fromElt=toElt;	
		curline=elementMsr[fromElt].line;
        	lineWidth=0;
        	lineHeight=0;
		while(toElt<cntLegend && elementMsr[toElt].element.element=="shapeText" && elementMsr[toElt].line==curline ) {
			lineWidth+=elementMsr[toElt].width+(toElt!=fromElt)*elementMsr[toElt].element.spaceBefore;
			lineHeight=Math.max(lineHeight,elementMsr[toElt].height);
			toElt++;
		}
		if(nextLineAlign=="center") {
			eltPosX=(maxlinewidth-lineWidth)/2;
		} else if (nextLineAlign=="right") {
			eltPosX=(maxlinewidth-lineWidth);
		} else {
			eltPosX=0;
		}

		for(i=fromElt;i<toElt;i++) {
			eltPosX+=(i!=fromElt)*elementMsr[i].element.spaceBefore;
			elementMsr[i].eltPosX=eltPosX;
			eltPosX+=elementMsr[i].width;
			if(nextLineBaseline=="bottom") {
				elementMsr[i].eltPosY=Vpos+lineHeight;
			} else if(nextLineBaseline=="top") {
				elementMsr[i].eltPosY=Vpos+elementMsr[i].height;
			} else {
				elementMsr[i].eltPosY=Vpos+elementMsr[i].height+(lineHeight-elementMsr[i].height)/2;
			}
		};
		Vpos+=lineHeight;
		doneCR=0;
	        // compute width and height;
		while(toElt < cntLegend && elementMsr[toElt].element.element!="shapeText"){
			if (elementMsr[toElt].element.element=="CR") {
				if(typeof elementMsr[toElt].element.CRSpace!="undefined")nextLineSpace=elementMsr[toElt].element.CRSpace;
				if(typeof elementMsr[toElt].element.nextLineAlign!="undefined")nextLineAlign=elementMsr[toElt].element.nextLineAlign;
				if(typeof elementMsr[toElt].element.nextLineBaseline!="undefined")nextLineBaseline=elementMsr[toElt].element.nextLineBaseline;
				doneCR=1;
				Vpos+=nextLineSpace;
			}
			toElt++;
		}
		if(!doneCR)Vpos+=nextLineSpace;
	}


	var legendWidth=0;
	var legendBackgroundColorWidth=0;
	var legendBackgroundColorHeight=0;
	var legendBorderWidth=0;
	var legendBorderHeight=0;
	var legendFirstTextXPos=0;
	var legendFirstTextYPos=0;
	var legendBackgroundColorXPos=0;
	var legendBackgroundColorYPos=0;
	var legendBorderXPos=0;
	var legendBorderYPos=0;
	legendBackgroundColorHeight = legendHeight+ Math.ceil(ctx.chartSpaceScale*Math.ceil(ctx.chartSpaceScale*config.legendSpaceBeforeText)) + Math.ceil(ctx.chartSpaceScale*config.legendSpaceAfterText);
	legendBackgroundColorWidth  = maxlinewidth+ Math.ceil(ctx.chartSpaceScale*Math.ceil(ctx.chartSpaceScale*config.legendSpaceLeftText)) + Math.ceil(ctx.chartSpaceScale*config.legendSpaceRightText);
	legendHeight=legendHeight+ Math.ceil(ctx.chartSpaceScale*Math.ceil(ctx.chartSpaceScale*config.legendSpaceBeforeText)) + Math.ceil(ctx.chartSpaceScale*config.legendSpaceAfterText);
	legendWidth=maxlinewidth + Math.ceil(ctx.chartSpaceScale*Math.ceil(ctx.chartSpaceScale*config.legendSpaceLeftText)) + Math.ceil(ctx.chartSpaceScale*config.legendSpaceRightText);
	legendFirstTextXPos=Math.ceil(ctx.chartSpaceScale*config.legendSpaceLeftText);
	legendFirstTextYPos=Math.ceil(ctx.chartSpaceScale*config.legendSpaceBeforeText);
	if (config.legendBorders == true) {
	        legendBorderWidth=legendWidth;
		legendBorderHeight=legendHeight;
	        if(isBorder(config.legendBordersSelection,"LEFT")){
			legendBorderWidth  +=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)/2;
			legendWidth        +=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)+Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft);
			legendFirstTextXPos+=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)+Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft);
			legendBorderXPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft)+Math.ceil(ctx.chartLineScale*config.legendBordersWidth)/2;
			legendBackgroundColorXPos+=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)+Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft);
		} else if(config.legendFillColor != "rgba(0,0,0,0)") {
			legendWidth        +=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft);
			legendFirstTextXPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft);
			legendBackgroundColorXPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft);
			legendBorderXPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft);
		}
	        if(isBorder(config.legendBordersSelection,"RIGHT")){
			legendBorderWidth+= Math.ceil(ctx.chartLineScale*config.legendBordersWidth)/2;
			legendWidth      += Math.ceil(ctx.chartLineScale*config.legendBordersWidth)+Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceRight);
		} else if(config.legendFillColor != "rgba(0,0,0,0)") {
			legendWidth        +=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceRight);
		}
		if(isBorder(config.legendBordersSelection,"TOP")){
			legendBorderHeight +=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)/2;
			legendHeight       +=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)+Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore);
			legendFirstTextYPos+=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)+Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore);
			legendBackgroundColorYPos+=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)+Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore);
			legendBorderYPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore)+Math.ceil(ctx.chartLineScale*config.legendBordersWidth)/2;
		} else if(config.legendFillColor != "rgba(0,0,0,0)") {
			legendHeight        +=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore);
			legendFirstTextYPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore);
			legendBackgroundColorYPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore);
			legendBorderYPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore);
		}
	        if(isBorder(config.legendBordersSelection,"BOTTOM")){
			legendBorderHeight+=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)/2;
			legendHeight      +=Math.ceil(ctx.chartLineScale*config.legendBordersWidth)+Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceAfter);
		} else if(config.legendFillColor != "rgba(0,0,0,0)") {
			legendHeight        +=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceAfter);
		}
	} else if (config.legendFillColor != "rgba(0,0,0,0)") {
		legendWidth +=  Math.ceil(ctx.chartSpaceScale*(config.legendBordersSpaceRight+config.legendBordersSpaceLeft));
		legendHeight+=  Math.ceil(ctx.chartSpaceScale*(config.legendBordersSpaceBefore+config.legendBordersSpaceAfter));
		legendBackgroundColorXPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft);
		legendBackgroundColorYPos+=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore);
		legendFirstTextXPos +=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceLeft);
		legendFirstTextYPos +=Math.ceil(ctx.chartSpaceScale*config.legendBordersSpaceBefore);
	}
	return {
		legendWidth: legendWidth,
		legendHeight: legendHeight,
		legendBackgroundColorWidth:legendBackgroundColorWidth,
		legendBackgroundColorHeight:legendBackgroundColorHeight,
		legendBorderWidth:legendBorderWidth,
		legendBorderHeight:legendBorderHeight,
		legendFirstTextXPos:legendFirstTextXPos,
		legendFirstTextYPos:legendFirstTextYPos,
		legendBackgroundColorXPos:legendBackgroundColorXPos,
		legendBackgroundColorYPos:legendBackgroundColorYPos,
		legendBorderXPos:legendBorderXPos,
		legendBorderYPos:legendBorderYPos,
		elementMsr : elementMsr
	};



	function adjustAlign(i,decalelt) {		
		if(elementMsr[i].element.textHPos==2){
			elementMsr[i].textPosX+=decalelt/2;
			elementMsr[i].shapePosX+=decalelt/2;
		} else if(elementMsr[i].element.textHPos<2) {
			elementMsr[i].textPosX+=decalelt;
			elementMsr[i].shapePosX+=decalelt;
		} else {
			// nothing to change;   					
		}
	};

       	function adjustBaseline(i,decalelt) {		
		if(elementMsr[i].element.textVPos==2){
			elementMsr[i].textPosY-=decalelt/2;
			elementMsr[i].shapePosY-=decalelt/2;
		} else if(elementMsr[i].element.textVPos<2) {
			elementMsr[i].textPosY-=decalelt;
			elementMsr[i].shapePosY-=decalelt;
		} else {
			// nothing to change;   					
		}
	};



	function computeWidthHeight() {
		var textPadding;
		if(elementMsr[i].element.element=="shapeText") {
                        var textLeft=0;
                        var textRight=0;
                        if(elementMsr[i].shapeWidth==0 && elementMsr[i].textWidth==0)elementMsr[i].width=0;
                        else if(elementMsr[i].shapeWidth>0 && elementMsr[i].textWidth==0)elementMsr[i].width=elementMsr[i].shapeWidth;
                        else if(elementMsr[i].shapeWidth==0 && elementMsr[i].textWidth>0) {
				elementMsr[i].width=elementMsr[i].textWidth;
				elementMsr[i].textPosX=0;
			} else {
				if(elementMsr[i].element.textHPos==0) {
					textPadding=-elementMsr[i].element.HspaceBetweenShapeAndText+elementMsr[i].element.textPaddingX;
					if(textPadding<0)textLeft=elementMsr[i].textWidth-textPadding;
					else {
						if(textPadding>elementMsr[i].shapeWidth)textRight=Math.max(0,textPadding-elementMsr[i].shapeWidth);
						if(textRight>0) textLeft=Math.max(0,elementMsr[i].textWidth-textRight-elementMsr[i].shapeWidth);
						else textLeft=Math.max(0,elementMsr[i].textWidth-textPadding);
					}
				} else if(elementMsr[i].element.textHPos==4) {
					textPadding=elementMsr[i].element.HspaceBetweenShapeAndText+elementMsr[i].element.textPaddingX;
					if(textPadding>0)textRight=elementMsr[i].textWidth+textPadding;
					else {
						if(-textPadding>elementMsr[i].shapeWidth)textLeft=-textPadding-elementMsr[i].shapeWidth;
						if(textLeft>0) textRight=Math.max(0,elementMsr[i].textWidth-textLeft-elementMsr[i].shapeWidth);
						else textRight=Math.max(0,elementMsr[i].textWidth+textPadding);
					}
				} else if(elementMsr[i].element.textHPos==1){
					textPadding=elementMsr[i].element.textPaddingX+elementMsr[i].element.HspaceBetweenShapeAndText;
                                	if(textPadding<0)textLeft=-textPadding;
                                	textRight=Math.max(0,(elementMsr[i].textWidth+textPadding)-elementMsr[i].shapeWidth);
				} else if(elementMsr[i].element.textHPos==3){
					textPadding=elementMsr[i].element.textPaddingX-elementMsr[i].element.HspaceBetweenShapeAndText;
                                	if(textPadding>0)textRight=textPadding;
                                	textLeft=Math.max(0,(elementMsr[i].textWidth-textPadding)-elementMsr[i].shapeWidth);
				}
                                else if(elementMsr[i].element.textHPos==2){
                                	textPadding=0;
                                	textRight=Math.max(0,elementMsr[i].textWidth+2*elementMsr[i].element.HspaceBetweenShapeAndText-elementMsr[i].shapeWidth)/2;
                                	textLeft=textRight;
				}
				elementMsr[i].width=elementMsr[i].shapeWidth+textLeft+textRight;
				if(textLeft>0) {
					elementMsr[i].textPosX=0;
					elementMsr[i].shapePosX=textLeft;
				} else if (textRight>0) {
					elementMsr[i].textPosX=elementMsr[i].shapeWidth+textRight-elementMsr[i].textWidth;
					elementMsr[i].shapePosX=0;
				} else {
					elementMsr[i].shapePosX=0;
					if(elementMsr[i].element.textHPos==2)elementMsr[i].textPosX= (elementMsr[i].shapeWidth-elementMsr[i].textWidth)/2;
					else if(elementMsr[i].element.textHPos==1)elementMsr[i].textPosX= textPadding;
					else if(elementMsr[i].element.textHPos==3)elementMsr[i].textPosX= elementMsr[i].shapeWidth-elementMsr[i].textWidth+textPadding;
					else if(elementMsr[i].element.textHPos==0)elementMsr[i].textPosX= elementMsr[i].textWidth-textPadding;
					else if(elementMsr[i].element.textHPos==4)elementMsr[i].textPosX= elementMsr[i].shapeWidth+textPadding;
				}
			}				
		} else if (elementMsr[i].element.element=="CR") {
			elementMsr[i].width=0;
		} else {
			elementMsr[i].width=0;
		}
		// element Height : 
		if(elementMsr[i].element.element=="shapeText") {
                        var textBottom=0;
                        var textTop=0;
                        if(elementMsr[i].shapeHeight==0 && elementMsr[i].textHeight==0)elementMsr[i].height=0;
                        else if(elementMsr[i].shapeHeight>0 && elementMsr[i].textHeight==0)elementMsr[i].height=elementMsr[i].shapeHeight;
                        else if(elementMsr[i].shapeHeight==0 && elementMsr[i].textHeight>0){
				elementMsr[i].height=elementMsr[i].textHeight;
				elementMsr[i].textPosY=0;
			} else {
				if(elementMsr[i].element.textVPos==0) {
					textPadding=elementMsr[i].element.textPaddingY + elementMsr[i].element.VspaceBetweenShapeAndText;
					if(textPadding>0)textBottom=elementMsr[i].textHeight+textPadding;
					else {
						if(-textPadding>elementMsr[i].shapeHeight)textTop=Math.max(0,-textPadding-elementMsr[i].shapeHeight);
						if(textTop>0) textBottom=Math.max(0,elementMsr[i].textHeight-textTop-elementMsr[i].shapeHeight);
						else textBottom=Math.max(0,elementMsr[i].textHeight+textPadding);
					}
				} else if(elementMsr[i].element.textVPos==4) {
					textPadding=elementMsr[i].element.textPaddingY - elementMsr[i].element.VspaceBetweenShapeAndText;
					if(textPadding<0)textTop=elementMsr[i].textHeight-textPadding;
					else {
						if(textPadding>elementMsr[i].shapeHeight)textBottom=textPadding-elementMsr[i].shapeHeight;
						if(textBottom>0) textTop=Math.max(0,elementMsr[i].textHeight-textBottom-elementMsr[i].shapeHeight);
						else textTop=Math.max(0,(elementMsr[i].textHeight-textPadding));
					}
				} else if(elementMsr[i].element.textVPos==1){
					textPadding=elementMsr[i].element.textPaddingY - elementMsr[i].element.VspaceBetweenShapeAndText;
                                	if(textPadding>0)textBottom=textPadding;
                                	textTop=Math.max(0,(elementMsr[i].textHeight-textPadding)-elementMsr[i].shapeHeight);
				} else if(elementMsr[i].element.textVPos==3){
					textPadding=elementMsr[i].element.textPaddingY + elementMsr[i].element.VspaceBetweenShapeAndText;
                                	if(textPadding<0)textTop=-textPadding;
                                	textBottom=Math.max(0,(elementMsr[i].textHeight+textPadding)-elementMsr[i].shapeHeight);
				}
                                else if(elementMsr[i].element.textVPos==2){
                                	textPadding=0;
                                	textTop=Math.max(0,elementMsr[i].textHeight-elementMsr[i].shapeHeight)/2;
                                	textBottom=textTop;
				}
				elementMsr[i].height=elementMsr[i].shapeHeight+textTop+textBottom;
				if(textTop>0) {
					elementMsr[i].textPosY=-textBottom-elementMsr[i].shapeHeight-textTop+elementMsr[i].textHeight;
					elementMsr[i].shapePosY=-textBottom;
				} else if (textBottom>0) {
					elementMsr[i].textPosY=0;
					elementMsr[i].shapePosY=-textBottom;
				} else {
					elementMsr[i].shapePosY=0;
					if(elementMsr[i].element.textVPos==2)elementMsr[i].textPosY= -elementMsr[i].shapeHeight/2 + elementMsr[i].textHeight/2;
					else if(elementMsr[i].element.textVPos==1)elementMsr[i].textPosY= textPadding;
					else if(elementMsr[i].element.textVPos==3)elementMsr[i].textPosY= -elementMsr[i].shapeHeight+elementMsr[i].textHeight+textPadding;
					else if(elementMsr[i].element.textVPos==0)elementMsr[i].textPosY= textPadding+elementMsr[i].textHeight;
					else if(elementMsr[i].element.textVPos==4)elementMsr[i].textPosY= -elementMsr[i].shapeHeight+textPadding;
				}
			}				
		} else if (elementMsr[i].element.element=="CR") {
			if(typeof elementMsr[i].element.CRSpace!="undefined")elementMsr[i].height=elementMsr[i].element.CRSpace;
		} else {
			elementMsr[i].height=0;
		}
	}
};

function setLegendElementValue(data,legend,config,legendDefaultValuesFromConfig) {
	var returnObj = {};
	returnObj=mergeChartConfig(legendDefaultValuesFromConfig,data.legend[legend]);
	returnObj=mergeChartConfig(defaultLegendValues,returnObj);
	return returnObj;	
};

function setLegendElementValueBis(element,config,legendDefaultValuesFromConfig) {
	var returnObj = element;
	returnObj=mergeChartConfig(legendDefaultValuesFromConfig,returnObj);
	returnObj=mergeChartConfig(defaultLegendValues,returnObj);
	return returnObj;	
};

function legendDefaultValuesFromConfigInit(config) {
	return {
		HspaceBetweenShapeAndText : (typeof config.legendSpaceBetweenBoxAndText!="undefined" ? config.legendSpaceBetweenBoxAndText :5 ),
		shapeHeight : (typeof config.legendFontSize!="undefined" ? config.legendFontSize : 12),
		shapeWidth : (typeof config.legendBlockSize!="undefined" ? config.legendBlockSize : 15), 
		markerRadius : (typeof config.pointDotRadius!="undefined" ? config.pointDotRadius : 4),
		markerStrokeStyle : (typeof config.pointDotStrokeStyle!="undefined" ? config.pointDotStrokeStyle : "solid" ),
		markerFillColor : (typeof config.defaultStrokeColor!="undefined" ? config.defaultStrokeColor : "rgba(220,220,220,1)"),
		markerLineWidth : (typeof config.pointDotStrokeWidth!="undefined" ? config.pointDotStrokeWidth : 2),
		shapeBordersWidth : (typeof config.datasetStrokeWidth !="undefined" ? config.datasetStrokeWidth : 2),
		shapeBordersStyle : (typeof config.datasetStrokeStyle!="undefined" ? config.datasetStrokeStyle : "solid"),
		shapeBordersColor :  (typeof config.legendBordersColors!="undefined" ? config.legendBordersColors : "#666"),
		shapeFillColor : (typeof config.defaultFillColor!="undefined" ? config.defaultFillColor : "rgba(220,220,220,0.5)" ),
		fontFamily: (typeof config.legendFontFamily!="undefined" ? config.legendFontFamily : "'Arial'"),
		fontSize: (typeof config.legendFontSize!="undefined" ? config.legendFontSize : 12),
		fontStyle: (typeof config.legendFontStyle!="undefined" ? config.legendFontStyle : "normal"),
		fontColor: (typeof config.legendFontColor!="undefined" ? config.legendFontColor : "#666")
	};
};
