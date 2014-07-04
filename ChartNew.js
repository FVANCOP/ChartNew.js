


/*
 * ChartNew.js
 * 
 * Vancoppenolle Francois - January 2014
 * francois.vancoppenolle@favomo.be 
 * 
 * Source location : http:\\www.favomo.be\graphjs
 * GitHub community : https://github.com/FVANCOP/ChartNew.js   
 * 
 * This file is an adaptation of the chart.js source developped by Nick Downie (2013) 
 * https://github.com/nnnick/Chart.js 
 *    
 * new charts
 *  
 *     horizontalBar 
 *     horizontalStackedBar 
 *     
 * Added items : 
 *  
 *     Title
 *     Subtitle
 *     X Axis Label
 *     Y Axis Label
 *     Unit Label                                                                                       
 *     Y Axis on the right and/or the left
 *     Annotates
 *     canvas Border
 *     Legend
 *     Footnote
 *     crossText
 *     graphMin / graphMax
 *     logarithmic y-axis (for line and bar) 
 *     rotateLabels
 *     
 */


     var charJSPersonalDefaultOptions = { }
         
     var charJSPersonalDefaultOptionsLine = { }
     var charJSPersonalDefaultOptionsRadar = { }
     var charJSPersonalDefaultOptionsPolarArea = { }
     var charJSPersonalDefaultOptionsPie = { }
     var charJSPersonalDefaultOptionsDoughnut = { }
     var charJSPersonalDefaultOptionsBar = { }
     var charJSPersonalDefaultOptionsStackedBar = { }
     var charJSPersonalDefaultOptionsHorizontalBar = { }
     var charJSPersonalDefaultOptionsHorizontalStackedBar = { }



///////// FUNCTIONS THAN CAN BE USED IN THE TEMPLATES ///////////////////////////////////////////




function roundToWithThousands(config, num, place) {
    var newval=1*unFormat(config, num);

    if(typeof(newval)=="number" && place !="none"){
      if(place<=0){
        var roundVal=-place;
        newval= +(Math.round(newval + "e+" + roundVal) + "e-" + roundVal);
      }
      else {
        var roundVal=place;
        var divval= "1e+"+roundVal;
        value= +(Math.round(newval/divval))*divval;
      }
    }
    newval= fmtChartJS(config,newval,"none");
    return(newval);
} ;

function unFormat(config, num) {

    if((config.decimalSeparator!="." || config.thousandSeparator !="") && typeof(num)=="string") {
      var v1=""+num;
      if(config.thousandSeparator!=""){
        while(v1.indexOf(config.thousandSeparator)>=0)v1=""+v1.replace(config.thousandSeparator,"");
      }
      if(config.decimalSeparator!=".")v1=""+v1.replace(config.decimalSeparator,".")
//      v1=fmtChartJS(config,1*roundToWithThousands(1*v1,place),"none")                                                 
      return 1*v1;
    }
    else {
      return num;
    }
};



///////// ANNOTATE PART OF THE SCRIPT ///////////////////////////////////////////

/********************************************************************************
Copyright (C) 1999 Thomas Brattli
This script is made by and copyrighted to Thomas Brattli
Visit for more great scripts. This may be used freely as long as this msg is intact!
I will also appriciate any links you could give me.
Distributed by Hypergurl
********************************************************************************/

var cachebis = {};

function fmtChartJSPerso(config,value,fmt){
  switch(fmt){
    case "SampleJS_Format":
      if(typeof(value)=="number")return_value="My Format : " + value.toString()+ " $";
      else return_value=value + "XX";
      break;
    case "Change_Month":
      if(typeof(value)=="string")return_value=value.toString()+ " 2014";
      else return_value=value.toString()+"YY";
      break;
      
    default: 
      return_value=value;
      break;
    }  
  return(return_value);
};

function fmtChartJS(config,value,fmt){

  var return_value;
  if(fmt=="notformatted") {
    return_value=value;
  }
  else if(fmt=="none" && typeof(value)=="number") {
    if(config.roundNumber !="none"){
      if(config.roundNumber<=0){
        var roundVal=-config.roundNumber;
        value= +(Math.round(value + "e+" + roundVal) + "e-" + roundVal);
      }
      else {
        var roundVal=config.roundNumber;
        var divval= "1e+"+roundVal;
        value= +(Math.round(value/divval))*divval;
      }
    }
    if(config.decimalSeparator!="." || config.thousandSeparator !=""){
      return_value=value.toString().replace(/\./g,config.decimalSeparator);
      if(config.thousandSeparator !=""){
        var part1=return_value;
        var part2="";
        var posdec=part1.indexOf(config.decimalSeparator);
        if(posdec>=0){
          part2=part1.substring(posdec+1,part1.length);
          part2=part2.split('').reverse().join('');  // reverse string
          part1=part1.substring(0,posdec);
        }        
        part1=part1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
        // part2=part2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
        part2=part2.split('').reverse().join('');   // reverse string
        return_value=part1
        if(part2!="")return_value=return_value+config.decimalSeparator+part2;
      }
    }
    else return_value=value;
  }
  else if(fmt!="none" && fmt != "notformatted") {
    return_value=fmtChartJSPerso(config,value,fmt);
  }
  else {
    return_value=value;
  }
  return(return_value);
};

function addParameters2Function(data,fctName,fctList) {
	  var mathFunctions = {
		  mean: {data:data.data,datasetNr:data.v11},
		  varianz: {data:data.data, datasetNr:data.v11},
		  stddev: {data:data.data, datasetNr:data.v11},
		  cv: {data:data.data, datasetNr:data.v11}
	  };
	  // difference to current value (v3)
	  dif = false;
	  if (fctName.substr(-3) == "Dif") {
		 fctName = fctName.substr(0,fctName.length-3);
		 dif = true;
	  }

    if (typeof eval(fctName) == "function") {
	  	var parameter = eval(fctList+"."+fctName);
		if (dif) {
			// difference between v3 (current value) and math function
			return data.v3-window[fctName](parameter);
		}
	  	return window[fctName](parameter);
	  }
	  return;
}

//Is a number function
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
} ;

function tmplbis(str, data) {
	  var mathFunctionList = ["mean","varianz","stddev","cv"];
	  var regexMath = new RegExp('<%=((?:(?:.*?)\\W)??)((?:'+mathFunctionList.join('|')+')(?:Dif)?)\\(([0-9]*?)\\)(.*?)%>','g');
	  while (regexMath.test(str)) {
 	  str = str.replace(regexMath, function($0,$1,$2,$3,$4) {
													if ($3) { var rndFac = $3; } else {var rndFac = 2; }
													var value = addParameters2Function(data,$2,"mathFunctions");
													if (isNumber(value)) {
														return '<%='+$1+''+Math.round(Math.pow(10,rndFac)*value)/Math.pow(10,rndFac)+''+$4+'%>';
													}
													return '<%= %>';
												});
	  }

    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
  	// first check if it's can be an id
    var fn = /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(str) ?     cachebis[str] = cachebis[str] ||
        tmplbis(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\n]/g, "\\n")
          .replace(/[\t]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
};

/**
 * ctx.prototype
 * fillText option for canvas Multiline Support
 * @param text string \n for newline
 * @param x x position
 * @param y y position
 * @param yLevel = "bottom" => last line has this y-Pos [default], = "middle" => the middle line has this y-Pos)
 * @param lineHeight lineHeight
 */
CanvasRenderingContext2D.prototype.fillTextMultiLine = function(text, x, y,yLevel, lineHeight) {

  var lines = (""+text).split("\n");
  // if its one line => in the middle 
  // two lines one above the mid one below etc.	
  if (yLevel == "middle") {
  	y -= ((lines.length-1)/2)*lineHeight;
  } else if(yLevel=="bottom") { // default
	  y -= (lines.length-1)*lineHeight;  
  }
  for (var i = 0; i < lines.length; i++) {
    this.fillText(lines[i], x, y);
    y += lineHeight;
  }
}

CanvasRenderingContext2D.prototype.measureTextMultiLine = function(text,lineHeight) {
  var textWidth=0;
  var lg;
  var lines = (""+text).split("\n");
  var textHeight=lines.length*lineHeight;
  // if its one line => in the middle 
  // two lines one above the mid one below etc.	
  for (var i = 0; i < lines.length; i++) {
    lg= this.measureText(lines[i]).width ;
    if(lg>textWidth)textWidth=lg;
  }
  return {
    textWidth: textWidth,
    textHeight: textHeight
  };
}


cursorDivCreated = false;

function createCursorDiv() {
    if (cursorDivCreated == false) {
        var div = document.createElement('divCursor');
        div.id = 'divCursor';
        div.style.position = 'absolute';
        document.body.appendChild(div);
        cursorDivCreated = true;
    }
} ;


//Default browsercheck, added to all scripts!
function checkBrowser() {
    this.ver = navigator.appVersion
    this.dom = document.getElementById ? 1 : 0
    this.ie5 = (this.ver.indexOf("MSIE 5") > -1 && this.dom) ? 1 : 0;
    this.ie4 = (document.all && !this.dom) ? 1 : 0;
    this.ns5 = (this.dom && parseInt(this.ver) >= 5) ? 1 : 0;
    this.ns4 = (document.layers && !this.dom) ? 1 : 0;
    this.bw = (this.ie5 || this.ie4 || this.ns4 || this.ns5)
    return this
};
bw = new checkBrowser();

//Set these variables:
fromLeft = 10; // How much from the left of the cursor should the div be?
fromTop = 10; // How much from the top of the cursor should the div be?

/********************************************************************
Initilizes the objects
*********************************************************************/

function cursorInit() {
    scrolled = bw.ns4 || bw.ns5 ? "window.pageYOffset" : "document.body.scrollTop"
    if (bw.ns4) document.captureEvents(Event.MOUSEMOVE)
} ;
/********************************************************************
Contructs the cursorobjects
*********************************************************************/
function makeCursorObj(obj, nest) {

    createCursorDiv();

    nest = (!nest) ? '' : 'document.' + nest + '.'
    this.css = bw.dom ? document.getElementById(obj).style : bw.ie4 ? document.all[obj].style : bw.ns4 ? eval(nest + "document.layers." + obj) : 0;
    this.moveIt = b_moveIt;

    cursorInit();

    return this
} ;
function b_moveIt(x, y) {


    this.x = x;
    this.y = y;
    this.css.left = this.x + "px";
    this.css.top = this.y + "px";
};




function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
};

function mergeChartConfig(defaults, userDefined) {
        var returnObj = {};
        for (var attrname in defaults) { returnObj[attrname] = defaults[attrname]; }
        for (var attrname in userDefined) { returnObj[attrname] = userDefined[attrname]; }
        return returnObj;
};

function sleep(ms){
		var dt = new Date();
		dt.setTime(dt.getTime() + ms);
		while (new Date().getTime() < dt.getTime()){};
} ;

function saveCanvas(ctx,data,config,tpgraph) {
        cvSave = ctx.getImageData(0,0,ctx.canvas.width, ctx.canvas.height);

        var saveCanvasConfig = {
          savePng : false,
          annotateDisplay : false,
          animation : false,
          dynamicDisplay : false
        };
    
        var savePngConfig = mergeChartConfig(config, saveCanvasConfig);

        savePngConfig.clearRect = false;
       
        /* And ink them */

        switch(tpgraph){
          case "Bar":
             new Chart(ctx.canvas.getContext("2d")).Bar(data,savePngConfig);
             break;
          case "Pie":
             new Chart(ctx.canvas.getContext("2d")).Pie(data,savePngConfig);
             break;
          case "Doughnut":
             new Chart(ctx.canvas.getContext("2d")).Doughnut(data,savePngConfig);
             break;
          case "Radar":
             new Chart(ctx.canvas.getContext("2d")).Radar(data,savePngConfig);
             break;
          case "PolarArea":
             new Chart(ctx.canvas.getContext("2d")).PolarArea(data,savePngConfig);
             break;
          case "HorizontalBar":
             new Chart(ctx.canvas.getContext("2d")).HorizontalBar(data,savePngConfig);
             break;
          case "StackedBar":
             new Chart(ctx.canvas.getContext("2d")).StackedBar(data,savePngConfig);
             break;
          case "HorizontalStackedBar":
             new Chart(ctx.canvas.getContext("2d")).HorizontalStackedBar(data,savePngConfig);
             break;
          case "Line":
             new Chart(ctx.canvas.getContext("2d")).Line(data,savePngConfig);
             break;
        }


 
        if(config.savePngOuput=="NewWindow"){
          var image = ctx.canvas.toDataURL();
          ctx.putImageData(cvSave,0,0); 
          window.open(image,'_blank');
        }
        if(config.savePngOuput=="CurrentWindow"){
          var image = ctx.canvas.toDataURL();
          ctx.putImageData(cvSave,0,0); 
          window.location.href = image;
        }
        if(config.savePngOuput=="Save"){
          document.location.href= ctx.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
          ctx.putImageData(cvSave,0,0); 
        }

} ;


//if (isIE() < 9 && isIE() != false) {

    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        }
    };
//};

var dynamicDisplay = new Array();
var dynamicDisplayList = new Array();

function dynamicFunction(data,config,ctx,tpgraph){
        if(config.dynamicDisplay)
        {
           if(ctx.canvas.id=="")
           {
             var cvdate = new Date();
             var cvmillsec = cvdate.getTime();
             ctx.canvas.id="Canvas_"+cvmillsec;
           }
           if(typeof(dynamicDisplay[ctx.canvas.id])=="undefined")
           {
              dynamicDisplayList[dynamicDisplayList["length"]]=ctx.canvas.id;
              dynamicDisplay[ctx.canvas.id]=[ctx.canvas,false,false,data,config,ctx.canvas,tpgraph];
              dynamicDisplay[ctx.canvas.id][1]=isScrolledIntoView(ctx.canvas);
              window.onscroll = scrollFunction;
           }
           if(dynamicDisplay[ctx.canvas.id][1]==false || dynamicDisplay[ctx.canvas.id][2]==true)return false;
           dynamicDisplay[ctx.canvas.id][2]=true;
        }
        return true;
} ;

function isScrolledIntoView(element){
    var xPosition = 0;
    var yPosition = 0;

    elem=element;  
    while(elem) {
        xPosition += (elem.offsetLeft - elem.scrollLeft + elem.clientLeft);
        yPosition += (elem.offsetTop - elem.scrollTop + elem.clientTop);
        elem = elem.offsetParent;
    }
    
    if (xPosition+element.width/2 >= window.pageXOffset &&
        xPosition+element.width/2 <= window.pageXOffset + window.innerWidth &&
        yPosition+element.height/2 >= window.pageYOffset &&
        yPosition+element.height/2 <= window.pageYOffset+window.innerHeight
        )return(true);
    else return false;
};

function scrollFunction(){
    for (var i=0;i<dynamicDisplayList["length"];i++) {
      if (isScrolledIntoView(dynamicDisplay[dynamicDisplayList[i]][5]) && dynamicDisplay[dynamicDisplayList[i]][2]==false) {
        dynamicDisplay[dynamicDisplayList[i]][1]=true;
        switch(dynamicDisplay[dynamicDisplayList[i]][6]){
          case "Bar":
             new Chart(document.getElementById(dynamicDisplayList[i]).getContext("2d")).Bar(dynamicDisplay[dynamicDisplayList[i]][3],dynamicDisplay[dynamicDisplayList[i]][4]);
             break;
          case "Pie":
             new Chart(document.getElementById(dynamicDisplayList[i]).getContext("2d")).Pie(dynamicDisplay[dynamicDisplayList[i]][3],dynamicDisplay[dynamicDisplayList[i]][4]);
             break;
          case "Doughnut":
             new Chart(document.getElementById(dynamicDisplayList[i]).getContext("2d")).Doughnut(dynamicDisplay[dynamicDisplayList[i]][3],dynamicDisplay[dynamicDisplayList[i]][4]);
             break;
          case "Radar":
             new Chart(document.getElementById(dynamicDisplayList[i]).getContext("2d")).Radar(dynamicDisplay[dynamicDisplayList[i]][3],dynamicDisplay[dynamicDisplayList[i]][4]);
             break;
          case "PolarArea":
             new Chart(document.getElementById(dynamicDisplayList[i]).getContext("2d")).PolarArea(dynamicDisplay[dynamicDisplayList[i]][3],dynamicDisplay[dynamicDisplayList[i]][4]);
             break;
          case "HorizontalBar":
             new Chart(document.getElementById(dynamicDisplayList[i]).getContext("2d")).HorizontalBar(dynamicDisplay[dynamicDisplayList[i]][3],dynamicDisplay[dynamicDisplayList[i]][4]);
             break;
          case "StackedBar":
             new Chart(document.getElementById(dynamicDisplayList[i]).getContext("2d")).StackedBar(dynamicDisplay[dynamicDisplayList[i]][3],dynamicDisplay[dynamicDisplayList[i]][4]);
             break;
          case "HorizontalStackedBar":
             new Chart(document.getElementById(dynamicDisplayList[i]).getContext("2d")).HorizontalStackedBar(dynamicDisplay[dynamicDisplayList[i]][3],dynamicDisplay[dynamicDisplayList[i]][4]);
             break;
          case "Line":
             new Chart(document.getElementById(dynamicDisplayList[i]).getContext("2d")).Line(dynamicDisplay[dynamicDisplayList[i]][3],dynamicDisplay[dynamicDisplayList[i]][4]);
             break;
        }
      }
    }
};  

var jsGraphAnnotate = new Array();

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};

function doMouseMove(ctx, config, event,data) {

    var annotateDIV = document.getElementById('divCursor');
    show = false;

    annotateDIV.className = (config.annotateClassName) ? config.annotateClassName : '';
    annotateDIV.style.border = (config.annotateClassName) ? '' : config.annotateBorder;
    annotateDIV.style.padding = (config.annotateClassName) ? '' : config.annotatePadding;
    annotateDIV.style.borderRadius = (config.annotateClassName) ? '' : config.annotateBorderRadius;
    annotateDIV.style.backgroundColor = (config.annotateClassName) ? '' : config.annotateBackgroundColor;
    annotateDIV.style.color = (config.annotateClassName) ? '' : config.annotateFontColor;
    annotateDIV.style.fontFamily = (config.annotateClassName) ? '' : config.annotateFontFamily;
    annotateDIV.style.fontSize = (config.annotateClassName) ? '' : config.annotateFontSize+"pt";
    annotateDIV.style.fontStyle = (config.annotateClassName) ? '' : config.annotateFontStyle;

    canvas_pos = getMousePos(ctx.canvas, event);
    for (i = 0; i < jsGraphAnnotate[ctx.ChartNewId]["length"]; i++) {

        if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "ARC") // Arc
        {
            distance = Math.sqrt((canvas_pos.x - jsGraphAnnotate[ctx.ChartNewId][i][1]) * (canvas_pos.x - jsGraphAnnotate[ctx.ChartNewId][i][1]) + (canvas_pos.y - jsGraphAnnotate[ctx.ChartNewId][i][2]) * (canvas_pos.y - jsGraphAnnotate[ctx.ChartNewId][i][2]));
            if (distance > jsGraphAnnotate[ctx.ChartNewId][i][3] && distance < jsGraphAnnotate[ctx.ChartNewId][i][4]) {

                angle = Math.acos((canvas_pos.x - jsGraphAnnotate[ctx.ChartNewId][i][1]) / distance);
                if (canvas_pos.y < jsGraphAnnotate[ctx.ChartNewId][i][2]) angle = -angle;
                
                while (angle < 0){angle+=2*Math.PI;}
                while (angle > 2*Math.PI){angle-=2*Math.PI;}
                if(angle<config.startAngle*(Math.PI/360))angle+=2*Math.PI;

                if ((angle > jsGraphAnnotate[ctx.ChartNewId][i][5] && angle < jsGraphAnnotate[ctx.ChartNewId][i][6]) || (angle > jsGraphAnnotate[ctx.ChartNewId][i][5]-2*Math.PI && angle < jsGraphAnnotate[ctx.ChartNewId][i][6]-2*Math.PI)|| (angle > jsGraphAnnotate[ctx.ChartNewId][i][5]+2*Math.PI && angle < jsGraphAnnotate[ctx.ChartNewId][i][6]+2*Math.PI)) {

                    v1 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][7],config.fmtV1); // V1=Label
                    v2 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][8],config.fmtV2); // V2=Data Value
                    v3 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][9],config.fmtV3); // V3=Cumulated Value
                    v4 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][10],config.fmtV4); // V4=Total Data Value
                    v5 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][11],config.fmtV5); // V5=Angle
    
                    v6 = fmtChartJS(config,100 * jsGraphAnnotate[ctx.ChartNewId][i][8] / jsGraphAnnotate[ctx.ChartNewId][i][10],config.fmtV6); // v6=Percentage;
                    v6 = roundToWithThousands(config, v6, config.roundPct);
                    v7 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][1],config.fmtV7); // v7=midPointX of arc;
                    v8 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][2],config.fmtV8); // v8=midPointY of arc;
                    v9 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][3],config.fmtV9); // v9=radius Minimum;
                    v10 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][4],config.fmtV10); // v10=radius Maximum;
                    v11 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][5],config.fmtV11); // v11=start angle;
                    v12 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][6],config.fmtV12); // v12=stop angle;
                    v13 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][12],config.fmtV13); // v13=position in Data;

                    graphPosX = canvas_pos.x;
                    graphPosY = canvas_pos.y;

                    // create label text
                    dispString = tmplbis(config.annotateLabel, { config:config, v1: v1, v2: v2, v3: v3, v4: v4, v5: v5, v6: v6, v7: v7, v8: v8, v9: v9, v10: v10, v11: v11, v12: v12, v13: v13, graphPosX: graphPosX, graphPosY: graphPosY} );
                    annotateDIV.innerHTML = dispString;
                    show = true;


                    x = bw.ns4 || bw.ns5 ? event.pageX : event.x;
                    y = bw.ns4 || bw.ns5 ? event.pageY : event.y;
                    if (bw.ie4 || bw.ie5) y = y + eval(scrolled);
                    oCursor.moveIt(x + fromLeft, y + fromTop);
                }
            }
        } else if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "RECT") {
            if (canvas_pos.x > jsGraphAnnotate[ctx.ChartNewId][i][1] && canvas_pos.x < jsGraphAnnotate[ctx.ChartNewId][i][3] && canvas_pos.y < jsGraphAnnotate[ctx.ChartNewId][i][2] && canvas_pos.y > jsGraphAnnotate[ctx.ChartNewId][i][4]) {

                v1 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][5],config.fmtV1); // V1=Label1
                v2 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][6],config.fmtV2); // V2=Label2
                v3 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][7],config.fmtV3); // V3=Data Value
                v4 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][8],config.fmtV4); // V4=Cumulated Value
                v5 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][9],config.fmtV5); // V5=Total Data Value
                v6 = fmtChartJS(config,100 * jsGraphAnnotate[ctx.ChartNewId][i][7] / jsGraphAnnotate[ctx.ChartNewId][i][9],config.fmtV6); // v6=Percentage;
                v6 = roundToWithThousands(config, v6, config.roundPct);
                v7 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][1],config.fmtV7); // v7=top X of rectangle;
                v8 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][2],config.fmtV8); // v8=top Y of rectangle;
                v9 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][3],config.fmtV9); // v9=bottom X of rectangle;
                v10 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][4],config.fmtV10); // v10=bottom Y of rectangle;
                v11 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][10],config.fmtV11); // v11=position in Dataset;
                v12 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][11],config.fmtV12); // v12=position in Dataset[v11].Data;
                graphPosX = canvas_pos.x;
                graphPosY = canvas_pos.y;

                dispString = tmplbis(config.annotateLabel, { config:config, v1: v1, v2: v2, v3: v3, v4: v4, v5: v5, v6: v6, v7: v7, v8: v8, v9: v9, v10: v10, v11: v11, v12: v12, graphPosX: graphPosX, graphPosY: graphPosY, data:data });
                annotateDIV.innerHTML = dispString;
                show = true;

                x = bw.ns4 || bw.ns5 ? event.pageX : event.x;
                y = bw.ns4 || bw.ns5 ? event.pageY : event.y;
                if (bw.ie4 || bw.ie5) y = y + eval(scrolled);
                oCursor.moveIt(x + fromLeft, y + fromTop);
            }

        } else if (jsGraphAnnotate[ctx.ChartNewId][i][0] == "POINT") {
            distance = Math.sqrt((canvas_pos.x - jsGraphAnnotate[ctx.ChartNewId][i][1]) * (canvas_pos.x - jsGraphAnnotate[ctx.ChartNewId][i][1]) + (canvas_pos.y - jsGraphAnnotate[ctx.ChartNewId][i][2]) * (canvas_pos.y - jsGraphAnnotate[ctx.ChartNewId][i][2]));
            if (distance < 10) {

                v1 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][3],config.fmtV1); // V1=Label1
                v2 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][4],config.fmtV2); // V2=Label2
                v3 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][5],config.fmtV3); // V3=Data Value
                v4 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][6],config.fmtV4); // V4=Difference with Previous line
                v5 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][7],config.fmtV5); // V5=Difference with next line;
                v6 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][8],config.fmtV6); // V6=max;
                v7 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][9],config.fmtV7); // V7=Total;
                v8 = fmtChartJS(config,100 * jsGraphAnnotate[ctx.ChartNewId][i][5] / jsGraphAnnotate[ctx.ChartNewId][i][9],config.fmtV8); // v8=percentage;
                v8 = roundToWithThousands(config, v8, config.roundPct);
                v9 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][1],config.fmtV9); // v9=pos X of point;
                v10 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][2],config.fmtV10); // v10=pos Y of point;
                v11 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][10],config.fmtV11); // v11=position in Dataset;
                v12 = fmtChartJS(config,jsGraphAnnotate[ctx.ChartNewId][i][11],config.fmtV12); // v12=position in Dataset[v11].Data;

                graphPosX = canvas_pos.x;
                graphPosY = canvas_pos.y;

                dispString = tmplbis(config.annotateLabel, { config:config, v1: v1, v2: v2, v3: v3, v4: v4, v5: v5, v6: v6, v7: v7, v8: v8, v9: v9, v10: v10, v11: v11, v12: v12, graphPosX: graphPosX, graphPosY: graphPosY, data: data });
                annotateDIV.innerHTML = dispString;
                show = true;

                x = bw.ns4 || bw.ns5 ? event.pageX : event.x;
                y = bw.ns4 || bw.ns5 ? event.pageY : event.y;
                if (bw.ie4 || bw.ie5) y = y + eval(scrolled);
                oCursor.moveIt(x + fromLeft, y + fromTop);

            }
        }

annotateDIV.style.display = show ? '' : 'none';
    }

} ;






///////// GRAPHICAL PART OF THE SCRIPT ///////////////////////////////////////////

 

//Define the global Chart Variable as a class.
window.Chart = function (context) {

    var chart = this;


    //Easing functions adapted from Robert Penner's easing equations
    //http://www.robertpenner.com/easing/

    var animationOptions = {
        linear: function (t) {
            return t;
        },
        easeInQuad: function (t) {
            return t * t;
        },
        easeOutQuad: function (t) {
            return -1 * t * (t - 2);
        },
        easeInOutQuad: function (t) {
            if ((t /= 1 / 2) < 1) return 1 / 2 * t * t;
            return -1 / 2 * ((--t) * (t - 2) - 1);
        },
        easeInCubic: function (t) {
            return t * t * t;
        },
        easeOutCubic: function (t) {
            return 1 * ((t = t / 1 - 1) * t * t + 1);
        },
        easeInOutCubic: function (t) {
            if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t;
            return 1 / 2 * ((t -= 2) * t * t + 2);
        },
        easeInQuart: function (t) {
            return t * t * t * t;
        },
        easeOutQuart: function (t) {
            return -1 * ((t = t / 1 - 1) * t * t * t - 1);
        },
        easeInOutQuart: function (t) {
            if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t;
            return -1 / 2 * ((t -= 2) * t * t * t - 2);
        },
        easeInQuint: function (t) {
            return 1 * (t /= 1) * t * t * t * t;
        },
        easeOutQuint: function (t) {
            return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
        },
        easeInOutQuint: function (t) {
            if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t * t;
            return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
        },
        easeInSine: function (t) {
            return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
        },
        easeOutSine: function (t) {
            return 1 * Math.sin(t / 1 * (Math.PI / 2));
        },
        easeInOutSine: function (t) {
            return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
        },
        easeInExpo: function (t) {
            return (t == 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
        },
        easeOutExpo: function (t) {
            return (t == 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
        },
        easeInOutExpo: function (t) {
            if (t == 0) return 0;
            if (t == 1) return 1;
            if ((t /= 1 / 2) < 1) return 1 / 2 * Math.pow(2, 10 * (t - 1));
            return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
        },
        easeInCirc: function (t) {
            if (t >= 1) return t;
            return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
        },
        easeOutCirc: function (t) {
            return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
        },
        easeInOutCirc: function (t) {
            if ((t /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
            return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        },
        easeInElastic: function (t) {
            var s = 1.70158; var p = 0; var a = 1;
            if (t == 0) return 0; if ((t /= 1) == 1) return 1; if (!p) p = 1 * .3;
            if (a < Math.abs(1)) { a = 1; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
        },
        easeOutElastic: function (t) {
            var s = 1.70158; var p = 0; var a = 1;
            if (t == 0) return 0; if ((t /= 1) == 1) return 1; if (!p) p = 1 * .3;
            if (a < Math.abs(1)) { a = 1; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
        },
        easeInOutElastic: function (t) {
            var s = 1.70158; var p = 0; var a = 1;
            if (t == 0) return 0; if ((t /= 1 / 2) == 2) return 1; if (!p) p = 1 * (.3 * 1.5);
            if (a < Math.abs(1)) { a = 1; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * .5 + 1;
        },
        easeInBack: function (t) {
            var s = 1.70158;
            return 1 * (t /= 1) * t * ((s + 1) * t - s);
        },
        easeOutBack: function (t) {
            var s = 1.70158;
            return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
        },
        easeInOutBack: function (t) {
            var s = 1.70158;
            if ((t /= 1 / 2) < 1) return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
            return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
        },
        easeInBounce: function (t) {
            return 1 - animationOptions.easeOutBounce(1 - t);
        },
        easeOutBounce: function (t) {
            if ((t /= 1) < (1 / 2.75)) {
                return 1 * (7.5625 * t * t);
            } else if (t < (2 / 2.75)) {
                return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
            } else if (t < (2.5 / 2.75)) {
                return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
            } else {
                return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
            }
        },
        easeInOutBounce: function (t) {
            if (t < 1 / 2) return animationOptions.easeInBounce(t * 2) * .5;
            return animationOptions.easeOutBounce(t * 2 - 1) * .5 + 1 * .5;
        }
    };

    //Variables global to the chart
    var width = context.canvas.width;
    var height = context.canvas.height;


    //High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
    if (window.devicePixelRatio) {
        context.canvas.style.width = width + "px";
        context.canvas.style.height = height + "px";
        context.canvas.height = height * window.devicePixelRatio;
        context.canvas.width = width * window.devicePixelRatio;
        context.scale(window.devicePixelRatio, window.devicePixelRatio);
    };


    this.PolarArea = function (data, options) {

        chart.PolarArea.defaults = {
			      inGraphDataShow: false,
			      inGraphDataPaddingRadius: 5,
			      inGraphDataPaddingAngle: 0,
            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
            inGraphDataAlign : "off-center",   // "right", "center", "left", "off-center" or "to-center"
            inGraphDataVAlign : "off-center",  // "bottom", "center", "top", "off-center" or "to-center"
            inGraphDataRotate : 0,   // rotateAngle value (0->360) , "inRadiusAxis" or "inRadiusAxisRotateLabels"
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataRadiusPosition : 3,
            inGraphDataAnglePosition : 2,
            scaleOverlay: true,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleShowLine: true,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowLabelBackdrop: true,
            scaleBackdropColor: "rgba(255,255,255,0.75)",
            scaleBackdropPaddingY: 2,
            scaleBackdropPaddingX: 2,
            segmentShowStroke: true,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            animation: true,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
            startAngle : 90
        };
        chart.PolarArea.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.PolarArea.defaults);
        chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptions);
        chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptionsPolarArea);

        var config = (options) ? mergeChartConfig(chart.PolarArea.defaults, options) : chart.PolarArea.defaults;
        

        return new PolarArea(data, config, context);
    };

    this.Radar = function (data, options) {

        chart.Radar.defaults = {
			      inGraphDataShow: false,
			      inGraphDataPaddingRadius: 5,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign : "off-center",    // "right", "center", "left", "off-center" or "to-center"
            inGraphDataVAlign : "off-center",   // "right", "center", "left", "off-center" or "to-center"
            inGraphDataRotate : 0,   // rotateAngle value (0->360) , "inRadiusAxis" or "inRadiusAxisRotateLabels"
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataRadiusPosition : 3,
            scaleOverlay: false,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleShowLine: true,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: false,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowLabelBackdrop: true,
            scaleBackdropColor: "rgba(255,255,255,0.75)",
            scaleBackdropPaddingY: 2,
            scaleBackdropPaddingX: 2,
            angleShowLineOut: true,
            angleLineColor: "rgba(0,0,0,.1)",
            angleLineWidth: 1,
            pointLabelFontFamily: "'Arial'",
            pointLabelFontStyle: "normal",
            pointLabelFontSize: 12,
            pointLabelFontColor: "#666",
            pointDot: true,
            pointDotRadius: 3,
            pointDotStrokeWidth: 1,
            datasetFill : true,
            datasetStrokeWidth: 2,
            animation: true,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3%>",
            startAngle: 90,
            graphMaximized : false   // if true, the graph will not be centered in the middle of the canvas
        };

        // merge annotate defaults
        chart.Radar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Radar.defaults) ;
        chart.Radar.defaults = mergeChartConfig(chart.Radar.defaults, charJSPersonalDefaultOptions);
        chart.Radar.defaults = mergeChartConfig(chart.Radar.defaults, charJSPersonalDefaultOptionsRadar);

        var config = (options) ? mergeChartConfig(chart.Radar.defaults, options) : chart.Radar.defaults;

        return new Radar(data, config, context);
    };

    this.Pie = function (data, options) {
        chart.Pie.defaults = {
			      inGraphDataShow: false,
			      inGraphDataPaddingRadius: 5,
			      inGraphDataPaddingAngle: 0,
            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
            inGraphDataAlign : "off-center",   // "right", "center", "left", "off-center" or "to-center"
            inGraphDataVAlign : "off-center",  // "bottom", "center", "top", "off-center" or "to-center"
            inGraphDataRotate : 0,   // rotateAngle value (0->360) , "inRadiusAxis" or "inRadiusAxisRotateLabels"
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataRadiusPosition : 3,
            inGraphDataAnglePosition : 2,
            segmentShowStroke: true,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            animation: true,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
            startAngle: 90,
            radiusScale : 1
        };

        // merge annotate defaults
        chart.Pie.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Pie.defaults);
        chart.Pie.defaults = mergeChartConfig(chart.Pie.defaults, charJSPersonalDefaultOptions);
        chart.Pie.defaults = mergeChartConfig(chart.Pie.defaults, charJSPersonalDefaultOptionsPie);
        var config = (options) ? mergeChartConfig(chart.Pie.defaults, options) : chart.Pie.defaults;

        return new Pie(data, config, context);
    };

    this.Doughnut = function (data, options) {

        chart.Doughnut.defaults = {
			      inGraphDataShow: false,
			      inGraphDataPaddingRadius: 5,
			      inGraphDataPaddingAngle: 0,
            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
            inGraphDataAlign : "off-center",   // "right", "center", "left", "off-center" or "to-center"
            inGraphDataVAlign : "off-center",  // "bottom", "middle", "top", "off-center" or "to-center"
            inGraphDataRotate : 0,   // rotateAngle value (0->360) , "inRadiusAxis" or "inRadiusAxisRotateLabels"
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataRadiusPosition : 3,
            inGraphDataAnglePosition : 2,
            segmentShowStroke: true,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            percentageInnerCutout: 50,
            animation: true,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
            startAngle: 90,
            radiusScale : 1
        };

        // merge annotate defaults
        chart.Doughnut.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Doughnut.defaults);
        chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptions);
        chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptionsDoughnut);
        var config = (options) ? mergeChartConfig(chart.Doughnut.defaults, options) : chart.Doughnut.defaults;

        return new Doughnut(data, config, context);

    };

    this.Line = function (data, options) {

        chart.Line.defaults = {
			      inGraphDataShow: false,
			      inGraphDataPaddingX: 3,
			      inGraphDataPaddingY: 3,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign : "left",
            inGraphDataVAlign : "bottom",
            inGraphDataRotate : 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            scaleOverlay: false,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: true,
            scaleXGridLinesStep : 1,
            scaleYGridLinesStep : 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            showYAxisMin: true,      // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
            rotateLabels: "smart",   // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
            // you can force an integer value between 0 and 180 degres
            logarithmic: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
            scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            bezierCurve: true,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 2,
            datasetStrokeWidth: 2,
            datasetFill: true,
            animation: true,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3%>"
            
        };

        // merge annotate defaults
        chart.Line.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Line.defaults);
        chart.Line.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Line.defaults);
        chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptions);
        chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptionsLine);
        
        var config = (options) ? mergeChartConfig(chart.Line.defaults, options) : chart.Line.defaults;

        return new Line(data, config, context);
    };

    this.StackedBar = function (data, options) {

        chart.StackedBar.defaults = {
			      inGraphDataShow: false,
			      inGraphDataPaddingX: 0,
			      inGraphDataPaddingY: -3,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign : "center",
            inGraphDataVAlign : "top",
            inGraphDataRotate : 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataXPosition : 2,
            inGraphDataYPosition : 3,
            scaleOverlay: false,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: true,
            scaleXGridLinesStep : 1,
            scaleYGridLinesStep : 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            showYAxisMin: true,      // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
            rotateLabels: "smart",   // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
            // you can force an integer value between 0 and 180 degres
            scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            barShowStroke: true,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            animation: true,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>"
         };   
            

        // merge annotate defaults
        chart.StackedBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.StackedBar.defaults);
        chart.StackedBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.StackedBar.defaults);
        chart.StackedBar.defaults = mergeChartConfig(chart.StackedBar.defaults, charJSPersonalDefaultOptions);
        chart.StackedBar.defaults = mergeChartConfig(chart.StackedBar.defaults, charJSPersonalDefaultOptionsStackedBar);

        var config = (options) ? mergeChartConfig(chart.StackedBar.defaults, options) : chart.StackedBar.defaults;
        return new StackedBar(data, config, context);
    } ;

    this.HorizontalStackedBar = function (data, options) {

        chart.HorizontalStackedBar.defaults = {
			      inGraphDataShow: false,
			      inGraphDataPaddingX: -3,
			      inGraphDataPaddingY: 0,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign : "right",
            inGraphDataVAlign : "middle",
            inGraphDataRotate : 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataXPosition : 3,
            inGraphDataYPosition : 2,
            scaleOverlay: false,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: true,
            scaleXGridLinesStep : 1,
            scaleYGridLinesStep : 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            showYAxisMin: true,      // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
            rotateLabels: "smart",   // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
            barShowStroke: true,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            animation: true,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>"
         };   
            

        // merge annotate defaults
        chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.HorizontalStackedBar.defaults);
        chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.HorizontalStackedBar.defaults);
        chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.HorizontalStackedBar.defaults, charJSPersonalDefaultOptions);
        chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.HorizontalStackedBar.defaults, charJSPersonalDefaultOptionsHorizontalStackedBar);
        var config = (options) ? mergeChartConfig(chart.HorizontalStackedBar.defaults, options) : chart.HorizontalStackedBar.defaults;
        return new HorizontalStackedBar(data, config, context);
    } ;

    this.Bar = function (data, options) {
        chart.Bar.defaults = {
			      inGraphDataShow: false,
			      inGraphDataPaddingX: 0,
			      inGraphDataPaddingY: 3,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign : "center",
            inGraphDataVAlign : "bottom",
            inGraphDataRotate : 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataXPosition : 2,
            inGraphDataYPosition : 3,
            scaleOverlay: false,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: true,
            scaleXGridLinesStep : 1,
            scaleYGridLinesStep : 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            showYAxisMin: true,      // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
            rotateLabels: "smart",   // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
            // you can force an integer value between 0 and 180 degres
            logarithmic: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
			scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            barShowStroke: true,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            barBorderRadius : 0,
            animation: true,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>"
         };   

        // merge annotate defaults
        chart.Bar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Bar.defaults);
        chart.Bar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Bar.defaults);
        chart.Bar.defaults = mergeChartConfig(chart.Bar.defaults, charJSPersonalDefaultOptions);
        chart.Bar.defaults = mergeChartConfig(chart.Bar.defaults, charJSPersonalDefaultOptionsBar);
        var config = (options) ? mergeChartConfig(chart.Bar.defaults, options) : chart.Bar.defaults;

        return new Bar(data, config, context);
    } ;

    this.HorizontalBar = function (data, options) {
        chart.HorizontalBar.defaults = {
			      inGraphDataShow: false,
			      inGraphDataPaddingX: 3,
			      inGraphDataPaddingY: 0,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign : "left",
            inGraphDataVAlign : "middle",
            inGraphDataRotate : 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataXPosition : 3,
            inGraphDataYPosition : 2,
            scaleOverlay: false,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: true,
            scaleXGridLinesStep : 1,
            scaleYGridLinesStep : 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            showYAxisMin: true,      // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
            rotateLabels: "smart",   // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
            barShowStroke: true,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            barBorderRadius : 0,
            animation: true,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>"
            
        };

        // merge annotate defaults
        chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.HorizontalBar.defaults);
        chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.HorizontalBar.defaults);
        chart.HorizontalBar.defaults = mergeChartConfig(chart.HorizontalBar.defaults, charJSPersonalDefaultOptions);
        chart.HorizontalBar.defaults = mergeChartConfig(chart.HorizontalBar.defaults, charJSPersonalDefaultOptionsHorizontalBar);
        var config = (options) ? mergeChartConfig(chart.HorizontalBar.defaults, options) : chart.HorizontalBar.defaults;

        return new HorizontalBar(data, config, context);
    } ;

    chart.defaults = {};
    chart.defaults.commonOptions = {
        clearRect : true,       // do not change clearRect options; for internal use only
        dynamicDisplay : false,
        graphSpaceBefore : 5,
        graphSpaceAfter : 5,
        canvasBorders: false,
        canvasBackgroundColor : "none",
        canvasBordersWidth: 3,
        canvasBordersColor: "black",
        graphTitle: "",
        graphTitleFontFamily: "'Arial'",
        graphTitleFontSize: 24,
        graphTitleFontStyle: "bold",
        graphTitleFontColor: "#666",
        graphTitleSpaceBefore : 5,
        graphTitleSpaceAfter : 5,
        graphSubTitle: "",
        graphSubTitleFontFamily: "'Arial'",
        graphSubTitleFontSize: 18,
        graphSubTitleFontStyle: "normal",
        graphSubTitleFontColor: "#666",
        graphSubTitleSpaceBefore : 5,
        graphSubTitleSpaceAfter : 5,
        footNote: "",
        footNoteFontFamily: "'Arial'",
        footNoteFontSize: 8,
        footNoteFontStyle: "bold",
        footNoteFontColor: "#666",
        footNoteSpaceBefore : 5,
        footNoteSpaceAfter : 5,
        legend: false,
        legendFontFamily: "'Arial'",
        legendFontSize: 12,
        legendFontStyle: "normal",
        legendFontColor: "#666",
        legendBlockSize: 15,
        legendBorders: true,
        legendBordersWidth: 1,
        legendBordersColors: "#666",
        legendBordersSpaceBefore : 5,
        legendBordersSpaceAfter : 5, 
        legendBordersSpaceLeft : 5, 
        legendBordersSpaceRight : 5, 
        legendSpaceBeforeText : 5,
        legendSpaceAfterText : 5,
        legendSpaceLeftText : 5,
        legendSpaceRightText : 5,
        legendSpaceBetweenTextVertical : 5,
        legendSpaceBetweenTextHorizontal : 5,
        legendSpaceBetweenBoxAndText : 5,
        annotateDisplay: false,  
        savePng : false,
        savePngOuput : "NewWindow",      // Allowed values : "NewWindow", "CurrentWindow", "Save"
        savePngFunction: "mousedown right", 
        savePngBackgroundColor : 'WHITE',
        annotateFunction: "mousemove",
        annotateFontFamily: "'Arial'",
        annotateBorder: 'none', 
        annotateBorderRadius: '2px',
        annotateBackgroundColor: 'rgba(0,0,0,0.8)', 
        annotateFontSize: 12,
        annotateFontColor: 'white',
        annotateFontStyle: "normal",
        annotatePadding: "3px",
        annotateClassName : "",
        crossText: [""],
        crossTextIter: ["all"],
        crossTextOverlay: [true],
        crossTextFontFamily: ["'Arial'"],
        crossTextFontSize: [12],
        crossTextFontStyle: ["normal"],
        crossTextFontColor: ["rgba(220,220,220,1)"],
        crossTextRelativePosX: [2],
        crossTextRelativePosY: [2],
        crossTextBaseline: ["middle"],
        crossTextAlign: ["center"],
        crossTextPosX: [0],
        crossTextPosY: [0],
        crossTextAngle: [0],
        crossTextFunction: null,
        spaceTop: 0,
        spaceBottom: 0,
        spaceRight: 0,
        spaceLeft: 0,
        decimalSeparator : ".",
        thousandSeparator : "",
        roundNumber : "none",
        roundPct : -1,
        fmtV1 : "none",
        fmtV2 : "none",
        fmtV3 : "none",
        fmtV4 : "none",
        fmtV5 : "none",
        fmtV6 : "none",
        fmtV7 : "none",
        fmtV8 : "none",
        fmtV9 : "none",
        fmtV10 : "none",
        fmtV11 : "none",
        fmtV12 : "none",
        fmtV13 : "none",
        fmtXLabel : "none",
        fmtYLabel : "none",
        fmtLegend : "none",
        animationStartValue : 0,
        animationStopValue : 1,
        animationCount : 1,
        animationPauseTime : 5,
        animationBackward : false,
	      animationStartWithDataset: -1,
	      animationStartWithData: -1,
        animationRightToLeft : false,
        animationByDataset : false,
        defaultStrokeColor : "rgba(220,220,220,1)",
        defaultFillColor : "rgba(220,220,220,0.5)"
        
    };

    chart.defaults.xyAxisCommonOptions = {
            yAxisLeft: true,
            yAxisRight: false,
            xAxisBottom: true,
            xAxisTop: false,
            xAxisSpaceBetweenLabels : 5,
            yAxisLabel: "",
            yAxisFontFamily: "'Arial'",
            yAxisFontSize: 16,
            yAxisFontStyle: "normal",
            yAxisFontColor: "#666",
            yAxisLabelSpaceRight : 5,
            yAxisLabelSpaceLeft : 5,
            yAxisSpaceRight : 5,
            yAxisSpaceLeft : 5,
            xAxisLabel: "",
            xAxisFontFamily: "'Arial'",
            xAxisFontSize: 16,
            xAxisFontStyle: "normal",
            xAxisFontColor: "#666",
            xAxisLabelSpaceBefore : 5,
            xAxisLabelSpaceAfter : 5,
            xAxisSpaceBefore : 5,
            xAxisSpaceAfter : 5,
            yAxisUnit: "",
            yAxisUnitFontFamily: "'Arial'",
            yAxisUnitFontSize: 8,
            yAxisUnitFontStyle: "normal",
            yAxisUnitFontColor: "#666",
            yAxisUnitSpaceBefore : 5,
            yAxisUnitSpaceAfter : 5
    };
 


    var clear = function (c) {
        c.clearRect(0, 0, width, height);
    };

    var PolarArea = function (data, config, ctx) {
    
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, msr, midPosX, midPosY;
    
        if(typeof ctx.ChartNewId == undefined){
          var cvdate = new Date();
          var cvmillsec = cvdate.getTime();
          ctx.ChartNewId = "PolarArea_"+cvmillsec;
        }

        if (!dynamicFunction(data,config,ctx,"PolarArea"))return;

        var realStartAngle=config.startAngle* (Math.PI / 180)+2*Math.PI;

        while (config.startAngle < 0){config.startAngle+=360;}
        while (config.startAngle > 360){config.startAngle-=360;}

        while (realStartAngle < 0){realStartAngle+=2*Math.PI;}
        while (realStartAngle > 2*Math.PI){realStartAngle-=2*Math.PI;}


        config.logarithmic = false;

        var annotateCnt = 0;
        jsGraphAnnotate[ctx.ChartNewId] = new Array();

        defMouse(ctx,data,config,"PolarArea");
        
        setRect(ctx,config);

        valueBounds = getValueBounds();
        //Check and set the scale
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";

        if (!config.scaleOverride) {
            calculatedScale = calculateScale(config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, false, false, false,true);
        }
        else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                graphMax: config.scaleStartValue+config.scaleSteps*config.scaleStepWidth,
                labels: []
            }
            populateLabels(config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, calculatedScale.graphMax, config.scaleStepWidth);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, false, false, false,true);
        }


        midPosX = msr.leftNotUsableSize + (msr.availableWidth / 2);
        midPosY = msr.topNotUsableSize + (msr.availableHeight / 2);


        scaleHop = Math.floor(((Min([msr.availableHeight, msr.availableWidth]) / 2) - 5) / calculatedScale.steps);


        //Wrap in an animation loop wrapper
        animationLoop(config, drawScale, drawAllSegments, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPosX, midPosY, midPosX - ((Min([msr.availableHeight, msr.availableWidth]) / 2) - 5), midPosY + ((Min([msr.availableHeight, msr.availableWidth]) / 2) - 5), data);


        function drawAllSegments(animationDecimal) {
            var startAngle = -config.startAngle * (Math.PI / 180)+2*Math.PI,
      cumvalue = 0,
			angleStep = 0,
			scaleAnimation = 1,
			rotateAnimation = 1;
      angleStep=0;



      for (var i = 0; i < data.length; i++) if (!(typeof(data[i].value)=='undefined'))angleStep++;
      
      angleStep= (Math.PI * 2) / angleStep;
 
            while (startAngle < 0){startAngle+=2*Math.PI;}
            while (startAngle > 2*Math.PI){startAngle-=2*Math.PI;}


            if (config.animation) {
                if (config.animateScale) {
                    scaleAnimation = animationDecimal;
                }
                if (config.animateRotate) {
                    rotateAnimation = animationDecimal;
                }
            }
            if (animationDecimal >= 1) {
                totvalue = 0;
                for (var i = 0; i < data.length; i++) if (!(typeof(data[i].value)=='undefined'))totvalue += 1*data[i].value;
            }

            for (var i = 0; i < data.length; i++) {
              if (!(typeof(data[i].value)=='undefined')){
                ctx.beginPath();
                ctx.arc(midPosX, midPosY, scaleAnimation * calculateOffset(config, 1*data[i].value, calculatedScale, scaleHop), startAngle, startAngle + rotateAnimation * angleStep, false);
                ctx.lineTo(midPosX, midPosY);
                ctx.closePath();
                if (typeof data[i].color == "function")ctx.fillStyle = data[i].color("COLOR",data,config,i,-1,animationDecimal,data[i].value);
                else ctx.fillStyle = data[i].color;
                ctx.fill();

                startAngle += angleStep;

                if (config.segmentShowStroke) {
                    ctx.strokeStyle = config.segmentStrokeColor;
                    ctx.lineWidth = config.segmentStrokeWidth;
                    ctx.stroke();
                }
              }

            }
            if (animationDecimal >= 1) {
              startAngle = -config.startAngle * (Math.PI / 180)+2*Math.PI;
              for (var i = 0; i < data.length; i++) {
                if (!(typeof(data[i].value)=='undefined')){
                    cumvalue += 1*data[i].value;
                    startAngle += angleStep;
 
                    if (typeof (data[i].title) == "string") lgtxt = data[i].title.trim();
                    else lgtxt = "";
                    jsGraphAnnotate[ctx.ChartNewId][annotateCnt++] = ["ARC", midPosX, midPosY, 0, calculateOffset(config, 1*data[i].value, calculatedScale, scaleHop), startAngle - angleStep, startAngle, lgtxt, 1*data[i].value, cumvalue, totvalue, angleStep, i];

                    if (config.inGraphDataShow) {
                    
                         if(config.inGraphDataAnglePosition==1)posAngle=realStartAngle+config.inGraphDataPaddingAngle*(Math.PI/180);
                         else if(config.inGraphDataAnglePosition==2)posAngle=realStartAngle-angleStep/2+config.inGraphDataPaddingAngle*(Math.PI/180);
                         else if(config.inGraphDataAnglePosition==3)posAngle=realStartAngle-angleStep+config.inGraphDataPaddingAngle*(Math.PI/180);

                         if(config.inGraphDataRadiusPosition==1)labelRadius=0+config.inGraphDataPaddingRadius;
                         else if(config.inGraphDataRadiusPosition==2)labelRadius=calculateOffset(config, 1*data[i].value, calculatedScale, scaleHop)/2+config.inGraphDataPaddingRadius;
                         else if(config.inGraphDataRadiusPosition==3)labelRadius=calculateOffset(config, 1*data[i].value, calculatedScale, scaleHop)+config.inGraphDataPaddingRadius;
                         else if(config.inGraphDataRadiusPosition==4)labelRadius=scaleHop*calculatedScale.steps+config.inGraphDataPaddingRadius;

                         
  				        	     ctx.save()
           
                         if(config.inGraphDataAlign=="off-center"){
                           if(config.inGraphDataRotate=="inRadiusAxis" || (posAngle+2*Math.PI)%(2*Math.PI) > 3*Math.PI/2 || (posAngle+2*Math.PI)%(2*Math.PI) < Math.PI/2)ctx.textAlign = "left";
                           else ctx.textAlign="right";
                         }
                         else if(config.inGraphDataAlign=="to-center"){
                           if(config.inGraphDataRotate=="inRadiusAxis" || (posAngle+2*Math.PI)%(2*Math.PI) > 3*Math.PI/2 || (posAngle+2*Math.PI)%(2*Math.PI) < Math.PI/2)ctx.textAlign = "right";
                           else ctx.textAlign="left";
                         }
   					             else ctx.textAlign = config.inGraphDataAlign;  
                         if(config.inGraphDataVAlign=="off-center"){
                            if((posAngle+2*Math.PI)%(2*Math.PI)>Math.PI)ctx.textBaseline = "top";
                            else ctx.textBaseline = "bottom";
                         }
                         else if(config.inGraphDataVAlign=="to-center"){
                            if((posAngle+2*Math.PI)%(2*Math.PI)>Math.PI)ctx.textBaseline = "bottom";
                            else ctx.textBaseline = "top";
                         }
                         else ctx.textBaseline = config.inGraphDataVAlign;

           				       ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
	    		               ctx.fillStyle = config.inGraphDataFontColor;

                         var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,1*data[i].value,config.fmtV2), v3 : fmtChartJS(config,cumvalue,config.fmtV3), v4 : fmtChartJS(config,totvalue,config.fmtV4), v5 : fmtChartJS(config,angleStep,config.fmtV5), v6 : roundToWithThousands(config,fmtChartJS(config,100 * data[i].value / totvalue,config.fmtV6),config.roundPct), v7 : fmtChartJS(config,midPosX,config.fmtV7),v8 : fmtChartJS(config,midPosY,config.fmtV8),v9 : fmtChartJS(config,0,config.fmtV9),v10 : fmtChartJS(config,calculateOffset(config, 1*data[i].value, calculatedScale, scaleHop),config.fmtV10),v11 : fmtChartJS(config,startAngle - angleStep,config.fmtV11),v12 : fmtChartJS(config,angleStep,config.fmtV12),v13 : fmtChartJS(config,i,config.fmtV13),data:data});
                         ctx.translate(midPosX + labelRadius*Math.cos(posAngle), midPosY - labelRadius*Math.sin(posAngle));
                         
                         if(config.inGraphDataRotate=="inRadiusAxis")ctx.rotate(2*Math.PI-posAngle);
                         else if(config.inGraphDataRotate=="inRadiusAxisRotateLabels")
                         {
                          if ((posAngle+2*Math.PI)%(2*Math.PI)>Math.PI/2 && (posAngle+2*Math.PI)%(2*Math.PI)<3*Math.PI/2)ctx.rotate(3*Math.PI-posAngle);
                          else ctx.rotate(2*Math.PI-posAngle); 
                         }
                         else ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));
  			     			       
                         ctx.fillTextMultiLine(dispString,0,0,ctx.textBaseline,config.inGraphDataFontSize);
                         ctx.restore();
                         realStartAngle-=angleStep;
                    }                }
              }
            }


        } ;



        function drawScale() {
            for (var i = 0; i < calculatedScale.steps; i++) {
                //If the line object is there
                if (config.scaleShowLine) {
                    ctx.beginPath();
                    ctx.arc(midPosX, midPosY, scaleHop * (i + 1), 0, (Math.PI * 2), true);
                    ctx.strokeStyle = config.scaleLineColor;
                    ctx.lineWidth = config.scaleLineWidth;
                    ctx.stroke();
                }

                if (config.scaleShowLabels) {
                    ctx.textAlign = "center";
                    ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
                    var label = calculatedScale.labels[i + 1];
                    //If the backdrop object is within the font object
                    if (config.scaleShowLabelBackdrop) {
                        var textWidth = ctx.measureTextMultiLine(label,config.scaleFontSize).textWidth;
                        ctx.fillStyle = config.scaleBackdropColor;
                        ctx.beginPath();
                        ctx.rect(
							Math.round(midPosX - textWidth / 2 - config.scaleBackdropPaddingX),     //X
							Math.round(midPosY - (scaleHop * (i + 1)) - config.scaleFontSize * 0.5 - config.scaleBackdropPaddingY),//Y
							Math.round(textWidth + (config.scaleBackdropPaddingX * 2)), //Width
							Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY * 2)) //Height
						);
                        ctx.fill();
                    }
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = config.scaleFontColor;
                    ctx.fillTextMultiLine(label, midPosX, midPosY - (scaleHop * (i + 1)),ctx.textBaseline,config.scaleFontSize);
                }
            }
        } ;
        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            for (var i = 0; i < data.length; i++) {
                if (1*data[i].value > upperValue) { upperValue = 1*data[i].value; }
                if (1*data[i].value < lowerValue) { lowerValue = 1*data[i].value; }
            };

			if (Math.abs(upperValue - lowerValue)<0.00000001) {
				upperValue = Max([upperValue*2,1]);
				lowerValue = 0;
			}

            if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
            if (!isNaN(config.graphMax)) upperValue = config.graphMax;

            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));

            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            };


        } ;
    } ;

    var Radar = function (data, config, ctx) {
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, msr, midPosX, midPosY;

        if(typeof ctx.ChartNewId == "undefined"){
          var cvdate = new Date();
          var cvmillsec = cvdate.getTime();
          ctx.ChartNewId="Radar_"+cvmillsec;
        }

        if (!dynamicFunction(data,config,ctx,"Radar"))return;

        while (config.startAngle < 0){config.startAngle+=360;}
        while (config.startAngle > 360){config.startAngle-=360;}
        
        config.logarithmic = false;

        var annotateCnt = 0;
        jsGraphAnnotate[ctx.ChartNewId] = new Array();

        defMouse(ctx,data,config,"Radar");

        //If no labels are defined set to an empty array, so referencing length for looping doesn't blow up.
        if (!data.labels) data.labels = [];

        setRect(ctx,config);
        
        valueBounds = getValueBounds();
        //Check and set the scale
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";

        if (!config.scaleOverride) {

            calculatedScale = calculateScale(config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, false, false, true,config.datasetFill);
        }
        else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                graphMax: config.scaleStartValue+config.scaleSteps*config.scaleStepWidth,
                labels: []
            }
            populateLabels(config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, calculatedScale.graphMax, config.scaleStepWidth);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, false, false, true,config.datasetFill);
        }

        calculateDrawingSizes();

        midPosY = msr.topNotUsableSize + (msr.availableHeight / 2);
        scaleHop = maxSize / (calculatedScale.steps);

        //Wrap in an animation loop wrapper
        animationLoop(config, drawScale, drawAllDataPoints, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPosX, midPosY, midPosX - maxSize, midPosY + maxSize, data);

        //Radar specific functions.
        function drawAllDataPoints(animationDecimal) {

            var totvalue = new Array();
            var maxvalue = new Array();

            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) { totvalue[j] = 0; maxvalue[j] = -999999999; } }
            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) { if (!(typeof(data.datasets[i].data[j])=='undefined')){totvalue[j] += 1*data.datasets[i].data[j]; maxvalue[j] = Max([maxvalue[j], 1*data.datasets[i].data[j]]); } } }

            var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;

            ctx.save();

            //We accept multiple data sets for radar charts, so show loop through each set
            for (var i = 0; i < data.datasets.length; i++) {

                if (animationDecimal >= 1) {
                    if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                    else lgtxt = "";
                }
                var fPt=-1;

                
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                  var currentAnimPc = animationCorrection(animationDecimal,data,config,i,j,1).animVal;
                  if(currentAnimPc>1)currentAnimPc=currentAnimPc-1;

                  if (!(typeof(data.datasets[i].data[j])=='undefined')) {
                     if (fPt==-1)
                     {
                        ctx.beginPath();
                        ctx.moveTo(midPosX + currentAnimPc *(Math.cos(config.startAngle*Math.PI/180 - j * rotationDegree) * calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop)), midPosY - currentAnimPc *(Math.sin(config.startAngle*Math.PI/180 - j * rotationDegree) * calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop)));
                        fPt=j;
                     }
                     else 
                     {
                        ctx.lineTo(midPosX + currentAnimPc *(Math.cos(config.startAngle*Math.PI/180 - j * rotationDegree) * calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop)), midPosY - currentAnimPc *(Math.sin(config.startAngle*Math.PI/180 - j * rotationDegree) * calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop)));
                     }
                
                     if (animationDecimal >= 1) {
                        if (i == 0) divprev = 0;
                        else divprev = data.datasets[i].data[j] - data.datasets[i - 1].data[j];
                        if (i == data.datasets.length - 1) divnext = 0;
                        else divnext = data.datasets[i + 1].data[j] - data.datasets[i].data[j];
                        if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
                        else lgtxt2 = "";
                        jsGraphAnnotate[ctx.ChartNewId][annotateCnt++] = ["POINT", midPosX + Math.cos(config.startAngle*Math.PI/180 - j * rotationDegree) * calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop), midPosY - Math.sin(config.startAngle*Math.PI/180 - j * rotationDegree) * calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop), lgtxt, lgtxt2, 1*data.datasets[i].data[j], divprev, divnext, maxvalue[j], totvalue[j], i, j];
                     }
                   }
                }

                ctx.closePath();

                if(config.datasetFill){
                  if (typeof data.datasets[i].fillColor == "function")ctx.fillStyle = data.datasets[i].fillColor("FILLCOLOR",data,config,i,-1,currentAnimPc,-1);
                  else if(typeof data.datasets[i].fillColor=="string")ctx.fillStyle = data.datasets[i].fillColor;
                  else ctx.fillStyle=config.defaultFillColor;
                }
                else ctx.fillStyle="rgba(0,0,0,0)";
                if (typeof data.datasets[i].strokeColor == "function")ctx.strokeStyle = data.datasets[i].strokeColor("STROKECOLOR",data,config,i,-1,currentAnimPc,-1);
                else if(typeof data.datasets[i].strokeColor=="string")ctx.strokeStyle = data.datasets[i].strokeColor;
                else ctx.strokeStyle=config.defaultStrokeColor;
                ctx.lineWidth = config.datasetStrokeWidth;
                ctx.fill();
                ctx.stroke();

                if (config.pointDot && (!config.animationRightToLeft || (config.animationRightToLeft && animationDecimal>=1))) {
                    ctx.beginPath();
                    
                    if (typeof data.datasets[i].pointColor == "function")ctx.fillStyle = data.datasets[i].pointColor("POINTCOLOR",data,config,i,-1,currentAnimPc,-1);
                    else ctx.fillStyle = data.datasets[i].pointColor;
                    if (typeof data.datasets[i].pointStrokeColor == "function")ctx.strokeStyle = data.datasets[i].pointStrokeColor("POINTSTROKECOLOR",data,config,i,-1,currentAnimPc,-1);
                    else ctx.strokeStyle = data.datasets[i].pointStrokeColor;

                    ctx.lineWidth = config.pointDotStrokeWidth;
                    for (var k = 0; k < data.datasets[i].data.length; k++) {
                      if (!(typeof(data.datasets[i].data[k])=='undefined')) {
                        ctx.beginPath();
                        ctx.arc(midPosX + currentAnimPc *(Math.cos(config.startAngle*Math.PI/180 - k * rotationDegree) * calculateOffset(config, data.datasets[i].data[k], calculatedScale, scaleHop)), midPosY - currentAnimPc * (Math.sin(config.startAngle*Math.PI/180 - k * rotationDegree) * calculateOffset(config, data.datasets[i].data[k], calculatedScale, scaleHop)), config.pointDotRadius, 2 * Math.PI, false);
                        ctx.fill();
                        ctx.stroke();
                      }
                    }

                }
            }
            ctx.restore();

		        if (animationDecimal >= 1 && config.inGraphDataShow) {
              for (var i = 0; i < data.datasets.length; i++) {
                  if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                  else lgtxt = "";
                
                  for (var j = 0; j < data.datasets[i].data.length; j++) {
                    if (!(typeof(data.datasets[i].data[j])=='undefined')) {
 
                       if (i == 0) divprev = 0;
                       else divprev = data.datasets[i].data[j] - data.datasets[i - 1].data[j];
                       if (i == data.datasets.length - 1) divnext = 0;
                       else divnext = data.datasets[i + 1].data[j] - data.datasets[i].data[j];
 
                       if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
                       else lgtxt2 = "";

  				        	   ctx.save();
   					           ctx.textAlign = config.inGraphDataAlign;
                       ctx.textBaseline = config.inGraphDataVAlign;

                         if(config.inGraphDataAlign=="off-center"){

                           if(config.inGraphDataRotate=="inRadiusAxis" || (config.startAngle*Math.PI/180-j * rotationDegree+4*Math.PI)%(2*Math.PI) > 3*Math.PI/2 || (config.startAngle*Math.PI/180-j * rotationDegree+4*Math.PI)%(2*Math.PI) <= Math.PI/2)ctx.textAlign = "left";
                           else ctx.textAlign="right";
                         }
                         else if(config.inGraphDataAlign=="to-center"){
                           if(config.inGraphDataRotate=="inRadiusAxis" || (config.startAngle*Math.PI/180-j * rotationDegree+4*Math.PI)%(2*Math.PI) > 3*Math.PI/2 || (config.startAngle*Math.PI/180-j * rotationDegree+4*Math.PI)%(2*Math.PI) < Math.PI/2)ctx.textAlign = "right";
                           else ctx.textAlign="left";
                         }
   					             else ctx.textAlign = config.inGraphDataAlign; 
                           
                         if(config.inGraphDataVAlign=="off-center"){
                            if((config.startAngle*Math.PI/180-j * rotationDegree+4*Math.PI)%(2*Math.PI)>Math.PI)ctx.textBaseline = "bottom";
                            else ctx.textBaseline = "top";
                         }
                         else if(config.inGraphDataVAlign=="to-center"){
                            if((config.startAngle*Math.PI/180-j * rotationDegree+4*Math.PI)%(2*Math.PI)>Math.PI)ctx.textBaseline = "top";
                            else ctx.textBaseline = "bottom";
                         }
                         else ctx.textBaseline = config.inGraphDataVAlign;

           	           ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
	    		             ctx.fillStyle = config.inGraphDataFontColor;

                       var radiusPrt;
                       if(config.inGraphDataRadiusPosition==1)radiusPrt=0+config.inGraphDataPaddingRadius;
                       else if(config.inGraphDataRadiusPosition==2)radiusPrt=(calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop))/2+config.inGraphDataPaddingRadius;
                       else if(config.inGraphDataRadiusPosition==3)radiusPrt=(calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop))+config.inGraphDataPaddingRadius;

                       ctx.translate(midPosX + Math.cos(config.startAngle*Math.PI/180 - j * rotationDegree) * radiusPrt, midPosY - Math.sin(config.startAngle*Math.PI/180 - j * rotationDegree) * radiusPrt);

                       if(config.inGraphDataRotate=="inRadiusAxis")ctx.rotate(j * rotationDegree);
                       else if(config.inGraphDataRotate=="inRadiusAxisRotateLabels"){
                          if ((j * rotationDegree+2*Math.PI)%(2*Math.PI)>Math.PI/2 && (j * rotationDegree+2*Math.PI)%(2*Math.PI)<3*Math.PI/2)ctx.rotate(3*Math.PI+j * rotationDegree);
                          else ctx.rotate(2*Math.PI+j * rotationDegree); 
                       } 
                       else ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));

                       var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,lgtxt2,config.fmtV2), v3 : fmtChartJS(config,1*data.datasets[i].data[j],config.fmtV3), v4 : fmtChartJS(config,divprev,config.fmtV4), v5 : fmtChartJS(config,divnext,config.fmtV5), v6 : fmtChartJS(config,maxvalue[j],config.fmtV6), v7 : fmtChartJS(config,totvalue[j],config.fmtV7), v8 : roundToWithThousands(config,fmtChartJS(config,100 * data.datasets[i].data[j] / totvalue[j],config.fmtV8),config.roundPct),v9 : fmtChartJS(config,midPosX + Math.cos(config.startAngle*Math.PI/180 - j * rotationDegree) * calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop),config.fmtV9),v10 : fmtChartJS(config,midPosY - Math.sin(config.startAngle*Math.PI/180 - j * rotationDegree) * calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop),config.fmtV10),v11 : fmtChartJS(config,i,config.fmtV11), v12 : fmtChartJS(config,j,config.fmtV12),data:data});
 	         
                       ctx.fillTextMultiLine(dispString,0,0,ctx.textBaseline,config.inGraphDataFontSize);
                       ctx.restore();              

                    }
                  }
              }
            }


        } ;
        function drawScale() {

            var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
            ctx.save();
            ctx.translate(midPosX, midPosY);
            
            ctx.rotate((90-config.startAngle)*Math.PI/180);
    
            if (config.angleShowLineOut) {
                ctx.strokeStyle = config.angleLineColor;
                ctx.lineWidth = config.angleLineWidth;
                for (var h = 0; h < data.datasets[0].data.length; h++) {

                    ctx.rotate(rotationDegree);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -maxSize);
                    ctx.stroke();
                }
            }

            for (var i = 0; i < calculatedScale.steps; i++) {
                ctx.beginPath();

                if (config.scaleShowLine) {
                    ctx.strokeStyle = config.scaleLineColor;
                    ctx.lineWidth = config.scaleLineWidth;
                    ctx.moveTo(0, -scaleHop * (i + 1));
                    for (var j = 0; j < data.datasets[0].data.length; j++) {
                        ctx.rotate(rotationDegree);
                        ctx.lineTo(0, -scaleHop * (i + 1));
                    }
                    ctx.closePath();
                    ctx.stroke();

                }
            }

            ctx.rotate(-(90-config.startAngle)*Math.PI/180);
            if (config.scaleShowLabels) {
              for (var i = 0; i < calculatedScale.steps; i++) {

                    ctx.textAlign = 'center';
                    ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
                    ctx.textBaseline = "middle";

                    if (config.scaleShowLabelBackdrop) {
                        var textWidth = ctx.measureTextMultiLine(calculatedScale.labels[i + 1],config.scaleFontSize).textWidth;
                        ctx.fillStyle = config.scaleBackdropColor;
                        ctx.beginPath();
                        ctx.rect(
              							Math.round(Math.cos(config.startAngle*Math.PI/180)* (scaleHop * (i + 1))-textWidth / 2 - config.scaleBackdropPaddingX),     //X
							              Math.round((-Math.sin(config.startAngle*Math.PI/180)*scaleHop * (i + 1)) - config.scaleFontSize * 0.5 - config.scaleBackdropPaddingY),//Y
							              Math.round(textWidth + (config.scaleBackdropPaddingX * 2)), //Width
							              Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY * 2)) //Height
            						);
                        ctx.fill();
                    }
                    ctx.fillStyle = config.scaleFontColor;
                    ctx.fillTextMultiLine(calculatedScale.labels[i + 1], Math.cos(config.startAngle*Math.PI/180)* (scaleHop * (i + 1)), -Math.sin(config.startAngle*Math.PI/180)*scaleHop * (i + 1),ctx.textBaseline,config.scaleFontSize);
                }
            }

            for (var k = 0; k < data.labels.length; k++) {
                ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize + "px " + config.pointLabelFontFamily;
                ctx.fillStyle = config.pointLabelFontColor;
                var opposite = Math.sin((90-config.startAngle)*Math.PI/180+rotationDegree * k) * (maxSize + config.pointLabelFontSize);
                var adjacent = Math.cos((90-config.startAngle)*Math.PI/180+rotationDegree * k) * (maxSize + config.pointLabelFontSize);

                var vangle=(90-config.startAngle)*Math.PI/180+rotationDegree * k;
                while(vangle<0)vangle=vangle+2*Math.PI;
                while(vangle>2*Math.PI)vangle=vangle-2*Math.PI;
               

                if (vangle == Math.PI || vangle == 0) {
                    ctx.textAlign = "center";
                }
                else if (vangle > Math.PI) {
                    ctx.textAlign = "right";
                }
                else {
                    ctx.textAlign = "left";
                }

                ctx.textBaseline = "middle";

                ctx.fillTextMultiLine(data.labels[k], opposite, -adjacent,ctx.textBaseline,config.pointLabelFontSize);

            }
            ctx.restore();
        };

        function calculateDrawingSizes() {
            var midX, mxlb,maxL,maxR,iter,nbiter,prevMaxSize,prevMidX;                        
            var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
            var rotateAngle=config.startAngle*Math.PI/180;

            // Compute range for Mid Point of graph
            ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize + "px " + config.pointLabelFontFamily;
            if(!config.graphMaximized) {
              maxR=msr.availableWidth/2;
              maxL=msr.availableWidth/2;
              nbiter=1;
            }
            else {
              maxR=msr.availableWidth/2;
              maxL=msr.availableWidth/2;
              nbiter=40;
              for (var i = 0; i < data.labels.length; i++) {
                var textMeasurement = ctx.measureTextMultiLine(data.labels[i],config.scaleFontSize).textWidth+ctx.measureTextMultiLine(data.labels[i],config.scaleFontSize).textHeight;
                mxlb=(msr.availableWidth-textMeasurement)/(1+Math.abs(Math.cos(rotateAngle)));
                if((rotateAngle < Math.PI/2 && rotateAngle > -Math.PI/2) || rotateAngle > 3*Math.PI/2){
                  if (mxlb<maxR)maxR=mxlb;
                }
                else if (Math.cos(rotateAngle) !=0){
                  if (mxlb<maxL)maxL=mxlb;
                }
                rotateAngle-=rotationDegree;                
              }
            }

            // compute max Radius and midPoint in that range
            prevMaxSize=0;
            prevMidX=0;
            midPosX=maxR+msr.rightNotUsableSize;
            for (midX=maxR,iter=0;iter<nbiter; ++iter, midX+=(msr.availableWidth-maxL-maxR)/nbiter){            
              maxSize=Max([midX,msr.availableWidth-midX]);
              var rotateAngle=config.startAngle*Math.PI/180;
              mxlb=msr.available;
              for (var i = 0; i < data.labels.length; i++) {
                var textMeasurement = ctx.measureTextMultiLine(data.labels[i],config.scaleFontSize).textWidth+ctx.measureTextMultiLine(data.labels[i],config.scaleFontSize).textHeight;
                if((rotateAngle < Math.PI/2 && rotateAngle > -Math.PI/2) || rotateAngle > 3*Math.PI/2){
                  mxlb=((msr.availableWidth-midX)- textMeasurement)/Math.abs(Math.cos(rotateAngle));
                }
                else if (Math.cos(rotateAngle!=0)){
                  mxlb=(midX- textMeasurement)/Math.abs(Math.cos(rotateAngle));
                }
                if (mxlb < maxSize)maxSize=mxlb;
                if(Math.sin(rotateAngle)*msr.availableHeight/2 > msr.availableHeight/2 - config.scaleFontSize*2){
                    mxlb=Math.sin(rotateAngle)*msr.availableHeight/2-1.5*config.scaleFontSize;
                    if(mxlb < maxSize)maxSize=mxlb;
                } 
                rotateAngle-=rotationDegree;                
              }
              if(maxSize>prevMaxSize){
                prevMaxSize=maxSize;
                midPosX=midX+msr.rightNotUsableSize;
              }
            }
            
            maxSize =prevMaxSize - config.scaleFontSize/2;      
            //If the label height is less than 5, set it to 5 so we don't have lines on top of each other.
            labelHeight = Default(labelHeight, 5);
        };


        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;

            for (var i = 0; i < data.datasets.length; i++) {
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    if (1*data.datasets[i].data[j] > upperValue) { upperValue = 1*data.datasets[i].data[j] }
                    if (1*data.datasets[i].data[j] < lowerValue) { lowerValue = 1*data.datasets[i].data[j] }
                }
            }

			if (Math.abs(upperValue - lowerValue)<0.00000001) {
				upperValue = Max([upperValue*2,1]);
				lowerValue = 0;
			}

            if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
            if (!isNaN(config.graphMax)) upperValue = config.graphMax;

            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));

            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            };
        }
    } ;


    var Pie = function (data, config, ctx) {
        var segmentTotal = 0;
        var msr, midPieX, midPieY,pieRadius;

        if(typeof ctx.ChartNewId == "undefined"){
          var cvdate = new Date();
          var cvmillsec = cvdate.getTime();
          ctx.ChartNewId="Pie_"+cvmillsec;
        }

        if (!dynamicFunction(data,config,ctx,"Pie"))return;

        while (config.startAngle < 0){config.startAngle+=360;}
        while (config.startAngle > 360){config.startAngle-=360;}

        config.logarithmic = false;

        var annotateCnt = 0;
        jsGraphAnnotate[ctx.ChartNewId] = new Array();

        defMouse(ctx,data,config,"Pie");

        //In case we have a canvas that is not a square. Minus 5 pixels as padding round the edge.

        setRect(ctx,config);

        msr = setMeasures(data, config, ctx, height, width, null, true, false, false, false,true);

//        midPieX = msr.leftNotUsableSize + (msr.availableWidth / 2);
//        midPieY = msr.topNotUsableSize + (msr.availableHeight / 2);
//        pieRadius = Min([msr.availableHeight / 2, msr.availableWidth / 2]) - 5;

        for (var i = 0; i < data.length; i++) {
            if (!(typeof(data[i].value)=='undefined'))segmentTotal += 1*data[i].value;
        }
        
        calculateDrawingSize();

        animationLoop(config, null, drawPieSegments, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPieX, midPieY, midPieX - pieRadius, midPieY + pieRadius, data);



        function drawPieSegments(animationDecimal) {



            var cumulativeAngle = -config.startAngle * (Math.PI / 180)+2*Math.PI ,
               cumvalue = 0,
			         scaleAnimation = 1,
			         rotateAnimation = 1;
               
            var realCumulativeAngle=config.startAngle* (Math.PI / 180)+2*Math.PI;
 
            while (cumulativeAngle < 0){cumulativeAngle+=2*Math.PI;}
            while (cumulativeAngle > 2*Math.PI){cumulativeAngle-=2*Math.PI;}

            while (realCumulativeAngle < 0){realCumulativeAngle+=2*Math.PI;}
            while (realCumulativeAngle > 2*Math.PI){realCumulativeAngle-=2*Math.PI;}

            if (config.animation) {
                if (config.animateScale) {
                    scaleAnimation = animationDecimal;
                }
                if (config.animateRotate) {
                    rotateAnimation = animationDecimal;
                }
            }
            if (animationDecimal >= 1) {
                totvalue = 0;
                for (var i = 0; i < data.length; i++) if (!(typeof(data[i].value)=='undefined'))totvalue += 1*data[i].value;
            }

            for (var i = 0; i < data.length; i++) {
              if (!(typeof(data[i].value)=='undefined')){                
                var segmentAngle = rotateAnimation * ((1*data[i].value / segmentTotal) * (Math.PI * 2));
                if(segmentAngle >= Math.PI*2)segmentAngle=Math.PI*2-0.001;  // bug on Android when segmentAngle is >= 2*PI;
                ctx.beginPath();
                ctx.arc(midPieX, midPieY, scaleAnimation * pieRadius, cumulativeAngle, cumulativeAngle+segmentAngle );

                ctx.lineTo(midPieX, midPieY);
                ctx.closePath();
                if (typeof data[i].color == "function")ctx.fillStyle = data[i].color("COLOR",data,config,i,-1,animationDecimal,data[i].value);
                else ctx.fillStyle = data[i].color;
                ctx.fill();
                cumulativeAngle += segmentAngle;
                
                cumvalue += 1*data[i].value;

                if (config.segmentShowStroke) {
                    ctx.lineWidth = config.segmentStrokeWidth;
                    ctx.strokeStyle = config.segmentStrokeColor;
                    ctx.stroke();
                }

                if (animationDecimal >= 1) {
                    if (typeof (data[i].title) == "string") lgtxt = data[i].title.trim();
                    else lgtxt = "";
                    jsGraphAnnotate[ctx.ChartNewId][annotateCnt++] = ["ARC", midPieX, midPieY, 0, pieRadius, cumulativeAngle - segmentAngle, cumulativeAngle, lgtxt, 1*data[i].value, cumvalue, totvalue, segmentAngle, i];


                    if (config.inGraphDataShow) {
                    
                         if(config.inGraphDataAnglePosition==1)posAngle=realCumulativeAngle+config.inGraphDataPaddingAngle*(Math.PI/180);
                         else if(config.inGraphDataAnglePosition==2)posAngle=realCumulativeAngle-segmentAngle/2+config.inGraphDataPaddingAngle*(Math.PI/180);
                         else if(config.inGraphDataAnglePosition==3)posAngle=realCumulativeAngle-segmentAngle+config.inGraphDataPaddingAngle*(Math.PI/180);

                         if(config.inGraphDataRadiusPosition==1)labelRadius=0+config.inGraphDataPaddingRadius;
                         else if(config.inGraphDataRadiusPosition==2)labelRadius=pieRadius/2+config.inGraphDataPaddingRadius;
                         else if(config.inGraphDataRadiusPosition==3)labelRadius=pieRadius+config.inGraphDataPaddingRadius;

                         realCumulativeAngle -= segmentAngle;

                         
  				        	     ctx.save();
           
                         if(config.inGraphDataAlign=="off-center"){
                           if(config.inGraphDataRotate=="inRadiusAxis" || (posAngle+2*Math.PI)%(2*Math.PI) > 3*Math.PI/2 || (posAngle+2*Math.PI)%(2*Math.PI) < Math.PI/2)ctx.textAlign = "left";
                           else ctx.textAlign="right";
                         }
                         else if(config.inGraphDataAlign=="to-center"){
                           if(config.inGraphDataRotate=="inRadiusAxis" || (posAngle+2*Math.PI)%(2*Math.PI) > 3*Math.PI/2 || (posAngle+2*Math.PI)%(2*Math.PI) < Math.PI/2)ctx.textAlign = "right";
                           else ctx.textAlign="left";
                         }
   					             else ctx.textAlign = config.inGraphDataAlign;  
                         if(config.inGraphDataVAlign=="off-center"){
                            if((posAngle+2*Math.PI)%(2*Math.PI)>Math.PI)ctx.textBaseline = "top";
                            else ctx.textBaseline = "bottom";
                         }
                         else if(config.inGraphDataVAlign=="to-center"){
                            if((posAngle+2*Math.PI)%(2*Math.PI)>Math.PI)ctx.textBaseline = "bottom";
                            else ctx.textBaseline = "top";
                         }
                         else ctx.textBaseline = config.inGraphDataVAlign;

           				       ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
	    		               ctx.fillStyle = config.inGraphDataFontColor;

                         var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,1*data[i].value,config.fmtV2), v3 : fmtChartJS(config,cumvalue,config.fmtV3), v4 : fmtChartJS(config,totvalue,config.fmtV4), v5 : fmtChartJS(config,segmentAngle,config.fmtV5), v6 : roundToWithThousands(config, fmtChartJS(config,100 * data[i].value / totvalue,config.fmtV6), config.roundPct), v7 : fmtChartJS(config,midPieX,config.fmtV7),v8 : fmtChartJS(config,midPieY,config.fmtV8),v9 : fmtChartJS(config,0,config.fmtV9),v10 : fmtChartJS(config,pieRadius,config.fmtV10),v11 : fmtChartJS(config,cumulativeAngle-segmentAngle,config.fmtV11),v12 : fmtChartJS(config,cumulativeAngle,config.fmtV12),v13 : fmtChartJS(config,i,config.fmtV13),data:data});
                         ctx.translate(midPieX + labelRadius*Math.cos(posAngle), midPieY - labelRadius*Math.sin(posAngle));
                         
                         if(config.inGraphDataRotate=="inRadiusAxis")ctx.rotate(2*Math.PI-posAngle);
                         else if(config.inGraphDataRotate=="inRadiusAxisRotateLabels")
                         {
                          if ((posAngle+2*Math.PI)%(2*Math.PI)>Math.PI/2 && (posAngle+2*Math.PI)%(2*Math.PI)<3*Math.PI/2)ctx.rotate(3*Math.PI-posAngle);
                          else ctx.rotate(2*Math.PI-posAngle); 
                         }
                         else ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));
  			     			       
                          ctx.fillTextMultiLine(dispString,0,0,ctx.textBaseline,config.inGraphDataFontSize);
                         ctx.restore();
                    }
                }
              }
            }
        };

        function calculateDrawingSize() {

            var lgtxt;

            var cumulativeAngle = -config.startAngle * (Math.PI / 180)+2*Math.PI ,
               cumvalue = 0;
 
            while (cumulativeAngle < 0){cumulativeAngle+=2*Math.PI;}
            while (cumulativeAngle > 2*Math.PI){cumulativeAngle-=2*Math.PI;}

            
            midPieX = msr.leftNotUsableSize + (msr.availableWidth / 2);
            midPieY = msr.topNotUsableSize + (msr.availableHeight / 2);
            pieRadius = Min([msr.availableHeight / 2, msr.availableWidth / 2]) - 5;


            // Computerange Pie Radius

            if(config.inGraphDataShow && config.inGraphDataRadiusPosition==3 && config.inGraphDataAlign=="off-center" && config.inGraphDataRotate==0) {
                pieRadius = Min([msr.availableHeight / 2, msr.availableWidth / 2]) - config.inGraphDataFontSize - config.inGraphDataPaddingRadius -5;
              
                var realCumulativeAngle=config.startAngle* (Math.PI / 180)+2*Math.PI;
 
                while (realCumulativeAngle < 0){realCumulativeAngle+=2*Math.PI;}
                while (realCumulativeAngle > 2*Math.PI){realCumulativeAngle-=2*Math.PI;}

                var totvalue = 0;
                for (var i = 0; i < data.length; i++) if (!(typeof(data[i].value)=='undefined'))totvalue += 1*data[i].value;

       			    ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
                var cumvalue=0;
                var posAngle;
                for (var i = 0; i < data.length; i++) {
                  if (!(typeof(data[i].value)=='undefined')) {
                  cumvalue += 1*data[i].value;
                  var segmentAngle = (1*data[i].value / segmentTotal) * (Math.PI * 2);
                  cumulativeAngle += segmentAngle;

                  if(config.inGraphDataAnglePosition==1)posAngle=realCumulativeAngle+config.inGraphDataPaddingAngle*(Math.PI/180);
                  else if(config.inGraphDataAnglePosition==2)posAngle=realCumulativeAngle-segmentAngle/2+config.inGraphDataPaddingAngle*(Math.PI/180);
                  else if(config.inGraphDataAnglePosition==3)posAngle=realCumulativeAngle-segmentAngle+config.inGraphDataPaddingAngle*(Math.PI/180);
                  realCumulativeAngle -= segmentAngle;

                  if (typeof (data[i].title) == "string") lgtxt = data[i].title.trim();
                  else lgtxt = "";
                  var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,1*data[i].value,config.fmtV2), v3 : fmtChartJS(config,cumvalue,config.fmtV3), v4 : fmtChartJS(config,totvalue,config.fmtV4), v5 : fmtChartJS(config,segmentAngle,config.fmtV5), v6 : roundToWithThousands(config, fmtChartJS(config,100 * data[i].value / totvalue,config.fmtV6), config.roundPct), v7 : fmtChartJS(config,midPieX,config.fmtV7),v8 : fmtChartJS(config,midPieY,config.fmtV8),v9 : fmtChartJS(config,0,config.fmtV9),v10 : fmtChartJS(config,pieRadius,config.fmtV10),v11 : fmtChartJS(config,cumulativeAngle-segmentAngle,config.fmtV11),v12 : fmtChartJS(config,cumulativeAngle,config.fmtV12),v13 : fmtChartJS(config,i,config.fmtV13),data:data});
                  var textMeasurement = ctx.measureText(dispString).width;
                
                  var MaxRadiusX=  Math.abs((msr.availableWidth / 2 - textMeasurement)/Math.cos(posAngle))-config.inGraphDataPaddingRadius -5;
                  if(MaxRadiusX<pieRadius)pieRadius=MaxRadiusX;
                  }
                }

            }
            pieRadius=pieRadius*config.radiusScale;


        };


    } ;

    var Doughnut = function (data, config, ctx) {
        var segmentTotal = 0;
        var msr, midPieX, midPieY, doughnutRadius;

        if(typeof ctx.ChartNewId == "undefined"){
          var cvdate = new Date();
          var cvmillsec = cvdate.getTime();
          ctx.ChartNewId="Doughnut_"+cvmillsec;
        }


        if (!dynamicFunction(data,config,ctx,"Doughnut"))return;
        
        var realCumulativeAngle=config.startAngle* (Math.PI / 180)+2*Math.PI;

        while (config.startAngle < 0){config.startAngle+=360;}
        while (config.startAngle > 360){config.startAngle-=360;}

        while (realCumulativeAngle < 0){realCumulativeAngle+=2*Math.PI;}
        while (realCumulativeAngle > 2*Math.PI){realCumulativeAngle-=2*Math.PI;}


        config.logarithmic = false;


        var annotateCnt = 0;
        jsGraphAnnotate[ctx.ChartNewId] = new Array();

        defMouse(ctx,data,config,"Doughnut");

        setRect(ctx,config);
        msr = setMeasures(data, config, ctx, height, width, null, true, false, false, false,true);

        calculateDrawingSize();

        var cutoutRadius = doughnutRadius * (config.percentageInnerCutout / 100);

        for (var i = 0; i < data.length; i++) {
            if (!(typeof(data[i].value)=='undefined'))segmentTotal += 1*data[i].value;
        }


        animationLoop(config, null, drawPieSegments, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, midPieX, midPieY, midPieX - doughnutRadius, midPieY + doughnutRadius, data);

        function drawPieSegments(animationDecimal) {
            var cumulativeAngle = -config.startAngle * (Math.PI / 180)+2*Math.PI ,
               cumvalue = 0,
			         scaleAnimation = 1,
			         rotateAnimation = 1;
 
            while (cumulativeAngle < 0){cumulativeAngle+=2*Math.PI;}
            while (cumulativeAngle > 2*Math.PI){cumulativeAngle-=2*Math.PI;}

          if (config.animation) {
                if (config.animateScale) {
                    scaleAnimation = animationDecimal;
                }
                if (config.animateRotate) {
                    rotateAnimation = animationDecimal;
                }
            }

            if (animationDecimal >= 1) {
                totvalue = 0;
                for (var i = 0; i < data.length; i++) if (!(typeof(data[i].value)=='undefined'))totvalue += 1*data[i].value;
            }

            for (var i = 0; i < data.length; i++) {
              if (!(typeof(data[i].value)=='undefined')){    
                var segmentAngle = rotateAnimation * ((1*data[i].value / segmentTotal) * (Math.PI * 2));
                if(segmentAngle >= Math.PI*2)segmentAngle=Math.PI*2-0.001;  // but on Android when segmentAngle is >= 2*PI;
                ctx.beginPath();
                ctx.arc(midPieX, midPieY, scaleAnimation * doughnutRadius, cumulativeAngle, cumulativeAngle + segmentAngle, false);
                ctx.arc(midPieX, midPieY, scaleAnimation * cutoutRadius, cumulativeAngle + segmentAngle, cumulativeAngle, true);
                ctx.closePath();
                if (typeof data[i].color == "function")ctx.fillStyle = data[i].color("COLOR",data,config,i,-1,animationDecimal,data[i].value);
                else ctx.fillStyle = data[i].color;
                ctx.fill();

                cumulativeAngle += segmentAngle;
                cumvalue += 1*data[i].value;

                if (config.segmentShowStroke) {
                    ctx.lineWidth = config.segmentStrokeWidth;
                    ctx.strokeStyle = config.segmentStrokeColor;
                    ctx.stroke();
                }

                if (animationDecimal >= 1) {
                    if (typeof (data[i].title) == "string") lgtxt = data[i].title.trim();
                    else lgtxt = "";

                    jsGraphAnnotate[ctx.ChartNewId][annotateCnt++] = ["ARC", midPieX, midPieY, cutoutRadius, doughnutRadius, cumulativeAngle - segmentAngle, cumulativeAngle, lgtxt, 1*data[i].value, cumvalue, totvalue, segmentAngle, i];
                    if (config.inGraphDataShow) {
                    
                         if(config.inGraphDataAnglePosition==1)posAngle=realCumulativeAngle+config.inGraphDataPaddingAngle*(Math.PI/180);
                         else if(config.inGraphDataAnglePosition==2)posAngle=realCumulativeAngle-segmentAngle/2+config.inGraphDataPaddingAngle*(Math.PI/180);
                         else if(config.inGraphDataAnglePosition==3)posAngle=realCumulativeAngle-segmentAngle+config.inGraphDataPaddingAngle*(Math.PI/180);

                         if(config.inGraphDataRadiusPosition==1)labelRadius=cutoutRadius+config.inGraphDataPaddingRadius;
                         else if(config.inGraphDataRadiusPosition==2)labelRadius=cutoutRadius+(doughnutRadius-cutoutRadius)/2+config.inGraphDataPaddingRadius;
                         else if(config.inGraphDataRadiusPosition==3)labelRadius=doughnutRadius+config.inGraphDataPaddingRadius;

                         realCumulativeAngle -= segmentAngle;

                         
  				        	     ctx.save();
                         
                        if(config.inGraphDataAlign=="off-center"){
                           if(config.inGraphDataRotate=="inRadiusAxis" || (posAngle+2*Math.PI)%(2*Math.PI) > 3*Math.PI/2 || (posAngle+2*Math.PI)%(2*Math.PI) < Math.PI/2)ctx.textAlign = "left";
                           else ctx.textAlign="right";
                         }
                         else if(config.inGraphDataAlign=="to-center"){
                           if(config.inGraphDataRotate=="inRadiusAxis" || (posAngle+2*Math.PI)%(2*Math.PI) > 3*Math.PI/2 || (posAngle+2*Math.PI)%(2*Math.PI) < Math.PI/2)ctx.textAlign = "right";
                           else ctx.textAlign="left";
                         }
   					             else ctx.textAlign = config.inGraphDataAlign;  
                         if(config.inGraphDataVAlign=="off-center"){
                            if((posAngle+2*Math.PI)%(2*Math.PI)>Math.PI)ctx.textBaseline = "top";
                            else ctx.textBaseline = "bottom";
                         }
                         else if(config.inGraphDataVAlign=="to-center"){
                            if((posAngle+2*Math.PI)%(2*Math.PI)>Math.PI)ctx.textBaseline = "bottom";
                            else ctx.textBaseline = "top";
                         }
                         else ctx.textBaseline = config.inGraphDataVAlign;

           				       ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
	    		               ctx.fillStyle = config.inGraphDataFontColor;

                         var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,1*data[i].value,config.fmtV2), v3 : fmtChartJS(config,cumvalue,config.fmtV3), v4 : fmtChartJS(config,totvalue,config.fmtV4), v5 : fmtChartJS(config,segmentAngle,config.fmtV5), v6 : roundToWithThousands(config, fmtChartJS(config,100 * data[i].value / totvalue,config.fmtV6), config.roundPct), v7 : fmtChartJS(config,midPieX,config.fmtV7),v8 : fmtChartJS(config,midPieY,config.fmtV8),v9 : fmtChartJS(config,cutoutRadius,config.fmtV9),v10 : fmtChartJS(config,doughnutRadius,config.fmtV10),v11 : fmtChartJS(config,cumulativeAngle-segmentAngle,config.fmtV11),v12 : fmtChartJS(config,cumulativeAngle,config.fmtV12),v13 : fmtChartJS(config,i,config.fmtV13)});
                         ctx.translate(midPieX + labelRadius*Math.cos(posAngle), midPieY - labelRadius*Math.sin(posAngle));

                         if(config.inGraphDataRotate=="inRadiusAxis")ctx.rotate(2*Math.PI-posAngle);
                         else if(config.inGraphDataRotate=="inRadiusAxisRotateLabels")
                         {
                          if ((posAngle+2*Math.PI)%(2*Math.PI)>Math.PI/2 && (posAngle+2*Math.PI)%(2*Math.PI)<3*Math.PI/2)ctx.rotate(3*Math.PI-posAngle);
                          else ctx.rotate(2*Math.PI-posAngle); 
                         }
                         else ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));
  			     			       ctx.fillTextMultiLine(dispString,0,0,ctx.textBaseline,config.inGraphDataFontSize);
                         ctx.restore();
                    }


                }
              }
            }
        } ;

        function calculateDrawingSize() {

            var lgtxt;
            var cumulativeAngle = -config.startAngle * (Math.PI / 180)+2*Math.PI ,
               cumvalue = 0;
 
            while (cumulativeAngle < 0){cumulativeAngle+=2*Math.PI;}
            while (cumulativeAngle > 2*Math.PI){cumulativeAngle-=2*Math.PI;}
            
            midPieX = msr.leftNotUsableSize + (msr.availableWidth / 2);
            midPieY = msr.topNotUsableSize + (msr.availableHeight / 2);
            doughnutRadius = Min([msr.availableHeight / 2, msr.availableWidth / 2]) - 5;


            // Computerange Pie Radius

            if(config.inGraphDataShow && config.inGraphDataRadiusPosition==3 && config.inGraphDataAlign=="off-center" && config.inGraphDataRotate==0) {
                doughnutRadius = Min([msr.availableHeight / 2, msr.availableWidth / 2]) - config.inGraphDataFontSize - config.inGraphDataPaddingRadius -5;
              
                var realCumulativeAngle=config.startAngle* (Math.PI / 180)+2*Math.PI;
 
                while (realCumulativeAngle < 0){realCumulativeAngle+=2*Math.PI;}
                while (realCumulativeAngle > 2*Math.PI){realCumulativeAngle-=2*Math.PI;}

                var totvalue = 0;
                for (var i = 0; i < data.length; i++) if (!(typeof(data[i].value)=='undefined'))totvalue += 1*data[i].value;

       			    ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
                var posAngle;
                var cumulativeAngle=0;
                for (var i = 0; i < data.length; i++) {
                  if (!(typeof(data[i].value)=='undefined')){
                  cumvalue += 1*data[i].value;
                  var segmentAngle = (1*data[i].value / segmentTotal) * (Math.PI * 2);
                  cumulativeAngle += segmentAngle;

                  if(config.inGraphDataAnglePosition==1)posAngle=realCumulativeAngle+config.inGraphDataPaddingAngle*(Math.PI/180);
                  else if(config.inGraphDataAnglePosition==2)posAngle=realCumulativeAngle-segmentAngle/2+config.inGraphDataPaddingAngle*(Math.PI/180);
                  else if(config.inGraphDataAnglePosition==3)posAngle=realCumulativeAngle-segmentAngle+config.inGraphDataPaddingAngle*(Math.PI/180);
                  realCumulativeAngle -= segmentAngle;

                  if (typeof (data[i].title) == "string") lgtxt = data[i].title.trim();
                  else lgtxt = "";
                  var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,1*data[i].value,config.fmtV2), v3 : fmtChartJS(config,cumvalue,config.fmtV3), v4 : fmtChartJS(config,totvalue,config.fmtV4), v5 : fmtChartJS(config,segmentAngle,config.fmtV5), v6 : roundToWithThousands(config, fmtChartJS(config,100 * data[i].value / totvalue,config.fmtV6), config.roundPct), v7 : fmtChartJS(config,midPieX,config.fmtV7),v8 : fmtChartJS(config,midPieY,config.fmtV8),v9 : fmtChartJS(config,cutoutRadius,config.fmtV9),v10 : fmtChartJS(config,doughnutRadius,config.fmtV10),v11 : fmtChartJS(config,cumulativeAngle-segmentAngle,config.fmtV11),v12 : fmtChartJS(config,cumulativeAngle,config.fmtV12),v13 : fmtChartJS(config,i,config.fmtV13),data:data});
                  var textMeasurement = ctx.measureText(dispString).width;
                
                  var MaxRadiusX=  Math.abs((msr.availableWidth / 2 - textMeasurement)/Math.cos(posAngle))-config.inGraphDataPaddingRadius - 5;
                  if(MaxRadiusX<doughnutRadius)doughnutRadius=MaxRadiusX;
                  }
                }

            }
            doughnutRadius=doughnutRadius*config.radiusScale;


        };


    } ;

    var Line = function (data, config, ctx) {
   
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, rotateLabels = 0, msr;
        var annotateCnt = 0;



        if(typeof ctx.ChartNewId == "undefined"){
          var cvdate = new Date();
          var cvmillsec = cvdate.getTime();
          ctx.ChartNewId="Line_"+cvmillsec;
        }


        // adapt data when length is 1;
        var mxlgt=0;
        for (var i = 0; i < data.datasets.length; i++) mxlgt=Max([mxlgt,data.datasets[i].data.length]);
        if(mxlgt==1)
        {
            if(typeof(data.labels[0])=="string")data.labels=["",data.labels[0],""];
            for (var i = 0; i < data.datasets.length; i++) 
            {
              if(typeof(data.datasets[i].data[0]!="undefined"))data.datasets[i].data=[undefined,data.datasets[i].data[0],undefined];
            }
        }
        

        if (!dynamicFunction(data,config,ctx,"Line"))return;

        jsGraphAnnotate[ctx.ChartNewId] = new Array();

        defMouse(ctx,data,config,"Line");

        setRect(ctx,config);
        
        msr = setMeasures(data, config, ctx, height, width, [""], false, false, true, true,config.datasetFill);

        valueBounds = getValueBounds();

        // true or fuzzy (error for negativ values (included 0))
        if (config.logarithmic !== false) {
            if (valueBounds.minValue <= 0) {
                config.logarithmic = false;
            }
        }

        // Check if logarithmic is meanigful
        var OrderOfMagnitude = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue)));
        if ((config.logarithmic == 'fuzzy' && OrderOfMagnitude < 4) || config.scaleOverride) {
            config.logarithmic = false;
        }

        //Check and set the scale
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";

        if (!config.scaleOverride) {
            calculatedScale = calculateScale(config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, false, false, true, true,config.datasetFill);
        }
        else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                graphMax: config.scaleStartValue+config.scaleSteps*config.scaleStepWidth,
                labels: []
            }
            populateLabels(config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, calculatedScale.graphMax, config.scaleStepWidth);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, false, false, true, true,config.datasetFill);
        }
        msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
        msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;
		var inGraphDataHeight = 0;
		if (config.inGraphDataShow) {
			// values are at the top of the bars and must be visible padding-top:2px
			inGraphDataHeight = (config.inGraphDataTmpl.split("\n").length)*config.inGraphDataFontSize+2;
			msr.availableHeight -= inGraphDataHeight;
		}
		
        scaleHop = Math.floor(msr.availableHeight / calculatedScale.steps);
        valueHop = Math.floor(msr.availableWidth / (data.labels.length - 1));
        if(valueHop ==0)valueHop = (msr.availableWidth / (data.labels.length - 1));

        msr.clrwidth=msr.clrwidth-(msr.availableWidth-(data.labels.length - 1) * valueHop);
        msr.availableWidth = (data.labels.length - 1) * valueHop;
        msr.availableHeight = (calculatedScale.steps) * scaleHop;

        yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
        xAxisPosY = msr.topNotUsableSize + msr.availableHeight + inGraphDataHeight + config.scaleTickSizeTop;

        drawLabels();
        var zeroY = 0;
        if (valueBounds.minValue < 0) {
            var zeroY = calculateOffset(config, 0, calculatedScale, scaleHop);
        }


        animationLoop(config, drawScale, drawLines, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);
        
        function drawLines(animPc) {
        	drawLinesDataset(animPc,data,config,ctx,
							 {xAxisPosY:xAxisPosY,yAxisPosX:yAxisPosX,valueHop:valueHop,scaleHop:scaleHop,
							  zeroY:zeroY,calculatedScale:calculatedScale,annotateCnt:annotateCnt});
          		  if (animPc >= 1) {
          			  if (typeof drawMath == "function") {
				              drawMath(ctx,config,data,msr,{xAxisPosY:xAxisPosY,yAxisPosX:yAxisPosX,valueHop:valueHop,scaleHop:scaleHop,
							                 zeroY:zeroY,calculatedScale:calculatedScale,calculateOffset:calculateOffset});
			            }
		            }
        } ;

        function drawScale() {

            //X axis line                                                          

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
            ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY);

            ctx.stroke();

            for (var i = 0; i < data.labels.length; i++) {
                ctx.beginPath();
                ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
                ctx.lineWidth = config.scaleGridLineWidth;
                ctx.strokeStyle = config.scaleGridLineColor;

                //Check i isnt 0, so we dont go over the Y axis twice.

                if (config.scaleShowGridLines && i > 0 && i % config.scaleXGridLinesStep==0 ) {
                    ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
                }
                else {
                    ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
                }
                ctx.stroke();
            }

            //Y axis

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
            ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
            ctx.stroke();

            for (var j = 0 ; j < calculatedScale.steps; j++) {
               ctx.beginPath();
               ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
               ctx.lineWidth = config.scaleGridLineWidth;
               ctx.strokeStyle = config.scaleGridLineColor;
               if (config.scaleShowGridLines && j % config.scaleYGridLinesStep==0 ) {
                   ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY - ((j + 1) * scaleHop));
               }
               else {
                   ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
               }
               ctx.stroke();
            }
        } ;

        function drawLabels() {
            ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;

            //X Labels     
            if(config.xAxisTop || config.xAxisBottom) {                                                    
              ctx.textBaseline = "top";
              if (msr.rotateLabels > 90) {
                  ctx.save();
                  ctx.textAlign = "left";
              }
              else if (msr.rotateLabels > 0) {
                  ctx.save();
                  ctx.textAlign = "right";
              }
              else {
                  ctx.textAlign = "center";
            
              }
              ctx.fillStyle = config.scaleFontColor;

              if(config.xAxisBottom){
                for (var i = 0; i < data.labels.length; i++) {
                  ctx.save();
                  if (msr.rotateLabels > 0) {
                    ctx.translate(yAxisPosX + i * valueHop - msr.highestXLabel/2, msr.xLabelPos);
                    ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
                    ctx.fillTextMultiLine(fmtChartJS(config,data.labels[i],config.fmtXLabel), 0, 0,ctx.textBaseline,config.scaleFontSize);
                  }
                  else {
                    ctx.fillTextMultiLine(fmtChartJS(config,data.labels[i],config.fmtXLabel), yAxisPosX + i * valueHop, msr.xLabelPos,ctx.textBaseline,config.scaleFontSize);
                  }
                ctx.restore();
                }
              }
            }

            //Y Labels

            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            for (var j = ((config.showYAxisMin) ? -1 : 0) ; j < calculatedScale.steps; j++) {
                if (config.scaleShowLabels) {
                    if (config.yAxisLeft) {
                        ctx.textAlign = "right";
                        ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop),ctx.textBaseline,config.scaleFontSize);
                    }
                    if (config.yAxisRight) {
                        ctx.textAlign = "left";
                        ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop),ctx.textBaseline,config.scaleFontSize);
                    }
                }
            }
        } ;

        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            for (var i = 0; i < data.datasets.length; i++) {
        				var mathFctName = data.datasets[i].drawMathDeviation;
				        var mathValueHeight = 0;
				        if (typeof eval(mathFctName) == "function") {
					         var parameter = {data:data,datasetNr: i};
					         mathValueHeight = window[mathFctName](parameter);
			          }
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    if (1*data.datasets[i].data[j]+mathValueHeight > upperValue) { upperValue = 1*data.datasets[i].data[j]+mathValueHeight };
                    if (1*data.datasets[i].data[j]-mathValueHeight < lowerValue) { lowerValue = 1*data.datasets[i].data[j]-mathValueHeight };

                }
            };

			if (Math.abs(upperValue - lowerValue)<0.00000001) {
				upperValue = Max([upperValue*2,1]);
				lowerValue = 0;
			}

            // AJOUT CHANGEMENT
            if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
            if (!isNaN(config.graphMax)) upperValue = config.graphMax;

      			labelHeight = config.scaleFontSize;
            scaleHeight = msr.availableHeight;

            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));

            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            };
        };
    } ;

    var StackedBar = function (data, config, ctx) {
    
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0, msr;

        if(typeof ctx.ChartNewId == "undefined"){
          var cvdate = new Date();
          var cvmillsec = cvdate.getTime();
          ctx.ChartNewId="StackedBar_"+cvmillsec;
        }

        if (!dynamicFunction(data,config,ctx,"StackedBar"))return;

        config.logarithmic = false;

        var annotateCnt = 0;
        jsGraphAnnotate[ctx.ChartNewId] = new Array();

        defMouse(ctx,data,config,"StackedBar");

        setRect(ctx,config);

        msr = setMeasures(data, config, ctx, height, width, [""], true, false, true, true,true);
        valueBounds = getValueBounds();
        //Check and set the scale
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
        if (!config.scaleOverride) {
            calculatedScale = calculateScale(config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, false, true, true,true);
        }
        else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                labels: []
            }
            for (var i = 0; i < calculatedScale.steps; i++) {
                if (labelTemplateString) {
                    calculatedScale.labels.push(tmpl(labelTemplateString, { value: fmtChartJS(config,1 * ((config.scaleStartValue + (config.scaleStepWidth * (i + 1))).toFixed(getDecimalPlaces(config.scaleStepWidth))),config.fmtYLabel) }));
                }
            }
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, false, true, true,true);
        }

        msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
        msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;

        scaleHop = Math.floor(msr.availableHeight / calculatedScale.steps);
        valueHop = Math.floor(msr.availableWidth / (data.labels.length));
        if(valueHop ==0)valueHop = (msr.availableWidth / (data.labels.length - 1));

        msr.clrwidth=msr.clrwidth - (msr.availableWidth - ((data.labels.length) * valueHop));
        msr.availableWidth = (data.labels.length) * valueHop;
        msr.availableHeight = (calculatedScale.steps) * scaleHop;

        yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
        xAxisPosY = msr.topNotUsableSize + msr.availableHeight + config.scaleTickSizeTop;

        barWidth = (valueHop - config.scaleGridLineWidth * 2 - (config.barValueSpacing * 2) - (config.barDatasetSpacing * data.datasets.length - 1) - (config.barStrokeWidth / 2) - 1);

        drawLabels();
        animationLoop(config, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);

        function drawBars(animPc) {
            ctx.lineWidth = config.barStrokeWidth;
            var yStart = new Array(data.datasets.length);
            var yFpt = new Array(data.datasets.length);

            var cumvalue = new Array();
            var totvalue = new Array();
            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) { cumvalue[j] = 0; totvalue[j] = 0; } }
            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) if (!(typeof(data.datasets[i].data[j])=='undefined')) { totvalue[j] += 1*data.datasets[i].data[j]; } }

            for (var i = 0; i < data.datasets.length; i++) {
//                ctx.fillStyle = data.datasets[i].fillColor;
//                ctx.strokeStyle = data.datasets[i].strokeColor;
                if (animPc >= 1) {
                    if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                    else lgtxt = "";
                }

                 for (var j = 0; j < data.datasets[i].data.length; j++) {
                     var currentAnimPc = animationCorrection(animPc,data,config,i,j,1).animVal;
                     if(currentAnimPc>1)currentAnimPc=currentAnimPc-1;

                     ctx.fillStyle=config.defaultFillColor;
                     if (typeof data.datasets[i].fillColor == "function")ctx.fillStyle = data.datasets[i].fillColor("FILLCOLOR",data,config,i,j,currentAnimPc,1*data.datasets[i].data[j]);
                     else if(typeof(data.datasets[i].fillColor)=="string"){ctx.fillStyle = data.datasets[i].fillColor;}
                     else if(typeof(data.datasets[i].fillColor)=="object"){if(typeof(data.datasets[i].fillColor[0])=="string"){ctx.fillStyle = data.datasets[i].fillColor[Min([data.datasets[i].fillColor.length-1,j])];} }
                     
                     ctx.strokeStyle=config.defaultStrokeColor;
                     if (typeof data.datasets[i].strokeColor == "function")ctx.strokeStyle = data.datasets[i].strokeColor("STROKECOLOR",data,config,i,j,currentAnimPc,1*data.datasets[i].data[j]);
                     else if(typeof(data.datasets[i].strokeColor)=="string"){ctx.strokeStyle = data.datasets[i].strokeColor;}
                     else if(typeof(data.datasets[i].strokeColor)=="object"){if(typeof(data.datasets[i].strokeColor[0])=="string"){ctx.strokeStyle = data.datasets[i].strokeColor[Min([data.datasets[i].strokeColor.length-1,j])];} }

                     if(i==0) {yStart[j]=0;yFpt[j]=-1;}
                     if (!(typeof(data.datasets[i].data[j])=='undefined')) {
                        var barOffset = yAxisPosX + config.barValueSpacing + valueHop * j;
                        ctx.beginPath();
                        ctx.moveTo(barOffset, xAxisPosY - yStart[j] + 1);
                        ctx.lineTo(barOffset, xAxisPosY - currentAnimPc * calculateOffset(config, (yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2) - yStart[j]);
                        ctx.lineTo(barOffset + barWidth, xAxisPosY - currentAnimPc * calculateOffset(config, (yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2) - yStart[j]);
                        ctx.lineTo(barOffset + barWidth, xAxisPosY - yStart[j] + 1);
                        if (config.barShowStroke) ctx.stroke();
                        ctx.closePath();
                        ctx.fill();
                        cumvalue[j] += 1*data.datasets[i].data[j];
                        if (animPc >= 1) {
                         if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
                         else lgtxt2 = "";
                         jsGraphAnnotate[ctx.ChartNewId][annotateCnt++] = ["RECT", barOffset, xAxisPosY - yStart[j] + 1, barOffset + barWidth, xAxisPosY - calculateOffset(config, (yFpt[j]>=0)* calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2) - yStart[j], lgtxt, lgtxt2, 1*data.datasets[i].data[j], cumvalue[j], totvalue[j], i, j];
                        }
                        yStart[j] += currentAnimPc * calculateOffset(config, (yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, scaleHop) - (config.barStrokeWidth / 2);
                        if (yFpt[j]==-1)yFpt[j]=i;
                     }
                }
            }
            
        if(animPc >=1 && config.inGraphDataShow) {

            var yPos =0, xPos=0;
            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) { cumvalue[j] = 0; } }

            for (var i = 0; i < data.datasets.length; i++) {
                if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                else lgtxt = "";
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    if(i==0) {yStart[j]=0;yFpt[j]=-1;}
                    if (!(typeof(data.datasets[i].data[j])=='undefined')) {
                   			ctx.save();
             	          ctx.textAlign = config.inGraphDataAlign;
                        ctx.textBaseline = config.inGraphDataVAlign;
				                ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
   			                ctx.fillStyle = config.inGraphDataFontColor;

                        if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
                        else lgtxt2 = "";

                        cumvalue[j] += 1+data.datasets[i].data[j];
                        var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,lgtxt2,config.fmtV2), v3 : fmtChartJS(config,1*data.datasets[i].data[j],config.fmtV3), v4 : fmtChartJS(config,cumvalue[j],config.fmtV4), v5 : fmtChartJS(config,totvalue[j],config.fmtV5), v6 : roundToWithThousands(config,fmtChartJS(config,100 * data.datasets[i].data[j] / totvalue[j],config.fmtV6),config.roundPct),v7 : fmtChartJS(config,barOffset,config.fmtV7),v8 : fmtChartJS(config,xAxisPosY,config.fmtV8),v9 : fmtChartJS(config,barOffset + barWidth,config.fmtV9),v10 : fmtChartJS(config,xAxisPosY - calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2),config.fmtV10),v11 : fmtChartJS(config,i,config.fmtV11), v12 : fmtChartJS(config,j,config.fmtV12),data:data});
 
                        var barOffset = yAxisPosX + config.barValueSpacing + valueHop * j;
                        ctx.beginPath();

                        ctx.beginPath();
                        yPos =0;
                        xPos=0;

                        if(config.inGraphDataXPosition==1) { xPos=barOffset+config.inGraphDataPaddingX; } 
                        else if(config.inGraphDataXPosition==2) { xPos=barOffset+barWidth/2+config.inGraphDataPaddingX ;}
                        else if(config.inGraphDataXPosition==3) { xPos=barOffset+barWidth+config.inGraphDataPaddingX;} 
                        if(config.inGraphDataYPosition==1) { yPos=xAxisPosY - yStart[j] - config.inGraphDataPaddingY; }
                        else if(config.inGraphDataYPosition==2) { yPos=xAxisPosY -(calculateOffset(config, (yFpt[j]>=0)*calculatedScale.graphMin +1*data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2) )/2 - yStart[j] - config.inGraphDataPaddingY; }
                        else if(config.inGraphDataYPosition==3) { yPos=xAxisPosY -calculateOffset(config, (yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2)  - yStart[j] - config.inGraphDataPaddingY; }

                        ctx.translate(xPos,yPos);

                        ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));
   	    		            ctx.fillTextMultiLine(dispString,0,0,ctx.textBaseline,config.inGraphDataFontSize);
    			    	        ctx.restore();

                        yStart[j] += currentAnimPc * calculateOffset(config, (yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, scaleHop) - (config.barStrokeWidth / 2);
                        if (yFpt[j]==-1)yFpt[j]=i;
                    }
                }
              }
            }
        } ;

        function drawScale() {

            //X axis line                                                          

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
            ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY);
            ctx.stroke();

            for (var i = 0; i < data.labels.length; i++) {
                ctx.beginPath();
                ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
                ctx.lineWidth = config.scaleGridLineWidth;
                ctx.strokeStyle = config.scaleGridLineColor;

                //Check i isnt 0, so we dont go over the Y axis twice.
                if (config.scaleShowGridLines && i>0 && i % config.scaleXGridLinesStep==0 ) {
                    ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
                }
                else {
                    ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
                }
                ctx.stroke();
            }

            //Y axis

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
            ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
            ctx.stroke();

            for (var j = ((config.showYAxisMin) ? -1 : 0) ; j < calculatedScale.steps; j++) {
               ctx.beginPath();
               ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
               ctx.lineWidth = config.scaleGridLineWidth;
               ctx.strokeStyle = config.scaleGridLineColor;
               if (config.scaleShowGridLines && j % config.scaleYGridLinesStep==0 ) {
                   ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY - ((j + 1) * scaleHop));
               }
               else {
                   ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
               }
               ctx.stroke();
            }
        } ;

        function drawLabels() {
            ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;

            //X axis labels                                                          

            if(config.xAxisTop || config.xAxisBottom) {                                                    

              ctx.textBaseline = "top";
              if (msr.rotateLabels > 90) {
                  ctx.save();
                  ctx.textAlign = "left";
              }
              else if (msr.rotateLabels > 0) {
                  ctx.save();
                  ctx.textAlign = "right";
              }
              else {
                  ctx.textAlign = "center";
              }
              ctx.fillStyle = config.scaleFontColor;

              if(config.xAxisBottom){
                for (var i = 0; i < data.labels.length; i++) {
                    ctx.save();
                    if (msr.rotateLabels > 0) {
                        ctx.translate(yAxisPosX + i * valueHop + (barWidth / 2)- msr.highestXLabel/2, msr.xLabelPos);
                        ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
                        ctx.fillTextMultiLine(fmtChartJS(config,data.labels[i],config.fmtXLabel), 0, 0,ctx.textBaseline,config.scaleFontSize);
                    }
                    else {
                        ctx.fillTextMultiLine(fmtChartJS(config,data.labels[i],config.fmtXLabel), yAxisPosX + i * valueHop + (barWidth / 2), msr.xLabelPos,ctx.textBaseline,config.scaleFontSize);
                    }
                    ctx.restore();
                }
              }
            }

            //Y axis

            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            for (var j = ((config.showYAxisMin) ? -1 : 0) ; j < calculatedScale.steps; j++) {
                if (config.scaleShowLabels) {
                    if (config.yAxisLeft) {
                        ctx.textAlign = "right";
                        ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop),ctx.textBaseline,config.scaleFontSize);
                    }
                    if (config.yAxisRight) {
                        ctx.textAlign = "left";
                        ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop),ctx.textBaseline,config.scaleFontSize);
                    }
                }
            }
        } ;

        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;

            var minvl = new Array(data.datasets.length);
            var maxvl = new Array(data.datasets.length);

            for (var i = 0; i < data.datasets.length; i++) {
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    var k = i;
                    var temp=0;
                    if (!(typeof(data.datasets[0].data[j])=='undefined')){
                      temp += 1*data.datasets[0].data[j];
                      if (temp > upperValue) { upperValue = temp; };
                      if (temp < lowerValue) { lowerValue = temp; };
                    }
                    while (k > 0) { //get max of stacked data
                        if (!(typeof(data.datasets[k].data[j])=='undefined')) {
                          temp += 1*data.datasets[k].data[j];
                          if (temp > upperValue) { upperValue = temp; };
                          if (temp < lowerValue) { lowerValue = temp; };
                        }
                        k--;
                    }
                }
            };


            // AJOUT CHANGEMENT
            if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
            if (!isNaN(config.graphMax)) upperValue = config.graphMax;

      			if (Math.abs(upperValue - lowerValue)<0.00000001) {
			       	upperValue = Max([upperValue*2,1]);
				      lowerValue = 0;
			      }
            
      			labelHeight = config.scaleFontSize;
            scaleHeight = msr.availableHeight;

            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));

            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            };
        } ;
    } ;

    var HorizontalStackedBar = function (data, config, ctx) {
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0, msr;

        if(typeof ctx.ChartNewId == "undefined"){
          var cvdate = new Date();
          var cvmillsec = cvdate.getTime();
          ctx.ChartNewId="HorizontalStackedBar_"+cvmillsec;
        }

        if (!dynamicFunction(data,config,ctx,"HorizontalStackedBar"))return;

        config.logarithmic = false;

        var annotateCnt = 0;
        jsGraphAnnotate[ctx.ChartNewId] = new Array();

        defMouse(ctx,data,config,"HorizontalStackedBar");

        setRect(ctx,config);
        valueBounds = getValueBounds();
        //Check and set the scale
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";

        if (!config.scaleOverride) {
            calculatedScale = calculateScale(config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, true, true, true,true);
        }
        else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                labels: []
            }

            for (var i = 0; i < calculatedScale.steps; i++) {
                if (labelTemplateString) {
                    calculatedScale.labels.push(tmpl(labelTemplateString, { value: fmtChartJS(config,1 * ((config.scaleStartValue + (config.scaleStepWidth * (i + 1))).toFixed(getDecimalPlaces(config.scaleStepWidth))),config.fmtYLabel) }));
                }
            }
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, true, true, true,true);
        }

        msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
        msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;

        scaleHop = Math.floor(msr.availableHeight / data.labels.length);
        valueHop = Math.floor(msr.availableWidth / (calculatedScale.steps));
        if(valueHop ==0)valueHop = (msr.availableWidth / (data.labels.length - 1));

        msr.clrwidth=msr.clrwidth - (msr.availableWidth - (calculatedScale.steps * valueHop));
        msr.availableWidth = (calculatedScale.steps) * valueHop;
        msr.availableHeight = (data.labels.length) * scaleHop;

        yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
        xAxisPosY = msr.topNotUsableSize + msr.availableHeight + config.scaleTickSizeTop;

        barWidth = (scaleHop - config.scaleGridLineWidth * 2 - (config.barValueSpacing * 2) - (config.barDatasetSpacing * data.datasets.length - 1) - (config.barStrokeWidth / 2) - 1);

        drawLabels();
        animationLoop(config, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);

        function HorizontalCalculateOffset(val, calculatedScale, scaleHop) {

            var outerValue = calculatedScale.steps * calculatedScale.stepValue;
            var adjustedValue = val - calculatedScale.graphMin;
            var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);

            return (scaleHop * calculatedScale.steps) * scalingFactor;
        } ;

        function drawBars(animPc) {
            ctx.lineWidth = config.barStrokeWidth;
            var yStart = new Array(data.datasets.length);
            var yFpt = new Array(data.datasets.length);

            var cumvalue = new Array();
            var totvalue = new Array();
            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) { cumvalue[j] = 0; totvalue[j] = 0; } }
            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) if (!(typeof(data.datasets[i].data[j])=='undefined')) { totvalue[j] += 1*data.datasets[i].data[j]; } }

            for (var i = 0; i < data.datasets.length; i++) {
//                ctx.fillStyle = data.datasets[i].fillColor;
//                ctx.strokeStyle = data.datasets[i].strokeColor;
                if (animPc >= 1) {
                    if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                    else lgtxt = "";
                }
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                      var currentAnimPc = animationCorrection(animPc,data,config,i,j,1).animVal;
                      if(currentAnimPc>1)currentAnimPc=currentAnimPc-1;
 
                      ctx.fillStyle=config.defaultFillColor;
                      if (typeof data.datasets[i].fillColor == "function")ctx.fillStyle = data.datasets[i].fillColor("FILLCOLOR",data,config,i,j,currentAnimPc,1*data.datasets[i].data[j]);
                      else if(typeof(data.datasets[i].fillColor)=="string"){ctx.fillStyle = data.datasets[i].fillColor;}
                      else if(typeof(data.datasets[i].fillColor)=="object"){if(typeof(data.datasets[i].fillColor[0])=="string"){ctx.fillStyle = data.datasets[i].fillColor[Min([data.datasets[i].fillColor.length-1,j])];} }
                      
                      ctx.strokeStyle=config.defaultStrokeColor;
                      if (typeof data.datasets[i].strokeColor == "function")ctx.strokeStyle = data.datasets[i].strokeColor("STROKECOLOR",data,config,i,j,currentAnimPc,1*data.datasets[i].data[j]);
                      else if(typeof(data.datasets[i].strokeColor)=="string"){ctx.strokeStyle = data.datasets[i].strokeColor;}
                      else if(typeof(data.datasets[i].strokeColor)=="object"){if(typeof(data.datasets[i].strokeColor[0])=="string"){ctx.strokeStyle = data.datasets[i].strokeColor[Min([data.datasets[i].strokeColor.length-1,j])];} }

                      if(i==0) {yStart[j]=0;yFpt[j]=-1;}
                      if (!(typeof(data.datasets[i].data[j])=='undefined')) {

                        var barOffset = xAxisPosY + config.barValueSpacing - scaleHop * (j + 1);
                        ctx.beginPath();
                        ctx.moveTo(yAxisPosX + yStart[j] + 1, barOffset);
                        ctx.lineTo(yAxisPosX + yStart[j] + currentAnimPc * HorizontalCalculateOffset((yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2), barOffset);
                        ctx.lineTo(yAxisPosX + yStart[j] + currentAnimPc * HorizontalCalculateOffset((yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2), barOffset + barWidth);
                        ctx.lineTo(yAxisPosX + yStart[j] + 1, barOffset + barWidth);
                        ctx.lineTo(yAxisPosX + yStart[j] + 1, barOffset);

                        if (config.barShowStroke) ctx.stroke();
                        ctx.closePath();
                        ctx.fill();

                        cumvalue[j] += 1*data.datasets[i].data[j];
                        if (animPc >= 1) {
                            if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
                            else lgtxt2 = "";
                            jsGraphAnnotate[ctx.ChartNewId][annotateCnt++] = ["RECT", yAxisPosX + yStart[j] + 1, barOffset + barWidth, yAxisPosX + yStart[j] + HorizontalCalculateOffset((yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2), barOffset, lgtxt, lgtxt2, 1*data.datasets[i].data[j], cumvalue[j], totvalue[j], i, j];
                        }
                        yStart[j] += currentAnimPc * HorizontalCalculateOffset((yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2);
                        if (yFpt[j]==-1)yFpt[j]=i;
                     }
                }
            }
        if(animPc >=1 && config.inGraphDataShow) {

            var yPos =0, xPos=0;
            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) { cumvalue[j] = 0; } }

            for (var i = 0; i < data.datasets.length; i++) {
                if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                else lgtxt = "";
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                      if(i==0) {yStart[j]=0;yFpt[j]=-1;}                  			
                      if (!(typeof(data.datasets[i].data[j])=='undefined')) {
                        ctx.save();
                	      ctx.textAlign = config.inGraphDataAlign;
                        ctx.textBaseline = config.inGraphDataVAlign;
						            ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
       			            ctx.fillStyle = config.inGraphDataFontColor;

                        if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
                        else lgtxt2 = "";
                        var barOffset = xAxisPosY + config.barValueSpacing - scaleHop * (j + 1);
                        cumvalue[j] += data.datasets[i].data[j];
                        var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,lgtxt2,config.fmtV2), v3 : fmtChartJS(config,1*data.datasets[i].data[j],config.fmtV3), v4 : fmtChartJS(config,cumvalue[j],config.fmtV4), v5 : fmtChartJS(config,totvalue[j],config.fmtV5), v6 : roundToWithThousands(config,fmtChartJS(config,100 *  data.datasets[i].data[j] / totvalue[j],config.fmtV6),config.roundPct),v7 : fmtChartJS(config,yAxisPosX,config.fmtV7),v8 : fmtChartJS(config,barOffset + barWidth,config.fmtV8),v9 : fmtChartJS(config,yAxisPosX + HorizontalCalculateOffset(data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2),config.fmtV9),v10 : fmtChartJS(config,barOffset,config.fmtV10),v11 : fmtChartJS(config,i,config.fmtV11), v12 : fmtChartJS(config,j,config.fmtV12),data:data});

                        ctx.beginPath();
                        yPos =0;
                        xPos=0;

                        if(config.inGraphDataXPosition==1) { xPos=yAxisPosX + yStart[j] + 1 +config.inGraphDataPaddingX; } 
                        else if(config.inGraphDataXPosition==2) { xPos=yAxisPosX + yStart[j] + (HorizontalCalculateOffset((yFpt[j]>=0)*calculatedScale.graphMin+1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2))/2+config.inGraphDataPaddingX ;}
                        else if(config.inGraphDataXPosition==3) { xPos=yAxisPosX + yStart[j] + HorizontalCalculateOffset((yFpt[j]>=0)*calculatedScale.graphMin+1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2) +config.inGraphDataPaddingX ;}
                        if(config.inGraphDataYPosition==1) { yPos=barOffset + barWidth - config.inGraphDataPaddingY; }
                        else if(config.inGraphDataYPosition==2) { yPos=barOffset + barWidth/2- config.inGraphDataPaddingY; }
                        else if(config.inGraphDataYPosition==3) { yPos=barOffset- config.inGraphDataPaddingY; }

                        ctx.translate(xPos,yPos);

                        ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));
						 	          ctx.fillTextMultiLine(dispString,0,0,ctx.textBaseline,config.inGraphDataFontSize);
					    	        ctx.restore();


                        yStart[j] += currentAnimPc * HorizontalCalculateOffset((yFpt[j]>=0)*calculatedScale.graphMin + 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2);
                        if (yFpt[j]==-1)yFpt[j]=i;                  
                      }
                }
              }
            }

        } ;

        function drawScale() {

            //X axis line                                                          

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
            ctx.lineTo(yAxisPosX + msr.availableWidth, xAxisPosY);
            ctx.stroke();

            for (var i = ((config.showYAxisMin) ? -1 : 0) ; i < calculatedScale.steps; i++) {
                if (i >= 0) {
                    ctx.beginPath();
                    ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
                    ctx.lineWidth = config.scaleGridLineWidth;
                    ctx.strokeStyle = config.scaleGridLineColor;

                    //Check i isnt 0, so we dont go over the Y axis twice.
                    if (config.scaleShowGridLines && i>0 && i % config.scaleXGridLinesStep==0 ) {
                        ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
                    }
                    else {
                        ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
                    }
                    ctx.stroke();
                }
            }

            //Y axis

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
            ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
            ctx.stroke();

            for (var j = 0; j < data.labels.length; j++) {
                ctx.beginPath();
                ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
                ctx.lineWidth = config.scaleGridLineWidth;
                ctx.strokeStyle = config.scaleGridLineColor;
                if (config.scaleShowGridLines &&  j % config.scaleYGridLinesStep==0 ) {
                    ctx.lineTo(yAxisPosX + msr.availableWidth, xAxisPosY - ((j + 1) * scaleHop));
                }
                else {
                    ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
                }
                ctx.stroke();
            }
        } ;

        function drawLabels() {
            ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;

            //X axis line                                                          

            if(config.xAxisTop || config.xAxisBottom) {                                                    
              ctx.textBaseline = "top";
              if (msr.rotateLabels > 90) {
                  ctx.save();
                  ctx.textAlign = "left";
              }
              else if (msr.rotateLabels > 0) {
                  ctx.save();
                  ctx.textAlign = "right";
             }
              else {
                  ctx.textAlign = "center";
              }
              ctx.fillStyle = config.scaleFontColor;

              if(config.xAxisBottom){
                for (var i = ((config.showYAxisMin) ? -1 : 0) ; i < calculatedScale.steps; i++) {
                    ctx.save();
                    if (msr.rotateLabels > 0) {
                        ctx.translate(yAxisPosX + (i + 1) * valueHop- msr.highestXLabel/2, msr.xLabelPos);
                        ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
                        ctx.fillTextMultiLine(calculatedScale.labels[i + 1], 0, 0,ctx.textBaseline,config.scaleFontSize);
                   }
                   else {
                      ctx.fillTextMultiLine(calculatedScale.labels[i + 1], yAxisPosX + ((i + 1) * valueHop), msr.xLabelPos,ctx.textBaseline,config.scaleFontSize);
                   }
                   ctx.restore();
                }
              }
            }

            //Y axis

            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            for (var j = 0; j < data.labels.length; j++) {
                if (config.scaleShowLabels) {
                    if (config.yAxisLeft) {
                        ctx.textAlign = "right";
                        ctx.fillTextMultiLine(fmtChartJS(config,data.labels[j],config.fmtXLabel), yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop) + barWidth / 2,ctx.textBaseline,config.scaleFontSize);
                    }
                    if (config.yAxisRight) {
                        ctx.textAlign = "left";
                        ctx.fillTextMultiLine(fmtChartJS(config,data.labels[j],config.fmtXLabel), yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop) + barWidth / 2,ctx.textBaseline,config.scaleFontSize);
                    }
                }
            }
        } ;

        function getValueBounds() {
           var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;

            var minvl = new Array(data.datasets.length);
            var maxvl = new Array(data.datasets.length);

            for (var i = 0; i < data.datasets.length; i++) {
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    var k = i;
                    var temp=0;
                    if (!(typeof(data.datasets[0].data[j])=='undefined')){
                      temp += 1*data.datasets[0].data[j];
                      if (temp > upperValue) { upperValue = temp; };
                      if (temp < lowerValue) { lowerValue = temp; };
                    }
                    while (k > 0) { //get max of stacked data
                        if (!(typeof(data.datasets[k].data[j])=='undefined')) {
                          temp += 1*data.datasets[k].data[j];
                          if (temp > upperValue) { upperValue = temp; };
                          if (temp < lowerValue) { lowerValue = temp; };
                        }
                        k--;
                    }
                }
            };


            // AJOUT CHANGEMENT
            if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
            if (!isNaN(config.graphMax)) upperValue = config.graphMax;

			if (Math.abs(upperValue - lowerValue)<0.00000001) {
				upperValue = Max([upperValue*2,1]);
				lowerValue = 0;
			}


            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));

            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            };
        };
    } ;

    var Bar = function (data, config, ctx) {
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0, msr;
        var annotateCnt = 0;

        if(typeof ctx.ChartNewId == "undefined"){
          var cvdate = new Date();
          var cvmillsec = cvdate.getTime();
          ctx.ChartNewId="Bar_"+cvmillsec;
        }

		// for BarLineCharts
		var nrOfBars = data.datasets.length;
		
		var nrOfLines = 0;
		var lineDatasets = [];
		var barDatasets = [];
		for (var i = 0; i < data.datasets.length; i++) {
			if (data.datasets[i].type == "Line") {
				nrOfLines++;
				lineDatasets.push(i);
			} else {
				barDatasets.push(i);
			}
		}

		// change the order (at first all bars then the lines) (form of BubbleSort)
		var bufferDataset,l = 0;
		for (var i = data.datasets.length-1; i >= 0; i--) {
			if (lineDatasets.indexOf(i) >= 0) {
				l++;
				for (var b = i; b < data.datasets.length-l; b++) {
					bufferDataset = data.datasets[b+1];
					data.datasets[b+1] = data.datasets[b];
					data.datasets[b] = bufferDataset;
				}
				
			}
		}
	
		
		nrOfBars -= nrOfLines;
		
		
		
        if (!dynamicFunction(data,config,ctx,"Bar"))return;
        
        jsGraphAnnotate[ctx.ChartNewId] = new Array();

        defMouse(ctx,data,config,"Bar");

        setRect(ctx,config);
        
        
        msr = setMeasures(data, config, ctx, height, width, [""], true, false, true, true,true);
        valueBounds = getValueBounds();
		

        // true or fuzzy (error for negativ values (included 0))
        if (config.logarithmic !== false) {
            if (valueBounds.minValue <= 0) {
                config.logarithmic = false;
            }
        }

        // Check if logarithmic is meanigful
        var OrderOfMagnitude = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue)));
        if ((config.logarithmic == 'fuzzy' && OrderOfMagnitude < 4) || config.scaleOverride) {
            config.logarithmic = false;
        }

        //Check and set the scale
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";

        if (!config.scaleOverride) {
            calculatedScale = calculateScale(config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, false, true, true,true);
        }
        else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                graphMax: config.scaleStartValue+config.scaleSteps*config.scaleStepWidth,
                labels: []
            }
            populateLabels(config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, calculatedScale.graphMax, config.scaleStepWidth);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, false, true, true,true);
        }

        msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
        msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;
		var inGraphDataHeight = 0;
		if (config.inGraphDataShow) {
			// values are at the top of the bars and must be visible padding-top:2px
			inGraphDataHeight = (config.inGraphDataTmpl.split("\n").length)*config.inGraphDataFontSize+2;
			msr.availableHeight -= inGraphDataHeight;
		}
		
        scaleHop = Math.floor(msr.availableHeight / calculatedScale.steps);
        valueHop = Math.floor(msr.availableWidth / (data.labels.length));
        if(valueHop ==0)valueHop = (msr.availableWidth / (data.labels.length - 1));

        msr.clrwidth=msr.clrwidth - (msr.availableWidth - ((data.labels.length) * valueHop));
        msr.availableWidth = (data.labels.length) * valueHop;
        msr.availableHeight = (calculatedScale.steps) * scaleHop;
		

        yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
        xAxisPosY = msr.topNotUsableSize + msr.availableHeight + inGraphDataHeight  + config.scaleTickSizeTop;
		
		
        barWidth = (valueHop - config.scaleGridLineWidth * 2 - (config.barValueSpacing * 2) - (config.barDatasetSpacing * nrOfBars - 1) - ((config.barStrokeWidth / 2) * nrOfBars - 1)) / nrOfBars;

        var zeroY = 0;
        if (valueBounds.minValue < 0) {
            var zeroY = calculateOffset(config, 0, calculatedScale, scaleHop);
        }

        drawLabels();
        animationLoop(config, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);

        function drawBars(animPc) {
            var t1, t2, t3;

            var cumvalue = new Array();
            var totvalue = new Array();
            for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					cumvalue[j] = 0;
					totvalue[j] = 0; 
				}
			}
            for (var i = 0; i < data.datasets.length; i++) {
				for (var j = 0; j < data.datasets[i].data.length; j++) {
					if (!(typeof(data.datasets[i].data[j])=='undefined')) { 
						totvalue[j] += 1*data.datasets[i].data[j]; 
					}
				}
			}

            ctx.lineWidth = config.barStrokeWidth;
            for (var i = 0; i < data.datasets.length; i++) {
				if (data.datasets[i].type == "Line") {
					var lineData = {datasets:[],labels:data.labels};
					lineData.datasets.push(data.datasets[i]);
					lineConfig = mergeChartConfig(config, {datasetFill: data.datasets[i].fill})
				   	drawLinesDataset(animPc,lineData,lineConfig,ctx,
									 {xAxisPosY:xAxisPosY,
									  yAxisPosX:yAxisPosX + config.barValueSpacing+ 
									  (barWidth + config.barDatasetSpacing/2 + config.barStrokeWidth)*nrOfBars/2,
									  valueHop:valueHop,scaleHop:scaleHop,
									  zeroY:zeroY,calculatedScale:calculatedScale,annotateCnt:annotateCnt});
					continue; // next dataset
				}
      
                if (animPc >= 1) {
                    if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                    else lgtxt = "";
                }

                for (var j = 0; j < data.datasets[i].data.length; j++) {
                  
                  var currentAnimPc = animationCorrection(animPc,data,config,i,j,1).animVal;
                  if(currentAnimPc>1)currentAnimPc=currentAnimPc-1;
                  ctx.fillStyle=config.defaultFillColor;
                  if (typeof data.datasets[i].fillColor == "function") { 
					  ctx.fillStyle = data.datasets[i].fillColor("FILLCOLOR",data,config,i,j,currentAnimPc,1*data.datasets[i].data[j]);
				  }
                  else if(typeof(data.datasets[i].fillColor)=="string") {
					  ctx.fillStyle = data.datasets[i].fillColor;
				  }
                  else if(typeof(data.datasets[i].fillColor)=="object") { 
					  if(typeof(data.datasets[i].fillColor[0])=="string") {
						  ctx.fillStyle = data.datasets[i].fillColor[Min([data.datasets[i].fillColor.length-1,j])];
					  } 
				  }
                  
                  ctx.strokeStyle=config.defaultStrokeColor;
                  if (typeof data.datasets[i].strokeColor == "function") {
					  ctx.strokeStyle = data.datasets[i].strokeColor("STROKECOLOR",data,config,i,j,CurrentAnimPc,1*data.datasets[i].data[j]);
				  }
                  else if(typeof(data.datasets[i].strokeColor)=="string"){
					  ctx.strokeStyle = data.datasets[i].strokeColor;
				  }
                  else if(typeof(data.datasets[i].strokeColor)=="object"){
					  if(typeof(data.datasets[i].strokeColor[0])=="string"){
						  ctx.strokeStyle = data.datasets[i].strokeColor[Min([data.datasets[i].strokeColor.length-1,j])];
					  } 
				  }

                  if (!(typeof(data.datasets[i].data[j])=='undefined')) {
                    var barOffset = yAxisPosX + config.barValueSpacing + valueHop * j + barWidth * i + config.barDatasetSpacing * i + config.barStrokeWidth * i;

                    var barHeight = currentAnimPc*(calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, scaleHop)-zeroY) + (config.barStrokeWidth / 2);
              			roundRect( ctx, barOffset, xAxisPosY-zeroY, barWidth, barHeight, config.barShowStroke, config.barBorderRadius);

                    cumvalue[j] += 1*data.datasets[i].data[j];
                    if (animPc >= 1) {
                        if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
                        else lgtxt2 = "";
                        t1 = xAxisPosY - zeroY;
                        t2 = xAxisPosY - calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2);
                        if (t1 < t2) { t3 = t1; t1 = t2; t2 = t3 }
                        jsGraphAnnotate[ctx.ChartNewId][annotateCnt++] = ["RECT", barOffset, t1, barOffset + barWidth, t2, lgtxt, lgtxt2,
																		  1*data.datasets[i].data[j], cumvalue[j], totvalue[j], i, j];
                    }
                  }
                }
            }

            if(animPc >=1 && config.inGraphDataShow) {
              for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) { cumvalue[j] = 0; } }

              for (var i = 0; i < data.datasets.length; i++) {
                if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                else lgtxt = "";

                for (var j = 0; j < data.datasets[i].data.length; j++) {
				  if (data.datasets[i].type == "Line") { // no inGraphDataShow for lines again (is inside drawLinesDataset)
					continue; 
				  }
					
                  if (!(typeof(data.datasets[i].data[j])=='undefined')) {
                    if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();

              			ctx.save();
                	  ctx.textAlign = config.inGraphDataAlign;
                    ctx.textBaseline = config.inGraphDataVAlign;
						        ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
       			        ctx.fillStyle = config.inGraphDataFontColor;

                    var barOffset = yAxisPosX + config.barValueSpacing + valueHop * j + barWidth * i + config.barDatasetSpacing * i + config.barStrokeWidth * i;
                    t1 = xAxisPosY - zeroY;
                    t2 = xAxisPosY - calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2);

                    ctx.beginPath();
                    var yPos =0, xPos=0;

                    if(config.inGraphDataXPosition==1) { xPos=barOffset+config.inGraphDataPaddingX; } 
                    else if(config.inGraphDataXPosition==2) { xPos=barOffset+barWidth/2+config.inGraphDataPaddingX ;}
                    else if(config.inGraphDataXPosition==3) { xPos=barOffset+barWidth+config.inGraphDataPaddingX;} 
                    if(config.inGraphDataYPosition==1) { yPos=xAxisPosY - zeroY- config.inGraphDataPaddingY; }
                    else if(config.inGraphDataYPosition==2) {
						yPos=xAxisPosY -(calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, scaleHop) + 
										 (config.barStrokeWidth / 2))/2- config.inGraphDataPaddingY; 
					}
                    else if(config.inGraphDataYPosition==3) {
						yPos=xAxisPosY -calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, scaleHop) + 
										(config.barStrokeWidth / 2)- config.inGraphDataPaddingY; 
					}
                    
                    ctx.translate(xPos,yPos);
       
                    cumvalue[j] += 1*data.datasets[i].data[j];
       
                    var dispString = tmplbis(config.inGraphDataTmpl,
											 { config:config, 
											  v1 : fmtChartJS(config,lgtxt,config.fmtV1),
											  v2 : fmtChartJS(config,lgtxt2,config.fmtV2),
											  v3 : fmtChartJS(config,1*data.datasets[i].data[j],config.fmtV3),
											  v4 : fmtChartJS(config,cumvalue[j],config.fmtV4),
											  v5 : fmtChartJS(config,totvalue[j],config.fmtV5), 
											  v6 : roundToWithThousands(config,fmtChartJS(config,
																	100 * data.datasets[i].data[j] / totvalue[j],config.fmtV6),config.roundPct),
											  v7 : fmtChartJS(config,barOffset,config.fmtV7),
											  v8 : fmtChartJS(config,t1,config.fmtV8),
											  v9 : fmtChartJS(config,barOffset + barWidth,config.fmtV9),
											  v10 : fmtChartJS(config,t2,config.fmtV10),
											  v11 : fmtChartJS(config,i,config.fmtV11),
											  v12 : fmtChartJS(config,j,config.fmtV12), data: data});
                    ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));
       			        ctx.fillTextMultiLine(dispString,0,0,ctx.textBaseline,config.inGraphDataFontSize);
					    	    ctx.restore();

                  }
                }
              }
                
            }

			 if (animPc >= 1) {
				  if (typeof drawMath == "function") {
					  drawMath(ctx,config,data,msr,{xAxisPosY:xAxisPosY,yAxisPosX:yAxisPosX,valueHop:valueHop,scaleHop:scaleHop,
									 zeroY:zeroY,calculatedScale:calculatedScale,calculateOffset:calculateOffset,barWidth:barWidth});
					}
				}

        } ;

        function roundRect(ctx, x, y, w, h, stroke, radius ) {

  		    ctx.beginPath();
			    ctx.moveTo(x + radius, y);
			    ctx.lineTo(x + w - radius, y);
			    ctx.quadraticCurveTo(x + w, y, x + w, y);
			    ctx.lineTo(x + w, y - h + radius);
			    ctx.quadraticCurveTo(x + w, y - h, x + w - radius, y - h);
			    ctx.lineTo(x + radius, y - h);
			    ctx.quadraticCurveTo(x, y - h, x, y - h + radius);
			    ctx.lineTo(x, y );
			    ctx.quadraticCurveTo(x, y, x + radius, y);
			    if(stroke)ctx.stroke();
			    ctx.closePath();
			    ctx.fill();
        } ;

        function drawScale() {

            //X axis line                                                          

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
            ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY);
            ctx.stroke();

            for (var i = 0; i < data.labels.length; i++) {
                ctx.beginPath();
                ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
                ctx.lineWidth = config.scaleGridLineWidth;
                ctx.strokeStyle = config.scaleGridLineColor;

                //Check i isnt 0, so we dont go over the Y axis twice.
                if (config.scaleShowGridLines && i>0 && i % config.scaleXGridLinesStep==0 ) {
                    ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
                }
                else {
                    ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
                }
                ctx.stroke();
            }

            //Y axis

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
            ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
            ctx.stroke();

            for (var j = 0 ; j < calculatedScale.steps; j++) {
               ctx.beginPath();
               ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
               ctx.lineWidth = config.scaleGridLineWidth;
               ctx.strokeStyle = config.scaleGridLineColor;
               if (config.scaleShowGridLines && j % config.scaleYGridLinesStep==0 ) {
                   ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY - ((j + 1) * scaleHop));
               }
               else {
                   ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
               }
               ctx.stroke();
            }
        } ;

        function drawLabels() {
            ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;

            //X axis line                                                          
            if(config.xAxisTop || config.xAxisBottom) {                                                    
              ctx.textBaseline = "top";
              if (msr.rotateLabels > 90) {
                  ctx.save();
                  ctx.textAlign = "left";
              }
              else if (msr.rotateLabels > 0) {
                  ctx.save();
                  ctx.textAlign = "right";
              }
              else {
                  ctx.textAlign = "center";
              }
              ctx.fillStyle = config.scaleFontColor;

              if(config.xAxisBottom){
                for (var i = 0; i < data.labels.length; i++) {
                    ctx.save();
                    if (msr.rotateLabels > 0) {
                        ctx.translate(yAxisPosX + i * valueHop + (valueHop / 2)- msr.highestXLabel/2, msr.xLabelPos);
                        ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
                        ctx.fillTextMultiLine(fmtChartJS(config,data.labels[i],config.fmtXLabel), 0, 0,ctx.textBaseline,config.scaleFontSize);
                    }
                    else {
                        ctx.fillTextMultiLine(fmtChartJS(config,data.labels[i],config.fmtXLabel), yAxisPosX + i * valueHop + (valueHop / 2), msr.xLabelPos,ctx.textBaseline,config.scaleFontSize);
                    }
                    ctx.restore();
                 }
              }
            }

            //Y axis

            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            for (var j = ((config.showYAxisMin) ? -1 : 0) ; j < calculatedScale.steps; j++) {
                if (config.scaleShowLabels) {
                    if (config.yAxisLeft) {
                        ctx.textAlign = "right";
                        ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop),ctx.textBaseline,config.scaleFontSize);
                    }
                    if (config.yAxisRight) {
                        ctx.textAlign = "left";
                        ctx.fillTextMultiLine(calculatedScale.labels[j + 1], yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop),ctx.textBaseline,config.scaleFontSize);
                    }
                }
            }
        } ;

        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            for (var i = 0; i < data.datasets.length; i++) {
        				var mathFctName = data.datasets[i].drawMathDeviation;
				        var mathValueHeight = 0;
				        if (typeof eval(mathFctName) == "function") {
					         var parameter = {data:data,datasetNr: i};
					         mathValueHeight = window[mathFctName](parameter);
			          }
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    if (1*data.datasets[i].data[j]+mathValueHeight > upperValue) { upperValue = 1*data.datasets[i].data[j]+mathValueHeight };
                    if (1*data.datasets[i].data[j]-mathValueHeight < lowerValue) { lowerValue = 1*data.datasets[i].data[j]-mathValueHeight };

                }
            };

			if (Math.abs(upperValue - lowerValue)<0.00000001) {
				upperValue = Max([upperValue*2,1]);
				lowerValue = 0;
			}

            // AJOUT CHANGEMENT
            if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
            if (!isNaN(config.graphMax)) upperValue = config.graphMax;

      			labelHeight = config.scaleFontSize;
            scaleHeight = msr.availableHeight;

            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));

            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            };
        } ;
    } ;

    var HorizontalBar = function (data, config, ctx) {

        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0, msr;

        if(typeof ctx.ChartNewId == "undefined"){
          var cvdate = new Date();
          var cvmillsec = cvdate.getTime();
          ctx.ChartNewId="HorizontalBar_"+cvmillsec;
        }

        if (!dynamicFunction(data,config,ctx,"HorizontalBar"))return;

        var annotateCnt = 0;
        jsGraphAnnotate[ctx.ChartNewId] = new Array();

        defMouse(ctx,data,config,"HorizontalBar");

        setRect(ctx,config);
        valueBounds = getValueBounds();
        //Check and set the scale
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";

        if (!config.scaleOverride) {
            calculatedScale = calculateScale(config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, true, true, true,true);
        }
        else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                graphMax: config.scaleStartValue+config.scaleSteps*config.scaleStepWidth,
                labels: []
            }
            populateLabels(config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, calculatedScale.graphMax, config.scaleStepWidth);
            msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, true, true, true, true,true);
        }

        msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
        msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;

        scaleHop = Math.floor(msr.availableHeight / data.labels.length);
        valueHop = Math.floor(msr.availableWidth / (calculatedScale.steps));
        if(valueHop ==0)valueHop = (msr.availableWidth / (data.labels.length - 1));

        msr.clrwidth=msr.clrwidth - (msr.availableWidth - (calculatedScale.steps * valueHop));
        msr.availableWidth = (calculatedScale.steps) * valueHop;
        msr.availableHeight = (data.labels.length) * scaleHop;

        yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
        xAxisPosY = msr.topNotUsableSize + msr.availableHeight + config.scaleTickSizeTop;

        barWidth = (scaleHop - config.scaleGridLineWidth * 2 - (config.barValueSpacing * 2) - (config.barDatasetSpacing * data.datasets.length - 1) - ((config.barStrokeWidth / 2) * data.datasets.length - 1)) / data.datasets.length;

        var zeroY = 0;
        if (valueBounds.minValue < 0) {
            var zeroY = calculateOffset(config, 0, calculatedScale, valueHop);
        }

        drawLabels();
        animationLoop(config, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);

        function drawBars(animPc) {
            var cumvalue = new Array();
            var totvalue = new Array();
            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) { cumvalue[j] = 0; totvalue[j] = 0; } }
            for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) if (!(typeof(data.datasets[i].data[j])=='undefined'))totvalue[j] += 1*data.datasets[i].data[j]; }

            ctx.lineWidth = config.barStrokeWidth;
            for (var i = 0; i < data.datasets.length; i++) {
//                ctx.fillStyle = data.datasets[i].fillColor;
//                ctx.strokeStyle = data.datasets[i].strokeColor;
                if (animPc >= 1) {
                    if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                    else lgtxt = "";
                }
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                  var currentAnimPc = animationCorrection(animPc,data,config,i,j,1).animVal;
                  if(currentAnimPc>1)currentAnimPc=currentAnimPc-1;

                  ctx.fillStyle=config.defaultFillColor;
                  if (typeof data.datasets[i].fillColor == "function")ctx.fillStyle = data.datasets[i].fillColor("FILLCOLOR",data,config,i,j,currentAnimPc,1*data.datasets[i].data[j]);
                  else if(typeof(data.datasets[i].fillColor)=="string"){ctx.fillStyle = data.datasets[i].fillColor;}
                  else if(typeof(data.datasets[i].fillColor)=="object"){if(typeof(data.datasets[i].fillColor[0])=="string"){ctx.fillStyle = data.datasets[i].fillColor[Min([data.datasets[i].fillColor.length-1,j])];} }
                  
                  ctx.strokeStyle=config.defaultStrokeColor;
                  if (typeof data.datasets[i].strokeColor == "function")ctx.strokeStyle = data.datasets[i].strokeColor("STROKECOLOR",data,config,i,j,currentAnimPc,1*data.datasets[i].data[j]);
                  else if(typeof(data.datasets[i].strokeColor)=="string"){ctx.strokeStyle = data.datasets[i].strokeColor;}
                  else if(typeof(data.datasets[i].strokeColor)=="object"){if(typeof(data.datasets[i].strokeColor[0])=="string"){ctx.strokeStyle = data.datasets[i].strokeColor[Min([data.datasets[i].strokeColor.length-1,j])];} }
                
                  if (!(typeof(data.datasets[i].data[j])=='undefined')) {
                    var barOffset = xAxisPosY + config.barValueSpacing - scaleHop * (j + 1) + barWidth * i + config.barDatasetSpacing * i + config.barStrokeWidth * i;

                    var barHeight = currentAnimPc * calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2);
          					roundRect( ctx, barOffset, yAxisPosX, barWidth, barHeight, config.barShowStroke, config.barBorderRadius,zeroY );


                    cumvalue[j] += 1*data.datasets[i].data[j];
                    if (animPc >= 1) {
                        if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
                        else lgtxt2 = "";
                        t1 = yAxisPosX + zeroY;
                        t2 = yAxisPosX + calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2)
                        if (t1 > t2) { t3 = t1; t1 = t2; t2 = t3 }

                        jsGraphAnnotate[ctx.ChartNewId][annotateCnt++] = ["RECT", t1, barOffset + barWidth, t2, barOffset, lgtxt, lgtxt2, 1*data.datasets[i].data[j], cumvalue[j], totvalue[j], i, j];
                    }
                  }
                }
            }
  
          if(animPc >=1 && config.inGraphDataShow) {
              for (var i = 0; i < data.datasets.length; i++) { for (var j = 0; j < data.datasets[i].data.length; j++) { cumvalue[j] = 0; } }

              for (var i = 0; i < data.datasets.length; i++) {
                if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
                else lgtxt = "";

                for (var j = 0; j < data.datasets[i].data.length; j++) {
                  if (!(typeof(data.datasets[i].data[j])=='undefined')) {

                    if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();

              			ctx.save();
                	  ctx.textAlign = config.inGraphDataAlign;
                    ctx.textBaseline = config.inGraphDataVAlign;
						        ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
       			        ctx.fillStyle = config.inGraphDataFontColor;

                    var barOffset = xAxisPosY + config.barValueSpacing - scaleHop * (j + 1) + barWidth * i + config.barDatasetSpacing * i + config.barStrokeWidth * i;
                    t1 = yAxisPosX + zeroY;
                    t2 = yAxisPosX + calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2)
                    if (t1 > t2) { t3 = t1; t1 = t2; t2 = t3 }

                    ctx.beginPath();
                    var yPos =0, xPos=0;

                    if(config.inGraphDataYPosition==1) { yPos=barOffset-config.inGraphDataPaddingY+barWidth; } 
                    else if(config.inGraphDataYPosition==2) { yPos=barOffset+barWidth/2-config.inGraphDataPaddingY ;}
                    else if(config.inGraphDataYPosition==3) { yPos=barOffset-config.inGraphDataPaddingY;} 

                    if(config.inGraphDataXPosition==1) { xPos=yAxisPosX + zeroY +config.inGraphDataPaddingX; }
                    else if(config.inGraphDataXPosition==2) { xPos=yAxisPosX + (calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2))/2 + config.inGraphDataPaddingX; }
                    else if(config.inGraphDataXPosition==3) { xPos=yAxisPosX + calculateOffset(config, 1*data.datasets[i].data[j], calculatedScale, valueHop) + (config.barStrokeWidth / 2) + config.inGraphDataPaddingX; }
                    
                    ctx.translate(xPos,yPos);

                    cumvalue[j] += 1*data.datasets[i].data[j];

                    var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,lgtxt2,config.fmtV2), v3 : fmtChartJS(config,1*data.datasets[i].data[j],config.fmtV3), v4 : fmtChartJS(config,cumvalue[j],config.fmtV4), v5 : fmtChartJS(config,totvalue[j],config.fmtV5), v6 : roundToWithThousands(config,fmtChartJS(config,100 * data.datasets[i].data[j] / totvalue[j],config.fmtV6),config.roundPct),v7 : fmtChartJS(config,t1,config.fmtV7),v8 : fmtChartJS(config,barOffset + barWidth,config.fmtV8),v9 : fmtChartJS(config,t2,config.fmtV9),v10 : fmtChartJS(config,barOffset,config.fmtV10),v11 : fmtChartJS(config,i,config.fmtV11), v12 : fmtChartJS(config,j,config.fmtV12),data:data});
                    ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));
                    ctx.fillTextMultiLine(dispString,0,0,ctx.textBaseline,config.inGraphDataFontSize);
					    	    ctx.restore();

                  }
                }
              }
                  
            }
  

        } ;
        
        function roundRect(ctx, x, y, w, h, stroke, radius,zeroY ) {
  		    ctx.beginPath();
			    ctx.moveTo(y +zeroY, x + radius  );
			    ctx.lineTo(y +zeroY, x + w - radius );
			    ctx.quadraticCurveTo(y + zeroY, x + w, y + zeroY, x + w);
			    ctx.lineTo(y + h - radius, x + w );
			    ctx.quadraticCurveTo(y + h, x + w, y + h, x + w - radius);
			    ctx.lineTo(y + h , x + radius);
			    ctx.quadraticCurveTo(y + h, x  , y + h - radius , x  );
			    ctx.lineTo(y+zeroY, x );
			    ctx.quadraticCurveTo(y+zeroY, x , y+zeroY, x+radius);

			    if(stroke)ctx.stroke();
			    ctx.closePath();
			    ctx.fill();
        } ;
        

        function drawScale() {

            //X axis line                                                          

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
            ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY);
            ctx.stroke();

            for (var i = ((config.showYAxisMin) ? -1 : 0) ; i < calculatedScale.steps; i++) {
                if (i >= 0) {
                    ctx.beginPath();
                    ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
                    ctx.lineWidth = config.scaleGridLineWidth;
                    ctx.strokeStyle = config.scaleGridLineColor;

                    //Check i isnt 0, so we dont go over the Y axis twice.
                    if (config.scaleShowGridLines && i>0 && i % config.scaleXGridLinesStep==0 ) {
                        ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
                    }
                    else {
                        ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
                    }
                    ctx.stroke();
                }
            }

            //Y axis

            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
            ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
            ctx.stroke();

            for (var j = 0; j < data.labels.length; j++) {
                ctx.beginPath();
                ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
                ctx.lineWidth = config.scaleGridLineWidth;
                ctx.strokeStyle = config.scaleGridLineColor;
                if (config.scaleShowGridLines && j % config.scaleYGridLinesStep==0 ) {
                    ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY - ((j + 1) * scaleHop));
                }
                else {
                    ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
                }
                ctx.stroke();
            }
        } ;

        function drawLabels() {
            ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;

            //X axis line                                                          
            if(config.xAxisTop || config.xAxisBottom) {                                                    
              ctx.textBaseline = "top";
              if (msr.rotateLabels > 90) {
                  ctx.save();
                  ctx.textAlign = "left";
              }
              else if (msr.rotateLabels > 0) {
                  ctx.save();
                  ctx.textAlign = "right";
              }
              else {
                  ctx.textAlign = "center";
              }
              ctx.fillStyle = config.scaleFontColor;

              if(config.xAxisBottom){
                for (var i = ((config.showYAxisMin) ? -1 : 0) ; i < calculatedScale.steps; i++) {
                    ctx.save();
                    if (msr.rotateLabels > 0) {
                        ctx.translate(yAxisPosX + (i + 1) * valueHop - msr.highestXLabel/2, msr.xLabelPos);
                        ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
                        ctx.fillTextMultiLine(calculatedScale.labels[i + 1], 0, 0,ctx.textBaseline,config.scaleFontSize);
                    }
                    else {
                        ctx.fillTextMultiLine(calculatedScale.labels[i + 1], yAxisPosX + (i + 1) * valueHop, msr.xLabelPos,ctx.textBaseline,config.scaleFontSize);
                    }
                    ctx.restore();
                }
              }
            }

            //Y axis

            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            for (var j = 0; j < data.labels.length; j++) {
                if (config.scaleShowLabels) {
                    if (config.yAxisLeft) {
                        ctx.textAlign = "right";
                        ctx.fillTextMultiLine(fmtChartJS(config,data.labels[j],config.fmtXLabel), yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - (j * scaleHop) - scaleHop / 2,ctx.textBaseline,config.scaleFontSize);
                    }
                    if (config.yAxisRight) {
                        ctx.textAlign = "left";
                        ctx.fillTextMultiLine(fmtChartJS(config,data.labels[j],config.fmtXLabel), yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - (j * scaleHop) - scaleHop / 2,ctx.textBaseline,config.scaleFontSize);
                    }
                }
            }
        } ;

        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            for (var i = 0; i < data.datasets.length; i++) {
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    if (1*data.datasets[i].data[j] > upperValue) { upperValue = 1*data.datasets[i].data[j] };
                    if (1*data.datasets[i].data[j] < lowerValue) { lowerValue = 1*data.datasets[i].data[j] };
                }
            };
            
			if (Math.abs(upperValue - lowerValue)<0.00000001) {
				upperValue = Max([upperValue*2,1]);
				lowerValue = 0;
			}

            // AJOUT CHANGEMENT
            if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
            if (!isNaN(config.graphMax)) upperValue = config.graphMax;

            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));

            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            };
        } ;
    } ;

    function calculateOffset(config, val, calculatedScale, scaleHop) {
        if (!config.logarithmic) { // no logarithmic scale
            var outerValue = calculatedScale.steps * calculatedScale.stepValue;
            var adjustedValue = val - calculatedScale.graphMin;
            var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
            return (scaleHop * calculatedScale.steps) * scalingFactor;
        } else { // logarithmic scale
            return CapValue(log10(val) * scaleHop - calculateOrderOfMagnitude(calculatedScale.graphMin) * scaleHop, undefined, 0);
        }
    } ;

    function animationLoop(config, drawScale, drawData, ctx, clrx, clry, clrwidth, clrheight, midPosX, midPosY, borderX, borderY, data) {

        var cntiter=0;
        var animationCount=1;
        var multAnim=1;
    
        if(config.animationStartValue <0 || config.animationStartValue>1)config.animation.StartValue=0;
        if(config.animationStopValue <0 || config.animationStopValue>1)config.animation.StopValue=1;
        if(config.animationStopValue<config.animationStartValue)config.animationStopValue=config.animationStartValue;
    
        if (isIE() < 9 && isIE() != false) config.animation = false;

        var animFrameAmount = (config.animation) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1,
      			easingFunction = animationOptions[config.animationEasing],
	       		percentAnimComplete = (config.animation) ? 0 : 1;

        if(config.animation && config.animationStartValue>0 && config.animationStartValue <=1)
        {
          while(percentAnimComplete < config.animationStartValue){cntiter++;percentAnimComplete+=animFrameAmount;}
        }
        var beginAnim=cntiter;
        var beginAnimPct=percentAnimComplete;

        if (typeof drawScale !== "function") drawScale = function () { };

        if(config.clearRect)requestAnimFrame(animLoop);
        else animLoop();
        

        function animateFrame() {
            var easeAdjustedAnimationPercent = (config.animation) ? CapValue(easingFunction(percentAnimComplete), null, 0) : 1;

            if(1*cntiter>=1*CapValue(config.animationSteps, Number.MAX_VALUE, 1) || config.animation==false)easeAdjustedAnimationPercent=1;
            else if(easeAdjustedAnimationPercent>=1)easeAdjustedAnimationPercent=0.9999;

            if (!(isIE() < 9 && isIE() != false) && config.clearRect) ctx.clearRect(clrx, clry, clrwidth, clrheight);

            dispCrossText(ctx, config, midPosX, midPosY, borderX, borderY, false, data, easeAdjustedAnimationPercent,cntiter);

            if (config.scaleOverlay) {
                drawData(easeAdjustedAnimationPercent);
                drawScale();
            } else {
                drawScale();
                drawData(easeAdjustedAnimationPercent);
            }
            dispCrossText(ctx, config, midPosX, midPosY, borderX, borderY, true, data, easeAdjustedAnimationPercent,cntiter);
        };
        function animLoop() {
            //We need to check if the animation is incomplete (less than 1), or complete (1).
            cntiter+=multAnim;

            percentAnimComplete += multAnim*animFrameAmount;

            if(cntiter==config.animationSteps || config.animation==false )percentAnimComplete=1;
            else if(percentAnimComplete>=1)percentAnimComplete=0.999;
            
            animateFrame();
            //Stop the loop continuing forever

            if(multAnim==-1 && cntiter<=beginAnim)
            {
              if (typeof config.onAnimationComplete == "function") config.onAnimationComplete(ctx,config,data,0,animationCount+1);
              multAnim=1;
              requestAnimFrame(animLoop);
            }
            else if (percentAnimComplete < config.animationStopValue) {
                requestAnimFrame(animLoop);
            }
            else {
                if (typeof config.onAnimationComplete == "function") config.onAnimationComplete(ctx,config,data,1,animationCount+1);
                // stop animation ? 
                if(animationCount<config.animationCount || config.animationCount==0)
                {
                  animationCount++;
                  if(config.animationBackward && multAnim==1){
                    percentAnimComplete -= animFrameAmount;
                    multAnim=-1;
                  }
                  else {
                    multAnim=1;
              	    cntiter=beginAnim-1;
                    percentAnimComplete = beginAnimPct-animFrameAmount;
                  }                  
                  window.setTimeout(animLoop,2000);
                }
                
                
            }
        } ;
    } ;


    //Declare global functions to be called within this namespace here.

    // shim layer with setTimeout fallback
    var requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000/60 );
			};
    })();

    function calculateScale(config, maxSteps, minSteps, maxValue, minValue, labelTemplateString) {

        var graphMin, graphMax, graphRange, stepValue, numberOfSteps, valueRange, rangeOrderOfMagnitude, decimalNum;

        if (!config.logarithmic) { // no logarithmic scale
            valueRange = maxValue - minValue;
            rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);
            graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
            graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
        }
        else { // logarithmic scale
            graphMin = Math.pow(10, calculateOrderOfMagnitude(minValue));
            graphMax = Math.pow(10, calculateOrderOfMagnitude(maxValue) + 1);
            rangeOrderOfMagnitude = calculateOrderOfMagnitude(graphMax) - calculateOrderOfMagnitude(graphMin);
        }

        graphRange = graphMax - graphMin;
        stepValue = Math.pow(10, rangeOrderOfMagnitude);
        numberOfSteps = Math.round(graphRange / stepValue);



        if (!config.logarithmic) { // no logarithmic scale

            //Compare number of steps to the max and min for that size graph, and add in half steps if need be.	        
            while (numberOfSteps < minSteps || numberOfSteps > maxSteps) {
                if (numberOfSteps < minSteps) {
                    stepValue /= 2;
                    numberOfSteps = Math.round(graphRange / stepValue);
                }
                else {
                    stepValue *= 2;
                    numberOfSteps = Math.round(graphRange / stepValue);
                }
            }
        } else { // logarithmic scale
            numberOfSteps = rangeOrderOfMagnitude; // so scale is  10,100,1000,...
        }

        var labels = [];
        populateLabels(config, labelTemplateString, labels, numberOfSteps, graphMin, graphMax, stepValue);


        return {
            steps: numberOfSteps,
            stepValue: stepValue,
            graphMin: graphMin,
            labels: labels,
            maxValue: maxValue
        }
    } ;

    function calculateOrderOfMagnitude(val) {
        return Math.floor(Math.log(val) / Math.LN10);
    } ;

    //Populate an array of all the labels by interpolating the string.
    function populateLabels(config, labelTemplateString, labels, numberOfSteps, graphMin, graphMax, stepValue) {
        if (labelTemplateString) {
            //Fix floating point errors by setting to fixed the on the same decimal as the stepValue.
            if (!config.logarithmic) { // no logarithmic scale
                for (var i = 0; i < numberOfSteps + 1; i++) {
                    labels.push(tmpl(labelTemplateString, { value: fmtChartJS(config,1*((graphMin + (stepValue * i)).toFixed(getDecimalPlaces(stepValue))),config.fmtYLabel) }));
                }
            } else { // logarithmic scale 10,100,1000,...
                var value = graphMin;
                while (value < graphMax) {
                    labels.push(tmpl(labelTemplateString, { value: fmtChartJS(config,1*value.toFixed(getDecimalPlaces(stepValue)),config.fmtYLabel) }));
                    value *= 10;
                }
            }
        }
    } ;

    //Max value from array
    function Max(array) {
        return Math.max.apply(Math, array);
    };

    //Min value from array
    function Min(array) {
        return Math.min.apply(Math, array);
    };
    //Default if undefined

    function Default(userDeclared, valueIfFalse) {
        if (!userDeclared) {
            return valueIfFalse;
        } else {
            return userDeclared;
        }
    };

    //Apply cap a value at a high or low number
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

    function getDecimalPlaces(num) {
        var numberOfDecimalPlaces;
        if (num % 1 != 0) {
            return num.toString().split(".")[1].length
        }
        else {
            return 0;
        }

    };

    function mergeChartConfig(defaults, userDefined) {
        var returnObj = {};
        for (var attrname in defaults) { returnObj[attrname] = defaults[attrname]; }
        for (var attrname in userDefined) { returnObj[attrname] = userDefined[attrname]; }
        return returnObj;
    };

    //Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
    var cache = {};

    function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
	      cache[str] = cache[str] ||
	        tmpl(document.getElementById(str).innerHTML) :

	      // Generate a reusable function that will serve as a template
	      // generator (and which will be cached).
	      new Function("obj",
	        "var p=[],print=function(){p.push.apply(p,arguments);};" +

	        // Introduce the data as local variables using with(){}
	        "with(obj){p.push('" +

	        // Convert the template into pure JavaScript
	        str
	          .replace(/[\r\t\n]/g, " ")
	          .split("<%").join("\t")
	          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
	          .replace(/\t=(.*?)%>/g, "',$1,'")
	          .split("\t").join("');")
	          .split("%>").join("p.push('")
	          .split("\r").join("\\'")
	      + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };

    function dispCrossText(ctx, config, posX, posY, borderX, borderY, overlay, data, animPC,cntiter) {

        var i, disptxt, txtposx, txtposy, txtAlign, txtBaseline;

        for (i = 0; i < config.crossText.length; i++) {
 
            if (config.crossText[i] != "" && config.crossTextOverlay[Min([i, config.crossTextOverlay.length - 1])] == overlay  && ((cntiter==1 && config.crossTextIter[Min([i, config.crossTextIter.length - 1])]=="first") || config.crossTextIter[Min([i, config.crossTextIter.length - 1])]==cntiter || config.crossTextIter[Min([i, config.crossTextIter.length - 1])]=="all" || (animPC==1 && config.crossTextIter[Min([i, config.crossTextIter.length - 1])]=="last")) ) {
                ctx.save();
                ctx.beginPath();
                ctx.font = config.crossTextFontStyle[Min([i, config.crossTextFontStyle.length - 1])] + " " + config.crossTextFontSize[Min([i, config.crossTextFontSize.length - 1])] + "px " + config.crossTextFontFamily[Min([i, config.crossTextFontFamily.length - 1])];
                ctx.fillStyle = config.crossTextFontColor[Min([i, config.crossTextFontColor.length - 1])];

                textAlign = config.crossTextAlign[Min([i, config.crossTextAlign.length - 1])];
                textBaseline = config.crossTextBaseline[Min([i, config.crossTextBaseline.length - 1])];

                txtposx = 1 * config.crossTextPosX[Min([i, config.crossTextPosX.length - 1])];
                txtposy = 1 * config.crossTextPosY[Min([i, config.crossTextPosY.length - 1])];

                switch (1 * config.crossTextRelativePosX[Min([i, config.crossTextRelativePosX.length - 1])]) {
                    case 0:
                        if (textAlign == "default") textAlign = "left";
                        break;
                    case 1:
                        txtposx += borderX;
                        if (textAlign == "default") textAlign = "right";
                        break;
                    case 2:
                        txtposx += posX;
                        if (textAlign == "default") textAlign = "center";
                        break;
                    case -2:
                        txtposx += context.canvas.width / 2;
                        if (textAlign == "default") textAlign = "center";
                        break;
                    case 3:
                        txtposx += txtposx + 2 * posX - borderX;
                        if (textAlign == "default") textAlign = "left";
                        break;
                    case 4:
                        // posX=width;
                        txtposx += context.canvas.width;
                        if (textAlign == "default") textAlign = "right";
                        break;
                    default:
                        txtposx += posX;
                        if (textAlign == "default") textAlign = "center";
                        break;
                }

                switch (1 * config.crossTextRelativePosY[Min([i, config.crossTextRelativePosY.length - 1])]) {
                    case 0:
                        if (textBaseline == "default") textBaseline = "top";
                        break;
                    case 3:
                        txtposy += borderY;
                        if (textBaseline == "default") textBaseline = "top";
                        break;
                    case 2:
                        txtposy += posY;
                        if (textBaseline == "default") textBaseline = "middle";
                        break;
                    case -2:
                        txtposy += context.canvas.height / 2;
                        if (textBaseline == "default") textBaseline = "middle";
                        break;
                    case 1:
                        txtposy += txtposy + 2 * posY - borderY;
                        if (textBaseline == "default") textBaseline = "bottom";
                        break;
                    case 4:
                        txtposy += context.canvas.height;
                        if (textBaseline == "default") textBaseline = "bottom";
                        break;
                    default:
                        txtposy += posY;
                        if (textBaseline == "default") textBaseline = "middle";
                        break;
                }

                ctx.textAlign = textAlign;
                ctx.textBaseline = textBaseline;

                ctx.translate(1 * txtposx, 1 * txtposy);

                ctx.rotate(config.crossTextAngle[Min([i, config.crossTextAngle.length - 1])]);

                if (config.crossText[i].substring(0, 1) == "%") {
                    if (typeof config.crossTextFunction == "function") disptxt = config.crossTextFunction(i, config.crossText[i], ctx, config, posX, posY, borderX, borderY, overlay, data, animPC);
                }
                else disptxt = config.crossText[i];

               	ctx.fillTextMultiLine(disptxt,0,0,ctx.textBaseline,config.crossTextFontSize[Min([i, config.crossTextFontSize.length - 1])]);
                ctx.stroke();
                ctx.restore();
            }
        }
    };

    //****************************************************************************************
    function setMeasures(data, config, ctx, height, width, ylabels, reverseLegend, reverseAxis, drawAxis, drawLegendOnData,legendBox) {
   
        if(config.canvasBackgroundColor != "none") ctx.canvas.style.background =config.canvasBackgroundColor;

        var borderWidth = 0;

        var yAxisLabelWidth = 0;
        var yAxisLabelPos = 0;

        var graphTitleHeight = 0;
        var graphTitlePosY = 0;

        var graphSubTitleHeight = 0;
        var graphSubTitlePosY = 0;

        var footNoteHeight = 0;
        var footNotePosY = 0;

        var yAxisUnitHeight = 0;
        var yAxisUnitPosY = 0;

        var widestLegend = 0;
        var nbeltLegend = 0;
        var nbLegendLines = 0;
        var nbLegendCols = 0;
        var spaceLegendHeight = 0;
        var xFirstLegendTextPos = 0;
        var yFirstLegendTextPos = 0;
        var xLegendBorderPos = 0;
        var yLegendBorderPos = 0;

        var yAxisLabelWidth = 0;
        var yAxisLabelPos = 0;

        var xAxisLabelHeight = 0;
        var xLabelHeight = 0;

        var widestXLabel = 1;
        var highestXLabel = 1;

        var widestYLabel = 0;
        var highestYLabel = 1;

        var leftNotUsableSize = 0;
        var rightNotUsableSize = 0;

        var rotateLabels = 0;
        var xLabelPos = 0;

        // Borders

        if (config.canvasBorders) borderWidth = config.canvasBordersWidth;

        // compute widest X label

        if (drawAxis) {
            ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
            for (var i = 0; i < data.labels.length; i++) {
                var textMsr = ctx.measureTextMultiLine(fmtChartJS(config,data.labels[i],config.fmtXLabel),config.scaleFontSize);
                //If the text length is longer - make that equal to longest text!
                widestXLabel = (textMsr.textWidth > widestXLabel) ? textMsr.textWidth : widestXLabel;
                highestXLabel= (textMsr.textHeight > highestXLabel) ? textMsr.textHeight : highestXLabel;
            }
        }

        // compute Y Label Width


        if (drawAxis) {
            widestYLabel = 1;
            if (ylabels != null) {
                ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
                for (var i = ylabels.length - 1; i >= 0; i--) {
                    if (typeof (ylabels[i]) == "string") {
                        if (ylabels[i].trim() != "") {
                            var textMsr = ctx.measureTextMultiLine(fmtChartJS(config,ylabels[i],config.fmtYLabel),config.scaleFontSize);
                            //If the text length is longer - make that equal to longest text!
                            widestYLabel = (textMsr.textWidth > widestYLabel) ? textMsr.textWidth : widestYLabel;
                            highestYLabel= (textMsr.textHeight > highestYLabel) ? textMsr.textHeight : highestYLabel;
                        }
                    }
                }
            }
        }

        // yAxisLabel
        leftNotUsableSize = borderWidth + config.spaceLeft
        rightNotUsableSize = borderWidth + config.spaceRight;

        if (drawAxis) {
            if (typeof (config.yAxisLabel) != "undefined") {
                if (config.yAxisLabel.trim() != "") {
                    yAxisLabelWidth = (config.yAxisFontSize + config.yAxisLabelSpaceLeft + config.yAxisLabelSpaceRight);
                    yAxisLabelPosLeft = borderWidth + config.spaceLeft + config.yAxisLabelSpaceLeft + config.yAxisFontSize;
                    yAxisLabelPosRight = width - borderWidth - config.spaceRight - config.yAxisLabelSpaceLeft - config.yAxisFontSize;
                }
            }

            if (config.yAxisLeft) {
                if (reverseAxis == false) leftNotUsableSize = borderWidth + config.spaceLeft + yAxisLabelWidth + widestYLabel  + config.yAxisSpaceLeft + config.yAxisSpaceRight;
                else leftNotUsableSize = borderWidth + config.spaceLeft + yAxisLabelWidth + widestXLabel + config.yAxisSpaceLeft + config.yAxisSpaceRight;
            }

            if (config.yAxisRight) {
                if (reverseAxis == false) rightNotUsableSize = borderWidth + config.spaceRight + yAxisLabelWidth + widestYLabel  + config.yAxisSpaceLeft + config.yAxisSpaceRight;
                else rightNotUsableSize = borderWidth + config.spaceRight + yAxisLabelWidth + widestXLabel + config.yAxisSpaceLeft + config.yAxisSpaceRight;
            }
        }

        availableWidth = width - leftNotUsableSize - rightNotUsableSize;

        // Title

        if (config.graphTitle.trim() != "") {
            graphTitleHeight = (config.graphTitleFontSize + config.graphTitleSpaceBefore + config.graphTitleSpaceAfter);
            graphTitlePosY = borderWidth + config.spaceTop + graphTitleHeight - config.graphTitleSpaceAfter;
        }

        // subTitle

        if (config.graphSubTitle.trim() != "") {
            graphSubTitleHeight = (config.graphSubTitleFontSize + config.graphSubTitleSpaceBefore + config.graphSubTitleSpaceAfter);
            graphSubTitlePosY = borderWidth + config.spaceTop + graphTitleHeight + graphSubTitleHeight - config.graphSubTitleSpaceAfter;
        }

        // yAxisUnit

        if (drawAxis) {
            if (typeof (config.yAxisUnit) != "undefined") {
                if (config.yAxisUnit.trim() != "") {
                    yAxisUnitHeight = (config.yAxisUnitFontSize + config.yAxisUnitSpaceBefore + config.yAxisUnitSpaceAfter);
                    yAxisUnitPosY = borderWidth + config.spaceTop + graphTitleHeight + graphSubTitleHeight + yAxisUnitHeight - config.yAxisUnitSpaceAfter;
                }
            }
        }

        topNotUsableSize = borderWidth + config.spaceTop + graphTitleHeight + graphSubTitleHeight + yAxisUnitHeight + config.graphSpaceBefore;
		
		
        // footNote

        if (typeof (config.footNote) != "undefined") {
            if (config.footNote.trim() != "") {
                footNoteHeight = (config.footNoteFontSize + config.footNoteSpaceBefore + config.footNoteSpaceAfter);
                footNotePosY = height - config.spaceBottom - borderWidth - config.footNoteSpaceAfter;
            }
        }

        // compute space for Legend
        if (typeof (config.legend) != "undefined") {
            if (config.legend == true) {
                ctx.font = config.legendFontStyle + " " + config.legendFontSize + "px " + config.legendFontFamily;
                if (drawLegendOnData) {
                    for (var i = data.datasets.length - 1; i >= 0; i--) {
                        if (typeof (data.datasets[i].title) == "string") {

                            if (data.datasets[i].title.trim() != "") {
                                nbeltLegend++;
                                var textLength = ctx.measureText(fmtChartJS(config,data.datasets[i].title,config.fmtLegend)).width;
                                //If the text length is longer - make that equal to longest text!
                                widestLegend = (textLength > widestLegend) ? textLength : widestLegend;
                            }
                        }
                    }
                } else {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (typeof (data[i].title) == "string") {
                            if (data[i].title.trim() != "") {
                                nbeltLegend++;
                                var textLength = ctx.measureText(fmtChartJS(config,data[i].title,config.fmtLegend)).width;
                                //If the text length is longer - make that equal to longest text!
                                widestLegend = (textLength > widestLegend) ? textLength : widestLegend;
                            }
                        }
                    }
                }

                if (nbeltLegend > 1) {
                    widestLegend += config.legendBlockSize + config.legendSpaceBetweenBoxAndText;

                    availableLegendWidth = width - config.spaceLeft - config.spaceRight - 2 * (borderWidth) - config.legendSpaceLeftText - config.legendSpaceRightText;
                    if (config.legendBorders == true) availableLegendWidth -= 2 * (config.legendBordersWidth) - config.legendBordersSpaceLeft - config.legendBordersSpaceRight;

                    maxLegendOnLine = Math.floor((availableLegendWidth + config.legendSpaceBetweenTextHorizontal )/ (widestLegend + config.legendSpaceBetweenTextHorizontal ));
                    nbLegendLines = Math.ceil(nbeltLegend / maxLegendOnLine);

                    nbLegendCols = Math.ceil(nbeltLegend / nbLegendLines);

                    spaceLegendHeight = nbLegendLines * (config.legendFontSize + config.legendSpaceBetweenTextVertical) - config.legendSpaceBetweenTextVertical + config.legendSpaceBeforeText + config.legendSpaceAfterText;

                    yFirstLegendTextPos = height - borderWidth - config.spaceBottom - footNoteHeight - spaceLegendHeight + config.legendSpaceBeforeText + config.legendFontSize;

                    xFirstLegendTextPos = config.spaceLeft + (width - config.spaceLeft - config.spaceRight - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal ) / 2 ;
                    if (config.legendBorders == true) {
                        spaceLegendHeight += 2 * config.legendBordersWidth + config.legendBordersSpaceBefore + config.legendBordersSpaceAfter;
                        yFirstLegendTextPos -= (config.legendBordersWidth + config.legendBordersSpaceAfter);
                        yLegendBorderPos = Math.floor(height - borderWidth - config.spaceBottom  - footNoteHeight - spaceLegendHeight + (config.legendBordersWidth / 2) + config.legendBordersSpaceBefore);
                        xLegendBorderPos = Math.floor(xFirstLegendTextPos - config.legendSpaceLeftText - (config.legendBordersWidth / 2));
                        legendBorderHeight = Math.ceil(spaceLegendHeight - config.legendBordersWidth) - config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
                        legendBorderWidth = Math.ceil(nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal)) - config.legendSpaceBetweenTextHorizontal + config.legendBordersWidth + config.legendSpaceRightText + config.legendSpaceLeftText;
                    }
                }
            }
        }

        // xAxisLabel

        if (drawAxis) {
            if (typeof (config.xAxisLabel) != "undefined") {
                if (config.xAxisLabel.trim() != "") {
                    xAxisLabelHeight = (config.xAxisFontSize + config.xAxisLabelSpaceBefore + config.xAxisLabelSpaceAfter);
                    xAxisLabelPos = height - borderWidth - config.spaceBottom - footNoteHeight - spaceLegendHeight - config.xAxisLabelSpaceAfter;
                }
            }
        }

        xLabelWidth = 0;

        if (drawAxis && (config.xAxisBottom || config.xAxisTop)) {
            if (reverseAxis == false) { var widestLabel = widestXLabel; var highestLabel=highestXLabel;nblab = data.labels.length; }
            else { var widestLabel = widestYLabel; var highestLabel=highestYLabel; nblab = ylabels.length; }
            if (config.rotateLabels == "smart") {
                rotateLabels = 0;
                if ((availableWidth + config.xAxisSpaceBetweenLabels) / nblab < (widestLabel + config.xAxisSpaceBetweenLabels)) {
                    rotateLabels = 45;
                    if (availableWidth / nblab < Math.abs(Math.cos(rotateLabels * Math.PI / 180) * widestLabel)) {
                        rotateLabels = 90;
                    }
                }
            } else {
                rotateLabels = config.rotateLabels
                if (rotateLabels < 0) rotateLabels = 0;
                if (rotateLabels > 180) rotateLabels = 180;
            }

            if (rotateLabels > 90) rotateLabels += 180;
            xLabelHeight = Math.abs(Math.sin(rotateLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.sin((rotateLabels + 90) * Math.PI / 180) * highestLabel) + config.xAxisSpaceBefore + config.xAxisSpaceAfter;
            xLabelPos = height - borderWidth - config.spaceBottom - footNoteHeight - spaceLegendHeight - xAxisLabelHeight - (xLabelHeight - config.xAxisSpaceBefore)-config.graphSpaceAfter;
            xLabelWidth = Math.abs(Math.cos(rotateLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.cos((rotateLabels + 90) * Math.PI / 180) * highestLabel);

            leftNotUsableSize = Max([leftNotUsableSize, borderWidth + config.spaceLeft + xLabelWidth / 2]);
            rightNotUsableSize = Max([rightNotUsableSize, borderWidth + config.spaceRight + xLabelWidth / 2]);
            availableWidth = width - leftNotUsableSize - rightNotUsableSize;
        }

        if(config.xAxisBottom)
        {
          bottomNotUsableHeightWithoutXLabels = borderWidth + config.spaceBottom + footNoteHeight + spaceLegendHeight + xAxisLabelHeight;
          bottomNotUsableHeightWithXLabels = bottomNotUsableHeightWithoutXLabels + xLabelHeight+config.graphSpaceAfter;
          availableHeight = height - topNotUsableSize - bottomNotUsableHeightWithXLabels;
        }
        else
        {
          bottomNotUsableHeightWithoutXLabels = borderWidth + config.spaceBottom + footNoteHeight + spaceLegendHeight + xAxisLabelHeight;
          bottomNotUsableHeightWithXLabels = bottomNotUsableHeightWithoutXLabels +config.graphSpaceAfter;
          availableHeight = height - topNotUsableSize - bottomNotUsableHeightWithXLabels;
        }

        // ----------------------- DRAW EXTERNAL ELEMENTS -------------------------------------------------

        if(widestYLabel != 1){
        	
        // Draw Borders

        if (borderWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 2 * borderWidth;
            ctx.strokeStyle = config.canvasBordersColor;
            ctx.moveTo(0, 0);
            ctx.lineTo(0, height);
            ctx.lineTo(width, height);
            ctx.lineTo(width, 0);
            ctx.lineTo(0, 0);
            ctx.stroke();
            ctx.restore();
        }

        // Draw Graph Title

        if (graphTitleHeight > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.font = config.graphTitleFontStyle + " " + config.graphTitleFontSize + "px " + config.graphTitleFontFamily;
            ctx.fillStyle = config.graphTitleFontColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.translate(config.spaceLeft + (width - config.spaceLeft - config.spaceRight) / 2, graphTitlePosY);
            ctx.fillText(config.graphTitle, 0, 0);
            ctx.stroke();
            ctx.restore();
        }

        // Draw Graph Sub-Title

        if (graphSubTitleHeight > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.font = config.graphSubTitleFontStyle + " " + config.graphSubTitleFontSize + "px " + config.graphSubTitleFontFamily;
            ctx.fillStyle = config.graphSubTitleFontColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.translate(config.spaceLeft + (width - config.spaceLeft - config.spaceRight) / 2, graphSubTitlePosY);
            ctx.fillText(config.graphSubTitle, 0, 0);
            ctx.stroke();
            ctx.restore();
        }

        // Draw Y Axis Unit

        if (yAxisUnitHeight > 0) {
            if (config.yAxisLeft) {
                ctx.save();
                ctx.beginPath();
                ctx.font = config.yAxisUnitFontStyle + " " + config.yAxisUnitFontSize + "px " + config.yAxisUnitFontFamily;
                ctx.fillStyle = config.yAxisUnitFontColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.translate(leftNotUsableSize, yAxisUnitPosY);
                ctx.fillText(config.yAxisUnit, 0, 0);
                ctx.stroke();
                ctx.restore();
            }
            if (config.yAxisRight) {
                ctx.save();
                ctx.beginPath();
                ctx.font = config.yAxisUnitFontStyle + " " + config.yAxisUnitFontSize + "px " + config.yAxisUnitFontFamily;
                ctx.fillStyle = config.yAxisUnitFontColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.translate(width - rightNotUsableSize, yAxisUnitPosY);
                ctx.fillText(config.yAxisUnit, 0, 0);
                ctx.stroke();
                ctx.restore();
            }
        }

        // Draw Y Axis Label

        if (yAxisLabelWidth > 0) {
            if (config.yAxisLeft) {
                ctx.save();
                ctx.beginPath();
                ctx.font = config.yAxisFontStyle + " " + config.yAxisFontSize + "px " + config.yAxisFontFamily;
                ctx.fillStyle = config.yAxisFontColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.translate(yAxisLabelPosLeft, topNotUsableSize + (availableHeight / 2));
                ctx.rotate(-(90 * (Math.PI / 180)));
                ctx.fillText(config.yAxisLabel, 0, 0);
                ctx.stroke();
                ctx.restore();
            }
            if (config.yAxisRight) {
                ctx.save();
                ctx.beginPath();
                ctx.font = config.yAxisFontStyle + " " + config.yAxisFontSize + "px " + config.yAxisFontFamily;
                ctx.fillStyle = config.yAxisFontColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.translate(yAxisLabelPosRight, topNotUsableSize + (availableHeight / 2));
                ctx.rotate(+(90 * (Math.PI / 180)));
                ctx.fillText(config.yAxisLabel, 0, 0);
                ctx.stroke();
                ctx.restore();
            }
        }

        // Draw X Axis Label

        if (xAxisLabelHeight > 0) {
            if (config.xAxisBottom) {
              ctx.save();
              ctx.beginPath();
              ctx.font = config.xAxisFontStyle + " " + config.xAxisFontSize + "px " + config.xAxisFontFamily;
              ctx.fillStyle = config.xAxisFontColor;
              ctx.textAlign = "center";
              ctx.textBaseline = "bottom";
              ctx.translate(leftNotUsableSize + (availableWidth / 2), xAxisLabelPos);
              ctx.fillText(config.xAxisLabel, 0, 0);
              ctx.stroke();
              ctx.restore();
            }
        }

        // Draw Legend

        if (nbeltLegend > 1) {
            if (config.legendBorders == true) {
                ctx.save();
                ctx.beginPath();

                ctx.lineWidth = config.legendBordersWidth;
                ctx.strokeStyle = config.legendBordersColors;

                ctx.moveTo(xLegendBorderPos, yLegendBorderPos);
                ctx.lineTo(xLegendBorderPos, yLegendBorderPos + legendBorderHeight);
                ctx.lineTo(xLegendBorderPos + legendBorderWidth, yLegendBorderPos + legendBorderHeight);
                ctx.lineTo(xLegendBorderPos + legendBorderWidth, yLegendBorderPos);
                ctx.lineTo(xLegendBorderPos, yLegendBorderPos);
                ctx.lineTo(xLegendBorderPos + legendBorderWidth, yLegendBorderPos);
                ctx.lineTo(xLegendBorderPos, yLegendBorderPos);
                ctx.lineTo(xLegendBorderPos, yLegendBorderPos + legendBorderHeight);

                ctx.stroke();
                ctx.restore();
            }

            nbcols = nbLegendCols - 1;
            ypos = yFirstLegendTextPos - (config.legendFontSize + config.legendSpaceBetweenTextVertical);
            xpos = 0;

            if (drawLegendOnData) fromi = data.datasets.length;
            else fromi = data.length;

            for (var i = fromi - 1; i >= 0; i--) {
                orderi = i;
                if (reverseLegend) {
                    if (drawLegendOnData) orderi = data.datasets.length - i - 1;
                    else orderi = data.length - i - 1;
                }

                if (drawLegendOnData) tpof = typeof (data.datasets[orderi].title);
                else tpof = typeof (data[orderi].title)

                if (tpof == "string") {
                    if (drawLegendOnData) lgtxt = fmtChartJS(config,data.datasets[orderi].title,config.fmtLegend).trim();
                    else lgtxt = fmtChartJS(config,data[orderi].title,config.fmtLegend).trim();
                    if (lgtxt != "") {
                        nbcols++;
                        if (nbcols == nbLegendCols) {
                            nbcols = 0;
                            xpos = xFirstLegendTextPos;
                            ypos += config.legendFontSize + config.legendSpaceBetweenTextVertical;
                        }
                        else {
                            xpos += widestLegend + config.legendSpaceBetweenTextHorizontal;
                        }

                        ctx.save();
                        ctx.beginPath();

                        if (drawLegendOnData) {
                          if (typeof data.datasets[orderi].strokeColor == "function")ctx.strokeStyle = data.datasets[orderi].strokeColor("STROKECOLOR",data,config,orderi,-1,1,-1);
                          else if(typeof data.datasets[orderi].strokeColor=="string")ctx.strokeStyle = data.datasets[orderi].strokeColor;
                          else ctx.strokeStyle=config.defaultStrokeColor;
                        }
                        else { 
                          if (typeof data[orderi].color == "function")ctx.fillStyle = data[orderi].color("COLOR",data,config,orderi,-1,1,data[orderi].value);
                          else if(typeof data[orderi].color == "string")ctx.strokeStyle = data[orderi].color;
                          else ctx.strokeStyle=config.defaultStrokeColor; 
                        }


                                                                                        
                        if (legendBox) {
                            ctx.lineWidth = 1;
                            ctx.moveTo(xpos , ypos);
                            ctx.lineTo(xpos + config.legendBlockSize, ypos);
                            ctx.lineTo(xpos + config.legendBlockSize, ypos - config.legendFontSize );
                            ctx.lineTo(xpos , ypos - config.legendFontSize );
                            ctx.lineTo(xpos , ypos);
                            ctx.closePath();
                            if (drawLegendOnData) {
                              if (typeof data.datasets[i].fillColor == "function")ctx.fillStyle = data.datasets[i].fillColor("FILLCOLOR",data,config,i,-1,1,-1);
                              else if(typeof data.datasets[orderi].fillColor=="string")ctx.fillStyle = data.datasets[orderi].fillColor;
                              else ctx.fillStyle=config.defaultFillColor;}
                            else {if(typeof data[orderi].color == "string")ctx.fillStyle = data[orderi].color;else ctx.fillStyle=config.defaultFillColor;}
                            ctx.fill();
                        }
                        else {
                            ctx.lineWidth = config.legendColorIndicatorStrokeWidth ?
								config.legendColorIndicatorStrokeWidth : config.datasetStrokeWidth;
							if (config.legendColorIndicatorStrokeWidth && config.legendColorIndicatorStrokeWidth > config.legendFontSize) {
								ctx.lineWidth = config.legendFontSize;
							}
                            ctx.moveTo(xpos + 2, ypos - (config.legendFontSize / 2));
                            ctx.lineTo(xpos + 2 + config.legendBlockSize, ypos - (config.legendFontSize / 2));
                        }
                        ctx.stroke();
                        ctx.restore();
                        ctx.save();
                        ctx.beginPath();
                        ctx.font = config.legendFontStyle + " " + config.legendFontSize + "px " + config.legendFontFamily;
                        ctx.fillStyle = config.legendFontColor;
                        ctx.textAlign = "left";
                        ctx.textBaseline = "bottom";
                        ctx.translate(xpos + config.legendBlockSize + config.legendSpaceBetweenBoxAndText, ypos);
                        ctx.fillText(lgtxt, 0, 0);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }

        // Draw FootNote
        if (config.footNote.trim() != "") {
            ctx.save();
            ctx.font = config.footNoteFontStyle + " " + config.footNoteFontSize + "px " + config.footNoteFontFamily;
            ctx.fillStyle = config.footNoteFontColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.translate(leftNotUsableSize + (availableWidth / 2), footNotePosY);
            ctx.fillText(config.footNote, 0, 0);
            ctx.stroke();
            ctx.restore();
        }


        }

        clrx = leftNotUsableSize;        
        clrwidth = availableWidth;
        clry = topNotUsableSize;
        clrheight = availableHeight;
 

        return {
            leftNotUsableSize: leftNotUsableSize,
            rightNotUsableSize: rightNotUsableSize,
            availableWidth: availableWidth,
            topNotUsableSize: topNotUsableSize,
            bottomNotUsableHeightWithoutXLabels: bottomNotUsableHeightWithoutXLabels,
            bottomNotUsableHeightWithXLabels: bottomNotUsableHeightWithXLabels,
            availableHeight: availableHeight,
            widestXLabel: widestXLabel,
            highestXLabel: highestXLabel,
            widestYLabel: widestYLabel,
            highestYLabel: highestYLabel,
            rotateLabels: rotateLabels,
            xLabelPos: xLabelPos,
            clrx: clrx,
            clry: clry,
            clrwidth: clrwidth,
            clrheight: clrheight
        };
    } ;

	// Function for additionalLine (BarLine|Line)
	function drawLinesDataset(animPc,data,config,ctx,vars) {
		var xAxisPosY = vars.xAxisPosY;
		var yAxisPosX = vars.yAxisPosX;
		var valueHop = vars.valueHop;
		var scaleHop = vars.scaleHop;
		var zeroY = vars.zeroY;
		var calculatedScale = vars.calculatedScale;
		var annotateCnt = vars.annotateCnt;
		
	 	var totvalue = new Array();
		var maxvalue = new Array();

		for (var i = 0; i < data.datasets.length; i++) {
			for (var j = 0; j < data.datasets[i].data.length; j++) {
				totvalue[j] = 0;
				maxvalue[j] = -999999999; 
			}
		}
		for (var i = 0; i < data.datasets.length; i++) {
			for (var j = 0; j < data.datasets[i].data.length; j++) {
				totvalue[j] += data.datasets[i].data[j];
				maxvalue[j] = Max([maxvalue[j], data.datasets[i].data[j]]); 
			} 
		}
		for (var i = 0; i < data.datasets.length; i++) {
			var prevpt=-1;
			var frstpt=-1;

			if (typeof data.datasets[i].strokeColor == "function") {
				ctx.strokeStyle = data.datasets[i].strokeColor("STROKECOLOR",data,config,i,-1,animPc,-1);
			}
			else if(typeof data.datasets[i].strokeColor=="string") {
				ctx.strokeStyle = data.datasets[i].strokeColor;
			}
			else ctx.strokeStyle=config.defaultStrokeColor;
			ctx.lineWidth = config.datasetStrokeWidth;
			ctx.beginPath();

			var currentAnimPc;
      var prevAnimPc;
      var prevXpos;
      prevAnimPc=0;
      prevnotempty=0;
			for (var j = 0; j < data.datasets[i].data.length; j++) {
				var xposj=xPos(j);
        
        var currentAnimPc = animationCorrection(animPc,data,config,i,j,0);
        if(currentAnimPc.mainVal==0 && prevAnimPc>0)
        {
          ctx.stroke();
          ctx.strokeStyle ="rgba(0,0,0,0)";
          ctx.lineWidth =0.01;                                                                   
				  ctx.lineTo(prevXpos, xAxisPosY - zeroY);

        }
        prevAnimPc=currentAnimPc.mainVal;
        

				if (currentAnimPc.mainVal >= 1) {
					if (typeof (data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
					else lgtxt = "";
				}

				if (!(typeof(data.datasets[i].data[j])=='undefined')) { 
          prevXpos=xPos(j);
				  if (prevpt==-1){
					 ctx.moveTo(xposj, yPos(i, j));
					 frstpt=j;
				  } else {
					   if (config.bezierCurve) {
					       ctx.bezierCurveTo(xPos(j-(j-prevpt)/2), yPos(i, prevpt), xPos(j-(j-prevpt)/2), yPos(i, j), xPos(j), yPos(i, j));
					   }
					   else {
					       ctx.lineTo(xPos(j), yPos(i, j));
					   }
				  }
          
          if(currentAnimPc.subVal > 0)
          {
                 // next not missing value
                 nxtnotmiss=-1;
                 for(t=j+1;t<data.datasets[i].data["length"] && nxtnotmiss==-1;t++){
                    if (!(typeof(data.datasets[i].data[t])=='undefined')) nxtnotmiss=t; 
                 }
                 if(nxtnotmiss!=-1) {
                   prevXpos=xPos(j+currentAnimPc.subVal);
    					     if (config.bezierCurve) {
		   			        ctx.bezierCurveTo(xPos(j+currentAnimPc.subVal/2), yPos(i, j), xPos(j+currentAnimPc.subVal/2), yPos(i, nxtnotmiss), xPos(j+currentAnimPc.subVal), yPos(i, nxtnotmiss));
				    	     }
					         else {
  					         ctx.lineTo(xPos(j+currentAnimPc.subVal), yPos(i, j+1));
					         }
                 }
          }
    			prevpt=j;
          
				  if (animPc >= 1) {
					     if (i == 0) divprev = data.datasets[i].data[j];
					     else divprev = data.datasets[i].data[j] - data.datasets[i - 1].data[j];
					     if (i == data.datasets.length - 1) divnext = data.datasets[i].data[j];
					     else divnext = data.datasets[i].data[j] - data.datasets[i + 1].data[j];

					     if (typeof (data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
					     else lgtxt2 = "";
					
                jsGraphAnnotate[ctx.ChartNewId][annotateCnt++] = ["POINT", xPos(j), yPos(i, j), lgtxt, lgtxt2, 1*data.datasets[i].data[j], divprev, divnext, maxvalue[j], totvalue[j], i, j];
								
                if (config.inGraphDataShow) {
								  ctx.save();
							    ctx.textAlign = config.inGraphDataAlign;
					        ctx.textBaseline = config.inGraphDataVAlign;
								  ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
								  ctx.fillStyle = config.inGraphDataFontColor;
									var dotX = yAxisPosX + (valueHop *k),
									dotY = xAxisPosY - currentAnimPc.mainVal*(calculateOffset(config, data.datasets[i].data[j],calculatedScale,scaleHop)),
									paddingTextX = config.inGraphDataPaddingX,
									paddingTextY = config.inGraphDataPaddingY;
					        var dispString = tmplbis(config.inGraphDataTmpl, { config:config, v1 : fmtChartJS(config,lgtxt,config.fmtV1), v2 : fmtChartJS(config,lgtxt2,config.fmtV2), v3 : fmtChartJS(config,1*data.datasets[i].data[j],config.fmtV3), v4 : fmtChartJS(config,divprev,config.fmtV4), v5 : fmtChartJS(config,divnext,config.fmtV5), v6 : fmtChartJS(config,maxvalue[j],config.fmtV6), v7 : fmtChartJS(config,totvalue[j],config.fmtV7), v8 : roundToWithThousands(config,fmtChartJS(config,100 * data.datasets[i].data[j] / totvalue[j],config.fmtV8),config.roundPct),v9 : fmtChartJS(config,yAxisPosX+ (valueHop *k),config.fmtV9),v10 : fmtChartJS(config,xAxisPosY - (calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop)),config.fmtV10),v11 : fmtChartJS(config,i,config.fmtV11), v12 : fmtChartJS(config,j,config.fmtV12),data:data});
					        ctx.translate(xPos(j) + paddingTextX, yPos(i,j) - paddingTextY);
					        ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));
								  ctx.fillTextMultiLine(dispString,0,0,ctx.textBaseline,config.inGraphDataFontSize);
					        ctx.restore();
					     }
				  }
				} else {
          if(currentAnimPc.subVal > 0)
          {

                 nxtnotmiss=-1;
                 for(t=j+1;t<data.datasets[i].data["length"] && nxtnotmiss==-1;t++){
                    if (!(typeof(data.datasets[i].data[t])=='undefined')) nxtnotmiss=t; 
                 }
                 if(nxtnotmiss!=-1) {
                   prevXpos=xPos(j+currentAnimPc.subVal);
    					     if (config.bezierCurve) {
		   			        ctx.bezierCurveTo(xPos(prevpt+(j+currentAnimPc.subVal-prevpt)/2), yPos(i, prevpt), xPos(prevpt+(j+currentAnimPc.subVal-prevpt)/2), yPos(i, nxtnotmiss), xPos(j+currentAnimPc.subVal), yPos(i, nxtnotmiss));
				    	     }
					         else {
  					         ctx.lineTo(xPos(j+currentAnimPc.subVal), yPos(i, j+1));
					         }
                 }
          }
        }
			}
			ctx.stroke();
			if (config.datasetFill) {
//				ctx.lineTo(yAxisPosX + (valueHop * (data.datasets[i].data.length - 1)), xAxisPosY - zeroY);
				ctx.lineTo(prevXpos, xAxisPosY - zeroY);
				ctx.lineTo(xPos(frstpt), xAxisPosY - zeroY);
				ctx.lineTo(xPos(frstpt), yPos(i, frstpt));
				ctx.closePath();
				if (typeof data.datasets[i].fillColor == "function")ctx.fillStyle = data.datasets[i].fillColor("FILLCOLOR",data,config,i,-1,currentAnimPc.mainVal,-1);
				else if(typeof data.datasets[i].fillColor=="string")ctx.fillStyle = data.datasets[i].fillColor;
				else ctx.fillStyle=config.defaultFillColor;
				ctx.fill();

			}
			else {
				ctx.closePath();
			}
			if (config.pointDot) {
				if (typeof data.datasets[i].pointColor == "function")ctx.fillStyle = data.datasets[i].pointColor("POINTCOLOR",data,config,i,-1,animPc,-1);
				else ctx.fillStyle = data.datasets[i].pointColor;
				if (typeof data.datasets[i].pointStrokeColor == "function")ctx.strokeStyle = data.datasets[i].pointStrokeColor("POINTSTROKECOLOR",data,config,i,-1,animPc,-1);
				else ctx.strokeStyle = data.datasets[i].pointStrokeColor;

				ctx.lineWidth = config.pointDotStrokeWidth;
				for (var k = 0; k < data.datasets[i].data.length; k++) {
					if (!(typeof(data.datasets[i].data[k])=='undefined')) { 
					  var currentAnimPc = animationCorrection(animPc,data,config,i,k,0);
					  if(currentAnimPc.mainVal>0 || !config.animationRightToLeft) {   
              ctx.beginPath();
					    ctx.arc(xPos(k), yPos(i,k), config.pointDotRadius, 0, Math.PI * 2, true);
            	ctx.fill();
					    ctx.stroke();
            }
					}
				}
			}
		};

		function yPos(dataSet, iteration) {
			return xAxisPosY - zeroY - currentAnimPc.mainVal* (calculateOffset(config, data.datasets[dataSet].data[iteration], calculatedScale, scaleHop)-zeroY);
		};
		function xPos(iteration) {
			return yAxisPosX + (valueHop * iteration);
		};
	}

	
	
	
    function log10(val) {
        return Math.log(val) / Math.LN10;
    } ;
    
    function setRect(ctx,config)
    {
        if(config.clearRect){
          clear(ctx);
          ctx.clearRect(0, 0, width, height);
        } else {
          clear(ctx);
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = config.savePngBackgroundColor;
          ctx.strokeStyle = config.savePngBackgroundColor;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(0,ctx.canvas.height);
          ctx.lineTo(ctx.canvas.width,ctx.canvas.height);
          ctx.lineTo(ctx.canvas.width,0);
          ctx.lineTo(0,0);
          ctx.stroke();
          ctx.fill(); 

        }
    } ;

    
    function defMouse(ctx,data,config,tpgraph) {

        if (config.annotateDisplay == true) {
            if (cursorDivCreated == false) oCursor = new makeCursorObj('divCursor');
            if (isIE() < 9 && isIE() != false) ctx.canvas.attachEvent("on" + config.annotateFunction.split(' ')[0], function (event) { 
              if ((config.annotateFunction.split(' ')[1]=="left" && event.which==1) ||
                  (config.annotateFunction.split(' ')[1]=="middle" && event.which==2) ||
                  (config.annotateFunction.split(' ')[1]=="right" && event.which==3) ||
                  (typeof(config.annotateFunction.split(' ')[1])!="string")) doMouseMove(ctx, config, event,data) 
              });
            else ctx.canvas.addEventListener(config.annotateFunction.split(' ')[0], function (event) { 
              if ((config.annotateFunction.split(' ')[1]=="left" && event.which==1) ||
                  (config.annotateFunction.split(' ')[1]=="middle" && event.which==2) ||
                  (config.annotateFunction.split(' ')[1]=="right" && event.which==3) ||
                  (typeof(config.annotateFunction.split(' ')[1])!="string")) doMouseMove(ctx, config, event,data) 
            }, false);
        }
        
        if(config.savePng)
        {
            if (isIE() < 9 && isIE() != false) ctx.canvas.attachEvent("on"+ config.savePngFunction.split(' ')[0], function(event) { 
              if ((config.savePngFunction.split(' ')[1]=="left" && event.which==1) ||
                  (config.savePngFunction.split(' ')[1]=="middle" && event.which==2) ||
                  (config.savePngFunction.split(' ')[1]=="right" && event.which==3) ||
                  (typeof(config.savePngFunction.split(' ')[1])!="string")) saveCanvas(ctx,data,config,tpgraph); 
              });  
            else ctx.canvas.addEventListener(config.savePngFunction.split(' ')[0], function (event) {   
              if ((config.savePngFunction.split(' ')[1]=="left" && event.which==1) ||
                  (config.savePngFunction.split(' ')[1]=="middle" && event.which==2) ||
                  (config.savePngFunction.split(' ')[1]=="right" && event.which==3) ||
                  (typeof(config.savePngFunction.split(' ')[1])!="string")) saveCanvas(ctx,data,config,tpgraph); 
              }
              ,false);
  
        }

    };
    
};
function animationCorrection(animationValue,data,config,vdata,vsubdata,addone)
{
//window.alert(config.animationStartWithDataset +" "+ vdata)
var animValue=animationValue;
var animSubValue=0;

if(animValue<1 && (vdata < config.animationStartWithDataset && config.animationStartWithDataset!=-1))
{
  animValue=1;
}

if(animValue<1 && (vsubdata < config.animationStartWithData && config.animationStartWithData!=-1))
{
  animValue=1;
}

var totreat=1;
var newAnimationValue=animationValue;

if(animValue<1 && config.animationByDataset)
{
  animValue=0;
  totreat=0;
  var startDataset=config.animationStartWithDataset;
  if(config.animationStartWithDataset==-1)startDataset=0
  var nbstepsperdatasets=config.animationSteps/(data.datasets.length-startDataset);
  if(animationValue>=(vdata-startDataset+1)*nbstepsperdatasets/config.animationSteps ) animValue=1;
  else if(animationValue>=(vdata-startDataset)*nbstepsperdatasets/config.animationSteps ) {
    var redAnimationValue=animationValue-(vdata-startDataset)*nbstepsperdatasets/config.animationSteps;
    if(!config.animationRightToLeft) {
      animValue=redAnimationValue*(data.datasets.length-startDataset);
    } else {
      newAnimationValue=redAnimationValue*(data.datasets.length-startDataset);
    }
    
    totreat=1;
  }
}
if(totreat==1 && animValue<1 && config.animationRightToLeft)  {
  animValue=0;
  var startSub=config.animationStartWithData;
  if(config.animationStartWithData==-1)startSub=0
  var nbstepspervalue=config.animationSteps/(data.datasets[vdata].data.length-startSub-1+addone);
  if(newAnimationValue>=(vsubdata-startSub)*nbstepspervalue/config.animationSteps ) {
    animValue=1;
    if(newAnimationValue<=(vsubdata+1-startSub)*nbstepspervalue/config.animationSteps) {
      animSubValue=(data.datasets[vdata].data.length-startSub-1)*(newAnimationValue-((vsubdata-startSub)*nbstepspervalue/config.animationSteps));
    }
  }
}





return{
  mainVal : animValue,
  subVal : animSubValue,
  animVal : animValue+animSubValue
};  

} ;
