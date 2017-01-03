  

//  options with associated default value defined in chartNew.js

//		annotateDisplay: false,
//		annotateRelocate: false,
//		annotateFunction: "mousemove",
//		annotateFontFamily: "'Arial'",
//		annotateBorder: 'none',
//		annotateBorderRadius: '2px',
//		annotateBackgroundColor: 'rgba(0,0,0,0.8)',
//		annotateFontSize: 12,
//		annotateFontColor: 'white',
//		annotateFontStyle: "normal",
//		annotatePadding: "3px",
//		annotateClassName: "",
//		annotateFunctionIn: null,
//		annotateFunctionOut : null,
//			annotateBarMinimumDetectionHeight : 0,
//	chart.defaults.IExplorer8 ={
//		annotateBackgroundColor : "black",
//		annotateFontColor: "white"

var style = document.createElement('style');
style.type = 'text/css';

line="";
line=line+".toolTipTopRight { ";
line=line+"} ";
line=line+".toolTipTopLeft { ";
line=line+"} ";
line=line+".toolTipTopCenter { ";
line=line+"} ";
line=line+".toolTipBottomRight { ";
line=line+"} ";
line=line+".toolTipBottomLeft { ";
line=line+"} ";
line=line+".toolTipBottomCenter { ";
line=line+"} ";
line=line+".toolTipRightTop { ";
line=line+"} ";
line=line+".toolTipRightBottom { ";
line=line+"} ";
line=line+".toolTipRightCenter { ";
line=line+"} ";
line=line+".toolTipLeftTop { ";
line=line+"} ";
line=line+".toolTipLeftBottom { ";
line=line+"} ";
line=line+".toolTipLeftCenter { ";
line=line+"} ";
line=line+".toolTipLeftNone { ";
line=line+"}";
line=line+'.toolTipTopRight .toolTipTopRightText::after {  ';
line=line+'    content: "";  ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid;  ';
line=line+'    border-color: transparent transparent #555 transparent;  ';
line=line+' ';
line=line+'    bottom: 100%; ';
line=line+'    right: 5px; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-left: 5px solid transparent; ';
line=line+'    border-right: 5px solid transparent; ';
line=line+'   ';
line=line+'/*    border-bottom: 5px solid black; */ ';
line=line+'} ';
line=line+'.toolTipTopLeft .toolTipTopLeftText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: transparent transparent #555 transparent; ';
line=line+' ';
line=line+'    bottom: 100%; ';
line=line+'    left: 5px; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-left: 5px solid transparent; ';
line=line+'    border-right: 5px solid transparent; ';
line=line+'   ';
line=line+'/*    border-bottom: 5px solid black; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipTopCenter .toolTipTopCenterText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: transparent transparent #555 transparent; ';
line=line+' ';
line=line+'    bottom: 100%; ';
line=line+'    left: 50%; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-left: 5px solid transparent; ';
line=line+'    border-right: 5px solid transparent; ';
line=line+'    margin-left : -5px; ';
line=line+'   ';
line=line+'/*    border-bottom: 5px solid black; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipBottomRight .toolTipBottomRightText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: #555 transparent transparent transparent; ';
line=line+' ';
line=line+'    top: 100%; ';
line=line+'    right: 5px; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-left: 5px solid transparent; ';
line=line+'    border-right: 5px solid transparent; ';
line=line+'   ';
line=line+'/*    border-top: 5px solid black;*/ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipBottomLeft .toolTipBottomLeftText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: #555 transparent transparent transparent; ';
line=line+' ';
line=line+'    top: 100%; ';
line=line+'    left: 5px; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-left: 5px solid transparent; ';
line=line+'    border-right: 5px solid transparent; ';
line=line+'   ';
line=line+'/*    border-top: 5px solid black; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipBottomCenter .toolTipBottomCenterText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: #555 transparent transparent transparent; ';
line=line+' ';
line=line+'    top: 100%; ';
line=line+'    left: 50%; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-left: 5px solid transparent; ';
line=line+'    border-right: 5px solid transparent; ';
line=line+'     ';
line=line+'    margin-left: -5px; ';
line=line+'   ';
line=line+'/*    border-top: 5px solid black; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipRightTop .toolTipRightTopText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: transparent transparent transparent #555 ; ';
line=line+' ';
line=line+'    top: 5px; ';
line=line+'    left: 100%; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-top: 5px solid transparent; ';
line=line+'    border-bottom: 5px solid transparent; ';
line=line+'   ';
line=line+'/*    border-left: 5px solid green; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipRightBottom .toolTipRightBottomText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: transparent transparent transparent #555 ; ';
line=line+' ';
line=line+'    bottom: 5px; ';
line=line+'    left: 100%; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-top: 5px solid transparent; ';
line=line+'    border-bottom: 5px solid transparent; ';
line=line+'   ';
line=line+'/*    border-left: 5px solid green; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipRightCenter .toolTipRightCenterText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: transparent transparent transparent #555 ; ';
line=line+' ';
line=line+'    bottom: 50%; ';
line=line+'    left: 100%; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-top: 5px solid transparent; ';
line=line+'    border-bottom: 5px solid transparent; ';
line=line+'    margin-bottom: -5px; ';
line=line+'   ';
line=line+'/*    border-left: 5px solid green; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipLeftBottom .toolTipLeftBottomText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: transparent #555 transparent transparent ; ';
line=line+' ';
line=line+'    bottom: 5px; ';
line=line+'    right: 100%; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-top: 5px solid transparent; ';
line=line+'    border-bottom: 5px solid transparent; ';
line=line+'   ';
line=line+'/*    border-right: 5px solid green; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipLeftTop .toolTipLeftTopText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: transparent #555 transparent transparent ; ';
line=line+' ';
line=line+'    top: 5px; ';
line=line+'    right: 100%; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-top: 5px solid transparent; ';
line=line+'    border-bottom: 5px solid transparent; ';
line=line+'   ';
line=line+'/*    border-right: 5px solid green; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipLeftCenter .toolTipLeftCenterText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'    border-style: solid; ';
line=line+'    border-color: transparent #555 transparent transparent ; ';
line=line+' ';
line=line+'    bottom: 50%; ';
line=line+'    right: 100%; ';
line=line+' ';
line=line+'    width: 0;  ';
line=line+'    height: 0;  ';
line=line+'    border-top: 5px solid transparent; ';
line=line+'    border-bottom: 5px solid transparent; ';
line=line+'    margin-bottom: -5px; ';
line=line+'   ';
line=line+'/*    border-right: 5px solid green; */ ';
line=line+'} ';
line=line+' ';
line=line+'.toolTipNone .toolTipNoneText::after {  ';
line=line+'    content: ""; ';
line=line+'    position: absolute; ';
line=line+'} ';

style.innerHTML = line
document.getElementsByTagName('head')[0].appendChild(style);

/////

var bubble_top_data = 'data:image/gif;base64,'+
    'R0lGODlhkwAQANUxAP7+/sHBwePj4+Hh4eXl5XZ2dmdnZ7q6urOzs+zs7KSkpHR0dNfX15ubm7u7'+
    'u4CAgKqqqo6Ojurq6rKyssrKyu/v73l5efr6+vv7+/Ly8vb29v39/Wtra6Ghoff392VlZZOTk9bW'+
    '1oqKiufn52lpadPT0/n5+ZWVlbGxscDAwM7Ozvj4+Ovr6+jo6Ly8vGZmZv///////wAAAAAAAAAA'+
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAADEALAAAAACTABAAAAb2wJhw'+
    'SCwaj8ikcslsOp/QaLFCgUQsnJd2y+16v+CweEwum7kcSwRCqcBgUiJhUmg4GInLe8/v+/+AgYKD'+
    'hIWGfRcJDA4NBRMEb3EBDwgCh5eYmZqbhgIIDwEAcE8SBgoDnKmqq6yAAwoGEqNMAgsHrbi5upgH'+
    'CwMATBILAbvFxsd7AQsjwEoGt8jR0qwHBh7NRwEK09zdmgooGhtHBA+o3ujpgQMPKhrYQxMI6vT1'+
    'ewgnBCuiQxUFlvYCohNQIAALDNgoNBDI0FsDECEyjBMCwUHDi9IcFHBBwMSQCAwwijTGgESHEhmG'+
    'WEgwsmWuBB9EpGiBAUYQADs=';


var bubble_middle_data = 'data:image/gif;base64,'+
    'R0lGODlhkwA8AKIGAL+/v4CAgOrq6lVVVWZmZv///////wAAACH5BAEAAAYALAAAAACTADwAAAPp'+
    'aFTc/jDKSau9OOtGRgBCoWxkaZ4o2n3hmL5wLF8rKC5zru9m3eK8oHDI8dhcxKQy5rstn9BSExmt'+
    'WiNT4HV7zXK/Vi94vBSTz0Izep1Ts98vN3wuNf7o+J7dme9n5H6BEICChQWEhoGIiX2LjHiOj3OR'+
    'km+UlWuXmGeam2Odnl+goVujpGF7VKdwpqtQra5lqVqxmbO1rLe4bLC7abq+nMDBn8PEosbHpcnK'+
    'qCx8zVy90UzM1E/T1ynZ2ifc3XXPquBK3+Qa5ucY6eoW7O0U7/AS8vOD1vYz9flF4rT8bfABjCNw'+
    'oIo9CQAAOw==';

var bubble_bottom_data = 'data:image/gif;base64,'+
    'R0lGODlhkwAtAPetAEBAQICAgOrq6lVVVb+/v2ZmZkFBQf39/fr6+vj4+Pv7+/n5+UpKSp6enuzs'+
    '7PLy8uXl5UNDQ0JCQqqqqlZWVkZGRt3d3fX19VJSUsLCwkRERFxcXF5eXvb29sTExOvr68vLy9TU'+
    '1LOzs2pqauPj42hoaHR0dIqKiunp6VNTU+3t7Wtra+Hh4UdHR7q6uklJScDAwHZ2dpKSkvz8/EVF'+
    'RW1tbXh4eKGhoU9PT4mJiWVlZU1NTWJiYq2trejo6Jubm9fX166uroyMjNvb26SkpISEhHp6enNz'+
    'c2FhYVhYWHx8fN/f3/T09FRUVH9/f3d3d8XFxVFRUWdnZ+Dg4NbW1t7e3vDw8O/v74GBgbu7u05O'+
    'TtPT06Wlpby8vO7u7vPz82xsbLCwsFdXV4ODg3BwcOfn59nZ2bKyspGRkb29vUtLS8bGxsrKysHB'+
    'wfHx8f7+/ubm5q+vr3JyclBQUHl5eUxMTIeHh9zc3GBgYLi4uM7OzpOTk11dXWRkZL6+vpSUlI6O'+
    'jtXV1aOjo4WFhZCQkFlZWWlpaX5+fltbW5WVlbe3t29vb3t7e+Tk5FpaWpeXl6mpqZiYmNHR0XFx'+
    'cdra2rS0tJ2dnc3NzZycnKKioo2NjcfHx4iIiLGxsYuLi+Li4qurq6ysrNLS0rm5uZaWll9fX2Nj'+
    'Y319fcPDw6CgoMnJydDQ0P///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAK0ALAAAAACTAC0A'+
    'AAj/AFutQMCqoMGDCBMqXMiwocOHECNKnMgKgY4BAQgIYNWKjgOKIEOKHElSpAMkGDVyBASkpMuX'+
    'MGM+BLKBQkYBrVpNyCKzp8+fIbNQoIAFBs5WbH4AXcq0qcEfWpIUyeAg55UYJJxq3eqSRIwWG3Ks'+
    'UZGz1RkRXNOqlSgiRQUeMkBYKQshAIu1ePMeZBGgBYMRDUIwKdsqDRG9iNcSwSEBw5MeFhIQRiDF'+
    'ReLLTl1IMdCCwwkYPhQQbrXERBvMqH22MUFDAg4yN7Y8eDN6gR4TllPrLunCRAsDL/Cc6AJhwehW'+
    'Bx5skkLk7u7nElkQkULDQAUxRiZQeXDgeCsFH9hw/wogIiv08wpJiAiAA4D1AUcagPiggLb3BBA8'+
    'yAAT40cWIA4QhF5qCDgARBY/xOCWARK8IMYRP3gAQQL2eddKByR40IANPGzAARI6FCDiiCSWaOKJ'+
    'KKaoYoorCBHKElpNIYIQBeiAxAYD7BABgy3ggIcRDXhAQgcWEnZABxCAMMEJZHCAAQMV7GgAAFRW'+
    'aeWVWGap5ZZcXtkgBhyM4cEBQIEwSClNvFClAQZEUAEDYJJxwgQgQNBBd0USlsAHVHRxwwlPjNBh'+
    'EkMNYOihiCaq6KKMNuqook2kkAIiTgzR0xBOOKImgzQwgEMKYmzAwwhPnHBDF1R8IFmexynwAARb'+
    'wP/QQwMy5FAEFgHkquuuvPbq66/ABuvrIUaYMAISJYRBpksJTMDHDu5pwEAKHBhighJj5CBDAz3A'+
    'sAUED4jGqncHLPCADxaEAMIaGcBAwLvwxivvvPTWa++99KaRx6xCPFFAJAKOpAIWTUjQJgMD6GCD'+
    'J9yOAsMaIIRggQ8PLIDnuEUqkAATVqjggAAghyzyyCSXbPLJKJeMAgoQVBGCB2GQsgggAYNkxhEY'+
    'uNdCFKYwkkgQqGxRBRwCqGAFEwmIi/HSTDft9NPILcDEB1WwEYcNiSxLUQgrQBsBA4XIQUgcqlgg'+
    'wBcWQ6322my3fUACXtzRxiFBgBTCCGoYoMEOPDj/cUMGd6iQwMVtF2744UXOcAEcUNgQwkRA4K33'+
    'HCXkEMcqPtyJ+Oacd77AB2HEkEBEKCxShwE0YLACIXmYcQUCnccue+EFPlL3Qw8oEYXeGNTwRxpV'+
    'fDHD7MQX7zQCjYyAgkMHoNEEABrMAcYfBLBwAeHGZ6/9cQsEIYhDZ1AAQARaGCKDH9Zjv/3627ux'+
    'ghsMDVFCBBLU0YcQLixxPfv8s38AKGdYCAKUsAPgcKAIIhjCF9TXvwbOrgxGWMgEKGCdJDBiAoFw'+
    'w/AcyEHjjQFGCLFACSQQgShMogGXcIDSOsjC2LkAEghRwCm0YAA16AANGYCDcVrIw845wAYIUQQF'+
    'yCvgCCyIwAIX6KESOUeHDxjkCjXQQAnlkAlJWIGBS8zi01IBBYNwAQMGYEAfcOgD2GnxjGvLwPdY'+
    '8YkSoC4JTuiEBYiExjo+bQqDKMgeEKEBLdTAEnq4AhbtSEjvIGAFB5gCGDbAAD7YoQuN2GEhJ8kq'+
    'JaBgD0UoQSGOwIVAPICSoMxTEBSBCS7EoAaayAAKVhjKVuZEBTUQRSVyYIcJmCGJrsxlWTpQBg/c'+
    'gAtQEMAGdalLL1DBD1BAIjGXeYEyUGIKXhhm9gICADs=';
    
    
var style = document.createElement('style');
style.type = 'text/css';
line="";
line=line+"#bubble_tooltip{ ";
line=line+"width:147px; ";
line=line+"position:absolute; ";
line=line+"display:none; ";
line=line+"} ";
line=line+"#bubble_tooltip .bubble_top{ ";
//line=line+"background-image: url('../Add-ins/bubble_top.gif'); ";
line=line+"background-image: url("+bubble_top_data+"); ";
line=line+"background-repeat:no-repeat; ";
line=line+"height:16px; ";
line=line+"} ";
line=line+"#bubble_tooltip .bubble_middle{ ";
//line=line+"background-image: url('../Add-ins/bubble_middle.gif'); ";
line=line+"background-image: url("+bubble_middle_data+"); ";
line=line+"background-repeat:repeat-y; ";
line=line+"background-position:bottom left; ";
line=line+"padding-left:7px; ";
line=line+"padding-right:7px; ";
line=line+"} ";
line=line+"#bubble_tooltip .bubble_middle span{ ";
line=line+"position:relative; ";
line=line+"top:-8px; ";
line=line+"font-family: Trebuchet MS, Lucida Sans Unicode, Arial, sans-serif; ";
line=line+"font-size:11px; ";
line=line+"} ";
line=line+"#bubble_tooltip .bubble_bottom{ ";
//line=line+"background-image: url('../Add-ins/bubble_bottom.gif'); ";
line=line+"background-image: url("+bubble_bottom_data+"); ";
line=line+"background-repeat:no-repeat; ";
line=line+"background-repeat:no-repeat; ";
line=line+"height:44px; ";
line=line+"position:relative; ";
line=line+"top:-6px; ";
line=line+"} ";

style.innerHTML = line
document.getElementsByTagName('head')[0].appendChild(style);

/////
 
function createCursorDiv(config) {
	if (cursorDivCreated == false) {
    cursorDivCreated=true;
    if(annotate_shape=="bubble_tooltip") {
   		var div = document.createElement('div');
		  div.id = 'bubble_tooltip';
		  document.body.appendChild(div);

 		  var subdiv1 = document.createElement('div');
		  subdiv1.id = 'bubble_top';
		  subdiv1.className = 'bubble_top';
      div.appendChild(subdiv1);

 		  var subdiv2 = document.createElement('div');
		  subdiv2.id = 'bubble_middle';
		  subdiv2.className = 'bubble_middle';
      div.appendChild(subdiv2);

		  var subdiv3 = document.createElement('div');
		  subdiv3.id = 'bubble_bottom';
		  subdiv3.className = 'bubble_bottom';
      div.appendChild(subdiv3);
    
      var spa = document.createElement('span');
      spa.id = "bubble_tooltip_content";
      subdiv2.appendChild(spa);
    } else if(annotate_shape == "ARROW") {
      updateClass(".toolTipTopRight","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipTopLeft","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipTopCenter","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipBottomRight","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipBottomLeft","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipBottomCenter","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipRightTop","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipRightBottom","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipRightCenter","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipLeftTop","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipLeftBottom","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipLeftCenter","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipNone","font-size:"+config.annotateFontSize+"pt;font-style:"+config.annotateFontStyle+";font-family:"+config.annotateFontFamily+";background-color:"+config.annotateBackgroundColor+";padding:"+config.annotatePadding+"; border-style: "+config.annotateBorder+"; border-radius:"+config.annotateBorderRadius+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipTopRight .toolTipTopRightText::after","border-bottom: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipTopLeft .toolTipTopLeftText::after","border-bottom: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipTopCenter .toolTipTopCenterText::after","border-bottom: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipBottomRight .toolTipBottomRightText::after","border-top: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipBottomLeft .toolTipBottomLeftText::after","border-top: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipBottomCenter .toolTipBottomCenterText::after","border-top: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipRightTop .toolTipRightTopText::after","border-left: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipRightBottom .toolTipRightBottomText::after","border-left: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipRightCenter .toolTipRightCenterText::after","border-left: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipLeftTop .toolTipLeftTopText::after","border-right: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipLeftBottom .toolTipLeftBottomText::after","border-right: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipLeftCenter .toolTipLeftCenterText::after","border-right: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");
      updateClass(".toolTipNone .toolTipNoneText::after","border-right: 5px solid " +config.annotateBackgroundColor+"; color:"+config.annotateFontColor+";");

  		var div = document.createElement(annotate_shape);
		  div.id = annotate_shape;
  	  div.style.position = 'absolute';
		  document.body.appendChild(div);

      var spa = document.createElement('span');
      spa.id = "arrow_content";
      div.appendChild(spa);
    } else {
  		var div = document.createElement(annotate_shape);
		  div.id = annotate_shape;
		  div.style.position = 'absolute';
		  document.body.appendChild(div);
    }   
	}
};

function updateClass(name,rules){
	var style = document.createElement('style');
	style.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(style);
	if(!(style.sheet||{}).insertRule) (style.styleSheet || style.sheet).addRule(name, rules);
	else style.sheet.insertRule(name+"{"+rules+"}",0);
}

function initAnnotateDiv(annotateDIV,config,ctx) { 
      if(annotate_shape == "ARROW") {
      } else if(annotate_shape!='divCursor'){
        annotateDIV.className =   annotate_shape;
  			annotateDIV.style.border = '' ;
	 		  annotateDIV.style.padding = '' ;
        annotateDIV.style.borderRadius = '';
			  annotateDIV.style.backgroundColor = '' ;
			  annotateDIV.style.color = '' ;
			  annotateDIV.style.fontFamily = '' ;
			  annotateDIV.style.fontSize = '' ;
			  annotateDIV.style.fontStyle = '' ;
    } else {
  			annotateDIV.className = (config.annotateClassName) ? config.annotateClassName : '';
  			annotateDIV.style.border = (config.annotateClassName) ? '' : config.annotateBorder;
	 		  annotateDIV.style.padding = (config.annotateClassName) ? '' : config.annotatePadding;
        annotateDIV.style.borderRadius = (config.annotateClassName) ? '' : config.annotateBorderRadius;
			  annotateDIV.style.backgroundColor = (config.annotateClassName) ? '' : config.annotateBackgroundColor;
			  annotateDIV.style.color = (config.annotateClassName) ? '' : config.annotateFontColor;
			  annotateDIV.style.fontFamily = (config.annotateClassName) ? '' : config.annotateFontFamily;
			  annotateDIV.style.fontSize = (config.annotateClassName) ? '' : (Math.ceil(ctx.chartTextScale*config.annotateFontSize)).toString() + "pt";
			  annotateDIV.style.fontStyle = (config.annotateClassName) ? '' : config.annotateFontStyle;
      }
			annotateDIV.style.zIndex = 999;
};

function displayAnnotate(ctx,data,config,rect,event,annotateDIV,jsGraphAnnotate,piece,myStatData,statData) {
  var arrow_class;
  var dispString,newPosX,newPosY,decalX,decalY;
  var addDecalX,addDecalY;
  decalX=0;
  decalY=0;                                                   

  if(typeof config.annotatePaddingX==="number") addDecalX=1*config.annotatePaddingX;
  else addDecalX=fromLeft;
  if(typeof config.annotatePaddingY==="number") addDecalY=1*config.annotatePaddingY;
  else addDecalY=fromTop;

	if (jsGraphAnnotate[ctx.ChartNewId][piece.piece][0] == "ARC") dispString = tmplbis(setOptionValue(true,true,1,"ANNOTATELABEL",ctx,data,jsGraphAnnotate[ctx.ChartNewId][piece.piece][3],undefined,config.annotateLabel,"annotateLabel",jsGraphAnnotate[ctx.ChartNewId][piece.piece][1],-1,{otherVal:true}), myStatData,config);
	else dispString = tmplbis(setOptionValue(true,true,1,"ANNOTATELABEL",ctx,data,jsGraphAnnotate[ctx.ChartNewId][piece.piece][3],undefined,config.annotateLabel,"annotateLabel",jsGraphAnnotate[ctx.ChartNewId][piece.piece][1],jsGraphAnnotate[ctx.ChartNewId][piece.piece][2],{otherVal:true}), myStatData,config);

  if(annotate_shape=="bubble_tooltip") {
	   document.getElementById('bubble_tooltip_content').innerHTML = dispString;
     annotateDIV.style.display='block';
	   var st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
	   if(navigator.userAgent.toLowerCase().indexOf('safari')>=0)st=0; 
	   var leftPos = event.clientX - 100;
	   if(leftPos<0)leftPos = 0;
	   annotateDIV.style.left = leftPos+'px';
	   annotateDIV.style.top = event.clientY - annotateDIV.offsetHeight -1 + st + 'px';
  } else if(annotate_shape == "ARROW") {
	   document.getElementById('arrow_content').innerHTML = dispString;
  } else {
	   annotateDIV.innerHTML = dispString;
  }
  
  if(annotate_shape=="bubble_tooltip") {
    var textMsr={textHeight: 100, textWidth : 147};
  } else {
    var textMsr={};
	  annotateDIV.style.display = true ? '' : 'none'; 
    var lrect = annotateDIV.getBoundingClientRect();
    textMsr.textHeight=lrect.height;
    textMsr.textWidth=lrect.width;
	}
  ctx.restore();

  // set position;

  var x,y;
	x = bw.ns4 || bw.ns5 ? event.pageX : event.x;
  y = bw.ns4 || bw.ns5 ? event.pageY : event.y;
  if (bw.ie4 || bw.ie5) y = y + eval(scrolled);

  if(config.annotateRelocate===true &&  (typeof config.annotatePosition)=="undefined" || config.annotatePosition=="mouse") {
		var relocateX, relocateY;
		relocateX=0;relocateY=0;
 		if(x+fromLeft+textMsr.textWidth > window.innerWidth-rect.left-fromLeft)relocateX=-textMsr.textWidth;
		if(y+fromTop+textMsr.textHeight > 1*window.innerHeight-1*rect.top+fromTop)relocateY-=(textMsr.textHeight+2*fromTop);
		 newPosX=Math.max(8-rect.left,x + fromLeft+relocateX);
     newPosY=Math.max(8-rect.top,y + fromTop + relocateY);
  } else {
     newPosX=x;
     newPosY=y; 
  }
  
  var mouse_posrect = getMousePos(ctx.canvas, event);
  var vj;
  var debj=piece.j;
  var endj=piece.j+1;
  var refpiecei=piece.i;
  var refpiecej=piece.j;
  var rayVal=-1;
  var midPosX=0;
  var midPosY=0;
  var minDecalY,minDecalX,maxDecalY,maxDecalX,maxRayVal,minRayVal;
  var angle=9999;
  var minAngle, maxAngle;
  var forceY=false;
  var forceX=false;
  var multX=0;
  var multY=0;
    
  tpchart=ctx.tpchart;
  if(data.datasets[piece.i].type=="Line" && (ctx.tpchart=="Bar" || ctx.tpchart=="StackedBar"))tpchart="Line";

	switch(config.annotatePositionAngle)  {
    case "center" :
    case "middle" :
      switch(tpchart) {
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          angle=(myStatData.startAngle+myStatData.endAngle)/2;
          break;
        default:
           break;
      }
      break;
    case "start" :
      switch(tpchart) {
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          angle=myStatData.startAngle;
          break;
        default:
           break;
      }
      break;
    case "end" :
      switch(tpchart) {
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          angle=myStatData.endAngle;
          break;
        default:
           break;
      }
      break;
    default:
      switch(tpchart) {
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          midPosX=myStatData.midPosX;
          midPosY=myStatData.midPosY;
          if(midPosX == mouse_posrect.x && midPosX > mouse_posrect.y) angle=Math.PI/2;
          else if(midPosX == mouse_posrect.x && midPosX > mouse_posrect.y) angle=-Math.PI/2;
          else angle=Math.atan((midPosY-mouse_posrect.y)/(midPosX-mouse_posrect.x));
          if(midPosX>mouse_posrect.x)angle+=Math.PI;
          break;
        default:
          break;
      }
      break;
  }
  
	switch(config.annotatePositionRadius)  {
    case "MXout" :
    case "Xout" :
      switch(tpchart) {
        case "Radar" :
          decalY=myStatData.posY-mouse_posrect.y - textMsr.textHeight;
          decalX=myStatData.posX-mouse_posrect.x;
          var refVal=myStatData.datavalue;          
          for(i=0;i<data.datasets.length;i++) {
            if(config.annotatePositionRadius=="MXout"){debj=0;endj=statData[i].length;}
            for(j=debj;j<endj;j++) {
              if (refVal<statData[i][j].datavalue) {
                refVal=statData[i][j].datavalue;
                decalY=statData[i][j].posY-mouse_posrect.y - textMsr.textHeight;
                decalX=statData[i][j].posX-mouse_posrect.x;
              }
            }
          };
          debj=piece.j;endj=piece.j+1;
          break;
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          multX=1;
          multY=1;
          rayVal=myStatData.radiusOffset;
          midPosX=myStatData.midPosX;
          midPosY=myStatData.midPosY;
          for(i=0;i<data.datasets.length;i++) {
            if(config.annotatePositionRadius=="MXout"){debj=0;endj=statData[i].length;}
            for(j=0;j<data.labels.length;j++) {
              rayVal=Math.max(rayVal,statData[i][j].radiusOffset);
            }
          };
          debj=piece.j;endj=piece.j+1;
          break;
        default: 
          break;
      };
      break;
    case "MXin" :
    case "Xin" :
      switch(tpchart) {
        case "Radar" :
          decalY=myStatData.posY-mouse_posrect.y - textMsr.textHeight;
          decalX=myStatData.posX-mouse_posrect.x;
          var refVal=myStatData.datavalue;          
          for(i=0;i<data.datasets.length;i++) {
            if(config.annotatePositionRadius=="MXin"){debj=0;endj=statData[i].length;}
            for(j=debj;j<endj;j++) {
              if (refVal>statData[i][j].datavalue) {
                refVal=statData[i][j].datavalue;
                decalY=statData[i][j].posY-mouse_posrect.y - textMsr.textHeight;
                decalX=statData[i][j].posX-mouse_posrect.x;
              }
            }
          };
          debj=piece.j;endj=piece.j+1;
          break;
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          multX=2;
          multY=2;
          rayVal=myStatData.int_radius;
          midPosX=myStatData.midPosX;
          midPosY=myStatData.midPosY;
          for(i=0;i<data.datasets.length;i++) {
            if(config.annotatePositionRadius=="MXin"){debj=0;endj=statData[i].length;}
            for(j=0;j<data.labels.length;j++) {
              rayVal=Math.min(rayVal,statData[i][j].int_radius);
            }
          };
          debj=piece.j;endj=piece.j+1;
          break;
        default: 
          break;
      };
      break;
    case "in" :
      switch(tpchart) {
        case "Radar" :
          decalY=myStatData.posY-mouse_posrect.y - textMsr.textHeight;
          decalX=myStatData.posX-mouse_posrect.x;
          break;
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          multX=2;
          multY=2;
          rayVal=myStatData.int_radius;
          midPosX=myStatData.midPosX;
          midPosY=myStatData.midPosY;
          break;
        default: 
          break;
      };
      break;
    case "out" :
      switch(tpchart) {
        case "Radar" :
          decalY=myStatData.posY-mouse_posrect.y - textMsr.textHeight;
          decalX=myStatData.posX-mouse_posrect.x;
          break;
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          multX=1;
          multY=1;
          rayVal=myStatData.radiusOffset;
          midPosX=myStatData.midPosX;
          midPosY=myStatData.midPosY;
          break;
        default: 
          break;
      };
      break;
     case "MXcenter" :
     case "MXmiddle" :
     case "Lcenter" :
     case "Lmiddle" :
      switch(tpchart) {
        case "Radar" :
          minDecalY=myStatData.posY-mouse_posrect.y - textMsr.textHeight;
          minDecalX=myStatData.posX-mouse_posrect.x;
          maxDecalY=myStatData.posY-mouse_posrect.y - textMsr.textHeight;
          maxDecalX=myStatData.posX-mouse_posrect.x;
          var minRefVal=myStatData.datavalue;          
          var maxRefVal=myStatData.datavalue;          
          for(i=0;i<data.datasets.length;i++) {
            if(config.annotatePositionRadius=="MXcenter" || config.annotatePositionRadius=="MXmiddle"){debj=0;endj=statData[i].length;}
            for(j=debj;j<endj;j++) {
              if (minRefVal>statData[i][j].datavalue) {
                minRefVal=statData[i][j].datavalue;
                minDecalY=statData[i][j].posY-mouse_posrect.y - textMsr.textHeight;
                minDecalX=statData[i][j].posX-mouse_posrect.x;
              }
              if (maxRefVal<statData[i][j].datavalue) {
                maxRefVal=statData[i][j].datavalue;
                maxDecalY=statData[i][j].posY-mouse_posrect.y - textMsr.textHeight;
                maxDecalX=statData[i][j].posX-mouse_posrect.x;
              }
            }
          };
          decalY=(maxDecalY+minDecalY)/2;
          decalX=(maxDecalX+minDecalX)/2;
          debj=piece.j;endj=piece.j+1;
          break;
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          multX=3;
          multY=3;
          maxRayVal=myStatData.radiusOffset;
          minRayVal=myStatData.int_radius;
          midPosX=myStatData.midPosX;
          midPosY=myStatData.midPosY;
          for(i=0;i<data.datasets.length;i++) {
            if(config.annotatePositionRadius=="MXcenter" || config.annotatePositionRadius=="MXmiddle"){debj=0;endj=statData[i].length;}
            for(j=debj;j<endj;j++) {
              if (minRayVal>statData[i][j].int_radius) {
                minRayVal=statData[i][j].int_radius;
              }
              if (maxRayVal<statData[i][j].radiusOffset) {
                maxRayVal=statData[i][j].radiusOffset;
              }
            }
            rayVal=(maxRayVal+minRayVal)/2;
          };
          break;
        default: 
          break;
      };
      break;     
     case "center" :
     case "middle" :
      switch(tpchart) {
        case "Radar" :
          decalY=myStatData.posY-mouse_posrect.y - textMsr.textHeight;
          decalX=myStatData.posX-mouse_posrect.x;
          break;
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          multX=3;
          multY=3;
          rayVal=(myStatData.int_radius+myStatData.radiusOffset)/2;
          midPosX=myStatData.midPosX;
          midPosY=myStatData.midPosY;
          break;
        default: 
          break;
      };
      break;
   default:
      switch(tpchart) {
        case "Radar" :
          decalY=myStatData.posY-mouse_posrect.y - textMsr.textHeight;
          decalX=myStatData.posX-mouse_posrect.x;
          break;
        case "Pie" :
        case "Doughnut" :
        case "PolarArea" :
          midPosX=myStatData.midPosX;
          midPosY=myStatData.midPosY;
          rayVal=Math.sqrt(Math.pow(myStatData.midPosX-mouse_posrect.x,2)+Math.pow(myStatData.midPosY-mouse_posrect.y,2));
          break;
        default: 
          break;
      };
      break;
  }  
  
  switch(config.annotatePositionY)  {
      case "LXtop" :
        switch(tpchart) {
          case "Line" :
            decalY=statData[piece.i][piece.j].posY-mouse_posrect.y - 1*textMsr.textHeight;
            for(vj=0;vj<statData[piece.i].length;vj++) decalY=Math.min(decalY,statData[piece.i][vj].posY-mouse_posrect.y - 1*textMsr.textHeight); 
            break;
          default:
            break;
        }
        if(tpchart=="Line") break;
	    case "MXtop" :
	    case "Xtop" :
	    case "SXtop" :
        switch(tpchart) {
          case "StackedBar" :
          case "Bar" :
            if(myStatData.datavalue>=0) {
              decalY=myStatData.yPosTop-mouse_posrect.y - textMsr.textHeight
              for(i=0;i<data.datasets.length;i++) {
                if(statData[i][0].tpchart!="Line") {
                  if(config.annotatePositionY=="MXtop") {debj=0;endj=statData[i].length}
                  for(vj=debj;vj<endj;vj++)decalY=Math.min(decalY,statData[i][vj].yPosTop-mouse_posrect.y - textMsr.textHeight); 
                }
              }
            }
            else {
              if(config.annotatePositionY=="SXtop") {
                addDecalY=-addDecalY; 
                for(i=0;i<data.datasets.length;i++) {
                  if(statData[i][0].tpchart!="Line")decalY=Math.max(decalY,statData[i][piece.j].yPosTop-mouse_posrect.y + 0*textMsr.textHeight); 
                }
              } else {
                for(i=0;i<data.datasets.length;i++) {
                  if(config.annotatePositionY=="MXtop") {debj=0;endj=statData[i].length;}
                  for(vj=debj;vj<endj;vj++) if(statData[i][0].tpchart!="Line")decalY=Math.min(decalY,Math.min(statData[i][vj].yPosTop,statData[i][vj].yPosBottom)-mouse_posrect.y - 1*textMsr.textHeight); 
                }
              }
            } ;            
            break;
          case "Line" :
            decalY=statData[piece.i][piece.j].posY-mouse_posrect.y - 1*textMsr.textHeight;
            for(i=0;i<data.datasets.length;i++) {
              if(config.annotatePositionY=="MXtop") {debj=0;endj=statData[i].length;}
              for(vj=debj;vj<endj;vj++) decalY=Math.min(decalY,statData[i][vj].posY-mouse_posrect.y - 1*textMsr.textHeight); 
            }
            break;
          default:
            break;
        }
        if(tpchart=="StackedBar" || tpchart=="Bar" || tpchart=="Line") break;
  		case "top" :
  		case "Stop" :
        switch(tpchart) {
          case "StackedBar" :
          case "Bar" :
            if(myStatData.datavalue>=0) decalY=myStatData.yPosTop-mouse_posrect.y - textMsr.textHeight;  
            else {
              if (config.annotatePositionY=="Stop" || config.annotatePositionY=="SXtop") { decalY=myStatData.yPosTop-mouse_posrect.y + 0*textMsr.textHeight; addDecalY=-addDecalY; }
              else                                  {decalY=myStatData.yPosBottom-mouse_posrect.y - textMsr.textHeight;}
            } 
            break;
          case "HorizontalBar" :
          case "HorizontalStackedBar" :
            decalY=myStatData.yPosTop-mouse_posrect.y - textMsr.textHeight;  
            if(config.annotatePositionY=="Stop") {
              var lrect = ctx.canvas.getBoundingClientRect();
              if(mouse_posrect.y<(lrect.height/2)) {
                decalY=myStatData.yPosBottom-mouse_posrect.y - 0*textMsr.textHeight;  
              }
            };
            break;
          case "Radar" :
            break;
          case "Line" :
            decalY=myStatData.posY-mouse_posrect.y - textMsr.textHeight;
            break;
          default:
            break;
        };
        break;
      case "LXbottom" :
        switch(tpchart) {
          case "Line" :
            decalY=statData[piece.i][piece.j].posY-mouse_posrect.y - 1*textMsr.textHeight;
            for(vj=0;vj<statData[piece.i].length;vj++) decalY=Math.max(decalY,statData[piece.i][vj].posY-mouse_posrect.y - 1*textMsr.textHeight); 
            break;
          default:
            break;
        }
        if(tpchart=="Line") break;
      case "MXbottom" :
      case "Xbottom" :
	    case "SXbottom" :
        switch(tpchart) {
          case "StackedBar" :
          case "Bar" :
            if(myStatData.datavalue>=0) {
              decalY=myStatData.yPosBottom-mouse_posrect.y + 0*textMsr.textHeight;
              for(i=0;i<data.datasets.length;i++) {
                  if(config.annotatePositionY=="MXbottom") {debj=0;endj=statData[i].length;}
                  for(vj=debj;vj<endj;vj++) {
                    if(statData[i][vj].datavalue>=0 || config.annotatePositionY=="Xbottom" || config.annotatePositionY=="MXbottom" ) {
                      if(statData[i][0].tpchart!="Line")decalY=Math.max(decalY,Math.max(statData[i][vj].yPosTop,statData[i][vj].yPosBottom)-mouse_posrect.y + 0*textMsr.textHeight); 
                    }
                  }
              }
            }
            else {
              if (config.annotatePositionY=="SXbottom") {
                addDecalY=-addDecalY; 
                decalY=myStatData.yPosBottom-mouse_posrect.y - textMsr.textHeight;
                for(i=0;i<data.datasets.length;i++) {
                  if(statData[i][piece.j].datavalue<0) {
                    if(statData[i][0].tpchart!="Line")decalY=Math.min(decalY,statData[i][piece.j].yPosBottom-mouse_posrect.y - textMsr.textHeight); 
                  }
                }
              } else {
                decalY=myStatData.yPosTop-mouse_posrect.y + 0*textMsr.textHeight;
                for(i=0;i<data.datasets.length;i++) {
                  if(config.annotatePositionY=="MXbottom") {debj=0;endj=statData[i].length;}
                  for(vj=debj;vj<endj;vj++) {
                    if(statData[i][vj].datavalue<0) {
                      if(statData[i][0].tpchart!="Line")decalY=Math.max(decalY,statData[i][vj].yPosTop-mouse_posrect.y + 0*textMsr.textHeight); 
                    }
                  } 
                }
              }
            } ;            
            break;
          case "Line" :
            decalY=statData[piece.i][piece.j].posY-mouse_posrect.y - 1*textMsr.textHeight;
            for(i=0;i<data.datasets.length;i++) {
              if(config.annotatePositionY=="MXbottom") {debj=0;endj=statData[i].length;}
              for(vj=debj;vj<endj;vj++) decalY=Math.max(decalY,statData[i][vj].posY-mouse_posrect.y - 1*textMsr.textHeight); 
            }
            break;
          default:
            break;
        }
        if(tpchart=="StackedBar" || tpchart=="Bar" || tpchart=="Line") break;
      case "bottom" :
      case "Sbottom" :
        switch(tpchart) {
          case "StackedBar" :
          case "Bar" :
            if(myStatData.datavalue>=0) decalY=myStatData.yPosBottom-mouse_posrect.y + 0*textMsr.textHeight;  
            else  {
                if (config.annotatePositionY=="Sbottom" || config.annotatePositionY=="SXbottom") {decalY=myStatData.yPosBottom-mouse_posrect.y - textMsr.textHeight; addDecalY=-addDecalY; }
                else decalY=myStatData.yPosTop-mouse_posrect.y + 0*textMsr.textHeight;
            }
            break;
          case "HorizontalBar" :
          case "HorizontalStackedBar" :
            decalY=myStatData.yPosBottom-mouse_posrect.y - 0*textMsr.textHeight;  
            if(config.annotatePositionY=="Sbottom") {
              var lrect = ctx.canvas.getBoundingClientRect();
              if(mouse_posrect.y<(lrect.height/2)) {
                decalY=myStatData.yPosTop-mouse_posrect.y - textMsr.textHeight;  
              }
            };
            break;
          case "Radar" :
            decalY+=textMsr.textHeight;
            break;
          case "Line" :
            decalY=myStatData.posY-mouse_posrect.y - 0*textMsr.textHeight;
            break;
          default :
            break;
        };
        break;
      case "Xcenter" :
      case "Xmiddle" :
        switch(tpchart) {
          case "HorizontalBar" :
                var mtop=Math.min(statData[piece.i][piece.j].yPosTop,statData[piece.i][piece.j].yPosBottom);
                var mbottom=Math.max(statData[piece.i][piece.j].yPosTop,statData[piece.i][piece.j].yPosBottom);

                for(i=0;i<data.datasets.length;i++) {
                  if(statData[i][0].tpchart!="Line"){
                    mtop=Math.min(mtop,statData[i][piece.j].yPosTop,statData[i][piece.j].yPosBottom);
                    mbottom=Math.max(mbottom,statData[i][piece.j].yPosTop,statData[i][piece.j].yPosBottom);
                  }
                }
                decalY=(mtop+mbottom)/2 - mouse_posrect.y - 0.5*textMsr.textHeight; 
            break;
          default:
            break;
        };
        if(tpchart=="HorizontalBar") break;
      case "center" :
      case "middle" :
        switch(tpchart) {
          case "Bar" :
          case "StackedBar" :
            if(myStatData.datavalue>=0) decalY=(myStatData.yPosBottom+myStatData.yPosTop)/2-mouse_posrect.y - 0.5*textMsr.textHeight;  
            else                        decalY=(myStatData.yPosBottom+myStatData.yPosTop)/2-mouse_posrect.y - 0.5*textMsr.textHeight;  
            break;
          case "HorizontalBar" :
          case "HorizontalStackedBar" :
            decalY=(myStatData.yPosBottom+myStatData.yPosTop)/2-mouse_posrect.y - 0.5*textMsr.textHeight;  
            break;
          case "Radar" :
            decalY+=0.5*textMsr.textHeight;
            break;
          case "Line" :
            decalY=myStatData.posY-mouse_posrect.y - 0.5*textMsr.textHeight;
            break;
          default :
            break;
        };
        break;
      default:
        if(typeof config.annotatePositionY==="number") {
          var lrect = ctx.canvas.getBoundingClientRect();
          decalY=-newPosY+1*config.annotatePositionY+lrect.top+window.pageYOffset;
          forceY=true;
        } else if (typeof config.annotatePositionY!="undefined" && config.annotatePositionY.indexOf("%")>0) {
          var lrect = ctx.canvas.getBoundingClientRect();
          var pct=1*config.annotatePositionY.substr(0,config.annotatePositionY.indexOf("%"));
          decalY=-newPosY+(1*ctx.canvas.height*pct/100)/window.devicePixelRatio+lrect.top+window.pageYOffset;
          if(Math.abs(pct-50) < config.zeroValue) {
            decalY=decalY-textMsr.textHeight/2;
          } else if(pct > 50) {
            decalY=decalY-textMsr.textHeight;
          }
          forceY=true;
        }
        break;
  }                                                                            

	switch(config.annotatePositionX)  {
  
      case "MXright" :
      case "Xright" :
      case "SXright" :
        switch(tpchart) {
          case "HorizontalStackedBar" :
          case "HorizontalBar" :
            if(myStatData.datavalue>=0) {
              decalX=myStatData.xPosRight-mouse_posrect.x;
              for(i=0;i<data.datasets.length;i++) {
                if(config.annotatePositionX=="MXright") {debj=0;endj=statData[i].length;}
                for(vj=debj;vj<endj;vj++)decalX=Math.max(decalX,statData[i][vj].xPosRight-mouse_posrect.x); 
              }
            } else {
              if(config.annotatePositionX=="SXright") {
                addDecalX=-addDecalX; 
                decalX=myStatData.xPosRight-mouse_posrect.x -textMsr.textWidth;
                for(i=0;i<data.datasets.length;i++) {
                  decalX=Math.min(decalX,statData[i][piece.j].xPosRight-mouse_posrect.x -textMsr.textWidth); 
                }
              } else {
                decalX=myStatData.xPosLeft-mouse_posrect.x -textMsr.textWidth;
                for(i=0;i<data.datasets.length;i++) {
                  if(config.annotatePositionX=="MXright") {debj=0;endj=statData[i].length;}
                  for(vj=debj;vj<endj;vj++)decalX=Math.max(decalX,Math.max(statData[i][vj].xPosRight,statData[i][vj].xPosLeft)-mouse_posrect.x  + 0*textMsr.textWidth); 
                }
              }
            }
            break;
          case "Line" :
            for(i=0;i<data.datasets.length;i++) {
              if(config.annotatePositionY=="MXtop") {debj=0;endj=statData[i].length;}
              for(vj=debj;vj<endj;vj++) if(statData[i][0].tpchart!="Line")decalX=Math.min(decalY,statData[i][vj].posX-mouse_posrect.x - 1*textMsr.textWidth); 
            }
            break;
          default : 
            break;
          }      
          if (tpchart=="HorizontalStackedBar" || tpchart=="HorizontalBar")break;        
			case "right" :
			case "Sright" :
        switch(tpchart) {
          case "Bar" :
          case "StackedBar" :
            decalX=myStatData.xPosRight-mouse_posrect.x;
            if(config.annotatePositionX=="Sright" || config.annotatePositionX=="SXright") {
              var lrect = ctx.canvas.getBoundingClientRect();
              if(mouse_posrect.x>(lrect.width/2)) {
                 decalX=myStatData.xPosLeft-mouse_posrect.x-textMsr.textWidth;
              }
            };
            break;
          case "HorizontalStackedBar" :
          case "HorizontalBar" :
            if(myStatData.datavalue>=0) decalX=myStatData.xPosRight-mouse_posrect.x;
            else {
              if(config.annotatePositionX=="SXright" || config.annotatePositionX=="Sright") {
                decalX=myStatData.xPosRight-mouse_posrect.x -textMsr.textWidth;
                addDecalX=-addDecalX; 
              } else {
                decalX=myStatData.xPosLeft-mouse_posrect.x ;
              }
            }
            break;
          case "Radar" :
            break;
          case "Line" :
            decalX=myStatData.xPos-mouse_posrect.x;
            break;
          default :
            break;
        };
        break;
      case "MXleft" :
      case "SXleft" :
      case "Xleft" :
        switch(tpchart) {
          case "HorizontalStackedBar" :
          case "HorizontalBar" :
            if(myStatData.datavalue>=0) {
              decalX=myStatData.xPosLeft-mouse_posrect.x-textMsr.textWidth;
              for(i=0;i<data.datasets.length;i++) {
                if(config.annotatePositionX=="MXleft") {debj=0;endj=statData[i].length;}
                for(vj=debj;vj<endj;vj++) {
                    if(config.annotatePositionX=="Xleft" || config.annotatePositionX=="MXleft") {
                      decalX=Math.min(decalX,Math.min(statData[i][vj].xPosLeft,statData[i][vj].xPosRight)-mouse_posrect.x-textMsr.textWidth);
                    } else if(statData[i][vj].datavalue>0) {
                      decalX=Math.min(decalX,Math.min(statData[i][vj].xPosLeft,statData[i][vj].xPosRight)-mouse_posrect.x-textMsr.textWidth); 
                    }
                }
              }
            } else {
              if(config.annotatePositionX=="SXleft") {
                addDecalX=-addDecalX; 
                decalX=myStatData.xPosLeft-mouse_posrect.x ; 
                for(i=0;i<data.datasets.length;i++) {
                  if(statData[i][piece.j].datavalue<0) {
                    decalX=Math.max(decalX,statData[i][piece.j].xPosLeft-mouse_posrect.x); 
                  }
                }
              } else {
                decalX=myStatData.xPosLeft-mouse_posrect.x -textMsr.textWidth; 
                for(i=0;i<data.datasets.length;i++) {
                  if(config.annotatePositionX=="MXleft") {debj=0;endj=statData[i].length;}
                  for(vj=debj;vj<endj;vj++)if(statData[i][vj].datavalue<0)decalX=Math.min(decalX,Math.min(statData[i][vj].xPosLeft,statData[i][vj].xPosRight)-mouse_posrect.x-textMsr.textWidth); 
                }
              }
            }
            break;
          default : 
            break;
          }      
          if (tpchart=="HorizontalStackedBar" || tpchart=="HorizontalBar")break;        
      case "Sleft" :
      case "left" :
        switch(tpchart) {
          case "Bar" :
          case "StackedBar" :
            decalX=myStatData.xPosLeft-mouse_posrect.x-textMsr.textWidth;
            if(config.annotatePositionX=="Sleft" || config.annotatePositionX=="SXleft") {
              var lrect = ctx.canvas.getBoundingClientRect();
              if(mouse_posrect.x>(lrect.width/2)) {
                 decalX=myStatData.xPosRight-mouse_posrect.x;
              }
            };
            break;
          case "HorizontalStackedBar" :
          case "HorizontalBar" :
            if(myStatData.datavalue>=0) decalX=myStatData.xPosLeft-mouse_posrect.x-textMsr.textWidth;
            else {
              if(config.annotatePositionX=="Sleft" || config.annotatePositionX=="SXleft"){
                decalX=myStatData.xPosLeft-mouse_posrect.x ; 
                addDecalX=-addDecalX; 
              } else {
                decalX=myStatData.xPosRight-mouse_posrect.x-textMsr.textWidth ; 
              }
            }
            break;
          case "Radar" :
            decalX-=textMsr.textWidth;
            break;
          case "Line" :
            decalX=myStatData.xPos-mouse_posrect.x-textMsr.textWidth;
            break;
          default:
            break;
        };
        break;
      case "Xcenter" :
      case "Xmiddle" :
        switch(tpchart) {
          case "Bar" :
                var mright=Math.min(statData[piece.i][piece.j].xPosRight,statData[piece.i][piece.j].xPosLeft);
                var mleft=Math.max(statData[piece.i][piece.j].xPosRight,statData[piece.i][piece.j].xPosLeft);

                for(i=0;i<data.datasets.length;i++) {
                  if(statData[i][0].tpchart!="Line"){
                    mright=Math.min(mright,statData[i][piece.j].xPosRight,statData[i][piece.j].xPosLeft);
                    mleft=Math.max(mleft,statData[i][piece.j].xPosRight,statData[i][piece.j].xPosLeft);
                  }
                }
                decalX=(mright+mleft)/2 - mouse_posrect.x - 0.5*textMsr.textWidth; 
            break;
          default:
            break;
        };
        if(tpchart=="Bar") break;
      case "center" :
      case "middle" :
        switch(tpchart) {
          case "Bar" :
          case "StackedBar" :
            decalX=(myStatData.xPosLeft+myStatData.xPosRight)/2-mouse_posrect.x-textMsr.textWidth/2;
            break;
          case "HorizontalBar" :
          case "HorizontalStackedBar" :
            if(myStatData.datavalue>=0) decalX=(myStatData.xPosLeft+myStatData.xPosRight)/2-mouse_posrect.x-textMsr.textWidth/2;
            else                        decalX=(myStatData.xPosLeft+myStatData.xPosRight)/2-mouse_posrect.x - textMsr.textWidth/2 ;
            break;
          case "Radar" :
            decalX-=0.5*textMsr.textWidth;
            break;
          case "Line" :
            decalX=myStatData.xPos-mouse_posrect.x-(textMsr.textWidth/2);
            break;
          default: 
            break;
        };
        break;
      default:
        if(typeof config.annotatePositionX==="number") {
          var lrect = ctx.canvas.getBoundingClientRect();
          decalX=-newPosX+1*config.annotatePositionX+lrect.left+window.pageXOffset;
          forceX=true;
        } else if (typeof config.annotatePositionX !="undefined" && config.annotatePositionX.indexOf("%")>0) {
          var pct=1*config.annotatePositionX.substr(0,config.annotatePositionX.indexOf("%"));
          decalX=-newPosX+(1*ctx.canvas.width*pct/100)/window.devicePixelRatio+lrect.left+window.pageXOffset;
          if(Math.abs(pct-50) < config.zeroValue) {
            decalX=decalX-textMsr.textWidth/2;
          } else if(pct > 50) {
            decalX=decalX-textMsr.textWidth;
          }
          forceX=true;
        } 
        break;
  }  
  
  if(tpchart=="Pie" || tpchart=="Doughnut" || tpchart=="PolarArea") {

    if(typeof config.annotatePaddingAngle=="number" )angle+=Math.PI*(1*config.annotatePaddingAngle)/180;
    if(typeof config.annotatePaddingRadius=="number")rayVal+=(1*config.annotatePaddingRadius);

    while(angle<0){angle+=2*Math.PI;}
    while(angle>2*Math.PI){angle-=2*Math.PI;}
    
    var lrect = ctx.canvas.getBoundingClientRect();
    if(!forceY){
      decalY=-newPosY+1*midPosY+lrect.top+window.pageYOffset;
      decalY+=rayVal*Math.sin(angle);
    }
    if(!forceX){
      decalX=-newPosX+1*midPosX+lrect.left+window.pageXOffset;
      decalX+=rayVal*Math.cos(angle);
    }
    
    if(angle>0.5*Math.PI && angle < 1.5*Math.PI) {
      if(multX==1){decalX-=textMsr.textWidth;addDecalX=-addDecalX;}
      else if(multX==3)decalX-=0.5*textMsr.textWidth;
    }
    if(angle<=0.5*Math.PI || angle >= 1.5*Math.PI) {
      if(multX==2){decalX-=textMsr.textWidth;addDecalX-=addDecalX;}
      else if(multX==3)decalX-=0.5*textMsr.textWidth;
    }
    
    if(angle>Math.PI) {
      if(multY==1){decalY-=textMsr.textHeight;addDecalY=-addDecalY;}
      else if(multY==3)decalY-=0.5*textMsr.textHeight;
    } 
    if(angle<=Math.PI) {
      if(multY==2){decalY-=textMsr.textHeight;addDecalY=-addDecalY;}
      else if(multY==3)decalY-=0.5*textMsr.textHeight;
    }

  }

  if(annotate_shape!='bubble_tooltip') {
    if(annotate_shape == "ARROW") {
      if(config.annotateClassName =="") {
        var lrect = ctx.canvas.getBoundingClientRect();
        arrow_class=arrowDirection(newPosX+decalX+addDecalX-(lrect.left+window.pageXOffset), newPosY+decalY+addDecalY-(lrect.top+window.pageYOffset), angle, rayVal, textMsr.textWidth,textMsr.textHeight,ctx,jsGraphAnnotate[ctx.ChartNewId][piece.piece],myStatData);
        annotateDIV.className = "toolTip"+arrow_class;
        document.getElementById('arrow_content').className="toolTip"+arrow_class+"Text";
      } else {
        annotateDIV.className = "toolTip"+config.annotateClassName;
        document.getElementById('arrow_content').className="toolTip"+config.annotateClassName+"Text";
      }
    }
    oCursor.moveIt(newPosX+decalX+addDecalX, newPosY+decalY+addDecalY);
   	annotateDIV.style.display = true ? '' : 'none'; 
  }
};	


function arrowDirection(x,y,angle,rayVal,width,height,ctx,jsGraphAnnotate,myStatData) {
  var h_arrow="Center";
  var h_in=true;
  var v_arrow="Center";
  var v_in=true;
  switch(jsGraphAnnotate[0]) {
    case "ARC":
      return("None");
      break;
    case "MARC":
      var centerPosX=myStatData.midPosX+((myStatData.radiusOffset+myStatData.int_radius)/2)*Math.cos((myStatData.startAngle+myStatData.endAngle)/2);
      var centerPosY=myStatData.midPosY+((myStatData.radiusOffset+myStatData.int_radius)/2)*Math.sin((myStatData.startAngle+myStatData.endAngle)/2);

      var minDist=Number.MAX_VALUE;
      var arrow="None";
      var topCenterPos=compAnglPos((2*x+width)/2,y-5,myStatData,centerPosX,centerPosY);
      if(topCenterPos.distCenter < minDist){ arrow="TopCenter"; minDist=topCenterPos.distCenter; }
      var bottomCenterPos=compAnglPos((2*x+width)/2,y+height+5,myStatData,centerPosX,centerPosY);
      if(bottomCenterPos.distCenter < minDist){ arrow="BottomCenter"; minDist=bottomCenterPos.distCenter; }

      var topLeftPos=compAnglPos(x+5+2.5,y-5,myStatData,centerPosX,centerPosY);
      if(topLeftPos.distCenter < minDist){ arrow="TopLeft"; minDist=topLeftPos.distCenter; }

      var topRightPos=compAnglPos(x+width-5-2.5,y-5,myStatData,centerPosX,centerPosY);
      if(topRightPos.distCenter < minDist){ arrow="TopRight"; minDist=topRightPos.distCenter; }

      var bottomLeftPos=compAnglPos(x+5+2.5,y+height+5,myStatData,centerPosX,centerPosY);
      if(bottomLeftPos.distCenter < minDist){ arrow="BottomLeft"; minDist=bottomLeftPos.distCenter; }

      var bottomRightPos=compAnglPos(x+width-5-2.5,y+height+5,myStatData,centerPosX,centerPosY);
      if(bottomRightPos.distCenter < minDist){ arrow="BottomRight"; minDist=bottomRightPos.distCenter; }

      var leftCenterPos=compAnglPos(x-5,(2*y+height)/2,myStatData,centerPosX,centerPosY);
      if(leftCenterPos.distCenter < minDist){ arrow="LeftCenter"; minDist=leftCenterPos.distCenter; }

      var leftTopPos=compAnglPos(x-5,y+5+2.5,myStatData,centerPosX,centerPosY);
      if(leftTopPos.distCenter < minDist){ arrow="LeftTop"; minDist=leftTopPos.distCenter; }

      var leftBottomPos=compAnglPos(x-5,y+height-5-2.5,myStatData,centerPosX,centerPosY);
      if(leftBottomPos.distCenter < minDist){ arrow="LeftBottom"; minDist=leftBottomPos.distCenter; }

      var rightCenterPos=compAnglPos(x+width+5,(2*y+height)/2,myStatData,centerPosX,centerPosY);
      if(rightCenterPos.distCenter < minDist){ arrow="RightCenter"; minDist=rightCenterPos.distCenter; }

      var rightTopPos=compAnglPos(x+width+5,y+5+2.5,myStatData,centerPosX,centerPosY);
      if(rightTopPos.distCenter < minDist){ arrow="RightTop"; minDist=rightTopPos.distCenter; }

      var rightBottomPos=compAnglPos(x+width+5,y+height-5-2.5,myStatData,centerPosX,centerPosY);
      if(rightBottomPos.distCenter < minDist){ arrow="RightBottom"; minDist=rightBottomPos.distCenter; }

      return(arrow);
      break;
    case "RECT" :
      var xright=Math.min(myStatData.xPosRight,myStatData.xPosLeft);
      var xleft=Math.max(myStatData.xPosRight,myStatData.xPosLeft);
      var ytop=Math.min(myStatData.yPosBottom,myStatData.yPosTop);
      var ybottom=Math.max(myStatData.yPosBottom,myStatData.yPosTop);
      var minDistance,distance;
      var arrow;
      arrow="None";   

      if((2*x+width)/2 > xright  && (2*x+width)/2 < xleft) {
        if((2*y+height)/2 < (ytop+ybottom)/2) return("BottomCenter");
        else return ("TopCenter");        
      } else if(x > xright+5  && x < xleft-5) {
        if((2*y+height)/2 < (ytop+ybottom)/2) return("BottomLeft");
        else return ("TopLeft");        
      } else if(x+width > xright+5  && x+width < xleft-5) {
        if((2*y+height)/2 < (ytop+ybottom)/2) return("BottomRight");
        else return ("TopRight");        
      } else if((2*y+height)/2 > ytop && (2*y+height)/2 < ybottom) {
        if(x>xleft-5) return("LeftCenter");
        else if (x+width < xright+5) return("RightCenter");
        else return("None");  // Should never come here;
      } else if(y < ybottom -5 && y > ytop+5) {
        if(x>xleft-5) return("LeftTop");
        else if (x+width < xright+5) return("RightTop");
        else return("None");  // Should never come here;
      } else if(y+height < ybottom -5 && y+height > ytop+5) {
        if(x>xleft-5) return("LeftBottom");
        else if (x+width < xright+5) return("RightBottom");
        else return("None");  // Should never come here;
      }
      return("None");      
      break;
    case "POINT" :
      var xP=myStatData.posX;
      var yP=myStatData.posY;
      if(xP>x && xP<x+width && yP>y && yP<y+height)return("None") ;
      else if(yP>y+height) {
        if(xP>x && xP<x+width) {
          if(xP<x+width/4) return("BottomLeft");
          else if (xP>x+3*width/4) return("BottomRight");
          else return("BottomCenter");
        } else return("None")
      } else if(yP<y) {
        if(xP>x && xP<x+width) {
          if(xP<x+width/4) return("TopLeft");
          else if (xP>x+3*width/4) return("TopRight");
          else return("TopCenter");
        } else return("None")
      } else if(xP>x+width) {
        if(yP>y && yP<y+height) {
          if(yP<y+height/4) return("RightTop");
          else if (yP>y+3*height/4) return("RightBottom");
          else return("RightCenter");
        } else return("None")
      } else if(xP<x) {
        if(yP>y && yP<y+height) {
          if(yP<y+height/4) return("LeftTop");
          else if (yP>y+3*height/4) return("LeftBottom");
          else return("LeftCenter");
        } else return("None")
      }
      return("None");
      break;
    default:
      return("None");
      break;
    }
};

function inArc(elt,myStatData) {
  if(elt.rayVal<=myStatData.radiusOffset && elt.rayVal>=myStatData.int_radius && inAngle(elt.angle,myStatData.startAngle,myStatData.endAngle)) return(true);
  else return(false);
};

function inAngle(angle,startAngle,stopAngle){
  if(angle>startAngle && angle <stopAngle) return(true);
  else if(angle+ 2*Math.PI>startAngle && angle+2*Math.PI <stopAngle) return(true);
  else return(false); 
};

function compAnglPos(x,y,myStatData,centerX,centerY) {
  rayVal=Math.sqrt(Math.pow(x-myStatData.midPosX,2)+Math.pow(y-myStatData.midPosY,2));
  angle=Math.acos((x-myStatData.midPosX)/rayVal);
  if(y<myStatData.midPosY)angle=2*Math.PI-angle;
  if(!inArc({rayVal:rayVal,angle:angle},myStatData)){
    distCenter=1000+2*Math.sqrt(Math.pow(myStatData.midPosX-centerX,2)+Math.pow(myStatData.midPosY-centerY,2));
    if(rayVal<myStatData.int_radius) {
      if(inAngle(angle,myStatData.startAngle,myStatData.endAngle)) distCenter+=(myStatData.int_radius-rayVal);
      else {
        distCenter*=2;
        if(angle<myStatData.startAngle)distCenter+=Math.sqrt(2*rayVal*rayVal*(1-Math.cos(myStatData.startAngle-angle)));
        else distCenter+=Math.sqrt(2*rayVal*rayVal*(1-Math.cos(angle-myStatData.endAngle)));
      }
    } else if(rayVal>myStatData.radiusOffset) {
      if(inAngle(angle,myStatData.startAngle,myStatData.endAngle)) distCenter+=(rayVal-myStatData.radiusOffset);
      else {
        distCenter*=2;
        if(angle<myStatData.startAngle)distCenter+=Math.sqrt(2*rayVal*rayVal*(1-Math.cos(myStatData.startAngle-angle)));
        else distCenter+=Math.sqrt(2*rayVal*rayVal*(1-Math.cos(angle-myStatData.endAngle)));
      }
    } else {
        distCenter*=2;
        if(angle<myStatData.startAngle)distCenter+=Math.sqrt(2*rayVal*rayVal*(1-Math.cos(myStatData.startAngle-angle)));
        else distCenter+=Math.sqrt(2*rayVal*rayVal*(1-Math.cos(angle-myStatData.endAngle)));
    }
  } else distCenter=Math.sqrt(Math.pow(x-centerX,2)+Math.pow(y-centerY,2));
  return { angle:angle, rayVal: rayVal, distCenter : distCenter};
};
