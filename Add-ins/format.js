//
// Additional formats for ChartNew.js
//
// see https://github.com/FVANCOP/ChartNew.js/wiki/900_010_format.js
//

function fmtChartJSPerso(config,value,fmt){

  switch(fmt.split(/[\s,]+/)[0].toUpperCase())
  {
    case "DATE" :
      spltdt=fmt.replace(/,/g," ").replace(/:/g," ").split(/[\s,]+/);
      var options=new Array();
      for(var i=1;i<spltdt.length;i++)
      {
        switch(spltdt[i].toUpperCase())
        {
          case "WEEKDAY" : 
          case "YEAR" :
          case "MONTH" :
          case "DAY" :
            options[spltdt[i]]=spltdt[i+1];
            break;
          default : 
            break;
        }
      }
      return_value=value.toLocaleDateString(fmt.split(" ")[1],options);
      break;  
    case "FMTDATE" :
      spltdt=fmt.split(/[\s,]+/)[1].toUpperCase();
	  return_value = spltdt.replaceArray(["DD","MM","YYYY","YY"],[value.getDate(),1+value.getMonth(),value.getFullYear(),value.getYear()%100]);
      break;    
    case "TIME" : 
      return_value=value.toLocaleTimeString();
      break; 
    case "FMTTIME" :
	  spltdt=fmt.split(/[\s,]+/)[1].toUpperCase();
	  return_value = spltdt.replaceArray(["HH","MM","SS"],[
		  value.getHours() < 10 ? '0'+value.getHours() : value.getHours(),
		  value.getMinutes() < 10 ? '0'+value.getMinutes() : value.getMinutes(),
	     value.getSeconds() < 10 ? '0'+value.getSeconds() : value.getSeconds()
	  ]);
      break;    
	case "FMTDATETIME" :
	  spltdt=fmt.splitLimit(/[\s,]+/,2)[1];
	  return_value = spltdt.replaceArray(["DD","MM","YYYY","YY","HH","mm","ss"],[
		  value.getDate(),1+value.getMonth(),value.getFullYear(),value.getYear()%100,
		  value.getHours() < 10 ? '0'+value.getHours() : value.getHours(),
		  value.getMinutes() < 10 ? '0'+value.getMinutes() : value.getMinutes(),
	     value.getSeconds() < 10 ? '0'+value.getSeconds() : value.getSeconds()
	  ]);
      break;
    default :
      return_value=value;
      break;
  }
  return(return_value);
}

String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex;
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};

String.prototype.splitLimit = function(separator,limit) {
	var splitString = this;
	var result = [];
	var pos = splitString.search(separator);
	if (pos < 0) return false;
	result.push(splitString.substring(0,pos));
	result.push(splitString.substring(pos+1));
	return result;
}


