function mean(params) {
	var datasetNr = params.datasetNr;
	var data = params.data;
	var mean = 0;
	var nr = 0;
	for (var j = 0; j < data.datasets[datasetNr].data.length; j++) {
		// important to check because missing values are possible
		if (data.datasets[datasetNr].data[j]) {
			mean += data.datasets[datasetNr].data[j];
			nr++;
		}
	}
	mean /= nr;

	return mean;
}

function varianz(params) {
	var data = params.data;
	var datasetNr = params.datasetNr;
	var meanVal = mean(params);
	var varianz = 0;
	var nr = 0;
	for (var j = 0; j < data.datasets[datasetNr].data.length; j++) {
		// important to check because missing values are possible
		if (data.datasets[datasetNr].data[j]) {
			varianz += Math.pow(data.datasets[datasetNr].data[j]-meanVal,2);
			nr++;
		}
	}
	return varianz/nr;
}

function stddev(params) {
	return Math.sqrt(varianz(params));
}

function cv(params) {
	return stddev(params)/mean(params);
}
