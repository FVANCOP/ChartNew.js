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
      spltdt=fmt.split(/[\s,]+/)[1].split("/");
      return_value="";
      for(var i=0;i<spltdt.length;i++)
      {
        if(i>0)return_value=return_value+"/";
        switch(spltdt[i].toUpperCase())
        {
          case "DD" :
            return_value=return_value+value.getDate(); 
            break;
          case "MM" :
            return_value=return_value+(1+value.getMonth()); 
            break;
          case "YYYY" :
            return_value=return_value+value.getFullYear(); 
            break;
          case "YY" :
            return_value=return_value+(value.getYear()%100); 
            break;
          default : 
            break;
        }
      }
      break;    
    case "TIME" : 
      return_value=value.toLocaleTimeString();
      break; 
    case "FMTTIME" :
      spltdt=fmt.split(/[\s,]+/)[1].split(":");
      return_value="";
      for(var i=0;i<spltdt.length;i++)
      {
        if(i>0)return_value=return_value+":";
        switch(spltdt[i].toUpperCase())
        {
          case "HH" :
            if(value.getHours()<10)return_value=return_value+'0'+value.getHours();
            else return_value=return_value+value.getHours(); 
            break;
          case "MM" :
            if(value.getMinutes()<10)return_value=return_value+'0'+value.getMinutes();
            else return_value=return_value+value.getMinutes(); 
            break;
          case "SS" :
            if(value.getSeconds()<10)return_value=return_value+'0'+value.getSeconds();
            else return_value=return_value+value.getSeconds(); 
            break;
          default : 
            break;
        }
      }
      break;    
    default :
      return_value=value;
      break;
  }
  return(return_value);
}


