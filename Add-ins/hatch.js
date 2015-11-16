// JavaScript Document

function addHatch(data,param) {

	// check conditions;
	
	if(data.datasets.length !=2) return;
	// find xBegin and xEnd values;
	if(typeof data.xBegin == "undefined") data.xBegin=1 * data.labels[0];
	if(typeof data.xEnd == "undefined") data.xEnd=1 * data.labels[data.labels.length - 1];
	if(typeof data.xBegin != "number" || isNaN(data.xBegin))data.xBegin=0;
	if (data.xEnd <= data.xBegin || isNaN(data.xEnd)) data.xEnd = data.xBegin + 100;

	nb_hatch_lines= (typeof param.nb_hatch_lines != "undefined" ? param.nb_hatch_lines : 100)
	data.datasets[2] ={
      			data : [],
      			xPos : [],
			origin : [],
      			linkType : 1,
      			animation : (typeof param.animation != "undefined" ? param.animation : true),
      			inGraphDataShow: (typeof param.positive_inGraphDataShow != "undefined" ? param.positive_inGraphDataShow : false),
      			annotateDisplay : (typeof param.positive_annotateDisplay != "undefined" ? param.positive_annotateDisplay : false),
      			title : (typeof param.positive_title != "undefined" ? param.positive_title : ""),
			strokeColor : (typeof param.positive_strokeColor != "undefined" ? param.positive_strokeColor : "red"),
			datasetStrokeWidth : (typeof param.positive_datasetStrokeWidth != "undefined" ? param.positive_datasetStrokeWidth : 2),
			datasetStrokeStyle : (typeof param.positive_datasetStrokeStyle != "undefined" ? param.positive_datasetStrokeStyle : "solid"),
			pointColor : (typeof param.positive_pointColor != "undefined" ? param.positive_pointColor : "rgba(0,0,0,0)"),
        		pointStrokeColor : (typeof param.positive_pointStrokeColor != "undefined" ? param.positive_pointStrokeColor : "rgba(0,0,0,0)")    			
	};

	data.datasets[3] ={
      			data : [],
      			xPos : [],
			origin : [],
      			linkType : 1,
      			animation : (typeof param.animation != "undefined" ? param.animation : true),
      			inGraphDataShow: (typeof param.negative_inGraphDataShow != "undefined" ? param.negative_inGraphDataShow : false),
      			annotateDisplay : (typeof param.negative_annotateDisplay != "undefined" ? param.negative_annotateDisplay : false),
      			title : (typeof param.negative_title != "undefined" ? param.negative_title : ""),
			strokeColor : (typeof param.negative_strokeColor != "undefined" ? param.negative_strokeColor : "blue"),
			datasetStrokeWidth : (typeof param.negative_datasetStrokeWidth != "undefined" ? param.negative_datasetStrokeWidth : 2),
			datasetStrokeStyle : (typeof param.negative_datasetStrokeStyle != "undefined" ? param.negative_datasetStrokeStyle : "solid"),
			pointColor : (typeof param.negative_pointColor != "undefined" ? param.negative_pointColor : "rgba(0,0,0,0)"),
        		pointStrokeColor : (typeof param.negative_pointStrokeColor != "undefined" ? param.negative_pointStrokeColor : "rgba(0,0,0,0)")    			
	};
	
	var v1,v2,vpos;	        	
	var cntp=0,cntn=0;
	for(var i=0;i<nb_hatch_lines;i++) {
		vpos=data.xBegin+i*(data.xEnd-data.xBegin)/(nb_hatch_lines-1);
		v1=setDataVal(vpos,0,data);		
		v2=setDataVal(vpos,1,data);		
		
		if(v1>v2) {
			data.datasets[2].xPos[cntp]=vpos;
			data.datasets[2].origin[cntp]=v1;		
			data.datasets[2].data[cntp]=v2;
			cntp++;		
		} else {
			data.datasets[3].xPos[cntn]=vpos;
			data.datasets[3].origin[cntn]=v1;		
			data.datasets[3].data[cntn]=v2;		
			cntn++;
		}
	}
	
	
	var tmpdata=data.datasets[0];
	data.datasets[0]=data.datasets[1];
	data.datasets[1]=data.datasets[2];
	data.datasets[2]=data.datasets[3];
	data.datasets[3]=tmpdata;
	tmpdata=data.datasets[0];
	data.datasets[0]=data.datasets[1];
	data.datasets[1]=data.datasets[2];
	data.datasets[2]=data.datasets[3];
	data.datasets[3]=tmpdata;
	
	if(data.datasets[1].xPos.length==0) {
		data.datasets[1]=data.datasets[2];
		data.datasets[2]=data.datasets[3];
		data.datasets.pop();
	}	
	if(data.datasets[0].xPos.length==0) {
		data.datasets[0]=data.datasets[1];
		data.datasets[1]=data.datasets[2];
		if(data.datasets.length==4)data.datasets[2]=data.datasets[3];
		data.datasets.pop();
	}	


	function setDataVal(xpos,i,data) {
		var pt0x, pt1x, pt0y, pt1y,rtval;
		if(xpos<data.xBegin) return null;
		if(xpos>data.xEnd) return null;
		if(Math.abs(xpos-data.xBegin)<0.0001)return data.datasets[i].data[0];

		if(typeof data.datasets[i].xPos=="undefined") {
			if(xpos==data.xBegin)return data.datasets[i].data[0];
			var curpos=(xpos-data.xBegin)/((data.xEnd-data.xBegin)/(data.labels.length-1));
			if(Math.abs(curpos-Math.round(curpos))<0.0001) return data.datasets[i].data[Math.round(curpos)];
			else {
				pt0x=data.xBegin+Math.floor(curpos)*((data.xEnd-data.xBegin)/(data.labels.length-1));
				pt1x=data.xBegin+Math.ceil(curpos)*((data.xEnd-data.xBegin)/(data.labels.length-1));
				pt0y=data.datasets[i].data[Math.floor(curpos)];
				pt1y=data.datasets[i].data[Math.ceil(curpos)];
			}
		} else {
		        var j=data.datasets[i].xPos.length-1;
			while(j>=0 && typeof pt0x=="undefined") {
				if(typeof (1*data.datasets[i].xPos[j])=="number" && typeof (1*data.datasets[i].data[j])=="number" && typeof pt0x == "undefined") {

					if(Math.abs(xpos-1*data.datasets[i].xPos[j])<0.0001) return data.datasets[i].data[j];
					if(xpos>=1*data.datasets[i].xPos[j]) {
						pt0x=1*data.datasets[i].xPos[j];
						pt0y=1*data.datasets[i].data[j];
					}
				}
				j--;
			}
			if(typeof pt0x != "undefined") {
				j++;
				while(j<data.datasets[i].xPos.length && typeof pt1x=="undefined") {
					if(typeof (1*data.datasets[i].xPos[j])=="number" && typeof (1*data.datasets[i].data[j])=="number" && typeof pt1x == "undefined") {
						if(xpos<1*data.datasets[i].xPos[j]) {
							pt1x=1*data.datasets[i].xPos[j];
							pt1y=1*data.datasets[i].data[j];
						}
					}
					j++;
				}
			}						
		}

		if(typeof pt0x != "undefined" && typeof pt1x != "undefined") {
			var a=(pt0y-pt1y)/(pt0x-pt1x);
			var b=pt0y-a*pt0x;
			rtval=a*xpos+b;
		}
		return rtval;
	}	

	

	
};
