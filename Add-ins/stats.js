
function stats(data, config) {
	data.stats = {};
	if (typeof data.datasets == 'undefined') { // Pie structure;
		PSbasic(data);
	} else { // line structure;
		LSbasic(data);
		Linear_Regression(data);
	}
	replace_stats(data, config);
	return;
};

function isStat(val) {
	if (typeof val == "string") {
		if (val.indexOf("#") >= 0) return true;
	}
	return false;
};

function Linear_Regression(data) {
	// compute Means - source of algorithm : http://fr.wikipedia.org/wiki/R%C3%A9gression_lin%C3%A9aire
	data.stats.linear_regression_count_xPos = 0;
	data.stats.linear_regression_sum_xPos = 0;
	data.stats.linear_regression_sum_data = 0;
	for (var i = 0; i < data.datasets.length; i++) {
		if (!(typeof data.datasets[i].xPos == "undefined")) {
			data.datasets[i].stats.linear_regression_sum_xPos = 0;
			data.datasets[i].stats.linear_regression_sum_data = 0;
			data.datasets[i].stats.linear_regression_count_xPos = 0;
			data.datasets[i].stats.count_data = 0;
			for (var j = 0; j < data.datasets[i].data.length; j++) {
				if (!(typeof data.datasets[i].data[j] == "undefined") && !(typeof data.datasets[i].xPos[j] == "undefined")) {
					data.stats.linear_regression_count_xPos++;
					data.stats.linear_regression_sum_xPos += data.datasets[i].xPos[j];
					data.stats.linear_regression_sum_data += data.datasets[i].data[j];
					data.datasets[i].stats.linear_regression_count_xPos++;
					data.datasets[i].stats.linear_regression_sum_xPos += data.datasets[i].xPos[j];
					data.datasets[i].stats.linear_regression_sum_data += data.datasets[i].data[j];
				}
			}
			if (data.datasets[i].stats.linear_regression_count_xPos > 0) {
				data.datasets[i].stats.linear_regression_mean_xPos = data.datasets[i].stats.linear_regression_sum_xPos / data.datasets[i].stats.linear_regression_count_xPos;
				data.datasets[i].stats.linear_regression_mean_data = data.datasets[i].stats.linear_regression_sum_data / data.datasets[i].stats.linear_regression_count_xPos;
			}
		}
	}
	// mean;
	if (data.stats.linear_regression_count_xPos > 0) {
		data.stats.linear_regression_mean_xPos = data.stats.linear_regression_sum_xPos / data.stats.linear_regression_count_xPos;
		data.stats.linear_regression_mean_data = data.stats.linear_regression_sum_data / data.stats.linear_regression_count_xPos;
	}
	// Covariance - variance;
	data.stats.linear_regression_covariance = 0;
	data.stats.linear_regression_variance = 0;
	for (var i = 0; i < data.datasets.length; i++) {
		if (!(typeof data.datasets[i].xPos == "undefined")) {
			data.datasets[i].stats.linear_regression_covariance = 0;
			data.datasets[i].stats.linear_regression_variance = 0;
			for (var j = 0; j < data.datasets[i].data.length; j++) {
				if (!(typeof data.datasets[i].data[j] == "undefined") && !(typeof data.datasets[i].xPos[j] == "undefined")) {
					data.stats.linear_regression_covariance += (data.datasets[i].xPos[j] - data.stats.linear_regression_mean_xPos) * (data.datasets[i].data[j] - data.stats.linear_regression_mean_data);
					data.stats.linear_regression_variance += (data.datasets[i].xPos[j] - data.stats.linear_regression_mean_xPos) * (data.datasets[i].xPos[j] - data.stats.linear_regression_mean_xPos);
					data.datasets[i].stats.linear_regression_covariance += (data.datasets[i].xPos[j] - data.datasets[i].stats.linear_regression_mean_xPos) * (data.datasets[i].data[j] - data.datasets[i].stats.linear_regression_mean_data);
					data.datasets[i].stats.linear_regression_variance += (data.datasets[i].xPos[j] - data.datasets[i].stats.linear_regression_mean_xPos) * (data.datasets[i].xPos[j] - data.datasets[i].stats.linear_regression_mean_xPos);
				}
			}
			if (data.datasets[i].stats.linear_regression_count_xPos > 0) {
				data.datasets[i].stats.linear_regression_covariance /= data.datasets[i].stats.linear_regression_count_xPos;
				data.datasets[i].stats.linear_regression_variance /= data.datasets[i].stats.linear_regression_count_xPos;
				data.datasets[i].stats.linear_regression_b1 = data.datasets[i].stats.linear_regression_covariance / data.datasets[i].stats.linear_regression_variance;
				data.datasets[i].stats.linear_regression_b0 = data.datasets[i].stats.linear_regression_mean_data - data.datasets[i].stats.linear_regression_b1 * data.datasets[i].stats.linear_regression_mean_xPos;
			}
		}
	}
	// b1 - b0;
	if (data.stats.linear_regression_count_xPos > 0) {
		data.stats.linear_regression_covariance /= data.stats.linear_regression_count_xPos;
		data.stats.linear_regression_variance /= data.stats.linear_regression_count_xPos;
		data.stats.linear_regression_b1 = data.stats.linear_regression_covariance / data.stats.linear_regression_variance;
		data.stats.linear_regression_b0 = data.stats.linear_regression_mean_data - data.stats.linear_regression_b1 * data.stats.linear_regression_mean_xPos;
	}
}

function PSbasic(data) {
	data.stats.sum = 0;
	data.stats.count_all = 0;
	data.stats.count_missing = 0;
	data.stats.count_not_missing = 0;
	data.stats.mean = undefined;
	data.stats.sum_square_diff_mean = 0;
	data.stats.standard_deviation = undefined;
	data.stats.standard_deviation_estimation = undefined;
	data.stats.student_t_test = undefined;
	data.stats.coefficient_variation = undefined;
	data.stats.data_with_stats = false;
	for (var i = 0; i < data["length"]; i++) {
		if (!isStat(data[i].value)) {
			(data.stats.count_all) ++;
		} else data.stats.data_with_stats = true;
		if (typeof data[i].value == "undefined") {
			(data.stats.count_missing) ++;
		} else if (isStat(data[i].value)) {} else {
			(data.stats.count_not_missing) ++;
			(data.stats.sum) += 1 * data[i].value;
		}
	}
	if (data.stats.count_not_missing > 0) {
		data.stats.mean = data.stats.sum / data.stats.count_not_missing;
	}
	// sum of (val-mean)2;
	// sum of (val-mean)3;
	data.stats.sum_square_diff_mean = 0;
	data.stats.sum_pow3_diff_mean = 0;
	data.stats.sum_pow4_diff_mean = 0;
	for (var i = 0; i < data["length"]; i++) {
		if (typeof data[i].value != "undefined" && !isStat(data[i].value)) {
			data.stats.sum_square_diff_mean += Math.pow(data[i].value - data.stats.mean, 2);
			data.stats.sum_pow3_diff_mean += Math.pow(data[i].value - data.stats.mean, 3);
			data.stats.sum_pow4_diff_mean += Math.pow(data[i].value - data.stats.mean, 4);
		}
	}
	// standard deviation;
	if (data.stats.count_not_missing > 0) {
		data.stats.variance = data.stats.sum_square_diff_mean / data.stats.count_not_missing;
		data.stats.standard_deviation = Math.sqrt(data.stats.sum_square_diff_mean / data.stats.count_not_missing);
		data.stats.standard_error_mean = Math.sqrt(data.stats.sum_square_diff_mean) / data.stats.count_not_missing;
	}
	// standard deviation estimation;
	if (data.stats.count_not_missing > 1) {
		data.stats.standard_deviation_estimation = Math.sqrt(data.stats.sum_square_diff_mean / (data.stats.count_not_missing - 1));
		if (data.stats.mean > 0) data.stats.coefficient_variation = 100 * data.stats.standard_deviation_estimation / data.stats.mean;
		if (data.stats.standard_deviation_estimation > 0) data.stats.student_t_test = data.stats.mean / (data.stats.standard_deviation_estimation / Math.sqrt(data.stats.count_not_missing));
//		console.log(data.stats.mean);
//		console.log(data.stats.standard_deviation_estimation);
//		console.log(data.stats.count_not_missing);
	}
	// skewness;
	if (data.stats.count_not_missing > 2) {
		data.stats.skewness = (data.stats.count_not_missing * data.stats.sum_pow3_diff_mean) / (Math.pow(data.stats.standard_deviation_estimation, 3) * (data.stats.count_not_missing - 1) * (data.stats.count_not_missing - 2));
	} else {
		data.stats.skewness = undefined;
	}
	// kutosis;
	if (data.stats.count_not_missing > 3) {
		data.stats.kurtosis = (data.stats.count_not_missing * (data.stats.count_not_missing + 1) * data.stats.sum_pow4_diff_mean) / (Math.pow(data.stats.standard_deviation_estimation, 4) * (data.stats.count_not_missing - 1) * (data.stats.count_not_missing - 2) * (data.stats.count_not_missing - 3)) - 3 * (data.stats.count_not_missing - 1) * (data.stats.count_not_missing - 1) / ((data.stats.count_not_missing - 2) * (data.stats.count_not_missing - 3));
	} else {
		data.stats.kurtosis = undefined;
	}
	// ordering stats;
	var orderStat = new Array();
	cnt = 0;
	for (i = 0; i < data.length; i++) {
		if (typeof data[i].value != "undefined" && !isStat(data[i].value)) {
			orderStat[cnt] = {
				val: 1 * data[i].value,
				one: 1
			};
			cnt++;
		}
	}
	var setStat = new Array();
	setStat = Pstats(orderStat, "one");
	for (i = 0; i < setStat.length; i++) {
		data.stats.minimum = setStat[i].res.minimum;
		data.stats.minimumpi = setStat[i].res.minimumpi;
		data.stats.minimumpj = setStat[i].res.minimumpj;
		data.stats.maximum = setStat[i].res.maximum;
		data.stats.maximumpi = setStat[i].res.maximumpi;
		data.stats.maximumpj = setStat[i].res.maximumpj;
		data.stats.Q0 = setStat[i].res.Q0;
		data.stats.Q1 = setStat[i].res.Q1;
		data.stats.Q5 = setStat[i].res.Q5;
		data.stats.Q10 = setStat[i].res.Q10;
		data.stats.Q25 = setStat[i].res.Q25;
		data.stats.Q50 = setStat[i].res.Q50;
		data.stats.Q75 = setStat[i].res.Q75;
		data.stats.Q90 = setStat[i].res.Q90;
		data.stats.Q95 = setStat[i].res.Q95;
		data.stats.Q99 = setStat[i].res.Q99;
		data.stats.Q100 = setStat[i].res.Q100;
		data.stats.median = setStat[i].res.median;
		data.stats.interquartile_range = data.stats.Q75 - data.stats.Q25;
	}
};

function LSbasic(data) {
	data.stats.sum = 0;
	data.stats.count_all = 0;
	data.stats.count_missing = 0;
	data.stats.count_not_missing = 0;
	data.stats.mean = undefined;
	data.stats.sum_square_diff_mean = 0;
	data.stats.sum_pow3_diff_mean = 0;
	data.stats.sum_pow4_diff_mean = 0;
	data.stats.standard_deviation = undefined;
	data.stats.standard_deviation_estimation = undefined;
	data.stats.student_t_test = undefined;
	data.stats.coefficient_variation = undefined;
	data.stats.data_with_stats = false;
	data.stats.data_minimum = {};
	data.stats.data_maximum = {};
	data.stats.data_minimumpi = {};
	data.stats.data_maximumpi = {};
	data.stats.data_minimumpj = {};
	data.stats.data_maximumpj = {};
	data.stats.data_Q0 = {};
	data.stats.data_Q1 = {};
	data.stats.data_Q5 = {};
	data.stats.data_Q10 = {};
	data.stats.data_Q25 = {};
	data.stats.data_Q50 = {};
	data.stats.data_Q75 = {};
	data.stats.data_Q90 = {};
	data.stats.data_Q95 = {};
	data.stats.data_Q99 = {};
	data.stats.data_Q100 = {};
	data.stats.data_median = {};
	data.stats.data_sum = {};
	data.stats.data_count_all = {};
	data.stats.data_count_missing = {};
	data.stats.data_count_not_missing = {};
	data.stats.data_mean = {};
	data.stats.data_sum_square_diff_mean = {};
	data.stats.data_sum_pow3_diff_mean = {};
	data.stats.data_sum_pow4_diff_mean = {};
	data.stats.data_variance = {};
	data.stats.data_standard_deviation = {};
	data.stats.data_standard_error_mean = {};
	data.stats.data_standard_deviation_estimation = {};
	data.stats.data_student_t_test = {};
	data.stats.data_coefficient_variation = {};
	data.stats.data_skewness = {};
	data.stats.data_kurtosis = {};
	data.stats.data_interquartile_range = {};
	data.stats.max_number_data = 0;
	data.stats.min_number_data = Number.MAX_VALUE;
	for (var i = 0; i < data.datasets["length"]; i++) {
		data.datasets[i].stats = {};
		data.datasets[i].stats.sum = 0;
		data.datasets[i].stats.count_all = 0;
		data.datasets[i].stats.count_missing = 0;
		data.datasets[i].stats.count_not_missing = 0;
		data.datasets[i].stats.mean = undefined;
		data.datasets[i].stats.sum_square_diff_mean = 0;
		data.datasets[i].stats.sum_pow3_diff_mean = 0;
		data.datasets[i].stats.sum_pow4_diff_mean = 0;
		data.datasets[i].stats.standard_deviation = undefined;
		if (data.datasets[i].data["length"] > data.stats.max_number_data) {
			for (var k = data.stats.max_number_data; k < data.datasets[i].data["length"]; k++) {
				data.stats.data_sum[k] = 0;
				data.stats.data_count_all[k] = 0;
				data.stats.data_count_missing[k] = 0;
				data.stats.data_count_not_missing[k] = 0;
				data.stats.data_mean[k] = undefined;
				data.stats.data_sum_square_diff_mean[k] = 0;
				data.stats.data_sum_pow3_diff_mean[k] = 0;
				data.stats.data_sum_pow4_diff_mean[k] = 0;
				data.stats.data_standard_deviation[k] = undefined;
				data.stats.data_standard_deviation_estimation[k] = undefined;
				data.stats.data_student_t_test[k] = undefined;
				data.stats.data_coefficient_variation[k] = undefined;
			}
			data.stats.max_number_data = data.datasets[i].data["length"];
			data.stats.min_number_data = Math.min(data.stats.min_number_data, data.datasets[i].data["length"]);
		}
		for (var j = 0; j < data.datasets[i].data["length"]; j++) {
			if (!isStat(data.datasets[i].data[j])) {
				(data.stats.count_all) ++;
				(data.datasets[i].stats.count_all) ++;
				(data.stats.data_count_all[j]) ++;
			} else {
				data.stats.data_with_stats = true;
			}
			if (typeof data.datasets[i].data[j] == "undefined") {
				(data.stats.count_missing) ++;
				(data.datasets[i].stats.count_missing) ++;
				(data.stats.data_count_missing[j]) ++;
			} else if (isStat(data.datasets[i].data[j])) {} else {
				(data.stats.count_not_missing) ++;
				(data.datasets[i].stats.count_not_missing) ++;
				(data.stats.data_count_not_missing[j]) ++;
				(data.stats.sum) += 1 * data.datasets[i].data[j];
				(data.datasets[i].stats.sum) += 1 * data.datasets[i].data[j];
				(data.stats.data_sum[j]) += 1 * data.datasets[i].data[j];
			}
		}
		if (data.datasets[i].stats.count_not_missing == 0) {
			data.datasets[i].stats.minimum = undefined;
			data.datasets[i].stats.minimumpi = undefined;
			data.datasets[i].stats.minimumpj = undefined;
			data.datasets[i].stats.maximum = undefined;
			data.datasets[i].stats.maximumpi = undefined;
			data.datasets[i].stats.maximumpj = undefined;
			data.datasets[i].stats.sum = undefined;
			data.datasets[i].stats.mean = undefined;
		} else {
			data.datasets[i].stats.mean = data.datasets[i].stats.sum / data.datasets[i].stats.count_not_missing;
		}
	}
	if (data.stats.count_not_missing > 0) {
		data.stats.mean = data.stats.sum / data.stats.count_not_missing;
	}
	for (i = 0; i < data.stats.max_number_data; i++) {
		if (data.stats.data_count_not_missing[i] > 0) {
			data.stats.data_mean[i] = data.stats.data_sum[i] / data.stats.data_count_not_missing[i];
		}
	}
	// sum of (val-mean)2;
	data.stats.sum_square_diff_mean = 0;
	data.stats.sum_pow3_diff_mean = 0;
	data.stats.sum_pow4_diff_mean = 0;
	for (var i = 0; i < data.datasets["length"]; i++) {
		data.datasets[i].stats.sum_square_diff_mean = 0;
		data.datasets[i].stats.sum_pow3_diff_mean = 0;
		data.datasets[i].stats.sum_pow4_diff_mean = 0;
		for (var j = 0; j < data.datasets[i].data["length"]; j++) {
			if (typeof data.datasets[i].data[j] != "undefined" && !isStat(data.datasets[i].data[j].value)) {
				data.stats.sum_square_diff_mean += Math.pow(data.datasets[i].data[j] - data.stats.mean, 2);
				data.stats.sum_pow3_diff_mean += Math.pow(data.datasets[i].data[j] - data.stats.mean, 3);
				data.stats.sum_pow4_diff_mean += Math.pow(data.datasets[i].data[j] - data.stats.mean, 4);
				data.stats.data_sum_square_diff_mean[j] += Math.pow(data.datasets[i].data[j] - data.stats.data_mean[j], 2);
				data.stats.data_sum_pow3_diff_mean[j] += Math.pow(data.datasets[i].data[j] - data.stats.data_mean[j], 3);
				data.stats.data_sum_pow4_diff_mean[j] += Math.pow(data.datasets[i].data[j] - data.stats.data_mean[j], 4);
				data.datasets[i].stats.sum_square_diff_mean += Math.pow(data.datasets[i].data[j] - data.datasets[i].stats.mean, 2);
				data.datasets[i].stats.sum_pow3_diff_mean += Math.pow(data.datasets[i].data[j] - data.datasets[i].stats.mean, 3);
				data.datasets[i].stats.sum_pow4_diff_mean += Math.pow(data.datasets[i].data[j] - data.datasets[i].stats.mean, 4);
			}
		}
	}
	// standard deviation;
	if (data.stats.count_not_missing > 0) {
		data.stats.variance = data.stats.sum_square_diff_mean / data.stats.count_not_missing;
		data.stats.standard_deviation = Math.sqrt(data.stats.sum_square_diff_mean / data.stats.count_not_missing);
		data.stats.standard_error_mean = Math.sqrt(data.stats.sum_square_diff_mean) / data.stats.count_not_missing;
	}
	for (i = 0; i < data.datasets["length"]; i++) {
		if (data.datasets[i].stats.count_not_missing > 0) {
			data.datasets[i].stats.variance = data.datasets[i].stats.sum_square_diff_mean / data.datasets[i].stats.count_not_missing;
			data.datasets[i].stats.standard_deviation = Math.sqrt(data.datasets[i].stats.sum_square_diff_mean / data.datasets[i].stats.count_not_missing);
			data.datasets[i].stats.standard_error_mean = Math.sqrt(data.datasets[i].stats.sum_square_diff_mean) / data.datasets[i].stats.count_not_missing;
		}
	}
	for (j = 0; j < data.stats.max_number_data; j++) {
		if (data.stats.data_count_not_missing[j] > 0) {
			data.stats.data_variance[j] = data.stats.data_sum_square_diff_mean[j] / data.stats.data_count_not_missing[j];
			data.stats.data_standard_deviation[j] = Math.sqrt(data.stats.data_sum_square_diff_mean[j] / data.stats.data_count_not_missing[j]);
			data.stats.data_standard_error_mean[j] = Math.sqrt(data.stats.data_sum_square_diff_mean[j]) / data.stats.data_count_not_missing[j];
		}
	}
	// standard deviation estimation;
	if (data.stats.count_not_missing > 1) {
		data.stats.standard_deviation_estimation = Math.sqrt(data.stats.sum_square_diff_mean / (data.stats.count_not_missing - 1));
		if (data.stats.mean > 0) data.stats.coefficient_variation = 100 * data.stats.standard_deviation_estimation / data.stats.mean;
		if (data.stats.standard_deviation_estimation > 0) data.stats.student_t_test = data.stats.mean / (data.stats.standard_deviation_estimation / Math.sqrt(data.stats.count_not_missing));
	}
	for (i = 0; i < data.datasets["length"]; i++) {
		if (data.datasets[i].stats.count_not_missing > 1) {
			data.datasets[i].stats.standard_deviation_estimation = Math.sqrt(data.datasets[i].stats.sum_square_diff_mean / (data.datasets[i].stats.count_not_missing - 1));
			if (data.datasets[i].stats.mean > 0) data.datasets[i].stats.coefficient_variation = 100 * data.datasets[i].stats.standard_deviation_estimation / data.datasets[i].stats.mean;
			if (data.datasets[i].stats.standard_deviation_estimation > 0) data.datasets[i].stats.student_t_test = data.datasets[i].stats.mean / (data.datasets[i].stats.standard_deviation_estimation / Math.sqrt(data.datasets[i].stats.count_not_missing));
		}
	}
	for (j = 0; j < data.stats.max_number_data; j++) {
		if (data.stats.data_count_not_missing[j] > 1) {
			data.stats.data_standard_deviation_estimation[j] = Math.sqrt(data.stats.data_sum_square_diff_mean[j] / (data.stats.data_count_not_missing[j] - 1));
			if (data.stats.data_mean[j] > 0) data.stats.data_coefficient_variation[j] = 100 * data.stats.data_standard_deviation_estimation[j] / data.stats.data_mean[j];
			if (data.stats.data_standard_deviation_estimation[j] > 0) data.stats.data_student_t_test[j] = data.stats.data_mean[j] / (data.stats.data_standard_deviation_estimation[j] / Math.sqrt(data.stats.data_count_not_missing[j]));
		}
	}
	// skewness;
	if (data.stats.count_not_missing >= 2) {
		data.stats.skewness = (data.stats.count_not_missing * data.stats.sum_pow3_diff_mean) / (Math.pow(data.stats.standard_deviation_estimation, 3) * (data.stats.count_not_missing - 1) * (data.stats.count_not_missing - 2));
	} else {
		data.stats.skewness = undefined;
	}
	// kurtosis;
	if (data.stats.count_not_missing >= 3) {
		data.stats.kurtosis = (data.stats.count_not_missing * (data.stats.count_not_missing + 1) * data.stats.sum_pow4_diff_mean) / (Math.pow(data.stats.standard_deviation_estimation, 4) * (data.stats.count_not_missing - 1) * (data.stats.count_not_missing - 2) * (data.stats.count_not_missing - 3)) - 3 * (data.stats.count_not_missing - 1) * (data.stats.count_not_missing - 1) / ((data.stats.count_not_missing - 2) * (data.stats.count_not_missing - 3));
	} else {
		data.stats.kurtosis = undefined;
	}
	for (i = 0; i < data.datasets["length"]; i++) {
		if (data.datasets[i].stats.count_not_missing >= 2) {
			data.datasets[i].stats.skewness = (data.datasets[i].stats.count_not_missing * data.datasets[i].stats.sum_pow3_diff_mean) / (Math.pow(data.datasets[i].stats.standard_deviation_estimation, 3) * (data.datasets[i].stats.count_not_missing - 1) * (data.datasets[i].stats.count_not_missing - 2));
		} else {
			data.datasets[i].stats.skewness = undefined;
		}
		if (data.datasets[i].stats.count_not_missing >= 3) {
			data.datasets[i].stats.kurtosis = (data.datasets[i].stats.count_not_missing * (data.datasets[i].stats.count_not_missing + 1) * data.datasets[i].stats.sum_pow4_diff_mean) / (Math.pow(data.datasets[i].stats.standard_deviation_estimation, 4) * (data.datasets[i].stats.count_not_missing - 1) * (data.datasets[i].stats.count_not_missing - 2) * (data.datasets[i].stats.count_not_missing - 3)) - 3 * (data.datasets[i].stats.count_not_missing - 1) * (data.datasets[i].stats.count_not_missing - 1) / ((data.datasets[i].stats.count_not_missing - 2) * (data.datasets[i].stats.count_not_missing - 3));
		} else {
			data.datasets[i].stats.kurtosis = undefined;
		}
	}
	for (j = 0; j < data.stats.max_number_data; j++) {
		if (data.stats.data_count_not_missing[j] >= 2) {
			data.stats.data_skewness[j] = (data.stats.data_count_not_missing[j] * data.stats.data_sum_pow3_diff_mean[j]) / (Math.pow(data.stats.data_standard_deviation_estimation[j], 3) * (data.stats.data_count_not_missing[j] - 1) * (data.stats.data_count_not_missing[j] - 2));
		} else {
			data.stats.data_skewness[j] = undefined;
		}
		if (data.stats.data_count_not_missing[j] >= 3) {
			data.stats.data_kurtosis[j] = (data.stats.data_count_not_missing[j] * (data.stats.data_count_not_missing[j] + 1) * data.stats.data_sum_pow4_diff_mean[j]) / (Math.pow(data.stats.data_standard_deviation_estimation[j], 4) * (data.stats.data_count_not_missing[j] - 1) * (data.stats.data_count_not_missing[j] - 2) * (data.stats.data_count_not_missing[j] - 3)) - 3 * (data.stats.data_count_not_missing[j] - 1) * (data.stats.data_count_not_missing[j] - 1) / ((data.stats.data_count_not_missing[j] - 2) * (data.stats.data_count_not_missing[j] - 3));
		} else {
			data.stats.data_kurtosis[j] = undefined;
		}
	}
	// ordering stats;
	var orderStat = new Array();
	cnt = 0;
	for (i = 0; i < data.datasets["length"]; i++) {
		for (j = 0; j < data.datasets[i].data["length"]; j++) {
			if (typeof data.datasets[i].data[j] != "undefined" && !isStat(data.datasets[i].data[j].value)) {
				orderStat[cnt] = {
					val: 1 * data.datasets[i].data[j],
					dataset: i,
					col: j,
					one: 1
				};
				cnt++;
			}
		}
	}
	var setStat = new Array();
	setStat = Pstats(orderStat, "one");
	for (i = 0; i < setStat.length; i++) {
		data.stats.minimum = setStat[i].res.minimum;
		data.stats.minimumpi = setStat[i].res.minimumpi;
		data.stats.minimumpj = setStat[i].res.minimumpj;
		data.stats.maximum = setStat[i].res.maximum;
		data.stats.maximumpi = setStat[i].res.maximumpi;
		data.stats.maximumpj = setStat[i].res.maximumpj;
		data.stats.Q0 = setStat[i].res.Q0;
		data.stats.Q1 = setStat[i].res.Q1;
		data.stats.Q5 = setStat[i].res.Q5;
		data.stats.Q10 = setStat[i].res.Q10;
		data.stats.Q25 = setStat[i].res.Q25;
		data.stats.Q50 = setStat[i].res.Q50;
		data.stats.Q75 = setStat[i].res.Q75;
		data.stats.Q90 = setStat[i].res.Q90;
		data.stats.Q95 = setStat[i].res.Q95;
		data.stats.Q99 = setStat[i].res.Q99;
		data.stats.Q100 = setStat[i].res.Q100;
		data.stats.median = setStat[i].res.median;
		data.stats.interquartile_range = data.stats.Q75 - data.stats.Q25;
	}
	setStat = Pstats(orderStat, "dataset");
	for (i = 0; i < setStat.length; i++) {
		data.datasets[setStat[i].secvalue].stats.minimum = setStat[i].res.minimum;
		data.datasets[setStat[i].secvalue].stats.minimumpi = setStat[i].res.minimumpi;
		data.datasets[setStat[i].secvalue].stats.minimumpj = setStat[i].res.minimumpj;
		data.datasets[setStat[i].secvalue].stats.maximum = setStat[i].res.maximum;
		data.datasets[setStat[i].secvalue].stats.maximumpi = setStat[i].res.maximumpi;
		data.datasets[setStat[i].secvalue].stats.maximumpj = setStat[i].res.maximumpj;
		data.datasets[setStat[i].secvalue].stats.Q0 = setStat[i].res.Q0;
		data.datasets[setStat[i].secvalue].stats.Q1 = setStat[i].res.Q1;
		data.datasets[setStat[i].secvalue].stats.Q5 = setStat[i].res.Q5;
		data.datasets[setStat[i].secvalue].stats.Q10 = setStat[i].res.Q10;
		data.datasets[setStat[i].secvalue].stats.Q25 = setStat[i].res.Q25;
		data.datasets[setStat[i].secvalue].stats.Q50 = setStat[i].res.Q50;
		data.datasets[setStat[i].secvalue].stats.Q75 = setStat[i].res.Q75;
		data.datasets[setStat[i].secvalue].stats.Q90 = setStat[i].res.Q90;
		data.datasets[setStat[i].secvalue].stats.Q95 = setStat[i].res.Q95;
		data.datasets[setStat[i].secvalue].stats.Q99 = setStat[i].res.Q99;
		data.datasets[setStat[i].secvalue].stats.Q100 = setStat[i].res.Q100;
		data.datasets[setStat[i].secvalue].stats.median = setStat[i].res.median;
		data.datasets[setStat[i].secvalue].stats.interquartile_range = data.datasets[setStat[i].secvalue].stats.Q75 - data.datasets[setStat[i].secvalue].stats.Q25;
	}
	setStat = Pstats(orderStat, "col");
	for (i = 0; i < setStat.length; i++) {
		data.stats.data_minimum[setStat[i].secvalue] = setStat[i].res.minimum;
		data.stats.data_minimumpi[setStat[i].secvalue] = setStat[i].res.minimumpi;
		data.stats.data_minimumpj[setStat[i].secvalue] = setStat[i].res.minimumpj;
		data.stats.data_maximum[setStat[i].secvalue] = setStat[i].res.maximum;
		data.stats.data_maximumpi[setStat[i].secvalue] = setStat[i].res.maximumpi;
		data.stats.data_maximumpj[setStat[i].secvalue] = setStat[i].res.maximumpj;
		data.stats.data_Q0[setStat[i].secvalue] = setStat[i].res.Q0;
		data.stats.data_Q1[setStat[i].secvalue] = setStat[i].res.Q1;
		data.stats.data_Q5[setStat[i].secvalue] = setStat[i].res.Q5;
		data.stats.data_Q10[setStat[i].secvalue] = setStat[i].res.Q10;
		data.stats.data_Q25[setStat[i].secvalue] = setStat[i].res.Q25;
		data.stats.data_Q50[setStat[i].secvalue] = setStat[i].res.Q50;
		data.stats.data_Q75[setStat[i].secvalue] = setStat[i].res.Q75;
		data.stats.data_Q90[setStat[i].secvalue] = setStat[i].res.Q90;
		data.stats.data_Q95[setStat[i].secvalue] = setStat[i].res.Q95;
		data.stats.data_Q99[setStat[i].secvalue] = setStat[i].res.Q99;
		data.stats.data_Q100[setStat[i].secvalue] = setStat[i].res.Q100;
		data.stats.data_median[setStat[i].secvalue] = setStat[i].res.median;
		data.stats.data_interquartile_range[setStat[i].secvalue] = data.stats.data_Q75[setStat[i].secvalue] - data.stats.data_Q25[setStat[i].secvalue];
	}
};

function Pstats(orderStat, secVar) {
	var result = new Array();
	orderStat.sort(function(a, b) {
		if (a[secVar] < b[secVar]) return -1
		else if (a[secVar] > b[secVar]) return 1
		if (a.val < b.val) return -1
		else if (a.val > b.val) return 1
		else return 0
	});
	var deb = 0,
		fin = 0;
	for (i = 1; i < orderStat.length; i++) {
		if (orderStat[i][secVar] == orderStat[deb][secVar]) fin++;
		else {
			result[result.length] = {
				secvalue: orderStat[deb][secVar],
				res: P2stats(deb, fin, orderStat)
			};
			fin++;
			deb = fin;
		}
	}
	result[result.length] = {
		secvalue: orderStat[deb][secVar],
		res: P2stats(deb, fin, orderStat)
	};
	return result;
};

function P2stats(deb, fin, orderStat) {
	return {
		minimum: orderStat[deb].val,
		minimumpi : orderStat[deb].dataset,
		minimumpj : orderStat[deb].col,
		maximum: orderStat[fin].val,
		maximumpi : orderStat[fin].dataset,
		maximumpj : orderStat[fin].col,
		Q0: orderStat[deb].val,
		Q1: Quantile(1, deb, fin, orderStat),
		Q5: Quantile(5, deb, fin, orderStat),
		Q10: Quantile(10, deb, fin, orderStat),
		Q25: Quantile(25, deb, fin, orderStat),
		Q50: Quantile(50, deb, fin, orderStat),
		Q75: Quantile(75, deb, fin, orderStat),
		Q90: Quantile(90, deb, fin, orderStat),
		Q95: Quantile(95, deb, fin, orderStat),
		Q99: Quantile(99, deb, fin, orderStat),
		Q100: orderStat[fin].val,
		median: Quantile(50, deb, fin, orderStat)
	}
};

function Quantile(quant, deb, fin, orderStat) {
	var nbobs = fin - deb + 1;
	if (quant <= 50.01) {
		var v1 = Math.ceil((nbobs * quant / 100) - 0.000001) - 1;
		var v2 = Math.ceil(((nbobs + 1) * quant / 100) - 0.000001) - 1;
	} else {
		var v1 = Math.ceil((nbobs * (100 - quant) / 100) - 0.000001) - 1;
		v1 = nbobs - v1 - 1;
		var v2 = Math.ceil(((nbobs + 1) * (100 - quant) / 100) - 0.000001) - 1;
		v2 = nbobs - v2 - 1;
	}
	//  if(deb+v2>fin)v2=fin-deb-1;
	return ((orderStat[deb + v1].val + orderStat[deb + v2].val) / 2);
};

function disp_stats(data) {
	document.write("data.stats.count_all=" + data.stats.count_all + "<BR>");
	document.write("data.stats.count_missing=" + data.stats.count_missing + "<BR>");
	document.write("data.stats.count_not_missing=" + data.stats.count_not_missing + "<BR>");
	document.write("data.stats.minimum=" + data.stats.minimum + "<BR>");
	document.write("data.stats.minimumpi=" + data.stats.minimumpi + "<BR>");
	document.write("data.stats.minimumpj=" + data.stats.minimumpj + "<BR>");
	document.write("data.stats.maximum=" + data.stats.maximum + "<BR>");
	document.write("data.stats.maximumpi=" + data.stats.maximumpi + "<BR>");
	document.write("data.stats.maximumpj=" + data.stats.maximumpj + "<BR>");
	document.write("data.stats.sum=" + data.stats.sum + "<BR>");
	document.write("data.stats.mean=" + data.stats.mean + "<BR>");
	document.write("data.stats.sum_square_diff_mean=" + data.stats.sum_square_diff_mean + "<BR>");
	document.write("data.stats.variance=" + data.stats.variance + "<BR>");
	document.write("data.stats.standard _deviation=" + data.stats.standard_deviation + "<BR>");
	document.write("data.stats.standard_error_mean=" + data.stats.standard_error_mean + "<BR>");
	document.write("data.stats.standard_deviation_estimation=" + data.stats.standard_deviation_estimation + "<BR>");
	document.write("data.stats.coefficient_variation=" + data.stats.coefficient_variation + "<BR>");
	document.write("data.stats.skewness=" + data.stats.skewness + "<BR>");
	document.write("data.stats.kurtosis=" + data.stats.kurtosis + "<BR>");
	document.write("data.stats.student_t_test=" + data.stats.student_t_test + "<BR>");
	document.write("data.stats.Q0" + data.stats.Q0 + "<BR>");
	document.write("data.stats.Q1=" + data.stats.Q1 + "<BR>");
	document.write("data.stats.Q5=" + data.stats.Q5 + "<BR>");
	document.write("data.stats.Q10=" + data.stats.Q10 + "<BR>");
	document.write("data.stats.Q25=" + data.stats.Q25 + "<BR>");
	document.write("data.stats.Q50=" + data.stats.Q50 + "<BR>");
	document.write("data.stats.Q75=" + data.stats.Q75 + "<BR>");
	document.write("data.stats.Q90=" + data.stats.Q90 + "<BR>");
	document.write("data.stats.Q95=" + data.stats.Q95 + "<BR>");
	document.write("data.stats.Q99=" + data.stats.Q99 + "<BR>");
	document.write("data.stats.Q100=" + data.stats.Q100 + "<BR>");
	document.write("data.stats.median=" + data.stats.median + "<BR>");
	document.write("data.stats.interquartile_range=" + data.stats.interquartile_range + "<BR>");
	document.write("<hr>")
	if (typeof data.datasets != 'undefined') {
		for (i = 0; i < data.datasets.length; i++) {
			document.write("<hr>")
			document.write("DATASET: " + i + "<BR>");
			document.write("data.datasets[" + i + "].stats.count_all=" + data.datasets[i].stats.count_all + "<BR>");
			document.write("data.datasets[" + i + "].stats.count_missing=" + data.datasets[i].stats.count_missing + "<BR>");
			document.write("data.datasets[" + i + "].stats.count_not_missing=" + data.datasets[i].stats.count_not_missing + "<BR>");
			document.write("data.datasets[" + i + "].stats.minimum=" + data.datasets[i].stats.minimum + "<BR>");
			document.write("data.datasets[" + i + "].stats.minimumpi=" + data.datasets[i].stats.minimumpi + "<BR>");
			document.write("data.datasets[" + i + "].stats.minimumpj=" + data.datasets[i].stats.minimumpj + "<BR>");
			document.write("data.datasets[" + i + "].stats.maximum=" + data.datasets[i].stats.maximum + "<BR>");
			document.write("data.datasets[" + i + "].stats.maximumpi=" + data.datasets[i].stats.maximumpi + "<BR>");
			document.write("data.datasets[" + i + "].stats.maximumpj=" + data.datasets[i].stats.maximumpj + "<BR>");
			document.write("data.datasets[" + i + "].stats.sum=" + data.datasets[i].stats.sum + "<BR>");
			document.write("data.datasets[" + i + "].stats.mean=" + data.datasets[i].stats.mean + "<BR>");
			document.write("data.datasets[" + i + "].stats.sum_square_diff_mean=" + data.datasets[i].stats.sum_square_diff_mean + "<BR>");
			document.write("data.datasets[" + i + "].stats.variance=" + data.datasets[i].stats.variance + "<BR>");
			document.write("data.datasets[" + i + "].stats.standard_deviation=" + data.datasets[i].stats.standard_deviation + "<BR>");
			document.write("data.datasets[" + i + "].stats.standard_error_mean=" + data.datasets[i].stats.standard_error_mean + "<BR>");
			document.write("data.datasets[" + i + "].stats.standard_deviation_estimation=" + data.datasets[i].stats.standard_deviation_estimation + "<BR>");
			document.write("data.datasets[" + i + "].stats.student_t_test=" + data.datasets[i].stats.student_t_test + "<BR>");
			document.write("data.datasets[" + i + "].stats.coefficient_variation=" + data.datasets[i].stats.coefficient_variation + "<BR>");
			document.write("data.datasets[" + i + "]stats.skewness=" + data.datasets[i].stats.skewness + "<BR>");
			document.write("data.datasets[" + i + "]stats.kurtosis=" + data.datasets[i].stats.kurtosis + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q0=" + data.datasets[i].stats.Q0 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q1=" + data.datasets[i].stats.Q1 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q5=" + data.datasets[i].stats.Q5 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q10=" + data.datasets[i].stats.Q10 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q25=" + data.datasets[i].stats.Q25 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q50=" + data.datasets[i].stats.Q50 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q75=" + data.datasets[i].stats.Q75 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q90=" + data.datasets[i].stats.Q90 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q95=" + data.datasets[i].stats.Q95 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q99=" + data.datasets[i].stats.Q99 + "<BR>");
			document.write("data.datasets[" + i + "].stats.Q100=" + data.datasets[i].stats.Q100 + "<BR>");
			document.write("data.datasets[" + i + "].stats.median=" + data.datasets[i].stats.median + "<BR>");
			document.write("data.datasets[" + i + "].stats.interquartile_range=" + data.datasets[i].stats.interquartile_range + "<BR>");
		}
		document.write("<hr>")
		for (i = 0; i < data.stats.max_number_data; i++) {
			document.write("<hr>")
			document.write("Data: " + i + "<BR>");
			document.write("data.stats.data_count_all[" + i + "]=" + data.stats.data_count_all[i] + "<BR>");
			document.write("data.stats.data_count_missing[" + i + "]=" + data.stats.data_count_missing[i] + "<BR>");
			document.write("data.stats.data_count_not_missing[" + i + "]=" + data.stats.data_count_not_missing[i] + "<BR>");
			document.write("data.stats.data_minimum[" + i + "]=" + data.stats.data_minimum[i] + "<BR>");
			document.write("data.stats.data_minimumpi[" + i + "]=" + data.stats.data_minimumpi[i] + "<BR>");
			document.write("data.stats.data_minimumpj[" + i + "]=" + data.stats.data_minimumpj[i] + "<BR>");
			document.write("data.stats.data_maximum[" + i + "]=" + data.stats.data_maximum[i] + "<BR>");
			document.write("data.stats.data_maximumpi[" + i + "]=" + data.stats.data_maximumpi[i] + "<BR>");
			document.write("data.stats.data_maximumpj[" + i + "]=" + data.stats.data_maximumpj[i] + "<BR>");
			document.write("data.stats.data_sum[" + i + "]=" + data.stats.data_sum[i] + "<BR>");
			document.write("data.stats.data_mean[" + i + "]=" + data.stats.data_mean[i] + "<BR>");
			document.write("data.stats.data_sum_square_diff_mean[" + i + "]=" + data.stats.data_sum_square_diff_mean[i] + "<BR>");
			document.write("data.stats.data_variance[" + i + "]=" + data.stats.data_variance[i] + "<BR>");
			document.write("data.stats.data_standard_deviation[" + i + "]=" + data.stats.data_standard_deviation[i] + "<BR>");
			document.write("data.stats.data_standard_error_mean[" + i + "]=" + data.stats.data_standard_error_mean[i] + "<BR>");
			document.write("data.stats.data_standard_deviation_estimation[" + i + "]=" + data.stats.data_standard_deviation_estimation[i] + "<BR>");
			document.write("data.stats.data_student_t_test[" + i + "]=" + data.stats.data_student_t_test[i] + "<BR>");
			document.write("data.stats.data_coefficient_variation[" + i + "]=" + data.stats.data_coefficient_variation[i] + "<BR>");
			document.write("data.stats.data_skewness[" + i + "]=" + data.stats.data_skewness[i] + "<BR>");
			document.write("data.stats.data_kurtosis[" + i + "]=" + data.stats.data_kurtosis[i] + "<BR>");
			document.write("data.stats.data_Q0[" + i + "]=" + data.stats.data_Q0[i] + "<BR>");
			document.write("data.stats.data_Q1[" + i + "]=" + data.stats.data_Q1[i] + "<BR>");
			document.write("data.stats.data_Q5[" + i + "]=" + data.stats.data_Q5[i] + "<BR>");
			document.write("data.stats.data_Q10[" + i + "]=" + data.stats.data_Q10[i] + "<BR>");
			document.write("data.stats.data_Q25[" + i + "]=" + data.stats.data_Q25[i] + "<BR>");
			document.write("data.stats.data_Q50[" + i + "]=" + data.stats.data_Q50[i] + "<BR>");
			document.write("data.stats.data_Q75[" + i + "]=" + data.stats.data_Q75[i] + "<BR>");
			document.write("data.stats.data_Q90[" + i + "]=" + data.stats.data_Q90[i] + "<BR>");
			document.write("data.stats.data_Q95[" + i + "]=" + data.stats.data_Q95[i] + "<BR>");
			document.write("data.stats.data_Q99[" + i + "]=" + data.stats.data_Q99[i] + "<BR>");
			document.write("data.stats.data_Q100[" + i + "]=" + data.stats.data_Q100[i] + "<BR>");
			document.write("data.stats.data_median[" + i + "]=" + data.stats.data_median[i] + "<BR>");
			document.write("data.stats.data_interquartile_range[" + i + "]=" + data.stats.data_interquartile_range[i] + "<BR>");
		}
	}
};

function replace_stats(data, config) {
	// replace in the data
	var i,j;
	if (data.stats.data_with_stats) {
		if (typeof data.datasets == 'undefined') { // Pie structure;
			for (i = 0; i < data.length; i++) {
				if (isStat(data[i].value)) data[i].value = replace_Stats_In(data[i].value, data, -1, -1);
				// templates ?
				if (isTemplate(data[i].value)) {
					data[i].value = tmplStat(data[i].value, {
						V1: 1
					});
				}
			}
		} else { // line structure;
			for (i = 0; i < data.datasets["length"]; i++) {
				for (j = 0; j < data.datasets[i].data["length"]; j++) {
					if (isStat(data.datasets[i].data[j])) {
						data.datasets[i].data[j] = replace_Stats_In(data.datasets[i].data[j], data, i, j);
					}
					// templates ?
					if (isTemplate(data.datasets[i].data[j])) {
						data.datasets[i].data[j] = tmplStat(data.datasets[i].data[j], {
							V1: 1
						});
					}
				}
			}
		}
	}
	// replace in other part of the data (titles)
	if (typeof data.datasets == 'undefined') { // Pie structure;
		for (i = 0; i < data.length; i++) {
			if (isStat(data[i].title)) data[i].title = replace_Stats_In(data[i].title, data, -1, -1);
			// templates ?
			if (isTemplate(data[i].title)) {
				data[i].title = tmplStat(data[i].title, {
					V1: 1
				});
			}
		}
	} else { // line structure;
		for (var i = 0; i < data.datasets["length"]; i++) {
			if (isStat(data.datasets[i].title)) {
				data.datasets[i].title = replace_Stats_In(data.datasets[i].title, data, i, -1);
			}
			// templates ?
			if (isTemplate(data.datasets[i].title)) {
				data.datasets[i].title = tmplStat(data.datasets[i].title, {
					V1: 1
				});
			}
		}
	}
	// replace in shapesInChart;
	if (typeof data.datasets == 'undefined') { // Pie structure;
		if (typeof data[0].shapesInChart == "object") {
			for(i=0;i<data[0].shapesInChart.length;i++) {
				replace_in_object(data[0].shapesInChart[i], data);
			}
		}
	} else { // Line structure;
		if(typeof data.shapesInChart == "object") {
			for(i=0;i<data.shapesInChart.length;i++) {
				replace_in_object(data.shapesInChart[i], data);
			}
		} 

	}	
	// replace in options;
	replace_in_object(config, data);
};

function replace_in_object(obj, data) {
	for (var attrname in obj) {
		if (typeof obj[attrname] == "object") {
			replace_in_object(obj[attrname], data);
		} else if (isStat(obj[attrname])) {
			obj[attrname] = replace_Stats_In(obj[attrname], data, -1, -1);
			// templates if not a template option....
			if (!(attrname == "annotateLabel" || attrname == "inGraphDataTmpl" || attrname == "scaleLabel")) {
				if (isTemplate(obj[attrname])) {
					obj[attrname] = tmplStat(obj[attrname], {
						V1: 1
					});
				}
			}
		}
	}
};

function tmplStat(str, data) {
	// Figure out if we're getting a template, or if we need to
	// load the template - and be sure to cache the result.
	var fn = !/\W/.test(str) ?
		cachebis[str] = cachebis[str] ||
		tmplbis(document.getElementById(str).innerHTML) :
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
			.split("\r").join("\\'") + "');}return p.join('');");
	// Provide some basic currying to the user
	return data ? fn(data) : fn;
};

function isTemplate(strvar) {
	if (typeof strvar == "string") {
		if (strvar.indexOf("<%") >= 0) {
			if (strvar.indexOf(">", strvar.indexOf("%>")) > 0) {
				return true;
			}
		}
	}
	return false;
};

function replace_Stats_In(strval, data, dataset, coldata) {
	var resval = "";
	var start = 0;
	var prevstat = true;
	while (strval.indexOf("#", start) >= 0) {
		// strval.substring(start,)           ;
		if (!prevstat) {
			var statOf = convertStat(strval.substring(start, strval.indexOf("#", start)), data, dataset, coldata);
			if (statOf.found) {
				resval = resval + statOf.resval;
				start = strval.indexOf("#", start) + 1;
				prevstat = true;
			} else {
				resval = resval + "#" + statOf.resval;
				start = strval.indexOf("#", start) + 1;
			}
		} else {
			if (start > 0) resval = resval;
			resval = resval + strval.substring(start, strval.indexOf("#", start));
			start = strval.indexOf("#", start) + 1;
			prevstat = false;
		}
	}
	if (!prevstat) resval = resval + "#";
	resval = resval + strval.substring(start, strval.length);
	return resval;
};

function convertStat(statval, data, dataset, coldata) {
	var resval = statval;
	var found = false;
	if (typeof data.stats[statval.toLowerCase()] != "undefined" && typeof data.stats[statval.toLowerCase()] != "object") {
		resval = data.stats[statval.toLowerCase()];
		found = true;
	} else if (statval.toLowerCase().substring(0, 3) == "ds_") {
		stat = statval.toLowerCase().substring(3);
		if (stat.indexOf("(") > 0) {
			var vdataset = stat.substring(stat.indexOf("(") + 1);
			vdataset = 1 * vdataset.substring(0, vdataset.indexOf(")"));
			var stat = stat.substring(0, stat.indexOf("("));
		} else {
			vdataset = Math.max(1 * dataset, 0);
		}
		if (typeof data.datasets == "object") {
			if (typeof data.datasets[vdataset] == "object") {
				if (typeof data.datasets[vdataset].stats == "object") {
					if (typeof data.datasets[vdataset].stats[stat] == "number") {
						resval = data.datasets[vdataset].stats[stat];
						found = true;
					}
				}
			}
		}
	} else if (statval.toLowerCase().substring(0, 5) == "data_") {
		stat = statval.toLowerCase().substring(5);
		if (stat.indexOf("(") > 0) {
			vdataset = stat.substring(stat.indexOf("(") + 1);
			vdataset = 1 * vdataset.substring(0, vdataset.indexOf(")"));
			stat = stat.substring(0, stat.indexOf("("));
		} else {
			vdataset = Math.max(1 * coldata, 0);
		}
		if (typeof data.datasets == "object") {
			if (typeof data.stats["data_" + stat] == "object") {
				if (typeof data.stats["data_" + stat][vdataset] == "number") {
					resval = data.stats["data_" + stat][vdataset];
					found = true;
				}
			}
		}
	} else if (statval.toLowerCase().substring(0, 9) == "variable_") {
		resval = eval(statval.toLowerCase().substring(9));
		found=true;
	}
	return {
		found: found,
		resval: resval
	};
};
