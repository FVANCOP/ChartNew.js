
var demo_common_options = {
	canvasBorders : true,
	canvasBordersWidth : 3,
	canvasBordersColor : "black",
	graphTitleFontFamily:"'Open Sans'",
	graphTitleFontStyle:"normal normal",
	graphTitleFontColor:"rgba(52,152,219,1)",
	graphTitleFontSize:26,
	graphSubTitleFontFamily:"'Open Sans'",
	graphSubTitleFontStyle:"normal normal",
	graphSubTitleFontColor:"rgba(102,102,102,1)",
	graphSubTitleFontSize:16,
	scaleFontFamily:"'Open Sans'",
	scaleFontStyle:"normal normal",
	scaleFontColor:"rgba(0,0,0,1)",
	scaleFontSize:12,

//	animation:false,

	legend : true,
	inGraphDataShow : true,
	responsive : true

};

//**************************************************

var mydata1 = {
	labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	datasets : [
		{
			fillColor :"rgba(37,116,168,0.6)",
			strokeColor : "rgba(37,116,168,1)",
			pointColor : "rgba(37,116,168,1)",
			markerShape :"circle",
			pointStrokeColor : "rgba(255,255,255,1.00)",
			data : [],
      			title : ""+((new Date().getFullYear())-1).toString()
		},
		{
			fillColor :"rgba(204,46,59,0.49)",
			strokeColor : "rgba(204,46,59,1)",
			pointColor : "rgba(204,46,59,1)",
			markerShape :"cross",
			pointStrokeColor : "black",
			data : [],
      			title : ""+((new Date().getFullYear())-2).toString()
		}
	]
};
for(var i=0;i<mydata1.labels.length;i++) {
	mydata1.datasets[0].data[i]=Math.floor(Math.random() * 200)-100;
	mydata1.datasets[1].data[i]=Math.floor(Math.random() * 200)-100;
};

var opts_mydata1 = {
	yAxisMinimumInterval: 20,
	xAxisLabel : "Month"
}

var opts_mydata1_horizontal = {
	yAxisMinimumInterval: 20,
	yAxisLabel : "Month"
}

//**************************************************

var mydata1P = {
	labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	datasets : [
		{
			fillColor :"rgba(37,116,168,0.6)",
			strokeColor : "rgba(37,116,168,1)",
			pointColor : "rgba(37,116,168,1)",
			markerShape :"circle",
			pointStrokeColor : "rgba(255,255,255,1.00)",
			data : [],
      			title : ""+((new Date().getFullYear())-1).toString()
		},
		{
			fillColor :"rgba(204,46,59,0.49)",
			strokeColor : "rgba(204,46,59,1)",
			pointColor : "rgba(204,46,59,1)",
			markerShape :"cross",
			pointStrokeColor : "black",
			data : [],
      			title : ""+((new Date().getFullYear())-2).toString()
		}
	]
};
for(var i=0;i<mydata1P.labels.length;i++) {
	mydata1P.datasets[0].data[i]=Math.floor(Math.random() * 100);
	mydata1P.datasets[1].data[i]=Math.floor(Math.random() * 100);
};

var opts_mydata1P = {
	yAxisMinimumInterval: 20
}

//**************************************************

var gauss_data = {
  labels : ["-3",-2,-1,"0",1,2,"3"],
  xBegin : -3,
  xEnd :  3,   
	datasets : [
		{
			strokeColor : "rgba(220,220,220,1)",
      			data : [],
      			xPos : [],
      			title : "Sinus"
		}
	]
};   
var gauss_var=1;
var gauss_mean=0;
            
var nbiter=400;
for(var i=0;i<nbiter;i++)
{
  gauss_data.datasets[0].xPos[i]=gauss_data.xBegin+i*(gauss_data.xEnd-gauss_data.xBegin)/nbiter;
  gauss_data.datasets[0].data[i]=(1/(gauss_var*Math.sqrt(2*Math.PI))) * Math.exp(-((gauss_data.datasets[0].xPos[i]-gauss_mean)*(gauss_data.datasets[0].xPos[i]-gauss_mean))/(2*gauss_var));
};  

var opts_gauss_data = {
	inGraphDataShow : false, 
	datasetFill : false, 
	pointDot :false, 
	animationSteps: 200, 
	animationEasing: "linear", 
        yAxisMinimumInterval : 0.02,
	animationLeftToRight : true
};

//**************************************************

var sinus_data = {
  labels : ["-2PI","-3PI/2","-PI","-PI/2","0","PI/2","PI","3PI/2","2PI"],
  xBegin : -4*Math.PI/2,
  xEnd :  4*Math.PI/2,   
	datasets : [
		{
			strokeColor : "rgba(220,220,220,1)",
      			data : [],
      			xPos : [],
      			title : "Sinus"
		}
	]
};               
var nbiter=400;
for(var i=0;i<nbiter;i++)
{
  sinus_data.datasets[0].xPos[i]=sinus_data.xBegin+i*(sinus_data.xEnd-sinus_data.xBegin)/nbiter;
  sinus_data.datasets[0].data[i]=Math.sin(sinus_data.datasets[0].xPos[i]);
};

var opts_sinus_data = {
	inGraphDataShow : false, 
      	datasetFill : false,
      	pointDot :false,
      	animationLeftToRight : true,
      	animationEasing: "linear",
      	drawXScaleLine: [{position:"0",lineWidth:1 }],
      	yAxisMinimumInterval : 0.1
};

//**************************************************

var nbiter=50;
var linktype1_data = {
	labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	xBegin : 0,
	xEnd : nbiter,
	datasets : [
		{
			fillColor :"rgba(37,116,168,0.6)",
			strokeColor : "rgba(37,116,168,1)",
			pointColor : "rgba(37,116,168,1)",
			markerShape :"circle",
			pointStrokeColor : "rgba(255,255,255,1.00)",
			linkType : 1,
			data : [],
			xPos : [],
      			title : ""+((new Date().getFullYear())-1).toString()
		}
	]
};
for(var i=0;i<=nbiter;i++)
{
  linktype1_data.datasets[0].xPos[i]=i;
  linktype1_data.datasets[0].data[i]=Math.floor(Math.random() * 100);
};

var opts_linktype1_data = {
	yAxisMinimumInterval: 10,
	inGraphDataRotate : -45,
	xAxisLabel : "Month"
}

//**************************************************

var nbiter=50;
var linktype2_data = {
	labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	xBegin : 0,
	xEnd : nbiter,
	datasets : [
		{
			fillColor :"rgba(37,116,168,0.6)",
			strokeColor : "rgba(37,116,168,1)",
			pointColor : "rgba(37,116,168,1)",
			markerShape :"circle",
			pointStrokeColor : "rgba(255,255,255,1.00)",
			linkType : 2,
			data : [],
			xPos : [],
      			title : ""+((new Date().getFullYear())-1).toString()
		}
	]
};
for(var i=0;i<=nbiter;i++)
{
  linktype2_data.datasets[0].xPos[i]=i;
  linktype2_data.datasets[0].data[i]=Math.floor(Math.random() * 100);
};

var opts_linktype2_data = {
	yAxisMinimumInterval: 10,
	inGraphDataShow : false,
	pointDot : false,
	animationSteps: 200, 
	animationEasing: "linear", 
	animationLeftToRight : true,
	xAxisLabel : "Month"
}


//**************************************************


var regr_plot = {
	labels : [0,5,10,15,20,25,30],
  	datasets : [
		{
			pointColor : "black",
			strokeColor : "rgba(0,0,0,0)",
			pointStrokeColor : "black",
			data : [12.1,25.3,7.9,9.1,31.3,28.1,24.5,19.8,27.1,25.6,18.9,16.8,23.2,10.1,13,15.5],
      			xPos : [12.2,14.5,13.1,4.2,25.7,28.6,27.3,20.5,23.1,26.9,15.2,17.1,19.4,7.6,8.5,11.3],
      			title : "points"
		},
		{
			pointColor : "rgba(0,0,0,0)",
			strokeColor : "red",
			pointStrokeColor : "rgba(0,0,0,0)",
			data : ["<%=#linear_regression_b0#%>",,,,,,"<%=#linear_regression_b0#+30*#linear_regression_b1#%>"],
      			title : "regression line"
		}
	]
};               

var opts_regr_plot = {
      canvasBorders : true,
      canvasBordersWidth : 3,
      canvasBordersColor : "black",
      datasetFill : false,
      graphTitle : "Regression line:  <%=roundToNumber(#linear_regression_b0#,-2)%>+<%=roundToNumber(#linear_regression_b1#,-2)%>*X",
      graphTitleFontSize: 18,
      graphMin : 0,
      yAxisMinimumInterval : 5,
      bezierCurve: false,
      inGraphDataShow : true,
      inGraphDataTmpl : "<%=(v1 == 'regression line' ? '' : '('+v2 + ';' + v3 + ')')%>",

};

stats(regr_plot,opts_regr_plot);

//**************************************************

var bars_and_lines = {
	labels : ["January","February","March","April","May","June"],
	datasets : [
		{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			data : [7,10,15,15,13,8],
      			title : "Europe"
		},
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			data : [10,13,12,15,8,15],
      			title : "North-America"
		},
		{
			fillColor : "rgba(187,151,205,0.5)",
			strokeColor : "rgba(187,151,205,1)",
			pointColor : "rgba(187,151,205,1)",
			pointStrokeColor : "#fff",
			data : [11,14,13,12,15,18],
      			title : "South-America"
		},
		{
			fillColor : "rgba(151,187,151,0.5)",
			strokeColor : "rgba(151,187,151,1)",
			pointColor : "rgba(151,187,151,1)",
			pointStrokeColor : "#fff",
			data : [12,16,10,5,7,11],
      			title : "Asia"
		},
		{
      			type : "Line",
			fillColor : "rgba(0,220,0,0.5)",
			strokeColor : "rgba(0,220,0,1)",
			pointColor : "rgba(0,220,0,1)",
			pointStrokeColor : "#fff",
			data : [10,13.25,12.5,11.75,10.75,13],
      			title : "Mean Value of the month"
		},
		{
      			type : "Line",
			fillColor : "rgba(0,0,220,0.5)",
			strokeColor : "rgba(0,0,220,1)",
			pointColor : "rgba(0,0,220,1)",
			pointStrokeColor : "#fff",
			data : [9.70,14,12,11,10.2,14],
      			title : "Mean same month last year"
		}
	]
}

var opts_bars_and_lines = {
      yAxisMinimumInterval : 1,
      inGraphDataShow : false,
      barValueSpacing : 30
}

//**************************************************

var stackedBars_with_line = {
	labels : ["Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sep","Oct","Nov","Dec"],
	datasets : [
		{
			fillColor : "blue",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			data : [100,200,400,2000,4000,16000,20000,32000,45000,85000,95000,115000],
      			title : "previous Month"
		},
		{
			fillColor : "red",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			data : [100,200,1600,2000,12000,4000,12000,13000,40000,10000,20000,17000],
      			title : "current month"
		},
		{
			type : "Line",
//			fillColor : "rgba(0,0,0,0)",
			strokeColor : "green",
			pointColor : "green",
			pointStrokeColor : "green",
			data : [200,400,2000,4000,16000,20000,32000,45000,85000,95000,115000,132000],
			title : "total"
		}
	]
}




var opts_stackedBars_with_line = {

	datasetFill : false,
	inGraphDataShow : false,
	
	legendBlockSize : 30,
	bezierCurveTension : 0.2 ,
	legendPosX : 2,
	legendPosY : 0,
	graphMax : 160000,
	yAxisMinimumInterval : 40000,
	scaleXGridLinesStep : 9999
}

//**************************************************

var lines_with_shapes = {
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
		{
			strokeColor : "black",
			pointColor : "black",
			pointstrokeColor : "black",
			data : [16,20,13,21,23,18,15],
			title : "2015"
		},
		{
			strokeColor : "blue",
			pointColor : "blue",
			pointstrokeColor : "blue",
			data : [13,11,15,17,15,11,10],
      			title : "2014"
		}
	],
	shapesInChart : [
		{
			position : "INCHART",
			shape: "RECTANGLE",
			fillColor: "rgba(220,0,100,0.2)",
			strokeColor : "rgba(0,0,0,0)",
			animate : false,
			x1: -999,
			y1: "<%=#mean#-#standard_deviation#%>",
			x2: +999	,
			y2: -999
		},
		{
			position : "INCHART",
			shape: "RECTANGLE",
			fillColor: "rgba(220,100,200,0.2)",
			strokeColor : "rgba(0,0,0,0)",
			animate : false,
			x1: -999,
			y1: "<%=#mean#%>",
			x2: +999	,
			y2: "<%=#mean#-#standard_deviation#%>"
		},
		{
			position : "INCHART",
			shape: "RECTANGLE",
			fillColor: "rgba(120,0,100,0.2)",
			strokeColor : "rgba(0,0,0,0)",
			animate : false,
			x1: -999,
			y1: "<%=#mean#%>",
			x2: +999	,
			y2: "<%=#mean#+#standard_deviation#%>"
		},
		{
			position : "INCHART",
			shape: "RECTANGLE",
			fillColor: "rgba(120,100,200,0.2)",
			strokeColor : "rgba(0,0,0,0)",
			animate : false,
			x1: -999,
			y1: "<%=#mean#+#standard_deviation#%>",
			x2: +999	,
			y2: +999
		},
		{
			position : "INCHART",
			shape: "LINE",
			strokeStyle : "dashSpace",
			animate : false,
			x1: -999,
			y1: "<%=#mean#%>",
			x2: +999	,
			y2: "<%=#mean#%>"
		},
		{
			position : "INCHART",
			shape: "TEXT",
			text : "<%='Mean : '+roundToNumber(#mean#,-2)%>",
			textAlign : "left",
			textBaseline : "middle",
			fontColor : "black", 
			fontStyle : "italic",
			animate : false,
			x1: "<%=#COUNT_ALL#%>",
			iter : "first",
			y1: "<%=#mean#%>",
			paddingX1 : 20, 
			paddingY1 : 0
		},
		{
			position : "INCHART",
			shape: "TEXT",
			text : "<%='Mean+St.Dev:\n'+roundToNumber(#mean#+#standard_deviation#,-2)%>",
			textAlign : "left",
			textBaseline : "middle",
			fontColor : "black", 
			fontStyle : "italic",
			animate : false,
			x1: "<%=#COUNT_ALL#%>",
			iter : "first",
			y1: "<%=#mean#+#standard_deviation#%>",
			paddingX1 : 20, 
			paddingY1 : 0
		},
		{
			position : "INCHART",
			shape: "TEXT",
			text : "<%='Mean-St.Dev.:\n'+roundToNumber(#mean#-#standard_deviation#,-2)%>",
			textAlign : "left",
			textBaseline : "middle",
			fontColor : "black", 
			fontStyle : "italic",
			animate : false,
			x1: "<%=#COUNT_ALL#%>",
			iter : "first",
			y1: "<%=#mean#-#standard_deviation#%>",
			paddingX1 : 20, 
			paddingY1 : 0
		},
		{
			position : "INCHART",
			shape: "ARROW",
			x1: "<%=#MAXIMUMPJ#%>", 
			y1 : "<%=#MAXIMUM#%>",
			x2: "<%=#MAXIMUMPJ#%>", 
			y2 : "<%=#MAXIMUM#%>",
			paddingX1 : -60,
			paddingY1 : -60,
			paddingX2 : -5,
			paddingY2 : -5,
			iter : "last"
		},
		{
			position : "INCHART",
			shape: "TEXT",
			text : "Max.",
			textAlign : "left",
			textBaseline : "bottom",
			fontColor : "black", 
			fontSize : 18,
			animate : false,
			x1: "<%=#MAXIMUMPJ#%>", 
			y1 : "<%=#MAXIMUM#%>",
			rotate : 45,
			paddingX1 : -50,
			paddingY1 : -50,
			iter : "last"
		},
		{
			position : "INCHART",
			shape: "TEXT",
			text : "All lines",
			textAlign : "left",
			textBaseline : "bottom",
			fontColor : "black", 
			fontSize : 18,
			animate : false,
			x1: "<%=#MAXIMUMPJ#%>", 
			y1 : "<%=#MAXIMUM#%>",
			rotate : 45,
			paddingX1 : -78,
			paddingY1 : -50,
			iter : "last"
		},
		{
			position : "INCHART",
			shape: "ARROW",
			x1: "<%=#MINIMUMPJ#%>", 
			y1 : "<%=#MINIMUM#%>",
			x2: "<%=#MINIMUMPJ#%>", 
			y2 : "<%=#MINIMUM#%>",
			paddingX1 : -60,
			paddingY1 : +60,
			paddingX2 : -5,
			paddingY2 : +5,
			iter : "last"
		},
		{
			position : "INCHART",
			shape: "TEXT",
			text : "Min.",
			textAlign : "left",
			textBaseline : "bottom",
			fontColor : "black", 
			fontSize : 18,
			animate : false,
			x1: "<%=#MINIMUMPJ#%>", 
			y1 : "<%=#MINIMUM#%>",
			rotate : -45,
			paddingX1 : -50,
			paddingY1 : +50,
			iter : "last"
		},
		{
			position : "INCHART",
			shape: "TEXT",
			text : "All lines",
			textAlign : "left",
			textBaseline : "bottom",
			fontColor : "black", 
			fontSize : 18,
			animate : false,
			x1: "<%=#MINIMUMPJ#%>", 
			y1 : "<%=#MINIMUM#%>",
			rotate : -45,
			paddingX1 : -50,
			paddingY1 : +78,
			iter : "last"
		},
		{
			position : "RELATIVE",
			shape: "ELLIPSE",
			ellipseWidth : 500,
			ellipseHeight : 100,
			fillColor: "lightblue",
			strokeColor : "black",
			animate : false,
			x1: 2,
			y1: 3,
			paddingX1 : 0,
			paddingY1 : -70
		},
		{
			position : "RELATIVE",
			shape: "TEXT",
			text : "Demo ShapesInChart.js",
			textAlign : "center",
			textBaseline : "middle",
			fontColor : "black", 
			fontSize : 25,
			animate : false,
			x1: 2, 
			y1 : 3,
			paddingX1 : 0,
			paddingY1 : -70
		},
		{
			position : "INCHART",
			shape: "RECTANGLE",
			fillColor: "lightgreen",
			strokeColor : "black",
			animate : false,
			x1: 0,
			y1: 999,
			paddingX1 : 10,
			paddingY1 : 10,
			x2: 0,
			y2: 999 ,
			paddingX2 : 220,
			paddingY2 : 70
		},
		{
			position : "INCHART",
			shape: "REGULARSHAPE",
			sideCount : 6,
			strokeColor : "black", 
			fillColor : "black", 
			radius : 10, 
			animate : false,
			x1: 0, 
			y1 : 999,
			paddingX1 : 30,
			paddingY1 : 25, 
			iter : "ALL"
		},
		{
			position : "INCHART",
			shape: "TEXT",
			text : "Maximum for the line",
			textAlign : "left",
			textBaseline : "middle",
			fontColor : "black", 
			fontSize : 18,
			animate : false,
			x1: 0, 
			y1 : 999,
			paddingX1 : 45,
			paddingY1 : 25
		},
		{
			position : "INCHART",
			shape: "STAR",
			lineCount : 3,
			strokeColor : "black", 
			animate : false,
			x1: 0, 
			y1 : 999,
			paddingX1 : 30,
			paddingY1 : 50, 
			iter : "ALL"
		},
		{
			position : "INCHART",
			shape: "TEXT",
			text : "Minimum for the line",
			textAlign : "left",
			textBaseline : "middle",
			fontColor : "black", 
			fontSize : 18,
			animate : false,
			x1: 0, 
			y1 : 999,
			paddingX1 : 45,
			paddingY1 : 50 
		},
		{
			position : "INCHART",
			shape: "REGULARSHAPE",
			sideCount : 6,
			strokeColor : "black", 
			fillColor : "black", 
			radius : 10, 
			animate : false,
			x1: "<%=#DS_MAXIMUMPJ(0)#%>", 
			y1 : "<%=#DS_MAXIMUM(0)#%>",
			iter : "ALL"
		},
		{
			position : "INCHART",
			shape: "REGULARSHAPE",
			sideCount : 6,
			strokeColor : "blue", 
			fillColor : "blue",
			radius : 10, 
			animate : false,
			x1: "<%=#DS_MAXIMUMPJ(1)#%>", 
			y1 : "<%=#DS_MAXIMUM(1)#%>",
			iter : "ALL"
		},
		{
			position : "INCHART",
			shape: "STAR",
			lineCount : 3,
			strokeColor : "black", 
			animate : false,
			x1: "<%=#DS_MINIMUMPJ(0)#%>", 
			y1 : "<%=#DS_MINIMUM(0)#%>",
			iter : "ALL"
		},
		{
			position : "INCHART",
			shape: "STAR",
			lineCount : 3,
			strokeColor : "blue", 
			animate : false,
			x1: "<%=#DS_MINIMUMPJ(1)#%>", 
			y1 : "<%=#DS_MINIMUM(1)#%>",
			iter : "ALL"
		}
	]
}     ;

var opts_lines_with_shapes = {
	datasetFill : false,
	graphMin : 0,
	spaceRight : 110,
	barValueSpacing : 20,
	endDrawScaleFunction: drawShapes
}

stats(lines_with_shapes,opts_lines_with_shapes);

//**************************************************

var mydata2 = [
	{
		value : 30,
		color: "#D97041",
		title : "Europe"
	},
	{
		value : 58,
		color: "#C7604C",
		title : "Asia"
	},
	{
		value : 82,
		color: "#7D4F6D",
		title : "South-America"
	},
	{
		value : 24,
		color: "#21323D",
		title : "Africa"
	},
	{
		value : 90,
		color: "#9D9B7F",
		title : "Noth-America"
	}
];

var opts_mydata2 = {
	inGraphDataShow : false,
	legend : false,
	spaceBottom : 65,
	spaceTop : 55
}

pushInGraphData("Pie",mydata2,opts_mydata2,{text : "<Title> (<Value>)"});

//**************************************************

var mydata2_gradient = [
	{
		 value :265,
	 	 color:gradientColor,
		 gradientColors :["#333 0%","#333 55%","rgba(52,152,219,1) 75%","rgba(52,152,219,1) 90%","rgba(52,152,219,1) 100%",],
		 title:'January'
	},
	{
		value :208,
		color: gradientColor,
		gradientColors :["#333 0%","#333 55%","rgba(46,204,113,1) 75%","rgba(46,204,113,1) 90%","rgba(46,204,113,1) 100%",],
		title:'February'},
	{
		value :290,
		color:gradientColor,
		gradientColors :["#333 0%","#333 55%","rgba(166,107,190,1) 75%","rgba(166,107,190,1) 90%","rgba(166,107,190,1) 100%",],
		title:'March'
	},
	{
		value :281,
		color:gradientColor,
		gradientColors :["#333 0%","#333 55%","rgba(241,196,15,1) 75%","rgba(241,196,15,1) 90%","rgba(241,196,15,1) 100%",],
		title:'April'
	},
	{
		value :256,
		color:gradientColor,
		gradientColors :["#333 0%","#333 55%","rgba(230,126,34,1) 75%","rgba(230,126,34,1) 90%","rgba(230,126,34,1) 100%",],
		title:'May'
	},
	{
		value :255,
		color:gradientColor,
		gradientColors :["#333 0%","#333 55%","rgba(192,58,43,1) 75%","rgba(192,58,43,1) 90%","rgba(192,58,43,1) 100%",],
		title:'June'
	},
	{
		value :240,
		color:gradientColor,gradientColors :["#333 0%","#333 55%","rgba(141,68,173,1) 75%","rgba(141,68,173,1) 90%","rgba(141,68,173,1) 100%",],
		title:'July'
	},
	{
		value :265,
		color:gradientColor,
		gradientColors :["#333 0%","#333 55%","rgba(133,82,133,1) 75%","rgba(133,82,133,1) 90%","rgba(133,82,133,1) 100%",],
		title:'January'
	},
	{
		value :208,
		color:gradientColor,
		gradientColors :["#333 0%","#333 55%","rgba(176,196,167,0.5) 75%","rgba(176,196,167,0.5) 90%","rgba(176,196,167,0.5) 100%",],
		title:'February'
	},
	{
		value :290,
		color:gradientColor,
		gradientColors :["#333 0%","#333 55%","rgba(83,21,119,0.3) 75%","rgba(83,21,119,0.3) 90%","rgba(83,21,119,0.3) 100%",],
		title:'March'
	},
	{
		value :281,
		color:gradientColor,
		gradientColors :["#333 0%","#333 55%","rgba(205,251,187,0.7) 75%","rgba(205,251,187,0.7) 90%","rgba(205,251,187,0.7) 100%",],
		title:'April'
		}
];

var opts_mydata2_gradient= {
	canvasBackgroundColor:'rgba(255,255,255,1.00)',
	radiusScale:0.9,
	scaleLabel:"<%=value+''%>",
	yAxisMinimumInterval:'none',
	scaleShowLabels:false,
	scaleShowLine:false,
	scaleLineStyle:"solid",scaleLineWidth:1,
	scaleLineColor:"rgba(0,0,0,0.6)",
	scaleOverlay :false,
	scaleOverride :false,
	scaleSteps:10,
	scaleStepWidth:10,
	scaleStartValue:0,
	inGraphDataShow:true,
	inGraphDataTmpl:'<%=v2%>',
	inGraphDataFontStyle:"normal normal",
	inGraphDataFontColor:"rgba(255,255,255,1.00)",
	inGraphDataFontSize:15,inGraphDataPaddingX:0,
	inGraphDataPaddingY:0,
	inGraphDataAlign:"center",
	inGraphDataVAlign:"middle",
	inGraphDataXPosition:2,
	inGraphDataYPosition:3,
	inGraphDataAnglePosition:2,
	inGraphDataRadiusPosition:3,
	inGraphDataRotate:0,
	inGraphDataPaddingAngle:0,
	inGraphDataPaddingRadius:-24, 
	inGraphDataBorders:false,
	inGraphDataBordersXSpace:1,
	inGraphDataBordersYSpace:1,
	inGraphDataBordersWidth:1,
	inGraphDataBordersStyle:"solid",
	inGraphDataBordersColor:"rgba(0,0,0,1)",
	legend:false,maxLegendCols:5,
	legendBlockSize:20,
	legendFillColor:'rgba(255,255,255,0.00)',
	legendColorIndicatorStrokeWidth:1,
	legendPosX:-2,
	legendPosY:4,
	legendXPadding:0,
	legendYPadding:0,
	legendBorders:false,
	legendBordersWidth:1,
	legendBordersStyle:"solid",
	legendBordersColors:"rgba(102,102,102,1)",
	legendBordersSpaceBefore:5,
	legendBordersSpaceLeft:5,
	legendBordersSpaceRight:5,
	legendBordersSpaceAfter:5,
	legendSpaceBeforeText:5,
	legendSpaceLeftText:5,
	legendSpaceRightText:5,
	legendSpaceAfterText:5,
	legendSpaceBetweenBoxAndText:5,
	legendSpaceBetweenTextHorizontal:5,
	legendSpaceBetweenTextVertical:5,
	legendFontStyle:"normal normal",
	legendFontColor:"rgba(0,0,0,1)",
	legendFontSize:15,
	showYAxisMin:false,
	rotateLabels:"smart",
	xAxisBottom:true,
	yAxisLeft:true,
	yAxisRight:false,
	scaleFontStyle:"normal normal",
	scaleFontColor:"rgba(0,0,0,1)",
	scaleFontSize:12,
	pointLabelFontStyle:"normal normal",
	pointLabelFontColor:"rgba(102,102,102,1)",
	pointLabelFontSize:12,
	angleShowLineOut:true,
	angleLineStyle:"solid",
	angleLineWidth:1,
	angleLineColor:"rgba(0,0,0,0.1)",
	percentageInnerCutout:50,
	scaleShowGridLines:true,
	scaleGridLineStyle:"solid",
	scaleGridLineWidth:1,
	scaleGridLineColor:"rgba(0,0,0,0.1)",
	scaleXGridLinesStep:1,
	scaleYGridLinesStep:3,
	datasetStroke:true,
	datasetFill : true,
	datasetStrokeStyle:"solid",
	datasetStrokeWidth:2,
	bezierCurve:true,
	bezierCurveTension :0.4,
	pointDotStrokeStyle:"solid",
	pointDotStrokeWidth : 1,
	pointDotRadius : 3,
	pointDot : true,
	scaleTickSizeBottom:5,
	scaleTickSizeTop:5,
	scaleTickSizeLeft:5,
	scaleTickSizeRight:5,
	graphMin:0,
	barShowStroke : false,
	barBorderRadius:0,
	barStrokeStyle:"solid",
	barStrokeWidth:1,
	barValueSpacing:15,
	barDatasetSpacing:0,
	scaleShowLabelBackdrop :true,
	scaleBackdropColor:'rgba(255,255,255,0.75)',
	scaleBackdropPaddingX :2,
	scaleBackdropPaddingY :2,
	segmentShowStroke : "merge",
	segmentStrokeColor : "#333",
	segmentStrokeWidth :1,
	onAnimationComplete : function(){MoreChartOptions()}
	
	};

//**************************************************


var doughnut_text_in_center = [
	{
		value : 70,
		color: "rgba(151,187,205,1)",
		title : "Acquired",
		shapesInChart : [
			{
				position : "RELATIVE",
				shape : "TEXT",
				text : dispPct_Doughnut,
				x1 : 2,
				y1 : 2,
				textAlign : "center",
				textBaseline : "middle",
				fontColor : "black", 
				fontSize : 50
			}
		]

	},
	{
		value : 30,
		color: "rgba(220,220,220,1)",
		title : "Not Acquired"
	}
] ;

function dispPct_Doughnut(numtxt,valtxt,ctx,config,posX,posY,borderX,borderY,overlay,data,animPC){
        return("Result :\n"+Math.round(animPC*data[0].value)+"%");
} ;

var opts_doughnut_text_in_center = {
	animationEasing : "linear",
	inGraphDataShow : false,
	endDrawDataFunction: drawShapes,
	spaceTop : 30,
	spaceBottom : 30,
	spaceLeft : 30,
	spaceRight : 30,
	startAngle : 180  
} ;

//**************************************************

var hatch_data = {
  labels : ["0","100","200","300","400","500","600","700","800"],
  xBegin : 0,
  xEnd :  800,   
	datasets : [
		{
			strokeColor : "rgba(0,220,220,1)",
			data : [],
      			xPos : [],
      			title : "data1"
		},
		{
			strokeColor : "rgba(220,0,220,1)",
      			data : [],
      			xPos : [],
      			title : "data2"
		}
	]
};        

var nbiter=10;
for(var i=0;i<nbiter+1;i++)
{
  hatch_data.datasets[0].xPos[i]=hatch_data.xBegin+i*(hatch_data.xEnd-hatch_data.xBegin)/nbiter;
  hatch_data.datasets[0].data[i]=-100+200*Math.random();
};

var nbiter=13;
for(var i=0;i<nbiter+1;i++)
{
  hatch_data.datasets[1].xPos[i]=hatch_data.xBegin+i*(hatch_data.xEnd-hatch_data.xBegin)/nbiter;
  hatch_data.datasets[1].data[i]=-100+200*Math.random();
};

addHatch(hatch_data,{animation : true,nb_hatch_lines : 100,positive_strokeColor : "green"});

var opts_hatch_data = {
      pointDot : false,
      animationSteps : 10,
      inGraphDataShow: false,
      yAxisMinimumInterval : 1,

      // change options default values for producing the good result;
      
      datasetFill : false,
      bezierCurve : false

};


//**************************************************



function roundToNumber(num, place) {
    var newval=1*num;

    if(typeof(newval)=="number"){
      if(place<=0){
        var roundVal=-place;
        newval= +(Math.round(newval + "e+" + roundVal) + "e-" + roundVal);
      }
      else {
        var roundVal=place;
        var divval= "1e+"+roundVal;
        newval= +(Math.round(newval/divval))*divval;
      }
    }
    return(newval);
} ;



//********************************************************;
