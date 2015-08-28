// JavaScript Document

var drawShape_default= {
	position : "INCHART",
	shape : "CIRCLE",
	radius : 10, 
	ellipseHeight : 20,
	ellipseWidth : 40,
	sideCount : 4,
	lineCount : 3,
	x1:0,
	x2:0,
	x3:0,
	x4:0,
	y1:0,
	y2:0,
	y3:0,
	y4:0,
	strokeStyle: "solid",
	strokeSize:2, 
	strokeColor : "black", 
	fillColor: "blue",
	startAngle : 0, 
	endAngle : 360, 
	limitToChart : true,
	paddingX1: 0,
	paddingY1: 0,
	paddingX2: 0,
	paddingY2: 0,
	paddingX3: 0,
	paddingY3: 0,
	paddingX4: 0,
	paddingY4: 0,
	when : "always",    // "initFunction", "enddatafunction", "endscalefunction" or "always"
	iter : "all",        // "first", "last", "all" or a number
	animate : false,
	arrowWidth : 15,
	arrowHeight : 20,
	arrowTop : true,
	arrowBottom : false,
	text : "Your Text",
	rotate : 0,
	textAlign : "center",
	textBaseline : "middle",
	imagesrc : "",
	imageAlign : "center",
	imageBaseline : "middle",
	fontColor : "rgba(220,220,220,1)", 
	fontStyle : "normal",
	fontSize : 12,
	fontFamily : "'Arial'",
	textBorders : false,
	textBordersColor : "black",
	textBordersWidth : 1,
	textBordersXSpace : 3,
	textBordersYSpace : 3,
	textBordersStyle : "solid",
	textBackgroundColor : "none"
};

function drawShapes(area, ctx, data,statData, posi,posj,othervars){

	var shape,whendrw,iter,realAnimation;


	if(typeof data.shapesInChart == "object") var shapesInChart=data.shapesInChart;
	if(typeof data[0]=="object") if (typeof data[0].shapesInChart == "object") var shapesInChart=data[0].shapesInChart;

	
	if(typeof shapesInChart == "object") {
	
		//      preload all images first;
		for(var i=0;i<shapesInChart.length;i++) {
			if(typeof shapesInChart[i].shape == "string")shape=shapesInChart[i].shape.toUpperCase()
			else shape= drawShape_default.shape.toUpperCase();
			if (shape=="IMAGE"){
				if(typeof shapesInChart[i].loadImage == "undefined") {
					shapesInChart[i].loadImage=new Image();
					var imagesrc = drawShapeSetValue(shapesInChart[i].imagesrc,drawShape_default.imagesrc);
					if (imagesrc=="") shapesInChart[i].loadImage='data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw==';
					else shapesInChart[i].loadImage.src=imagesrc;
				}
			}

		}	
	
		for(var i=0;i<shapesInChart.length;i++) {

			if(typeof othervars.config.dispShapesInChart == "object") {
				if (othervars.config.dispShapesInChart.indexOf(i)<0) continue;
			} else if (othervars.config.dispShapesInChart == false) {continue;}
			whendrw=drawShapeSetValue(shapesInChart[i].when,drawShape_default.when).toUpperCase();
			if (whendrw != "ALWAYS" && whendrw != area) { continue;}
			iter=drawShapeSetValue(shapesInChart[i].iter,drawShape_default.iter.toUpperCase());
			if (typeof iter=="number" && iter != othervars.cntiter && othervars.config.animation==true) {continue;}
			if (iter==="first" && othervars.cntiter != 1 && othervars.config.animation==true) {continue;}
			if (iter==="last" && othervars.cntiter != othervars.config.animationSteps && othervars.config.animation==true) {continue;}
			if(typeof shapesInChart[i].shape == "function")shape= shapesInChart[i].shape;
			else if(typeof shapesInChart[i].shape != "string")shape= drawShape_default.shape.toUpperCase();
			else shape=shapesInChart[i].shape.toUpperCase();

			if(othervars.config.animation && drawShapeSetValue(shapesInChart[i].animate,drawShape_default.animate)) realAnimation=othervars.animationValue;
			else realAnimation=1;
			ctx.save();
			switch(shape) {
				case "LINE" :
					var vright, vleft, vtop, vbottom, tmp;
					vright= 1*drawShapeSetValue(shapesInChart[i].x2,drawShape_default.x2);
					vleft= 1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1);
					vtop= 1*drawShapeSetValue(shapesInChart[i].y2,drawShape_default.y2);
					vbottom= 1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1);
					if (vright<vleft){
						tmp=vright;vright=vleft;vleft=tmp;
						tmp=vtop;vtop=vbottom;vbottom=tmp;
					}

					ctx.beginPath();
					var xypos1=setXYpos(shape,"","","",ctx,data,statData,othervars,vright,vtop,1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					var xypos2=setXYpos(shape,"","","",ctx,data,statData,othervars,vleft,vbottom,1*drawShapeSetValue(shapesInChart[i].paddingX2,drawShape_default.paddingX2),1*drawShapeSetValue(shapesInChart[i].paddingY2,drawShape_default.paddingY2),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					if(Math.abs(xypos1.xpos-xypos2.xpos) < othervars.config.zeroValue) { // vertical line;
						vright=xypos1.xpos;
						vleft=xypos2.xpos;
						vbottom=xypos1.ypos + (1-realAnimation)*(xypos2.ypos-xypos1.ypos)/2;
						vtop=xypos2.ypos - (1-realAnimation)*(xypos2.ypos-xypos1.ypos)/2 ;
					} else { // non vertical line;
						// compute line function;
						var a=(xypos1.ypos-xypos2.ypos)/(xypos1.xpos-xypos2.xpos);
						var b=xypos1.ypos-a*xypos1.xpos;
						vright=xypos2.xpos - (1-realAnimation)*(xypos2.xpos-xypos1.xpos)/2;
						vleft =xypos1.xpos + (1-realAnimation)*(xypos2.xpos-xypos1.xpos)/2;
						vtop=a*vright+b;
						vbottom=a*vleft+b;
					}
					ctx.moveTo(vright, vtop);
					ctx.lineTo(vleft, vbottom);
					ctx.lineWidth = Math.ceil(ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].strokeSize,drawShape_default.strokeSize));
					ctx.strokeStyle = drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
					ctx.setLineDash(lineStyleFn(drawShapeSetValue(shapesInChart[i].strokeStyle,drawShape_default.strokeStyle)));	
					ctx.stroke();
					ctx.setLineDash([]);
					break;
				case "ARROW" :
					var vright, vleft, vtop, vbottom, tmp;
					var arrowtx1,arrowtx2,arrowty1,arrowty2;
					var arrowbx1,arrowbx2,arrowby1,arrowby2;
					vright= 1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1);
					vleft= 1*drawShapeSetValue(shapesInChart[i].x2,drawShape_default.x2);
					vtop= 1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1);
					vbottom= 1*drawShapeSetValue(shapesInChart[i].y2,drawShape_default.y2);

					ctx.beginPath();
					var xypos1=setXYpos(shape,"","","",ctx,data,statData,othervars,vright,vtop,1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					var xypos2=setXYpos(shape,"","","",ctx,data,statData,othervars,vleft,vbottom,1*drawShapeSetValue(shapesInChart[i].paddingX2,drawShape_default.paddingX2),1*drawShapeSetValue(shapesInChart[i].paddingY2,drawShape_default.paddingY2),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					var arrowWidth=realAnimation*1*drawShapeSetValue(shapesInChart[i].arrowWidth,drawShape_default.arrowWidth) ;
					var arrowHeight=realAnimation*1*drawShapeSetValue(shapesInChart[i].arrowHeight,drawShape_default.arrowHeight);

					if(Math.abs(xypos1.xpos-xypos2.xpos) < othervars.config.zeroValue) { // vertical line;
						vright=xypos1.xpos;
						vleft=xypos2.xpos;
						vbottom=xypos1.ypos ;
						vtop=xypos2.ypos - (1-realAnimation)*(xypos2.ypos-xypos1.ypos);
						if(vbottom>vtop)fact=1;else fact=-1;
						arrowby1=vbottom-fact*arrowHeight;
						arrowby2=arrowby1;
						arrowty1=vtop+fact*arrowHeight;
						arrowty2=arrowty1;
						arrowbx1=vright-arrowWidth/2;
						arrowbx2=vright+arrowWidth/2;
						arrowtx1=arrowbx1;
						arrowtx2=arrowbx2;
					} else { // non vertical line;
						// compute line function;
						var a=(xypos1.ypos-xypos2.ypos)/(xypos1.xpos-xypos2.xpos);
						var b=xypos1.ypos-a*xypos1.xpos;
						vright=xypos2.xpos - (1-realAnimation)*(xypos2.xpos-xypos1.xpos);
						vleft =xypos1.xpos ;
						vtop=a*vright+b;
						vbottom=a*vleft+b;
						if(Math.abs(vtop-vbottom) < othervars.config.zeroValue) { // Horizontal Arrow;
							var fact;
							if(vleft<vright)fact=1;else fact=-1;
							arrowby1=vbottom-arrowWidth/2;
							arrowby2=vbottom+arrowWidth/2;
							arrowbx1=vleft+fact*arrowHeight;
							arrowbx2=arrowbx1;
							arrowty1=arrowby1;
							arrowty2=arrowby2;
							arrowtx1=vright-fact*arrowHeight;
							arrowtx2=arrowtx1;
						
						} else {
							var fact;
							if(vleft<vright)fact=1;else fact=-1;
							var crossptx=vleft+fact*arrowHeight*Math.cos(Math.atan(a));
							var crosspty=a*crossptx+b;
							var bprim=crosspty+(1/a)*crossptx;
							arrowbx1=crossptx-(arrowWidth/2)*(Math.cos(Math.atan(-1/a)));
							arrowbx2=crossptx+(arrowWidth/2)*(Math.cos(Math.atan(-1/a)));
							arrowby1=(-1/a)*arrowbx1+bprim;
							arrowby2=(-1/a)*arrowbx2+bprim;
							crossptx=vright-fact*arrowHeight*Math.cos(Math.atan(a));
							crosspty=a*crossptx+b;
							bprim=crosspty+(1/a)*crossptx;
							arrowtx1=crossptx-(arrowWidth/2)*(Math.cos(Math.atan(-1/a)));
							arrowtx2=crossptx+(arrowWidth/2)*(Math.cos(Math.atan(-1/a)));
							arrowty1=(-1/a)*arrowtx1+bprim;
							arrowty2=(-1/a)*arrowtx2+bprim;
							
						}
						var crossptx=vleft+arrowHeight*Math.cos(Math.atan(a));
						var crosspty=a*crossptx+b;
						var bprim=crosspty+(1/a)
						
					}
					ctx.moveTo(vright, vtop);
					ctx.lineTo(vleft, vbottom);
					ctx.lineWidth = Math.ceil(ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].strokeSize,drawShape_default.strokeSize));
					ctx.strokeStyle = drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
					ctx.setLineDash(lineStyleFn(drawShapeSetValue(shapesInChart[i].strokeStyle,drawShape_default.strokeStyle)));	
					ctx.stroke();
					
					ctx.restore();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].strokeSize,drawShape_default.strokeSize));
					ctx.setLineDash([]);

					if(drawShapeSetValue(shapesInChart[i].arrowTop,drawShape_default.arrowTop)) {
						ctx.moveTo(vright, vtop);
						ctx.lineTo(arrowtx1, arrowty1);
						ctx.lineTo(arrowtx2, arrowty2);
						ctx.lineTo(vright,vtop);
						ctx.stroke();
						ctx.closePath();
						ctx.fillStyle=drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
						ctx.fill();
					}
					if(drawShapeSetValue(shapesInChart[i].arrowBottom,drawShape_default.arrowBottom)) {
						ctx.moveTo(vleft, vbottom);
						ctx.lineTo(arrowbx1, arrowby1);
						ctx.lineTo(arrowbx2, arrowby2);
						ctx.lineTo(vleft,vbottom);
						ctx.stroke();
						ctx.closePath();
						ctx.fillStyle=drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
						ctx.fill();
					}
					ctx.setLineDash([]);
					break;
				case "TEXT" :
					ctx.beginPath();
					var vx, vy, text;
					vx= 1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1);
					vy= 1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1);
					text= drawShapeSetValue(shapesInChart[i].text,drawShape_default.text);
					if(typeof text=="function") {
						text=text(i, null, ctx, othervars.config, vx, vy, othervars.borderX, othervars.borderY, true, data, othervars.animationValue,othervars);
					}
					var xypos1=setXYpos(shape,"","","",ctx,data,statData,othervars,vx,vy,1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					ctx.translate(xypos1.xpos, xypos1.ypos);
					var fontSize=realAnimation*drawShapeSetValue(shapesInChart[i].fontSize,drawShape_default.fontSize);
					ctx.font = drawShapeSetValue(shapesInChart[i].fontStyle,drawShape_default.fontStyle) + " " + (Math.ceil(ctx.chartTextScale*fontSize)).toString() + "px " + drawShapeSetValue(shapesInChart[i].fontFamily,drawShape_default.fontFamily);
					ctx.fillStyle = drawShapeSetValue(shapesInChart[i].fontColor,drawShape_default.fontColor);
					ctx.textAlign = drawShapeSetValue(shapesInChart[i].textAlign,drawShape_default.textAlign);
					ctx.textBaseline = drawShapeSetValue(shapesInChart[i].textBaseline,drawShape_default.textBaseline);
					var rotateVal=Math.PI * 1*drawShapeSetValue(shapesInChart[i].rotate,drawShape_default.rotate) / 180;
					ctx.rotate(rotateVal);
					setTextBordersAndBackground(ctx,text,Math.ceil(ctx.chartTextScale*fontSize),0,0,drawShapeSetValue(shapesInChart[i].textBorders,drawShape_default.textBorders),drawShapeSetValue(shapesInChart[i].textBordersColor,drawShape_default.textBordersColor),Math.ceil((realAnimation)*ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].textBordersWidth,drawShape_default.textBordersWidth)),Math.ceil(ctx.chartSpaceScale*drawShapeSetValue(shapesInChart[i].textBordersXSpace,drawShape_default.textBordersXSpace)),Math.ceil(ctx.chartSpaceScale*drawShapeSetValue(shapesInChart[i].textBordersYSpace,drawShape_default.textBordersYSpace)),drawShapeSetValue(shapesInChart[i].textBordersStyle,drawShape_default.textBordersStyle),drawShapeSetValue(shapesInChart[i].textBackgroundColor,drawShape_default.textBackgroundColor),"TEXTINSHAPE");
					if (iter !=="all" || (iter === "all" && othervars.cntiter != othervars.config.animationSteps) || othervars.config.animation==false) {
					       ctx.fillTextMultiLine(text, 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale*fontSize),true,othervars.config.detectMouseOnText,ctx,"SHAPESINCHART_TEXTMOUSE",rotateVal,xypos1.xpos, xypos1.ypos,-1,-1);
					} else ctx.fillTextMultiLine(text, 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale*fontSize),true,false,ctx,"SHAPESINCHART_TEXTMOUSE",rotateVal,xypos1.xpos, xypos1.ypos,-1,-1);
					break;
				case "IMAGE" :
					var imageAlign = drawShapeSetValue(shapesInChart[i].imageAlign,drawShape_default.imageAlign);
					var imageBaseline = drawShapeSetValue(shapesInChart[i].imageBaseline,drawShape_default.imageBaseline);
					var vx, vy, text;
					vx= 1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1);
					vy= 1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1);
					var xypos1=setXYpos(shape,imageAlign,imageBaseline,shapesInChart[i].loadImage,ctx,data,statData,othervars,vx,vy,1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					ctx.translate(xypos1.xpos, xypos1.ypos);
					var rotateVal=Math.PI * 1*drawShapeSetValue(shapesInChart[i].rotate,drawShape_default.rotate) / 180;
					ctx.rotate(rotateVal);
					ctx.drawImage(shapesInChart[i].loadImage, 0, 0);
					break;
				case "STAR" :
				case "PLUS" :
				case "CROSS" :
					var vxs1,vys1,vxs2,vys2,lineCount,angle,vx,vy,vx2,vy2;
					var angle     = (Math.PI*(1*drawShapeSetValue(shapesInChart[i].rotate,drawShape_default.rotate)-90)/180);
					switch(shape) {
						case "PLUS" :
							lineCount=2;
							break;
						case "CROSS" :
							lineCount=2;
							angle+=Math.PI/4;
							break;
						default: 
							lineCount = 1*drawShapeSetValue(shapesInChart[i].lineCount,drawShape_default.lineCount);
							if (lineCount<2)lineCount=2;
							break;
					}
					var angleplus = Math.PI/lineCount;
					vx= 1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1);
					vy= 1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1);
					var radius    = realAnimation*1*drawShapeSetValue(shapesInChart[i].radius,drawShape_default.radius);
					if (radius < 0) {
						var xypos2=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x2,drawShape_default.x2),1*drawShapeSetValue(shapesInChart[i].y2,drawShape_default.y2),1*drawShapeSetValue(shapesInChart[i].paddingX2,drawShape_default.paddingX2),1*drawShapeSetValue(shapesInChart[i].paddingY2,drawShape_default.paddingY2),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
						radius=Math.sqrt(((xypos.xpos-xypos2.xpos)*(xypos.xpos-xypos2.xpos))+((xypos.ypos-xypos2.ypos)*(xypos.ypos-xypos2.ypos)));
					}
					var xypos1=setXYpos(shape,"","","",ctx,data,statData,othervars,vx,vy,1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					ctx.beginPath();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].strokeSize,drawShape_default.strokeSize));
					ctx.strokeStyle = drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
					ctx.setLineDash(lineStyleFn(drawShapeSetValue(shapesInChart[i].strokeStyle,drawShape_default.strokeStyle)));	
					for(var j=0;j<lineCount;j++) {
						vxs1=xypos1.xpos+radius*Math.cos(angle);
						vys1=xypos1.ypos+radius*Math.sin(angle);
						vxs2=xypos1.xpos-radius*Math.cos(angle);
						vys2=xypos1.ypos-radius*Math.sin(angle);
						angle+=angleplus;
						ctx.moveTo(vxs1,vys1);
						ctx.lineTo(vxs2,vys2);
						ctx.stroke();
					}					
					ctx.setLineDash([]);
					break;
				case "REGULARSHAPE" :
				case "TRIANGLE" :
				case "SQUARE" :
				case "DIAMOND" :
					var vxs,vys,sideCount,angle;
					var angle     = (Math.PI*(1*drawShapeSetValue(shapesInChart[i].rotate,drawShape_default.rotate)-90)/180);
					switch(shape) {
						case "TRIANGLE" :
							sideCount=3;
							break;
						case "SQUARE" :
							sideCount=4;
							angle+=Math.PI/4;
							break;
						case "DIAMOND" :
							sideCount=4;
							break;
						default: 
							sideCount = 1*drawShapeSetValue(shapesInChart[i].sideCount,drawShape_default.sideCount);
							if (sideCount<3)sideCount=3;
							break;
					}
					var angleplus = 2*Math.PI/sideCount;
					vx= 1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1);
					vy= 1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1);
					var xypos1=setXYpos(shape,"","","",ctx,data,statData,othervars,vx,vy,1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					var radius    = realAnimation*1*drawShapeSetValue(shapesInChart[i].radius,drawShape_default.radius);
					if (radius < 0) {
						var xypos2=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x2,drawShape_default.x2),1*drawShapeSetValue(shapesInChart[i].y2,drawShape_default.y2),1*drawShapeSetValue(shapesInChart[i].paddingX2,drawShape_default.paddingX2),1*drawShapeSetValue(shapesInChart[i].paddingY2,drawShape_default.paddingY2),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
						radius=Math.sqrt(((xypos.xpos-xypos2.xpos)*(xypos.xpos-xypos2.xpos))+((xypos.ypos-xypos2.ypos)*(xypos.ypos-xypos2.ypos)));
					}
					ctx.beginPath();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].strokeSize,drawShape_default.strokeSize));
					ctx.strokeStyle = drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
					ctx.setLineDash(lineStyleFn(drawShapeSetValue(shapesInChart[i].strokeStyle,drawShape_default.strokeStyle)));	
					for(var j=0;j<sideCount;j++) {
						vxs=xypos1.xpos+radius*Math.cos(angle);
						vys=xypos1.ypos+radius*Math.sin(angle);
						angle+=angleplus;
						if(j==0) ctx.moveTo(vxs,vys);
						else     ctx.lineTo(vxs,vys);
					}					
					ctx.closePath();
					ctx.fillStyle=drawShapeSetValue(shapesInChart[i].fillColor,drawShape_default.fillColor);
					ctx.fill();
					ctx.stroke();
					ctx.setLineDash([]);
					break;					
				case "ELLIPSE" :
					ctx.beginPath();
					var xypos=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1),1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1),1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					var height=realAnimation*1*drawShapeSetValue(shapesInChart[i].ellipseHeight,drawShape_default.ellipseHeight);
					var width= realAnimation*1*drawShapeSetValue(shapesInChart[i].ellipseWidth,drawShape_default.ellipseWidth);
					ctx.moveTo(xypos.xpos, xypos.ypos - height/2); // A1
					ctx.bezierCurveTo(
    						xypos.xpos + width/2, xypos.ypos - height/2, // C1
    						xypos.xpos + width/2, xypos.ypos + height/2, // C2
    						xypos.xpos, xypos.ypos + height/2); // A2
					ctx.bezierCurveTo(
						xypos.xpos - width/2, xypos.ypos + height/2, // C3
						xypos.xpos - width/2, xypos.ypos - height/2, // C4
						xypos.xpos, xypos.ypos - height/2); // A1
					ctx.closePath();
					ctx.fillStyle=drawShapeSetValue(shapesInChart[i].fillColor,drawShape_default.fillColor);
					ctx.fill();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].strokeSize,drawShape_default.strokeSize));
					ctx.strokeStyle = drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
					ctx.setLineDash(lineStyleFn(drawShapeSetValue(shapesInChart[i].strokeStyle,drawShape_default.strokeStyle)));	
					ctx.stroke();
					ctx.setLineDash([]);
					break;
				case "RECTANGLE" :
	
					var vright, vleft, vtop, vbottom, tmp;
					vright= 1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1);
					vleft= 1*drawShapeSetValue(shapesInChart[i].x2,drawShape_default.x2);
					vtop= 1*drawShapeSetValue(shapesInChart[i].y2,drawShape_default.y2);
					vbottom= 1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1);
					ctx.beginPath();

					var xypos1=setXYpos(shape,"","","",ctx,data,statData,othervars,vleft,vtop,1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					var xypos2=setXYpos(shape,"","","",ctx,data,statData,othervars,vright,vbottom,1*drawShapeSetValue(shapesInChart[i].paddingX2,drawShape_default.paddingX2),1*drawShapeSetValue(shapesInChart[i].paddingY2,drawShape_default.paddingY2),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));

					if (xypos2.xpos<xypos1.xpos){tmp=xypos2.xpos;xypos2.xpos=xypos1.xpos;xypos1.xpos=tmp;}
					if (xypos2.ypos<xypos1.ypos){tmp=xypos2.ypos;xypos2.ypos=xypos1.ypos;xypos1.ypos=tmp;}

					ctx.moveTo(xypos1.xpos+(1-realAnimation)*((xypos2.xpos-xypos1.xpos)/2), xypos1.ypos+(1-realAnimation)*((xypos2.ypos-xypos1.ypos)/2));
					ctx.lineTo(xypos1.xpos+(1-realAnimation)*((xypos2.xpos-xypos1.xpos)/2), xypos2.ypos-(1-realAnimation)*((xypos2.ypos-xypos1.ypos)/2));
					ctx.lineTo(xypos2.xpos-(1-realAnimation)*((xypos2.xpos-xypos1.xpos)/2), xypos2.ypos-(1-realAnimation)*((xypos2.ypos-xypos1.ypos)/2));
					ctx.lineTo(xypos2.xpos-(1-realAnimation)*((xypos2.xpos-xypos1.xpos)/2), xypos1.ypos+(1-realAnimation)*((xypos2.ypos-xypos1.ypos)/2));
	
					ctx.closePath();
					ctx.fillStyle=drawShapeSetValue(shapesInChart[i].fillColor,drawShape_default.fillColor);
					ctx.fill();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].strokeSize,drawShape_default.strokeSize));
					ctx.strokeStyle = drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
					ctx.setLineDash(lineStyleFn(drawShapeSetValue(shapesInChart[i].strokeStyle,drawShape_default.strokeStyle)));	
					ctx.stroke();
					ctx.setLineDash([]);
					break;
				case "MYSHAPE" :
					var xpos,ypos,xypos1;
					ctx.beginPath();

					if(typeof shapesInChart[i].shapePoints !== "object") break;
					if(shapesInChart[i].shapePoints.length <3) break;
					
					for(var j=0;j<shapesInChart[i].shapePoints.length;j++) {
						xpos=drawShapeSetValue(shapesInChart[i].shapePoints[j][0],drawShape_default.x1);
						ypos=drawShapeSetValue(shapesInChart[i].shapePoints[j][1],drawShape_default.y1);
						xypos1=setXYpos(shape,"","","",ctx,data,statData,othervars,xpos,ypos,1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
						if(j==0) ctx.moveTo(xypos1.xpos,xypos1.ypos);
						else ctx.lineTo(xypos1.xpos,xypos1.ypos);
					} 					
					ctx.closePath();
					ctx.fillStyle=drawShapeSetValue(shapesInChart[i].fillColor,drawShape_default.fillColor);
					ctx.fill();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].strokeSize,drawShape_default.strokeSize));
					ctx.strokeStyle = drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
					ctx.setLineDash(lineStyleFn(drawShapeSetValue(shapesInChart[i].strokeStyle,drawShape_default.strokeStyle)));	
					ctx.stroke();
					ctx.setLineDash([]);
					break;
				case "CIRCLE" :
					ctx.beginPath();
					var xypos=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1),1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1),1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					var radius    = realAnimation*1*drawShapeSetValue(shapesInChart[i].radius,drawShape_default.radius);
					if (radius < 0) {
						var xypos2=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x2,drawShape_default.x2),1*drawShapeSetValue(shapesInChart[i].y2,drawShape_default.y2),1*drawShapeSetValue(shapesInChart[i].paddingX2,drawShape_default.paddingX2),1*drawShapeSetValue(shapesInChart[i].paddingY2,drawShape_default.paddingY2),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
						radius=Math.sqrt(((xypos.xpos-xypos2.xpos)*(xypos.xpos-xypos2.xpos))+((xypos.ypos-xypos2.ypos)*(xypos.ypos-xypos2.ypos)));
					}
					var xypos=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1),1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1),1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
					if (1*drawShapeSetValue(shapesInChart[i].endAngle,drawShape_default.endAngle)-1*drawShapeSetValue(shapesInChart[i].startAngle,drawShape_default.startAngle) !=  360)
						ctx.arc(xypos.xpos,xypos.ypos, 0, (Math.PI/180)*1*drawShapeSetValue(shapesInChart[i].startAngle,drawShape_default.startAngle), (Math.PI/180)*1*drawShapeSetValue(shapesInChart[i].endAngle,drawShape_default.endAngle),false);
					ctx.arc(xypos.xpos,xypos.ypos, realAnimation*1*radius, (Math.PI/180)*1*drawShapeSetValue(shapesInChart[i].startAngle,drawShape_default.startAngle), (Math.PI/180)*1*drawShapeSetValue(shapesInChart[i].endAngle,drawShape_default.endAngle),true);
					ctx.closePath();
					ctx.fillStyle=drawShapeSetValue(shapesInChart[i].fillColor,drawShape_default.fillColor);
					ctx.fill();
					ctx.lineWidth = Math.ceil(ctx.chartLineScale*drawShapeSetValue(shapesInChart[i].strokeSize,drawShape_default.strokeSize));
					ctx.strokeStyle = drawShapeSetValue(shapesInChart[i].strokeColor,drawShape_default.strokeColor);
					ctx.setLineDash(lineStyleFn(drawShapeSetValue(shapesInChart[i].strokeStyle,drawShape_default.strokeStyle)));	
					ctx.stroke();
					ctx.setLineDash([]);
					break;
				default : 
					if(typeof shapesInChart[i].shape == "function"){
						othervars.currentShape=i;
						othervars.shapesInChart=shapesInChart[i];
						othervars.xypos1=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x1,drawShape_default.x1),1*drawShapeSetValue(shapesInChart[i].y1,drawShape_default.y1),1*drawShapeSetValue(shapesInChart[i].paddingX1,drawShape_default.paddingX1),1*drawShapeSetValue(shapesInChart[i].paddingY1,drawShape_default.paddingY1),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
						othervars.xypos2=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x2,drawShape_default.x2),1*drawShapeSetValue(shapesInChart[i].y2,drawShape_default.y2),1*drawShapeSetValue(shapesInChart[i].paddingX2,drawShape_default.paddingX2),1*drawShapeSetValue(shapesInChart[i].paddingY2,drawShape_default.paddingY2),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
						othervars.xypos3=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x3,drawShape_default.x3),1*drawShapeSetValue(shapesInChart[i].y3,drawShape_default.y3),1*drawShapeSetValue(shapesInChart[i].paddingX3,drawShape_default.paddingX3),1*drawShapeSetValue(shapesInChart[i].paddingY3,drawShape_default.paddingY3),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
						othervars.xypos4=setXYpos(shape,"","","",ctx,data,statData,othervars,1*drawShapeSetValue(shapesInChart[i].x4,drawShape_default.x4),1*drawShapeSetValue(shapesInChart[i].y4,drawShape_default.y4),1*drawShapeSetValue(shapesInChart[i].paddingX4,drawShape_default.paddingX4),1*drawShapeSetValue(shapesInChart[i].paddingY4,drawShape_default.paddingY4),drawShapeSetValue(shapesInChart[i].limitToChart,drawShape_default.limitToChart));
						shapesInChart[i].shape(area, ctx, data,statData, posi,posj,othervars);
					}
					break;
			}
			ctx.restore();
		}
	}
	
	function setXYpos(shape,imageAlign,imageBaseline,image,ctx,data,statData,othervars,xposval,yposval,paddingX1,paddingY1,limitToChart) {
		var xpos, ypos, position;
		if(typeof shapesInChart[i].position != "string")position= drawShape_default.position.toUpperCase();
		else position=shapesInChart[i].position.toUpperCase();
		switch(position) {
			case "RELATIVE" :
				xpos = paddingX1;
				ypos = paddingY1;
				switch (xposval) {
					case 0:
						break;
					case 1:
						xpos += othervars.borderX;
						break;
					case 2:
						xpos += othervars.midPosX;
						break;
					case -2:
						xpos += ctx.canvas.width / 2;
						break;
					case 3:
						xpos += xpos + 2 * othervars.midPosX - othervars.borderX;
						break;
					case 4:
						xpos += ctx.canvas.width;
						break;
					default:
						xpos += othervars.midPosX;
						break;
				}
				switch (yposval) {
					case 0:
						break;
					case 3:
						ypos += othervars.borderY;
						break;
					case 2:
						ypos += othervars.midPosY;
						break;
					case -2:
						ypos += ctx.canvas.height / 2;
						break;
					case 1:
						ypos += ypos + 2 * othervars.midPosY - othervars.borderY;
						break;
					case 4:
						ypos += ctx.canvas.height;
						break;
					default:
						ypos += othervars.midPosY;
						break;
				}
				break;
			case "INCHART" :
				switch(ctx.tpdata) {
					case 0 :
						switch(tpdraw(ctx,data.datasets[0])) {
							case "Radar" :
								var angle=((2*Math.PI)/(data.labels.length))*xposval;
								ypos=calculateOffset(othervars.config.logarithmic, yposval, statData[0][0].calculatedScale, statData[0][0].scaleHop,limitToChart);
								xpos=Math.cos(othervars.config.startAngle * Math.PI / 180 - angle) * ypos;
								ypos=Math.sin(othervars.config.startAngle * Math.PI / 180 - angle) * ypos;
								xpos=statData[0][0].midPosX + xpos+paddingX1;
								ypos=statData[0][0].midPosY - ypos+paddingY1;
								break;
							case "Line" :

								ypos= calculateOffset(statData[0][0].logarithmic, yposval, statData[0][0].calculatedScale, statData[0][0].scaleHop,limitToChart) - statData[0][0].zeroY;
								ypos=statData[0][0].yAxisPos - ypos+paddingY1;
								var xposval_wk=xposval;
								if(limitToChart){
									if (xposval_wk<0)xposval_wk=0;
									if (xposval_wk>statData[0][0].nbValueHop)xposval_wk=statData[0][0].nbValueHop;
								}
								xpos=statData[0][0].yAxisPosX + (statData[0][0].valueHop * xposval_wk)+paddingX1;
								break;
							case "Bar" :
							case "StackedBar" :
								ypos = statData[0][0].xAxisPosY - calculateOffset(othervars.config.logarithmic, yposval , statData[0][0].calculatedScale, statData[0][0].scaleHop,limitToChart)+paddingY1;
								var xposval_wk=xposval;
								if(limitToChart){
									if (xposval_wk<-0.5)xposval_wk=-0.5;
									if (xposval_wk>data.labels.length-0.5)xposval_wk=data.labels.length-0.5;
								}
								xpos = statData[0][0].yAxisPosX + statData[0][0].valueHop * (xposval_wk+0.5)+paddingX1;
								break;
							case "HorizontalStackedBar" :
							case "HorizontalBar" :
								xpos = statData[0][0].yAxisPosX + calculateOffset(othervars.config.logarithmic, xposval , statData[0][0].calculatedScale, statData[0][0].valueHop,limitToChart)+paddingX1;
								var xposval_wk=yposval;
								if(limitToChart){
									if (xposval_wk<-0.5)xposval_wk=-0.5;
									if (xposval_wk>data.labels.length-0.5)xposval_wk=data.labels.length-0.5;
								}
								ypos = statData[0][0].xAxisPosY - statData[0][0].scaleHop * (xposval_wk+0.5)+paddingY1;
								break;
		        				default :
								xpos=xposval+paddingX1;
								ypos=yposval+paddingY1;
								break;
						}
						break;
					case 1: 
						switch(ctx.tpchart) {
							case "Pie" :
							case "Doughnut" :
							case "PolarArea" :
								if(xposval < -0.499)xpos=-0.499;
								else if(xposval > data.length-0.501) xpos=data.length-0.501;
								else xpos=xposval;
								var curdata=Math.round(xpos);
								var startAngle=statData[curdata].startAngle;
								var segmentAngle=statData[curdata].segmentAngle;
								var firstAngle=statData[curdata].firstAngle;
								var realStartAngle=statData[curdata].realStartAngle;
								var endAngle=statData[curdata].endAngle;
								var angle=2*Math.PI-(startAngle+(xpos-curdata+0.5)*segmentAngle);
								if(ctx.tpchart=="PolarArea")
									ypos= calculateOffset(othervars.config.logarithmic, yposval, statData[0].calculatedScale, statData[0].scaleHop);
								else {
									ypos=statData[0].int_radius+yposval*(statData[0].ext_radius-statData[0].int_radius);
								}
								if(limitToChart){
									if (ypos<-statData[0].ext_radius)ypos=-statData[0].ext_radius;
									if (ypos>statData[0].ext_radius)ypos=statData[0].ext_radius;
								} 
								xpos=Math.cos(angle) * ypos;
								ypos=Math.sin(angle) * ypos;
								xpos=statData[0].midPosX + xpos+paddingX1;
								ypos=statData[0].midPosY - ypos+paddingY1;
								break;
		        				default :
								xpos=xposval+paddingX1;
								ypos=yposval+paddingY1;
								break;
						}
						break;
        				default :
						xpos=xposval+paddingX1;
						ypos=yposval+paddingY1;
						break;
					}
					break;
			case "ABSOLUTE" :
			default:
				xpos=xposval+paddingX1;
				ypos=yposval+paddingY1;
				break;

		}
		if(shape="IMAGE") {
			var imageWidth = image.width;
			switch (imageAlign) {
				case "left":
					break;
				case "right":
					xpos -= imageWidth;
					break;
				case "center":
					xpos -= (imageWidth / 2);
					break;
				default:
					break;
			}
			var imageHeight = image.height;
			switch (imageBaseline) {
				case "top":
					break;
				case "bottom":
					ypos -= imageHeight;
					break;
				case "middle":
					ypos -= (imageHeight / 2);
					break;
				default:
					break;
			}
		}

		
		return {xpos:xpos,ypos:ypos};
	};
	
	function calculateOffset(logarithmic, val, calculatedScale, scaleHop,limitToChart) {
		if (!logarithmic) { // no logarithmic scale
			var outerValue = calculatedScale.steps * calculatedScale.stepValue;
			var adjustedValue = val - calculatedScale.graphMin;
			if(limitToChart) {
				var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
				return (scaleHop * calculatedScale.steps) * scalingFactor;
			} else 	return (scaleHop * calculatedScale.steps) * (adjustedValue/outerValue);
		} else { // logarithmic scale
			return CapValue(log10(val) * scaleHop - log10(calculatedScale.graphMin) * scaleHop, undefined, 0);
		}
	};
	function CapValue(valueToCap, maxValue, minValue) {
		if (isNumber(maxValue)) {
			if (valueToCap > maxValue) {
				return maxValue;
			}
		}
		if (isNumber(minValue)) {
			if (valueToCap < minValue) {
				return minValue;
			}
		}
		return valueToCap;
	};

	function drawShapeSetValue(dataval,defval) {
		if(typeof dataval != "undefined") return dataval;
		else return defval;
	};	
	
	function xPos(iteration, data,yAxisPosX,valueHop,nbValueHop) {
		return yAxisPosX + (valueHop * iteration);
	};

};

